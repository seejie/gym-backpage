<template>
  <el-card class="card">
    <el-dialog title="订单详情" :visible.sync="showDetail">
      <!-- <div class="flex">
                <div>
                    <img :src="detailObj.attributeIcon" alt="" width='60' height="60">
                    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="" width='60' height="60">
                </div>
            </div>-->
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <div class="flex">
              <div>
                <!-- <img :src="detailObj.attributeIcon" alt="" width='60' height="60"> -->
                <img
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                  alt=""
                  width="60"
                  height="60"
                />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div>订单编号：{{ detailObj.code }}</div>
            <div>商品名称：{{ detailObj.productName }}</div>
            <div>客户姓名：{{ detailObj.customerName }}</div>
            <div>手机号码：{{ detailObj.customerMobile }}</div>
            <div>客户留言：{{ detailObj.customerRemark }}</div>
            <div>配送方式：{{ detailObj.distributionType }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div>订单状态：{{ detailObj.orderStatusDescription }}</div>
            <div>订单总额：{{ detailObj.productAttrValSellPrice }}</div>
            <div>实付金额：{{ detailObj.realPrice }}</div>
            <div>退款金额：{{ detailObj.refundedMoney }}</div>
            <div>退款时间：{{ detailObj.refundedTime }}</div>
            <div>下单时间：{{ detailObj.createTime }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div>店铺名称：{{ detailObj.unitName }}</div>
            <div>物流公司：{{ detailObj.waybillCompany }}</div>
            <div>物流单号：{{ detailObj.waybillCode }}</div>
            <div>物流费用：{{ detailObj.logisticFee }}</div>
            <div>渠道来源：{{ detailObj.fromChannelName }}</div>
            <div>系统来源：{{ detailObj.idfv }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :offset="3" :span="21">
          <div class="grid-content bg-purple">
            <div>
              收货地址：{{ detailObj.provinceName }}{{ detailObj.cityName }}{{ detailObj.areaName
              }}{{ detailObj.address }}
            </div>
          </div>
        </el-col>
      </el-row>

      <div style="margintop: 15px;">
        <el-table :data="detailObj.productList" height="100" border="" style="width: 100%;">
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="productAttrVal" label="品类" width="150"></el-table-column>
          <el-table-column prop="productAmount" label="数量" width="100"></el-table-column>
          <el-table-column prop="productAttrValSellPrice" label="价格" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="80"></el-table-column>
          <el-table-column prop="deliverTime" label="寄送时间" width="120"></el-table-column>
          <el-table-column prop="receiveTime" label="收货时间" width="120"></el-table-column>
        </el-table>
      </div>
      <div style="margintop: 15px; display: flex;">
        <span style="marginright: 15px;">客户满意度</span>
        <el-rate v-model="detailObj.star"></el-rate>
      </div>
      <div>留言备注{{ detailObj.customerRemark }}</div>
      <div v-if="detailObj.orderStatus >= 1" class="logistics_container">
        <div class="label">物流订单</div>
        <el-input placeholder="物流订单" v-model="waybillCode"> </el-input>
        <el-select v-model="waybillCompany">
          <el-option v-for="item in LogisticsList" :key="item.id" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </div>

      <div v-if="detailObj.postSaleStatus == 17" style="margin-top: 10px;">
        <div>退款金额：{{ detailObj.refundedMoney }}</div>
      </div>
      <div v-if="detailObj.postSaleStatus == 18 || detailObj.postSaleStatus == 23" style="margin-top: 10px;">
        <div>打款金额：{{ detailObj.refundedMoney }}</div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="detailObj.orderStatus == 1">
        <el-button @click="showDetail = false">取 消</el-button>
        <el-button type="primary" @click="confirmSend">确认寄出</el-button>
      </div>
      <!-- begin 退款 -->
      <div slot="footer" class="dialog-footer" v-if="detailObj.postSaleStatus == 17">
        <el-button @click="rejectReturnFund">驳回请求</el-button>
        <el-button type="primary" @click="confrimReturnFund">确认退款</el-button>
      </div>
      <!-- end 退款 -->

      <!-- begin 打款 -->
      <div slot="footer" class="dialog-footer" v-if="detailObj.postSaleStatus == 18 || detailObj.postSaleStatus == 23">
        <el-button type="primary" @click="confrimWeChatRefund">确认打款</el-button>
      </div>
      <!-- end 打款 -->
    </el-dialog>
  </el-card>
</template>
<script>
import { getLogisticsListByunit } from '@/api/apiPlatformSetting';
import {} from '@/api/standshop/orderList';

export default {
  //props: ["showDetail", "detailObj"],
  props: ['detailObj'],

  watch: {
    detailObj(val) {
      this.waybillCode = val.waybillCode;
      this.waybillCompany = val.waybillCompany;
    },
  },
  data() {
    return {
      showDetail: false,
      waybillCode: '', // 物流公司编号
      waybillCompany: '', // 物流公司

      LogisticsList: [], // 物流列表
    };
  },

  created() {
    this.loadLogisticsList();
  },

  methods: {
    toggleDialog(flag) {
      this.showDetail = flag;
    },

    // 获取所有物流公司
    loadLogisticsList() {
      getLogisticsListByunit(
        {
          pageNum: 1,
          pageSize: 99,
        },
        data => {
          this.LogisticsList = data.list;
        }
      );
    },

    // 确认发出
    confirmSend() {
      this.$emit('sendGoods', {
        waybillCode: this.waybillCode,
        waybillCompany: this.waybillCompany,
        orderCode: this.detailObj.code,
      });
      this.showDetail = false;
    },

    // 同意退款
    confrimReturnFund() {
      this.$confirm(`你已同意退款订单金额${this.detailObj.refundedMoney}元?`, '退款确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('returnFund', {
          orderCode: this.detailObj.code,
          agree: true,
          refundMoney: this.detailObj.refundedMoney,
          id: this.detailObj.id,
        });
        this.showDetail = false;
      });
    },

    // 驳回请求
    rejectReturnFund() {
      this.$prompt('', '驳回说明', {
        confirmButtonText: '确定',
        inputPattern: /\s*\S+?/,
        inputErrorMessage: '请输入驳回说明',
        showCancelButton: false,
        inputPlaceholder: '请输入驳回说明',
        inputType: 'textarea',
      }).then(({ value }) => {
        this.$emit('returnFund', {
          orderCode: this.detailObj.code,
          agree: false,
          refundRejectExplain: value,
        });
        this.showDetail = false;
      });
    },

    // 微信打款
    confrimWeChatRefund() {
      this.$emit('weChatRefund', {
        id: this.detailObj.id,
        refundMoney: this.detailObj.refundedMoney,
      });
      this.showDetail = false;
    },
  },
};
</script>

<style scoped lang="sass">
.logistics_container
  display: flex

  .label
    flex-shrink: 0
    line-height: 36px

  .el-input
    margin: 0 10px
</style>
