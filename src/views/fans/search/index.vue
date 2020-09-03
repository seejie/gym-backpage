<template>
  <div class="vip_inquire">
    <el-card class="box-card">
      <search :gradeList="gradeList" :searchCondition="searchCondition" @search="getMemberlist"/>
      <v-table
        :totalCount="totalCount"
        :tableData="tableData"
        :gradeList="gradeList"
        @search="getMemberlist"
      />
    </el-card>
  </div>
</template>

<script>
import Search from './components/Search'
import Table from './components/Table'
import MemberGradeAPI from '../grade/model'
import { MemberSearchAPI } from './model'
import { Loading } from 'element-ui'

const memberGradeAPI = new MemberGradeAPI()
const memberSearchAPI = new MemberSearchAPI()
const config = { isDeleteEmpty: true }

export default {
  components: {
    Search,
    'v-table': Table,
  },

  data() {
    return {
      totalCount: 0,
      tableData: [],
      gradeList: [],
      searchCondition: {},
    }
  },

  mounted() {
    this.getMemberlist()
    memberGradeAPI.findLevelList().then(res => {
      this.gradeList = res
    })
  },

  methods: {
    /**
     * @description: 分页查询会员列表API
     * @param {Int} pageNum: 当前页数
     * @param {Int} pageSize: 一页显示多少数据
     * @param {Object} searchCondition: 搜索条件
     * @return:
     */
    getMemberlist(pageNum, pageSize, searchCondition) {
      memberSearchAPI.getMemberlist({
        pageNum: pageNum || 1,
        pageSize: pageSize || 10,
        sortStr: 'id',
        ...searchCondition
      }, config).then(res => {
        this.totalCount = res.total
        this.tableData = res.list
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.vip_inquire {
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);
}
</style>
