<template>
  <div class="distribution">
    <div class="table_box">
      <el-table class="table" :data="tableData" stripe >
        <el-table-column type="selection" align="center" />
        <el-table-column prop="name" label="用户金额" align="center" />
        <el-table-column prop="date" label="注册时间" align="center" />
        <el-table-column prop="amount" label="消费金额" align="center" />
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
          name: '小凌',
          date: '2019-01-01',
          amount: 200,
        },
        {
          name: 'sjoijwws',
          date: '2018-09-11',
          amount: 100,
        },
        {
          name: 'wjeoijd',
          date: '2018-09-11',
          amount: 20000,
        },
        {
          name: '12ddd',
          date: '2018-09-11',
          amount: 3000,
        },
        {
          name: 'sdwef',
          date: '2018-09-11',
          amount: 100,
        },
        {
          name: 'ddwww',
          date: '2018-09-11',
          amount: 0,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.distribution {
  .table_box {
    height: 340px;
    overflow-y: auto;
  }
}
</style>
