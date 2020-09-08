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
                                >
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="7">
                    <div class="grid-content bg-purple">
                        <div>客户姓名：{{detailObj.customerName}}</div>
                        <div>手机号码：{{detailObj.customerMobile}}</div>
                        <div>下单时间：{{detailObj.createTime}}</div>
                        <div>退款时间：{{detailObj.refundedTime}}</div>
                        <div>系统来源：{{detailObj.fromSystem}}</div>
                    </div>
                </el-col>
                <el-col :span="7">
                    <div class="grid-content bg-purple">

                        <div>订单编号：{{detailObj.code}}</div>
                        <div>微信单号：{{detailObj.weixinOrderCode}}</div>
                        <div>退款金额：{{detailObj.refundedMoney}}</div>
                        <div>店铺名称：{{detailObj.venueName}}</div>
                    </div>
                </el-col>
                <el-col :span="7">
                    <div class="grid-content bg-purple">
                        <div>购买渠道：{{detailObj.fromChannelName}}</div>
                        <div>订单总额：{{detailObj.productAttrValSellPrice}}</div>
                        <div>实付金额：{{detailObj.realPrice}}</div>
                    </div>
                </el-col>
            </el-row>
            <div style="marginTop:15px;">
                <el-table :data="detailObj.productList" height="100" border="" style="width: 100%">
                    <el-table-column prop="productName" label="商品名称"></el-table-column>
                    <el-table-column prop="productAttrVal" label="品类" width="150"></el-table-column>
                    <el-table-column prop="productAmount" label="数量" width="100"></el-table-column>
                    <el-table-column prop="productAttrValSellPrice" label="价格" width="100"></el-table-column>
                    <el-table-column prop="status" label="状态" width="80"></el-table-column>
                    <el-table-column prop="deliverTime" label="寄送时间" width="120"></el-table-column>
                    <el-table-column prop="receiveTime" label="收货时间" width="120"></el-table-column>
                </el-table>
            </div>
            <div style="marginTop:15px;display:flex;">
                <span style="marginRight:15px;">客户满意度</span>
                <el-rate v-model="detailObj.star"></el-rate>
            </div>
            <div>留言备注{{detailObj.customerRemark}}</div>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="onCancel">取 消</el-button>
                <el-button type="primary" @click="saveTag('addFrom')">确 定</el-button>-->
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
export default {
  // props: ["showDetail", "detailObj"],
  props: ['detailObj'],
  data() {
    return {
      showDetail: false
      // showDetail: true,
      //   detailObj: {
      //     userName: "",
      //     cardNo: "",
      //     channel: "",
      //     mobile: "",
      //     orderNum: "",
      //     createTime: "",
      //     wxNum: "",
      //     price: "",
      //     refundTime: "",
      //     refundMoney: "",
      //     systemSource: "",
      //     busiName: "",
      //     productList: [
      //       {
      //         name: "商品名称",
      //         productCode: "票号",
      //         categoryName: "种类",
      //         price: "价格",
      //         productStatus: "状态",
      //         useTime: "预计游玩时间",
      //         writeOffTime: "核销时间"
      //       }
      //     ]
      //   }
    };
  },
  methods: {
    toggleDialog(flag) {
      this.showDetail = flag;
    }
  },
};
</script>
