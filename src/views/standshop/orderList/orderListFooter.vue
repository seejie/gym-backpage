<template>
  <el-card class="card">
    <div class="button-wrap">
      <!-- <el-button :disabled="multipleSelection.length == 0" @click="publishMore">批量核销</el-button> -->
      <el-button type="danger" @click="deleteMore" :disabled="multipleSelection.length == 0">批量退款</el-button>
      <el-button type="danger" @click="exportOrder">导出</el-button>
    </div>
    <el-table :data="tableData" border="" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="code" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
      <el-table-column prop="productCategoryName" label="分类"> </el-table-column>
      <el-table-column prop="customerName" label="客户姓名" width="100"></el-table-column>
      <el-table-column prop="customerMobile" label="手机号" width="150"></el-table-column>
      <el-table-column prop="productAttrValSaleMode" label="销售模式 " width="150"></el-table-column>
      <el-table-column prop="productAttrValCurrentPrice" label="现价(元)" width="100"></el-table-column>
      <el-table-column prop="productAmount" label="成交数量(个)" width="100"></el-table-column>
      <el-table-column prop="logisticFee" label="物流(元)" width="100"></el-table-column>
      <el-table-column prop="realPrice" label="实际成交金额(元)" width="100"></el-table-column>
      <el-table-column prop="orderStatusDescription" label="订单状态" width="150"></el-table-column>
      <el-table-column prop="idfv" label="系统来源" width="150"></el-table-column>
      <el-table-column prop="unitName" label="店铺" width="150"></el-table-column>
      <el-table-column prop="qudaoName" label="渠道" width="150"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime && $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>

      <!--操作-->
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <span @click="getDetail(scope.row)" style="color: #409eff; margin-right: 5px; cursor: pointer;">详情</span>
          <span
            @click="getDetail(scope.row)"
            v-if="scope.row.orderStatus == 1"
            style="color: #409eff; margin-right: 5px; cursor: pointer;"
            >发货</span
          >
          <el-popconfirm
            title="确认同意退货吗"
            @onConfirm="handleReturnGoods(scope.row, true)"
            @onCancel="handleReturnGoods(scope.row, false)"
            confirmButtonText="同意"
            cancelButtonText="拒绝"
          >
            <span
              slot="reference"
              v-if="scope.row.postSaleStatus == 1"
              style="color: #409eff; margin-right: 5px; cursor: pointer;"
              >退货</span
            >
          </el-popconfirm>

          <span
            slot="reference"
            @click="getDetail(scope.row)"
            v-if="scope.row.postSaleStatus == 17"
            style="color: #409eff; margin-right: 5px; cursor: pointer;"
            >退款</span
          >
          <span
            slot="reference"
            @click="getDetail(scope.row)"
            v-if="scope.row.postSaleStatus == 18 || scope.row.postSaleStatus == 23"
            style="color: #409eff; margin-right: 5px; cursor: pointer;"
            >打款</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="textalign: right;">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="current"
        :page-sizes="pageSizesRange"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="审核设置" :visible.sync="auditShow">
      <el-form :model="auditForm" ref="auditForm">
        <el-form-item label="是否启用" label-width="100" prop="auditType">
          <el-radio-group v-model="auditForm.auditType">
            <el-radio :label="1">关闭</el-radio>
            <el-radio :label="0">开启</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditShow = false">取 消</el-button>
        <el-button type="primary" @click="saveAudit('auditForm')">确 定</el-button>
      </div>
    </el-dialog>
    <OrderDialog
      ref="orderDialog"
      :detailObj="detailObj"
      @sendGoods="publishOne"
      @returnFund="handleReturnFund"
      @weChatRefund="confrimWeChatRefund"
    />
  </el-card>
</template>
<script>
import {
  shopOrderPage,
  shopOrderUpdateStatus,
  shopOrderInfo,
  shopSendGoods,
  exportOrders,
  handleReturnFund,
  auditRefund,
  weChatRefund,
} from '@/api/standshop/orderList';
import { pageSizesRange, deleteEmptyParams } from '../commonText.js';
import settings from '../../../settings.js';
import eventVue from './eventVue.js';
import OrderDialog from '../OrderDialog';
import qs from 'qs';

