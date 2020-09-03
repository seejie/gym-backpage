<template>
  <div class="dd-page">
    <el-card class="box-card">
      <my-mgmt :channelData="channelData"></my-mgmt>
    </el-card>
  </div>

</template>
<script>
  import {
    Card
  } from "element-ui";
  import myMgmt from "@/components/ChannelMgmt/my_mgmt";
  import {
    deepClone
  } from '@/utils/index.js'

  export default {
    name: 'channel_main',
    data() {
      return {
        channelData: {}
      }
    },
    created() {
    },
    components: {
      myMgmt,
    }
  }

</script>
<style lang="scss" scoped>

</style>
