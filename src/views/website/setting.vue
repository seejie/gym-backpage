<template>
  <div class="container">
    <el-card class="box-card">
      <el-form :model="form" ref="channelForm" label-width="120px" class="demo-ruleForm">
        <h4 style="color: #333;">基础设定</h4>

        <el-form-item label="网站风格颜色">
          <div class="checked_text">
            <div class="label">{{ form.style }}</div>
            <el-color-picker v-model="form.style"></el-color-picker>
          </div>
        </el-form-item>

        <el-form-item label="文字状态">
          <div class="checked_text">
            <div class="label">选中 {{ form.checkedText }}</div>
            <el-color-picker v-model="form.checkedText"></el-color-picker>
            <div class="label">未选中{{ form.uncheckedText }}</div>

            <el-color-picker v-model="form.uncheckedText"></el-color-picker>
          </div>
        </el-form-item>

        <el-form-item label="*官网名称">
          <el-input type="text" placeholder="请输入名称,4~20个字符" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="*官网LOGO">
          <img-include v-model="imgsLogo" :max="1" :cropper="cropper"></img-include>
          <div class="upload-icon-text">
            尺寸:
            <br />
            80*80
          </div>
        </el-form-item>

        <el-form-item label="*功能导航">
          <el-checkbox-group v-model="form.function">
            <el-checkbox label="1">首页</el-checkbox>
            <el-checkbox label="2">新闻</el-checkbox>
            <el-checkbox label="3">服务介绍</el-checkbox>
            <el-checkbox label="4">关于我们</el-checkbox>
            <el-checkbox label="5">经典案例</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="*banner图片">
          <img-include v-model="imgsBanner" :max="6" :cropper="cropperBanner"></img-include>

          <div class="upload-icon-text">
            尺寸:
            <br />
            1920*540
          </div>
        </el-form-item>
        <el-form-item label="*关于我们封面">
          <img-include v-model="imgsCover" :max="1" :cropper="cropperCover"></img-include>
          <div class="upload-icon-text">
            尺寸:
            <br />
            600*400
          </div>
        </el-form-item>

        <el-form-item label="*关于我们介绍">
          <!-- <el-input
            type="textarea"
            maxlength="150"
            show-word-limit
            v-model="form.aboutUs"
            placeholder="请输入介绍，150字以"
          ></el-input> -->
          <myEditor v-model="form.aboutUs" refs="aboutUs"></myEditor>
        </el-form-item>

        <el-form-item label="*关于我们详情">
          <myEditor v-model="form.aboutUsText" refs="aboutUsText"></myEditor>
        </el-form-item>
        <el-form-item label="联系我们">
          <el-input type="text" placeholder="请输入手机或固定电话" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="company" label="所在地区">
          <area-cascader
            type="all"
            style="line-height: 16px;"
            :level="1"
            v-model="areaselected"
            :data="pcaa"
          ></area-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            type="text"
            placeholder="请输入详细地址，如道路、门牌号、单元室等"
            v-model="form.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="ICP备案号">
          <el-input type="text" placeholder="请输入ICP备案号" v-model="form.icp"></el-input>
        </el-form-item>
        <el-form-item label="ICP备案号链接">
          <el-input type="text" placeholder="请输入ICP备案号链接" v-model="form.icpUrl"></el-input>
        </el-form-item>
        <select-news
          :websiteNews="selectNewsList"
          :websiteInformations="selectInfromationsList"
          @getNewsList="getNewsList"
          @getInfromationsList="getInfromationsList"
          v-if="isShowNews"
        />
        <select-service :websiteServices="selectServiceList" @getServiceList="getServiceList" v-if="isShowService" />
        <select-case :websiteCases="selectCaseList" @getCaseList="getCaseList" v-if="isShowCase" />
        <el-form-item>
          <el-button type="primary" @click="handleSubmit()">提交</el-button>
          <el-button @click="isShowPreviewDialog = true">预览</el-button>
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
import ImgInclude from '@/components/CropImgInclue';
import preview from '@/components/ChannelMgmt/components/preview_dialog';
import SelectNews from './components/news';
import SelectService from './components/service';
import SelectCase from './components/case';
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
import Api from '@/api/website/setting';
import { Message } from 'element-ui';

