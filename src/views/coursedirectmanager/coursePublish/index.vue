<!--课程管理 直销版 课程发布-->
<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card" >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="课程发布" name="first">
          <CoursList></CoursList>
        </el-tab-pane>
        <el-tab-pane label="品类设置" name="two">
          <CategorySet></CategorySet>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import CategorySet from './category-set';
  import CoursList from './course-list';

  export default {
    name: "",
    data() {
      return {
        activeName: 'first',
      };
    },
    components: {CategorySet, CoursList },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
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
