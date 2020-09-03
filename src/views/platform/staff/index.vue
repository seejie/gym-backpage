<template>
  <div class="dd-page">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="tab.name" :name="tab.type+''" v-for="(tab,index) in tabs" :key='index'>
          <roleManage v-if="tab.type==1" :channelData="getChannelDataByChannelType(1)"></roleManage>
          <salesclerk v-if="tab.type==2" :channelData="getChannelDataByChannelType(2)"></salesclerk>
          <department v-if="tab.type==3" :channelData="getChannelDataByChannelType(3)"></department>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>
<script>
  import {Tabs, TabPane, Card} from "element-ui";
  import salesclerk from "./salesclerk";
  import roleManage from "./roleManage";
  import department from "./department";

  export default {
    name: 'channel_main',
    data() {
      return {
        activeName: "3",
        tabs: [
          {
            name: "部门管理",
            type: 3
          },
          {
            name: "角色管理",
            type: 1
          },
          {
            name: "员工管理",
            type: 2
          }
        ]
      }
    },
    methods: {
      getChannelDataByChannelType(channel_type) {
        return this.tabs.find(channel => channel.channel_type == channel_type);
      }
    },
    mounted() {

    },
    components: {
      salesclerk,
      roleManage,
      department
    }
  }
</script>
<style lang="scss" scoped>

</style>
