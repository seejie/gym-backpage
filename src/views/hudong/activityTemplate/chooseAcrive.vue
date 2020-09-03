<template>
  <div class="activity-template">
    <el-card class="box-card">
      <div class="activity-template-title">表单类</div>
      <div class="activity-template-list clearfix">
        <div class="activity-template-item" v-for="(item,index) in formClassData" :key="index">
          <router-link :to="{name: item.url}">
            <el-image style="width: 48px; height: 48px;" :src="item.path" fit="contain"></el-image>
            <div style="margin-top: 10px" >{{item.name}}</div>
          </router-link>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top: 40px;">
      <div class="activity-template-title">红包类</div>
      <div class="activity-template-list clearfix">
        <div class="activity-template-item" v-for="(item,index) in redPacketData" :key="index">
          <router-link :to="item.url">
            <el-image style="width: 48px; height: 48px;" :src="item.path" fit="contain"></el-image>
            <div style="margin-top: 10px">{{item.name}}</div>
          </router-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
// import ImgInclude from '@/components/ImgInclude';
export default {
  components: {},
  data() {
    return {
      formClassData: [
        {
          name: '报名(基础版)',
          path: require('./images/img_formclass_1.png'),
          url: 'basicregistration',
        },
        {
          name: '报名(高级版)',
          path: require('./images/img_formclass_1.png'),
          url: 'advancedregistration',
        },
        {
          name: '投票',
          path: require('./images/img_formclass_1.png'),
          url: 'vote',
        },
        {
          name: '答题',
          path: require('./images/img_formclass_1.png'),
          url: 'answequestions',
        },

        {
          name: '测试',
          path: require('./images/img_formclass_1.png'),
          url: 'answequestionstest',
        },

        {
          name: '基础问卷',
          path: require('./images/img_formclass_1.png'),
          url: 'basicquestionnaire',
        },
        {
          name: '共享报名',
          path: require('./images/img_formclass_1.png'),
          url: 'sharingregistration',
        },
      ],
      redPacketData: [
        {
          name: '众筹',
          path: require('./images/img_formclass_3.png'),
          url: 'crowdfunding',
        },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.activity-template {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
  .box-card {
    width: 100%;
    overflow: auto;
  }
}
.activity-template-title {
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #e3e3e3;
  padding-bottom: 20px;
}
.activity-template-list {
  margin-top: 20px;
  .activity-template-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border: 1px solid #e3e3e3;
    float: left;
    margin-left: 20px;
    cursor: pointer;
    a {
      text-align: center;
    }
  }
}
</style>
