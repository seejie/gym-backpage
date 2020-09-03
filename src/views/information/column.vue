<template>
  <div class="dd-page">
    <el-card class="box-card">
      <div class="channel_form">
        <el-card class="box-card">
          <el-form :model="channelData"
                  :rules="rules"
                  ref="channelForm"
                  label-width="100px"
                  class="demo-ruleForm">
            <menu-list></menu-list>
          </el-form>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>
  import menuList from './components/menu_list'
  import {info,confirm} from '@/utils/ddHelper'
  import {
    Card
  } from "element-ui";

  export default {
    name: 'zixun',

    data() {
      return {
        rules: {},
        channelData: {}
      }
    },
    methods: {
    },
    components: { menuList}
  }
</script>
<style lang="scss">
  .channel_form {
    .zixun_switch {
      margin-left: 16px;
    }

    .channel-text-desc {
      font-size: 14px;
      color: #ccc;
    }

    .el-switch__label.el-switch__label--left {
      color: #606266 !important;
    }
  }
</style>
