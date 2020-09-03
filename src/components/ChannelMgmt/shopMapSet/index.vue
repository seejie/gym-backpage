<template>
  <div class="shop-map-set_form">
    <el-card class="box-card">
      <h4 style="color: #333">基础设定</h4>
      <el-form
        :model="setsData"
        :rules="rules"
        ref="setsForm"
        label-width="160px"
        class="demo-ruleForm"
      >
        <el-row type="flex">
          <el-col :span="10">
            <el-form-item label="地图列表模式">
              <el-radio-group v-model="setsData.listMapMode">
                <el-radio :label="2">同时展出</el-radio>
                <el-radio :label="1">列表模式</el-radio>
                <el-radio :label="0">地图模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="setsData.listMapMode == 2" label="优先展出">
              <el-radio-group v-model="setsData.showFirstListMap">
                <el-radio :label="0">地图模式</el-radio>
                <el-radio :label="1">列表模式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            :span="8"
            :style="{
           'margin-top': setsData.listMapMode == 2? '30px': 0
          }
          "
          >
            <span class="remark">备注：同时展示的情况下优先展示才会出现</span>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="10">
            <el-form-item label="店铺和大师模式">
              <el-radio-group v-model="setsData.storeOrMasterMode">
                <el-radio :label="2">同时展出</el-radio>
                <el-radio :label="1">店铺模式</el-radio>
                <el-radio :label="0">大师模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="setsData.storeOrMasterMode == 2" label="优先展出">
              <el-radio-group v-model="setsData.showFirstStoreMaster">
                <el-radio :label="1">店铺</el-radio>
                <el-radio :label="0">大师</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col
            :span="8"
            :style="{
           'margin-top': setsData.storeOrMasterMode == 0? '30px': 0
          }
          "
          >
            <span class="remark">备注：同时展示的情况下优先展示才会出现</span>
          </el-col>
        </el-row>

        <el-row class="input-group">
          <el-col :span="12">
            <el-form-item label="场馆tab名称" prop="storeTabName">
              <el-input v-model="setsData.storeTabName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大师tab场馆名称" prop="masterTabName">
              <el-input v-model="setsData.masterTabName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="border-bottom: 1px solid #cccccc; margin-bottom: 30px"></div>

        <el-form-item label="委托售卖功能">
          <el-switch :active-value="1" :inactive-value="0" v-model="setsData.isOpenEntrustSell"></el-switch>
          <span class="remark">备注：开启后，店铺可接受普通用户委托售卖商品</span>
        </el-form-item>

        <el-form-item label="店铺认领线上收费">
          <el-switch :active-value="1" :inactive-value="0" v-model="setsData.claimOnline"></el-switch>
        </el-form-item>
        <el-form-item label="列表banner">
          <el-switch :active-value="1" :inactive-value="0" v-model="setsData.showBanner"></el-switch>
        </el-form-item>

        <!-- <hr> -->

        <el-form-item label="banner裁剪尺寸设置">
          <div class="banner_radio">
            宽度*高度：
            <el-input v-model="setsData.bannerWidth" placeholder="宽度"></el-input>*
            <el-input v-model="setsData.bannerHight" placeholder="高度"></el-input>
            <span>
              (默认尺寸：375*166)，修改尺寸后请删除原有banner，
              <br />重新上传banner，否则页面比例会不一致
            </span>
          </div>
        </el-form-item>
        <!-- </el-form>
      <el-form
        :model="channelData"
        :rules="rules"
        ref="channelForm"
        label-width="100px"
        class="demo-ruleForm"
        >-->
        <banner
          :has-type="false"
          :menu-list-data="setsData.bannerArry"
          :bannerWith="setsData.bannerWidth"
          :bannerHight="setsData.bannerHight"
        ></banner>
        <el-form-item label="地图标记" class="upload-icon map-upload-icon" prop="marker">
          <el-radio-group v-model="setsData.marker">
            <div class="map-location-block">
              <img
                src="../../../assets/platform/map-icon.png"
                width="46"
                height="66"
                class="map-default-icon"
              />
              <el-radio label="default" class="map-default-radio">默认</el-radio>
            </div>
            <div class="map-location-block">
              <!-- <el-form-item label="封面图片"> -->
              <img-include v-model="markerCutImgs" :max="1" :cropper="markerCropper"></img-include>
              <el-radio :label="setsData.mapMarkerImgs" class="map-radio-custom">自定义</el-radio>
            </div>
          </el-radio-group>
          <div class="upload-icon-text">
            尺寸:
            <br />20*20
          </div>
        </el-form-item>
        <el-form-item label="卡片模式" prop="cardStyle">
          <el-radio-group v-model="setsData.cardStyle">
            <div class="map-location-block">
              <img
                src="../../../assets/platform/card_1.png"
                width="120"
                height="80"
                class="map-default-icon"
              />
              <el-radio :label="1" class="map-default-radio">默认卡片</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <img
                src="../../../assets/platform/card_2.png"
                width="120"
                height="80"
                class="map-default-icon"
              />
              <el-radio :label="2" class="map-radio-custom">艺术行业卡片</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="*商品发布样式" prop="addGoodsStyle">
          <el-radio-group v-model="setsData.addGoodsStyle">
            <div class="map-location-block">
              <el-radio :label="1" class="map-default-radio">默认风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="2" class="map-radio-custom">艺术风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="3" class="map-radio-custom">约课样式</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="4" class="map-radio-custom">二手电商模式</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="*店铺&大师创建样式" prop="storeormasterApplyStyle">
          <el-radio-group v-model="setsData.storeormasterApplyStyle">
            <div class="map-location-block">
              <el-radio :label="1" class="map-default-radio">默认风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="2" class="map-radio-custom">艺术风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="3" class="map-radio-custom">约课样式</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="4" class="map-radio-custom">二手电商模式</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="*场馆列表页样式" prop="storeListStyle">
          <el-radio-group v-model="setsData.storeListStyle">
            <div class="map-location-block">
              <el-radio :label="1" class="map-default-radio">默认风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="2" class="map-radio-custom">艺术风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="3" class="map-radio-custom">约课样式</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="4" class="map-radio-custom">样式4</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="*大师列表页样式" prop="masterListStyle">
          <el-radio-group v-model="setsData.masterListStyle">
            <div class="map-location-block">
              <el-radio :label="1" class="map-default-radio">默认风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="2" class="map-radio-custom">艺术风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="3" class="map-radio-custom">约课样式</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="4" class="map-radio-custom">样式4</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="*场馆详情页样式" prop="storeDetailStyle">
          <el-radio-group v-model="setsData.storeDetailStyle">
            <div class="map-location-block">
              <el-radio :label="1" class="map-default-radio">默认风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="2" class="map-radio-custom">艺术风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="3" class="map-radio-custom">约课风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="4" class="map-radio-custom">样式4</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="大师详情页样式" prop="masterDetailStyle">
          <el-radio-group v-model="setsData.masterDetailStyle">
            <div class="map-location-block">
              <el-radio :label="1" class="map-default-radio">默认风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="2" class="map-radio-custom">艺术风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="3" class="map-radio-custom">约课风格</el-radio>
            </div>
            <div class="map-location-block card-model-block">
              <el-radio :label="4" class="map-radio-custom">样式4</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- masterDetailStyle: null
        masterListStyle: null-->
        <!-- storeDetailStyle: null
        storeListStyle: null-->
        <el-form-item label="默认地图位置">
          <!-- <el-col :span="8"> -->
          <area-select
            :level="1"
            type="all"
            placeholder="请选择地区"
            v-model="setsData.areas"
            :data="pcaa"
          ></area-select>
          <!-- </el-col> -->
        </el-form-item>

        <div class="shop-setting">
          <div class="edit-tip">店铺网点详情权限开关，拖动可排序</div>
          <div class="list">
            <div class="list-header">
              <span class="header-item fun">功能</span>
              <span class="header-item name">前台展示名称</span>
              <span class="header-item h5-show">H5展示</span>
              <span class="header-item mini-show">小程序展示</span>
            </div>
            <div class="list-body">
              <draggable
                class="list_group"
                :list="storeConfig"
                ghost-class="ghost"
                @update="handleStoreSortUpdate(storeConfig)"
              >
                <div v-for="(item, index) in storeConfig" :key="index" class="list-item">
                  <span class="fun">{{ item.tabName }}</span>
                  <span class="name">
                    <el-input v-model="storeConfig[index].showName"></el-input>
                  </span>
                  <span class="h5-show">
                    <!-- {{item.gzhShow}} -->
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="storeConfig[index].gzhShow"
                    ></el-switch>
                  </span>
                  <span class="mini-show">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="storeConfig[index].miniShow"
                    ></el-switch>
                  </span>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <div class="master-setting">
          <div class="edit-tip">大师详情权限开关，拖动可排序</div>
          <div class="list">
            <div class="list-header">
              <span class="header-item fun">功能</span>
              <span class="header-item name">前台展示名称</span>
              <span class="header-item h5-show">H5展示</span>
              <span class="header-item mini-show">小程序展示</span>
            </div>
            <div class="list-body">
              <draggable
                class="list_group"
                :list="masterConfig"
                ghost-class="ghost"
                @update="handleStoreSortUpdate(masterConfig)"
              >
                <div v-for="(item, index) in masterConfig" :key="index" class="list-item">
                  <span class="fun">{{ item.tabName }}</span>
                  <span class="name">
                    <el-input v-model="masterConfig[index].showName"></el-input>
                  </span>
                  <span class="h5-show">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="masterConfig[index].gzhShow"
                    ></el-switch>
                  </span>
                  <span class="mini-show">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="masterConfig[index].miniShow"
                    ></el-switch>
                  </span>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <div class="shop-setting">
          <div class="edit-tip">个人中心店铺管理权限开关，拖动可排序</div>
          <div class="list">
            <div class="list-header">
              <span class="header-item fun">功能</span>
              <span class="header-item name">前台展示名称</span>
              <span class="header-item h5-show">H5展示</span>
              <span class="header-item mini-show">小程序展示</span>
            </div>
            <div class="list-body">
              <draggable
                class="list_group"
                :list="mystoreConfig"
                ghost-class="ghost"
                @update="handleStoreSortUpdate(mystoreConfig)"
              >
                <div v-for="(item, index) in mystoreConfig" :key="index" class="list-item">
                  <span class="fun">{{ item.tabName }}</span>
                  <span class="name">
                    <el-input v-model="mystoreConfig[index].showName"></el-input>
                  </span>
                  <span class="h5-show">
                    <!-- {{item.gzhShow}} -->
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="mystoreConfig[index].gzhShow"
                    ></el-switch>
                  </span>
                  <span class="mini-show">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="mystoreConfig[index].miniShow"
                    ></el-switch>
                  </span>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <div class="master-setting">
          <div class="edit-tip">个人中心大师管理权限开关，拖动可排序</div>
          <div class="list">
            <div class="list-header">
              <span class="header-item fun">功能</span>
              <span class="header-item name">前台展示名称</span>
              <span class="header-item h5-show">H5展示</span>
              <span class="header-item mini-show">小程序展示</span>
            </div>
            <div class="list-body">
              <draggable
                class="list_group"
                :list="mymasterConfig"
                ghost-class="ghost"
                @update="handleStoreSortUpdate(mymasterConfig)"
              >
                <div v-for="(item, index) in mymasterConfig" :key="index" class="list-item">
                  <span class="fun">{{ item.tabName }}</span>
                  <span class="name">
                    <el-input v-model="mymasterConfig[index].showName"></el-input>
                  </span>
                  <span class="h5-show">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="mymasterConfig[index].gzhShow"
                    ></el-switch>
                  </span>
                  <span class="mini-show">
                    <el-switch
                      :active-value="1"
                      :inactive-value="0"
                      v-model="mymasterConfig[index].miniShow"
                    ></el-switch>
                  </span>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" @click="bindClickSubmit()">提交</el-button>
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
import draggable from 'vuedraggable';
import banner from '../components/banner';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import ImgInclude from '@/components/CropImgInclue';

