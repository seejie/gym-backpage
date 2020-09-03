<template>
  <div class="hotelOrderMain">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form ref="formInline"
               label-position="center"
               :model="formInline"
               label-width="80px"
               class="demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="orderNum"
                          label="订单编号">
              <el-input v-model="formInline.orderNum"
                        suffix-icon="el-icon-search"
                        placeholder="订单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="time"
                          label="下单时间">
              <el-date-picker v-model="formInline.time"
                              type="datetimerange"
                              range-separator="至"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              unlink-panels
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="userName"
                          label="用户名">
              <el-input v-model="formInline.userName"
                        suffix-icon="el-icon-search"
                        placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="phoneNumber"
                          label="手机号">
              <el-input v-model="formInline.phoneNumber"
                        suffix-icon="el-icon-search"
                        placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="fromChannel"
                          label="渠道来源">
              <el-select v-model="formInline.fromChannel"
                         placeholder="渠道来源">
                <el-option label="免费"
                           value="0"></el-option>
                <el-option label="收费"
                           value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="shopName"
                          label="店铺名称">
              <el-input v-model="formInline.shopName"
                        suffix-icon="el-icon-search"
                        placeholder="店铺名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="fromSystem"
                          label="系统来源">
              <el-select v-model="formInline.fromSystem"
                         placeholder="系统来源">
                <el-option label="小程序"
                           value="0"></el-option>
                <el-option label="公众号"
                           value="1"></el-option>
                <el-option label="APP"
                           value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="orderStatus"
                          label="订单状态"
                          v-if="activeName === 'all'">
              <el-select v-model="formInline.orderStatus"
                         placeholder="订单状态">
                <el-option label="待付款"
                           :value="0"></el-option>
                <el-option label="待核销"
                           :value="1"></el-option>
                <el-option label="已完成"
                           :value="20"></el-option>
                <el-option label="待退款"
                           :value="18"></el-option>
                <el-option label="已退款"
                           :value="19"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8"
                  :offset="activeName === 'all'?0:8">
            <el-form-item style="float:right">
              <el-button type="primary"
                         @click="search">搜索</el-button>
              <el-button @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-wrap">
      <myTable hasSelection
               hasTopButton
               hasIndex
               :topBtnList="btnList"
               :data="list"
               :columns='listColums'>
      </myTable>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     background
                     :page-sizes="[5, 10, 15]"
                     :page-size="currentPageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount">>
      </el-pagination>
    </div>
    <!-- 核销退款详情弹框 -->
    <el-dialog :title="detailType"
               width="55%"
               center
               :visible.sync="detailShow">
      <div class="content">
        <div class="content-top">
          <div class="img-wrap">
            <el-image style="width: 100px; height: 100px"
                      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                      fit="cover"></el-image>
          </div>
          <div class="detail-info">
            <div class="text-item left">
              客户姓名: {{name}}
            </div>
            <div class="text-item center">
              身份证号: {{idCard}}
            </div>
            <div class="text-item right">
              购买渠道: {{channel}}
            </div>
            <div class="text-item left">
              手机号码: {{phone}}
            </div>
            <div class="text-item center">
              订单编号: {{orderNum}}
            </div>
            <div class="text-item right">
              订单金额: {{count}}
            </div>
            <div class="text-item left">
              下单时间: {{createTime}}
            </div>
            <div class="text-item center">
              微信单号: {{wxOrder}}
            </div>
            <div class="text-item right">
              实付金额: {{relCount}}
            </div>
            <div class="text-item left">
              退款时间: {{returnTime}}
            </div>
            <div class="text-item center">
              退款金额: {{returnCount}}
            </div>
            <div class="text-item right"></div>
            <div class="text-item left">
              系统来源: {{sysOrign}}
            </div>
            <div class="text-item center">
              店铺名称: {{shopName}}
            </div>
            <div class="text-item right"></div>
          </div>
        </div>
        <!--  border -->
        <el-table :data="detailActiveData"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  style="width: 100%">
          <el-table-column prop="productName"
                           label="活动名称">
          </el-table-column>
          <el-table-column prop="price"
                           label="价格">
          </el-table-column>
          <el-table-column prop="status"
                           label="状态">
          </el-table-column>
          <el-table-column prop="playTime"
                           label="下单时间">
          </el-table-column>
          <el-table-column prop="hexiaoTime"
                           label="核销时间">
          </el-table-column>
        </el-table>
        <div v-if="detailType==='详情'"
             class="content-bottom">
          <div class="rote">
            <span>客户满意度</span>
            <el-rate v-model="value"
                     disabled
                     show-score
                     text-color="#ff9900"
                     score-template="{value}">
            </el-rate>
          </div>
          <div class="suggest">
            <el-input type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      placeholder="客户留言及备注"
                      v-model="remark">
            </el-input>
          </div>
        </div>
        <div v-if="detailType==='退款'"
             class="content-bottom">
          <div class="suggest">
            <div class="label">退款金额</div>
            <el-input type="txet"
                      placeholder="金额：元"
                      disabled
                      v-model="returnCount">
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer"
            v-if="detailType==='核销'"
            class="dialog-footer">
        <el-button type="primary"
                   @click="hexiao">确认核销</el-button>
        <el-button @click="detailShow=false">取消</el-button>
      </span>
      <span slot="footer"
            v-if="detailType==='退款'"
            class="dialog-footer">
        <el-button type="primary"
                   @click="backMoney">确认退款</el-button>
        <el-button @click="detailShow=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    activeName: {
      default: 'all'
    }
  },
  data () {
    return {
      // 表单数据
      formInline: {
        orderNum: '', // 订单编号
        time: [], // 下单时间
        userName: '', // 用户名
        phoneNumber: '', // 手机号
        shopName: '', // 商铺名称
        fromSystem: '', // 系统来源
        fromChannel: '', // 渠道来源
        orderStatus: ''
      },
      // 订单表格每列数据
      listColums: [
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'code', // <String>  对应属性名
          label: '订单编号', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'productName', // <String>  对应属性名
          label: '商品名称', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'totalPrice', // <String>  对应属性名
          label: '金额(元)', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'customerName', // <String>  对应属性名
          label: '客户姓名', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'customerMobile', // <String>  对应属性名
          label: '手机号', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'orderStatus', // <String>  对应属性名
          label: '订单状态', // <String>   表头标签
        },
        // {
        //   hasSort: false, // <Boolean> 是否排序
        //   prop: 'qudaoName', // <String>  对应属性名
        //   label: '来源渠道', // <String>   表头标签
        // },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'shop', // <String>  对应属性名
          label: '店铺', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'qudaoName', // <String>  对应属性名
          label: '渠道', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'createTime', // <String>  对应属性名
          label: '下单时间', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          // <String>  对应属性名
          label: '操作', // <String>   表头标签
          operateData: [
            {
              btn: '详情',
              cb: this.detail,
              disabled: false,

            },
            {
              btn: '核销',
              cb: this.detail,
              disabled: true
            },
            {
              btn: '退款',
              cb: this.detail,
              disabled: true
            }
          ]
        }
      ],
      list: [
      ], // 订单信息表格
      btnList: [
        {
          btnText: '批量核销',
          type: 'primary',
          isShow: this.activeName !== '1' ? 'false' : 'true',
          cb: this.outDownOrder
        },
        {
          btnText: '批量退款',
          type: '',
          isShow: this.activeName !== '18' ? 'false' : 'true',
          cb: this.drawBack
        },
        {
          btnText: '导出',
          type: '',
          cb: this.derivation
        },
      ], // 操作按钮
      detailActiveData: [
        {

        }
      ], // 活动信息表格
      detailEnterData: [], // 报名信息表格
      currentPageSize: 10,
      currentPage: 1,
      totalCount: 10,
      detailShow: false,
      name: '刘双双',
      idCard: '340602199408182210',
      channel: '平台默认',
      phone: 15605536993,
      orderNum: '0117030211jo2k12',
      count: '80元',
      createTime: '2019-08-22 22:00:00',
      wxOrder: '4004922001201709182793046447',
      relCount: '80元',
      returnTime: '2019-08-22 22:00:00',
      returnCount: '80元',
      sysOrign: '小程序',
      shopName: '武都白龙商贸',
      value: 3,
      remark: '',
      detailType: '详情',
      orderId: '', // 订单ID
    }
  },
  created () {
    this.getOrderList(this.activeName)
  },
  methods: {
    search () {
      console.log('查询')
      this.getOrderList(this.formInline.orderStatus)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.currentPageSize = 10
      this.currentPage = 1
      this.getOrderList()
    },
    // 查询订单列表
    getOrderList (orderStatus) {
      this.$ajax.get('/sys/order/findPageList', {
        params: {
          code: this.formInline.orderNum, // 订单编号
          customerName: this.formInline.userName, // 用户名
          customerMobile: this.formInline.phoneNumberm, // 手机号
          startTime: this.formInline.time[0], // 下单开始时间
          endTime: this.formInline.time[1], // 下单结束时间
          qudaoName: this.formInline.fromChannel, // 渠道涞源
          orderType: 4, // 订单类型门票
          pageNum: this.currentPage,
          pageSize: this.currentPageSize,
          orderStatus: orderStatus === 'all' ? '' : orderStatus,

        }
      }).then((res) => {
        console.log(res)
        this.list = res.resObject.list.map((item) => {
          console.log(item.orderStatus)
          return {
            ...item,
            createTime: this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        this.totalCount = res.resObject.total
      })
    },
    // 详情,退款,核销
    detail (item, type) {
      console.log(item)
      this.orderId = item.id
      this.detailShow = true
      this.name = item.customerName
      this.idCard = item.customerIdCardNo
      this.channel = item.qudaoName
      this.phone = item.customerMobile
      this.orderNum = item.code
      this.count = item.originalPrice
      this.createTime = item.createTime
      this.wxOrder = item.weixinOrderCode
      this.relCount = item.realPrice
      this.returnTime = item.refundedTime
      this.returnCount = item.refundedMoney
      this.sysOrign = item.channel
      this.shopName = item.shopName
      this.value = item.satisfaction
      this.remark = item.customerRemark
      this.detailType = type.btn
      this.detailActiveData = [
        {
          productName: item.productName,
          hexiaoTime: '',
          price: item.totalPrice,
          status: this.getStatus(item.orderStatus),
          playTime: item.createTime,
        }
      ]
      this.getUserList(item.productId)
    },
    // 查询报名人信息
    getUserList (id) {
      this.$ajax.get('/sys/THuigouTiyanProduct/getProductUserPage', {
        params: {
          activeId: id,
          pageNum: 1,
          pageSize: 999,
        }
      }).then((res) => {
        console.log(res)
      })
    },
    getStatus (status) {
      if (status === 2) {
        return '已完成'
      } else if (status === 0) {
        return '待付款'
      } else if (status === 1) {
        return '待核销'
      } else if (status === 19) {
        return '已退款'
      } else if (status === 20) {
        return '已完成'
      }
    },
    // 批量核销
    outDownOrder () {
      console.log('批量核销')
    },
    hexiao () {
      this.$ajax.post('/huigou/active/order/updatestatus', {
        ids: [this.orderId],
        type: 2
      }).then((res) => {
        console.log(res)
        this.$message.success('核销成功')
        this.detailShow = false
      })
    },
    // 退款
    backMoney () {
      this.$ajax.post('/huigou/active/order/updatestatus', {
        ids: [this.orderId],
        type: 3
      }).then((res) => {
        console.log(res)
        this.detailShow = false
        this.$message.success('退款成功')
      })
    },
    // 批量退款
    drawBack () {
      console.log('批量退款')
    },
    // 导出
    derivation () {
      console.log('导出')
    },
    handleSizeChange (val) {
      this.currentPageSize = val
      this.getOrderList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getOrderList()
    }
  }
}
</script>
<style lang="scss" scoped>
.hotelOrderMain {
  @extend %fill;
  overflow: auto;
  .from-wrap {
    width: 100%;
    // height: 60px;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    padding: 20px;
    padding-bottom: 0;
    /deep/ .el-form {
      width: 100%;
      /deep/ .el-form-item {
        margin-bottom: 20px;
        /deep/ .el-form-item__content {
          .el-date-editor,
          .el-select {
            width: 100%;
          }
        }
      }
    }
  }
  .table-wrap {
    overflow: auto;
  }
  .content {
    width: 100%;
    height: auto;
    padding: 20px;
    &-top {
      height: auto;
      width: 100%;
      display: flex;
      .img-wrap {
        width: 110px;
      }
      .detail-info {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        font-size: 16px;
        justify-content: space-between;
        div {
          height: 1em;
          height: 1em;
          margin-bottom: 1.5em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .left {
          width: 35%;
        }
        .right {
          width: 20%;
        }
        .center {
          width: 45%;
        }
      }
    }
    &-enterInfo {
      width: 100%;
      max-height: 300px;
      overflow: auto;
    }
    &-bottom {
      width: 100%;
      margin-top: 20px;
      .rote {
        height: 80px;
        line-height: 80px;
        display: flex;
        align-items: center;
        span {
          font-size: 16px;
          font-weight: 500;
          margin-right: 20px;
        }
      }
      .suggest {
        width: 100%;
        display: flex;
        align-items: center;
        .label {
          width: 80px;
          font-weight: bold;
        }
      }
    }
  }
  .pagination-wrap {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
