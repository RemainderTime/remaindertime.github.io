# Giscus 评论系统配置指南

## 当前状态

评论组件已经集成到博客中，但需要完成以下配置步骤才能正常使用。

## 配置步骤

### 1. 启用 GitHub Discussions

1. 访问仓库页面：https://github.com/RemainderTime/remaindertime.github.io
2. 点击 **Settings（设置）**
3. 向下滚动到 **Features** 部分
4. 勾选 **Discussions** 复选框
5. 点击 **Set up discussions** 按钮

### 2. 安装 Giscus 应用

1. 访问 Giscus 配置页面：https://giscus.app/
2. 在 **Repository** 部分输入：`RemainderTime/remaindertime.github.io`
3. 确保仓库满足以下条件：
   - ✅ 仓库是公开的
   - ✅ 已安装 giscus 应用
   - ✅ 已启用 Discussions 功能

### 3. 配置 Giscus

在 https://giscus.app/ 页面上：

1. **Repository**: `RemainderTime/remaindertime.github.io`
2. **Page ↔️ Discussions Mapping**: 选择 `pathname`
3. **Discussion Category**: 选择 `General` 或创建新分类
4. **Features**: 
   - ✅ Enable reactions
   - 选择其他需要的功能
5. **Theme**: 选择 `light` 或 `preferred_color_scheme`

### 4. 获取配置代码

在页面底部，Giscus 会生成一段配置代码，类似：

```html
<script src="https://giscus.app/client.js"
        data-repo="RemainderTime/remaindertime.github.io"
        data-repo-id="R_kgDOxxxxxxx"
        data-category="General"
        data-category-id="DIC_kwDOxxxxxxx"
        ...
</script>
```

### 5. 更新配置文件

编辑文件 `_includes/giscus.html`，将以下两个参数替换为实际值：

```html
data-repo-id="YOUR_REPO_ID"        → data-repo-id="R_kgDOxxxxxxx"
data-category-id="YOUR_CATEGORY_ID" → data-category-id="DIC_kwDOxxxxxxx"
```

### 6. 提交更改

```bash
git add _includes/giscus.html
git commit -m "配置 Giscus 评论系统"
git push origin master
```

### 7. 等待部署

GitHub Pages 会自动重新构建网站，通常需要 2-5 分钟。

## 验证

部署完成后，访问任意文章页面，评论区应该正常显示，不再显示错误信息。

## 常见问题

### Q: 提示 "giscus is not installed on this repository"

**A**: 需要访问 https://github.com/apps/giscus 安装 Giscus 应用到你的仓库。

### Q: 提示 "Discussions is not enabled for this repository"

**A**: 需要在仓库设置中启用 Discussions 功能。

### Q: 评论区显示空白

**A**: 检查浏览器控制台是否有错误信息，确认配置参数是否正确。

### Q: 如何更改评论区主题？

**A**: 编辑 `_includes/giscus.html`，修改 `data-theme` 参数：
- `light` - 浅色主题
- `dark` - 深色主题
- `preferred_color_scheme` - 跟随系统主题

## 参考资源

- Giscus 官网：https://giscus.app/
- Giscus GitHub：https://github.com/giscus/giscus
- GitHub Discussions 文档：https://docs.github.com/en/discussions

## 需要帮助？

如果遇到问题，可以：
1. 查看 Giscus 官方文档
2. 在 GitHub Discussions 中提问
3. 检查浏览器控制台的错误信息

---

**提示**: 配置完成后，所有文章页面都会自动显示评论功能，无需额外设置。
