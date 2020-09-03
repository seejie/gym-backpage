<template>
  <div class="activeManage">
    <formList></formList>
  </div>
</template>
<script>
import formList from '@/components/FormComponent/index'
export default {
  name: 'addactiveManage',
  components: {
    formList
  }
}
</script>
<style lang="scss" scoped>
.activeManage {
  @extend %fill;
  padding: 10px 15%;
}
</style>
