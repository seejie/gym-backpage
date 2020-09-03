<template>
  <div class="student-wrap-mask">
    <div class="wrap-mask">
      <div class="wrap-content">
        <div class="main-body">
          <div class="student-wrap-header" style="padding: 16px; background-color: #F5F7FD">
            <span>审核设置</span>
            <i class="el-icon-close" style="cursor: pointer" @click="closeStudent"></i>
          </div>
          <div style="padding: 32px 0 16px 0;text-align: center;">
            <span>是否启用</span>
            <el-radio v-model="radio" label="0">关闭</el-radio>
            <el-radio v-model="radio" label="1">开启</el-radio>
          </div>
          <div class="student-wrap-header">
            <span></span>
            <div>
              <el-button @click="closeStudent">取消</el-button>
              <el-button type="primary" @click="check">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "live-check-box",
    data() {
      return {
        radio: '0'
      };
    },
    created(){
      console.log(this.props);
    },
    methods: {
      handleSelectionChange(val){
        this.ids = val.map(v => v.id);
      },
      handleCurrentChange(val){
        this.form.pageNum = val;
        this.onSearch();
      },
      handleSizeChange(val){
        this.form.pageSize = val;
        this.onSearch();
      },
      closeStudent(){
        this.$emit('onClose')
      },
      check(){
        this.$emit('check')
      },
    }
  }
</script>

<style scoped>
  .student-wrap-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    left: 0;
    background-color: rgba(55,55,55,.6);
  }
  .wrap-mask{
    width: auto;
    margin: 0 auto;
    position: relative;
    outline: 0;
    top: 100px;
  }
  .wrap-content{
    width: 500px;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    border: 0;
    border-radius: 6px;
    background-clip: padding-box;
  }
  .main-body{

  }
  .student-wrap-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid #e3e8ee;
  }
  .main-search{
    padding: 0 16px;
    margin: 8px 0;
  }



</style>
