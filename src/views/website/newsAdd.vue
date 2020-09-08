<template>
  <div class="container">
    <el-card shadow="never" class="box-card">
      <div slot="header">
        <span>基本信息</span>
      </div>

      <div style="padding-right:20px;">
        <el-form ref="ruleForm" label-width="100px">
          <el-form-item label="*新闻标题">
            <el-input type="text" maxlength="30" placeholder="请输入名称，30字以内" v-model="addData.title"></el-input>
          </el-form-item>
          <el-form-item label="新闻摘要">
            <el-input
              type="textarea"
              maxlength="150"
              show-word-limit
              v-model="addData.abstractInfo"
              placeholder="请输入介绍，150字以"
            ></el-input>
          </el-form-item>
          <el-form-item label="正文详情">
            <myEditor v-model="addData.content"></myEditor>
          </el-form-item>
          <el-form-item label="*图文封面">
            <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card style="margin-top: 20px" shadow="never" class="box-card">
      <div slot="header">
        <span>发布设置</span>
      </div>

      <div style="padding-right:20px;">
        <el-form ref="ruleForm" label-width="100px">
          <el-form-item label="*发布时间">
            <el-radio-group v-model="addData.publishStatus">
              <el-radio :label="3" style="line-height: 2.8">立即发布</el-radio>
              <br />
              <el-radio :label="1" style="line-height: 2.8">
                草稿，暂不发布
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-right: 10px" type="primary" @click="saveBtn()">
              提交
            </el-button>
            <router-link :to="{ name: 'websiteNews' }">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ImgInclude from '@/components/CropImgInclue';
import Api from '@/api/website/news';

export default {
  name: 'newsAdd',
  components: {
    ImgInclude,
  },

  data() {
    return {
      routerId: null,

      addData: {
        abstractInfo: '',
        title: '',
        content: '',
        indexPic: '',
        publishStatus: 3, // 3发布 1草稿
      },

      // 图片上传
      imgs: {
        'ratio1.217': [],
      },

      cropper: [
        {
          name: '普通封面',
          ratio_x: 280,
          ratio_y: 230,
          ratio: 1.217,
          desc: '你的用户将在新闻列表里，看到此封面。',
        },
      ],

      detail: {
        id: '',
      },
    };
  },

  watch: {
    'detail.id'(val) {
      if (!val && this.routerId != '-1') {
        this.$router.push({ name: 'websiteNews' });
      }
    },
  },

  created() {
    this.routerId = this.$route.params.id;
    const detail = this.$route.params.data;
    this.detail = detail;

    if (detail && detail.id) {
      this.addData = {
        abstractInfo: detail.abstractInfo,
        title: detail.title,
        content: detail.content,
        publishStatus: detail.publishStatus,
      };
      this.imgs['ratio1.217'] = [detail.indexPic];
    }
  },

  methods: {
    saveBtn() {
      this.addData.indexPic = this.imgs['ratio1.217'][0];
      if (this.addData.title === '') {
        this.message('请输入标题', 'error');
        return;
      } else if ((this.indexPic = '')) {
        this.message('请选择图文封面', 'error');
        return;
      } else if ((this.publishStatus = '')) {
        this.message('请选择发布时间', 'error');
        return;
      }

      if (this.routerId !== -1) {
        this.addData.id = this.routerId;
      }

      Api.add(this.addData).then(res => {
        if (res.resCode == 200) {
          this.message('提交成功', 'success');
          this.$router.push({ name: 'websiteNews' });
        }
      });
    },

    // 错误、成功提示
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

<style lang="scss" scoped>
.container {
  @extend %fill;
  padding: 10px 15%;
}

/deep/ .el-form-item .el-form-item {
  margin-bottom: 22px;
}

/deep/ .el-dialog.imagetextadd > .el-dialog__body {
  padding: 0;
}
</style>
