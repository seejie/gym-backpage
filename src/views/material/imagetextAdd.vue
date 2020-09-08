<template>
  <div class="imgAdd">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <div style="padding-right:20px;">
        <el-form ref="ruleForm" label-width="100px">
          <el-form-item label="图文标题">
            <el-input type="text" placeholder="请输入名称，30字以内" v-model="addData.title"></el-input>
          </el-form-item>
          <el-form-item label="图文摘要">
            <el-input
              type="textarea"
              maxlength="150"
              show-word-limit
              v-model="addData.abstractInfo"
              placeholder="请输入介绍，150字以"
            ></el-input>
          </el-form-item>
          <el-form-item label="正文详情">
            <myEditor v-model="addData.content" from="wechatMaterial"></myEditor>
          </el-form-item>
          <el-form-item label="分组">
            <el-select placeholder="请选择分组" v-model="addData.newsGroupId">
              <el-option v-for="item in groupData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--图片 上传组件 -->
          <el-form-item label="图文封面">
            <img-include material="imagetext" v-model="imgs" :max="1" :cropper="cropper"></img-include>
          </el-form-item>
          <!--音频-->
          <el-form-item label="音频" prop="otherLink">
            <span style="margin-right: 10px" v-if="addData.mediaId">
              {{ mediaId[0].title }}
            </span>
            <el-button @click="showVoicePage = true">
              {{ addData.mediaId ? '重新选择' : '选择音频' }}
            </el-button>
            <el-dialog
              custom-class="imagetextadd"
              title="选择音频"
              :visible.sync="showVoicePage"
              width="80%"
              top="0"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
            >
              <voice-page
                :getId="false"
                :modal="showModal"
                @handleCheckedCitiesChange="handleCheckedCitiesChange"
              ></voice-page>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getMediaId()">
                  保 存
                </el-button>
                <el-button @click="showVoicePage = false">取 消</el-button>
              </div>
            </el-dialog>
          </el-form-item>

          <el-form-item label="三方链接">
            <el-input placeholder="请输入第三方地址" v-model="addData.sourceUrl"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-right: 10px" type="primary" @click="saveBtn()">
              提交
            </el-button>
            <el-button @click="cancelBtn()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapState} from "vuex"
import { Message } from 'element-ui';
import settings from '@/settings';
import VoicePage from './voice';
import ImgInclude from '@/components/CropImgInclue';

