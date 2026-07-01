<template>
  <div class="page-container">
    <div class="about-page card">
      <h1 class="about-title">关于我</h1>
      <div class="about-content">
        <p>欢迎来到我的博客！</p>
        <p>这是一个记录生活、分享思考的个人博客。在这里，我会分享技术心得、生活感悟和各种有趣的故事。</p>
        <p>如果你有任何问题或建议，欢迎在文章下方留言，或者通过以下方式联系我。</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 40px;

  .about-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .about-content {
    font-size: 16px;
    line-height: 1.8;

    p {
      margin-bottom: 16px;
      color: var(--text-secondary);
    }
  }
}
</style>
