<template>
  <div class="activeManage">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'activeManage',
  data () {
    return {

    }
  },
}
</script>
<style lang="scss" scoped>
.activeManage {
  @extend %fill;
}
</style>
