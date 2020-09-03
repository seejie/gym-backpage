<template>
  <div class="upload-container">
    <slot :addGoodsStyle="addGoodsStyle"></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['storeSeting']),
    ...mapGetters(['addGoodsStyle']),
  },
  created() {
    if (!this.storeSeting.id) {
      this.$store.dispatch('storeSet/getStoreConfig');
    }
  },
};
</script>
