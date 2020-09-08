<template>
  <div class="imgAdd">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>

      <div style="padding-right:20px;">
        <el-form :model="addData" ref="storeForm" :rules="rules" label-width="100px">
          <el-form-item label="专家名称" prop="name">
            <el-col :span="12">
              <el-input type="text" maxlength="30" placeholder="请输入名称，30字以内" v-model="addData.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="职务信息">
            <el-col :span="12">
              <el-input
                type="text"
                maxlength="30"
                placeholder="请输入名称，30字以内"
                v-model="addData.jobInfo"
              ></el-input>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="大师信息">
            <el-col :span="12">
              <el-input
                type="text"
                maxlength="30"
                placeholder="请输入名称，30字以内"
                v-model="addData.subTitle"
              ></el-input>
            </el-col>
          </el-form-item>-->
          <el-form-item label="专家介绍">
            <myEditor v-model="addData.introduction"></myEditor>
          </el-form-item>

          <el-form-item label="列表缩略图" required>
            <img-include v-model="indexPic" :max="1" :cropper="indexCropper"></img-include>
            <div class="tips">
              请上传5M以内图片，支持PNG\JPG
              <br />等常见格式,建议尺寸 106*137
            </div>
          </el-form-item>

          <el-form-item label="封面详情banner" required>
            <img-include v-model="banner" :max="9" :cropper="detailCropper"></img-include>
            <div class="tips">请上传5M以内图片，支持PNG\JPG等常见格式,建议尺寸 375*150</div>
          </el-form-item>

          <!-- <el-form-item label="证件照图片">
              <img-include v-model="certImage" :max="1" :cropper="cardCropper"></img-include>
              <div class="tips">
                请上传5M以内图片，支持PNG\JPG
                <br />等常见格式,建议尺寸 100*100
              </div>
          </el-form-item>-->
          <el-form-item label="身份证明">
            <img-include v-model="idImage" :max="1" :cropper="introCropper"></img-include>
            <div class="tips">JPG、PNG格式， 图片小于5M，最多支持9张，建议格式100*100</div>
          </el-form-item>
          <el-form-item label="获奖证书图片">
            <img-include
              v-model="certImage"
              :titleArray="cerTitles"
              @titleChange="
                vals => {
                  bindIncludeTitleChange('cerTitles', vals);
                }
              "
              :hasTitle="true"
              :max="9"
              :cropper="certCropper"
            ></img-include>
            <div class="tips">JPG、PNG格式， 图片小于5M，最多支持9张，建议格式100*100</div>
          </el-form-item>
          <el-form-item label="个人相册">
            <img-include v-model="personAlbum" :max="9" :cropper="personCropper"></img-include>
            <div class="tips">JPG、PNG格式， 图片小于5M，最多支持9张，建议格式100*100</div>
          </el-form-item>
          <el-form-item label="品类类型">
            <el-select v-model="addData.category" placeholder="请选择网点类型">
              <el-option
                v-for="item in venueTypelistData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签类型">
            <el-col :span="12">
              <el-input-tag v-model="addData.labels"></el-input-tag>
              <div class="tips">录入后按回车</div>
            </el-col>
          </el-form-item>

          <el-form-item label="大师评级">
            <el-col :span="12">
              <div class="rate">
                <el-rate v-model="addData.level"></el-rate>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="默认粉丝">
            <el-col :span="12">
              <el-input v-model="addData.fans" placeholder="输入网点粉丝数据基数，手机端是基数+真实粉丝"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-col :span="12">
              <el-input v-model="addData.mobile" type="number" placeholder="请输入网点联系电话"></el-input>
            </el-col>
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
          <div class="foot">发布设置</div>
          <el-form-item label="发布位置">
            <el-select placeholder="请选择" v-model="addData.releaseLoc">
              <el-option label="默认" :value="1"></el-option>
              <el-option label="置顶" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发布时间">
            <el-radio-group v-model="addData.releaseStatus">
              <el-row>
                <el-radio :label="1" style="line-height: 2.8">草稿，暂不发布</el-radio>
              </el-row>
              <el-row>
                <el-radio :label="2" style="line-height: 2.8">发布</el-radio>
              </el-row>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-right: 10px" type="primary" @click="saveBtn">提交</el-button>
            <router-link :to="{ name: 'mastersettled' }">
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
import channelData from '@/utils/channelData';
import { pca, pcaa } from 'area-data';
import { ElInputTag } from 'el-input-tag';
import { storeCreate } from '../../../sever.js';
import { storeAdd, storeList, storeEdit, storeDetail } from '@/api/master/index';
import cityList from '@/utils/citys';
import assign from 'object-assign';
export default {
  name: 'storeAdd',
  components: {
    ImgInclude,
    ElInputTag,
  },
  data() {
    return {
      unitType: 31, // 单位类型，必传：31-大师；32-店铺场馆；33-艺术场馆；34-艺术大师
      pcaa: pcaa,
      masterId: null,
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
        areaselected: [
          {
            required: true,
            message: '请选择省份城市',
            trigger: ['change', 'blur'],
          },
        ],
        address: [{ required: true, message: '请填写详情地址', trigger: 'blur' }],
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
        cityId: '',
        areaId: '',
        provinceName: '',
        cityName: '',
        areaName: '',
        tags: [],
        labels: [],
        fans: '',
        mobile: '',
        openTime: '',
        closeTime: '',
        address: '',
        longitude: '',
        latitude: '',
        claimAmount: '',
        releaseLoc: 1, // 1:默认；2:置顶
        releaseStatus: 2, // 2:上线；-1:草稿
        weeks: [],
      },

      // 省市区选择
      areaselected: [],

      // 网点类型
      venueTypelistData: [],

      voiceDialogVisible: false,

      indexPic: {
        ratio1: [],
      },
      banner: {
        ratio1: [],
      },
      idImage: {
        ratio1: [],
      },
      personAlbum: {
        ratio1: [],
      },
      certImage: {
        ratio1: [],
      },
      indexCropper: [
        {
          name: '列表缩略图',
          ratio_x: 106,
          ratio_y: 137,
          ratio: 1,
          desc: '你的用户将在网点详情、惠购频道门票聚合，看到此封面。',
        },
      ],

      personCropper: [
        {
          name: '个人相册',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '你的用户将在网点详情、惠购频道门票聚合，看到此封面。',
        },
      ],
      detailCropper: [
        {
          name: '封面详情banner',
          ratio_x: 375,
          ratio_y: 150,
          ratio: 1,
          desc: '你的用户将在网点详情、惠购频道门票聚合，看到此封面。',
        },
      ],
      introCropper: [
        {
          name: '身份证明',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '',
        },
      ],

      certCropper: [
        {
          name: '证书图片',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '',
        },
      ],

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
      cerTitles: {},
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
    this.getVenueTypelist();
    if (this.$route.query.masterId) {
      this.masterId = this.$route.query.masterId;
      this.storeDetail(this.$route.query.masterId);
    }
  },

  methods: {
    bindClickRemoveAudio() {
      this.addData.voice = '';
      this.addData.audioTour = '';
      this.addData.voicename = '';
    },
    bindIncludeTitleChange(type, titles) {
      console.log(titles);
      this.cerTitles = titles;
    },
    getVenueTypelist() {
      storeList({ unitType: this.unitType }).then(res => {
        if (res.resCode == 200) {
          this.venueTypelistData = res.resObject.list;
        }
      });
    },
    storeDetail(id) {
      storeDetail({ masterId: id }).then(res => {
        if (res.resCode === 200) {
          if (res.resObject.tags) {
            res.resObject.tags = res.resObject.tags.split(',');
            res.resObject.labels = res.resObject.tags;
          }
          res.resObject.releaseStatus = res.resObject.releaseStatus || 2;
          this.addData = res.resObject;
          if (res.resObject.longitude && res.resObject.latitude) {
            this.getmap.center = { lng: res.resObject.longitude, lat: res.resObject.latitude };
          }
          // 列表图片
          if (res.resObject.indexPic && res.resObject.indexPic.length) {
            const ratio1 = [];
            ratio1.push(res.resObject.indexPic[0].url);
            this.indexPic.ratio1 = ratio1;
          }

          if (res.resObject.banner && res.resObject.banner.length) {
            const ratio1 = res.resObject.banner.map(item => {
              return item.url;
            });
            this.banner.ratio1 = ratio1;
          }
          // 介绍图片
          if (res.resObject.idImage && res.resObject.idImage.length) {
            const ratio1 = res.resObject.idImage.map(item => {
              return item.url;
            });
            this.idImage.ratio1 = ratio1;
          }
          // 个人相册
          if (res.resObject.personAlbum && res.resObject.personAlbum.length) {
            const ratio1 = res.resObject.personAlbum.map(item => {
              return item.url;
            });
            this.personAlbum.ratio1 = ratio1;
          }
          // 介绍图片
          if (res.resObject.certImage && res.resObject.certImage.length) {
            const titleArr = {};
            const ratio1 = res.resObject.certImage.map((item, i) => {
              titleArr['title' + i] = item.desc;
              return item.url;
            });
            this.certImage.ratio1 = ratio1;
            this.cerTitles = titleArr;
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
      console.log(val);
      if (val.length > 0) {
        this.addData.voice = val[0].imagePath;
        this.addData.audioTour = val[0].voicePath;
        this.addData.voicename = val[0].title;
      }
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

      window.map = map;
    },

    // 点击地图监听
    clickEvent(e) {
      window.map.clearOverlays();
      var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
      window.map.addOverlay(myMarker);
      // 用所定位的经纬度查找所在地省市街道等信息
      var point = new BMap.Point(e.point.lng, e.point.lat);
      var gc = new BMap.Geocoder();
      const that = this;
      gc.getLocation(point, function(rs) {
        var addComp = rs.addressComponents;
        that.getmap.locData.address = rs.address;
        that.getmap.key = rs.address;
      });
      this.getmap.locData.longitude = e.point.lng;
      this.getmap.locData.latitude = e.point.lat;
    },

    // 定位成功回调
    getLoctionSuccess(point, AddressComponent, marker) {
      window.map.clearOverlays();
      var myMarker = new BMap.Marker(new BMap.Point(point.point.lng, point.point.lat));
      window.map.addOverlay(myMarker);
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
      this.$refs.storeForm.validate(valid => {
        if (this.addData.releaseStatus === 1) {
          // 草稿 只需要验证名称输入
          if (!this.addData.name) {
            this.$message.error('请输入名称～');
            return false;
          } else {
            valid = true;
          }
        }
        if (valid) {
          const indexPic = []; // 列表图片
          let idImage = []; // 介绍图片
          let banner = [];
          let personAlbum = [];
          let certImage = []; // 证书图片
          indexPic[0] = {
            desc: '',
            key: '',
            url: this.indexPic.ratio1[0],
          };
          // console.log('/222', this.introImgs.ratio1);
          idImage = this.idImage.ratio1.map((items, index) => {
            return {
              desc: '',
              key: '',
              url: items,
            };
          });
          personAlbum = this.personAlbum.ratio1.map((items, index) => {
            return {
              desc: '',
              key: '',
              url: items,
            };
          });
          banner = this.banner.ratio1.map((items, index) => {
            return {
              desc: '',
              key: '',
              url: items,
            };
          });
          certImage = this.certImage.ratio1.map((items, index) => {
            return {
              desc: '',
              key: '',
              url: items,
            };
          });
          let i = 0;
          for (var keys in this.cerTitles) {
            certImage[i].desc = this.cerTitles[keys];
            i++;
          }
          const areas = {};
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
          if (this.addData.labels && this.addData.labels.length) {
            this.addData.tags = this.addData.labels.join(',');
          } else {
            this.addData.tags = '';
          }
          const payload = {
            ...this.addData,
            ...areas,
            unitType: this.unitType,
            indexPic: indexPic,
            idImage: idImage,
            personAlbum: personAlbum,
            certImage: certImage,
            banner: banner,
            // bizLicNo: bizLicNo.join(",")
          };
          if (this.masterId) {
            storeEdit(payload).then(res => {
              if (parseInt(res.resCode) === 200) {
                this.$router.push('/storemanage/mastersettled');
              }
            });
          } else {
            payload.open = 1;
            storeAdd(payload).then(res => {
              if (parseInt(res.resCode) === 200) {
                this.$router.push('/storemanage/mastersettled');
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
</style>
