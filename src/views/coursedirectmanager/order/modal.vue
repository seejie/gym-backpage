<template>
  <div class="student-wrap-mask">
    <div class="wrap-mask">
      <div class="wrap-content">
        <div class="main-body">
          <div class="student-wrap-header">
            <span>订单详情</span>
            <i
              class="el-icon-close"
              style="cursor: pointer"
              @click="closeStudent"
            ></i>
          </div>
          <div>
            <div class="detail-top">
              <img :src="detailObj.productAttrValPic" />
              <ul>
                <li>顾客姓名: {{detailObj.customerName}}</li>
                <li>手机号码: {{detailObj.customerMobile}}</li>
                <li>下单时间:{{detailObj.createTime}}</li>
                <li>退款时间: {{detailObj.refundedTime}}</li>
                <li>系统来源: {{detailObj.idfv}}</li>
              </ul>
              <ul>
                <li>身份证号: {{detailObj.customerIdCardNo}}</li>
                <li>订单编号: {{detailObj.code}}</li>
                <li>微信单号:{{detailObj.weixinOrderCode}}</li>
                <li>退款金额: {{detailObj.refundedMoney}}</li>
                <li>店铺名称:{{detailObj.unitName}}</li>
              </ul>
              <ul>
                <li>购买渠道: {{detailObj.qudaoName}}</li>
                <li>订单总额: {{detailObj.totalPrice}}</li>
                <li>实付金额: {{detailObj.realPrice}}</li>
              </ul>
            </div>
            <div class="detail-middle">
              <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%;background-color: #ffffff"
              >
                <el-table-column
                  prop="productName"
                  label="商品名称"
                  width="160"
                ></el-table-column>
                <el-table-column
                  prop="coursePackageName"
                  label="种类"
                  width="120"
                ></el-table-column>
                <el-table-column
                  prop="productAmount"
                  label="数量"
                  width="120"
                ></el-table-column>
                <el-table-column
                  prop="productAttrValSellPrice"
                  label="价格"
                  width="120"
                ></el-table-column>
                <el-table-column
                  prop="status"
                  label="状态"
                  :formatter="formatter"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="receiveTime"
                  label="核销时间"
                  width="120"
                ></el-table-column>
              </el-table>
            </div>
            <div style="margin:15px 0;display:flex;">
              <strong style="marginRight:15px;">客户满意度</strong>
              <el-rate size='large' v-model="detailObj.satisfaction"></el-rate>
            </div>
            <div>
              <strong>评论显示 </strong>
              <el-switch v-model="detailObj.isshow"></el-switch>
              开启后将在前台显示</div>
            <br />
            <div class="pinlun">
              <div
                class="list"
                v-for="(item,index) in feedbackList"
                :key="index"
              >
                <p style="lineHeight: 8px"><strong>{{item.loginName == null?'用户留言':'通知用户'}}</strong></p>
                <div>{{item.content}}</div>
                <div class="time">{{item.createTime}} 更新</div>
              </div>
              <br />
              <div>
                <el-input
                  type="textarea"
                  v-model="content"
                  placeholder="给客户留言及备注，用户在订单中可查看"
                  :rows="2"
                ></el-input>
              </div>
              <br />
              <div style="width: 80%">
                <el-button
                  @click="feedback"
                  type="primary"
                >提交回复</el-button>
              </div>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
              v-if="detailObj.orderStatus==0"
            >
              <el-button @click="closeStudent">取 消</el-button>
              <el-button
                type="primary"
                @click="closeStudent"
              >保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderPageDetail, orderSearchFeedbackList, orderFeedback } from '../sever';
import { Message } from 'element-ui';

export default {
  name: 'order-detail-modal',
  props: ['id', 'mk'],
  data() {
    return {
      detailObj: {
        isshow: false
      },
      tableData: [],
      feedbackList: [],
      content: ''
    };
  },
  mounted() {
    if (this.$props && this.$props.id) {
      this.onSearch(this.$props.id);
    }
  },
  methods: {
    closeStudent() {
      this.$emit('onClose');
    },
    onSearch(id) {
      const param = { id };
      orderPageDetail(param).then(res => {
        const obj = res.resObject || {};
        if (res.resCode == 200) {
          this.tableData = [{ ...obj }];
          this.detailObj = { ...this.detailObj, ...obj };
          this.searchFeedbackList()
        } else {
          this.message(res.message, 'error');
        }
      });
    },
    searchFeedbackList() {
      orderSearchFeedbackList({ code: this.detailObj.code }).then(res => {
        if (res.resCode == 200) {
          this.feedbackList = res.resObject || [];
        }
      })
    },
    feedback() {
      const { id, code, memberId } = this.detailObj;
      const content = this.content;

      if (!content.trim()) {
        return this.message('回复内容不能为空');
      }

      var data = {
        content,
        id,
        orderCode: code,
        memberId
      };

      orderFeedback(data).then(res => {
        if (res.resCode == 200) {
          this.message('回复成功', 'success');
          this.content = '';
          this.searchFeedbackList();
        } else {
          this.message(res.message, 'success');
        }
      })
    },
    handleSave() {
      var arr = [];
      arr.push({ id: this.detailObj.id, price: this.listda[0].productAttrValSellPrice });
      var url = this.curtype == 1 ? teacherorder.updateOrderPrice(arr) : order.updateOrderPrice(arr);
      url.then(res => {
        if (res.resCode == 200) {
          this.message('修改成功', 'success');
          this.$emit('load');
          this.showDetail = false;
        }
      });
    },
    formatter(row) {
      if (row.orderStatus === 0) return '待付款';
      if (row.orderStatus === 1) return '已付款待发货';
      if (row.orderStatus === 2) return '已发货待收货';
      if (row.orderStatus === 3) return '已完成';
      if (row.orderStatus === 4) return '已取消';
      return row.orderStatus || '';
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

<style scoped lang="scss">
.dialog-footer{
    text-align: right;
}

.pinlun {
  .list {
    line-height: 20px;
  };

  .time {
    font-size:12px;
    color:#a5a5a5;
  }
};

.student-wrap-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  left: 0;
  background-color: rgba(55, 55, 55, 0.6);
}
.wrap-mask {
  width: auto;
  margin: 0 auto;
  position: relative;
  outline: 0;
  top: 100px;
}
.wrap-content {
  width: 800px;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
  border: 0;
  background-clip: padding-box;
}
.detail-top {
  display: flex;
}
.detail-top ul {
  margin: 0;

  /* li {
    margin-bottom: 10px;
  } */
}
.detail-top img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.main-body {
  max-height: 500px;
  font-size: 14px;
  overflow: scroll;
}
.main-body > div {
  padding: 15px;
}
.main-body ul {
  list-style: none;
}
.main-body ul li {
  margin-bottom: 15px;
}
.student-wrap-header {
  display: flex;
  justify-content: space-between;
  background-color: rgba(81, 81, 81, 1);
  color: #fff;
}
</style>
