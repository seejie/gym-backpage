<template>
  <div class="activeOrder">
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick()">
        <el-tab-pane v-for="(item,index) in statusList"
                     :key="index"
                     :label="item.label"
                     lazy
                     :name="item.statu">
          <mainPage :activeName='activeName'></mainPage>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import mainPage from './hotelOrderMain.vue'
export default {
  data () {
    return {
      activeName: 'all',
      statusList: [
        {
          label: '全部',
          statu: 'all'
        },
        {
          label: '待支付',
          statu: '0'
        },
        {
          label: '待核销',
          statu: '1'
        },
        {
          label: '待评价',
          statu: '10',
        },
        {
          label: '待退款',
          statu: '31'
        },
        {
          label: '已退款',
          statu: '36'
        },
        {
          label: '已核销',
          statu: '3'
        },
      ]
    }
  },
  mounted () {

  },
  methods: {
    handleClick (val) {
      // console.log(this.activeName)
    }
  },
  components: {
    mainPage
  }
}
</script>
<style lang="scss" scoped>
.activeOrder {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
  .box-card {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
