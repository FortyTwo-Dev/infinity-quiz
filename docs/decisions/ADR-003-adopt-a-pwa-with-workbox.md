# ADR-003 - Adopt a service worker and an installable manifest

## Status

Accepted

## Context

### Problem encountered

Infinity Quiz is local-first: the catalogue, the attempts, the history and the
preferences all live in `localStorage`, and no request leaves the device. The
build was nevertheless a plain web page:

- with no network, a reload or a deep link showed the browser's offline error;
- there was no manifest, so the application could not be installed, opened in
  its own window or pinned with its own icon;
- a new build was only picked up by a full reload.

The sibling project `infinity-qrcode` already ships
`vite-plugin-pwa@2.0.0` with Workbox, an explicit update prompt and a
precached shell.

### Constraints

- The application stays client-side: no backend, no network call at runtime.
- The output is static, served by the unprivileged nginx of
  `container/Containerfile`; that server already sends
  `worker-src 'self'` and `manifest-src 'self'` in its Content Security Policy.
- An attempt is persisted and must not be interrupted: the application never
  reloads the tab behind the user's back.
- The suite runs under jsdom, where no service worker exists; the virtual
  registration module has no implementation outside a production build.
- `@infinitylib/infinity-theme` ships no install or update widget, so the
  prompt is application UI.
- One tooling dependency, pinned, maintained: no hand-written service worker.

### Objectives

1. The shell, the styles, the fonts and the images work offline after one
   visit, including a deep link.
2. A new build is offered; applying it is the user's decision.
3. The cache holds static build output only, never user data.
4. The first paint shows the stored theme, not the default one.
5. An install entry point has a reserved place, even though it does not ship
   yet.

## Decision

### Generation

`vite-plugin-pwa@2.0.0` as a dev dependency, Workbox `generateSW` mode, in
`vite.config.ts`:

```ts
VitePWA({
  registerType: 'prompt',
  injectRegister: false,
  workbox: {
    globPatterns: ['**/*{js,css,html,ico,png,svg,woff,woff2,ttf}'],
  },
  // manifest…
})
```

- `globPatterns` covers the shell, the four OpenDyslexic `.woff` files, the
  Space Grotesk `.ttf`, the logos and the favicon. The generated precache list
  is checked in the build output (`PWA … precache N entries`).
- The default navigation fallback (`index.html`) is kept: a deep link opened
  offline resolves to the application shell and the client router takes over.
- `runtimeCaching` is left empty. The application fetches nothing at runtime;
  the only cache is the precache of the build output. No user-specific or
  authenticated response can end up in it.
- `registerType: 'prompt'` and `injectRegister: false` are inseparable: the
  registration and the update are driven by `useRegisterSW()` in the prompt, so
  the update waits for a click.

### Manifest

| Field | Value | Why |
| --- | --- | --- |
| `name` | `Infinity Quiz` | The product name |
| `short_name` | `IQuiz` | Same short form as the shell's fallback title |
| `theme_color` | `#00ff96` | The brand accent bound in `src/css/brand.css` |
| `background_color` | `#ffffff` | The light canvas (`--it-bg`) of the launch screen |
| `lang` | `en` | The interface is English |
| icons | `logo.png` (any maskable), `logo-mono.png` (monochrome), `favicon.ico` | Assets already in `public/img/`, 512×512 |

`start_url`, `scope` and `display: standalone` come from the plugin defaults.

### Update prompt

`src/components/common/pwa/PwaPrompt.vue`, rendered once from `src/App.vue`,
outside `AppLayout` so the shell's route logic does not own it:

- a fixed `<output aria-live="polite" aria-label="Application status">`, so the
  message is announced without moving the focus;
- `offlineReady` shows "Ready to work offline." with a single Close button;
- `needRefresh` shows "A new version is available." with Reload and Close;
- when both hold, the update message wins: the offline-ready flag stays until
  it is dismissed, so a version can start waiting while it is still set, and
  the actionable message is the one that leads somewhere;
- Reload calls `updateServiceWorker()`, Close clears both flags: no automatic
  reload, an attempt in progress is never lost;
- the banner sits at the bottom edge (`--app-pwa-z: 45`, under the toast region
  at 50, above the mobile drawer at 40), full width on a phone and 28rem at the
  bottom-right from 40rem.

The widget uses `ItButton` from `@infinitylib/infinity-theme-vue` and only
`--it-*` tokens plus one `--app-*` token, so it is a candidate to move into the
theme package or to share with `infinity-qrcode` when the prompt repeats there.

### Install entry point

The installation has a reserved place, and it does not ship in this change:

- route name `install`, path `/install`;
- nothing routes there today: the catch-all `/:pathMatch(.*)*` answers with the
  not-found screen, and no link points at it;
- when it is implemented it becomes a `src/views/InstallView.vue`, a lazy route
  in `src/router/index.ts`, and a row in the `architecture` rule — the same
  shape as every other screen.