export default {
  name: 'imagetextAdd',
  components: {
    VoicePage,
    ImgInclude,
  },
  watch: {
    imgs(n, o) {
      // console.log(n)
      // console.log(o)
    },
  },
  data() {
    return {
      editbtn: false,
      delbtn: false,
      outerVisible: false,
      innerVisible: false,
      checkboxs: '',
      //图片上传
      imgs: {},
      cropper: [
        {
          name: 'Banner封面',
          ratio_x: 280,
          ratio_y: 148,
          ratio: 1.89,
          desc: '你的用户将在资讯频道顶部banner，看到此封面。',
        },
        {
          name: '普通封面',
          ratio_x: 280,
          ratio_y: 183,
          ratio: 1.53,
          desc: '你的用户将在资讯列表里，看到此封面。',
        },
      ],
      //子组件的遮罩层显示
      showModal: false,
      //增加
      addData: {
        title: '',
        abstractInfo: '',
        content: '',
        newsGroupId: null,
        indexPic: '',
        imagePath2: '',
        imagePath3: '',
        mediaId: null,
        sourceUrl: '',
      },
      mediaId: [],
      routerId: null,
      //分组
      groupData: [],
      showVoicePage: false,
    };
  },
  mounted() {},
  computed:{
    ...mapState({
      formRouter: state=> state.imageText.formAddStatus.formRouter,
      fromSelectMaterialAdd: state=> state.imageText.formAddStatus.fromSelectMaterialAdd
    })
  },
  created() {
    this.getNewsGroupList();
    this.routerId = this.$route.params.id;
    if (this.routerId !== -1) {
      this.getNews(this.routerId);
    }
  },
  methods: {
    //判断图片
    imgData() {
      if(!this.imgs['ratio1.53'] || !this.imgs['ratio1.89']) {
        this.addData.indexPic = ''
      } else {
        this.addData.indexPic = `${this.imgs['ratio1.53'][0]},${this.imgs['ratio1.89'][0]}`;
      }
    },
    saveBtn() {
      this.imgData();
      if (this.routerId == -1) {
        this.addNewsBtn();
      } else {
        this.addData.id = this.routerId;
        this.addNewsBtn();
      }
    },
    addNewsBtn() {
      if (this.addData.title == '') {
        this.message('请输入标题', 'error');
      } else if (!this.addData.sourceUrl && this.addData.abstractInfo == '') {
        this.message('请输入摘要', 'error');
      } else if (!this.addData.sourceUrl && this.addData.content == '') {
        this.message('请输入正文', 'error');
      } else if (this.addData.newsGroupId == null) {
        this.message('请选择分组', 'error');
      } else if (this.addData.indexPic == '') {
        this.message('请选择图文封面', 'error');
      } else {
        this.addNews();
      }
    },
    //获取单个素材
    getNews(id) {
      this.$ajax
        .get('/material/materialsNews/find', {
          params: {
            id: id,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.addData = {
              title: res.resObject.title,
              abstractInfo: res.resObject.abstractInfo,
              content: res.resObject.content,
              newsGroupId: res.resObject.newsGroupId,
              imagePath2: res.resObject.imagePath2,
              imagePath3: res.resObject.imagePath3,
              mediaId: res.resObject.mediaId,
              sourceUrl: res.resObject.sourceUrl,
            };
            this.setImgs(res.resObject);
            this.mediaId = [{ id: res.resObject.mediaId, title: res.resObject.mediaId }];
          }
        })
        .catch(err => console.log(err));
    },
    //创建素材
    //修改素材
    addNews() {
      let url;
      if (this.addData.id) {
        url = '/material/materialsNews/update'; // 修改图文
      } else {
        url = '/material/materialsNews/add'; // 添加图文
      }
      this.$ajax
        .post(url, this.addData)
        .then(res => {
          if (res.resCode == 200) {
            if(this.fromSelectMaterialAdd){
              this.$router.push({ name: this.formRouter.name, params: this.formRouter.params });
            }else{
              this.$router.push({ name: 'material/imagetext' });
            }
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    cancelBtn(){
      if(this.fromSelectMaterialAdd){
        this.$router.push({ name: this.formRouter.name, params: this.formRouter.params });
      }else{
        this.$router.push({ name: 'material/imagetext' });
      }
    },
    //关闭音频组件、判断选了几个音频
    getMediaId() {
      if (this.mediaId.length == 0) {
        this.message('请选择音频', 'error');
      } else if (this.mediaId.length > 1) {
        this.message('只能选一个音频', 'error');
      } else {
        this.showVoicePage = false;
        this.addData.mediaId = this.mediaId[0].id;
      }
    },
    //子组件方法
    handleCheckedCitiesChange(val) {
      this.mediaId = val;
    },
    //查询素材分组
    getNewsGroupList() {
      this.$ajax
        .get('/material/materialsNewsGroup/list', {
          params: {},
        })
        .then(res => {
          if (res.resCode == 200) {
            this.groupData = res.resObject;
          }
        })
        .catch(err => console.log(err));
    },
    //设置imgs
    setImgs(obj) {
      if (obj.indexPic) {
        this.imgs = {
          'ratio1.53': [obj.indexPic.split(',')[0]],
          'ratio1.89': [obj.indexPic.split(',')[1]],
        };
      }
    },
    //错误、成功提示
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
.imgAdd {
  @extend %fill;
  padding: 10px 15%;
}

/deep/ .el-form-item .el-form-item {
  margin-bottom: 22px;
}

/deep/ .el-dialog.imagetextadd > .el-dialog__body {
  padding: 0;
}

.avatar-uploader {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}

.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
