<template>
  <div class="zuopin-manager">
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="作品列表" name="list">
          <list />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import list from './list';

export default {
  name: 'zuopinmanager',
  data() {
    return {
      activeName: 'list',
    };
  },
  components: {
    list,
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style lang="scss" scoped>
.zuopin-manager {
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
