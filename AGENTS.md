# AGENTS.md

本仓库是 `create-arsh-electron`（npm 脚手架包）。改动的验收标准：

- CLI 改动后必须本地跑一次真实生成验证：`node index.js <name> --yes`（必要时加参数），检查生成项目的 `.gitignore` / `.npmrc` / appId / author，再进项目跑 `npm install`、`npm run lint`、`npx tsc --noEmit`、`npm test` 全绿；动到模板依赖或构建时加跑 `npm run build`
- 模板目录用无点命名（`gitignore` / `npmrc` / `temp/`），CLI 拷贝后补点——npm 发布会剔除树里的 `.gitignore` / `.npmrc`，嵌套 `.gitignore` 规则在 pack 时也生效，别把点文件直接放回 template
- 验收以 `npm pack --dry-run` 的产物为准，不以源码目录为准

## 发布清单

1. `template/` 里 `npm install --package-lock-only` 刷新锁文件（每次发布都做，防止依赖树过期）
2. 根目录版本号 +1，同步 package-lock（`npm install --package-lock-only`）
3. `npm pack --dry-run` 核对文件清单（36+ 文件，gitignore/npmrc/temp 必须在列）
4. commit + push（CI 不拦本仓库，发布以人工核对为准）
5. `npm publish`（人工执行）
