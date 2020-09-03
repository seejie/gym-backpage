<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card" >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"><Comment key="all" v-if="showThis('all')"  status="" /></el-tab-pane>
        <el-tab-pane label="待支付" name="one"><Comment key="one" v-if="showThis('one')" status="1" /></el-tab-pane>
        <el-tab-pane label="待核销" name="two"><Comment key="two" v-if="showThis('two')"  status="2" /></el-tab-pane>
        <el-tab-pane label="待评价" name="three"><Comment key="three" v-if="showThis('three')" status="3" /></el-tab-pane>
        <el-tab-pane label="待退款" name="four"><Comment key="four" v-if="showThis('four')" status="4" /></el-tab-pane>
        <el-tab-pane label="已退款" name="five"><Comment key="five" v-if="showThis('five')" status="5" /></el-tab-pane>
        <el-tab-pane label="已完成" name="six"><Comment key="six" v-if="showThis('six')" status="6" /></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import Comment from './common';

  export default {
    name: "",
    data() {
      return {
        showSearch: true,
        showStudent: false,
        activeName: 'all'
      };
    },
    components: { Comment },
    methods: {
      handleClick(event) {
        this.activeName = event.name;
      },
      showThis(key){
        if (this.activeName === key) return true;
        return false
      }
    }
  }
</script>
<style scoped>
  .activeManage {
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
  }
  .activeManage .box-card {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .box-card{
    display: flex;
    flex-direction: column;
  }
  .box-card >>> .el-tabs__content{
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .box-card >>> .el-tab-pane{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .box-card >>> .el-form-item{
    margin-bottom: 10px;
  }
</style>
