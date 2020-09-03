<template>
  <div class="activeManage">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="i.label" :name="i.name" :postSaleStatus="i.postSaleStatus" v-for="(i,index) in orderStatusOptions" :key='index'/>
      </el-tabs>
        <orderListHeader ref='orderListHeader'/>
        <orderListFooter ref='orderListFooter' :statusParams="statusParams"/>
    </el-card>
  </div>
</template>
<script>
import formList from "@/components/FormComponent/index";
import orderListHeader from "./orderListHeader.vue";
import orderListFooter from "./orderListFooter.vue";
import { orderStatusOptions } from "../commonText.js";
export default {
  name: "addactiveManage",
  data() {
    return {
      activeName: "all",
      orderStatusOptions,

      postSaleStatus: ''
    };
  },
  components: {
    orderListHeader,
    orderListFooter,
  },

  computed: {
    statusParams() {
      return this.activeName >= 5 ? {
        postSaleStatus: this.postSaleStatus,
        orderStatus: 5
      } : {
        orderStatus: this.activeName == 'all' ? '' : Number(this.activeName)
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      this.postSaleStatus = tab.$attrs.postSaleStatus
      let params = this.activeName >= 5 ? {
        postSaleStatus: tab.$attrs.postSaleStatus,
        orderStatus: 5
      } : {
        orderStatus: this.activeName == 'all' ? '' : Number(this.activeName)
      }

      this.$refs.orderListFooter.getList({
        ...params,
        page: 1,
        limit: 10,
        ...this.$refs.orderListHeader.headerParams
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.activeManage {
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
