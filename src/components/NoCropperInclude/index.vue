<template>
  <div v-loading="loading">
    <el-upload
      action=""
      :auto-upload="false"
      :show-file-list="false"
      class="avatar-uploader"
      :limit="1"
      :on-change="beforeUpload"
      accept="image/*"
      ref="upload"
    >
      <img v-if="image_path" :src="image_path" class="avatar" />
      <i class="el-icon-plus avatar-uploader-icon" v-if="!image_path"></i>
    </el-upload>
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
    imagePath: String,
    imgText: {
      type: String,
      default: `请上传${settings.uploadpicMaxSize}M以内的图片，支持PNG\\JPG等常见格式`,
    },
    imgSize: {
      type: Number,
      default: settings.uploadpicMaxSize,
    },
    material: {
      type: String,
      default: ''
    }
  },
  watch: {
    imagePath(n, o) {
      this.image_path = n;
    },
  },
  data() {
    return {
      image_path: this.imagePath,
      loading: false,
      fileSuffix: ''
    };
  },
  methods: {
    //素材配置
    getPagesetting(){
      return this.$ajax
        .get('/material/pageSetting/getDefaultSetting', {})
        .then(res => {
          if (res.resCode == 200) {
            let status = false;
            res.resObject.forEach(element => {
                if(element.moduleName=='图片素材'&&element.isShow==0){
                  status= true
                }
            });
            return status
          } else {
            Message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    //图片大小
    async beforeUpload(file) {
      const setTing = await this.getPagesetting()
      if(this.material=="image" && setTing){
        Message.warning('没有图片素材权限，请联系管理员！');
        return false
      }

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
          that.$emit('update:imagePath', that.image_path);
          that.$refs.upload.clearFiles(); //清空列表
        },
      });
    },
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  display: block;
}

.uploader-text {
  font-size: 14px;
  color: #ccc;
}
</style>
