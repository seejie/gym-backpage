<template>
  <div class="activeManage">
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="活动管理"
                     lazy
                     name="active">
          <MainPage></MainPage>
        </el-tab-pane>
        <el-tab-pane label="品类设置"
                     lazy
                     name="second">
          <typeSet></typeSet>
        </el-tab-pane>
        <el-tab-pane label="体验标签"
                     lazy
                     name="third">
          <activeLable></activeLable>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import MainPage from './activeManage.vue'
import activeLable from './activeLabel.vue'
import typeSet from './typeSetting.vue'
export default {
  name: 'addactiveManage',
  data () {
    return {
      activeName: 'active'
    }
  },
  components: {
    MainPage,
    activeLable,
    typeSet
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event);
    }
  }
}
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
