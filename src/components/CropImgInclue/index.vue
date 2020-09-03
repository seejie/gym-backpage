<template>
  <div>
    <img-include
      @selected="includeImg"
      :urls="urls"
      :max="max"
      :size="width"
      :ratio="cut[0].ratio"
      :hasTitle="hasTitle"
      @delete="deleteImg"
      :titleArray="titleArray"
      :placeholder="placeholder"
      @titleChange="bindTitleChange"
    />
    <el-dialog
      title="选择图片"
      :modal="modal"
      class="xqn"
      :visible.sync="dialogVisible"
      width="860px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-steps :active="activeStep" simple style="width: 30%; min-width: 500px;" class="xqn">
        <el-step title="选择素材"></el-step>
        <el-step title="裁剪图片"></el-step>
      </el-steps>
      <img-select v-model="selectedImg" v-if="activeStep === 1" :dialogVisible="dialogVisible"></img-select>
      <div v-if="activeStep === 2">
        <!-- <img-cut v-if="cut[0].ratio" :img="selectedImg.path" v-model="cut"></img-cut> -->
        <!-- <cut-img v-else :img="selectedImg.path" v-model="cut"></cut-img> -->
        <cut-img :img="selectedImg.path" v-model="cut"></cut-img>
      </div>
      <div slot="footer" class="dialog-footer" v-if="activeStep === 1">
        <el-button type="primary" @click="activeStepTwo" v-if="selectedImg && selectedImg.path">下一步</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-if="activeStep === 2">
        <el-button @click="activeStep = 1">上一步</el-button>
        <el-button type="primary" @click="submit">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ImgInclude from './Include';
import ImgSelect from './Select';
import ImgUpload from './Upload';
// import ImgCut from './Cut'
import CutImg from './CutImg';
import { addImage, cropper } from '@/api/material';
import upload from '@/utils/upload';
import compressUploadImg from '@/utils/compressUploadImg';
import { mapMutations } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    max: {
      type: Number,
      validator(value) {
        return value > 0 && value % 1 === 0;
      },
    },
    cropper: {
      type: Array,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    titleArray: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: '请输入～',
    },
    material: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  computed: {
    urls() {
      var keys = Object.keys(this.imgs);
      if (keys.length) {
        return this.imgs[keys[0]];
      }

      return [];
    },
  },
  watch: {
    imgs: {
      handler() {
        // var keys = Object.keys(this.imgs);
        // if (keys.length) {
        //     this.urls = this.imgs[keys[0]];
        // } else {
        //     this.urls = []
        // }

        this.$emit('input', this.imgs);
      },
      deep: true,
    },
    value: {
      handler() {
        this.imgs = this.getImgs();
      },
      deep: true,
    },

    selectedImg(val) {
      console.log('========');
      console.log(val);
    },
  },
  components: {
    ImgSelect,
    ImgUpload,
    // ImgCut,
    ImgInclude,
    CutImg,
  },
  data() {
    return {
      activeIndex: 0, // 入口处当前选的是第几张图片
      imgs: this.getImgs(),
      activeStep: 1,
      dialogVisible: false,
      selectedImg: {},
      cut: this.cropper,
      // urls: []
    };
  },
  methods: {
    ...mapMutations('app', ['SET_IMAGE_GROUP']),
    bindTitleChange(vals) {
      this.$emit('titleChange', vals);
    },
    getImgs() {
      if (!Object.keys(this.value).length) {
        var o = {};
        this.cropper.map(c => {
          o['ratio' + c.ratio] = [];
        });
        return o;
      } else {
        return this.value;
      }
    },
    clear() {
      this.activeStep = 1;
      this.createVisible = false;
      (this.form = {
        title: '',
        path: '',
        image_group_id: 0,
      }),
        (this.selectedImg = {});
      this.cut = this.cropper;
    },
    //素材配置
    getPagesetting(){
      return this.$ajax
        .get('/material/pageSetting/getDefaultSetting', {})
        .then(res => {
          if (res.resCode == 200) {
            let status = false;
            res.resObject.forEach(element => {
                if(element.moduleName=='图文素材'&&element.isShow==0){
                  status= true
                }
            });
            return status
          } else {
            Message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    async activeStepTwo(){
      const setTing = await this.getPagesetting()
      if(this.material=="imagetext" && setTing){
        Message.warning('没有图文素材权限，请联系管理员！');
        return false
      }

      this.activeStep = 2
    },
    submit() {
      this.SET_IMAGE_GROUP(null)
      this.dialogVisible = false;
      const $loading = this.$loading('努力上传中...');
      var parr = this.cropper.map(cut => {
        return new Promise((resolve, reject) => {

          let fileSuffix = '.jpeg';
          compressUploadImg(null, cut.cut.toDataURL('image/jpeg')).then(res => {
            cut.cut.toBlob(blob => {
              upload(blob, fileSuffix).then(url => {
                resolve({
                  ratio: cut.ratio,
                  url: url,
                });
              });
            });
          })
        });
      });
      Promise.all(parr)
        .then(urls => {
          // if(urls && urls.length == 1) {
          //   this.imgs = {
          //      [`ratio${urls[0].ratio}`]: [urls[0].url]
          //   }
          //   this.$emit('input',this.imgs)
          // }
          urls.map(res => {
            // this.imgs['ratio' + res.ratio] = this.imgs['ratio' + res.ratio] || [];
            this.imgs['ratio' + res.ratio].splice(this.activeIndex, 1, res.url);

            $loading.close();
          });
        })
        .catch(() => {
          $loading.close();
        });
    },
    includeImg(index) {
      this.activeIndex = index;
      this.clear();
      this.dialogVisible = !this.dialogVisible;
    },
    deleteImg(index) {
      var keys = Object.keys(this.imgs);
      keys.map(key => {
        this.imgs[key].splice(index, 1);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-steps.xqn {
  background-color: #fff;
}
</style>
