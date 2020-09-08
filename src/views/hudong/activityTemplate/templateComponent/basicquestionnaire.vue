<template>
  <div class="basicregistration">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" class="elfrom">
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
        <el-form-item label="*活动位置">
          <el-row>
            <el-col>
              <area-cascader   style="line-height: 16px" :level="1" v-model="areaselected" :data="pcaa"></area-cascader>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="请填写详细地址" v-model="form.address"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="主办方">
          <el-col :span="8"><el-input placeholder="请输入，30字以内" v-model="form.zhubanname" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="承办方">
          <el-col :span="8"><el-input placeholder="请输入，30字以内" v-model="form.chenbanname" width="80%"></el-input></el-col>
        </el-form-item >
        <el-form-item label="*报名关键词设置" label-width="130px">
          <el-row>
            <el-col :span="8"><el-button type="primary" @click="addkey">添加关键字</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="30px">
          <el-row  v-for="(item,index) in form.keys" :key="item.id" >
            <el-row  type="flex" >
              <el-col :span="2">关键字{{index+1}}</el-col>
              <el-col :span="6"><el-input  placeholder="请输入，30字以内" v-model="item.title" style="width: 90%"></el-input></el-col>
              <el-col :span="6">
                <el-select    v-model="item.type" style="width: 90%">
                  <el-option v-for="item1 in txttype" :key="item1.name" :label="item1.name" :value="item1.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6"><el-radio v-model="item.is_need"  :label="1">必填</el-radio><i @click="removekey(index)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style=";margin-left: 20px;font-size: 18px" class="el-icon-circle-plus-outline" @click="addkey"></i></el-col>
            </el-row>
            <el-row v-if="item.type=='2'||item.type=='3'" v-for="(item1,index1) in item.options" :key="index1" type="flex" style="margin-left: 30px">
              <el-col :span="2">选项{{index1+1}}</el-col>
              <el-col :span="6"><el-input  placeholder="请输入，30字以内" v-model="item1.title"  style="width: 90%"></el-input></el-col>
              <el-col :span="6"><i @click="removekeyone(index,index1)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style="margin-left: 20px;font-size: 18px;" class="el-icon-circle-plus-outline" @click="addkeyone(index)"></i></el-col>
            </el-row>
          </el-row>

        </el-form-item>
        <el-form-item label-width="0px">
          <h3 style="margin:0">报名条件设置</h3>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-col :span="4">
            <el-date-picker placeholder="选择日期时间"  format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"  v-model="form.onTime"  type="datetime"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="*人数限制">
          <el-col :span="8"><el-input placeholder="请输入限制人数，不填则无限" v-model="form.limit" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="报名费用">
          <el-col :span="8"><el-input placeholder="默认为不收费" v-model="form.charge" width="80%"></el-input></el-col>
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
              <el-date-picker placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"   v-model="form.publishTime"  type="datetime"></el-date-picker>
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
      uid: '',
      unit_id: '',
      pca: pca,
      pcaa: pcaa,
      list: [],
      areaselected: [], // 省市区选择
      reltiveareaselected: [], // 店铺选择省市区
      form: { name: '', summary: '', intro: '', imgs: {}, provinceid: '', cityid: '', areaid: '', address: '', zhubanname: '', chenbanname: '', keys: [{ id: '', title: '', type: '', is_need: 0, options: [{ title: '' }] }], onTime: '', limit: '', charge: '', publishTime: '', position: 0, radio: 1, },
      cropper: [{
        name: '详情封面',
        ratio: 1.89,
        desc: '你将在地图管理看到此页面'
      }],
      txttype: [
        { name: '文本', value: '1' },
        { name: '单选', value: '2' },
        { name: '多选', value: '3' },
        { name: '时间选择 ', value: '4' },
        { name: '手机号', value: '5' },
        { name: '图片上传', value: '6' },
        { name: '附件上传', value: '7' }
      ]
    }
  },
  mounted() {
    this.load();
    this.getuser();
  },
  methods: {
    load() {
      if (this.id > 0) {
        this.$ajax.post('/back/interaction/getSignUpInfo', { id: this.id }).then(res => {
          if (res.resCode == 200) {
            // {name:'',summary:'',intro:'',imgs:{},provinceid:'',cityid:'',areaid:'',address:'',zhubanname:'',chenbanname:'',keys:[{id:'',title:'',type:0,is_need:'',options:{value:[],option:[]}}],onTime:'',limit:'',charge:'',publishTime:'',position:0,radio:1,},
            var data = res.resultList.info;
            var datalist = res.resultList.signUpList;
            this.form.name = data.title;
            this.form.summary = data.abstract_info;
            this.form.intro = data.content;
            this.form.imgs = { 'ratio1.89': [data.theme_pic] };
            // this.form.provinceid=data.provinceId;
            // this.form.cityid=data.cityId;
            // this.form.areaid=data.areaId;
            // this.areaselected.push(pcaa[86][this.form.provinceid]);     //res.data.addrprovinceid省对应的id
            // this.areaselected.push(pcaa[this.form.provinceid][this.form.cityid]);//res.data.addrcityid省对应的id
            // this.areaselected.push(pcaa[this.form.cityid][this.form.areaid]);    //res.data.addrcountyid省对应的id
            this.form.address = data.address;
            this.form.zhubanname = data.organizer;
            if (datalist.length > 0) {
              this.form.keys = [];
              for (var i = 0; i < datalist.length; i++) {
                var d = { title: '', type: '', is_need: 0, options: [{ title: '' }] };
                if (datalist[i].is_del == 0) {
                  d.title = datalist[i].title;
                  d.type = datalist[i].type + '';
                  d.is_need = datalist[i].is_need;
                  d.id = datalist[i].id;
                  for (var j = 0; j < Object.keys(datalist[i]).length; j++) {
                    if (Object.keys(datalist[i])[j].indexOf('option') !== -1) {
                      d.options.push({ title: datalist[i][Object.keys(datalist[i])[j]] });
                    }
                  }
                  d.options.shift();
                  this.form.keys.push(d);
                }
              }
            }
            this.form.chenbanname = data.sponsor == null ? '' : data.sponsor;
            this.form.onTime = data.end_time != null ? this.$moment(data.end_time).format('YYYY-MM-DD HH:mm:ss') : '';
            this.form.limit = data.overplus_num;
            this.form.charge = Math.round(data.money / 100, 2);
            this.form.position = data.position;
            this.form.publishTime = data.start_time != null ? this.$moment(data.start_time).format('YYYY-MM-DD HH:mm:ss') : '';
            this.form.radio = data.publish_status;
          }
        }).catch(error => {

        });
      }
    },
    getuser() {
      this.$ajax.get('/sys/user/myAcct').then((res) => {
        this.uid = res.resObject.id
        this.unit_id = res.resObject.unit_id;
      })
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
      }
      // else  if(this.areaselected.length<3)
      // {
      //   this.message("请填写省市区", "error");
      // }
      else if (this.form.address == '') {
        this.message('请填写地址', 'error');
      } else if (this.form.keys.length > 0 && this.form.keys[0].title == '') {
        this.message('请填写关键字', 'error');
      } else if (this.form.limit == '') {
        this.message('请填写限制人数', 'error');
      } else if (this.form.charge == '' || this.form.charge == null) {
        this.message('请填写报名费用', 'error');
      } else {
        if (this.areaselected.length > 2) {
          this.form.provinceid = this.areaselected[0];
          this.form.cityid = this.areaselected[1];
          this.form.areaid = this.areaselected[2];
        }
        var singUpModel = [];

        for (var i = 0; i < this.form.keys.length; i++) {
          var get = {
            id: this.form.keys[i].id,
            title: this.form.keys[i].title,
            type: this.form.keys[i].type,
            is_need: this.form.keys[i].is_need
          };
          for (var j = 0; j < this.form.keys[i].options.length; j++) {
            if (this.form.keys[i].options[j].title != '') { get['option' + (j + 1)] = this.form.keys[i].options[j].title; }
          }
          singUpModel.push(get);
        }
        var data = { uid: this.uid, unit_id: this.unit_id, title: this.form.name, abstract_info: this.form.summary, content: this.form.intro, theme_pic: this.form.imgs['ratio1.89'][0], overplus_num: this.form.limit, organizer: this.form.zhubanname, is_charge: this.form.charge != '' ? 1 : 0, address: this.form.address, publish_status: this.form.radio, sponsor: this.form.chenbanname, channel_id: 0, charge: this.form.charge, start_time: this.form.publishTime, end_time: this.form.onTime, singUpModel: JSON.stringify(singUpModel), position: this.form.position };
        if (this.id > 0) {
          data.interaction_type = 7;
          data.id = this.id;
        } else {
          data.interactionType = 7;
        }
        this.$ajax.post(this.id > 0 ? '/back/interaction/updateSignUp' : '/back/interaction/saveSignUp', data).then(res => {
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

    addkey() { // 添加关键字
      this.form.keys.push({ title: '', type: '', is_need: 0, options: [{ title: '' }] });
    },
    removekey(index) { // 移除某一行
      this.form.keys.splice(index, 1);
    },
    addkeyone(index) { // 添加选项
      this.form.keys[index].options.push({ title: '' });
    },
    removekeyone(index, index1) { // 移除选择
      this.form.keys[index].options.splice(index1, 1);
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
