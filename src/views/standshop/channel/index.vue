<template>
  <div class="dd-page">
    <el-card class="box-card">
      <dianshang-mgmt></dianshang-mgmt>
    </el-card>
  </div>

</template>
<script>
  import {
    Card
  } from "element-ui";
  import dianshangMgmt from "@/components/ChannelMgmt/dianshang_mgmt";

  import {
    deepClone
  } from '@/utils/index.js'

  export default {
    name: 'channel_main',
    data() {
      return {
      }
    },

    components: {
      dianshangMgmt,
    }
  }

</script>
<style lang="scss" scoped>

</style>
