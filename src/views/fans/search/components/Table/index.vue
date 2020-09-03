<template>
  <div class="table">
    <span class="total">共搜索到 {{ totalCount }} 条数据</span>
    <div class="button_box">
      <el-button size="small" @click="notice">群发通知</el-button>
      <el-button size="small" @click="moveGroup">移动分组</el-button>
      <el-button size="small" @click="allSpeakOrMuted(1)">批量禁言</el-button>
      <el-button size="small" @click="allSpeakOrMuted(0)">撤销禁言</el-button>
      <el-popconfirm class="button" title="确定删除吗？" @onConfirm="del">
        <el-button size="small" slot="reference">删除</el-button>
      </el-popconfirm>
    </div>
    <div class="content">
      <el-table
        class="content_table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        row-key="id"
      >
        <el-table-column type="selection" reserve-selection align="center" />
        <el-table-column align="center">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.headUrl" />
          </template>
        </el-table-column>
        <el-table-column label="用户名称" align="center">
          <template slot-scope="scope">
            <span class="name">{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="idfv"
          label="系统来源"
          :formatter="idfvFilter"
          align="center"
        />
        <el-table-column prop="qudaoName" label="渠道" align="center" />
        <el-table-column prop="address" label="地址" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.provinceName }}
              {{ scope.row.cityName }}
              {{ scope.row.areaName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册日期" align="center">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="levelId"
          label="等级"
          :formatter="levelIdFilter"
          align="center"
        />
        <el-table-column prop="totlePrice" label="消费金额" align="center" />
        <el-table-column label="禁言" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.gag"
              :active-value="1"
              :inactive-value="0"
              @change="modifyGag(scope.row.id + '', scope.row.gag)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center" />
        <el-table-column prop="email" label="电子邮箱" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="operating">
              <span class="button" @click="getMemberInfo(scope.row.id)">查看</span>
              <span class="line">|</span>
              <span class="button" @click="edit(scope.row)">编辑</span>
              <span class="line">|</span>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteMember(scope.row.id)">
                <span class="button" slot="reference">删除</span>
              </el-popconfirm>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <group
        :list="groupList"
        :createGroup="createGroup"
        :updateGroup="updateGroup"
        @findGroupList="findGroupList"
        @deleteGroup="deleteGroup"
      />
    </div>
    <div class="pagination">
      <pagination
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :total="totalCount"
        :currentPage="currentPage"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </div>
    <notice-popup :noticeShow.sync="noticeShow" />
    <group-popup
      :group.sync="group"
      :ids="ids"
      @clearSelection="clearSelection"
      @findGroupList="findGroupList"
    />
    <user-details-popup :view.sync="view" :userDetails="userDetails" />
    <edit-popup :editUserShow.sync="editUserShow" :currentData="currentData" @refreshData='refreshData'/>
  </div>
</template>

<script>
import Group from '@/components/Group'
import NoticePopup from '../NoticePopup'
import GroupPopup from '../GroupPopup'
import UserDetailsPopup from '../UserDetailsPopup'
import EditPopup from '../EditPopup'
import Pagination from '@/components/Pagination'
import { MemberSearchAPI, MemberGroupAPI } from '../../model'

const memberSearchAPI = new MemberSearchAPI()
const memberGroupAPI = new MemberGroupAPI()

export default {
  components: {
    Group,
    NoticePopup,
    GroupPopup,
    UserDetailsPopup,
    EditPopup,
    Pagination
  },

  props: {
    totalCount: Number,
    tableData: Array,
    gradeList: Array
  },

  data() {
    return {
      userDetails: {},
      currentData: {},
      noticeShow: false,
      group: false,
      view: false,
      editUserShow: false,
      pageSize: 1,
      pageSizes: [10, 15, 20, 25, 30],
      currentPage: 1,
      currentPageSizes: null,
      ids: '',
      groupList: []
    }
  },

  mounted() {
    this.findGroupList()
  },

  methods: {
    // 查询会员分组列表API
    findGroupList() {
      memberGroupAPI.findGroupList().then(res => {
        this.groupList = res
      })
    },

    /**
     * @description: 创建会员分组API
     * @param {String} name: 分组名称
     * @return:
     */
    createGroup(name) {
      return memberGroupAPI.createGroup({
        name
      })
    },

    /**
     * @description: 编辑会员分组API
     * @param {Int} id: 会员分组ID
     * @param {String} name: 分组名称
     * @return
     */
    updateGroup(id, name) {
      return memberGroupAPI.updateGroup({
        id,
        name
      })
    },

    /**
     * @description: 删除会员分组(单个/批量)API
     * @param {String} idsArr 会员id
     * @return:
     */
    deleteGroup(idsArr) {
      memberGroupAPI.deleteGroup({
        idsArr
      }).then(res => {
        this.findGroupList()
      })
    },

    /**
     * @description: 批量修改会员禁言状态API
     * @param {String} ids: 会员id
     * @param {Int} gag: 禁言状态（0否 1是）
     * @return:
     */
    modifyGag(ids, gag) {
      memberSearchAPI.modifyGag({
        ids,
        gag
      }).then(res => {
        this.clearSelection()
        this.refreshData()
      })
    },

    /**
     * @description: 根据会员id查询会员详情API
     * @param {Int} id: 会员id
     * @return:
     */
    getMemberInfo(id) {
      memberSearchAPI.getMemberInfo({
        id
      }).then(res => {
        this.userDetails = res
        this.view = true
      })
    },

    /**
     * @description: 批量删除会员（物理删除）API
     * @param {Int} id: 会员id
     * @return:
     */
    deleteMember(id) {
      memberSearchAPI.deleteMember({
        idsArr: id,
      }).then(res => {
        this.clearSelection()
        this.refreshData()
      })
    },

    // 系统来源数据，过滤器
    idfvFilter(row, column, cellValue) {
      switch (cellValue) {
        case '0':
          return '小程序'
        case '1':
          return '公众号'
        case '2':
          return 'APP'
      }
    },

    // 等级数据，过滤器
    levelIdFilter(row, column, cellValue) {
      const levelId = this.gradeList.find(item => item.id === cellValue)
      return levelId ? levelId.levelName : ''
    },

    // 移动分组
    moveGroup() {
      const list = this.$refs.multipleTable.selection
      if (list.length === 0) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return
      }
      const id = list.map(item => item.id).join(',')
      this.ids = id
      this.group = true
    },

    // 群发通知
    notice() {
      const list = this.$refs.multipleTable.selection
      if (list.length === 0) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return
      }
      this.noticeShow = true
    },

    /**
     * @description: 批量禁言或发言
     * @param {Int} gag: 禁言状态（0否 1是）
     * @return:
     */
    allSpeakOrMuted(gag) {
      const list = this.$refs.multipleTable.selection
      if (list.length === 0) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return
      }
      const id = list.map(item => item.id).join(',')
      this.modifyGag(id, gag)
    },

    /**
     * @description: 编辑用户
     * @param {Object} 某一个用户的信息
     * @return:
     */
    edit(data) {
      this.currentData = data
      this.editUserShow = true
    },

    // 删除用户
    del() {
      const list = this.$refs.multipleTable.selection
      if (list.length === 0) {
        this.$message({
          message: '请选择用户',
          type: 'warning'
        })
        return
      }
      const id = list.map(item => item.id).join(',')
      this.deleteMember(id)
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

    // 清空表格选择状态
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },

    // 刷新表格数据
    refreshData() {
      this.$emit('search', this.currentPage, this.currentPageSizes)
    },
  },
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
    .button {
      margin-left: 10px;
    }
  }
  .content {
    position: relative;
    display: flex;
    margin-top: 20px;
    padding-right: 140px;
    .content_table {
      font-size: 12px;
      color: #989898;
      .name {
        font-size: 14px;
        color: #656565;
      }
      .operating {
        .button {
          padding: 0 2px;
          color: #108ee9;
          cursor: pointer;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>