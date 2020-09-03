<template>
  <div class="dd-page">
    <el-card class="box-card">
      <quanzi-mgmt></quanzi-mgmt>
    </el-card>
  </div>
</template>
<script>
import { Card } from 'element-ui';
import QuanziMgmt from '@/components/ChannelMgmt/quanzi_mgmt';

import { deepClone } from '@/utils/index.js';

export default {
  name: 'channel_main',
  data() {
    return {};
  },
  created() {},
  components: {
    QuanziMgmt,
  },
};
</script>
<style lang="scss" scoped></style>
