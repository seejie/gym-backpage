<template>
<span>
  <router-link to="/dashboard/assist">
    <el-badge :is-dot="isDot" class="item">
      <i class="el-icon-question"></i>
    </el-badge>
  </router-link>
</span>


</template>
<script>
export default {
    data() {
      return {
        isDot: true
      }
    }
}
</script>
<style lang="scss" scoped>
.item {
  vertical-align: middle;
  cursor: pointer;
  line-height: 1.2;
  .el-icon-bell {
    font-size: 18px;
  }
}
</style>
