<template>
  <div class="channel_form">
    <el-card class="box-card">
      <el-form :model="channelData"
               :rules="rules"
               ref="channelForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label-width="26px">
          <h4 style="color: #333">展示设置</h4>

          <el-table :data="menuListData" class="menu-list-table" border
                    style="width: 670px;"
                    row-key="id">
            <el-table-column label="栏目类型" align="center" property="typeName" width="150"></el-table-column>
            <el-table-column property="name" align="center" label="栏目名称" width="150"></el-table-column>
            <el-table-column label="排序" align="center" show-overflow-tooltip width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="展示" width="150" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isShow" :width="60"
                           :active-value="1"
                           :inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showUpdateMenuDialogClick(scope.row, scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="channel-text-desc" v-show="menuListData.length>0">提示：可拖动实现排序</div> -->
        </el-form-item>
        <el-dialog width="30%" title="编辑栏目" :visible.sync="isShowNewMenuDialog"
                   class="menu-mgmt-dialog">
          <el-form class="demo-ruleForm">
            <el-form-item label="栏目名称">
              <el-input v-model="menuName"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="isShowNewMenuDialog = false">取 消</el-button>
            <el-button type="primary" @click="updateMenuDataClick">确 定</el-button>
          </div>
        </el-dialog>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm()">提交
          </el-button>
          <el-button @click="preview()">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <preview @change-show="onChangeShow" :is-show-preview-dialog="isShowPreviewDialog" :preview_url="preview_url"></preview>
  </div>
</template>
<script>
  import {isArray} from "@/utils/validate"
  import {saveHuigouChannel} from "@/api/apiPlatformSetting"
  import {info, confirm} from '../../utils/ddHelper'
  import preview from '@/components/ChannelMgmt/components/preview_dialog'
  import channelData from "@/utils/channelData";

  export default {
    name: 'quanzi',
    props: {
      channelData: {
        type: Object,
        default() {
          return {
            active_aggregation_model_name: ''
          }
        }
      }
    },

    data() {
      return {
        rules: {
        },
        isShowNewMenuDialog: false,
        menuName: '',
        menuIndex: '',
        menuListData: [],
        isShowPreviewDialog: false,
        preview_url: '',
        typeMap: {
          1: '门票类',
          2: '客栈类',
          3: '活动类',
          4: '商品类',
        }

      }
    },

    created() {
      this.loadChannelList()
      this.loadChannelInfo()
    },

    methods: {
      loadChannelInfo() {
        this.$ajax
          .get(`/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.huigou.channelType}`, {})
          .then(res => {
            if (res.resObject) {

              this.preview_url = res.resObject.previewUrl
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      loadChannelList() {
        this.$ajax
          .get("/huigou/channel/getHuigouChannelinfo", {})
          .then(res => {
            if (res.resObject) {
              res.resObject.index.forEach((item, index) => {
                res.resObject.index[index].typeName = this.typeMap[item.typeId]
              })
              this.menuListData = res.resObject.index
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      showUpdateMenuDialogClick(row, index) {
        this.isShowNewMenuDialog = true;
        this.menuName = row.name;
        this.menuIndex = index;
      },

      updateMenuDataClick() {
        this.isShowNewMenuDialog = false;
        this.menuListData[this.menuIndex].name = this.menuName
      },

      submitForm() {
        let self = this;
        self.$refs.channelForm.validate((valid) => {
          if (valid) {
            confirm(self, '确定提交吗？', () => {

              // self.menuListData.forEach((channel, index) => {
              //   channel.sort = index + 1;
              // })

              saveHuigouChannel({
                list: self.menuListData
              }).then(_ => {
                info(self, `修改成功`);
                this.loadChannelList()
              })
            })
          } else {
            return false;
          }
        })
      },
      preview() {
        this.isShowPreviewDialog = true
      },

       onChangeShow(show) {
        this.isShowPreviewDialog = show
      },
    },

    components: {
      preview
    }
  }
</script>
