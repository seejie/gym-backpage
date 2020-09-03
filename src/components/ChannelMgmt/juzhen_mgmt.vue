<template>
  <div class="channel_form juzheng-form">
    <el-card class="box-card">
      <el-form :model="channelData" :rules="rules" ref="channelForm" label-width="100px" class="demo-ruleForm">
        <channel-main :channelData="channelData" ref="channelMain"></channel-main>
        <el-form-item label="banner图片" class="upload-icon" ref="channel_banner_upload" prop="banner">
          <img-include v-model="banner_pic" :max="9" :cropper="indexCropper"></img-include>
          <div class="upload-icon-text">尺寸:<br />375*166</div>
        </el-form-item>
        <el-dialog width="450px" title="选择单位" :visible.sync="isShowSelCompanyDialog" class="menu-mgmt-dialog">
          <el-table
            :data="unSelCompanyListData"
            ref="unSelCompanyTable"
            class="unsel-company-list-table"
            border
            style="width: 415px"
            row-key="id"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
            <el-table-column property="column_name" label="单位" align="center" width="150"></el-table-column>
            <el-table-column label="LOGO" width="150" align="center">
              <template slot-scope="scope">
                <img :src="baseUrl + scope.row.logo" />
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="isShowSelCompanyDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveSelCompanyClick">确 定</el-button>
          </div>
        </el-dialog>
        <el-form-item label="矩阵设置" prop="ext">
          <el-button type="primary" @click="showCompanyDialogClick">选择单位</el-button>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-table
            :data="selCompanyListData"
            v-show="selCompanyListData.length > 0"
            class="company-list-table"
            border
            style="width: 400px;"
            row-key="id"
          >
            <el-table-column property="column_name" label="单位" align="center" width="150"></el-table-column>
            <el-table-column label="LOGO" width="150" align="center">
              <template slot-scope="scope">
                <img :src="baseUrl + scope.row.logo" />
              </template>
            </el-table-column>
            <el-table-column width="100" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="cancelShowCompanyClick(scope.row)">取消展示</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="channel-text-desc" v-show="selCompanyListData.length > 0">提示：可拖动实现排序</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交 </el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import channelMain from '@/components/ChannelMgmt/index';
import { saveChannel, getChannelCommonData } from '@/api/apiPlatformSetting';
import { isArray } from '@/utils/validate';
import settings from '../../settings.js';
import sortable from 'sortablejs';
import { info, confirm, warning } from '../../utils/ddHelper';
import ImgInclude from '@/components/CropImgInclue/index.vue';

export default {
  name: 'juzhen',
  props: {
    channelData: {
      type: Object,
    },
  },
  created() {
    setTimeout(() => {
      if (this.channelData) {
        if (this.channelData.banner) {
          let list = this.channelData.banner.split(',');
          this.banner_pic = {
            'ratio2.26': list,
          };
        }
        if (this.channelData.ext) {
          let extData = JSON.parse(this.channelData.ext);
          if (extData && isArray(extData.index)) {
            let self = this;
            extData.index.forEach(company => {
              if (company) {
                if (company.isShow) {
                  self.selCompanyListData.push(company);
                } else {
                  self.unSelCompanyListData.push(company);
                }
              }
            });
          }
        }
      }
    }, 500);
  },
  mounted() {
    let el = document.querySelectorAll('.company-list-table > .el-table__body-wrapper > table > tbody')[0];
    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          //监听拖动结束事件
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.selCompanyListData.splice(evt.oldIndex, 1)[0];
          this.selCompanyListData.splice(evt.newIndex, 0, currRow);
        },
      });
    }
  },
  data() {
    return {
      rules: {
        // channel_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        // //channel_sort: [{required: true, message: '请选择频道展示位置', trigger: 'change'}],
        // channel_title_image: [{required: true, message: '请上传频道ICON', trigger: 'change'}],
        // channel_img_url: [{required: true, message: '请上传分享图片', trigger: 'change'}],
        // share_title: [{required: true, message: '请输入分享标题', trigger: 'blur'}],
        // banner: [{required: true, message: '请上传banner图片', trigger: 'change'}],
        // ext: [{required: true, message: '请选择矩阵'}],
      },
      baseUrl: settings.baseUrl,
      isShowSelCompanyDialog: false,
      selCompanyListData: [],
      unSelCompanyListData: [],
      banner_pic: {
        'ratio2.26': [],
      },
      indexCropper: [
        {
          name: 'banner图片',
          ratio_x: 375,
          ratio_y: 166,
          ratio: 2.26,
          desc: 'banner图片',
        },
      ],
    };
  },
  methods: {
    handlerBannerUploadSuccess(response) {
      if (response && response.resultList && response.resultList.url) {
        this.channelData.banner = response.resultList.url;
        this.$refs.channel_banner_upload.clearValidate();
      }
    },
    handlerRemoveBannerImgUpload() {
      this.channelData.banner = '';
      this.channelData.banner_list = [];
    },
    uploadError(err) {
      console.log(err);
    },
    showCompanyDialogClick() {
      this.isShowSelCompanyDialog = true;
    },
    saveSelCompanyClick() {
      let rows = this.$refs.unSelCompanyTable.selection;
      if (rows.length <= 0) {
        warning(this, '请至少选中一个单位');
        return;
      }
      this.isShowSelCompanyDialog = false;
      let self = this;
      rows.forEach(row => {
        row.isShow = true;
        let companyIdx = self.unSelCompanyListData.findIndex(company => row.id && company.id == row.id);
        if (companyIdx >= 0) {
          self.unSelCompanyListData.splice(companyIdx, 1);
        }
      });
      this.$refs.unSelCompanyTable.clearSelection();
      this.selCompanyListData = this.selCompanyListData.concat(rows);
    },
    cancelShowCompanyClick(row) {
      let self = this;
      confirm(this, '确定取消展示吗？', () => {
        row.isShow = false;
        self.selCompanyListData = self.selCompanyListData.filter(company => company.id != row.id);
        self.unSelCompanyListData.push(row);
      });
    },
    submitForm() {
      let self = this;
      self.channelData.banner = this.banner_pic['ratio2.26'].toString();
      self.$refs.channelForm.validate(valid => {
        if (valid) {
          if (this.selCompanyListData.length <= 0) {
            warning(self, '请至少选择一个单位');
            return;
          }
          confirm(self, '确定提交吗？', () => {
            self.selCompanyListData.forEach((func, index) => {
              func.sort = index + 1;
            });
            self.unSelCompanyListData.forEach((func, index) => {
              func.sort = self.selCompanyListData.length + 1;
            });
            saveChannel({
              banner: self.channelData.banner,
              ext: JSON.stringify({
                list: self.selCompanyListData.concat(self.unSelCompanyListData),
              }),
              ...getChannelCommonData(self.channelData),
            }).then(_ => {
              this.$message.info(`${self.channelData.channel_name}频道修改成功`);
            });
          });
        } else {
          return false;
        }
      });
    },
    preview() {
      this.$refs.channelMain.isShowPreviewDialog = true;
    },
  },
  components: {
    channelMain,
    ImgInclude,
  },
};
</script>
<style lang="scss">
.juzheng-form {
  .zixun_switch {
    margin-left: 16px;
  }
}
</style>
