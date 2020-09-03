<template>
  <div class="vip_statistics">
    <el-card class="box-card">
      <search @search="memberStatistics" />
      <v-table :total="total" :statisticsList="statisticsList" @search="memberStatistics" />
    </el-card>
  </div>
</template>

<script>
import Search from './components/Search'
import Table from './components/Table'
import MemberStatisticsAPI from './model'

const memberStatisticsAPI = new MemberStatisticsAPI()
const config = { isDeleteEmpty: true }

export default {
  components: {
    Search,
    'v-table': Table,
  },

  data() {
    return {
      total: 0,
      statisticsList: []
    }
  },

  mounted() {
    this.memberStatistics()
  },

  methods: {
    /**
     * @description: 分页查询会员列表API
     * @param {Int} pageNum: 当前页数
     * @param {Int} pageSize: 一页显示多少数据
     * @param {Object} searchCondition: 搜索条件
     * @return:
     */
    memberStatistics(pageNum, pageSize, searchCondition) {
      memberStatisticsAPI.memberStatistics({
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        ...searchCondition
      }, config).then(res => {
        this.total = res.total
        this.statisticsList = res.list
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.vip_statistics{
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);
}
</style>