import { isArray } from '@/utils/validate';
import settings from '@/settings.js';
import sortable from 'sortablejs';
import { info, confirm } from '@/utils/ddHelper';
import channelData from '@/utils/channelData';
import { pcaa } from 'area-data';
import request from '@/utils/request';

export default {
  name: 'shopMapSet',
  components: {
    draggable,
    banner,
    preview,
    ImgInclude,
  },
  props: {
    itemName: {
      type: String,
      default: 'shopmap',
    },
  },
  watch: {
    markerCutImgs: {
      handler(val) {
        this.setsData.marker = val.ratio1[0];
        this.setsData.mapMarkerImgs = val.ratio1[0];
      },
      deep: true,
    },
  },
  data() {
    return {
      baseUrl: settings.baseUrl,
      isShowPreviewDialog: false,
      qiNiuData: {},
      qiNiuYunUrl: '', // 上传图片后的 htpp前缀
      qiNiuRequestUrl: 'http://upload.qiniup.com/',
      preview_url: '',
      rules: {
        // marker: [{ required: true, message: '请选择地图标记', trigger: 'blur' }],
        // cardStyle: [{ required: true, message: '请选择卡片样式', trigger: 'blur' }],
        // storeTabName: [{ required: true, message: '请输入', trigger: 'blur' }],
        // masterTabName: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      markerCropper: [
        {
          name: 'marker',
          ratio_x: 20,
          ratio_y: 20,
          ratio: 1,
          desc: 'marker',
        },
      ],
      markerCutImgs: {
        ratio1: [],
      },
      masterConfig: [],
      storeConfig: [],
      mymasterConfig: [],
      mystoreConfig: [],
      setsData: {
        bannerArry: [],
        listMapMode: 2, // 是否开启列表+地图模式：0 - 不开启；1 - 开启
        showFirstListMap: 0,
        storeOrMasterMode: 2,
        showFirstStoreMaster: 0,
        claimOffline: 0, // 线下领取收费：0 - 未启用；1 - 启用
        showBanner: 0, // 是否显示Banner：0 - 不显示；1 - 显示
        isOpenEntrustSell: 0, // 是否显示委托售卖：0 - 不显示；1 - 显示
        storeTabName: '',
        masterTabName: '',
        map_sign_url_list: [],
        bannerWidth: 375,
        bannerHight: 166,
        marker: 'default', // 地图标记
        cardStyle: 1, // 卡片样式
        areas: [], // 位置集合
        mapMarkerImgs: '', // 地图标示图标
        addGoodsStyle: 1, //商品发布样式
        masterListStyle: 1,
        storeListStyle: 1,
        masterDetailStyle: 1,
        storeDetailStyle: 1,
        storeormasterApplyStyle: 1,
      }, // 设置对象变量
      pcaa,
    };
  },

  mounted() {
    this.getSetsData();
    this.loadChannelInfo();
    this.getQiNiuYunUrl();
    this.getQiniuyunToken();
  },

  methods: {
    handleStoreSortUpdate(config) {
      config = config.map((item, index) => {
        return {
          ...item,
          tabSort: index + 1,
        };
      });
    },
    // newzong begin
    handlerCustomUploadSuccess(response) {
      this.getQiniuyunToken();
      if (response && response.key) {
        this.setsData.mapMarkerImgs = this.qiNiuYunUrl + '' + response.key;
        this.setsData.marker = this.setsData.mapMarkerImgs;
      }
    },
    getQiNiuYunUrl() {
      this.$ajax
        .get('/sys/sys_setting/queryQiniuyun')
        .then(res => {
          this.qiNiuYunUrl = res.resObject.qiniuyunUrl + '/';
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlerRemoveCustomImgUpload(file) {
      this.setsData.mapMarkerImgs = '';
    },
    uploadError(error) {
      console.log(error);
    },
    //获取七牛云token
    getQiniuyunToken(file) {
      this.loading = true;
      console.log('获取七牛云token1');
      this.$ajax
        .get('/common/getQiniuyunToken')
        .then(res => {
          const key = res.resObject.secretKey;
          this.qiNiuData = {
            token: res.resObject.token,
            key: key + new Date().getTime(),
          };
        })
        .catch(err => console.log(err));
    },
    getSetsData() {
      // 277
      this.$ajax
        .get(`/storemanager/map-setting/get?channelType=${channelData[this.itemName].channelType}`)
        .then(res => {
          if (res.resObject && res.resCode === 200) {
            let datas = {
              listMapMode: res.resObject.listMapMode || 0,
              claimOnline: res.resObject.claimOnline || 0,
              showBanner: res.resObject.showBanner || 0,
              isOpenEntrustSell: res.resObject.isOpenEntrustSell || 0,
              showFirstListMap: res.resObject.showFirstListMap || 0,
              storeOrMasterMode: res.resObject.storeOrMasterMode || 0,
              showFirstStoreMaster: res.resObject.showFirstStoreMaster || 0,
              storeTabName: res.resObject.storeTabName,
              masterTabName: res.resObject.masterTabName,
              bannerHight: res.resObject.bannerHight || this.setsData.bannerHight,
              bannerWidth: res.resObject.bannerWidth || this.setsData.bannerWidth,
              marker: res.resObject.marker || 'default',
              cardStyle: res.resObject.cardStyle || 1,

              masterListStyle: res.resObject.masterListStyle || 1,
              storeListStyle: res.resObject.storeListStyle || 1,
              masterDetailStyle: res.resObject.masterDetailStyle || 1,
              storeDetailStyle: res.resObject.storeDetailStyle || 1,
              storeormasterApplyStyle: res.resObject.storeormasterApplyStyle || 1,
              addGoodsStyle: res.resObject.addGoodsStyle || 1,
            };
            this.masterConfig = res.resObject.masterConfig;
            this.storeConfig = res.resObject.storeConfig;

            this.mymasterConfig = res.resObject.mymasterConfig;
            this.mystoreConfig = res.resObject.mystoreConfig;
            if (res.resObject.marker != 'default') {
              this.markerCutImgs = {
                ratio1: [res.resObject.marker],
              };
              datas.mapMarkerImgs = res.resObject.marker;
            }
            let areas = [];
            if (res.resObject.provinceId && res.resObject.provinceName) {
              datas.provinceId = res.resObject.provinceId;
              datas.provinceName = res.resObject.provinceName;
              areas[0] = pcaa[86][res.resObject.provinceId];
            }
            if (res.resObject.cityId && res.resObject.cityName) {
              datas.cityId = res.resObject.cityId;
              datas.cityName = res.resObject.cityName;
              if (pcaa[res.resObject.provinceId]) {
                areas[1] = pcaa[res.resObject.provinceId][res.resObject.cityId];
              }
            }
            if (res.resObject.areaId && res.resObject.areaName) {
              datas.areaId = res.resObject.areaId;
              datas.areaName = res.resObject.areaName;
              if (pcaa[res.resObject.provinceId] && pcaa[res.resObject.provinceId][res.resObject.cityId]) {
                areas[2] = pcaa[res.resObject.provinceId][res.resObject.cityId][res.resObject.areaId];
              }
            }
            let bannerArry = [];
            if (res.resObject.bannerList && res.resObject.bannerList.length) {
              bannerArry = res.resObject.bannerList.map(item => {
                return {
                  ...item,
                  // banner: item.picUrl,
                  thirdUrl: item.url,
                  cover_pic: {
                    ratio1: [item.picUrl],
                  },
                };
              });
              datas.bannerArry = bannerArry;
            }
            datas.areas = areas;
            this.setsData = Object.assign(this.setsData, datas, {});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    bindClickSubmit() {
      const vm = this;
      this.$refs.setsForm.validate(valid => {
        if (valid) {
          let params = {
            channelType: channelData[this.itemName].channelType,
            listMapMode: this.setsData.listMapMode,
            showFirstListMap: this.setsData.showFirstListMap || 0,
            storeOrMasterMode: this.setsData.storeOrMasterMode || 0,
            showFirstStoreMaster: this.setsData.showFirstStoreMaster || 0,
            claimOnline: this.setsData.claimOnline,
            showBanner: this.setsData.showBanner,
            bannerWidth: this.setsData.bannerWidth,
            bannerHight: this.setsData.bannerHight,
            storeTabName: this.setsData.storeTabName,
            isOpenEntrustSell: this.setsData.isOpenEntrustSell,
            masterTabName: this.setsData.masterTabName,
            marker: this.setsData.marker,
            cardStyle: this.setsData.cardStyle,
            masterListStyle: this.setsData.masterListStyle,
            storeListStyle: this.setsData.storeListStyle,
            masterDetailStyle: this.setsData.masterDetailStyle,
            storeDetailStyle: this.setsData.storeDetailStyle,
            storeormasterApplyStyle: this.setsData.storeormasterApplyStyle,
            addGoodsStyle: this.setsData.addGoodsStyle,
          };
          if (this.setsData.areas && this.setsData.areas.length > 1) {
            this.setsData.areas.forEach((area, index) => {
              if (typeof area != 'string') {
                let code = Object.keys(area)[0];
                let name = area[code];
                if (index == 0) {
                  params.provinceId = code;
                  params.provinceName = name;
                } else if (index == 1) {
                  params.cityId = code;
                  params.cityName = name;
                } else {
                  params.areaId = code;
                  params.areaName = name;
                }
              } else {
                if (index == 0) {
                  params.provinceId = this.setsData.provinceId;
                  params.provinceName = this.setsData.provinceName;
                } else if (index == 1) {
                  params.cityId = this.setsData.cityId;
                  params.cityName = this.setsData.cityName;
                } else {
                  params.areaId = this.setsData.areaId;
                  params.areaName = this.setsData.areaName;
                }
              }
            });
          }
          if (this.setsData.bannerArry && this.setsData.bannerArry.length) {
            let bannerArry = this.setsData.bannerArry.map(item => {
              let url = '';
              if (item && item.cover_pic && item.cover_pic.ratio1[0]) {
                url = item.cover_pic.ratio1[0];
              }
              if (url) {
                return {
                  url: item.thirdUrl,
                  picUrl: url,
                };
              }
            });
            console.log('banner');
            console.log(bannerArry);
            params.bannerList = bannerArry;
          }
          params.masterConfig = this.masterConfig;
          params.storeConfig = this.storeConfig;
          params.mymasterConfig = this.mymasterConfig;
          params.mystoreConfig = this.mystoreConfig;
          this.doSaveSets(params);
        } else {
          console.log('submit error');
        }
      });
    },
    doSaveSets(params) {
      request({
        url: '/storemanager/map-setting/save',
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(data => {
        console.log(data);
        if (data.resCode == 200) {
          this.$message(data.message || '设置成功～');
          this.getSetsData();
        }
      });
      // request(`/storemanager/map-setting/save`,{})
    },
    // newzong end
    // getClassifyData(val) {
    //   this.classifyData = val;
    // },

    // changeClassifySort(val) {
    //   this.classifyData = val;
    // },

    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${
            channelData[this.itemName].channelType
          }`,
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
  },
};
</script>

<style lang="scss">
.shop-map-set_form {
  .input-group {
    width: 640px;
  }
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
  .remark {
    line-height: 36px;
    color: #888888;
    margin-left: 20px;
  }
  .area-select.large {
    width: 100%;
    line-height: 16px;
  }
  .area-select-wrap {
    width: 90%;
    line-height: 16px;
    display: flex;
  }
  .map-location-block {
    display: inline-block;
    margin-top: 10px;

    &.card-model-block {
      margin-left: 15px;
    }

    .map-default-icon {
      display: block;
      text-align: center;
    }

    .map-default-radio {
      margin-left: 8px;
      margin-top: 12px;
    }

    .map-radio-custom {
      margin-top: 12px;
      margin-left: 30px;
    }

    .map-upload-radio {
      margin-left: 26px;
      .avatar {
        width: 100%;
        height: 100%;
      }
    }
    .include {
      text-align: center;
      .item {
        width: 66px !important;
        height: 66px !important;
        margin: 0;
        .center {
          margin-top: -25px;
          .circle {
            width: 30px;
            height: 30px;
            margin: 0 auto 10px;
          }
          .text {
            font-size: 12px;
          }
        }
      }
    }
  }
  .map-upload-icon {
    .el-upload--picture-card {
      width: 46px;
      height: 46px;
      line-height: 60px;
    }

    .el-form-item__content {
      height: 100px;
    }

    .el-upload-list--picture-card .el-upload-list__item {
      width: 46px;
      height: 46px;
    }
  }
}
.shop-setting {
  border-bottom: 1px solid #ccc;
}
.shop-setting,
.master-setting {
  padding: 24px 0;
  margin-left: 160px;

  & .edit-tip {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }
  & .list {
    width: 480px;
    & .list-item,
    & .list-header {
      & > span {
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  }
  & .fun {
    width: 100px;
    display: inline-block;
  }
  & .name {
    width: 160px;
    display: inline-block;
  }
  & .h5-show {
    width: 100px;
    display: inline-block;
    text-align: center;
  }
  & .mini-show {
    width: 100px;
    display: inline-block;
    text-align: center;
  }

  & .list-header {
    font-size: 14px;
    color: #333;
    line-height: 40px;
    font-weight: bold;
  }
  & .list-body {
    font-size: 14px;
    color: #666;
    & .list-item {
      height: 40px;
      line-height: 40px;
      border-top: 1px solid #eee;
    }
  }
}

.map-card {
  height: 120px;
}
</style>
