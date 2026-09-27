# AGENTS.md — bootstrap

This file bootstraps the real AGENTS.md. Instead of shipping opinions the user
never asked for, your **first session** in this project runs a short interview
and rewrites this file into the project's actual conventions.

## First session: run the interview

If this file still contains the "Engineering rules" section kept verbatim, the
interview has not happened yet. Ask everything in **one round** (not one message
per question), accept short answers, and skip any question the user answers
with "default".

1. **Commit style** — prefix convention (`feat:` / `fix:` / `chore:` / none)?
   Message language? Subject-line rules (length, imperative, capitalization)?
2. **Collaboration style** — plan first and wait for approval, or act directly?
   Where is the line between "just do it" and "ask first"? How much refactoring
   is welcome while touching nearby code?
3. **Language** — for conversation, code comments, docs, and UI strings?
4. **Delivery bar** — besides `npm run lint` and `npx tsc --noEmit`, what must
   pass before work counts as done (tests, manual checks, packaging smoke)?
5. **Anything else** — pet peeves, forbidden actions, naming or structure
   preferences worth writing down?

Then rewrite this file:

- Keep the file name `AGENTS.md` and keep the `## Engineering rules` section
  intact — translate it only if the user asked for another language.
- Structure the rest around the interview answers.
- Zero filler. No platitudes ("write clean code", "be concise"), nothing the
  template already enforces by construction. Every line must change how you act.
- The interview is one-time. Once this bootstrap section is gone, never ask again.

## Engineering rules

These encode how this template builds and packages correctly. Keep them intact.

- Layout: `electron/` holds the main process and preload (all Node/Electron
  code); `src/` is the renderer (React 19 + Tailwind CSS 4); `src/ui/` holds the
  UI primitives and theme tokens (`styles.css` `:root` variables — reskin there,
  including dark themes); `src/lib/` has `cn()` and the IPC bridge detection.
- Renderer code never imports Node/Electron APIs. All IPC goes through
  `window.ipcRenderer` (see `src/lib/electron.ts`). New channels: handler in
  `electron/main.ts`, exposure in `electron/preload.ts`, typing in
  `src/global.d.ts`. Primitives must keep working without the bridge —
  `getIpc()` returns null on plain web.
- Dependency partition (packaging size, hard rule): `dependencies` holds ONLY
  main-process runtime packages, and must stay in sync with the `external` list
  in `vite.config.ts`. Everything used only by the renderer goes to
  `devDependencies`. Test: remove the package — if the packaged app still runs,
  it belongs in devDependencies. A misplaced package bloats app.asar with a full
  node_modules tree.
- Frameless window: window controls use the `window:*` IPC channels; drag
  regions use `titlebar-drag-region` / `titlebar-no-drag`. Layer order:
  title bar (z-50) < Dialog (z-60) < Tooltip (z-100).
- The build script cleans `dist/` and `dist-electron/` first — do not remove
  that. Vite only clears `dist/`; stale files in `dist-electron/` get packaged
  into app.asar.
- Packaging: `electron-builder.json5` pins the npmmirror mirror for the Electron
  binary. electron-builder 26 re-downloads it on every build (no local cache —
  expected, ~40s); without the mirror it falls back to GitHub, which often
  fails. `electron-builder` packs everything under `dependencies` — that is why
  the partition rule exists.
- Read env vars that Vite may replace with bracket access:
  `process.env['VITE_DEV_SERVER_URL']`.
- Preload output is `dist-electron/preload.mjs`; main.ts references it by name.
- Never hand-edit or commit `dist/`, `dist-electron/`, `release/`. Scratch work
  goes to `.temp/` (gitignored).
- TypeScript is strict (`noUnusedLocals`, `noUnusedParameters` included).
  Baseline verification: `npm run lint` (zero warnings) and `npx tsc --noEmit`.
  `npm run build` runs full packaging (slow; for release checks).
