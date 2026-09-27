# Arsh Electron

Electron + React + TypeScript desktop app.

## Prerequisites

- Node.js ≥ 20.11

## Commands

```bash
npm install
npm run dev      # start the dev app with hot reload
npm run build    # type-check, bundle, and package installers into release/
npm run lint     # ESLint, zero warnings
```

## Structure

```
├── electron/            # main process + preload (all Node/Electron code)
│   ├── main.ts          # frameless window + window:* IPC handlers
│   └── preload.ts       # contextBridge → window.ipcRenderer
├── src/
│   ├── ui/              # AppLayout, TitleBar, NavItem, Button, Dialog,
│   │                    # Tooltip, Spinner, Switch + theme tokens (styles.css)
│   ├── lib/             # cn() and IPC bridge detection
│   ├── App.tsx          # entry page
│   └── index.css
├── AGENTS.md            # project conventions for AI coding tools
└── electron-builder.json5
```

## Packaging

- Custom installer icon: place `build/icon.png` (≥ 256×256) at the repo root.
- Installer metadata lives in `electron-builder.json5` (`appId`, `productName`).

## AI coding tools

`AGENTS.md` holds the project conventions. On the first session it walks the
tool through a short interview and writes the final conventions for this
project.
