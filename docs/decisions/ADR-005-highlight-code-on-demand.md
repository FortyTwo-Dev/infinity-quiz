# ADR-005 - Highlight code blocks on demand with Shiki

## Status

Accepted

## Context

### Problem encountered

A question context can carry a code sample (ADR-004). It renders in a `<pre>`
with the theme's surface and border, one colour for everything: a language
question is readable, but the keywords, strings and comments are not
distinguishable.

### Constraints

- The application is local-first and works offline; nothing may be fetched at
  runtime. The service worker precaches the build.
- The initial bundle stays small: the Markdown pipeline already costs 26.8 kB
  gzip.
- No second colour vocabulary: ADR-002 binds all colours to the theme tokens,
  in both modes.
- Highlighting parses untrusted content (an imported quiz). It must not open an
  XSS surface nor a remote request.
- The code text must not shift the layout when its colours arrive.
- The project has no backend: no server-side highlighting.

### Objectives

1. Colour the code, in light and dark, with the application palette.
2. Keep Shiki out of the initial bundle, and load only the languages a quiz uses.
3. Keep the sanitizer strict: no `style`, no `class` allowed through.
4. Leave adding a language later to one import and one alias.

## Decision

### Library

`shiki@4.6.0` with the fine-grained bundle, the JavaScript RegExp engine
(`createJavaScriptRegexEngine`), and one dynamic import per grammar from
`@shikijs/langs@4.6.0`:

```ts
createHighlighterCore({ themes: [CODE_THEME], langs: [], engine: createJavaScriptRegexEngine() })
```

- The engine avoids the Oniguruma `.wasm` asset: no extra precache entry, and
  no WASM in the offline cache. The JavaScript engine supports every language we
  ship (Shiki's own compatibility table).
- Neither the engine, the theme, nor a grammar is imported statically. The
  highlighter is created on the first code block, and a grammar chunk is fetched
  the first time a fence names it. A language already loaded is reused.
- The languages: JavaScript, TypeScript, JSX, TSX, JSON, HTML, CSS, Bash, Python,
  Java, with the usual fence aliases (`js`, `ts`, `py`, `sh`, `shell`, `zsh`,
  `htm`). An unknown fence leaves the block plain.
- **Adding a language** is one dynamic import in the loader table and, for the
  aliases, one line. It stays its own chunk, loaded only when a quiz uses it.

### Pipeline

1. `marked` renders a fence as `<pre><code data-lang="js">escaped code</code></pre>`.
   The language travels as `data-lang`; the code is escaped.
2. DOMPurify sanitizes the whole Markdown, with `data-lang` in its allowlist.
   No `style`, no `class`, no image.
3. `MarkdownContent` finds the `code[data-lang]` blocks after the render and asks
   `highlightCode` for their spans. The result is injected **after** the
   sanitization, into the already-rendered `<code>`.
4. `highlightCode` builds the spans itself from Shiki's tokens: the content is
   escaped, the colour is the one our theme returned. The output is generated
   from escaped text and a build-time theme, so it does not go through DOMPurify;
   the sanitizer still owns everything the author wrote.

The pass is asynchronous. The plain code is on screen immediately; the colours
arrive when the engine and the grammar are ready. Measured on the production
build, the `<pre>` height is identical before and after (101.67 px at 1280×800):
same text, same lines, no layout shift. A failure to load Shiki or the grammar
leaves the plain code, silently.

### Theme

One `ThemeRegistrationRaw` in `src/constants/code-theme.ts`, whose colours are
CSS variables:

```ts
{ scope: ['keyword', 'storage.type'], settings: { foreground: 'var(--iq-code-keyword)' } }
```

`src/css/brand.css` declares `--iq-code-*` as a semantic fill mixed towards the
foreground (`color-mix(in oklab, var(--it-warning) 45%, var(--it-fg))`), which
reads on both modes from one declaration, like `--iq-accent-ink`. Comments use
`--it-muted` (italic), the default text uses `--it-fg`. No literal colour enters
the theme, and no prebuilt Shiki theme is imported.

`fontStyle` from the tokens is honoured: italic comments, bold where a grammar
asks for it, underline on `invalid`.

## Consequences

### Positive

- The code is coloured in both modes with the application palette.
- Zero cost on the initial bundle; only the engine and the grammars a quiz uses
  are fetched, then precached by the service worker.
- The sanitizer stays strict (`data-lang` is the only addition), and the
  highlighted HTML is created by us from escaped text.
- A new language is a one-line addition.
- No layout shift: the text is the same, only the colours change.

### Negative

- The first code block waits for a chunk (engine + grammar) before it is
  coloured; until then it is plain.
- The JavaScript engine is slower than Oniguruma on pathological grammars; the
  snippets a quiz carries are short.
- The service worker precaches every chunk, grammars included: the install goes
  from 46 to 60 precache entries, about 2.1 MB of files, for the ten languages.
  Excluding the unused grammars from the precache is a later refinement; until
  then, the offline install carries them all.
- A custom theme means tuning a palette and checking contrast in both modes,
  rather than importing a maintained one.
- The highlight pass mutates the DOM of the `v-html` block after the render; a
  Vue re-render replaces those nodes and the pass runs again.

### Trade-offs

- Shiki on demand over Prism or highlight.js in the bundle: no initial weight
  and the better grammars, at the cost of an asynchronous pass, a custom theme
  and a DOM post-process.
- Post-sanitization injection over allowing inline `style`: the sanitizer keeps
  one job, the author cannot style anything, and the only styles in the output
  are the ones our theme emits.
- The JavaScript engine over the Oniguruma WASM engine: no `.wasm` asset to
  precache, at the cost of speed on very large grammars.

## Alternatives Considered

1. **Prism or highlight.js in the bundle**: rejected on the objective. About
   23–30 kB gzip on every visit, for a feature used only when a quiz carries a
   code block.
2. **The full `shiki` or `shiki/bundle/web`**: rejected. The bundle presets carry
   every grammar and theme as chunks; the fine-grained core keeps the build to
   the languages we list.
3. **Allow `style` through DOMPurify for Shiki's inline colours**: rejected. It
   opens a CSS surface to imported content (including remote `url()`), for a
   gain the post-sanitization pass already provides.
4. **Highlight in a Web Worker**: rejected for this increment. It would keep the
   main thread free, but adds a worker entry, a message protocol and a second
   copy of the engine, for snippets that highlight in milliseconds.
5. **Server-side highlighting**: rejected. There is no server.

---

*Format inspired by [MADR](https://adr.github.io/madr/)*
