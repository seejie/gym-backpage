<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="门票管理"
                     name="active">
          <ticketManage />
          <!-- <ticketListFooter /> -->
        </el-tab-pane>
        <el-tab-pane label="品类设置"
                     name="second">
          <TicketClassify />
        </el-tab-pane>
        <el-tab-pane label="码商设置"
                     name="third">
          <BrandSetting />
        </el-tab-pane>
        <el-tab-pane label="门票标签"
                     name="four">
          <TagSetting />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import ticketManage from './ticketManage.vue'
import TicketClassify from './TicketClassify.vue'
import BrandSetting from './BrandSetting.vue'
import TagSetting from './TagSetting.vue'
export default {
  name: 'addactiveManage',
  data () {
    return {
      activeName: 'active'
    }
  },
  components: {
    // formList,
    // TicketListHeader,
    // TicketListFooter,
    ticketManage,
    TicketClassify,
    BrandSetting,
    TagSetting
  },
  methods: {
    handleClick (tab, event) {
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
