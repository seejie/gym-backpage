<template>
  <el-form label-width="50px" :model="form" style="padding: 20px;" ref="form" v-loading="uploadLoading">
    <el-form-item label="名称" :rules="rules" prop="title">
      <el-input v-model="form.title" placeholder="请输入图片名称"></el-input>
    </el-form-item>
    <el-form-item label="位置" prop="imageGroupId">
      <el-select v-model="form.imageGroupId" placeholder="">
        <el-option :label="g.name" :value="g.id" v-for="g in group" :key="g.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="path">
      <el-upload
        action=""
        :headers="{
          token: $store.getters.token,
          idfv: 'backend',
        }"
        :auto-upload="true"
        :show-file-list="false"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        class="avatar-uploader"
        :data="data"
        :limit="1"
        :before-upload="beforeAvatarUpload"
        ref="upload"
      >
        <img v-if="form.path" :src="form.path" class="avatar" />
        <i class="el-icon-plus avatar-uploader-icon" v-if="!form.path"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="form.path" alt="" />
      </el-dialog>
    </el-form-item>
  </el-form>
</template>

<script>
import { getImageGroupList } from '@/api/material';
import { Message } from 'element-ui';
import settings from '@/settings';
import { Promise } from 'q';
import upload from '@/utils/upload';
import compressUploadImg from '@/utils/compressUploadImg';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    value: {},
  },
  watch: {
    form: {
      handler() {
        this.$emit('input', this.form);
      },
      deep: true,
    },
    value: {
      handler() {
        this.form = this.value;
        if (!this.form.path) {
          this.$refs.upload.clearFiles();
        }
      },
      deep: true,
    },
    visible(val) {
      if (val) {
        this.getImageGroupList();
      }
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  created() {
    this.getImageGroupList();
  },
  data() {
    return {
      rules: [
        {
          title: [
            {
              required: true,
              message: '请输入图片名称',
              trigger: 'blur',
            },
          ],
          path: [
            {
              required: true,
              message: '请上传图片',
            },
          ],
        },
      ],
      imageUrl: '',
      dialogVisible: false,
      data: {
        token: '',
      },
      form: this.value,
      group: [],
      uploadLoading: false,
    };
  },
  methods: {
    getImageGroupList() {
      getImageGroupList({}).then(res => {
        this.group = res.resObject;
      });
    },
    handlePictureCardPreview() {},
    handleRemove() {},
    async beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isOverSize = file.size / 1024 / 1024 < settings.uploadpicMaxSize;

      if (!isJPG && !isPNG) {
        Message.error('上传图片只能是 JPG或者PNG 格式!');
        return;
      }
      if (!isOverSize) {
        Message.error(`上传图片大小不能超过 ${settings.uploadpicMaxSize}MB!`);
        return;
      }
      this.data.token = this.$store.getters.token;
      this.uploadLoading = true;

      let fileSuffix = '.' + file.name.split('.').pop();
      let res = await compressUploadImg(file)
      upload(res, fileSuffix)
        .then(url => {
          this.form.path = url;
          this.uploadLoading = false;
        })
        .catch(e => {
          this.uploadLoading = false;
        });
      return false;
    },
    handleAvatarSuccess(res, file) {
      this.form.path = res.resObject.url;
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$ref.form.validate(res => {
          if (res) {
            resolve();
          } else {
            reject();
          }
        });
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
</style>
