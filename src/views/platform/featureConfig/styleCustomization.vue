<template>
  <!-- 风格自定义 -->
  <div class="styleCustomization">
    <el-form ref="form" :model="styleData"  :rules="rules" label-width="150px">
      <el-form-item label="官网域名">
        <el-input v-model="styleData.website" placeholder="请输入官网一级域名"></el-input>
      </el-form-item>
      <el-form-item label="平台系统名" prop="sysName">
        <el-input v-model="styleData.sysName" placeholder="请输入系统名，1-30字"></el-input>
      </el-form-item>
      <el-form-item label="浏览器标签页标题" prop="shareTitle">
        <el-input v-model="styleData.shareTitle" placeholder="请输入分享标题，1-30字"></el-input>
      </el-form-item>

      <el-form-item label="浏览器标签页icon" class="share-icon" prop="shareIcon">
        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          class="avatar-uploader"
          :limit="1"
          :on-change="beforeUpload"
          ref="upload"
          accept="image/x-icon"
        >
          <img v-if="shareIcon" :src="shareIcon" class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon" v-if="!shareIcon"></i>
        </el-upload>
        <p class="img-tip">*图片格式：favicon大小建议50*50</p>
      </el-form-item>

      <el-form-item label="系统内LOGO" class="share-icon" prop="sysLogo">
        <img-include v-model="sysLogo" :max="1" :cropper="sysLogoCropper"></img-include>
        <p class="img-tip">*请上传{{settings.uploadpicMaxSize}}M以内图片，支持PNG\JPG等常见格式，大小建议106*26像素</p>
      </el-form-item>

      <el-form-item label="系统首页LOGO" class="share-icon" prop="indexLogo">
        <img-include v-model="indexLogo" :max="1" :cropper="indexLogoCropper"></img-include>
        <p class="img-tip">*请上传{{settings.uploadpicMaxSize}}M以内图片，支持PNG\JPG等常见格式，大小建议150*60像素</p>
      </el-form-item>
      <el-form-item label="">
        <el-button type="info">取消</el-button>
        <el-button type="primary" @click="styleSave()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue';
import settings from '@/settings';
const QiNiuYun = require('qiniu-js');

export default {
  props: ['styleData'],
  components: {
    ImgInclude,
  },
  data() {
    return {
      settings: settings,
      shareIcon: '',
      sysLogo: {},
      indexLogo: {},
      sysLogoCropper: [
        {
          name: '系统内LOGO',
          ratio_x: 106,
          ratio_y: 26,
          ratio: 4.07,
          desc: '系统内LOGO',
        },
      ],
      indexLogoCropper: [
        {
          name: '系统首页LOGO',
          ratio_x: 150,
          ratio_y: 60,
          ratio: 2.5,
          desc: "系统首页LOGO"
        }],
        rules: {
          sysName: [{
            required: true,
            message: "请输入系统名，1-30字",
            trigger: "blur"
          }],
          shareTitle: [{
            required: true,
            message: "请输入分享标题，1-30字",
            trigger: "blur"
          }],
          shareIcon: [{
            required: true,
            message: "请上传分享icon",
            trigger: "change"
          }],
          sysLogo:[{
            required: true,
            message: "请上传系统logo",
            trigger: "change"
          }],
          indexLogo:[{
            required: true,
            message: "请上传系统首页logo",
            trigger: "change"
          }]
        }
      }
    },
  watch: {
    shareIcon: {
      handler(n, o) {
        this.styleData.shareIcon = n;
      },
      deep: true,
    },
    sysLogo: {
      handler(n, o) {

        this.styleData.sysLogo = n['ratio4.07'] ? n['ratio4.07'].join(',') : '';
      },
      deep: true,
    },
    indexLogo: {
      handler(n, o) {

        this.styleData.indexLogo = n['ratio2.5'] ? n['ratio2.5'].join(',') : '';
      },
      deep: true,
    },

    styleData(val) {
      if (val.shareIcon != this.shareIcon) {
        this.shareIcon = val.shareIcon
      }
      if (val.sysLogo != this.sysLogo['ratio4.07'][0]) {
        this.sysLogo = {
          'ratio4.07': [val.sysLogo],
        };
      }
      if (val.indexLogo != this.indexLogo['ratio2.5'][0]) {
        this.indexLogo = {
          'ratio2.5': [val.indexLogo],
        };
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.styleData) {
        this.shareIcon = this.styleData.shareIcon;
        this.sysLogo =
          (this.styleData.sysLogo && {
            'ratio4.07': this.styleData.sysLogo.split(','),
          }) ||
          {};
        this.indexLogo =
          (this.styleData.indexLogo && {
            'ratio2.5': this.styleData.indexLogo.split(','),
          }) ||
          {};
      }
    }, 500);
  },
  methods: {
    styleSave() {
      this.$ajax
        .post('/platformsetting/functionsetting/customizeStyle/bindDefalutStyleInfo', {
          ...this.styleData,
        })
        .then(res => {
          this.$message.success('保存成功');
        })
        .catch(err => {
          console.log(err);
        });
    },

    //图片大小
    beforeUpload(file) {
      let file2 = file.raw;
      let reg = /.ico/i;
      if (!reg.test(file2.type)) {
        this.$message.error('图片只能是ico格式!');
        this.$refs.upload.clearFiles(); //清空列表
      } else {
        this.getQiniuyunToken(file2);
      }
    },

     //获取七牛云token
    getQiniuyunToken(file) {
      this.loading = true;
      console.log('获取七牛云token1');
      this.$ajax
        .get('/common/getQiniuyunToken')
        .then(res => {
          this.QiNiuYunUpload(file, res.resObject.token, res.resObject.qiNiuYunUrl);
        })
        .catch(err => console.log(err));
    },
    //七牛云上传
    QiNiuYunUpload(file, token, url) {
      let that = this;
      let fileName = 'file_' + new Date().getTime();
      let observable = QiNiuYun.upload(file, fileName, token);
      let subscription = observable.subscribe({
        next(res) {},
        error(err) {
          console.log(err);
        },
        complete(res) {
          that.loading = false;
          that.shareIcon = url + '/' + res.key;
          that.$emit('update:imagePath', that.shareIcon);
          that.$refs.upload.clearFiles(); //清空列表
        },
      });
    },
  },
};
</script>

<style lang="scss">
.styleCustomization {
  // .upload-container {
  //   width: 50px;
  //   height: 50px;
  //   border: 1px solid #ccc;
  // }
  .item {
    height: 200px !important;
  }

  .img-tip {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
  }
  .center{
    height:100%!important;
    max-height: 100%!important;
  }
  .text{
    display: block!important;
  }

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    width: 178px;
    height: 178px;
    overflow: hidden;
    border-radius: 6px;
    /deep/ .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    display: block;
  }
}
</style>