export default {
  components: {
    ImgInclude,
    SelectNews,
    SelectCase,
    SelectService,
    preview,
  },

  watch: {
    areaselected: {
      handler() {
        this.form.province = parseInt(Object.keys(this.areaselected[0])[0]);
        this.form.city = Object.keys(this.areaselected[1])[0];
        this.form.area = Object.keys(this.areaselected[2])[0];
      },
      deep: true,
    },
  },

  computed: {
    isShowNews() {
      return this.form.function.indexOf('2') != -1;
    },
    isShowCase() {
      return this.form.function.indexOf('5') != -1;
    },
    isShowService() {
      return this.form.function.indexOf('3') != -1;
    },
  },

  data() {
    return {
      areaselected: null,
      pcaa: pcaa,
      preview_url: '',
      isShowPreviewDialog: false,
      form: {
        style: '',
        checkedText: '',
        uncheckedText: '',
        name: '',
        logo: '',
        function: [],
        banner: '',
        aboutUs: '',
        aboutUsText: '',
        province: '',
        city: '',
        area: '',
        address: '',
        icp: '',
        icpUrl: '',
        news: '',
        services: '',
        cases: '',
      },
      imgsLogo: {
        ratio1: [],
      },
      imgsBanner: {
        'ratio3.556': [],
      },
      imgsCover: {
        'ratio1.5': [],
      },
      cropper: [
        {
          name: 'LOGO图标',
          ratio_x: 80,
          ratio_y: 80,
          ratio: 1,
          desc: '你的用户将在官网顶部看到此LOGO图标。',
        },
      ],
      cropperBanner: [
        {
          name: 'Banner图片',
          ratio_x: 1920,
          ratio_y: 540,
          ratio: 3.556,
          desc: '你的用户将在官网首页Banner中看到此图片。',
        },
      ],
      cropperCover: [
        {
          name: '关于我们图片',
          ratio_x: 600,
          ratio_y: 400,
          ratio: 1.5,
          desc: '你的用户将在官网首页Banner中看到此图片。',
        },
      ],
      selectNewsList: [],
      selectInfromationsList: [],
      selectServiceList: [],
      selectCaseList: [],
    };
  },

  created() {
    this.loadDetail();
  },

  methods: {
    loadDetail() {
      Api.find({}).then(res => {
        if (res.resCode == 200) {
          const data = res.resObject || {};
          this.form = {
            ...data,
            style: data.style || '#ffffff',
            checkedText: data.checkedText || '#2f5edc',
            uncheckedText: data.uncheckedText || '#6F7380',
            function: data.function ? data.function.split(',') : [],
          };
          this.imgsLogo.ratio1 = data.logo ? data.logo.split(',') : [];
          this.imgsBanner['ratio3.556'] = data.logo ? data.banner.split(',') : [];
          this.imgsCover['ratio1.5'] = data.logo ? data.indexPic.split(',') : [];

          this.selectNewsList = data.websiteNews || [];
          this.selectCaseList = data.websiteCases || [];
          this.selectServiceList = data.websiteServices || [];
          this.selectInfromationsList = data.websiteInformations || [];
        }
      });
    },

    getNewsList(list) {
      this.selectNewsList = list;
    },

    getInfromationsList(list) {
      this.selectInfromationsList = list;
    },

    getServiceList(list) {
      this.selectServiceList = list;
    },

    getCaseList(list) {
      this.selectCaseList = list;
    },

    handlePayload() {
      let payload = {
        ...this.form,
        function: this.form.function.join(','),
        logo: this.imgsLogo.ratio1[0],
        banner: this.imgsBanner['ratio3.556'].join(','),
        indexPic: this.imgsCover['ratio1.5'][0],
        cases: this.selectCaseList
          .map(item => {
            return item.id;
          })
          .join(','),
        services: this.selectServiceList
          .map(item => {
            return item.id;
          })
          .join(','),
        news: this.selectNewsList
          .map(item => {
            return item.id;
          })
          .join(','),
        informations: this.selectInfromationsList
          .map(item => {
            return item.id;
          })
          .join(','),
      };
      return payload;
    },

    handleSubmit() {
      const payload = this.handlePayload();

      let newsList = [...this.selectNewsList, ...this.selectInfromationsList];
      if (!payload.name) {
        this.message('请输入官网名称', 'error');
        return;
      } else if (!payload.logo) {
        this.message('请上传官网LOGO', 'error');
        return;
      } else if (!payload.function) {
        this.message('请选择导航功能', 'error');
        return;
      } else if (!payload.banner) {
        this.message('请上传banner图片', 'error');
        return;
      } else if (!payload.indexPic) {
        this.message('请上传关于我们封面', 'error');
        return;
      } else if (!payload.aboutUsText) {
        this.message('请输入关于我们详情', 'error');
        return;
      } else if (this.isShowNews && newsList.length == 0) {
        this.message('请选择新闻设置', 'error');
        return;
      } else if (this.isShowService && this.selectServiceList.length == 0) {
        this.message('请选择服务介绍', 'error');
        return;
      } else if (this.isShowCase && this.selectCaseList.length == 0) {
        this.message('请选择经典案例', 'error');
        return;
      }

      Api.save(payload).then(res => {
        if (res.resCode == 200) {
          this.message('提交成功', 'success');
          this.loadDetail();
        }
      });
    },

    onChangeShow(show) {
      this.isShowPreviewDialog = show;
    },

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
  padding: 10px 15%;
}

.checked_text {
  display: flex;

  .label {
    color: $font-6;
    padding: 0 10px;
  }
}

.upload-icon-text {
  position: absolute;
  font-size: 14px;
  color: #ccc;
  top: 46px;
  left: -70px;
  line-height: 16px;
}
</style>
