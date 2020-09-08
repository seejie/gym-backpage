<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form label-width="156px">
        <el-form-item label="banner裁剪尺寸设置">
          <div class="banner_radio">
            宽度*高度：
            <el-input v-model="shopBannerConfig.bannerWith" placeholder="宽度"></el-input>*
            <el-input v-model="shopBannerConfig.bannerHight" placeholder="高度"></el-input>
            <span>
              (默认尺寸：375*166)，建议尺寸(375*166，100*100，750*960), 修改尺寸后请删除原有banner，
              <br />重新上传banner，否则页面比例会不一致
            </span>
          </div>
        </el-form-item>
      </el-form>

      <el-form :model="channelData" :rules="rules" ref="channelForm" label-width="100px" class="demo-ruleForm">
        <banner
          :menu-list-data="bannerArry"
          btntitle="banner设置"
          indexCroppertitle="banner图片"
          :bannerWith="shopBannerConfig.bannerWith"
          :bannerHight="shopBannerConfig.bannerHight"
        ></banner>

        <el-form label-width="156px">
          <el-form-item label="展厅裁剪尺寸设置">
            <div class="banner_radio">
              宽度*高度：
              <el-input v-model="shopExhibitionConfig.zhantingWith" placeholder="宽度"></el-input>*
              <el-input v-model="shopExhibitionConfig.zhantingHight" placeholder="高度"></el-input>
              <span>
                (默认尺寸：375*166)，建议尺寸(375*166，100*100，750*960),修改尺寸后请删除原有展厅图片，
                <br />重新上传图片，否则页面比例会不一致
              </span>
            </div>
          </el-form-item>
        </el-form>
        <banner
          :menu-list-data="zhantingArry"
          btntitle="展厅设置"
          indexCroppertitle="展厅图片"
          :bannerWith="shopExhibitionConfig.zhantingWith"
          :bannerHight="shopExhibitionConfig.zhantingHight"
        ></banner>

        <navigation @changeNavSort="changeNavSort" :menu-list-data="navigationData" :category="category"></navigation>
        <classify
          :classifySelectData="classifyData"
          :category="category"
          @getClassify="getClassifyData"
          @changeClassifySort="changeClassifySort"
        ></classify>
        <el-form-item class="form-footer" label-width="0">
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
import channelMain from '@/components/ChannelMgmt/index';
import banner from './components/banner';
import navigation from './components/navigation';
import classify from './components/classify';
import ImgInclude from '@/components/CropImgInclue/index.vue';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import { saveChannel, saveShopChannel, getChannelCommonData } from '@/api/apiPlatformSetting';

import { shopCategoryQueryAll } from '@/api/standshop/goodsManage';

import { isArray } from '@/utils/validate';
import settings from '../../settings.js';
import { info, confirm } from '../../utils/ddHelper';
import channelData from '@/utils/channelData';