`/install` is a client route, not a server endpoint: the SPA is static, and the
nginx `try_files $uri $uri/ /index.html` already serves the shell for that path
once the route exists.

The reason to give it a dedicated screen rather than a button in the shell:
`beforeinstallprompt` is Chromium-only, needs a dismissal state that survives a
reload, and the installation steps differ per browser. A screen can explain the
steps, host the deferred prompt on the browsers that fire it, and stay silent on
the others. This ADR does not introduce that prompt; it reserves the place so
that adding it is a new screen and a route, not a redesign of the shell.
Shipping it is a possibility this decision leaves open, not an option it
rejects.

### First paint

Two pieces, because no store can run before the bundle loads:

- `public/theme-init.js` is a blocking script of the document head, loaded before
  the stylesheet. It reads the two persisted keys directly
  (`infinity-quiz-theme`, `infinity-quiz-accessibility`), applies `data-theme`
  and `data-font` on `<html>`, and falls back to the light theme and the brand
  typeface on any malformed payload. Each key is read independently: a corrupt
  theme must not disarm the reading-font preference.
- `src/css/style.css`, the first stylesheet the document loads, binds
  `color-scheme` to `data-theme` and paints `html, body` from `--it-bg` and
  `--it-fg`. The `color-scheme` is what removes the white page: it gives the
  browser a dark canvas before the bundle mounts and before the theme package's
  stylesheet is applied, and the token takes over as soon as the package
  defines it.

Without both, a dark-mode launch shows the white canvas until the application
mounts. The attribute alone is not enough: nothing paints the canvas until a
rule asks for it.

The web manifest's `background_color` remains static, so the launch screen of
an installed application is white for every mode until the page paints. The
manifest has no per-theme background field; the alternatives are a neutral
colour, wrong for one mode, or a server-side splash, and this application has no
server. The canvas fix removes the blank page that follows, not the splash that
precedes.

### Verification

- `bun run build` must print the generated `sw.js`, `workbox-*.js` and the
  precache count, and `dist/manifest.webmanifest` must carry the fields above;
- `bun run preview`, then a reload with the network disabled, must serve the
  shell and the fonts;
- `src/__tests__/components/common/PwaPrompt.spec.ts` covers the three states,
  the reload action, the close action and the live region. The virtual module is
  aliased to a controllable stand-in in `vitest.config.ts`: a unit test has no
  service worker.
- `src/__tests__/utils/theme-init.spec.ts` executes the first-paint script
  against the stored payloads the application accepts, the legacy theme names
  and the malformed values it must survive.

## Consequences

### Positive

- The application is installable and works offline, including a deep link.
- The update is visible and explicit; an attempt in progress is never reloaded
  away.
- The cache contains build output only: no user data, no network response.
- The theme package stays untouched: the prompt is application UI, built from
  the package's tokens and button.
- The install entry point is reserved by name and path, with the reason and the
  shape of the future implementation written down.

### Negative

- `bun.lock` grows with the Workbox dependency tree; the production bundle gains
  a service worker and `workbox-window` (about 5.6 kB gzipped).
- An installed application can run one build behind until its user accepts the
  update.
- The prompt duplicates the one in `infinity-qrcode`; sharing it becomes
  worthwhile when a second consumer needs it.
- The first-paint script duplicates the theme normalization in plain
  JavaScript, outside the bundle and its type check.

### Trade-offs

- A prompt over `autoUpdate`: one extra click on an update, in exchange for
  never losing an in-progress attempt.
- Precaching the fonts over fetching them on demand: a heavier first install,
  in exchange for a real offline first paint.
- A reserved route over a shell button: one more screen when it ships, but no
  Chromium-only control in a shell that must stay neutral.

## Alternatives Considered

1. **Hand-write the service worker**: rejected. It reimplements Workbox's
   precaching, cache versioning and cleanup, and the maintenance cost lands on
   a project that has no server to debug it against.
2. **`registerType: 'autoUpdate'`**: rejected. It reloads the tab when a new
   build is found, which would interrupt a quiz in progress and contradict the
   persisted-attempt invariant.
3. **`injectRegister: 'auto'`**: rejected. The generated snippet registers the
   worker but offers no update UI; the prompt needs `useRegisterSW()` anyway.
4. **Cache everything at runtime**: rejected. The application fetches nothing,
   and a broad runtime cache is how a stale `index.html` survives a deploy.
5. **Ship an install button now**: rejected for this change. It is
   Chromium-only, needs a persisted dismissal, and the agreed scope is parity
   with `infinity-qrcode`. The reserved `/install` route keeps the option open.
6. **Write the theme selection inline in `index.html`**: rejected. The nginx
   Content Security Policy has no `unsafe-inline`; the selection needs the
   stored value, which only a script can read.

---

*Format inspired by [MADR](https://adr.github.io/madr/)*
