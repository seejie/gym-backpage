<template>
  <div class="activeManage">
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="店铺管理"
                     name="active">
          <StoresList />
        </el-tab-pane>
        <el-tab-pane label="网点类型"
                     name="second">
          <StoreType />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import StoresList from './storesList.vue';
import StoreType from './storeType.vue';

export default {
  data () {
    return {
      activeName: "active"
    };
  },
  components: {
    StoresList,
    StoreType
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
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
