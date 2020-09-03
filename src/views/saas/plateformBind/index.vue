<template>
  <div class="dd-page">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="tab.label" :name="tab.name+''" v-for="(tab,index) in tabs" :key='index'>
          <app-bind></app-bind>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import appBind from './appBind'
export default {
  name: '功能配置',
  data() {
    return {
      activeName: '1',
      tabs: [{
        label: '开放平台绑定',
        name: '1'
      }, {
        label: '七牛云绑定',
        name: '2'
      }, {
        label: '默认风格设置',
        name: '3'
      }]
    }
  },
  components: {
    appBind
  }
}
</script>

<style lang="scss" scoped>

</style>