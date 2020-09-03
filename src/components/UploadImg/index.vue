<template>
  <div class="upload-container">
    <el-upload class="avatar-uploader" action="http://upload.qiniup.com/" :data="dataObj" :multiple="false"
      :show-file-list="false" :on-success="handleImageSuccess" :before-upload="beforeUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  import {
    getToken
  } from '@/api/qiniu'

  export default {
    data() {
      return {
        dataObj: {
          token: '',
          key: ''
        },
        imageUrl: ''
      }
    },
    methods: {
      handleImageSuccess(response, file, fileList) {
        this.$ajax.get('/sys/sys_setting/queryQiniuyun').then((res) => {
          this.imageUrl = res.resObject.qiniuyunUrl +'/'+ response.key;
          this.$emit('input', this.imageUrl)
        }).catch((err) => {
          console.log(err)
        })

      },
      beforeUpload() {
        const _self = this;
        return new Promise((resolve, reject) => {
          getToken().then(response => {
            const key = response.resObject.secretKey
            const token = response.resObject.token
            _self.dataObj.token = token;
            _self.dataObj.key = key + (new Date()).getTime();
            resolve(true)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .avatar {
    width: 50px;
    height: 50px;
  }

</style>
