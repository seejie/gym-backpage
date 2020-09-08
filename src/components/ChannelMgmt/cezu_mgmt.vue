<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form
        :model="channelData"
        :rules="rules"
        ref="channelForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- <channel-main :channelData="channelData" ref="channelMain"></channel-main> -->
        <el-form-item label="首页图片" class="upload-icon" ref="channel_banner_upload" prop="banner">
          <img-include v-model="banner_pic" :max="1" :cropper="indexCropper"></img-include>

          <div >
            尺寸: 750*864
          </div>
        </el-form-item>
        <el-form-item label="多记录显示" prop="showMany">
          <el-radio-group v-model="channelData.showMany">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否采集用户信息" prop="collectUserdata">
          <el-radio-group v-model="channelData.collectUserdata">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="preview">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <preview
      @change-show="onChangeShow"
      :is-show-preview-dialog="isShowPreviewDialog"
      :preview_url="preview_url"
    ></preview>
  </div>
</template>
<script>
import channelMain from '@/components/ChannelMgmt/index';
import menuList from './components/menu_list';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import { saveChannel, getChannelCommonData } from '@/api/apiPlatformSetting';
import channelData from '@/utils/channelData';
import { isArray } from '@/utils/validate';
import settings from '../../settings.js';
import { info, confirm } from '../../utils/ddHelper';
import ImgInclude from '@/components/CropImgInclue/index.vue';

export default {
  name: 'my',
  data() {
    return {
      baseUrl: settings.baseUrl,
      rules: {},
      funcListData: [],
      banner_pic: {
        'ratio': [],
      },
      isShowPreviewDialog: false,
      id: undefined,
      preview_url: '',
      channelData: {
        collectUserdata: 1,
        showMany: 1,
      },
      indexCropper: [
        {
          name: '首页图片',
          ratio_x: 750,
          ratio_y: 864,
          ratio: 1,
          desc: '首页图片',
        },
      ],
    };
  },
  created() {
    this.getPageSetting();
    this.loadChannelInfo()
  },
  methods: {
    getPageSetting() {
      this.banner_pic['ratio'] = [];
      this.$ajax.get('/pzcz/config/myconfig').then(res => {
        if (res.resCode == 200) {
          let data = res.resObject;
          if (res.resObject) {
            this.channelData.collectUserdata = data.collectUserdata;
            this.channelData.showMany = data.showMany;
            this.banner_pic['ratio'].push(data.indexPic);
            this.id = data.id;
          }
        }
      });
    },
    submitForm() {
      let url = '';
      if (this.id) {
        url = '/pzcz/config/update';
      } else {
        url = '/pzcz/config/create';
      }
      this.$ajax
        .post(url, {
          id: this.id,
          collectUserdata: this.channelData.collectUserdata,
          showMany: this.channelData.showMany,
          indexPic: this.banner_pic['ratio'][0],
        })
        .then(res => {
          if (res.resCode == 200) {
            this.$message.success('提交成功');
            this.getPageSetting()
            this.loadChannelInfo();
          }
        });
    },
    uploadError(err) {
      console.log(err);
    },
    preview() {
      this.isShowPreviewDialog = true;
    },
    onChangeShow(show) {
      this.isShowPreviewDialog = show;
    },
    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.cezu.channelType}`,
          {}
        )
        .then(res => {
          if (res.resObject) {
            this.preview_url = res.resObject.previewUrl;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  components: { channelMain, menuList, ImgInclude, preview },
};
</script>
<style lang="scss">
.channel_form {
  .zixun_switch {
    margin-left: 16px;
  }

  .channel-text-desc {
    font-size: 14px;
    color: #ccc;
  }

  .menu-mgmt-dialog {
    .el-dialog__body {
      padding: 20px !important;
    }

    .new_menu_btn {
      margin-bottom: 20px !important;
    }
  }

  .el-switch__label.el-switch__label--left {
    color: #606266 !important;
  }
}
</style>
