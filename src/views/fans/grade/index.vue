<template>
  <div class="vip_grade">
    <el-card class="box-card">
      <div class="button_box">
        <el-button size="small" @click="addGradeShow">添加级别</el-button>
      </div>
      <el-table class="table" :data="tableData" stripe>
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="levelName" label="用户等级" align="center" />
        <el-table-column prop="Jifen" label="积分区间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.lowestJifen }} ~ {{ scope.row.highestJifen | highestJifenFilters }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zhekou" label="折扣" align="center">
          <template slot-scope="scope">
            {{ scope.row.zhekou | zhekouFilters }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="operating">
              <span class="button" @click="authority(scope.row)">权限</span>
              <span class="line">|</span>
              <span class="button" @click="edit(scope.row.id)">编辑</span>
              <span class="line">|</span>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteLevel(scope.row.id)">
                <span class="button" slot="reference">删除</span>
              </el-popconfirm>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <add-grade-popup :addGrade.sync="addGrade" :currentData="currentData" @findLevelList="findLevelList" />
      <authority-popup :authorityShow.sync="authorityShow" :channelList="currentChannelList" :currentData="currentData" />
    </el-card>
  </div>
</template>

<script>
import AddGradePopup from './components/AddGradePopup'
import AuthorityPopup from './components/AuthorityPopup'
import MemberGradeAPI from './model'

const memberGradeAPI = new MemberGradeAPI()

export default {
  components: {
    AddGradePopup,
    AuthorityPopup
  },

  filters: {
    // 最高积分过滤器
    highestJifenFilters(val) {
      return val === 999999999 ? ' ' : val
    },

    // 折扣过滤器
    zhekouFilters(val) {
      return (val * 10).toFixed(1)
    }
  },

  data() {
    return {
      tableData: [],
      channelList: [],
      currentChannelList: [],
      currentData: {},
      addGrade: false,
      authorityShow: false
    }
  },

  mounted() {
    this.findLevelList()
    this.getAllChannelByUnitId()
  },

  methods: {
    // 查询权限名称列表API
    getAllChannelByUnitId() {
      memberGradeAPI.getAllChannelByUnitId().then(res => {
        this.channelList = res.channelList.map(element => ({
          ...element,
          isBrowse: 0,
          isOperate: 0
        }))
      })
    },

    // 查询会员等级列表API
    findLevelList() {
      memberGradeAPI.findLevelList().then(res => {
        this.tableData = res
      })
    },

    /**
     * @description: 删除会员等级(单个/批量)API
     * @param {String} idsArr: 某一条等级的id
     * @return:
     */
    deleteLevel(idsArr) {
      memberGradeAPI.deleteLevel({
        idsArr
      }).then(res => {
        this.findLevelList()
      })
    },

    /**
     * @description: 查询某一条会员等级的权限列表API
     * @param {int} levelId: 某一条等级的id
     * @return:
     */
    findLevelRuleList(levelId) {
      memberGradeAPI.findLevelRuleList({
        levelId
      }).then(res => {
        this.gradeAndAuthority(res)
      })
    },

    // 显示添加级别弹框
    addGradeShow() {
      this.currentData = {}
      this.addGrade = true
    },

    /**
     * @description: 重构某一条等级的权限列表数据结构
     * @param {Array} list: 某一条等级权限列表
     * @return:
     */
    gradeAndAuthority(list) {
      if (list.length !== 0) {
        // 如果等级权限列表不为空，找到某一条等级id的对应数据，重构到currentChannelList变量
        this.currentChannelList = this.channelList.map(element => {
          const channe = list.find(item => element.id === item.channelId)
          return channe ? { ...element, isBrowse: channe.isBrowse, isOperate: channe.isOperate } : element
        })
      } else {
        // 如果等级权限列表为空，赋予一个初始值，给currentChannelList变量
        this.currentChannelList = this.channelList.map(e => ({
          ...e,
          isOperate: 0,
          isBrowse: 0,
        }))
      }
      this.authorityShow = true
    },

    /**
     * @description: 显示权限设置弹框
     * @param {Object} data: 某一条等级数据
     * @return:
     */
    authority(data) {
      this.currentData = data
      this.findLevelRuleList(data.id)
    },

    /**
     * @description: 显示编辑弹框
     * @param {int} id: 某一条等级的id
     * @return:
     */
    edit(id) {
      const tableData = this.tableData
      this.currentData = tableData.find(item => item.id === id)
      this.addGrade = true
    },
  }
}
</script>

<style lang="scss" scoped>
.vip_grade {
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);
  .button_box {
    margin-top: 20px;
  }
  .table {
    margin-top: 20px;
    .operating {
      .button {
        padding: 0 2px;
        color: #108ee9;
        cursor: pointer;
      }
    }
  }
}
</style>