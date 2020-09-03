<template>
  <div v-loading="loading" >
    <div style="display: flex">
      <div class="imgshow" v-if="imgs.length>0" v-for="(item,index) in imgs" :key="index">
        <img  :src="item" class="avatar" width="100" height="100" />
        <i class="el-icon-error" @click="removeimg(index)"></i>
      </div>
      <el-upload
        action=""
        :auto-upload="false"
        :show-file-list="true"
        class="avatar-uploader"
        :limit="limit"
        :on-change="beforeUpload"
        accept="image/*"
        ref="upload"
        style="width: 100px;height:100px"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <div class="uploader-text">{{ imgText }}</div>
  </div>
</template>

<script>
  import { Message } from 'element-ui';
  import compressUploadImg from '@/utils/compressUploadImg';
  import settings from '@/settings';

  const QiNiuYun = require('qiniu-js');

  export default {
    name: 'YPImgUpload',
    props: {
      imagePath: {
        type:Array,
        default: () => []
      },
      imgText: {
        type: String,
        default: `请上传${settings.uploadpicMaxSize}M以内的图片，支持PNG\\JPG等常见格式`,
      },
      imgSize: {
        type: Number,
        default: settings.uploadpicMaxSize,
      },
      limit: {
        type: Number,
        default: 1,
      },
    },
    watch: {
      imagePath(n, o) {
        this.image_path = n;
        if (!n.length) this.imgs = [];
      },
    },
    data() {
      return {
        image_path: '',
        loading: false,
        fileSuffix: '',
        imgs:[]
      };
    },
    mounted() {
      if(this.imagePath.length>0)
        this.imgs.push(this.imagePath);
    },
    methods: {
      //图片大小
      beforeUpload(file) {
        let file2 = file.raw;
        let reg = /.jpg$|.jpeg$|.png$/i;
        let isOverSize = file2.size / 1024 / 1024 < this.imgSize;
        if (!reg.test(file2.type)) {
          Message.error('图片只能是 JPG或者PNG 格式!');
          this.$refs.upload.clearFiles(); //清空列表
        } else if (!isOverSize) {
          Message.error('图片大小不能超过 ' + this.imgSize + 'MB!');
          this.$refs.upload.clearFiles(); //清空列表
        } else {
          this.compress(file2);
        }
      },
      //压缩图片
      compress(file) {
        let that = this;
        this.fileSuffix = '.' + file.name.split('.').pop();

        compressUploadImg(file).then(res => {
          this.image_path = res;
          that.getQiniuyunToken(res);
        });
      },

      //获取七牛云token
      getQiniuyunToken(file) {
        this.loading = true;
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

        let fileName = 'file_' + new Date().getTime() + this.fileSuffix;
        let observable = QiNiuYun.upload(file, fileName, token);
        let subscription = observable.subscribe({
          next(res) {},
          error(err) {
            console.log(err);
          },
          complete(res) {
            that.loading = false;
            that.image_path = url + '/' + res.key;
            that.imgs.push(that.image_path);
            that.$emit('update:imagePath', that.imgs);
            that.$refs.upload.clearFiles(); //清空列表
          },
        });
      },
      removeimg(index){
        this.imgs.splice(index,1);
      }
    },
  };
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }

  .avatar-uploader {
    /deep/ .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    display: block;
  }

  .uploader-text {
    font-size: 14px;
    color: #ccc;
  }
  .imgshow{
    position: relative;
    padding: 5px 10px 0 0;
    .el-icon-error{
      position: absolute;
      right: 0;
      top: 0;
      font-size: 15px;
    }
  }
</style>
