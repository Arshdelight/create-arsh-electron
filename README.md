# create-arsh-electron

Scaffold an Arshdelight-style Electron + React + TypeScript desktop app.

```
npm create arsh-electron@latest my-app
```

The generated project ships with:

- Electron 42 + Vite 8 + React 19 + TypeScript 6 + Tailwind CSS 4
- Frameless window with a custom title bar (minimize / maximize / close / pin)
- UI primitives — `AppLayout`, `TitleBar`, `NavItem`, `Button`, `Dialog`, `Tooltip`, `Spinner`, `Switch` — with theme tokens in plain CSS variables
- `AGENTS.md` for AI coding tools, and a minimal single-page starter
- Engineering fixes baked in: clean build outputs, `dependencies`/`devDependencies` partition (asar stays tiny), Electron binary mirror for reliable installs, complete `.gitignore`

## Usage

```bash
npm create arsh-electron@latest [project-name]
```

| Flag | Description |
|---|---|
| `--yes` | Skip prompts, use defaults (git init included) |

The CLI asks for a project name, derives `package.json` name / `productName` / `appId` / window title / title-bar brand from it, and offers to initialize git with a first commit.

Requires Node.js ≥ 20.11.

## 中文速览

```bash
npm create arsh-electron@latest my-app
cd my-app && npm install && npm run dev
```

生成 Arshdelight 风格的 Electron + React + TS 项目：无边框窗口、UI 原语、AI 协作约定（AGENTS.md）、打包修复全部内置。装完依赖直接写业务。

## License

MIT
