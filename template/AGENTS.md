# Arsh Electron

Arshdelight 风格 Electron 桌面应用模板：Electron + React + TypeScript + Tailwind CSS 4 + vite-plugin-electron。
无边框窗口、应用级 Layout（TitleBar/AppLayout/NavItem）与基础原语（Button/Dialog/Tooltip/Switch/Spinner）已就位；
依赖分区、产物清理、electron 镜像等工程修复内置，见 README。

## 编码原则

- **先想后写**：动手前理清需求；有假设明说，有取舍摆出来，需求不合理就直说
- **极简实现**：写能解决问题的最少代码，不做投机性设计
- **外科手术式改动**：只改必须改的地方，只清理自己制造的混乱，不顺手重构
- **目标驱动**：动手前先定成功标准，完成后按标准验证，未通过就继续修
- 琐碎改动（错别字、显而易见的一行修复）不必走以上流程

## Commit 规范

格式：**英文前缀 + 中文描述**，一行不超过 72 字符。

```
<prefix>: <中文描述>
```

可用前缀：`feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore`

## 开发注意事项

- 目录职责：`electron/` 主进程与 preload（所有 Node/Electron 侧代码）；`src/` 渲染层（React 19 + Tailwind 4）；`src/ui/` vendored 自 arshui 的原语（appLayout/titleBar/navItem/button/dialog/tooltip/spinner/switch）与 token（`styles.css` 的 `:root` CSS 变量，换肤/暗色只改这里）；`src/lib/` cn 与 IPC 桥检测
- **渲染层零 Node/Electron API**：一律经 `window.ipcRenderer`（`src/lib/electron.ts` 的 `getIpc()`）与主进程通信；新增通道在 `electron/main.ts` 加 handler，`electron/preload.ts` 按需扩展桥，`src/global.d.ts` 同步类型。纯 Web 环境（无桥）必须能降级渲染（原语已内置 getIpc 判空）
- **依赖分区（影响打包体积，硬规则）**：`dependencies` 只放"主进程运行时需要且未被打进 bundle"的包——即 `vite.config.ts` 里 `external` 清单中的包，两者必须同步；渲染层专用库（react、lucide-react 等一切只在 `src/` 用的包）一律进 `devDependencies`。判断口诀：**"删掉这个包，打包出来的应用还能不能跑？"能跑 → devDependencies**。放错区会把 node_modules 整棵塞进 asar
- 无边框窗口：窗口控制走 `window:*` IPC 通道，拖拽区用 `titlebar-drag-region` / `titlebar-no-drag`；层级约定 titlebar（z-50）< Dialog（z-60）< Tooltip（z-100），勿给弹窗写别的 z 值
- `electron/main.ts` 读会被 Vite define 替换的环境变量必须用方括号访问：`process.env['VITE_DEV_SERVER_URL']`
- preload 编译产物是 `dist-electron/preload.mjs`，main.ts 按此文件名引用
- TypeScript strict（含 noUnusedLocals/noUnusedParameters）；`tsc` 仅做类型检查
- 样式 Tailwind CSS 4：CSS-first，无 tailwind.config，自定义主题用 `@theme` 写在 CSS 里（token 见 `src/ui/styles.css`）
- 构建/生成物 `dist/`、`dist-electron/`、`release/` 不手工编辑、不提交；本地草稿一律进 `.temp/`（已 gitignore）

## 打包

- build 脚本自带产物清理（dist + dist-electron），不要去掉——vite 只清自己的 `dist/`，`dist-electron/` 不清会积累旧 hash 文件并被打进 asar
- `electron-builder.json5` 已配 `electronDownload.mirror`（npmmirror）。实测 electron-builder 26 **不读任何本地 zip 缓存**（自己的 hash 子目录和 electron\Cache 平铺位都不认），每次构建都会从镜像重新下载 electron zip（约 40 秒，属正常）；不要去掉镜像配置，否则回落 GitHub 直连大概率失败
- **electron-builder 只打包 `dependencies`**（含其传递依赖）；devDependencies 不进 asar——这就是依赖分区规则存在的原因
- 发布前 checklist：`electron-builder.json5` 的 appId/productName、`package.json` 的 name/version/description、安装图标放 `build/icon.png`（≥256×256）

## 测试规范

- 交付前必须通过：`npm run lint`（零警告）与 `npx tsc --noEmit`
- `npm run build` 含完整 electron-builder 打包，较慢，发布前跑；打包冒烟：直接运行 `release/<版本>/win-unpacked/<应用名>.exe`，窗口能起来即主进程依赖齐全
- `npm run dev` 会起 Vite 开发服务器和 Electron 窗口，用完即关不留进程

## 沟通规范

- **提问不是任务指令**：以问号结尾的提问只要求回答，不要据此开始改代码；等明确说"改/做/加"后再动手
- 拿不准是否要动手时，先说明打算做什么，征得同意再改

## 任务汇报规范

完成任务后按以下格式汇报：

```
本轮任务目标：xxx
具体完成内容：
1. xxx（相关文件：xxx）
2. xxx（相关文件：xxx）
下一步建议：xxx
```
