<template>
<div class="wechat">
  <el-card class="box-card">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="申请商户" />
      <el-step title="申请会员卡" />
      <el-step title="卡券二维码" />
    </el-steps>
    <application-merchant v-if="active === 0" @next="next"/>
    <application-vip-card v-if="active === 1" @next="next" />
    <qr-code v-if="active >= 2" @next="next" />
  </el-card>
</div>
</template>

<script>
import ApplicationMerchant from './components/ApplicationMerchant'
import ApplicationVipCard from './components/ApplicationVipCard'
import QrCode from './components/QrCode'

export default {
  components: {
    ApplicationMerchant,
    ApplicationVipCard,
    QrCode
  },

  data() {
    return {
      active: 0
    }
  },

  methods: {
    // 下一步
    next() {
      if (this.active++ > 2) this.active = 2
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat{
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);
}
</style>