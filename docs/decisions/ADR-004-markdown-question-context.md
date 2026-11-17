# ADR-004 - Give a question an optional Markdown context

## Status

Accepted

## Context

### Problem encountered

A question is a single sentence (`Question.text`). Some subjects cannot be asked
in one sentence:

- "Which language is this?" needs the code sample it refers to;
- a reading-comprehension question needs the passage;
- a comparison question needs a small table.

The first idea was to make the prompt itself Markdown. It does not fit: the
prompt is the card's heading, and a rich block cannot live inside a heading.
It also leaves no place for the sentence that states what is asked.

### Constraints

- The application is local-first: no backend, no network call, every quiz in
  `localStorage`. A context that fetched a remote image would break that.
- A stored quiz comes from an older build and is untrusted on read; an imported
  JSON is untrusted too.
- The question is the accessible heading of its card: the document outline must
  stay valid.
- The action row must not move between questions: the interface was observed
  jumping, and a user clicking "Next" could land on an answer.
- No Tailwind, no daisyUI, tokens only (ADR-002).
- Images need a storage strategy, and the account with cloud storage does not
  exist yet.

### Objectives

1. Attach supporting material to a question without turning the prompt into a
   document.
2. Keep every existing quiz readable and every existing JSON importable.
3. Render rich text without opening an XSS surface.
4. Keep the play screen layout stable from one question to the next.
5. Leave the image case open for the account phase, without pretending it is
   rejected.

## Decision

### Model

```ts
interface Question {
  id: string
  text: string       // the question, required, non-empty, plain text
  context?: string   // optional Markdown: the code sample, the passage, the table
  options: string[]
  correctAnswerIndex: number
  explanation?: string
  // …
}
```

- `context` absent means the current behaviour. No field `format`, no union, no
  per-question editor mode: the presence of a context is the switch.
- A context made only of whitespace is normalised to `undefined` on read and on
  save: an empty block would leave dead space in the card.
- The explanation, already a free-text field, is rendered as Markdown with the
  same component. It shares the trust boundary and the renderer.
- No migration: an older build ignores `context` (its `z.object` strips the
  unknown key) and displays the question alone. The loss is silent and
  documented.
- Images stay out until the account and its storage exist. The model is
  additive: an image lands later as a field or as a Markdown image, once there
  is somewhere to put the bytes. This decision does not foreclose it.

### Rendering

`marked@18.2.1` parses, `dompurify@3.4.18` sanitizes, both pinned. `marked`
alone does not sanitize; its documentation says so. The totals measured at the
time of the decision: marked 15.4 kB gzip, DOMPurify 11.5 kB gzip, against
40.8 kB gzip for `markdown-it` alone, which also pulls six transitive packages.

One module, `src/utils/markdown.ts`, and one function, `renderMarkdown`. It is
the only place that produces HTML from user input.

- **Sanitization** — allowlist of what the theme styles: `p, br, strong, em,
  del, code, pre, blockquote, ul, ol, li, a, hr, table, thead, tbody, tr, th,
  td`; attributes `href, title, target, rel`; no data attributes. Raw HTML in
  the source is parsed by `marked` and then reduced by the allowlist.
- **Headings** — a Markdown heading becomes `<p><strong>…</strong></p>`: an
  `<h1>` inside a card whose question is the `<h2>` would break the outline.
- **Links** — every link carries `target="_blank"` and
  `rel="noopener noreferrer"`. The scheme policy is DOMPurify's default, which
  drops `javascript:` and `data:`; a narrower `ALLOWED_URI_REGEXP` also strips
  `target` and `rel`, because the sanitizer treats those as URI-valued.
- **Images** — an `![alt](…)` is replaced by its alt text; the tag never
  reaches the DOM.
- **Task lists** — `input` is not in the allowlist, so the checkbox disappears
  and the item keeps its text: a question must not show a control that looks
  like an answer.

`MarkdownContent.vue` (`src/components/quiz/content/`) is the only component
that binds `v-html`, and it binds the output of `renderMarkdown`. The question
card, the review card, the form's review step and the feedback card all use it.

### Layout

The question card is a panel of stable height on the play screen
(`clamp(22rem, calc(100dvh - 22rem), 34rem)`), with a scrollable content area and
the action row outside it. Measured on a production build: the action row sits
at the same vertical position for a question without a context, with a short
code context and with a long passage, at 1280×800 and 390×844.

The context is bounded (`14rem`, its own scroll) so that a long passage never
pushes the answers out of the panel. A short context is centred with the rest of
the panel; a long one scrolls, and the box is focusable (`tabindex="0"`, labelled
"Question context") so a keyboard user can scroll it.

### Form

A `text` question keeps its single-line input. The context has an optional
textarea labelled "Context (optional, Markdown)", with a `Write | Preview`
toggle (`aria-pressed`) that renders through the same component. The preview is
the real rendering, not an approximation.

### Compatibility

- Export and import carry `context` unchanged; the field is optional in
  `QuestionSchema` and `FormQuestionSchema`.
- A blank context is `undefined` on both paths.
- An older build that imports such a quiz drops the context. The question
  remains usable.

## Consequences

### Positive

- The question stays a sentence and a heading; the supporting material has its
  own place.
- A code sample, a quotation or a table is written in a syntax authors know.
- One sanitizer, one renderer, one `v-html`, one place to audit.
- No migration, no storage growth beyond the text itself.
- The stable action row removes the observed jump between questions.

### Negative

- Two dependencies enter the bundle (about 27 kB gzip).
- An older build silently drops the context on import and re-export.
- A long context scrolls inside a bounded box; the answers stay visible but the
  passage is not read in one screen.
- Markdown adds syntax authors can get wrong; the preview exists for that.

### Trade-offs

- `marked` + DOMPurify over `markdown-it`: two packages and a sanitizer call,
  but 14 kB gzip less and the reference sanitizer rather than trusting a parser's
  defaults.
- A question + context over a Markdown prompt: a stricter model, at the cost of
  two fields in the editor.
- A bounded context over an unbounded one: the answers stay on screen, at the
  cost of a nested scroll area.
- A fixed play panel over a card that hugs its content: stable actions, at the
  cost of free space around a short question.

## Alternatives Considered

1. **Make the prompt itself Markdown** (a `format` field): rejected. The prompt
   is the card heading; block content cannot live in a heading, and the sentence
   that states the question would have to be derived or duplicated.
2. **`markdown-it` alone**: rejected on weight. It is safe by default
   (`html: false`, link validation), but 40.8 kB gzip and six transitive
   packages for the same result.
3. **`micromark`**: rejected. Lighter than marked, but 18 transitive packages,
   no tables without extensions, and the security boundary would be implicit.
4. **No sanitizer, `marked` with raw HTML disabled by a renderer override**:
   rejected. It is hand-rolled security, and the library documents the opposite.
5. **Inline images in the data URL, now**: rejected. The quota, the duplication
   in the persisted session and the export weight need the account storage to be
   decided. The images are deferred, not dropped.
6. **Detached action bar** (outside the card, pinned to the play panel):
   rejected for this change. It removes the free space, but moves the actions out
   of the card and reshapes the feedback flow; the fixed panel solves the jump
   with a smaller diff.
7. **A narrower URI allowlist** (`ALLOWED_URI_REGEXP`): rejected. It strips the
   `target` and `rel` attributes DOMPurify treats as URI-valued; the default
   policy already blocks `javascript:` and `data:`.

---

*Format inspired by [MADR](https://adr.github.io/madr/)*
