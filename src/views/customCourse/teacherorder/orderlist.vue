<template>
  <div >
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form v-if="isshowsearch" :inline="true" ref="formInline" label-width="80px" label-position="left"  :model="searchData">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="orderSn" label="订单编号">
              <el-input v-model="searchData.orderCode" placeholder="请输入" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="status" label="订单状态">
              <el-select placeholder="请选择" v-model="status" >
                <el-option label="待付款" :value="'0'"></el-option>
                <el-option label="待核销" :value="'2'"></el-option>
                <el-option label="待评价" :value="'7'"></el-option>
                <el-option label="待退款" :value="'6'"></el-option>
                <el-option label="已退款" :value="'5'"></el-option>
                <el-option label="已完成" :value="'3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="" label="下单时间">
              <el-date-picker v-model="searchData.searchdate" type="daterange" range-separator="~"
                              format="yyyy-MM-dd"  value-format="yyyy-MM-dd"      start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8">
            <el-form-item prop="customerName" label="用户名">
              <el-input v-model="searchData.customerName" placeholder="请输入" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="customerPhone" label="用户手机">
              <el-input v-model="searchData.customerPhone" placeholder="请输入" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="courseTitle" label="课程名称">
              <el-input v-model="searchData.courseTitle" placeholder="请输入" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="customName" label="系统来源">
              <el-select placeholder="请选择" v-model="searchData.idfv" >
                <el-option label="公众号" :value="1"></el-option>
                <el-option label="小程序" :value="2"></el-option>
                <el-option label="APP" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qudaoId" label="渠道来源">
              <el-select placeholder="请选择" v-model="searchData.qudaoId" >
                <el-option label="全部" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col  :span="24" style="text-align: right">
            <el-form-item>
              <el-button type="primary" @click="load">搜索</el-button>
              <el-button @click="reset">重置</el-button>
              <span style="color:#409EFF;cursor: pointer" @click="showsearch">收起 <i class="el-icon-arrow-up"></i></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form v-else>
        <el-row >
          <el-col  :span="24" style="text-align: center">
            <el-form-item>
              <span style="color:#409EFF;cursor: pointer" @click="showsearch">展开 <i class="el-icon-arrow-down"></i></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="batchPublish(1)">批量核销</el-button>
        <el-button @click="batchPublish(2)">批量退款</el-button>
        <el-button >导出</el-button>
      </div>
      <!--表格-->
      <el-table :data="list"  style="width: 100%;" @selection-change="selectionchange">
        <el-table-column type="selection" width="55px"></el-table-column>
        <el-table-column   type="index" label="序号"></el-table-column>
        <el-table-column prop="code" width="180px" label="订单编号" ></el-table-column>
        <el-table-column prop="productName" width="180px" label="课程名称" ></el-table-column>
        <el-table-column prop="totalPrice" label="金额（元）" ></el-table-column>
        <el-table-column prop="customerName" label="客户姓名" ></el-table-column>
        <el-table-column prop="customerMobile" width="120px" label="手机号" ></el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <span style="color: #00CC00" v-if="scope.row.orderStatus==2 || scope.row.orderStatus==1">• 待核销</span>
            <span style="color: #FF0000" v-else-if="scope.row.orderStatus==5&&scope.row.postSaleStatus==17">• 待退款</span>
            <span  v-else>{{scope.row.orderStatus==0?'待支付':(scope.row.orderStatus==5&&(scope.row.postSaleStatus==22 || scope.row.postSaleStatus==18)?"已退款":(scope.row.orderStatus==3&&scope.row.orderIscommit==1?'已完成':"待评价"))}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idfv" label="系统来源"></el-table-column>
        <el-table-column prop="unitName" width="200px" label="店铺"></el-table-column>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <el-button type="text"><el-link type="primary" @click="getonedetail(scope.row.id,1)">详情</el-link></el-button>
            <el-button type="text"><el-link type="primary" v-if="scope.row.orderStatus==2 || scope.row.orderStatus==1" @click="getonedetail(scope.row.id,2)">核销</el-link></el-button>
            <el-button type="text"><el-link type="primary" v-if="scope.row.orderStatus==5&&scope.row.postSaleStatus==17" @click="getonedetail(scope.row.id,3)">退款</el-link></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px">
        <Pagination v-if="list.length!=0" :pageSize="searchData.pageSize"
                    :pageSizes="pageSizes" :total="totalCount"
                    @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
      </div>
      <OrderDialog  ref='orderDialog' v-if="detaildata!=null" @load="load" :type="type" :curtype="1" :productName="'教师名称'" :detailObj="detaildata"/>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Pagination from '../../../components/Pagination'
import { teacherorder } from '@/api/customCourse/customCourse'
import OrderDialog from '@/components/customcourse/OrderDialog'
export default {
  components: {
    Pagination,
    OrderDialog
  },
  props: {
    orderType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showlink: false,
      status: this.orderType,
      searchData: {
        orderCode: '',
        status: '',
        customerName: '',
        customerPhone: '',
        customName: '',
        beginTime: [],
        endTime: [],
        searchdate: [],
        idfv: '',
        courseTitle: '',
        qudaoId: '',
        pageSize: 10,
        pageNum: 1
      },
      // 分页
      totalCount: 0,
      pageSizes: [10, 20, 30],
      //
      list: [],
      // 全选
      ids: [],
      isshowsearch: true,
      areaList: [],
      detaildata: {},
      type: 1
    }
  },
  created() {
    this.searchData.pageSize = this.pageSizes[0]
    this.load()
  },
  methods: {
    // 获取表格数据
    load() {
      if (this.searchData.searchdate.length > 1) {
        this.searchData.beginReleaseTime.push(this.searchData.searchdate[0] || '')
        this.searchData.endReleaseTime.push(this.searchData.searchdate[1] || '')
      }
      this.searchData.postSaleStatus = this.status == 5 ? '18' : ( this.status==6?'17':'');
      this.searchData.orderIscommit = this.status == 7 ? '0' : (this.status==3?'1':'');
      this.searchData.status = this.status == 6 ? 5 : (this.status ==7?3:this.status);
      teacherorder.load(this.searchData).then(res => {
        if (res.resCode == 200) {
          this.totalCount = res.resObject.totalCount
          this.list = res.resObject.list
        } else {
          this.message(res.message, 'error')
        }
      })
        .catch(err => console.log(err))
    },
    reset() {
      this.searchData = {
        orderCode: '',
        status: this.orderType,
        customerName: '',
        customerPhone: '',
        customName: '',
        beginTime: [],
        endTime: [],
        searchdate: [],
        systemfrom: 0,
        pageSize: 10,
        pageNum: 1
      }
    },
    getonedetail(id, type) {
      teacherorder.getone({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.detaildata = res.resObject
          this.$refs.orderDialog.toggleDialog(true)
          this.type = type
        }
      })
    },
    showsearch() {
      this.isshowsearch = !this.isshowsearch
    },
    // 分页
    currentChange(val) {
      this.searchData.pageNum = val
      this.load()
    },
    sizeChange(val) {
      this.searchData.pageSize = val
      this.load()
    },
    // 全选
    selectionchange(val) {
      this.ids = []
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id)
      }
    },

    // 批量核销、退款
    batchPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error')
      } else {
        var url = status == 1 ? teacherorder.finishOrder({ idList: this.ids }) : teacherorder.refundOrder({ idList: this.ids, status: 1 })
        url.then(res => {
          if (res.resCode == 200) {
            this.load()
            this.message('成功', 'success')
          } else {
            this.message(res.message, 'error')
          }
        })
          .catch(err => console.log(err))
      }
    },
    // 错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mapnetwork {
    overflow: hidden;
    margin: 20px 20px 0 20px;
    background: #fff;

    .el-form {
      width: 100%;
    }

    /deep/ .el-form-item {
      display: flex;
    }
    /deep/ .el-form-item__content {
      flex: 1;
    }
    /deep/ .area-select{
      width: 100%;
    }
    .el-range-editor--medium.el-input__inner{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
    .el-card{
      border:none;
    }
    .selectclass{
      .el-select{
        width: 40%;
      }
    }
    .headimg{
      display: flex;align-items: center
    }
    .topborder{
      padding: 0 2px;
      border: 1px solid #cacaca;
      text-align: center;
      font-size: 0.1rem;
      font-style: normal;
      margin-right: 5px;
      width: 15px;
      cursor: pointer;
    }
    .topborder.color{
      color: #fff;
      background: #0a76a4;
      transform: scale(1);
      padding: 0;
    }
    .topplue{
      display: flex;
      height: 15px;
      line-height: 15px;
    }
    .kong{

    }
    .from-wrap {
      margin: 0 20px;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 0 20px;

      .title {
        cursor: pointer;
        font-size: 16px;
        color: #353535;

        span {
          color: #666666;
        }
      }
    }
  }
</style>
