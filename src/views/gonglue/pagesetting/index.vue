<template>
  <div class="dd-page">
    <el-card class="box-card">
      <gonglue-mgmt></gonglue-mgmt>
    </el-card>
  </div>
</template>
<script>
import { Card } from 'element-ui';
import GonglueMgmt from '@/components/ChannelMgmt/gonglue_mgmt';

import { deepClone } from '@/utils/index.js';

export default {
  name: 'channel_main',
  data() {
    return {};
  },
  created() {},
  components: {
    GonglueMgmt,
  },
};
</script>
<style lang="scss" scoped></style>
