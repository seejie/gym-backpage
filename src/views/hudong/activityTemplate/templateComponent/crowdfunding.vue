<template>
  <div class="basicregistration">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>
      <el-form ref="form" :model="form" label-width="130px" class="elfrom">
        <el-form-item label="*活动标题">
          <el-col :span="8"><el-input placeholder="请输入标题，30字以内" v-model="form.name" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="活动摘要">
          <el-col :span="8"><el-input type="textarea" placeholder="请输入摘要，150字以内" :row="5" v-model="form.summary"></el-input></el-col>
        </el-form-item>
        <el-form-item label="活动介绍" >
          <el-col :span="18"><myEditor refs='name1' v-model="form.intro"></myEditor></el-col>
        </el-form-item>
        <el-form-item label="*活动封面">
          <img-include v-model="form.imgs" :max="9" :cropper="cropper"></img-include>
        </el-form-item>
          <el-form-item label-width="0px">
          <h3 style="margin:0">筹款设置</h3>
        </el-form-item>
        <el-form-item label="*目标金额">
          <el-col :span="8"><el-input placeholder="请输入筹款目标总金额，金额 元" v-model="form.charge" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="*每人最低目标金额">
          <el-col :span="8"><el-input placeholder="请输入参与个人最低金额，金额 元" v-model="form.mincharge" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="*有效期至">
          <el-col :span="4">
            <el-date-picker placeholder="选择日期时间"   v-model="form.onTime"  type="datetime"></el-date-picker>
          </el-col>
        </el-form-item>
          <el-form-item label-width="0px">
          <h3 style="margin:0">发布设置</h3>
        </el-form-item>
        <el-form-item  label="发布位置">
          <el-select placeholder="请选择" v-model="form.position">
            <el-option label="置顶" :value="1"></el-option>
            <el-option label="默认" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="*发布时间">
          <el-row>
            <el-radio v-model="form.radio" :label="3">发布</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="form.radio" :label="2">草稿，暂不发布</el-radio>
          </el-row>
          <el-row>
            <el-col><el-radio v-model="form.radio"  :label="4">定时发布</el-radio></el-col>
            <el-col>
              <el-date-picker placeholder="选择日期时间"   v-model="form.publishTime"  type="datetime"></el-date-picker>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue'
import Pagination from '@/components/Pagination';
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
export default {
  name: 'index',
  components: {
    ImgInclude,
    Pagination
  },
  data() {
    return {
      id: this.$route.params.id,
      pca: pca,
      pcaa: pcaa,
      list: [],
      form: { name: '', summary: '', intro: '', imgs: {}, onTime: '', charge: '', mincharge: '', publishTime: '', position: 0, radio: 1 },
      cropper: [{
        name: '详情封面',
        ratio: 1.89,
        desc: '你将在地图管理看到此页面'
      }]
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.id > 0) {
        this.$ajax.post('/back/interaction/getAnswerInfo', { id: this.id }).then(res => {
          if (res.resCode == 200) {
            // {name:'',summary:'',intro:'',imgs:{},onTime:'',limit:'',charge:'',mincharge:'',publishTime:'',position:0,radio:1},
            var data = res.resultList.info;
            var datalist = res.resultList.signUpList;
            this.form.name = data.title;
            this.form.summary = data.abstract_info;
            this.form.intro = data.content;
            this.form.imgs = { 'ratio1.89': [data.theme_pic] };
            this.form.onTime = this.$moment(data.end_time).format('YYYY-MM-DD HH:mm:ss');
            this.form.limit = data.overplus_num;
            this.form.charge = data.charge;
            this.form.mincharge = data.charge;
            this.form.position = data.position;
            this.form.publishTime = this.$moment(data.start_time).format('YYYY-MM-DD HH:mm:ss');
            this.form.radio = data.publish_status;
          }
        }).catch(error => {

        });
      }
    },
    onSubmit() {
      if (this.form.name.length == 0) {
        this.message('活动标题不能为空', 'error');
      } else if (this.form.name.length > 30) {
        this.message('活动标题字数不能超过30', 'error');
      } else if (this.form.summary != null && this.form.summary.length > 150) {
        this.message('活动摘要字数不能超过150', 'error');
      } else if (this.form.imgs['ratio1.89'] == null || this.form.imgs['ratio1.89'][0] == null) {
        this.message('请添加图片', 'error');
      } else if (this.form.charge === '') {
        this.message('请填入目标金额', 'error');
      } else if (this.form.mincharge === '') {
        this.message('请填入每人最低目标金额', 'error');
      } else if (this.form.onTime === '') {
        this.message('请选择有效期', 'error');
      } else {
        this.$ajax.post(this.id > 0 ? '/back/interaction/updateFund' : '/back/interaction/saveFund', { id: this.id, interactionType: 7, title: this.form.name, abstract_info: this.form.summary, content: this.form.intro, theme_pic: this.form.imgs['ratio1.89'][0], overplus_num: this.form.limit, organizer: this.form.zhubanname, is_charge: this.form.charge !== '' ? 1 : 0, cityId: this.form.cityid, provinceId: this.form.provinceid, areaId: this.form.areaid, position: this.form.position, address: this.form.address, publish_status: this.form.radio, sponsor: this.form.chenbanname, charge: this.form.charge, singUpModel: this.form.keys }).then(res => {
          if (res.resCode == 200) {
            this.message('提交成功', 'success');
            // this.back();
          } else {
            this.message('提交失败', 'error');
          }
        }).catch(error => {

        });
      }
    },

    addkey(index, type) { // 添加关键字
      switch (type) {
        case 1:// 添加题目
          this.form.keys.push({ id: '', title: '', type: 0, selects: [{ title: '', isanswer: 0 }] });
          break;
        case 2:// 添加选项
          this.form.keys[index].selects.push({ title: '', isanswer: 0 });
          break;
      }
    },
    removekey(index, type, index1) { // 移除某一行
      switch (type) {
        case 1:
          this.form.keys.splice(index, 1);
          break;
        case 2:
          this.form.keys[index].selects.splice(index1, 1);
          break;
      }
    },
    back() {
      this.$router.go(-1);
    },
    // 错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type
      });
    }
  }
}
</script>

<style lang="scss"  scoped>
  .basicregistration {
    @extend %fill;
    padding: 10px 3%;
    .elfrom {
      margin-top: 30px;
    }
    .rate {
      display: flex;
      align-items: center;
      justify-content: left;
      height: 40px;
    }

    .el-row{
      margin-bottom: 10px;
    }

    .foot{
      font-size: 20px;
      margin:20px;
    }
  }

</style>
