<template>
  <div class="wrap">
    <div class="wrap-content">
      <div class="box-shadow">
        <h3>基础课程设定</h3>
        <div class="switch"><span>栏目显示</span><el-switch v-model="coursePageSetup.showColumn"></el-switch></div>
        <div class="switch"><span>轮播图展示</span><el-switch v-model="coursePageSetup.showBanner"></el-switch></div>
        <h3>提问设置</h3>
        <div class="switch"><span>栏目显示</span><el-switch v-model="coursePageSetup.questionAnswerColumn"></el-switch></div>
        <div class="switch"><span>人数显示</span><el-switch v-model="coursePageSetup.questionAnswerNum"></el-switch></div>
        <h3>直播设置</h3>
        <div class="switch">
          <span required>栏目名称</span>
          <el-input v-model="coursePageSetup.liveCourseTitle" placeholder="请输入" style="width: 320px;"></el-input>
        </div>
        <div class="switch"><span>栏目显示</span><el-switch v-model="coursePageSetup.liveCourseColumn"></el-switch></div>
        <div class="switch"><span>人数显示</span><el-switch v-model="coursePageSetup.liveCourseNum"></el-switch></div>
        <div>
          <el-button type="primary" @click="submit" :disabled="!coursePageSetup.liveCourseTitle">提交</el-button>
          <el-button>预览</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import assign from 'object-assign';
  import { getPageConfig, updatePageConfig, addPageConfig } from './sever';

  export default {
    name: "",
    data() {
      return {
        pageHeight: window.innerHeight - 100 + 'px',
        activeName: 'first',
        value: '',
        name: '',
        coursePageSetup: {
          id: '',
          liveCourseColumn: true,
          liveCourseNum: true,
          liveCourseTitle: '',
          questionAnswerColumn: true,
          questionAnswerNum: true,
          showBanner: true,
          showColumn: true
        }
      };
    },
    created(){
      this.getConfig()
    },
    methods: {
      getConfig() {
        const that = this;
        getPageConfig(this.$ajax).then(res => {
          if (res.resCode == 200 && res.resObject.list[0]) {
            that.getBool(res.resObject.list[0]);
          } else {
            that.$message(res.message, 'error');
          }
        })
      },
      submit(){
        if (this.coursePageSetup.id) {
          this.updateConfig();
        } else {
          this.addConfig();
        }
      },
      updateConfig(){
        const that = this;
        const param = this.getParam(this.coursePageSetup)
        param.channelType =9;
        updatePageConfig(this.$ajax, this.coursePageSetup, param).then(res => {
          if (res.resCode == 200) {
            that.$message.success('编辑成功');
            that.getConfig();
          } else {
            that.$message(res.message, 'error');
          }
        })
      },
      addConfig(){
        const that = this;
        const param = this.getParam(this.coursePageSetup)
        param.channelType =9;
        addPageConfig(this.$ajax, param).then(res => {
          if (res.resCode == 200) {
            console.log(res)
            // that.listData = res.resObject.list || [];
            that.$message.success('新增成功');
            that.getConfig();

          } else {
            that.$message(res.message, 'error');
          }
        })
      },
      getParam(obj){
        const switchArr = ['liveCourseColumn',  'liveCourseNum', 'questionAnswerColumn', 'questionAnswerNum', 'showBanner', 'showColumn'];
        const param = assign(obj, switchArr.reduce((p, c) => {
          if (obj[c]) return assign(p, { [c]: 1 });
          return assign(p, { [c]: 0 });
        }, {}));
        return param;
      },
      getBool(data) {
        const obj = data || this.coursePageSetup;
        const switchArr = ['liveCourseColumn',  'liveCourseNum', 'questionAnswerColumn', 'questionAnswerNum', 'showBanner', 'showColumn'];
        const param = assign(obj, switchArr.reduce((p, c) => {
          if (obj[c]) return assign(p, { [c]: true });
          return assign(p, { [c]: false });
        }, {}));
        this.coursePageSetup = assign(this.coursePageSetup, param)
      }
    }
  }
</script>

<style scoped>
.wrap{
  width: 100%;
  height: 100%;
  padding: 16px;
}

.wrap-content{
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow:0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  overflow-y: scroll;
}
.box-shadow{
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.switch{
  margin: 16px 0;
}
.switch span[required]:before{
  content: '*';
  color: red;
}
.switch span{
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right:16px ;
}
</style>
