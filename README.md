# Infinity Quiz

<img src="public/img/logo.png" width="128" alt="Infinity Quiz logo" />

A local-first quiz application: a catalogue, a playable quiz with a timer and
immediate feedback, a statistics screen, and a JSON format to share quizzes.

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=FortyTwo-Dev_infinity-quiz2&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=FortyTwo-Dev_infinity-quiz2)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=FortyTwo-Dev_infinity-quiz2&metric=bugs)](https://sonarcloud.io/summary/new_code?id=FortyTwo-Dev_infinity-quiz2)
[![Security rating](https://sonarcloud.io/api/project_badges/measure?project=FortyTwo-Dev_infinity-quiz2&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=FortyTwo-Dev_infinity-quiz2)
[![Code smells](https://sonarcloud.io/api/project_badges/measure?project=FortyTwo-Dev_infinity-quiz2&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=FortyTwo-Dev_infinity-quiz2)
[![Duplicated lines](https://sonarcloud.io/api/project_badges/measure?project=FortyTwo-Dev_infinity-quiz2&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=FortyTwo-Dev_infinity-quiz2)

- `/` lists the catalogue, searches it by title, filters it by category and tag.
- `/quiz/:quizId` plays one quiz: questions, timer, feedback, skips.
- `/results` shows the score, the review of every answer, and a restart.
- `/statistics` draws the attempt history: score trend, distribution, pass rate.
- `/manage`, `/create`, `/edit/:quizId` own the catalogue.
- `/import-export` moves quizzes in and out as JSON.
- `/settings` holds the preferences: an optional OpenDyslexic reading font, and
  the account, sync and data-export sections announced for later. The sidebar
  also carries the credits and the source-code link.

Everything runs in the browser. Every quiz, attempt and preference lives in
`localStorage`: there is no account, no server, and no request leaves the device.

## Features

- One question at a time, with immediate feedback, the correct answer
  highlighted after a selection, and a full review at the end.
- An optional Markdown context per question — a code sample, a quotation, a
  table — shown between the prompt and the answers, and an explanation rendered
  as Markdown in the feedback. Code fences are syntax-highlighted (JavaScript,
  TypeScript, JSX/TSX, JSON, HTML, CSS, Bash, Python, Java), the highlighter
  loading on demand.
- Optional time limit, global or per question, with a progress bar that reaches
  its end on the last question.
- Question and answer shuffling from a persisted seed, so a reload replays the
  same order.
- Skips, with a configurable maximum and a remaining count on the button.
- Creation, edition, duplication and deletion, through a multi-step form
  validated with Zod.
- Categories, tags and search across the catalogue.
- JSON import and export, validated on the way in.
- Light and dark mode, and a quiz can carry its own theme while it plays.
- An optional OpenDyslexic typeface, for readers who need it.
- An attempt survives a reload: the question, the answers, the score and the
  remaining time all rehydrate.
- Installable PWA: the shell, the styles and the typefaces are precached, so
  the application opens offline, and a new build is offered in a banner rather
  than forced onto an attempt in progress (ADR-003).

## Stack

- Vue 3.5 with the Composition API and `<script setup lang="ts">`.
- TypeScript 6, pinned because `vue-tsc` 3.3 does not support TypeScript 7.
- Vite 8 and Vue Router 5, with a lazy route per screen.
- `vite-plugin-pwa` 2 with Workbox: one service worker, the build output and
  the typefaces precached, an explicit update prompt.
- Pinia 4 with `pinia-plugin-persistedstate`; every store declares its storage
  key and the exact fields it persists.
- Zod 4 for the quiz format and vee-validate for the creation form.
- `marked` and DOMPurify for the question context and the explanation: one
  renderer, one sanitizer, one `v-html` (ADR-004).
- Shiki 4 for code highlighting, imported on demand: the engine and the grammar
  chunks load only when a context carries a code block (ADR-005).
- Bun 1.4 as package manager and runtime, Vitest 4 for the suite, run on Bun.
- The `@infinitylib/infinity-theme` design system, with `-vue` for its wrappers.
- ESLint 10 with `eslint-plugin-vue`, Oxlint and Prettier.

## Getting started

```sh
bun install
bun run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```sh
bun run build
bun run preview
```

The repository versions two git hooks. Install them once per clone:

```sh
bash scripts/install-hooks.sh
```

`pre-commit` formats and lints the staged files; `commit-msg` refuses a message
that breaks the convention.

## Scripts

| Command              | Purpose                                |
| -------------------- | -------------------------------------- |
| `bun run dev`        | Start the Vite dev server              |
| `bun run build`      | Type-check and build for production    |
| `bun run preview`    | Preview the production build           |
| `bun run type-check` | Run `vue-tsc --build`                  |
| `bun run lint`       | Oxlint then ESLint, both with `--fix`  |
| `bun run format`     | Format `src/` with Prettier            |
| `bun run test:unit`  | Run the suite with Vitest (watch mode) |
| `bun test:coverage`  | Run the full suite once, with coverage |

## Releases

The version follows the Conventional Commits. A successful CI run on `main`
builds the production image once, pushes it as the immutable `sha-<commit>` tag
and smoke-tests that registry image. Once CI succeeds, release-please opens a
release pull request with the next version and the changelog. Merging it creates
the tag and the GitHub release, and the release adds its version tag (`vX.Y.Z`)
and `latest` to the same tested image, without rebuilding it.

`1.0.0` is the first release; `main` only receives `release/*` merges, and
`develop` is the integration branch.

## Container

The image builds the app with Bun and serves the static files with an
unprivileged nginx on port 8080.

```sh
podman build --format docker -f container/Containerfile -t infinity-quiz:local .
podman run --rm -p 8080:8080 infinity-quiz:local
```

A release publishes `ghcr.io/fortytwo-dev/infinity-quiz` with the version tag
(`vX.Y.Z`), `sha-<commit>` and `latest`. The `/healthz` endpoint answers for a
health probe.

Quadlet example:

```ini
[Container]
Image=ghcr.io/fortytwo-dev/infinity-quiz:latest
ContainerName=infinity-quiz
AutoUpdate=registry
PublishPort=8080:8080
NoNewPrivileges=true
DropCapability=ALL
ReadOnly=true
Tmpfs=/tmp:rw,mode=1777
HealthCmd=wget -qO- http://127.0.0.1:8080/healthz
HealthInterval=30s

[Service]
Restart=always

[Install]
WantedBy=default.target
```

`systemctl --user enable --now podman-auto-update.timer` follows the `latest`
tag. Pin a version tag instead when a deployment must be reproducible.

## Architecture

```
src/
├── views/                 # one screen per route, lazy-loaded
├── components/
│   ├── itheme/            # the widgets the theme package does not ship yet
│   ├── layout/            # the shell and the L* layout primitives
│   ├── common/            # modal, notification, theme toggle, PWA prompt
│   ├── quiz/              # cards, form steps, charts, modal, search bar, content
│   └── quiz-import-export/
├── composables/           # stateful Vue logic, one concern per file
├── stores/
│   └── quiz/              # catalogue, session, history, verification
├── utils/                 # pure functions: validation, shuffle, theme, markdown
├── types/                 # the domain shapes
├── constants/             # thresholds, storage keys, themes
├── css/                   # cascade order, brand, widgets, screens
├── router/
└── __tests__/             # mirrors the layers, plus support/ for the harnesses
```

A layer only imports downwards: `views` → `components` → `composables` and
`stores` → `utils`, `types` and `constants`. The theme widgets and the layout
primitives import neither a store nor a domain type, so they stay promotable to
the package.

## Theme library

The UI consumes the published `@infinitylib/infinity-theme` package:

- Design tokens, base HTML styles and `it-*` variants ship from the package.
- The thin Vue wrappers ship from `@infinitylib/infinity-theme-vue`.
- The application brand (the charte green accent, the typeface, the `--iq-*`
  tokens) lives in `src/css/brand.css`.
- The page arrangement lives in `src/css/` as application classes on the
  structural tokens; `src/css/style.css` declares the cascade order.
- The mode is set with `data-theme` on `<html>`, the accent with `data-accent`
  (ADR-002, which supersedes the Tailwind and daisyUI decision in ADR-001).

## Testing

```sh
bun run test:unit          # watch mode, one file or one name as a filter
bun run test:unit <filter> --run
bun test:coverage          # the full suite with coverage, the pre-push gate
```

Vitest runs on the Bun runtime: Bun's own test runner cannot compile a `.vue`
single-file component. The suite holds 889 tests over 66 files, and the
`lines: 80` threshold is enforced by `vitest.config.ts`.

Three layers:

- **Utils and stores**: scoring and its thresholds, the attempt lifecycle, the
  seeded shuffle, the timer, persistence and rehydration.
- **Composables**: the form, the import and export, the statistics aggregates.
- **Components**: the cards, the form steps, the shell, the theme widgets. The
  form-step specs mount their subject inside a host that owns the vee-validate
  context; the harnesses live in `src/__tests__/support/`.

The five chart components have no spec: jsdom has no canvas, so a test there
would pin the props passed to chart.js, not a rendering.

## Governance

The repository uses [ibrain](https://github.com/FortyTwo-Dev/infinity-brain) for
AI governance knowledge. The Vue and Pinia standards live in their packs; the
project rules live in the `infinity-quiz` pack of
[iproject-ibrain-packs](https://github.com/FortyTwo-Dev/iproject-ibrain-packs),
pinned in `ibrain.lock.yaml`. The generated `.ai/` and `.agents/` trees are
ignored and recreated by `ibrain sync`; update the rules through
`ibrain edit infinity-quiz`, then `ibrain push` and `ibrain sync`.

## Notes

- TypeScript is pinned to 6 until `vue-tsc` supports TypeScript 7.
- Markdown is rendered by `MarkdownContent` alone, from the sanitized output of
  `renderMarkdown`; no other component binds `v-html`.
- The code highlighter is never in the initial bundle: Shiki and each grammar are
  fetched on the first code block, then precached by the service worker. Until
  they arrive, the code is plain; the `<pre>` keeps the same height.
- The stored theme is applied by `public/theme-init.js` before the first paint,
  and `src/css/style.css` binds the canvas to it; the stores reapply the same
  selection once Pinia rehydrates.
- `bun.lock` is the only lockfile; do not add an npm, yarn or pnpm lockfile.
- The coverage figure counts the files in `src/__tests__/support/`, which are
  test harnesses, not application code: the production layers sit near 95 %.
- A boolean prop that is only optional declares its default explicitly; Vue
  casts an absent boolean to `false` before any component code runs.

## License

MIT. See [LICENSE](LICENSE).
