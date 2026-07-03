<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    <footer class="app-footer">
      <div class="footer-inner">
        <p>&copy; {{ new Date().getFullYear() }} 我的博客 - 分享生活，记录思考</p>
        <p class="footer-links">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/archive">归档</nuxt-link>
          <nuxt-link to="/about">关于</nuxt-link>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-footer {
  background: var(--footer-bg);
  border-top: 1px solid var(--border-light);
  padding: 24px 0;
  margin-top: 40px;

  .footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;

    .footer-links {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      gap: 16px;

      a {
        color: var(--text-muted);
        &:hover { color: var(--accent-color); }
      }
    }
  }
}
</style>
