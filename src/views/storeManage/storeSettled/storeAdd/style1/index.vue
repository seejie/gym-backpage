<template>
  <div class="imgAdd">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>

      <div style="padding-right:20px;">
        <el-form :model="addData" ref="storeForm" :rules="rules" label-width="100px">
          <el-form-item label="店铺名称" prop="name">
            <el-col :span="12">
              <el-input type="text" maxlength="30" placeholder="请输入名称，30字以内" v-model="addData.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="店铺通知">
            <el-col :span="12">
              <el-input
                type="text"
                maxlength="50"
                placeholder="1-50个字符，在前台跑马灯显示，不填前端不显示"
                v-model="addData.notification"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="副标题">
            <el-col :span="12">
              <el-input
                type="text"
                maxlength="30"
                placeholder="请输入名称，30字以内"
                v-model="addData.subTitle"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="店铺介绍">
            <myEditor v-model="addData.introduction"></myEditor>
          </el-form-item>

          <el-form-item label="店铺列表缩略图" required>
            <img-include v-model="indexPic" :max="1" :cropper="coverThumbCropper"></img-include>
            <div class="tips">
              请上传5M以内图片，支持PNG\JPG
              <br />等常见格式,建议尺寸 135*90
            </div>
          </el-form-item>
          <el-form-item label="店铺详情banner图" required>
            <img-include v-model="banner" :max="9" :cropper="coverCropper"></img-include>
            <div class="tips">
              请上传5M以内图片，支持PNG\JPG
              <br />等常见格式,建议尺寸 375*150
            </div>
          </el-form-item>

          <el-form-item label="营业执照">
            <img-include
              v-model="licenseImage"
              :titleArray="licTitles"
              placeholder="请输入营业执照号"
              @titleChange="
                vals => {
                  bindIncludeTitleChange('licTitles', vals);
                }
              "
              :hasTitle="true"
              :max="1"
              :cropper="businessLicenseCropper"
            ></img-include>
            <div class="tips">JPG、PNG格式， 图片小于5M，最多支持9张，建议格式100*100</div>
          </el-form-item>

          <el-form-item label="经营地址证明">
            <img-include v-model="siteCert" :max="1" :cropper="cardCropper"></img-include>
            <div class="tips">
              请上传5M以内图片，支持PNG\JPG
              <br />等常见格式,建议尺寸 100*100
            </div>
          </el-form-item>

          <el-form-item label="店铺相册">
            <img-include
              v-model="storeAlbum"
              placeholder="请输入店铺相册"
              :max="9"
              :cropper="storeAlbumCropper"
            ></img-include>
            <div class="tips">请上传5M以内图片，支持PNG\JPG等常见格式,建议尺寸 100*100</div>
          </el-form-item>

          <el-form-item label="店铺视频">
            <div class="add-video-card" @mouseleave="maskClose">
              <video
                style="width:100%;height: 100%"
                controls
                :poster="video[0].videoPath"
                v-if="video.length"
                @mouseenter="maskShow"
              >
                <source :src="video[0].videoPath" />
              </video>
              <div class="center" v-if="!video.length" @click="handleChooseVideo">
                <div class="circle">
                  <svg-icon icon-class="addimg"></svg-icon>
                </div>
                <div class="text">点击上传</div>
              </div>
              <div class="centerBack" v-if="maskShowVisible" @click="handleChooseVideo">
                <div class="mask-content">
                  <div class="circle">
                    <svg-icon icon-class="imgedit"></svg-icon>
                  </div>
                  <div class="text">点击修改</div>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="店铺类型" prop="category">
            <el-select v-model="addData.category" placeholder="请选择店铺类型">
              <el-option
                v-for="item in venueTypelistData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="语音讲解">
            <i
              @click="voiceDialogVisible = true"
              class="el-icon-upload"
              style="font-size: 27px;color: green;line-height:40px;float:left;"
            ></i>

            <audio controls="controls" v-if="addData.audioTour">
              <source :src="addData.audioTour" type="audio/ogg" />
              <source :src="addData.audioTour" type="audio/mpeg" />
              <embed height="100" width="100" :src="addData.audioTour" />
            </audio>
            <i v-if="addData.audioTour" class="el-icon-remove" @click.stop="bindClickRemoveAudio"></i>
            <!-- {{addData.voice !='' &&addData.voice!=null?"已选择音频："+addData.voicename+"【"+addData.voice+"】":""}} -->
            <el-dialog
              v-if="voiceDialogVisible"
              title="选择音频"
              :visible.sync="voiceDialogVisible"
              width="70%"
              center
            >
              <voice-page
                :getId="false"
                :modal="false"
                @handleCheckedCitiesChange="handleCheckedCitiesChange"
              ></voice-page>
              <div slot="footer" class="dialog-footer">
                <el-button
                  @click="
                    voiceDialogVisible = false;
                    addData.voicename = '';
                    addData.voice = '';
                  "
                >取 消</el-button>
                <el-button type="primary" @click="voiceDialogVisible = false">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>

          <el-form-item label="标签类型">
            <el-col :span="12">
              <el-input-tag v-model="addData.labels"></el-input-tag>
              <div class="tips">录入后按回车</div>
            </el-col>
          </el-form-item>

          <el-form-item label="网点评级">
            <el-col :span="12">
              <div class="rate">
                <el-rate v-model="addData.level"></el-rate>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="网点粉丝基数">
            <el-col :span="12">
              <el-input v-model="addData.fans" placeholder="输入网点粉丝数据基数，手机端是基数+真实粉丝"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-col :span="12">
              <el-input v-model="addData.mobile" type="number" placeholder="请输入网点联系电话"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-col :span="12">
              <el-input v-model="addData.password" placeholder="不填则默认123456"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="营业时间" style="width: 1500px">
            <el-row>
              <!-- <el-time-picker
              is-range
              v-model="addData.ocTimes"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              ></el-time-picker>-->

              <el-col :span="4">
                <el-time-picker
                  placeholder="选择开始时间"
                  :picker-options="pickerOptionsOpenTime"
                  v-model="addData.openTime"
                  @change="bindChangeOpenTime"
                  value-format="HH:mm"
                  format="HH:mm"
                ></el-time-picker>
              </el-col>
              <el-col class="line" :span="0">-</el-col>
              <el-col :span="4">
                <el-time-picker
                  placeholder="选择结束时间"
                  :picker-options="pickerOptionsCloseTime"
                  v-model="addData.closeTime"
                  @change="bindChangeCloseTime"
                  value-format="HH:mm"
                  format="HH:mm"
                ></el-time-picker>
              </el-col>
            </el-row>
            <el-row>
              <el-checkbox-group v-model="addData.weeks">
                <el-checkbox label="1">周一</el-checkbox>
                <el-checkbox label="2">周二</el-checkbox>
                <el-checkbox label="3">周三</el-checkbox>
                <el-checkbox label="4">周四</el-checkbox>
                <el-checkbox label="5">周五</el-checkbox>
                <el-checkbox label="6">周六</el-checkbox>
                <el-checkbox label="7">周日</el-checkbox>
              </el-checkbox-group>
            </el-row>
          </el-form-item>

          <el-form-item label="地理位置" prop="address">
            <el-row>
              <el-col>
                <area-cascader
                  type="all"
                  style="line-height: 16px"
                  :level="1"
                  v-model="areaselected"
                  :data="pcaa"
                ></area-cascader>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-input placeholder="请填写详细地址" v-model="addData.address"></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="经纬度" style="width: 1100px">
            <el-col :span="5">
              <el-input v-model="addData.longitude" placeholder="经度" style="width: 200px"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="addData.latitude" placeholder="纬度" style="width: 200px"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="primary" @click="bindClickShowMap">地图选点</el-button>
            </el-col>
            <el-col :span="12">
              <el-dialog
                title="地图选点"
                :visible.sync="getmap.mapVisible"
                id="mapDialog"
                :close-on-click-modal="false"
              >
                <div class="demo-input-suffix" style="margin-bottom: 20px">
                  <el-input
                    class="lineinput"
                    placeholder="输入关键字"
                    style="width:230px"
                    size="mini"
                    v-model="getmap.key"
                  ></el-input>
                  <el-button class="el-icon-search" type="primary" size="mini" @click="searcharea"></el-button>
                  <el-link type="info">经度lng：</el-link>
                  <el-input
                    readonly
                    placeholder="点击地图获取经度"
                    class="lineinput"
                    style="width:150px"
                    size="mini"
                    v-model.number="getmap.locData.longitude"
                  ></el-input>
                  <el-link type="info">纬度lat：</el-link>
                  <el-input
                    readonly
                    placeholder="点击地图获取纬度"
                    class="lineinput"
                    style="width:150px"
                    size="mini"
                    v-model.number="getmap.locData.latitude"
                  ></el-input>
                </div>
                <baidu-map
                  class="map"
                  :center="getmap.center"
                  :zoom="getmap.zoom"
                  @ready="handler"
                  :scroll-wheel-zoom="true"
                  @click="clickEvent"
                  ak="G0OOcuOtMhP2cfNttbfYgOPsPI2XviDw"
                >
                  <!--//地图控件位置-->
                  <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                  <!--//城市列表-->
                  <!--<bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>-->
                  <bm-local-search
                    :keyword="getmap.locData.address"
                    :auto-viewport="true"
                    :location="getmap.location"
                    style="display:none"
                  ></bm-local-search>
                  <!--//定位当前位置-->
                  <bm-geolocation
                    anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                    :showAddressBar="true"
                    :autoLocation="true"
                    @locationSuccess="getLoctionSuccess"
                  ></bm-geolocation>
                  <!--//地图容器-->
                  <bm-view
                    :style="{ width: '100%', height: 400 + 'px', flex: 1, marginBottom: '-30px' }"
                  ></bm-view>
                </baidu-map>

                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-check"
                    @click.native="findlocation"
                  >保存</el-button>
                  <el-button
                    type="warning"
                    size="small"
                    icon="el-icon-close"
                    @click.native="getmap.mapVisible = false"
                  >取消</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-form-item>

          <el-form-item v-if="showClaimAmount" label="费用设定">
            <el-col :span="12">
              <el-input v-model="addData.claimAmount" placeholder="请输入金额，不填默认免费（单位元）"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item v-if="showEntrust" label="接受委托售卖">
            <el-radio-group v-model="addData.isOpenEntrustSell">
              <el-row>
                <el-radio :label="1" style="line-height: 2.8">是，接受</el-radio>
              </el-row>
              <el-row>
                <el-radio :label="0" style="line-height: 2.8">否，不接受</el-radio>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <div class="foot">发布设置</div>
          <el-form-item label="发布位置">
            <el-select placeholder="请选择" v-model="addData.releaseLoc">
              <el-option label="默认" :value="1"></el-option>
              <el-option label="置顶" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发布时间">
            <el-radio-group v-model="addData.unitStatus">
              <el-row>
                <el-radio :label="3" style="line-height: 2.8">草稿，暂不发布</el-radio>
              </el-row>
              <el-row>
                <el-radio :label="2" style="line-height: 2.8">发布</el-radio>
              </el-row>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-right: 10px" type="primary" @click="saveBtn">提交</el-button>
            <router-link :to="{ name: 'storesettled' }">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      custom-class="imagetextadd"
      title="选择视频素材"
      :visible.sync="showVideo"
      width="94%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <videoMaterial
        :getItem="true"
        :modal="showModal"
        @handleCheckedCitiesChange="handleCheckedVideoChange"
      ></videoMaterial>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData(2)">确 定</el-button>
        <!--<el-button @click="getMediaId">关 闭</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { Message } from 'element-ui';
