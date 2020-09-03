
<template>
  <div class="user_details_popup">
    <el-dialog
      class="popup"
      title="用户详情"
      :visible="view"
      @close="closePopup"
    >
      <div class="content">
        <el-tabs
          v-model="activeName"
          class="tabs"
          type="card"
          stretch
        >
          <el-tab-pane label="基本资料" name="data">
            <v-data :userDetails="userDetails" :columnList="columnList"/>
          </el-tab-pane>
          <el-tab-pane label="订单记录" name="order">
            <order :orderList="orderList" />
          </el-tab-pane>
          <el-tab-pane label="积分记录" name="integral">
            <integral
              :leijiJifen="userDetails.leijiJifen"
              :shengyuJifen="userDetails.shengyuJifen"
              :memberJifenList="memberJifenList"
              @getMemberJifenlist="getMemberJifenlist"
            />
          </el-tab-pane>
          <el-tab-pane label="分销记录" name="distribution">
            <distribution />
          </el-tab-pane>
          <el-tab-pane label="提现记录" name="withdraw">
            <withdraw />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Data from './data'
import Order from './order'
import Integral from './integral'
import Distribution from './distribution'
import Withdraw from './withdraw'
import { MemberSearchAPI } from '../../model'

const memberSearchAPI = new MemberSearchAPI()

export default {
  components: {
    'v-data': Data,
    Order,
    Integral,
    Distribution,
    Withdraw,
  },

  props: {
    userDetails: Object,
    view: Boolean,
  },

  mounted() {
    this.getMemberColumnInfo()
  },

  data() {
    return {
      show: false,
      activeName: 'data',
      columnList: [],
      orderList: [],
      memberJifenList: [],
    }
  },

  watch: {
    userDetails(val) {
      this.findMemberOrderPageList(this.userDetails.id)
      this.getMemberJifenlist()
    }
  },

  methods: {
    // 查询单位会员信息字段API
    getMemberColumnInfo() {
      memberSearchAPI.getMemberColumnInfo().then(res => {
        this.columnList = res
      })
    },

    /**
     * @description: 查询用户订单信息API
     * @param {Number} id: 用户id
     * @return:
     */
    findMemberOrderPageList(id) {
      memberSearchAPI.findMemberOrderPageList({
        pageNum: 1,
        pageSize: 10,
        memberId: id,
      }).then(res => {
        this.orderList = res.list
      })
    },

    // 会员积分查询API
    getMemberJifenlist() {
      memberSearchAPI.getMemberJifenlist({
        pageNum: 1,
        pageSize: 10,
      }).then(res => {
        this.memberJifenList = res
      })
    },

    // 关闭弹框
    closePopup() {
      this.$emit('update:view', false)
    },
  }
}
</script>