export default {
  name: 'my',
  data() {
    return {
      baseUrl: settings.baseUrl,
      rules: { },
      navigationData: [],
      classifyData: [],
      banner_list: [],

      channelData: {},
      isShowPreviewDialog: false,

      preview_url: '',

      category: [],

      bannerArry: [],

      shopBannerConfig: {
        bannerWith: '375',
        bannerHight: '166',
      },
      shopExhibitionConfig: {
        zhantingWith: '375',
        zhantingHight: '166',
      },
      zhantingArry: [],
    };
  },

  mounted() {
    this.$ajax
      .get('/shop/channel', {})
      .then(res => {
        if (res.resObject) {
          this.channelData = res.resObject;
          this.handleChannelData();
          this.shopBannerConfig.bannerWith = res.resObject.shopBannerConfig.width || 375;
          this.shopBannerConfig.bannerHight = res.resObject.shopBannerConfig.high || 166;
          this.shopExhibitionConfig.bannerWith = res.resObject.shopExhibitionConfig.width || 375;
          this.shopExhibitionConfig.bannerHight = res.resObject.shopExhibitionConfig.high || 166;
        }
      })
      .catch(err => {
        console.log(err);
      });

    this.getClassifyList();
    this.loadChannelInfo();
  },

  methods: {
    getClassifyData(val) {
      this.classifyData = val;
    },

    changeClassifySort(val) {
      this.classifyData = val;
    },

    changeNavSort(val) {
      this.menuListData = val;
    },

    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.shop.channelType}`,
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

    handleChannelData() {
      if (this.channelData) {
        if (this.channelData.ext) {
          let extData = JSON.parse(this.channelData.ext);
          if (extData && isArray(extData.navigationData)) {
            this.navigationData = extData.navigationData;
          }
          if (extData && isArray(extData.classify)) {
            this.classifyData = extData.classify;
          }
        }

        if (this.channelData.category) {
          this.classifyData = this.channelData.category;
        }

        if (this.channelData.banner && this.channelData.banner.length) {
          this.bannerArry = this.channelData.banner.map(v => {
            return {
              cover_pic: {
                ratio1: [v.bannerPic],
              },
              bannerType: v.bannerType,
              productId: v.productId,
              productName: v.productName,
              id: v.id,
              configId: v.configId,
              thirdUrl: v.thirdUrl,
            };
          });
        }

        if (this.channelData.exhibition && this.channelData.exhibition.length) {
          this.zhantingArry = this.channelData.exhibition.map(v => {
            return {
              cover_pic: {
                ratio1: [v.exhibitionPic],
              },
              bannerType: v.exhibitionType,
              productId: v.productId,
              productName: v.productName,
              id: v.id,
              configId: v.configId,
              thirdUrl: v.thirdUrl,
            };
          });
        }

        if (this.channelData.navigation && this.channelData.navigation.length != 0) {
          const firstMenuMap = {
            1: 'func_url',
            2: 'custom_link',
          };
          const secondMenumap = {
            1: 'classify',
            3: 'shop_cart',
            4: 'all_goods',
            5: 'my_orders',
            2: 'coupon',
          };
          this.navigationData = this.channelData.navigation.map(item => {
            return {
              image: item.naviIcon,
              first_menu: firstMenuMap[item.firstMenu],
              second_menu: secondMenumap[item.secondMenu],
              third_menu: item.thirdMenu,
              custom_url: item.customUrl,
              name: item.name || '',
            };
          });
        }
      }
    },

    submitForm() {
      let self = this;

      self.$refs.channelForm.validate(valid => {
        if (valid) {
          const firstMenuMap = {
            func_url: 1,
            custom_link: 2,
          };
          const secondMenumap = {
            classify: {
              value: 1,
            },
            shop_cart: {
              value: 3,
              label: '购物车',
            },
            all_goods: {
              value: 4,
              label: '所有商品',
            },
            my_orders: {
              value: 5,
              label: '我的订单',
            },
            coupon: {
              value: 2,
              label: '优惠券',
            },
          };

          if (!this.bannerArry.length) {
            this.$message.warning('请先添加banner图片');
            return;
          }

          if (this.bannerArry.length) {
            for (let ba of this.bannerArry) {
              if (!ba.cover_pic[Object.keys(ba.cover_pic)[0]].length) {
                this.$message.warning('请上传banner图片');
                return;
              }

              if (!ba.bannerType) {
                this.$message.warning('请选择链接类型');
                return;
              }

              if (!ba.thirdUrl && !ba.productId) {
                this.$message.warning('请填写链接');
                return;
              }
            }
          }

          if (!this.zhantingArry.length) {
            this.$message.warning('请先添加展厅图片');
            return;
          }

          if (this.zhantingArry.length) {
            for (let ba of this.zhantingArry) {
              if (!ba.cover_pic[[Object.keys(ba.cover_pic)[0]]].length) {
                this.$message.warning('请上传展厅图片');
                return;
              }

              if (!ba.bannerType) {
                this.$message.warning('请选择链接类型');
                return;
              }

              if (!ba.thirdUrl && !ba.productId) {
                this.$message.warning('请填写链接');
                return;
              }
            }
          }

          let navigation = self.navigationData.map((func, index) => {
            let name = '';

            if (func.first_menu == 'func_url') {
              if (func.second_menu == 'classify') {
                name = this.category.filter(item => {
                  return item.catId == func.third_menu;
                })[0].catName;
              } else {
                name = secondMenumap[func.second_menu].label;
              }
            } else if (func.first_menu == 'custom_link') {
              name = func.name;
            }

            let obj = {
              name,
              sort: parseInt(index + 1),
              naviIcon: func.image,
              firstMenu: firstMenuMap[func.first_menu],
              thirdMenu: func.third_menu || 0,
              customUrl: func.custom_url,
              isShow: 0,
            };

            if (func.second_menu && secondMenumap[func.second_menu].value) {
              obj.secondMenu = func.second_menu && secondMenumap[func.second_menu].value;
            }

            return obj;
          });

          let tip = '';
          self.navigationData.map((func, index) => {
            if (!firstMenuMap[func.first_menu]) {
              tip = '请设置导航链接';
            } else if (firstMenuMap[func.first_menu] == 2 && !func.name) {
              tip = '请设置自定义名称';
            } else if (firstMenuMap[func.first_menu] == 2 && !func.custom_url) {
              tip = '请设置自定义链接';
            }
          });

          if (tip) {
            this.$message.error(tip);
            return;
          }

          let category = self.classifyData.map((func, index) => {
            return {
              catId: func.catId,
              catSort: parseInt(index + 1),
            };
          });
          let banner = this.bannerArry.map(v => {
            return {
              bannerPic: v.cover_pic[[Object.keys(v.cover_pic)[0]]][0],
              bannerType: v.bannerType,
              configId: v.bannerType == 1 ? v.configId : '',
              id: v.id,
              productId: v.bannerType == 1 ? v.productId : '',
              productName: v.bannerType == 1 ? v.productName : '',
              thirdUrl: v.bannerType == 2 ? v.thirdUrl : '',
            };
          });

          let exhibition = this.zhantingArry.map(v => {
            return {
              exhibitionPic: v.cover_pic[[Object.keys(v.cover_pic)[0]]][0],
              exhibitionType: v.bannerType,
              configId: v.bannerType == 1 ? v.configId : '',
              id: v.id,
              productId: v.bannerType == 1 ? v.productId : '',
              productName: v.bannerType == 1 ? v.productName : '',
              thirdUrl: v.bannerType == 2 ? v.thirdUrl : '',
            };
          });
          confirm(self, '确定提交吗？', () => {
            saveShopChannel({
              exhibition,
              banner,
              shopBannerConfig: {
                width: parseInt(this.shopBannerConfig.bannerWith),
                high: parseInt(this.shopBannerConfig.bannerHight),
              },
              shopExhibitionConfig: {
                width: parseInt(this.shopExhibitionConfig.zhantingWith),
                high: parseInt(this.shopExhibitionConfig.zhantingHight),
              },
              navigation,
              category,
            }).then(_ => {
              info(this, `电商频道修改成功`);
            });
          });
        } else {
          return false;
        }
      });
    },
    uploadError(err) {
      console.log(err);
    },
    preview() {
      // this.$refs.preview.isShowPreviewDialog = true;
      this.isShowPreviewDialog = true;
    },

    onChangeShow(show) {
      this.isShowPreviewDialog = show;
    },

    //获取所有品类数据
    async getClassifyList(params) {
      this.productCategoryIdOptios = [];

      shopCategoryQueryAll({
        catParentId: 0,
      }).then(res => {
        if (res.resCode == 200) {
          this.category = res.resObject;
        }
      });
    },
  },

  components: {
    channelMain,
    navigation,
    banner,
    classify,
    ImgInclude,
    preview,
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

  .upload-icon {
    position: relative;

    .el-form-item__content {
      // height: 150px;
    }

    .upload-icon-text {
      position: absolute;
      font-size: 14px;
      color: #ccc;
      top: 46px;
      left: -60px;
      line-height: 16px;
    }
  }

  .tips {
    font-size: 14px;
  }

  .banner_radio {
    display: flex;
    color: $font_6;
    align-items: center;

    .el-input {
      width: 100px;
      margin: 0 10px;
    }
    input {
      width: 100px;
    }
    span {
      line-height: 1.4;
      font-size: 13px;
      margin-left: 20px;
    }
  }
}
.demo-ruleForm .el-image__inner,
.el-image__placeholder,
.el-image__error {
  width: auto;
}
.form-footer {
  padding: 35px 0px;
  .el-form-item__content {
    text-align: center;
  }
}
</style>
