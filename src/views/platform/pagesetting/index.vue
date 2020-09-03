<template>
  <div class="dd-page">
    <el-card class="box-card">
      <yanse-mgmt></yanse-mgmt>
    </el-card>
  </div>
</template>
<script>
import { Card } from 'element-ui';
import yanseMgmt from '@/components/ChannelMgmt/yanse_mgmt';

import { deepClone } from '@/utils/index.js';

export default {
  name: 'channel_main',
  components: {
    yanseMgmt,
  },
};
</script>
<style lang="scss" scoped></style>
