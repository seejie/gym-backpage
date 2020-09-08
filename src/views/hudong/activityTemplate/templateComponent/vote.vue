<template>
  <div class="basicregistration">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" class="elfrom">
        <el-form-item label="*活动标题">
          <el-col :span="8">
            <el-input placeholder="请输入标题，30字以内" v-model="form.name" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动摘要">
          <el-col :span="8">
            <el-input type="textarea" placeholder="请输入摘要，150字以内" :row="5" v-model="form.summary"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动介绍">
          <el-col :span="18">
            <myEditor refs="name1" v-model="form.intro"></myEditor>
          </el-col>
        </el-form-item>
        <el-form-item label="*活动封面">
          <img-include v-model="form.imgs" :max="9" :cropper="cropper"></img-include>
        </el-form-item>
        <el-form-item label="选项设置" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-radio v-model="form.checkradio" :label="1">单选</el-radio>
              <el-radio v-model="form.checkradio" :label="2">多选</el-radio>
              <el-button type="primary" @click="addkey">添加选项</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="40px" class="select">
          <el-row v-for="(item,index) in form.keys" :key="index" type="flex">
            <el-col :span="2" style="line-height: 45px">选项{{index+1}}</el-col>
            <el-col :span="6">
              <el-input
                placeholder="请输入，30字以内"
                v-model="item.title"
                style="width: 90%;height: 50px"
              ></el-input>
            </el-col>
            <el-col :span="2" style>
              <sigle-img v-model="item.pic" :isshowfilelist="false" class="upimg"></sigle-img>
            </el-col>
            <el-col :span="6">
              <i @click="removekey(index)" style="font-size: 25px" class="el-icon-delete-solid"></i>
              <i
                style="font-size: 25px;margin-left: 20px"
                class="el-icon-circle-plus-outline"
                @click="addkey"
              ></i>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="0px">
          <h3 style="margin:0">参与条件设置</h3>
        </el-form-item>
        <el-form-item label="*有效期至">
          <el-col :span="4">
            <el-date-picker placeholder="选择日期时间" v-model="form.onTime" type="datetime"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="*票数限制">
          <el-col :span="8">
            <el-input placeholder="请输入每人每天可甜票数" v-model="form.limit" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px">
          <h3 style="margin:0">发布设置</h3>
        </el-form-item>
        <el-form-item label="发布位置">
          <el-select placeholder="请选择" v-model="form.position">
            <el-option label="置顶" :value="1"></el-option>
            <el-option label="默认" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*发布时间">
          <el-row>
            <el-radio v-model="form.radio" :label="3">发布</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="form.radio" :label="2">草稿，暂不发布</el-radio>
          </el-row>
          <el-row>
            <el-col>
              <el-radio v-model="form.radio" :label="4">定时发布</el-radio>
            </el-col>
            <el-col>
              <el-date-picker placeholder="选择日期时间" v-model="form.publishTime" type="datetime"></el-date-picker>
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
import ImgInclude from '@/components/CropImgInclue';
import Pagination from '@/components/Pagination';
import SigleImg from '@/components/UploadImg';
export default {
  name: 'index',
  components: {
    ImgInclude,
    Pagination,
    SigleImg,
  },
  data() {
    return {
      id: this.$route.params.id,
      list: [],
      form: {
        name: '',
        summary: '',
        intro: '',
        imgs: {},
        keys: [{ id: '', title: '', type: 0, pic: '' }],
        onTime: '',
        limit: '',
        publishTime: '',
        position: 0,
        radio: 1,
        checkradio: 1,
      },
      cropper: [
        {
          name: '详情封面',
          ratio: 1.89,
          desc: '你将在地图管理看到此页面',
        },
      ],
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.id > 0) {
        this.$ajax
          .post('/back/interaction/getVoteInfo', { id: this.id })
          .then(res => {
            if (res.resCode == 200) {
              // {name:'',summary:'',intro:'',imgs:{},provinceid:'',cityid:'',areaid:'',address:'',zhubanname:'',chenbanname:'',keys:[{id:'',title:'',type:0,pic:''}],onTime:'',limit:'',publishTime:'',position:0,radio:1,checkradio:1},
              var data = res.resultList.info;
              var datalist = res.resultList.signUpList;
              this.form.name = data.title;
              this.form.summary = data.abstract_info;
              this.form.intro = data.content;
              this.form.imgs = { 'ratio1.89': [data.theme_pic] };
              if (datalist.length > 0) {
                this.form.keys = [];
                var d = { id: '', title: '', type: 0, pic: '' };
                for (var i = 0; i < datalist.length; i++) {
                  if (datalist[i].isdel == 0) {
                    d.title = datalist[i].title;
                    d.type = datalist[i].type;
                    d.id = datalist[i].id;
                    d.pic = datalist[i].pic;
                  }
                }
              }
              this.form.onTime = this.$moment(data.end_time).format('YYYY-MM-DD HH:mm:ss');
              this.form.limit = data.overplus_num;
              this.form.position = data.position;
              this.form.radio = data.publish_status;
            }
          })
          .catch(error => {});
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
      }
      // else  if(this.areaselected.length<3)
      // {
      //   this.message("请填写省市区", "error");
      // }
      else if (this.form.keys.length > 0 && this.form.keys[0].title === '') {
        this.message('请填写关键字', 'error');
      } else if (this.form.onTime === '') {
        this.message('请选择有效期', 'error');
      } else if (this.form.limit === '') {
        this.message('请填写票数限制', 'error');
      } else {
        this.$ajax
          .post(this.id > 0 ? '/back/interaction/updateVote' : '/back/interaction/saveVote', {
            id: this.id,
            interactionType: 1,
            title: this.form.name,
            abstract_info: this.form.summary,
            content: this.form.intro,
            theme_pic: this.form.imgs['ratio1.89'][0],
            overplus_num: this.form.limit,
            organizer: this.form.zhubanname,
            position: this.form.position,
            address: this.form.address,
            publish_status: this.form.radio,
            sponsor: this.form.chenbanname,
            singUpModel: this.form.keys,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.message('提交成功', 'success');
              // this.back();
            } else {
              this.message('提交失败', 'error');
            }
          })
          .catch(error => {});
      }
    },

    addkey() {
      // 添加关键字
      this.form.keys.push({ id: '', title: '', type: 0, pic: '' });
    },
    removekey(index) {
      // 移除某一行
      this.form.keys.splice(index, 1);
    },
    back() {
      this.$router.go(-1);
    },
    // 错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type,
      });
    },
  },
};
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

  .el-row {
    margin-bottom: 10px;
  }

  .foot {
    font-size: 20px;
    margin: 20px;
  }

  .select {
    .upimg {
      width: 50px;
      height: 50px;
      line-height: 50px;
      border: 1px #d9d9d9 dashed;
    }
    /deep/ .avatar {
      width: 45px;
      height: 45px;
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 45px;
      line-height: 45px;
    }
    i {
      line-height: 45px;
    }
  }
}
</style>
