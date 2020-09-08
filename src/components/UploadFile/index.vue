<template>
  <div class="upload-container">
    <el-upload
      class="upload-demo"
      action="http://upload.qiniup.com/"
      :data="dataObj"
      :multiple="false"
      :show-file-list="true"
      :on-success="handleImageSuccess"
      :before-upload="beforeUpload"
      :accept="accept"
      :limit="1"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
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
    fileList: {
      type: Array,
      default: () => [],
    },
    material: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      dataObj: {
        token: '',
        key: '',
      },
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

                if(this.material=="voice" && element.moduleName=='音频素材'&&element.isShow==0){
                  status= true
                }
                if(this.material=="video" && element.moduleName=='视频素材'&&element.isShow==0){
                  status= true
                }
                if(this.material=="document" && element.moduleName=='文档素材'&&element.isShow==0){
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
    handleImageSuccess(response, file, fileList) {
      this.$ajax
        .get('/sys/sys_setting/queryQiniuyun')
        .then(res => {
          this.$emit('input', res.resObject.qiniuyunUrl + '/' + response.key);
        })
        .catch(err => {
          console.log(err);
        });
    },
    async beforeUpload() {
      const setTing = await this.getPagesetting()
      if(this.material=="voice"&&setTing){
        Message.warning('没有音频素材权限，请联系管理员！');
        reject(false);
      }
      if(this.material=="video"&&setTing){
        Message.warning('没有视频素材权限，请联系管理员！');
        reject(false);
      }
      if(this.material=="document"&&setTing){
        Message.warning('没有文档素材权限，请联系管理员！');
        reject(false);
      }
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
            console.log(err);
            reject(false);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-container {
  /deep/ .el-upload {
    width: 80px;
  }
}

</style>
