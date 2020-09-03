<template>
  <div class="editor-wrap">
    <div :id="refs"></div>
    <el-dialog title="创建素材" class="xqn" :visible.sync="dialogVisible" width="850px">
      <ImgSelect :visible="dialogVisible" @upload="upload" v-model="selectedImg"></ImgSelect>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="创建素材" class="xqn" :visible.sync="createVisible" width="450px">
      <img-upload :visible="createVisible" v-model="form"></img-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMaterial">保存</el-button>
        <el-button @click="createVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="imagetextadd"
      title="选择音频"
      :visible.sync="voiceModal"
      width="80%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <voice-page :getId="false" :modal="showModal" @handleCheckedCitiesChange="handleCheckedCitiesChange"></voice-page>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveVoiceData()">保 存</el-button>
        <el-button @click="voiceModal = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="imagetextadd"
      title="选择视频"
      :visible.sync="videoModal"
      width="80%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <video-page :getId="false" :modal="showModal" @handleCheckedCitiesChange="handleCheckedCitiesChange"></video-page>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveVideoData()">保 存</el-button>
        <el-button @click="videoModal = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
var E = require('wangeditor');
const menus = [
  //  'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    // 'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    // 'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'emoticon',  // 表情
    'image',  // 插入图片
    'code',  // 插入代码
    'video',  // 插入视频
    'table',  // 表格
    'undo',  // 撤销
    'redo'  // 重复
]
import ImgSelect from '../CropImgInclue/Select.vue';
import ImgUpload from '../CropImgInclue/Upload.vue';
import VideoPage from '../../views/material/video';
import VoicePage from '../../views/material/voice';
import { addImage, cropper } from '@/api/material';

export default {
  name: 'editor',
  props: {
    value: {
      default: '',
    },
    refs: {
      default: 'editor',
    },
  },
  data() {
    return {
      showModal: false,
      videoModal: false,
      voiceModal: false,
      videoData: [],
      //
      dialogVisible: false,
      createVisible: false,
      selectedImg: {},
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      form: {
        title: '',
        path: '',
        image_group_id: 0,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editor = new E(`#${this.refs}`);
      this.editor.customConfig.zIndex = 0;
      this.editor.customConfig.pasteFilterStyle = false
      // this.editor.customConfig.onblur = (html) => { // 获取内容
      //   this.$emit("input", html);
      // }
      this.editor.customConfig.onchange = html => {
        // 获取内容
        console.log(html);
        this.$emit('input', html);
      };

      this.editor.customConfig.menus = menus;
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
      this.editor.customConfig.uploadImgMaxLength = 5

      this.editor.create();
      // this.editor.txt.html(this.value);
      this.editor.menus.menus.image.onClick = this.imgClick; //重写图片上传按钮
      this.editor.menus.menus.video.onClick = this.videoClick; //重写视频上传按钮
      this.editor.menus.menus.code.onClick = this.voiceClick; //重写视频上传按钮
    },
    saveVideoData() {
      if (this.videoData.length == 0) {
        this.$message.error('请选择视频');
        // } else if(this.videoData.length>1){
        //   this.$message.error('请选择一个视频');
      } else {
        for (let i = 0; i < this.videoData.length; i++) {
          this.editor.cmd.do('insertHTML', `<video controls loop="false" x-webkit-airplay="true" playsinline webkit-playsinline="true" x5-video-player-type="h5"><source src='${this.videoData[i]}'></video>`);
        }
        this.videoModal = false;
      }
    },
    saveVoiceData() {
      if (this.videoData.length == 0) {
        this.$message.error('请选择音频');
      } else {
        for (let i = 0; i < this.videoData.length; i++) {
          this.editor.cmd.do('insertHTML', `<audio controls loop="false"><source src='${this.videoData[i]}'></audio>`);
        }
        this.voiceModal = false;
      }
    },
    handleCheckedCitiesChange(val) {
      this.videoData = val;
    },
    //上传视频
    videoClick() {
      this.videoData = [];
      this.videoModal = true;
    },
    voiceClick() {
      this.videoData = [];
      this.voiceModal = true;
    },
    //上传图片按钮点击
    imgClick(...args) {
      console.log('args: ', args);
      this.dialogVisible = true;
    },
    upload() {
      this.createVisible = true;
    },
    saveMaterial() {
      addImage(this.form).then(res => {
        this.$message.success('创建成功');
        this.createVisible = false;
      });
    },
    submit() {
      // console.log(`<img src='${this.selectedImg.path}'></img>`)
      this.editor.cmd.do('insertHTML',`<img src='${this.selectedImg.path}'></img>`)
      // this.editor.txt.append(`<img src='${this.selectedImg.path}'></img>`);
      // console.log(this.editor.txt.html())
      this.dialogVisible = false;
      this.editor.change();
    },
  },
  watch: {
    value: {
      handler(val) {
        this.$nextTick(() => {
          this.editor.txt.html(val);
        })
      },
      immediate: true
    },
  },
  components: {
    ImgSelect,
    ImgUpload,
    VideoPage,
    VoicePage
  },
};
</script>

<style lang="scss" scoped>
.editor-wrap {
  width: 100%;
  height: 100%;
  #editor {
    min-height: 300px;
  }
}
/deep/ .el-dialog.imagetextadd > .el-dialog__body {
  padding: 0;
}
/deep/ video,
/deep/ img{
  max-width: 100%;
}
/deep/ .w-e-icon-terminal:before {
    content: "\e9c6";
}
</style>
