<template>
  <div class="dd-page">
    <el-card class="box-card">
      <cezu-mgmt></cezu-mgmt>
    </el-card>
  </div>
</template>
<script>
import { Card } from 'element-ui';
import CezuMgmt from '@/components/ChannelMgmt/cezu_mgmt';

import { deepClone } from '@/utils/index.js';

export default {
  name: 'channel_main',
  data() {
    return {};
  },
  created() {},
  components: {
    CezuMgmt,
  },
};
</script>
<style lang="scss" scoped></style>
