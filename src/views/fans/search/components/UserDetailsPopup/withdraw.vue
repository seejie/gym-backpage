<template>
  <div class="withdraw">
    <div class="table_box">
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="序号" align="center" />
        <el-table-column prop="applicationTime" label="申请时间" align="center" />
        <el-table-column prop="reviewTime" label="审核时间" align="center" />
        <el-table-column prop="total" label="待提现总额" align="center" />
        <el-table-column prop="status" label="状态" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          applicationTime: '2016-11-13 18:00',
          reviewTime: '2016-11-13 18:00',
          total: 200,
          status: '已打款',
        },
        {
          id: 2,
          applicationTime: '2016-11-12 21:00',
          reviewTime: '2016-11-12 21:00',
          total: 200,
          status: '待打款',
        },
        {
          id: 3,
          applicationTime: '2016-11-11 09:09',
          reviewTime: '2016-11-11 09:09',
          total: 200,
          status: '待审核',
        },
        {
          id: 4,
          applicationTime: '2016-11-10 17:22',
          reviewTime: '2016-11-10 17:22',
          total: 200,
          status: '待审核',
        },
        {
          id: 5,
          applicationTime: '2016-11-09 15:02',
          reviewTime: '2016-11-09 15:02',
          total: 2000,
          status: '待审核',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.withdraw {
  .table_box {
    height: 340px;
    overflow-y: auto;
  }
}
</style>
