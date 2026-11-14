# ADR-002 - Migrate from Tailwind CSS and daisyUI to infinity-theme

## Status

Accepted

Supersedes: [ADR-001](./ADR-001-tailwind-class-detection.md)

## Context

### Problem encountered

The application is styled with Tailwind CSS v4 utilities and daisyUI 5 component
classes, plus six hand-written daisyUI theme blocks in `src/css/main.css`. The
organisation now ships its own design system, `@infinitylib/infinity-theme`,
which is used by the sibling project `infinity-qrcode`. Two styling systems in
one mono-repo means two token vocabularies, two component APIs and two sets of
dark-mode behaviours.

daisyUI also carries a cost that is paid at build time: Tailwind v4 detects
classes statically, so every class assembled from a prop has to be safelisted
with `@source inline()`. ADR-001 exists only to manage that constraint.

### Constraints

- No new dependency beyond `@infinitylib/infinity-theme` and
  `@infinitylib/infinity-theme-vue`.
- The application stays client-side: no backend, no network call, every piece of
  state in `localStorage` through Pinia.
- The layer contract of the theme package: `@layer it.tokens, it.base,
  it.variants, components, it.overrides`, declared first by the application,
  because the first declaration wins.
- The theme package ships two modes, `light` and `dark`, and deliberately leaves
  the brand accent to the consuming application.
- Persisted data comes from builds that already used daisyUI: a theme name is
  stored globally and on every quiz.
- The test suite gates on `lines: 80`; there is no visual regression test.
- `@infinitylib/infinity-theme` is at an early stage: several widgets the
  application needs do not exist yet.

### Objectives

1. One styling system across the mono-repo.
2. No visual regression in either mode, for any accent.
3. No stored value from an older build can break the application on load.
4. Everything written here to fill a gap in the theme package can be moved into
   it later without a rewrite of the consuming code.

## Decision

### The theme is two attributes

```html
<html class="it-theme" data-theme="light|dark" data-accent="blue|yellow|red">
```

- `data-theme` selects the mode, from the two themes the package ships.
- `data-accent` selects one of the three brand accents, bound in
  `src/css/brand.css` on `:root[data-accent='…']`. The accent is not a theme:
  the mode is orthogonal to it, and an accent-specific contrast guard is
  expressible in CSS instead of being generated in JavaScript.
- Writing an attribute rather than an inline `--it-accent` keeps the selection
  inspectable, testable and compatible with a Content Security Policy.

### Tokens

The daisyUI token set maps onto the package tokens, and what the package does
not name is dropped, or, when a widget genuinely needs it, declared in an
application namespace `--iq-*` in `brand.css`.

| daisyUI | After migration | Note |
| --- | --- | --- |
| `base-100` | `--it-surface` | Cards, panels, raised areas. Foreground `--it-surface-fg`. |
| `base-200` | `--it-surface` | Collapsed into the surface level: in the light theme `base-100` and `base-200` are both white, so the third level only ever existed in dark mode. |
| `base-300` | `--it-bg` | Application canvas. Foreground `--it-fg`. |
| `base-content` | `--it-fg` or `--it-surface-fg` | Chosen by the background actually behind the text. |
| `base-content/70` | `--it-muted` | No translucent text: opacity applied to a foreground recreates contrast failures. |
| `primary` | `--it-accent` | Accent-driven. |
| `primary-content` | `--it-accent-fg` | Defined per accent, per mode. |
| `secondary` | dropped | No consumer survives the migration; the package's `it-btn-secondary` is a surface style, not the old cyan palette. |
| `secondary-content` | dropped | Follows `secondary`. |
| `accent` | dropped | The violet had no consumer outside the removed theme view, and `accent` now means the brand accent. |
| `accent-content` | dropped | Follows `accent`. |
| `neutral` | dropped | The package's default button style already is the neutral surface. |
| `neutral-content` | dropped | Follows `neutral`. |
| `info`/`success`/`warning`/`error` | `--it-info`/`--it-success`/`--it-warning`/`--it-danger` | `error` becomes `danger`. Each `-content` becomes the matching `-fg`. |
| `--radius-box` | `--it-radius` | The knob the package components read. Bound to `0.25rem` in light and `0` in dark, the values in use today. |
| `--radius-selector`, `--radius-field` | dropped | No package equivalent and no consumer once the daisyUI wrappers are rewritten. |
| `--border` (2px) | `--it-border-width` (rebound to 2px) | The package owns the knob and every control reads it; `--it-border` is the colour, never a width. |
| `--depth`, `--noise` | dropped | No equivalent, and both were `0`. |

### Styles the application owns

Feature-named classes in `@layer components`, one file per concern:

