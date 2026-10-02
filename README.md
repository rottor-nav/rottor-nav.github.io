# 若途官网

[www.rottor.co](https://www.rottor.co/) 的静态落地页，用 Jekyll 构建，由 GitHub Pages 发布。

页面包括首页、[隐私政策](privacy-policy.md)和[服务条款](terms-of-service.md)。文案与界面结构来自原 Next.js 官网。

## 本地预览

```bash
bundle install
bundle exec jekyll serve
```

打开 <http://127.0.0.1:4000>。

Android 安装包地址写在 `_config.yml` 的 `apk_url`。

## 发布

仓库用 GitHub Actions 构建 Jekyll，再发布到 GitHub Pages。在仓库 Settings → Pages → Build and deployment 里，把 Source 选成 **GitHub Actions**。

自定义域名写在 `CNAME`（`www.rottor.co`）。DNS 需要把 `www` 的 CNAME 指到 `rottor-nav.github.io`。
