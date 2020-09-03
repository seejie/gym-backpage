<template>
  <div class="copyright">
    <div @click="link">{{loginInfo && loginInfo.copyright}} {{ loginInfo && loginInfo.beianInfo}}</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('user', ['loginInfo'])
  },

  methods: {
    link() {
      if(this.loginInfo && this.loginInfo.beianUrl) {
        window.open(this.loginInfo.beianUrl)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.copyright {
  width: 100%;
  padding-top: 10px;
  font-size: 14px;
  color: #999;
}
.copyright > div {
  text-align: center;
  cursor: pointer;
}
</style>
