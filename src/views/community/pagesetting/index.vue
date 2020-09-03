<template>
  <div class="dd-page">
    <el-card class="box-card">
      <shequn-mgmt></shequn-mgmt>
    </el-card>
  </div>
</template>
<script>
import { Card } from 'element-ui';
import ShequnMgmt from '@/components/ChannelMgmt/shequn_mgmt';

import { deepClone } from '@/utils/index.js';

export default {
  name: 'channel_main',
  data() {
    return {};
  },
  created() {},
  components: {
    ShequnMgmt,
  },
};
</script>
<style lang="scss" scoped></style>
