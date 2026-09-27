# create-arsh-electron

Scaffold an Arshdelight-style Electron + React + TypeScript desktop app.

```
npm create arsh-electron@latest my-app
```

The generated project ships with:

- Electron 42 + Vite 8 + React 19 + TypeScript 6 + Tailwind CSS 4
- Frameless window with a custom title bar (minimize / maximize / close / pin)
- UI primitives — `AppLayout`, `TitleBar`, `NavItem`, `Button`, `Dialog`, `Tooltip`, `Spinner`, `Switch` — with theme tokens in plain CSS variables
- `AGENTS.md` bootstrap — the first AI session interviews the user and writes
  the project conventions, plus a minimal single-page starter
- Build pipeline with clean outputs, a `dependencies`/`devDependencies` split
  that keeps `app.asar` small, an Electron binary mirror for reliable installs,
  and a complete `.gitignore`

## Usage

```bash
npm create arsh-electron@latest [project-name]
```

| Flag | Description |
|---|---|
| `--yes` | Skip prompts, use defaults (git init included) |

The CLI asks for a project name, derives `package.json` name / `productName` / `appId` / window title / title-bar brand from it, and offers to initialize git with a first commit.

Requires Node.js ≥ 20.11.

## License

MIT
