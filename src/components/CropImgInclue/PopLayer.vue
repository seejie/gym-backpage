<template>
  <el-dialog title="创建素材" class="xqn" :visible.sync="createVisible" width="450px" append-to-body>
    <img-upload :visible="createVisible" :activeGroup="activeGroup" v-model="form"></img-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveMaterial">保存</el-button>
      <el-button @click="createVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImgUpload from './Upload';
import { addImage } from '@/api/material';
import { Message } from 'element-ui';
import { mapMutations } from 'vuex'
export default {
  props: {
    visible: Boolean,
    activeGroup: ''
  },
  model: {
    prop: 'visible',
    event: 'input',
  },
  components: {
    ImgUpload,
  },
  data() {
    return {
      form: {
        title: '',
        path: '',
        imageGroupId: this.activeGroup ? parseInt(this.activeGroup) : 0,
        mediaId: '',
      },
      createVisible: this.visible,
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.clear();
      }
      this.createVisible = this.visible;
    },
    createVisible() {
      this.$emit('input', this.createVisible);
    },
  },
  methods: {
    ...mapMutations('app', ['SET_IMAGE_GROUP']),
    clear() {
      this.form = {
        title: '',
        path: '',
        imageGroupId: this.activeGroup ? parseInt(this.activeGroup) : 0,
        mediaId: '',
      };
    },
    saveMaterial() {
      if (this.form.title.length == '') {
        this.message('请输入名称', 'error');
        return;
      } else if (this.form.title.length > 30) {
        this.message('请输入30字以内的名称', 'error');
        return;
      } else if (this.form.imageGroupId == null) {
        this.message('请选择分组', 'error');
        return;
      } else if (this.form.path == '') {
        this.message('请上传图片', 'error');
        return;
      }

      this.SET_IMAGE_GROUP(this.form.imageGroupId)

      addImage(this.form).then(res => {
        this.$message.success('创建成功');
        //this.createVisible = false;
        this.$emit('added', this.form);
      });
    },

    //错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type,
        duration: 5 * 1000,
      });
    },
  },
};
</script>
