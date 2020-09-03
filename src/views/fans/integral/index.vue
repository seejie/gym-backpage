<template>
  <div class="points_inquiry">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="积分规则" name="rule">
          <points-rule />
        </el-tab-pane>
        <el-tab-pane label="积分查询" name="inquire">
          <points-inquire />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import PointsRule from './components/PointsRule'
import PointsInquire from './components/PointsInquire'

export default {
  components: {
    PointsRule,
    PointsInquire
  },

  data() {
    return {
      activeName: 'rule'
    }
  },
}
</script>

<style lang="scss" scoped>
.points_inquiry{
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);
}
</style>
