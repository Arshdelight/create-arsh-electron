# Arsh Electron

Electron + React 19 + TypeScript + Tailwind CSS 4 桌面应用：无边框窗口、应用级 Layout、基础 UI 原语（`src/ui/`），以及内置的工程修复（依赖分区、产物清理、electron 镜像、`.gitignore`）。

## 常用命令

```bash
npm install
npm run dev      # 开发窗口，渲染层热更新
npm run build    # 清理产物 → 类型检查 → vite build → electron-builder 安装包
```

## 目录结构

```
├── electron/                # 主进程 + preload（所有 Node/Electron 侧代码）
│   ├── main.ts              # 无边框窗口 + window:* IPC 控制通道
│   └── preload.ts           # contextBridge 暴露 window.ipcRenderer（on 返回解绑函数）
├── src/
│   ├── ui/                  # vendored 自 arshui 的原语与 token
│   │   ├── styles.css       # 主题 token（@theme inline + :root CSS 变量，换肤改这里）
│   │   ├── appLayout.tsx    # 应用壳：titleBar + 可选 sidebar + content
│   │   ├── titleBar.tsx     # 无边框标题栏（拖拽区 + 最小化/最大化/关闭/置顶）
│   │   ├── navItem.tsx      # 顶部导航项
│   │   ├── button.tsx       # 5 变体 × 3 尺寸 + loading + icon
│   │   ├── dialog.tsx       # portal 弹窗容器（Esc/遮罩关闭）
│   │   ├── tooltip.tsx      # 四向定位 + 视口钳制
│   │   ├── spinner.tsx / switch.tsx
│   ├── lib/                 # cn() 与 IPC 桥检测（getIpc，纯 Web 环境优雅降级）
│   ├── App.tsx              # 极简单页示例（原语用法查 src/ui 各文件顶部注释）
│   └── index.css
├── .temp/                   # 本地草稿（gitignore）
├── AGENTS.md                # AI 协作约定（引导式文件：首次 AI 会话采访你并生成正式约定）
└── electron-builder.json5
```

## 内置工程修复（对照文章《create-electron-vite 项目的 build 问题》）

1. **开箱 TS6133**：模板不含死代码，`tsc` 全绿；tsconfig include 覆盖 `src` 与 `electron`
2. **electron 二进制下载失败**：`electron-builder.json5` 已配 `electronDownload.mirror`（npmmirror）。实测 electron-builder 26 不读本地 zip 缓存，每次构建都会从镜像重新下载（约 40 秒）——慢但稳定，比 GitHub 直连的随机失败强
3. **asar 膨胀**：`dependencies` 为空，全部依赖在 devDependencies——asar 里没有 node_modules。新增主进程依赖时放 dependencies 并加进 `vite.config.ts` 的 `external`（详见 AGENTS.md）
4. **陈旧产物**：build 脚本前置清理 `dist/` 与 `dist-electron/`
5. **.gitignore**：完整覆盖 `dist-electron/`、`release/`、`.temp*`

## 版本

| 组件 | 版本 |
|---|---|
| electron | ^42.1.0 |
| electron-builder | ^26.15.3 |
| vite | ^7.2.6 |
| vite-plugin-electron | ^1.1.2 |
| react / react-dom | ^19.2.6 |
| typescript | ^6.0.3 |
| tailwindcss | ^4.3.3 |
| UI 原语 | vendored 自 @arshdelight/arshui 0.1.0 |
