<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form :model="form"
               :rules="rules"
               ref="channelForm"
               label-width="120px"
               class="demo-ruleForm">
        <h4 style="color: #333">咨询帮助</h4>
        <el-form-item label="栏目名称" prop="qaTitle">
          <el-col :span="8">
            <el-input v-model="form.qaTitle"
                      placeholder="请输入名称" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="栏目副标题" >
          <el-col :span="8">
            <el-input v-model="form.qaSubTitle"
                      placeholder="请输入副标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="封面图片" prop="qaCoverUrl">
          <el-col :span="8">
            <img-include v-model="imgs"  :cropper="cropper"></img-include>
          </el-col>
        </el-form-item>
        <el-form-item label="咨询链接" prop="qaLinkUrl">
          <el-col :span="8">
            <el-input v-model="form.qaLinkUrl"
                      placeholder="请输入咨询链接" clearable></el-input>
          </el-col>
          <el-col :span="4" style="margin-left: 10px"><el-button type="primary" @click="showdata(1)">选择</el-button></el-col>
        </el-form-item>
        <h4 style="color: #333">集训设定</h4>
        <el-form-item label="栏目名称" prop="trainingTitle">
          <el-col :span="8">
            <el-input v-model="form.trainingTitle"
                      placeholder="请输入名称" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="栏目副标题" prop="trainingSubTitle">
        <el-col :span="8">
          <el-input v-model="form.trainingSubTitle"
                    placeholder="请输入副标题" clearable></el-input>
        </el-col>
      </el-form-item>
        <el-form-item label="位置1标题" prop="trainingP1Title">
          <el-col :span="8">
            <el-input v-model="form.trainingP1Title"
                      placeholder="请输入位置1标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置1副标题" prop="trainingP1SubTitle">
          <el-col :span="8">
            <el-input v-model="form.trainingP1SubTitle"
                      placeholder="请输入位置1副标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置1链接" prop="trainingP1LinkUrl">
          <el-col :span="8">
            <el-input v-model="form.trainingP1LinkUrl"
                      placeholder="请输入位置1链接" clearable></el-input>
          </el-col>
          <el-col :span="4" style="margin-left: 10px"><el-button type="primary" @click="showdata(2)">选择</el-button></el-col>
        </el-form-item>
        <el-form-item label="位置2标题" prop="trainingP2Title">
          <el-col :span="8">
            <el-input v-model="form.trainingP2Title"
                      placeholder="请输入位置2标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置2副标题" prop="trainingP2SubTitle">
          <el-col :span="8">
            <el-input v-model="form.trainingP2SubTitle"
                      placeholder="请输入位置2副标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置2链接" prop="trainingP2LinkUrl">
          <el-col :span="8">
            <el-input v-model="form.trainingP2LinkUrl"
                      placeholder="请输入位置2链接" clearable></el-input>
          </el-col>
          <el-col :span="4" style="margin-left: 10px"><el-button type="primary" @click="showdata(3)">选择</el-button></el-col>
        </el-form-item>
        <h4 style="color: #333">名师设定</h4>
        <el-form-item label="栏目名称" prop="teacherTitle">
          <el-col :span="8">
            <el-input v-model="form.teacherTitle"
                      placeholder="请输入名称" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="栏目副标题" prop="teacherSubTitle">
          <el-col :span="8">
            <el-input v-model="form.teacherSubTitle"
                      placeholder="请输入副标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置1标题" prop="teacherP1Title">
          <el-col :span="8">
            <el-input v-model="form.teacherP1Title"
                      placeholder="请输入位置1标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置1副标题" prop="teacherP1SubTitle">
          <el-col :span="8">
            <el-input v-model="form.teacherP1SubTitle"
                      placeholder="请输入位置1副标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置1链接" prop="teacherP1LinkUrl">
          <el-col :span="8">
            <el-input v-model="form.teacherP1LinkUrl"
                      placeholder="请输入位置1链接" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置2标题" prop="teacherP2Title">
          <el-col :span="8">
            <el-input v-model="form.teacherP2Title"
                      placeholder="请输入位置2标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置2副标题" prop="teacherP2SubTitle">
          <el-col :span="8">
            <el-input v-model="form.teacherP2SubTitle"
                      placeholder="请输入位置2副标题" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="位置2链接" prop="teacherP2LinkUrl">
          <el-col :span="8">
            <el-input v-model="form.teacherP2LinkUrl"
                      placeholder="请输入位置2链接" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="submitForm()">提交
          </el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <preview @change-show="onChangeShow" :is-show-preview-dialog="isShowPreviewDialog" :preview_url="preview_url"></preview>
    <el-dialog class="showdata" :visible.sync="tandata.isshow" title="选择数据" >
      <el-row class="box-card" v-if="tandata.type>1">
        <el-tabs v-model="active" @tab-click="handleClick">
          <el-tab-pane label="长期集训" name="first">
            <odialog v-if="trainingType==1" :type="tandata.type" @commit="commit" :trainingType="1"  />
          </el-tab-pane>
          <el-tab-pane label="短期集训" name="secound">
            <odialog v-if="trainingType==0" :type="tandata.type" @commit="commit" :trainingType="0" />
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <el-row v-else>
        <odialog v-if="tandata.type==1" @commit="commit" :type="tandata.type"></odialog>
      </el-row>

    </el-dialog>
  </div>
