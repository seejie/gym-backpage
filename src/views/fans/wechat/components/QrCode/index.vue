<template>
  <div class="qr_code">
    <img class="img" src="https://iph.href.lu/160x160">
    <div class="url">
      <p>URL：</p>
      <p>https://kf.qq.com/faq/120911VrYVrA150930NVBRRR.html</p>
    </div>
    <div class="button_box">
      <el-button class="button">复制链接</el-button>
      <el-button class="button" type="primary">下载二维码</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.qr_code {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    margin-top: 60px;
  }
}
</style>