export default {
  name: 'myTable',
  components: {
    OrderDialog,
  },
  props: {
    statusParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      pageSizesRange,
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      multipleSelection: [],
      auditForm: {
        auditType: 1,
      },
      auditShow: false,
      //showDetail: false,
      detailObj: {},
      headerParams: {},

      queryParams: {},
    };
  },
  created() {
    this.getList();
    this.bbtn();
  },

  destroyed() {
    eventVue.$off([
      'myFun',
      params => {
        this.headerParams = params;
        this.getList(params);
      },
    ]);
  },

  computed: {},
  methods: {
    async getList(params) {
      const newParams = {
        pageNum: 1,
        pageSize: 10,
        code: '',
        status: '',
        queryStartTime: '',
        queryEndTime: '',
        customerName: '',
        customerMobile: '',
        productName: '',
        idfv: '',
        qudaoName: '',
        waybillCompany: '',
        ...this.headerParams,
        ...params,
      };
      let payload = {};
      for (var key in newParams) {
        if (newParams[key] !== null && newParams[key] !== undefined && newParams[key] !=== '') {
          payload[key] = newParams[key];
        }
      }

      this.queryParams = payload;
      shopOrderPage(payload).then(res => {
        if (res.resCode == 200) {
          this.tableData = res.resObject.list;
          this.total = res.resObject.total;
          this.current = res.resObject.pageNum;
          this.pageSize = res.resObject.pageSize;
          this.multipleSelection = [];
        }
      });
    },
    sizeChange(val) {
      this.pageSize = val;
      this.current = 1;
      this.getList({ pageSize: val, pageNum: 1 });
    },
    currentChange(val) {
      this.current = val;
      this.getList({ pageNum: val, pageSize: this.pageSize });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    saveAudit(formName) {
      let params = {
        ...this[formName],
        productId: this.multipleSelection.map(item => {
          return item.id;
        }),
      };
      ticketAudit(params, () => {
        this.$message({
          message: '操作成功!',
          type: 'success',
        });
        this.getList();
        this.auditShow = false;
      });
    },

    // 退款事件
    async onDelete(ids) {
      shopOrderUpdateStatus({ ids: ids, type: 17 }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList();
        }
      });
    },

    // 多删
    deleteMore() {
      const ids = this.multipleSelection.map(i => {
        return i.id;
      });
      this.onDelete(ids);
    },

    // 单退
    deleteOne(row) {
      this.onDelete([row.id]);
    },

    // 导出
    exportOrder() {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      let params = {
        userLevel: userInfo.level,
        unitId: userInfo.unitId,
        ...this.queryParams,
      };

      delete params.pageSize;
      delete params.pageNum;
      delete params.page;
      delete params.limit;
      window.open(`${settings.baseUrl}/shop/order/exportOrders?${qs.stringify(params)}`);
    },

    //详情
    getDetail(row) {
      shopOrderInfo({ orderCode: row.code }).then(res => {
        if (res.resCode == 200) {
          this.detailObj = res.resObject;
          this.detailObj.productList = [];
          this.detailObj.productList.push({
            productName: res.resObject.productName,
            productAttrVal: res.resObject.productAttrVal,
            productAmount: res.resObject.productAmount,
            productAttrValSellPrice: res.resObject.productAttrValSellPrice,
            deliverTime: res.resObject.deliverTime,
            receiveTime: res.resObject.receiveTime,
          });
          this.$refs.orderDialog.toggleDialog(true);
        }
      });
    },

    // 批量发货
    publishMore() {
      const ids = this.multipleSelection.map(i => {
        return i.id;
      });
      this.onPublish(ids);
    },

    // 发货
    async publishOne(row) {
      shopSendGoods({
        ...row,
      }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList(this.statusParams);
        }
      });
    },

    bbtn() {
      eventVue.$on('myFun', params => {
        this.headerParams = params;
        this.getList(params);
      });
    },

    // 审核退货
    handleReturnGoods(data, agree) {
      auditReturnGoods({
        orderCode: data.code,
        agree,
      }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList(this.statusParams);
        }
      });
    },

    // 审核退款
    handleReturnFund(row) {
      auditRefund({
        orderCode: row.orderCode,
        refundRejectExplain: row.refundRejectExplain,
        agree: row.agree,
      }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          if (row.agree) {
            this.confrimWeChatRefund({
              refundMoney: row.refundMoney,
              id: row.id,
            });
          }
          this.getList(this.statusParams);
        }
      });
    },

    // 微信退款
    confrimWeChatRefund(row) {
      weChatRefund({
        ...row,
      }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList(this.statusParams);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.card {
  /deep/ .el-card__body {
    // padding-top: 0;
  }
  .button-wrap {
    height: 60px;
    margin-top: -20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  /deep/ .title {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;

    .img-wrap {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .text-wrap {
      overflow: hidden;
      .oneTitle {
        font-weight: 650;
        font-size: 18px;
      }
      .twoTitle {
        font-size: 14px;
        color: #999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  /deep/ .avatar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    padding-left: 5px;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>
