<template>
  <div class="mapnetwork">
    <el-card class="box-card" >
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="长期集训" name="first">
         <traininglist v-if="trainingType==1" :trainingType="1" />
        </el-tab-pane>
        <el-tab-pane label="短期集训" name="secound">
          <traininglist v-if="trainingType==0" :trainingType="0" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import traininglist from './traininglist.vue'
export default {
  name: 'networkManage',
  components: {
    traininglist
  },
  data() {
    return {
      active: 'first',
      trainingType: 1

    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      this.trainingType = tab.name == 'first' ? 1 : 0
    },
    // 错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mapnetwork {
    overflow: hidden;
    margin: 20px 20px 0 20px;
    background: #fff;

    .el-form {
      width: 100%;
    }

    /deep/ .el-form-item {
      display: flex;
    }
    /deep/ .el-form-item__content {
      flex: 1;
    }
    /deep/ .area-select{
      width: 100%;
    }
    .el-range-editor--medium.el-input__inner{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
    .el-card{
      border:none;
    }
    .selectclass{
      .el-select{
        width: 40%;
      }
    }
    .headimg{
      display: flex;align-items: center
    }
    .topborder{
      padding: 0 2px;
      border: 1px solid #cacaca;
      text-align: center;
      font-size: 0.1rem;
      font-style: normal;
      margin-right: 5px;
      width: 15px;
      cursor: pointer;
    }
    .topborder.color{
      color: #fff;
      background: #0a76a4;
      transform: scale(1);
      padding: 0;
    }
    .topplue{
      display: flex;
      height: 15px;
      line-height: 15px;
    }
    .kong{

    }
    .from-wrap {
      margin: 0 20px;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 0 20px;

      .title {
        cursor: pointer;
        font-size: 16px;
        color: #353535;

        span {
          color: #666666;
        }
      }
    }
  }
</style>
