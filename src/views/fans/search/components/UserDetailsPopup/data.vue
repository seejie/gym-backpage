<template>
  <div class="data">
    <el-form label-width="80px">
      <el-form-item
        v-for="item in columnList"
        :key="item.id"
        class="form_item"
        :label="item.name"
      >
        <span>{{ userDetails[item.columnName] }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    userDetails: Object,
    columnList: Array
  },
}
</script>

<style lang="scss" scoped>
.data {
  height: 400px;
  overflow-y: auto;
  .form_item {
    margin-bottom: 0;
  }
}

</style>