<template>
  <div class="points_inquire">
    <search @search="getMemberJifenlist"/>
    <v-table
      :total="total"
      :integralList="integralList"
      @search="getMemberJifenlist"
      @exportMemberJifen="exportMemberJifen"
    />
  </div>
</template>

<script>
import Search from './search'
import Table from './table'
import MemberIntegralAPI from '../../model'

const memberIntegralAPI = new MemberIntegralAPI()

export default {
  components: {
    Search,
    'v-table': Table
  },

  data() {
    return {
      total: 0,
      integralList: []
    }
  },

  mounted() {
    this.getMemberJifenlist()
  },

  methods: {
    /**
     * @description: 会员积分查询API
     * @param {Int} pageNum: 当前页数
     * @param {Int} pageSize: 一页显示多少数据
     * @param {Object} searchCondition: 搜索条件
     * @return:
     */
    getMemberJifenlist(pageNum, pageSize, searchCondition) {
      memberIntegralAPI.getMemberJifenlist({
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        ...searchCondition
      }).then(res => {
        this.integralList = res.list
        this.total = res.total
      })
    },

    /**
     * @description: 导出会员积分API
     * @param {Int} pageNum: 当前页数
     * @param {Int} pageSize: 一页显示多少数据
     * @param {Object} searchCondition: 搜索条件
     * @return:
     */
    exportMemberJifen() {
      memberIntegralAPI.exportMemberJifen({
        pageNum: 1,
        pageSize: 10,
      }).then(res => {})
    }
  }
}
</script>