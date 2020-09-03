<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form :model="form" :rules="rules" ref="channelForm" label-width="130px" class="demo-ruleForm">
        <h4 style="color: #333">基础设定</h4>

        <el-form-item label="轮播图展示">
          <el-switch v-model="form.isBanner" :active-value="1" :inactive-value="0" :width="60"></el-switch>
          <el-switch
            v-model="form.isRead"
            :active-value="1"
            :inactive-value="0"
            class="zixun_switch"
            :width="60"
            inactive-text="阅读数展示"
          ></el-switch>
          <el-switch
            v-model="form.isLabel"
            :active-value="1"
            :inactive-value="0"
            class="zixun_switch"
            :width="60"
            inactive-text="标签展示"
          ></el-switch>
          <el-switch
            v-model="form.isComment"
            :active-value="1"
            :inactive-value="0"
            class="zixun_switch"
            :width="60"
            inactive-text="评论开关"
          ></el-switch>
        </el-form-item>

        <el-form-item label="导航展示">
          <el-switch v-model="form.isDaohang" :active-value="1" :inactive-value="0" :width="60"></el-switch>
          <el-switch
            v-model="form.isColumn"
            :active-value="1"
            :inactive-value="0"
            class="zixun_switch"
            :width="60"
            inactive-text="栏目展示"
          ></el-switch>
          <el-switch
            v-model="form.isSearch"
            :active-value="1"
            :inactive-value="0"
            class="zixun_switch"
            :width="60"
            inactive-text="搜索框"
          ></el-switch>
        </el-form-item>

        <el-form-item label="顶部标题名称" prop="topName">
          <el-col :span="12">
            <el-input placeholder="不填则默认用频道名称" v-model="form.topName"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="导航设置">
          <el-button type="primary" @click="addMenuClick">添加</el-button>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-table
            style="width: 910px"
            :data="menuListData"
            v-show="menuListData.length > 0"
            class="menu-list-table"
            border
            row-key="id"
          >
            <el-table-column label="排序" type="index" align="center" width="60"></el-table-column>
            <el-table-column width="100" label="图片">
              <template slot-scope="scope">
                <div class="icon-div">
                  <img
                    :src="menuListData[scope.$index].naviIcon"
                    alt=""
                    v-if="menuListData[scope.$index].naviIcon"
                    class="icon-img"
                  />
                  <div
                    @click="clickImage(scope.$index)"
                    :style="{
                      opacity: menuListData[scope.$index].naviIcon ? 0 : 1,
                    }"
                    class="upload-include"
                  >
                    <img-include v-model="cover_pic" :max="1" :width="55" :cropper="coverCropper"></img-include>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="590" label="链接">
              <template slot-scope="scope">
                <div class="url-row">
                  <el-select placeholder="请选择链接类型" v-model="menuListData[scope.$index].firstMenu">
                    <el-option
                      v-for="item in urlOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>

                  <el-row>
                    <el-col :span="16" :offset="2" v-if="menuListData[scope.$index].firstMenu == '1'">
                      <el-select v-model="menuListData[scope.$index].channelId" placeholder="请选择频道">
                        <el-option
                          v-for="item in channelList"
                          :key="item.id"
                          :label="item.channelName"
                          :value="item.channelType"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="16" :offset="2" v-if="menuListData[scope.$index].firstMenu == '2'">
                      <el-input v-model="menuListData[scope.$index].customUrl" placeholder="请输入链接"></el-input>
                      <el-input v-model="menuListData[scope.$index].naviName" placeholder="请输入名称"></el-input>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteMenuClick(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="缩略图位置">
          <el-col :span="12">
            <el-radio v-model="form.indexPicPos" :label="0">左</el-radio>
            <el-radio v-model="form.indexPicPos" :label="1">右</el-radio>
          </el-col>
        </el-form-item>

        <el-form-item label="文章阅读数基数">
          <el-col :span="12">
            <el-input
              placeholder="请输入文章阅读量基数数据，手机端端文章阅读是基数+真实阅读量，不填为0"
              v-model="form.reading"
            ></el-input>
          </el-col>
        </el-form-item>

        <h4 style="color: #333">专题设置</h4>

        <el-form-item label="栏目名称" prop="clumnName">
          <el-col :span="12">
            <el-input placeholder="请输入名称" v-model="form.clumnName"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="栏目副标题">
          <el-col :span="12">
            <el-input placeholder="请输入栏目副标题" v-model="form.clumnSubject"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="专题ICON" class="upload-icon" prop="zhuantiIcon">
          <img-include v-model="icon_pic" :max="1" :cropper="indexCropper"></img-include>
          <div class="upload-icon-text">
            尺寸:
            <br />
            32*32
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="preview()">预览</el-button>
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
import { info, confirm } from '../../utils/ddHelper';
import { isArray } from '@/utils/validate';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import ImgInclude from '@/components/CropImgInclue/index.vue';
import channelData from '@/utils/channelData';
import sortable from 'sortablejs';

import { informationNewsPagesettingFind, informationNewsPagesettingSave } from '@/api/information/setting';

export default {
  name: 'zixun',
  props: {
    channelData: {
      type: Object,
      default: function() {
        return {
          isBanner: '', //是否有轮播
          isRead: '', //是否显示阅读数
          isLabel: '', //是否有标签
          isComment: '',
          isDaohang: '',
          isColumn: '',
          isSearch: '',
        };
      },
    },
  },

  data() {
    return {
      rules: {
        // channel_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        // //channel_sort: [{required: true, message: '请选择频道展示位置', trigger: 'change'}],
        // channel_title_image: [{required: true, message: '请上传频道ICON', trigger: 'change'}],
        // channel_img_url: [{required: true, message: '请上传分享图片', trigger: 'change'}],
        // share_title: [{required: true, message: '请输入分享标题', trigger: 'blur'}]
        clumnName: [
          {
            required: true,
            message: '请输入栏目名称',
            trigger: 'blur',
          },
        ],
        zhuantiIcon: [
          {
            required: true,
            message: '请上传专题ICON',
            trigger: 'blur',
          },
        ],
      },
      menuListData: [],
      icon_pic: {
        ratio1: [],
      },

      indexCropper: [
        {
          name: '专题ICON',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '专题ICON',
        },
      ],

      form: {
        isBanner: false,
        isRead: false,
        isLabel: false,
        isComment: true,
        isDaohang: true,
        isColumn: true,
        isSearch: true,
        clumnName: '',
        topName: '',
        clumnSubject: '',
        zhuantiIcon: '',
        indexPicPos: 0, // 0左 1右 缩略图位置
        reading: 0,
      },

      pageSetting: {},

      isShowPreviewDialog: false,

      preview_url: '',
      row_index: null,

      cover_pic: {
        ratio1: [],
      },

      coverCropper: [
        {
          name: '导航图片',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '导航图片',
        },
      ],
      urlOptions: [
        {
          value: 1,
          label: '频道链接',
        },
        {
          value: 2,
          label: '自定义链接',
        },
      ],

      channelList: [], // 可选频道

      delIds: [], // 删除的导航
    };
  },

  created() {
    this.loadNewsPageSetting();
    this.loadChannelInfo();

    // 可选频道
    this.loadAllChannel();
  },

  mounted() {
    let el = document.querySelectorAll('.el-table__body > tbody')[0];

    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.menuListData.splice(evt.oldIndex, 1)[0];
          this.menuListData.splice(evt.newIndex, 0, currRow);

          this.menuListData.forEach((item, index) => {
            this.menuListData[index].sort = index + 1;
          });
        },
      });
    }
  },

  methods: {
    loadNewsPageSetting() {
      informationNewsPagesettingFind().then(res => {
        if (res.resCode == 200 && res.resObject) {
          this.pageSetting = res.resObject;
          this.form = {
            ...res.resObject,
          };

          this.menuListData = res.resObject.informationNavigations || [];

          this.icon_pic = {
            ratio1: [res.resObject.zhuantiIcon],
          };
        }
      });
    },

    loadAllChannel() {
      this.$ajax
        .get(`/platformsetting/channel/getAllChannelByUnitId`, {})
        .then(res => {
          if (res.resObject) {
            this.channelList = res.resObject.channelList;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.information.channelType}`,
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

      console.log(this.menuListData);

      self.$refs.channelForm.validate(valid => {
        if (valid) {
          confirm(self, '确定提交吗？', () => {
            if (this.pageSetting && this.pageSetting.id) {
              informationNewsPagesettingSave({
                ...this.form,
                id: this.pageSetting.id,
                informationNavigations: this.menuListData,
                delIds: this.delIds
              }).then(_ => {
                info(this, `提交成功`);
              });
            } else {
              informationNewsPagesettingSave({
                ...this.form,
                informationNavigations: this.menuListData,
              }).then(_ => {
                info(this, `提交成功`);
              });
            }
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
    addMenuClick() {
      if (this.menuListData.length > 0 && !this.menuListData[this.menuListData.length - 1].naviIcon) {
        this.$message.error('请先上传图片');
        return;
      }
      this.menuListData.push({
        sort: this.menuListData.length + 1,
        naviIcon: '',
        customUrl: '',
      });
    },

    clickImage(index) {
      this.row_index = index;
    },

    deleteMenuClick(index, row) {
      this.menuListData.splice(index, 1);
      this.delIds.push(row.id)
    },
  },
  components: {
    channelMain,
    menuList,
    ImgInclude,
    preview,
  },

  watch: {
    'icon_pic.ratio1'(val) {
      this.form.zhuantiIcon = val[0];
    },

    'cover_pic.ratio1'(value) {
      if (value && value[0]) {
        this.menuListData[this.row_index].naviIcon = value[0];
        this.cover_pic = { ratio1: [] };
      }
    },

    menuListData: {
      handler(newVal) {
        //特别注意，不能用箭头函数，箭头函数，this指向全局
        newVal.forEach((v, index) => {
          let channel = this.channelList.filter(item => {
            return item.channelType == v.channelId;
          });

          let naviName = channel.length != 0 ? channel[0].channelName : '';
          let channelroute = channel.length != 0 ? channel[0].channelRoute : '';

          if (v.channelId && !v.naviName != naviName) {
            // 选中的渠道名为默认菜单名
            this.menuListData[index].naviName = naviName;
            this.menuListData[index].channelroute = channelroute;
          }

          this.menuListData[index].isShow = 1;
        });
      },

      deep: true,
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

  .el-switch__label.el-switch__label--left {
    color: #606266 !important;
  }

  .upload-icon {
    position: relative;

    .upload-icon-text {
      position: absolute;
      font-size: 14px;
      color: #ccc;
      top: 46px;
      left: -60px;
      line-height: 16px;
    }
  }

  .url-row {
    display: flex;
    align-items: center;
  }

  .icon-div {
    width: 60px;
    height: 60px;
  }

  .icon-img {
    width: 60px;
    height: 60px;
  }

  .icon-add {
    font-size: 60px;
    position: absolute;
    pointer-events: none;
  }
}
</style>
