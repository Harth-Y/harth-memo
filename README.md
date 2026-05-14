# Harth的备忘录

一个纯静态的个人经验帖子网站模板，可直接部署到 GitHub Pages。

## 文件说明

- `index.html`：首页、帖子列表、搜索、分类、收藏、草稿、时间线、标签管理。
- `post.html`：帖子详情页。
- `data.js`：内置示例帖子和本地存储工具。
- `app.js`：交互逻辑。
- `styles.css`：页面样式和动效。

## 本地使用

直接用浏览器打开 `index.html` 即可。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `harth-memo`。
2. 上传这些文件到仓库根目录：
   - `.nojekyll`
   - `.gitignore`
   - `README.md`
   - `index.html`
   - `post.html`
   - `data.js`
   - `app.js`
   - `styles.css`
3. 进入仓库 `Settings -> Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，Folder 选择 `/root`。
6. 保存后等待 GitHub 生成访问地址。

## 注意

新增帖子、草稿、收藏和侧栏折叠状态目前保存在浏览器 `localStorage`。

这意味着它们只保存在当前设备和当前浏览器里。换设备访问时，只能看到 `data.js` 里的内置帖子。后续如果需要多设备同步，需要接后端、数据库，或改成通过 GitHub/JSON 文件管理内容。
