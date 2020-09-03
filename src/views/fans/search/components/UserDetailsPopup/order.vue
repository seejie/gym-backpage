<template>
  <div class="order">
    <div class="table_box">
      <el-table :data="orderList" border>
      <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="code" label="订单编号" align="center" />
        <el-table-column prop="productName" label="订单名称" align="center" />
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="费用" align="center" />
        <el-table-column
          prop="orderStatus"
          label="状态"
          align="center"
          :formatter="orderStatusFilter"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderList: Array
  },

  methods: {
  // 状态数据，过滤器
    orderStatusFilter(row, column, cellValue) {
      switch (cellValue) {
        case 0:
          return '未付款'
        case 1:
          return '已付款未发货'
        case 2:
          return '已发货'
        case 3:
          return '已经收货'
        case 4:
          return '取消作废'
        case 5:
          return '已评价'
        case 7:
          return '申请退货'
        case 8:
          return '同意退货'
        case 9:
          return '拒绝退货'
        case 10:
          return '确认收货'
        case 11:
          return '订单结束'
        case 12:
          return '同意退款'
        case 13:
          return '拒绝退款'
        case 14:
          return '已提交退货审核'
        case 15:
          return '已提交退款审核'
        case 16:
          return '收货失败'
        case 17:
          return '已退款'
        case 18:
          return '申请退款 退款成功'
        case 20:
          return '已核销'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.order {
  .table_box {
    height: 340px;
    overflow-y: auto;
  }
}
</style>
