<template>
  <div class="table">
    <span class="total">共搜索到 {{ total }} 条数据</span>
    <div class="button_box">
      <el-button size="small">导出</el-button>
    </div>
    <el-table
      class="content_table"
      ref="multipleTable"
      :data="statisticsList"
      tooltip-effect="dark"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="riqi" label="统计日期" align="center" />
      <el-table-column prop="source" label="系统来源" align="center" />
      <el-table-column prop="channel" label="渠道" align="center" />
      <el-table-column prop="address" label="省市" align="center" />
      <el-table-column prop="createMemberNum" label="新增会员" align="center" />
      <el-table-column prop="leijiMemberNum" label="累计会员" align="center" />
      <el-table-column prop="leijiPayNum" label="累计付费会员" align="center" />
      <el-table-column prop="riHuoYueNum" label="日活跃会员数" align="center" />
    </el-table>
    <div class="pagination">
      <pagination
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :total="total"
        :currentPage="currentPage"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },

  props: {
    total: Number,
    statisticsList: Array,
  },

  data() {
    return {
      pageSize: 1,
      pageSizes: [10, 15, 20, 25, 30],
      currentPage: 1,
      currentPageSizes: null,
    }
  },

  methods: {
    // 分页器，跳转页面
    currentChange(val) {
      this.currentPage = val
      this.$emit('search', val, this.currentPageSizes)
    },

    // 分页器，修改一页显示的数据条数
    sizeChange(val) {
      this.currentPage = 1
      this.currentPageSizes = val
      this.$emit('search', null, val)
    },

    // 刷新表格数据
    refreshData() {
      this.$emit('search', this.currentPage)
    },
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 14px;
  .total {
    font-size: 12px;
    color: #989898;
  }
  .button_box {
    margin-top: 20px;
  }
  .content_table {
    margin-top: 20px;
    color: #989898;
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>