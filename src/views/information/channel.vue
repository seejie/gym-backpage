<template>
  <div class="dd-page">
    <el-card class="box-card">
      <zixun-mgmt :channelData="channelData"></zixun-mgmt>
    </el-card>
  </div>
</template>
<script>
import { Card } from 'element-ui';
import zixunMgmt from '@/components/ChannelMgmt/zixun_mgmt';

import { deepClone } from '@/utils/index.js';

export default {
  name: 'channel_main',
  data() {
    return {
      channelData: {
        channelList: [],
      },
    };
  },
  created() {},
  components: {
    zixunMgmt,
  },
};
</script>
<style lang="scss" scoped></style>
