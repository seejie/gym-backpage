<template>
  <el-pagination
    @size-change="sizeChange"
    @current-change="currentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      currentPage: {
        type: Number,
        default: 1
      },
      pageSizes: {
        type: Array
      },
      pageSize: {
        type: Number
      },
      total: {
        type: Number
      }
    },
    data() {
      return {}
    },
    methods: {
      sizeChange(val) {
        this.$emit('sizeChange', val);
      },
      currentChange(val) {
        this.$emit('currentChange', val);
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
