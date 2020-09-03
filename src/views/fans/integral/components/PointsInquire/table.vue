<template>
  <div class="table">
    <span class="total">共搜索到 {{ total }} 条数据</span>
    <div class="button_box">
      <el-button size="small" @click="exportMemberJifen">导出</el-button>
    </div>
    <el-table
      class="content_table"
      ref="multipleTable"
      :data="integralList"
      tooltip-effect="dark"
      row-key="id"
    >
      <el-table-column type="selection" reserve-selection align="center" />
      <el-table-column align="center">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.headUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名称" align="center" />
      <el-table-column prop="mobile" label="手机号" align="center" />
      <el-table-column prop="ruleName" label="规则" align="center" />
      <el-table-column
        prop="jifenType"
        label="类型"
        align="center"
        :formatter="jifenTypeFilter"
      />
      <el-table-column prop="createTime" label="发生时间" align="center" />
      <el-table-column prop="jifenNum" label="积分变动" align="center" />
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
  props: {
    total: Number,
    integralList: Array
  },

  components: {
    Pagination
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
    // 积分类型，过滤器
    jifenTypeFilter(row, column, cellValue) {
      switch (cellValue) {
        case 0:
          return '积分消耗'
        case 1:
          return '积分获取'
      }
    },

    // 分页器，跳转页面
    currentChange(val) {
      this.currentPage = val
      this.$emit('search', val, this.currentPageSizes)
    },

    // 分页器，修改一页显示的数据条数
    sizeChange(val) {
      this.currentPage = 1
      this.currentPageSizes = val
      this.$emit('search', '', val)
    },

    // 导出会员积分事件
    exportMemberJifen() {
      this.$emit('exportMemberJifen')
    }
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