</template>
<script>
import { PageSetup } from '@/api/customCourse/customCourse'
import { info, confirm } from '@/utils/ddHelper'
import preview from '@/components/ChannelMgmt/components/preview_dialog'
import channelData from '@/utils/channelData'
import ImgInclude from '@/components/CropImgInclue/index.vue'

import odialog from './odialog'
export default {
  name: 'quanzi',
  props: {
    channelData: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        qaTitle: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        qaCoverUrl: [{ required: true, message: '请上传封面图片', trigger: 'blur' }],
        qaLinkUrl: [{ required: true, message: '请输入咨询链接', trigger: 'blur' }],
        trainingTitle: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        trainingSubTitle: [{ required: true, message: '请输入栏目副标题', trigger: 'blur' }],
        trainingP1Title: [{ required: true, message: '请输入位置1标题', trigger: 'blur' }],
        trainingP1SubTitle: [{ required: true, message: '请输入位置1副标题', trigger: 'blur' }],
        trainingP1LinkUrl: [{ required: true, message: '请输入位置1链接', trigger: 'blur' }],
        trainingP2Title: [{ required: true, message: '请输入位置2标题', trigger: 'blur' }],
        trainingP2SubTitle: [{ required: true, message: '请输入位置2副标题', trigger: 'blur' }],
        trainingP2LinkUrl: [{ required: true, message: '请输入位置2链接', trigger: 'blur' }],
        // 名师设定
        teacherTitle: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        teacherSubTitle: [{ required: true, message: '请输入栏目副标题', trigger: 'blur' }],
        teacherP1Title: [{ required: true, message: '请输入位置1标题', trigger: 'blur' }],
        teacherP1SubTitle: [{ required: true, message: '请输入位置1副标题', trigger: 'blur' }],
        teacherP1LinkUrl: [{ required: true, message: '请输入位置1链接', trigger: 'blur' }],
        teacherP2Title: [{ required: true, message: '请输入位置2标题', trigger: 'blur' }],
        teacherP2SubTitle: [{ required: true, message: '请输入位置2副标题', trigger: 'blur' }],
        teacherP2LinkUrl: [{ required: true, message: '请输入位置2链接', trigger: 'blur' }]
      },

      form: {
        // 咨询帮助
        qaTitle: '',
        qaSubTitle: '',
        qaCoverUrl: '',
        qaLinkUrl: '',
        // 集训设定
        trainingTitle: '',
        trainingSubTitle: '',
        trainingP1Title: '',
        trainingP1SubTitle: '',
        trainingP1LinkUrl: '',
        trainingP2Title: '',
        trainingP2SubTitle: '',
        trainingP2LinkUrl: '',
        // 名师设定
        teacherTitle: '',
        teacherSubTitle: '',
        teacherP1Title: '',
        teacherP1SubTitle: '',
        teacherP1LinkUrl: '/customcourse/applyteacher',
        teacherP2Title: '',
        teacherP2SubTitle: '',
        teacherP2LinkUrl: '/customcourse/customteacher'
      },
      imgs: {},
      pageSetting: {},
      preview_url: '',
      isShowPreviewDialog: false,
      cropper: [{
        name: '封面',
        ratio_x: 245.3,
        ratio_y: 175.4,
        ratio: 1.89,
        desc: ''
      }],
      trainingType: 1,
      active: 'first',
      tandata: {
        isshow: false,
        type: 1
      }
    }
  },

  created() {
    this.getPageSetting()
    this.loadChannelInfo()
  },

  methods: {
    getPageSetting() {
      PageSetup.load()
        .then(res => {
          if (res.resObject) {
            this.pageSetting = res.resObject.list[0]

            const {
              // 咨询帮助
              qaTitle,
              qaSubTitle,
              qaCoverUrl,
              qaLinkUrl,
              // 集训设定
              trainingTitle,
              trainingSubTitle,
              trainingP1Title,
              trainingP1SubTitle,
              trainingP1LinkUrl,
              trainingP2Title,
              trainingP2SubTitle,
              trainingP2LinkUrl,
              // 名师设定
              teacherTitle,
              teacherSubTitle,
              teacherP1Title,
              teacherP1SubTitle,
              teacherP1LinkUrl,
              teacherP2Title,
              teacherP2SubTitle,
              teacherP2LinkUrl,
            } = this.pageSetting;

            this.form = {
              // 咨询帮助
              qaTitle,
              qaSubTitle,
              qaCoverUrl,
              qaLinkUrl,
              // 集训设定
              trainingTitle,
              trainingSubTitle,
              trainingP1Title,
              trainingP1SubTitle,
              trainingP1LinkUrl,
              trainingP2Title,
              trainingP2SubTitle,
              trainingP2LinkUrl,
              // 名师设定
              teacherTitle,
              teacherSubTitle,
              teacherP1Title,
              teacherP1SubTitle,
              teacherP1LinkUrl,
              teacherP2Title,
              teacherP2SubTitle,
              teacherP2LinkUrl,
            }
            this.imgs = { 'ratio1.89': [this.pageSetting.qaCoverUrl] }
            this.form.qaCoverUrl = this.imgs['ratio1.89'][0]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    loadChannelInfo() {
      this.$ajax
        .get(`/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.customcourse.channelType}`, {})
        .then(res => {
          if (res.resObject) {
            this.preview_url = res.resObject.previewUrl
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    submitForm() {
      const self = this
      this.form.qaCoverUrl = this.imgs != null && this.imgs['ratio1.89'] != null ? this.imgs['ratio1.89'][0] : ''
      self.$refs.channelForm.validate((valid) => {
        if (valid) {
          confirm(self, '确定提交吗？', () => {
            // this.form.unitId = 4
            if (this.pageSetting && this.pageSetting.id) {
              PageSetup.update({
                ...this.form,
                id: this.pageSetting.id
              }).then(_ => {
                info(this, '提交成功')
              })
            } else {
              PageSetup.add({
                ...this.form
              }).then(_ => {
                info(this, '提交成功')
              })
            }
          })
        } else {
          return false
        }
      })
    },
    preview() {
      this.isShowPreviewDialog = true
    },
    onChangeShow(show) {
      this.isShowPreviewDialog = show
    },
    handleStudentSelectionChange(val) {
      if (val.length > 0) {
        for (var i = 0; i < val.length; i++) {
          this.data.ids.push(val[i].trainingRecordId)
        }
      }
    },
    handleClick(tab, event) {
      this.trainingType = tab.name == 'first' ? 1 : 0;
    },
    showdata(type) {
      this.tandata.isshow = true;
      this.tandata.type = type;
    },
    commit(curlink, id) {
      this.tandata.isshow = false;
      if (curlink != null) {
        switch (this.tandata.type) {
          case 1:
            this.form.qaLinkUrl = curlink + '/customcourse/coursequestionaire/' + id;
            break;
          case 2:
            this.form.trainingP1LinkUrl = curlink + '/customcourse/training/' + id;
            break;
          case 3:
            this.form.trainingP2LinkUrl = curlink + '/customcourse/training/' + id;
            break;
        }
      }
    }
  },
  components: {
    preview,
    ImgInclude,
    odialog
  }
}
</script>
<style scoped lang="scss">

</style>
