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
        <el-form-item label="显示模式" prop="card_model">
          <el-radio-group v-model="showModel">
            <el-radio :label="1">列表</el-radio>
            <el-radio :label="2">棋盘</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="*封面图片">
          <img-include v-model="cover_bannerPic" :max="1" :cropper="bannerCropper"></img-include>
          <div class="bannerPic-desc">*图片格式：favicon ,大小建议 375*162.5 像素</div>
        </el-form-item>
        <el-form-item label="功能设置" class="color-item-title"></el-form-item>
        <el-form-item label-width="20px">
          <div class="tips">提示：请在同一分组内拖动排序</div>
          <el-table
            :data="funcListData"
            v-show="funcListData.length > 0"
            class="func-list-table"
            border
            style="width: 1250px;"
            row-key="id"
          >
            <el-table-column property="functionName" label="功能" align="center" width="100"></el-table-column>
            <el-table-column label="前台展示名称" width="150" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.showName" class="disabled-group" maxlength="20"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="前台展示备用名称1" width="170" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.showSecondName" class="disabled-group" maxlength="20"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="前台展示备用名称2" width="170" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.showThirdName" class="disabled-group" maxlength="20"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="LOGO" width="110" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.showLogo" v-if="scope.row.showLogo" class="icon-img" />
                <div @click="clickImage(scope.$index)" class="upload-include">
                  <img-include v-model="cover_pic" :max="1" :width="55" :cropper="indexCropper"></img-include>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="分组" width="100" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.showGroup"
                  class="disabled-group"
                  type="number"
                  maxlength="2"
                  max="20"
                  min="0"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="排序" width="100" align="center" prop="functionSort">
              <template slot-scope="scope">
                <el-input v-model="scope.row.showSort" class="disabled-group"></el-input>
              </template> -->
            </el-table-column>

            <el-table-column label="公众号展示" width="120" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.gzhShow"
                  :width="60"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="小程序展示" width="120" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.miniShow"
                  :width="60"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
          <div class="channel-text-desc">备注：灰色的分组为默认显示，不可自定义哦；默认组 图片尺寸建议30*30PX，其余图片尺寸建议25*25</div>
        </el-form-item>
        <div style="width: 100%;height: 1px;background-color: #c9c9c9;margin:30px 0"></div>
        <el-form-item label="技术支持logo">
          <img-include v-model="cover_bannerPic" :max="1" :cropper="bannerCropper"></img-include>
          <div class="bannerPic-desc">*图片格式：PNG ,JPG 等常用格式 ,大小建议 25*25 像素，请上传5M以内的图片</div>
        </el-form-item>
        <el-form-item label="技术支持">
          <myEditor refs="name1" v-model="jishuzhichi"></myEditor>
        </el-form-item>
        <div style="width: 100%;height: 1px;background-color: #c9c9c9;margin:30px 0"></div>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
        <div class="tips">提交后，请在展示设置模块控制是否展示</div>
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
import { modifyPersionSetting, getChannelCommonData } from '@/api/apiPlatformSetting';
import { isArray } from '@/utils/validate';
import settings from '../../settings.js';
import sortable from 'sortablejs';
import { info, confirm } from '../../utils/ddHelper';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import ImgInclude from '@/components/CropImgInclue/index.vue';
import channelData from '@/utils/channelData';
export default {
  name: 'my',
  props: {
    channelData: {
      type: Object,
      default() {
        return {
          banner_list: [],
        };
      },
    },
  },

  data() {
    return {
      jishuzhichi: '',
      baseUrl: settings.baseUrl,
      rules: {},
      funcListData: [],

      showModel: '',

      preview_url: '',
      isShowPreviewDialog: false,
      cover_bannerPic: {
        ratio1: [],
      },
      cover_pic: {
        ratio1: [],
      },
      bannerCropper: [
        {
          name: '封面图片',
          ratio_x: 2.3,
          ratio_y: 1,
          ratio: 1,
          desc: '封面图片',
        },
      ],
      indexCropper: [
        {
          name: '专题ICON',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '专题ICON',
        },
      ],

      row_index: null,
    };
  },

  created() {
    this.loadData();
    this.loadChannelInfo();
  },
  mounted() {
    let el = document.querySelectorAll('.func-list-table > .el-table__body-wrapper > table > tbody')[0];
    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.funcListData.splice(evt.oldIndex, 1)[0];
          this.funcListData.splice(evt.newIndex, 0, currRow);

          let list = {};

          this.funcListData.forEach((item, index) => {
            list[item.showGroup] = [];
          });

          this.funcListData.forEach((item, index) => {
            // this.funcListData[index].showSort = index + 1;
            list[item.showGroup].push({
              ...item,
              parentIndex: index,
            });
          });

          Object.keys(list).map(key => {
            list[key].forEach((item, index) => {
              this.funcListData[item.parentIndex].showSort = index + 1;
            });
          });

          console.log(list);
        },
      });
    }
  },

  methods: {
    loadData() {
      this.cover_bannerPic.ratio1 = [];
      this.$ajax
        .get('/platformsetting/personalcenter/queryPersionSetting', {})
        .then(res => {
          if (res.resObject) {
            this.funcListData = res.resObject.funcList || [];
            this.showModel = res.resObject.showModel;
            this.cover_bannerPic.ratio1.push(res.resObject.coverLogo);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.mine.channelType}`,
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

    submitForm() {
      let self = this;
      self.$refs.channelForm.validate(valid => {
        if (valid) {
          confirm(self, '确定提交吗？', () => {
            modifyPersionSetting({
              coverLogo: self.cover_bannerPic.ratio1[0],
              showModel: self.showModel,
              funcList: self.funcListData,
            }).then(_ => {
              info(this, `提交成功`);
              this.loadData();
            });
          });
        } else {
          return false;
        }
      });
    },

    preview() {
      this.isShowPreviewDialog = true;
    },

    onChangeShow(show) {
      this.isShowPreviewDialog = show;
    },

    clickImage(index) {
      this.row_index = index;
    },
  },
  components: {
    preview,
    ImgInclude,
  },

  watch: {
    'cover_pic.ratio1'(value) {
      if (value && value[0]) {
        this.funcListData[this.row_index].functionLogo = value[0];
        this.cover_pic = { ratio1: [] };
      }
    },
  },
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

.upload-include {
  opacity: 0;
  position: absolute;
  left: 30px;
  top: 0;
}

.icon-img {
  width: 30px;
  height: 30px;
}

.tips {
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
