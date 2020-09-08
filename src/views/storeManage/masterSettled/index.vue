<template>
  <div class="activeManage">
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="专家"
                     name="active">
          <masterList />
        </el-tab-pane>
        <el-tab-pane label="专家类型"
                     name="second">
          <masterType />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import masterList from './masterList.vue';
import masterType from './masterType.vue';

export default {
  data () {
    return {
      activeName: 'active'
    };
  },
  components: {
    masterList,
    masterType
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
