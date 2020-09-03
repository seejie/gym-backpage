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
            <div>订单编号：{{detailObj.code}}</div>
            <div>顾客姓名：{{detailObj.customerName}}</div>
            <div>手机号码：{{detailObj.customerMobile}}</div>
            <div>下单时间：{{detailObj.createTime}}</div>

            <div>系统来源：{{detailObj.idfv}}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div>退款金额：{{detailObj.refundedMoney}}</div>
            <div>店铺名称：{{detailObj.unitName}}</div>
            <div>退款时间：{{detailObj.refundedTime}}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <div>购买渠道：{{detailObj.qudaoName}}</div>
            <div>订单总额：{{detailObj.totalPrice}}</div>
            <div>实付金额：{{detailObj.realPrice}}</div>
          </div>
        </el-col>
      </el-row>
      <div v-if="type==1">
      <div style="marginTop:15px;">
        <el-table  :data="listda" height="100" border="" style="width: 100%">
          <el-table-column prop="productName" :label="productName"></el-table-column>
          <el-table-column prop="productAttrVal" label="分类" width="150"></el-table-column>
          <el-table-column prop="productAmount" label="数量" width="100"></el-table-column>
          <el-table-column prop="productAttrValSellPrice" label="价格" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.productAttrValSellPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              {{scope.row.orderStatus==2 || scope.row.orderStatus==1 ||  scope.row.orderStatus==0?"待核销":"已核销"}}
            </template>
          </el-table-column>
          <el-table-column prop="receiveTime" label="核销时间" width="120"></el-table-column>
        </el-table>
      </div>
      <div style="margin:15px 0;display:flex;">
        <span style="marginRight:15px;">客户满意度</span>
        <el-rate v-model="detailObj.satisfaction"></el-rate>
      </div>
        <div>评论显示 <el-switch v-model="isshow"></el-switch> 开启后将在前台显示</div>
      <!--<div>留言备注:{{detailObj.customerRemark}}</div>-->
        <div class="pinlun">
          <div>用户留言</div>
          <div class="list" v-for="(item,index) in FeedbackList" :key="index">
            <div style="font-weight: bold">{{item.name}}</div>
            <div style="margin-top: 10px">{{item.content}}</div>
            <div class="time">{{item.createTime}}</div>
          </div>
          <div><el-input type="textarea" v-model="content" :rows="2"></el-input></div>
          <div style="width: 80%"><el-button @click="feedback" type="primary">提交回复</el-button></div>
        </div>

      <div slot="footer" class="dialog-footer" v-if="detailObj.orderStatus==0">
        <el-button @click="showDetail=false">取 消</el-button>
        <el-button type="primary" @click="updateOrderPrice">保存</el-button>
      </div>
      </div>
      <div v-if="type==2">
        <div style="marginTop:15px;">
          <el-table  :data="listda" height="100" border="" style="width: 100%">
            <el-table-column prop="productName" :label="productName"></el-table-column>
            <el-table-column prop="productAttrVal" label="分类" width="150"></el-table-column>
            <el-table-column prop="productAmount" label="数量" width="100"></el-table-column>
            <el-table-column prop="productAttrValSellPrice" label="价格" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template slot-scope="scope">
                {{scope.row.orderStatus==2 || scope.row.orderStatus==1 ||  scope.row.orderStatus==0?"待核销":"已核销"}}
              </template>
            </el-table-column>
            <el-table-column prop="receiveTime" label="核销时间" width="120"></el-table-column>
            <el-table-column  label="操作" width="120">
              <template slot-scope="scope">
                <el-link type="primary" @click="finishCustomCourseOrder">核销</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin:15px 0;display:flex;">
          <span style="marginRight:15px;">提示：核销后将不可退票</span>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDetail=false">取 消</el-button>
          <el-button type="primary" @click="finishCustomCourseOrder">全部核销</el-button>
        </div>
      </div>
      <div v-if="type==3">
        <div style="marginTop:15px;">
          <el-table  :data="listda" height="100" border="" style="width: 100%">
            <el-table-column prop="productName" :label="productName"></el-table-column>
            <el-table-column prop="productAttrVal" label="分类" width="150"></el-table-column>
            <el-table-column prop="productAmount" label="数量" width="100"></el-table-column>
            <el-table-column prop="productAttrValSellPrice" label="价格" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template slot-scope="scope">
                {{scope.row.orderStatus==2 || scope.row.orderStatus==1 ||  scope.row.orderStatus==0?"待核销":"已核销"}}
              </template>
            </el-table-column>
            <el-table-column prop="receiveTime" label="核销时间" width="120"></el-table-column>
          </el-table>
        </div>
        <div style="margin:15px 0;display:flex;align-items: center">
          <span style="marginRight:15px;" >退款金额 </span>
          <el-input style="width: 30%" v-model="refundprice"></el-input>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="refundCustomCourseOrder(0)">驳回请求</el-button>
          <el-button type="primary" @click="refundCustomCourseOrder(1)">确认退款</el-button>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
  import {Message} from "element-ui";
  import { order,teacherorder } from '@/api/customCourse/customCourse';
  export default {
    //props: ["showDetail", "detailObj"],
    props: {
      detailObj: {
      },
      productName: {
        type:String
      },
      type: {
        type: Number,
        default:1
      },
     curtype:{
       type: Number,
       default:0
     }
    },
    data() {
      return {
        showDetail: false,
        listda:[],
        isshow:false,
        FeedbackList:[],
        refundprice:'',
        content:''
        //showDetail: true,
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
    watch: {
      detailObj(newval,oldval) {
        this.searchFeedbackList();
      }
    },
    methods: {
      toggleDialog(flag) {
        this.showDetail = flag;
        this.$nextTick(function () {
          this.listda=[];
          this.listda.push(this.detailObj);
        })

      },
      updateOrderPrice(){
        var arr=[];
        arr.push({id:this.detailObj.id,price:this.listda[0].productAttrValSellPrice});
        var url=this.curtype==1? teacherorder.updateOrderPrice(arr):order.updateOrderPrice(arr);
        url.then(res=>{
          if(res.resCode==200)
          {
            this.message('修改成功','success');
            this.$emit('load');
            this.showDetail = false;
          }
        });
      },
      finishCustomCourseOrder(){
        var idList=[];
        idList.push(this.detailObj.id)
        var url=this.curtype==1? teacherorder.finishOrder({idList:idList}):order.finishCustomCourseOrder({idList:idList});
        url.then(res=>{
          if(res.resCode==200)
          {
            this.message('核销成功','success');
            this.$emit('load');
            this.showDetail = false;
          }
        })
      },
      refundCustomCourseOrder(status){
        var idList=[];
        idList.push(this.detailObj.id);
        var url=this.curtype==1? teacherorder.refundOrder({idList:idList,status:status}):order.refundCustomCourseOrder({idList:idList,status:status});
        url.then(res=>{
          if(res.resCode==200)
          {
            this.message('操作成功','success');
            this.$emit('load');
            this.showDetail = false;
          }
        })
      },
      searchFeedbackList(){
        var url=this.curtype==1? teacherorder.searchFeedbackList({code:this.detailObj.code}):order.searchFeedbackList({code:this.detailObj.code});
        url.then(res=>{
          if(res.resCode==200)
          {
            this.FeedbackList = res.resObject;
          }
        })
      },
      feedback(){
        var data={
          content:this.content,
          id:this.detailObj.id,
          orderCode:this.detailObj.code,
          memberId:this.detailObj.memberId
        };
        if(this.content.length==0)
        {
          this.message("回复内容不能为空");
          return;
        }
        var url=this.curtype==1? teacherorder.feedback(data):order.feedback(data);
        url.then(res=>{
          if(res.resCode==200)
          {
            this.message("回复成功","success");
            this.searchFeedbackList();
          }
          else
          {
            this.message(res.message,"success");
          }
        })
      },
      message(message, type) {
        Message({
          message: message,
          type: type
        });
      }
    },
  };
</script>
<style scoped lang="scss" >
  .grid-content{
    line-height: 25px;
  }
  .dialog-footer{
    text-align: right;
  }

  .pinlun{
    line-height: 40px;
    .list{
      line-height: 20px;
    }
    .time{
      font-size:12px;
      color:#a29f9f;
    }
  }
</style>

