<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://upload.qiniup.com/"
      :data="dataObj"
      :multiple="false"
      :show-file-list="type != 'image'"
      :on-success="handleImageSuccess"
      :before-upload="beforeUpload"
      :accept="accept"
      :on-change="onChange"
      ref="upload"
      :auto-upload="false"
    >
      <template v-if="type == 'image'">
        <img v-if="filePath" :src="filePath" class="avatar" />
        <i class="el-icon-plus avatar-uploader-icon" v-else></i>
      </template>
      <el-button size="small" type="primary" v-else>点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu';
import { Message } from 'element-ui';

export default {
  name: 'uploadFile',
  props: {
    accept: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'image',
    },
  },

  computed: {
    typeMap() {
      return {
        image: {
          label: '图片',
          size: 2,
        },
        voice: {
          label: '语音',
          size: 2,
        },
        video: {
          label: '视频',
          size: 10,
        },
      };
    },
  },

  data() {
    return {
      dataObj: {
        token: '',
        key: '',
      },

      filePath: '',
    };
  },
  methods: {
    handleImageSuccess(response, file, fileList) {
      this.handleUploadWechat(response, file, fileList);
    },

    upLoadQiniuyun(response, file, fileList) {
      this.$ajax
        .get('/sys/sys_setting/queryQiniuyun')
        .then(res => {
          this.filePath = res.resObject.qiniuyunUrl + '/' + response.key;
          this.$emit('input', res.resObject.qiniuyunUrl + '/' + response.key);
        })
        .catch(err => {});
    },

    beforeUpload() {
      const _self = this;
      return new Promise((resolve, reject) => {
        getToken()
          .then(response => {
            const key = response.resObject.secretKey;
            const token = response.resObject.token;
            _self.dataObj.token = token;
            _self.dataObj.key = key + new Date().getTime();
            resolve(true);
          })
          .catch(err => {
            reject(false);
          });
      });
    },

    handleUploadWechat(response, file, fileList) {
      const formData = new FormData();
      let data = {
        type: this.type,
        file: file.raw,
      };

      if (data) {
        for (let [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }
      }

      this.$ajax
        .post('/material/materialsUpload/addOther', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => {
          this.$emit('inputMediaId', res.resObject.media_id);
          this.upLoadQiniuyun(response, file, fileList);
        })
        .catch(err => {});
    },

    onChange(file) {
      let overSize = file.raw.size / 1024 / 1024 < this.typeMap[this.type].size;
      if (!overSize) {
        Message.error(`${this.typeMap[this.type].label}大小不能超过` + this.typeMap[this.type].size + 'M!');
        this.$refs.upload.clearFiles(); //清空列表
        this.$refs.upload.abort();
      } else {
        this.$refs.upload.submit();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 178px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.avatar-uploader-icon:hover {
  border-color: #409eff;
}
</style>
