<template>
  <div>
    <el-form>
      <el-form-item label="*频道名称" prop="channelName">
        <el-col :span="12">
          <el-input v-model="channelData.channelName" placeholder="请输入名称" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="*自定义名" prop="showChannelName">
        <el-col :span="12">
          <el-input v-model="channelData.showChannelName" placeholder="请输入自定义名称" clearable></el-input>
        </el-col>
      </el-form-item>

      <!-- 频道 -->
      <el-form-item
        label="*频道ICON"
        class="upload-icon upload-icon-logo"
        ref="channel_icon_upload"
        prop="channelImgUrl"
      >
        <div class="upload-icon-text">尺寸:<br />20*20</div>
        <div>
          <img-include v-model="icon_pic" :max="1" :cropper="iconCropper"></img-include>
        </div>
        <div class="upload-icon-logo-text">选中状态<br />尺寸:<br />20*20</div>
        <div>
          <img-include v-model="uncheck_icon_pic" :max="1" :cropper="uncheckIconCropper"></img-include>
        </div>
        <div class="upload-icon-logo-text">未选中状态<br />尺寸:<br />20*20</div>
      </el-form-item>
      <!--分享标题-->
      <el-form-item label="*分享标题" prop="shareTitle">
        <el-col :span="16">
          <el-input v-model="channelData.shareTitle" placeholder="请输入标题，朋友圈分享时展示" clearable></el-input>
        </el-col>
      </el-form-item>
      <!--分享描述-->
      <el-form-item label="分享描述" prop="shareDesc">
        <el-col :span="16">
          <el-input
            type="textarea"
            maxlength="200"
            :rows="3"
            show-word-limit
            placeholder="请输入分享描述，用于朋友圈分享时描述展示"
            v-model="channelData.shareDesc"
          ></el-input>
        </el-col>
      </el-form-item>
      <!--分享图片-->
      <el-form-item label="*分享图片" class="upload-icon" ref="channel_share_img_upload" prop="shareImage">
        <img-include v-model="share_pic" :max="1" :cropper="indexCropper"></img-include>
        <div class="upload-icon-text">尺寸:<br />20*20</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import settings from '../../settings.js';
import ImgInclude from '@/components/CropImgInclue/index.vue';
import { confirm } from '../../utils/ddHelper';

export default {
  props: {
    channelData: {
      type: Object,
      default: function () {
        return {
          channelName: '',
          shareTitle: '',
          shareDesc: '',
          channel_icon_list: [],
          preview_url: '',
        };
      },
    },
  },
  data() {
    return {
      share_pic: {},
      icon_pic: {},
      uncheck_icon_pic: {},
      iconCropper: [
        {
          name: '频道Icon选中状态',
          ratio_x: 20,
          ratio_y: 20,
          ratio: 1,
          desc: '频道Icon选中状态',
        },
      ],
      uncheckIconCropper: [
        {
          name: '频道Icon未选中状态',
          ratio_x: 20,
          ratio_y: 20,
          ratio: 1,
          desc: '频道Icon未选中状态',
        },
      ],
      indexCropper: [
        {
          name: '分享图片',
          ratio_x: 20,
          ratio_y: 20,
          ratio: 1,
          desc: '分享图片',
        },
      ],
    };
  },

  watch: {
    share_pic: {
      handler(n, o) {
        this.channelData.shareImage = n['ratio1'] ? n['ratio1'].join(',') : '';
      },
      deep: true,
    },
    icon_pic: {
      handler(n, o) {
        this.channelData.channelImgUrl = n['ratio1'] ? n['ratio1'].join(',') : '';
      },
      deep: true,
    },
    uncheck_icon_pic: {
      handler(n, o) {
        this.channelData.uncheckChannelImgUrl = n['ratio1'] ? n['ratio1'].join(',') : '';
      },
      deep: true,
    },

    channelData(val) {
      if (val.channelImgUrl != this.icon_pic.ratio1[0]) {
        this.icon_pic = {
          ratio1: [val.channelImgUrl],
        };
      }
      if (val.uncheckChannelImgUrl != this.uncheck_icon_pic.ratio1[0]) {
        this.uncheck_icon_pic = {
          ratio1: [val.uncheckChannelImgUrl],
        };
      }
      if (val.shareImage != this.share_pic.ratio1[0]) {
        this.share_pic = {
          ratio1: [val.shareImage],
        };
      }
    },
  },

  methods: {
    uploadError(err, file, fileList) {
      console.log(err);
    },
  },
  created() {
    setTimeout(() => {
      if (this.channelData) {
        this.icon_pic =
          (this.channelData.channelImgUrl && {
            ratio1: this.channelData.channelImgUrl.split(','),
          }) ||
          {};
        this.share_pic =
          (this.channelData.shareImage && {
            ratio1: this.channelData.shareImage.split(','),
          }) ||
          {};
        this.uncheck_icon_pic =
          (this.channelData.uncheckChannelImgUrl && {
            ratio1: this.channelData.uncheckChannelImgUrl.split(','),
          }) ||
          {};
      }
    }, 500);
  },

  components: {
    ImgInclude,
  },
};
</script>
<style lang="scss">
.channel_form {
  @extend %fill;

  .menu-mgmt-dialog {
    .el-dialog__body {
      padding: 20px !important;
    }

    .new_menu_btn {
      margin-bottom: 20px !important;
    }
  }

  .channel-text-desc {
    font-size: 14px;
    color: #ccc;
  }

  .upload-icon {
    position: relative;
    .upload-icon-text {
      position: absolute;
      font-size: 14px;
      color: #ccc;
      top: 46px;
      left: 10px;
      line-height: 16px;
    }
  }

  .upload-icon-logo {
    .el-form-item__content {
      display: flex;
      justify-content: flex-start;

      & > div {
        width: 300px;
      }

      .upload-icon-text {
        left: -70px;
      }

      .upload-icon-logo-text {
        font-size: 14px;
        color: #ccc;
        line-height: 16px;
        width: 80px;
      }
    }
  }
}

.avatar {
  width: 150px;
  height: 150px;
}
</style>
