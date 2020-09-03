<template>
  <div class="shop-map-wrapper">
    <shopMapSet></shopMapSet>
  </div>
</template>
<script>
// 标准电商地图设置
import shopMapSet from "@/components/ChannelMgmt/shopMapSet/index.vue";

import { deepClone } from "@/utils/index.js";
export default {
  name: "shopMapSetMngr",
  components: {
    shopMapSet
  },
  data() {
    return {};
  }
};
</script>