import ImgInclude from '@/components/CropImgInclue';
import videoMaterial from '@/views/material/video';
import channelData from '@/utils/channelData';
import VoicePage from '@/views/material/voice';
import { pca, pcaa } from 'area-data';
import { BaiduMap, BmNavigation, BmView, BmGeolocation, BmCityList, BmLocalSearch } from 'vue-baidu-map';
import { ElInputTag } from 'el-input-tag';
import { storeCreate } from '../../../sever.js';
import { storeAdd, storeList, storeEdit, storeDetail } from '@/api/store/index';
import cityList from '@/utils/citys';
import assign from 'object-assign';
export default {
  name: 'storeAdd',
  components: {
    ImgInclude,
    VoicePage,
    BaiduMap,
    BmNavigation,
    BmView,
    BmGeolocation,
    BmLocalSearch,
    videoMaterial,
    ElInputTag,
  },
  data() {
    return {
      showClaimAmount: false,
      showEntrust: false,
      pcaa: pcaa,
      storeId: null,
      showModal: false,
      showVideo: false,
      options: cityList.map(v =>
        assign({
          value: v.code,
          label: v.name,
          children: v.city.map(v => ({
            value: v.code,
            label: v.name,
          })),
        })
      ),
      rules: {
        name: [{ required: true, message: '请输入网店名称', trigger: 'blur' }],
        category: [{ required: true, message: '请输入网点类型', trigger: 'blur' }],
        areaselected: [
          {
            required: true,
            message: '请选择省份城市',
            trigger: ['change', 'blur'],
          },
        ],
        address: [{ required: true, message: '请填写详情地址', trigger: 'blur' }],
      },
      pickerOptionsOpenTime: {
        selectableRange: '00:00:00 - 23:59:59',
        format: 'HH:mm',
      },
      pickerOptionsCloseTime: {
        // selectableRange: '00:00:00 - 23:59:59',
        format: 'HH:mm',
      },
      addData: {
        name: '',
        notification: '',
        subTitle: '',
        introduction: '',
        type: '',
        voice: '',
        voicename: '',
        audioTour: '', // 语音讲解
        provinceId: '',
        category: '',
        cityId: '',
        areaId: '',
        provinceName: '',
        cityName: '',
        areaName: '',
        tags: [],
        labels: [],
        password: '',
        fans: '',
        mobile: '',
        openTime: '',
        closeTime: '',
        ocTimes: [],
        address: '',
        longitude: '',
        latitude: '',
        claimAmount: '',
        releaseLoc: 1, // 1:默认；2:置顶
        unitStatus: 2, // 1:草稿;2:发布；
        isOpenEntrustSell: 1, // 接口委托
        weeks: [],
      },

      // 省市区选择
      areaselected: [],

      // 网点类型
      venueTypelistData: [],

      voiceDialogVisible: false,
      indexPic: { ratio1: [] },
      banner: {
        ratio1: [],
      },

      siteCert: {
        ratio1: [],
      },

      licenseImage: {
        ratio1: [],
      },

      storeAlbum: {
        ratio1: [],
      },
      coverThumbCropper: [
        {
          name: '列表缩略图',
          ratio_x: 135,
          ratio_y: 90,
          ratio: 1,
          desc: '你的用户将在店铺管理查看更多列表，看到此封面',
        },
      ],
      cardCropper: [
        {
          name: '场地证明',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '',
        },
      ],

      coverCropper: [
        {
          name: '封面详情banner',
          ratio_x: 375,
          ratio_y: 150,
          ratio: 1,
          desc: '你的用户将在网点详情、惠购频道门票聚合，看到此封面。',
        },
      ],

      businessLicenseCropper: [
        {
          name: '营业执照',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '',
        },
      ],

      storeAlbumCropper: [
        {
          name: '场馆相册',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '',
        },
      ],
      video: [],
      getmap: {
        center: { lng: 121.833138, lat: 39.081725 },
        zoom: 12,
        mapVisible: false,
        locData: {
          longitude: '',
          latitude: '',
          address: '',
        },
        clientHeight: document.documentElement.clientHeight - 200, // 屏幕高度
        location: '',
        key: '',
      },
      licTitles: {},
      maskShowVisible: false,
    };
  },
  watch: {
    // areaselected: {
    //   handler() {
    //   },
    //   deep: true,
    // },
  },
  created() {
    this.getSetsData();
    this.getVenueTypelist();
    if (this.$route.query.id) {
      this.storeId = this.$route.query.id;
      this.storeDetail(this.$route.query.id);
    }
  },

  methods: {
    maskShow() {
      this.maskShowVisible = true;
    },
    maskClose() {
      this.maskShowVisible = false;
    },
    handleChooseVideo() {
      this.showVideo = true;
    },
    setData(e) {
      if (this.video.length > 1) {
        this.$message({
          type: 'info',
          message: '只能选择一条场馆视频',
        });
        return;
      }
      this.showVideo = false;
    },
    handleCheckedVideoChange(e) {
      this.video = _.cloneDeep(e);
      console.log(e);
    },
    getSetsData() {
      // 277
      this.$ajax
        .get('/storemanager/map-setting/get?unitId=4&channelType=11')
        .then(res => {
          if (res.resObject && res.resCode === 200) {
            this.showEntrust = res.resObject.isOpenEntrustSell || 0;
            this.showClaimAmount = res.resObject.claimOnline || 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    bindChangeOpenTime(val) {
      // if (this.addData.closeTime) {
      //   if (parseInt(val.replace(':', '')) > parseInt(this.addData.closeTime.replace(':', ''))) {
      //     this.addData.closeTime = '';
      //   }
      // }
      // this.pickerOptionsCloseTime.minTime = val;
    },
    bindChangeCloseTime(val) {},
    bindClickRemoveAudio() {
      this.addData.voice = '';
      this.addData.audioTour = '';
      this.addData.voicename = '';
    },
    bindIncludeTitleChange(type, titles) {
      console.log(titles);
      this.licTitles = titles;
    },
    getVenueTypelist() {
      storeList({ unitType: '32' }).then(res => {
        if (res.resCode === 200) {
          this.venueTypelistData = res.resObject;
        }
      });
    },
    storeDetail(id) {
      storeDetail({ storeId: id }).then(res => {
        console.log(res);
        if (res.resCode === 200) {
          // if (res.resObject.openTime && res.resObject.closeTime) {
          //   res.resObject.ocTimes = [res.resObject.openTime, res.resObject.closeTime];
          // }
          if (res.resObject.tags) {
            res.resObject.tags = res.resObject.tags.split(',');
            res.resObject.labels = res.resObject.tags;
          }
          if (!res.resObject.weeks) {
            res.resObject.weeks = [];
          }
          this.addData = res.resObject;
          this.addData.isOpenEntrustSell = this.addData.isOpenEntrustSell || 0;
          if (res.resObject.longitude && res.resObject.latitude) {
            this.getmap.center = { lng: res.resObject.longitude, lat: res.resObject.latitude };
          }
          if (res.resObject.banner && res.resObject.banner.length && res.resObject.banner[0].url) {
            this.banner.ratio1 = res.resObject.banner.map(v => {
              return v.url;
            });
          }
          if (res.resObject.indexPic) {
            const ratio1 = [];
            this.indexPic.ratio1 = res.resObject.indexPic.map(v => {
              return v.url;
            });
          }
          if (res.resObject.siteCert && res.resObject.siteCert.length && res.resObject.siteCert[0].url) {
            this.siteCert.ratio1 = res.resObject.siteCert.map(v => {
              return v.url;
            });
          }
          if (res.resObject.video) {
            this.video.push({
              videoPath: res.resObject.video,
            });
          }
          if (res.resObject.storeAlbum && res.resObject.storeAlbum.length && res.resObject.storeAlbum[0].url) {
            const ratio1 = [];
            this.storeAlbum.ratio1 = res.resObject.storeAlbum.map(v => {
              return v.url;
            });
          }
          if (res.resObject.licenseImage) {
            const ratio1 = [];
            const titleArr = {};
            for (var i in res.resObject.licenseImage) {
              ratio1.push(res.resObject.licenseImage[i].url);
              titleArr['title' + i] = res.resObject.licenseImage[i].desc;
            }
            // console.log(ratio1)
            this.licenseImage.ratio1 = ratio1;
            this.licTitles = titleArr;
          }

          const areas = [];
          if (res.resObject.provinceId && res.resObject.provinceName) {
            areas[0] = pcaa[86][res.resObject.provinceId];
          }
          if (res.resObject.cityId && res.resObject.cityName) {
            areas[1] = pcaa[res.resObject.provinceId][res.resObject.cityId];
          }
          if (res.resObject.areaId && res.resObject.areaName) {
            areas[2] = pcaa[res.resObject.provinceId][res.resObject.cityId][res.resObject.areaId];
          }
          this.areaselected = areas;
        }
      });
    },

    handleCheckedCitiesChange(val) {
      if (val.length > 0) {
        this.addData.voice = val[0].imagePath;
        this.addData.audioTour = val[0].voicePath;
        this.addData.voicename = val[0].title;
      }
    },
    bindClickShowMap() {
      this.getmap.mapVisible = true;
      // this.getmap.key =
      let ads = '';
      if (this.areaselected && this.areaselected.length > 1) {
        this.areaselected.forEach((area, index) => {
          const code = Object.keys(area)[0];
          const name = area[code];
          ads = ads + '' + name;
        });
      }
      this.getmap.key = ads;
      this.searcharea();
    },
    searcharea() {
      this.getmap.locData.address = this.getmap.key;
    },

    handler({ BMap, map }) {
      var geolocation = new BMap.Geolocation();
      if (this.addData.longitude !== '' && this.addData.latitude !== '') {
        this.getmap.center.lng = this.addData.longitude;
        this.getmap.center.lat = this.addData.latitude;
        var myMarker = new BMap.Marker(new BMap.Point(this.getmap.center.lng, this.getmap.center.lat));
        map.addOverlay(myMarker);
        this.getmap.locData.longitude = this.addData.longitude;
        this.getmap.locData.latitude = this.addData.latitude;
      } else {
        if (!this.getmap.key) {
          // var loadingInstance =Loading.service({text:'正在定位....',fullscreen:true});
          this.message('正在定位...');
          geolocation.getCurrentPosition(
            r => {
              this.getmap.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
              this.getmap.autoLocationPoint = {
                lng: r.longitude,
                lat: r.latitude,
              }; // 自定义覆盖物
              this.getmap.initLocation = true;
              this.getmap.locData.longitude = r.longitude;
              this.getmap.locData.latitude = r.latitude;
              // loadingInstance.close();
            },
            { enableHighAccuracy: true }
          );
        }
      }

      window.map = map;
    },

    // 点击地图监听
    clickEvent(e) {
      map.clearOverlays();
      var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
      map.addOverlay(myMarker);
      // 用所定位的经纬度查找所在地省市街道等信息
      var point = new BMap.Point(e.point.lng, e.point.lat);
      var gc = new BMap.Geocoder();
      const that = this;
      gc.getLocation(point, function (rs) {
        var addComp = rs.addressComponents;
        // console.log(rs.address);//地址信息
        that.getmap.locData.address = rs.address;
        that.getmap.key = rs.address;
      });
      this.getmap.locData.longitude = e.point.lng;
      this.getmap.locData.latitude = e.point.lat;
    },

    // 定位成功回调
    getLoctionSuccess(point, AddressComponent, marker) {
      map.clearOverlays();
      var myMarker = new BMap.Marker(new BMap.Point(point.point.lng, point.point.lat));
      map.addOverlay(myMarker);
      this.getmap.locData.longitude = point.point.lng;
      this.getmap.locData.latitude = point.point.lat;
    },

    findlocation() {
      // this.$emit("findlocdata",this.getmap.locData)
      this.addData.longitude = this.getmap.locData.longitude;
      this.addData.latitude = this.getmap.locData.latitude;
      this.addData.address = this.getmap.locData.address;
      this.getmap.mapVisible = false;
    },

    // 错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type,
      });
    },

    saveBtn() {
      if (!this.indexPic.ratio1.length) {
        this.$message.warning('请选择列表缩略图');
        return;
      }
      if (!this.banner.ratio1.length) {
        this.$message.warning('请选择封面详情banner');
        return;
      }
      this.$refs.storeForm.validate(valid => {
        if (this.addData.unitStatus === 3) {
          // 草稿 只需要验证名称输入
          if (!this.addData.name) {
            this.$message.error('请输入网点名称～');
            return false;
          } else {
            valid = true;
          }
        }
        if (valid) {
          const banner = [];
          const siteCert = [];
          const licenseImage = [];
          const storeAlbum = [];
          let video = '';
          const indexPic = [];
          siteCert[0] = {
            desc: '',
            key: '',
            url: this.siteCert.ratio1[0],
          };
          this.licenseImage.ratio1.map(function (items, index) {
            const imgs = {
              desc: '',
              key: '',
              url: items,
            };
            licenseImage.push(imgs);
          });
          this.storeAlbum.ratio1.map(function (items, index) {
            const imgs = {
              desc: '',
              key: '',
              url: items,
            };
            storeAlbum.push(imgs);
          });
          this.indexPic.ratio1.map(function (items, index) {
            const imgs = {
              desc: '',
              key: '',
              url: items,
            };
            indexPic.push(imgs);
          });
          this.banner.ratio1.map(function (items, index) {
            const imgs = {
              desc: '',
              key: '',
              url: items,
            };
            banner.push(imgs);
          });
          const areas = {};
          if (this.video.length) {
            video = this.video[0].videoPath;
          }

          if (this.areaselected && this.areaselected.length > 1) {
            this.areaselected.forEach((area, index) => {
              const code = Object.keys(area)[0];
              const name = area[code];
              if (index === 0) {
                areas.provinceId = code;
                areas.provinceName = name;
              } else if (index === 1) {
                areas.cityId = code;
                areas.cityName = name;
              } else {
                areas.areaId = code;
                areas.areaName = name;
              }
            });
          }
          // this.addData.provinceId = parseInt(Object.keys(this.areaselected[0])[0]);
          // this.addData.provinceName = this.areaselected[0][this.addData.provinceId];
          // this.addData.cityId = Object.keys(this.areaselected[1])[0];
          // this.addData.areaId = parseInt(Object.keys(this.areaselected[2])[0]);
          // this.addData.cityName = this.areaselected[1][this.addData.cityId];
          // this.addData.areaName = this.areaselected[2][this.addData.areaId];
          // if (!this.licTitles['title' + (licImage.length - 1)]) {
          //   this.$message.error('请输入对应的营业执照号～');
          //   return;
          // } else {

          // }
          let i = 0;
          for (var keys in this.licTitles) {
            licenseImage[i].desc = this.licTitles[keys];
            i++;
            // bizLicNo.push(this.licTitles[keys]);
          }
          if (this.addData.labels && this.addData.labels.length) {
            this.addData.tags = this.addData.labels.join(',');
          } else {
            this.addData.tags = '';
          }
          if (this.addData.open === null || typeof this.addData.open === 'undefined') {
            // 默认营业中
            this.addData.open = 1;
          }
          // if (this.addData.ocTimes && this.addData.ocTimes.length > 1) {
          //   this.addData.openTime = this.addData.ocTimes[0];
          //   this.addData.closeTime = this.addData.ocTimes[1];
          // } else {
          //   this.addData.openTime = '';
          //   this.addData.closeTime = '';
          // }
          const payload = {
            ...this.addData,
            ...areas,
            unitType: 32,
            banner: banner,
            siteCert: siteCert,
            licenseImage: licenseImage,
            storeAlbum: storeAlbum,
            video: video,
            indexPic: indexPic,
            // bizLicNo: bizLicNo.join(",")
          };
          if (this.storeId) {
            storeEdit(payload).then(res => {
              if (parseInt(res.resCode) === 200) {
                this.$router.push('/storemanage/storesettled');
              }
            });
          } else {
            storeAdd(payload).then(res => {
              if (parseInt(res.resCode) === 200) {
                this.$router.push('/storemanage/storesettled');
              }
            });
          }
        } else {
          console.log('submit error');
        }
      });
    },
  },
};
</script>
<style lang="scss">
.el-range-editor--medium .el-range-separator {
  box-sizing: content-box;
}
</style>

<style lang="scss" scoped>
.imgAdd {
  @extend %fill;
  padding: 10px;
}

.cover-container {
  display: flex;
}

.tips {
  color: #999;
  line-height: 1.5;
  clear: both;
}

.rate {
  display: flex;
  align-items: center;
  height: 40px;
}

.foot {
  font-size: 20px;
  margin: 20px;
}
audio {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
  & + .el-icon-remove {
    color: #888888;
    position: absolute;
  }
}
.add-video-card {
  position: relative;
  width: 243px;
  height: 243px;
  border: 1px solid #d8dfe8;
  background: #f9f9f9;
  vertical-align: middle;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-right: 18px;
  margin-bottom: 10px;
  .circle {
    width: 48px;
    height: 48px;
    margin: 10px auto 16px;
    border-radius: 48px;
    background: $xqn_green;
    text-align: center;
    line-height: 48px;
  }

  .text {
    font-size: 14px;
    color: $font-6;
  }
}
.center {
  position: absolute;
  top: 50%;
  margin: 0 auto;
  margin-top: -55px;
  width: 100%;
  max-height: 110px;
  text-align: center;

  &.only_icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    margin-top: 0;
    flex-direction: column;
    .text {
      display: none;
    }
  }
}
.centerBack {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  .mask-content {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 60px;
    height: 107px;
    .text {
      color: #fff;
    }
  }
  .circle {
    width: 48px;
    height: 48px;
    text-align: center;
    line-height: 48px;
  }
}
</style>