| File | Owns |
| --- | --- |
| `src/css/style.css` | The layer-order declaration, the body reset. Loaded first. |
| `src/css/brand.css` | `@font-face`, `--it-font-sans`, the accent bindings, the contrast guards, the `--iq-*` tokens. |
| `src/css/itheme/*.css` | The widgets the package does not ship yet, one file per widget. |
| `src/css/layout/*.css` | The application shell, the sidebar, the shared page compositions. |

Class names describe the domain, not a generic widget: `.quiz-review-card`,
`.quiz-answer-progress`, `.app-sidebar`. A `.card` or a `.modal` would rebuild
daisyUI one selector at a time.

### Filling the gaps in the package

The widgets the package lacks are written here in its shape, so that promoting
them is a copy and not a rewrite:

- `it-*` class names, one CSS file per widget under `src/css/itheme/`.
- Vue wrappers `ItCard`, `ItBadge`, `ItAlert`, `ItDialog`, `ItProgress`,
  `ItToast`, `ItSteps`, `ItFileInput` in `src/components/itheme/`, each carrying
  a `candidate for upstream` header. The fieldset and the label come from the
  package (`ItField`, `it-label`), so no local copy is kept.
- Only `--it-*` tokens, no literal colour, no store, no domain type, accessible
  by default: an accessible name, a visible focus, keyboard operation.
- The local files are imported after the package and live in the same
  `components` layer, so a local widget wins by source order. Promoting one
  means deleting the local file in the commit that bumps the package version.
  Every bump therefore requires reading the package changelog, or a local copy
  silently shadows the shipped one.

### Persisted theme selection

A quiz carries an optional `{ mode, accent }` pair instead of a daisyUI theme
name. One normalizer serves the store and the Zod schema:

- the six legacy names (`infinity-blue-light`, …) convert to their pair;
- any other value, a malformed object, a missing value or a removed imported
  theme becomes `undefined` for a quiz and the default pair for the global
  theme;
- nothing throws on read, and a quiz is never rejected because of its theme.

A migration reads `localStorage` before Pinia rehydrates, rewrites the theme key
in its version 2 shape, drops `importedThemes`, and transforms the `theme` field
of every stored quiz while leaving everything else untouched. It is idempotent
and safe on malformed JSON.

The import of daisyUI themes is removed: the package's accent is a binding, not
a stylesheet to be parsed and injected at runtime.

## Consequences

### Positive

- One token vocabulary and one component API for the whole mono-repo.
- No build-time class detection, so no `@source inline()` safelist and no
  class that vanishes from a production build (ADR-001 becomes moot).
- The accent is a first-class, declarative choice, testable from the DOM.
- The widgets written here serve the next project of the mono-repo directly.

### Negative

- Cards gain a slightly grey surface in the light theme: the package's
  `--it-surface` is `oklch(97%)` where daisyUI's `base-100` was white. The card
  now stands out by its fill rather than only by its border.
- The theme package is young and may ship a widget with the same name as a local
  one; a version bump must be checked against the local files.
- Removing the theme import is a deliberate functional regression: themes that
  users had imported are not recoverable.
- The migration is a large diff across 63 single-file components.

### Trade-offs

- Declarative attributes over inline custom properties: more selectors in
  `brand.css`, but no JavaScript-generated CSS and guards that combine mode and
  accent.
- Two background levels over three: a simpler hierarchy, at the cost of the dark
  sidebar merging with the canvas unless it takes a border or a surface fill.
- Application tokens in a `--iq-*` namespace over forcing everything into the
  package vocabulary: honest about what the package does not own.

## Alternatives Considered

1. **Keep Tailwind for layout, adopt infinity-theme for tokens**: rejected. Two
   systems remain, the boundary between them is arbitrary, and ADR-001 would
   have to be maintained for a shrinking share of the code.
2. **Recreate daisyUI's generic class names locally** (`.card`, `.badge`,
   `.modal`): rejected. It rebuilds the coupling the migration removes, and the
   names hide which layer owns the look.
3. **Generate one theme per accent and mode, as daisyUI did** (six shipped
   themes): rejected. The package models mode and accent as orthogonal, and six
   theme names mean six times the token duplication and a persisted name to
   migrate for every new accent.
4. **Keep the theme import by translating daisyUI token names to `--it-*` at
   runtime**: rejected. It parses untrusted CSS, writes it into the document, and
   only ever produces a degraded subset of the token set.
5. **Bind the accent with an inline `style="--it-accent: …"`**: rejected. Not
   inspectable from a test, not combinable with mode-specific guards, and
   incompatible with a strict Content Security Policy.

---

*Format inspired by [MADR](https://adr.github.io/madr/)*
