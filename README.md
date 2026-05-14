# Harth的备忘录

一个个人经验帖子网站模板，可部署到 GitHub Pages，也可以接入腾讯云 CloudBase 做国内可访问的数据同步。

## 文件说明

- `index.html`：首页、帖子列表、搜索、分类、收藏、草稿、时间线、标签管理。
- `post.html`：帖子详情页。
- `data.js`：内置示例帖子、CloudBase 配置和数据存储工具。
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

当前版本已接入 CloudBase 环境：

```text
harth-memo-d6gdb1w0mc5a4c12f
```

未登录用户是只读模式，可以查看已发布帖子。管理员登录后可以发布帖子、保存草稿、收藏和删除云端帖子。

上线前需要在 CloudBase 控制台把网站域名加入 Web 安全域名，例如：

```text
https://harth-y.github.io
```

如果 CloudBase SDK 加载失败或云端连接失败，页面会保留内置示例帖子作为降级内容。
