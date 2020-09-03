<template>
  <div>
    <!--左边-->
    <div class="managePage">
      <!-- 表单 -->
      <div class="from-wrap">
        <div class="title">
          全部音频
          <span>（{{ totalCount }}）</span>
        </div>
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item prop="title" label="搜索标题">
            <el-input type="text" v-model="searchData.name" placeholder="搜索标题"></el-input>
          </el-form-item>
          <el-form-item prop="company" label="发布单位">
            <el-select placeholder="发布单位" v-model="searchData.unitId">
              <el-option
                v-for="item in unitListData"
                :key="item.id"
                :label="item.unitName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getVoiceList">搜索</el-button>
            <el-button @click="initSearchData()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 图片 -->
      <el-card shadow="never" class="card">
        <!--全选、添加等操作按钮-->
        <div slot="header" v-if="modal">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-button type="primary" style="margin-left: 10px;" @click="addVoiceModal = true">
            添加素材
          </el-button>
          <el-button @click="moveVoiceGroupModal = true">
            移动分组
          </el-button>
        </div>
        <!--移动分组-->
        <el-dialog
          title="移动分组"
          :visible.sync="moveVoiceGroupModal"
          width="30%"
          :modal="modal"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-form ref="ruleForm" label-width="80px">
            <el-form-item label="分类" prop="mainTitle">
              <el-select placeholder="请选择分组" v-model="removeGroupId">
                <el-option v-for="item in groupData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="moveVoiceGroupBtn()">
              保 存
            </el-button>
            <el-button @click="moveVoiceGroupModal = false">
              取 消
            </el-button>
          </div>
        </el-dialog>
        <!--添加素材modal-->
        <el-dialog
          title="添加音频"
          :visible.sync="addVoiceModal"
          width="30%"
          :modal="modal"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-form ref="ruleForm" label-width="80px">
            <el-form-item label="名称" prop="mainTitle">
              <el-input type="text" placeholder="请填写音频名称，30字以内" v-model="addVoiceData.title"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="mainTitle">
              <el-select placeholder="请选择分组" v-model="addVoiceData.voiceGroupId">
                <el-option v-for="item in groupData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面">
              <!-- <YPImgUpload :imagePath.sync="addVoiceData.imagePath"></YPImgUpload> -->
              <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
            </el-form-item>
            <!--音频-->
            <el-form-item label="本地上传">
              <uploadFile material="voice" @input="getVoice" accept="audio/*" :fileList="[]"></uploadFile>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addVoiceBtn()">
              保 存
            </el-button>
            <el-button @click="addVoiceModal = false">取 消</el-button>
          </div>
        </el-dialog>
        <el-row :gutter="0" v-loading="loading">
          <!-- begin 素材列表 -->
          <el-col :span="20">
            <div>
              <!--图片-->
              <div class="img-box">
                <div class="img-item" v-for="(item, index) in getVoiceData" :key="index">
                  <aplayer mini :music="{ src: item.voicePath, pic: item.imagePath }" />
                  <div style="margin: 10px 0 10px 8px; overflow: hidden; line-height: initial;">
                    <el-checkbox-group v-model="ids" @change="handleCheckedCitiesChange">
                      <el-checkbox v-if="getId" :label="item.id">
                        {{ item.title }}
                      </el-checkbox>
                      <el-checkbox v-if="!getId" :label="item">
                        {{ item.title }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>

                  <div class="img-btn">
                    <!--下载-->
                    <a :href="item.voicePath" target="_blank">
                      <i class="el-icon-download"></i>
                    </a>
                    <!--编辑-->
                    <el-popover placement="bottom" width="300" trigger="manual" v-model="editModal[index]">
                      <p style="margin-bottom: 5px;">名称</p>
                      <el-input type="text" v-model="editVoiceData.title"></el-input>
                      <p style="margin-bottom: 5px;">分组</p>
                      <el-select placeholder="请选择分组" v-model="editVoiceData.voiceGroupId">
                        <el-option
                          v-for="item in groupData"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                      <p style="margin-bottom: 5px;">封面</p>
                      <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
                      <!-- <YPImgUpload :imagePath.sync="editVoiceData.imagePath"></YPImgUpload> -->
                      <div style="text-align: right; margin-top: 14px;">
                        <el-button type="primary" size="mini" @click="editVoiceBtn2(index)">
                          保存
                        </el-button>
                        <el-button size="mini" @click="openCloseEditVoiceModal(index)">
                          取消
                        </el-button>
                      </div>
                      <i class="el-icon-edit" slot="reference" @click="editVoiceBtn(item, index)"></i>
                    </el-popover>
                    <!--删除-->
                    <el-popover placement="bottom" width="250" trigger="manual" v-model="delModal[index]">
                      <p>确定删除此图片素材吗？</p>
                      <div style="text-align: right; margin: 0;">
                        <el-button type="primary" size="mini" @click="delVoice(item, index)">
                          确定
                        </el-button>
                        <el-button size="mini" @click="openCloseDelVoiceModal(index)">
                          取消
                        </el-button>
                      </div>
                      <i class="el-icon-delete" slot="reference" @click="openCloseDelVoiceModal(index)"></i>
                    </el-popover>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <div style="text-align: right;">
                <Pagination
                  v-if="getVoiceData.length != 0"
                  :pageSize="pageSize"
                  :pageSizes="pageSizes"
                  :total="totalCount"
                  @currentChange="currentChange"
                  @sizeChange="sizeChange"
                ></Pagination>
              </div>
            </div>
          </el-col>
          <!-- begin 素材列表 -->

          <!-- begin 素材分组 -->
          <el-col :span="4" :offset="getVoiceData.length == 0 ? 20 : 0">
            <div class="managePage managePageGroup">
              <div class="from-wrap">
                <div class="title" @click="getGroupId(null)">
                  全部分组
                  <span>（{{ allCount }}）</span>
                </div>
              </div>
              <el-card shadow="never" class="card">
                <div class="text-item" v-for="(item, index) in groupData" :key="index">
                  <span :class="{ active: groupId == item.id }" @click="getGroupId(item.id)">
                    {{ item.name }}{{ `（${item.count || '0'}）` }}
                  </span>
                  <i style="margin-right: 10px;" class="el-icon-edit" @click="editGroupBtn(item)"></i>
                  <i class="el-icon-delete" @click="delGroupBtn(item)"></i>
                </div>
                <div class="text-item" @click="addFenzu = true">+ 新建分组</div>
              </el-card>
              <!--新建分组modal-->
              <el-dialog
                title="新建分组"
                :visible.sync="addFenzu"
                width="30%"
                :modal="modal"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
              >
                <el-form ref="ruleForm" label-width="80px">
                  <el-form-item label="分组名称">
                    <el-input type="text" placeholder="请输入分组名称，6字以内" v-model="addGroupName"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addGroupBtn()">保 存</el-button>
                  <el-button @click="addFenzu = false">取 消</el-button>
                </div>
              </el-dialog>
              <!--编辑分组modal-->
              <el-dialog
                title="编辑分组"
                :visible.sync="editFenzu"
                width="30%"
                :modal="modal"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
              >
                <el-form ref="ruleForm" label-width="80px">
                  <el-form-item label="分组名称">
                    <el-input type="text" placeholder="请输入分组名称，6字以内" v-model="editGroup.name"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="editGroupBtn2()">
                    保 存
                  </el-button>
                  <el-button @click="editFenzu = false">取 消</el-button>
                </div>
              </el-dialog>
              <!--删除分组modal-->
              <el-dialog
                title="编辑分组"
                :visible.sync="delFenzu"
                width="30%"
                :modal="modal"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
              >
                <p>确定删除该分组 [ {{ delGroup.name }} ] 吗？</p>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="delGroupBtn2()">
                    确 定
                  </el-button>
                  <el-button @click="delFenzu = false">取 消</el-button>
                </div>
              </el-dialog>
            </div>
          </el-col>
          <!-- end 素材分组 -->
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '../../components/Pagination';
import YPImgUpload from '../../components/NoCropperInclude';
import settings from '@/settings';
import Aplayer from 'vue-aplayer';
import { getToken } from '@/utils/auth'; // get token from cookie
import { getUserToken } from '@/utils/storage';
import deleteEmptyParams from '@/utils/deleteEmptyParams';
import uploadFile from '@/components/UploadFile';
import ImgInclude from '@/components/CropImgInclue';
import { listSelfAndChildren } from '@/api/sass/unit';

export default {
  name: 'voice',
  props: {
    //弹窗组件是否显示遮罩层
    modal: {
      type: Boolean,
      default: true,
    },
    getId: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Pagination,
    YPImgUpload,
    Aplayer,
    uploadFile,
    ImgInclude,
  },
  data() {
    return {
      downloadURL: settings.baseUrl + '/material/downloadVoice?ids=',
      token: '&token=' + getUserToken(),
      loading: false,
      delFenzu: false,
      editFenzu: false,
      addFenzu: false,
      allCount: '',
      //分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      //分组
      groupData: [],
      groupcount: 0,
      addGroupName: '',
      editGroup: {
        name: '',
        id: null,
      },
      delGroup: {
        name: '',
        id: null,
      },
      //音频素材
      addVoiceModal: false,
      addVoiceData: {
        title: '',
        voiceGroupId: '',
        imagePath: '',
        voicePath: '',
        voiceSize: '',
        voiceTimeLength: '',
      },
      getVoiceData: [],
      editVoiceData: {},
      //查询
      groupId: null,
      searchData: {
        name: '',
        unitId: null,
      },
      //移动
      ids: [],
      allIds: [],
      removeGroupId: '',
      moveVoiceGroupModal: false,
      checkAll: false,
      isIndeterminate: false,
      //
      delModal: [],
      editModal: [],

      //图片上传
      imgs: {
        ratio1: [],
      },
      cropper: [
        {
          name: '封面',
          ratio_x: 100,
          ratio_y: 100,
          ratio: 1,
          desc: '',
        },
      ],
      unitListData: [], // 单位列表
    };
  },
  created() {
    this.pageSize = this.pageSizes[2];
    this.getVoiceGroupList();
    this.getVoiceList();
    this.unitList();
  },
  methods: {
    //全选
    handleCheckAllChange(val) {
      this.ids = val ? this.allIds : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.$emit('handleCheckedCitiesChange', value);
      if (this.getId) {
        this.ids = value;
        this.isIndeterminate = this.ids.length > 0;
      }
    },
    //重置查询数据
    initSearchData() {
      this.searchData = {
        name: '',
        unitId: null,
      };
    },
    //分页
    currentChange(val) {
      this.curPage = val;
      this.getVoiceList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getVoiceList();
    },

    //删除素材
    delVoice(item, index) {
      this.$ajax
        .post('/material/materialsVoice/delete', { id: item.id })
        .then(res => {
          if (res.resCode == 200) {
            this.message('删除素材成功', 'success');
            this.getVoiceList();
            this.openCloseDelVoiceModal(index);
          }
        })
        .catch(err => console.log(err));
    },
    openCloseDelVoiceModal(index) {
      this.$set(this.delModal, index, !this.delModal[index]);
    },
    openCloseEditVoiceModal(index) {
      this.$set(this.editModal, index, !this.editModal[index]);
    },
    //查询音频素材
    getVoiceList() {
      let payload = {
        voiceGroupId: this.groupId,
        title: this.searchData.name,
        unitId: this.searchData.unitId ? this.searchData.unitId : 0,
        pageNum: this.curPage,
        pageSize: this.pageSize,
      };
      this.loading = true;
      this.$ajax
        .get('/material/materialsVoice/listPage', {
          params: deleteEmptyParams(payload),
        })
        .then(res => {
          if (res.resCode == 200) {
            this.totalCount = res.resObject.totalCount;
            this.allCount = res.resObject.allCount;
            this.getVoiceData = res.resObject.list;
            for (let n in this.getVoiceData) {
              this.allIds.push(this.getVoiceData[n].id);
              this.delModal.push(false);
              this.editModal.push(false);
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //创建音频素材、修改素材
    //修改素材接口 多个参数 id
    //0 add,1 edit
    addVoice(type, index) {
      let postData;
      let url;
      if (type == 1) {
        postData = {
          ...this.editVoiceData,
          imagePath: this.imgs.ratio1[0],
        };
        url = '/material/materialsVoice/update'; // 修改语音
      } else {
        postData = {
          ...this.addVoiceData,
          imagePath: this.imgs.ratio1[0],
        };
        url = '/material/materialsVoice/add'; // 添加语音
      }
      this.$ajax
        .post(url, postData)
        .then(res => {
          if (res.resCode == 200) {
            this.addVoiceModal = false;
            this.message('成功', 'success');
            this.getVoiceList();
            if (type != 1) {
              this.$refs.upload2.clearFiles(); //清空列表
              this.addVoiceData = {
                title: '',
                voiceGroupId: '',
                imagePath: '',
                voicePath: '',
                voiceSize: '',
                voiceTimeLength: '',
              };
            } else {
              this.openCloseEditVoiceModal(index);
            }
          }
        })
        .catch(err => console.log(err));
    },
    addVoiceBtn() {
      if (this.addVoiceData.title.length == '') {
        this.message('请输入音频名称', 'error');
      } else if (this.addVoiceData.title.length > 30) {
        this.message('请输入30字以内的音频名称', 'error');
      } else if (this.addVoiceData.voiceGroupId == null) {
        this.message('请选择分组', 'error');
      } else if (!this.imgs.ratio1.length) {
        this.message('请上传封面', 'error');
      } else if (this.addVoiceData.voicePath == '') {
        this.message('请上传音频', 'error');
      } else {
        this.addVoice();
      }
    },
    //编辑素材
    editVoiceBtn(item, index) {
      this.openCloseEditVoiceModal(index);
      this.editVoiceData = {
        id: item.id,
        title: item.title,
        voiceGroupId: item.voiceGroupId,
        imagePath: item.imagePath,
        voicePath: item.voicePath,
        voiceSize: item.voiceSize,
        voiceTimeLength: item.voiceTimeLength,
      };

      this.imgs = {
        ratio1: [item.imagePath],
      };
    },
    editVoiceBtn2(index) {
      if (this.editVoiceData.title.length == '') {
        this.message('请输入音频名称', 'error');
      } else if (this.editVoiceData.title.length > 30) {
        this.message('请输入30字以内的音频名称', 'error');
      } else if (this.editVoiceData.voiceGroupId == null) {
        this.message('请选择分组', 'error');
      } else {
        this.addVoice(1, index);
      }
    },
    //根据分组获取音频
    getGroupId(id) {
      this.groupId = id;
      this.getVoiceList();
    },
    //创建素材分组
    addVoiceGroup() {
      this.$ajax
        .post('/material/materialsVoiceGroup/add', { name: this.addGroupName })
        .then(res => {
          if (res.resCode == 200) {
            this.addFenzu = false;
            this.getVoiceGroupList();
            this.message('新建成功', 'success');
            this.addGroupName = '';
          }
        })
        .catch(err => console.log(err));
    },
    addGroupBtn() {
      if (this.addGroupName == '') {
        this.message('请输入分组名称', 'error');
      } else if (this.addGroupName.length > 6) {
        this.message('请输入6个字以内的名称', 'error');
      } else {
        this.addVoiceGroup();
      }
    },
    //查询素材分组
    getVoiceGroupList() {
      this.$ajax
        .get('/material/materialsVoiceGroup/list', {
          params: {},
        })
        .then(res => {
          if (res.resCode == 200) {
            this.groupData = res.resObject;
            this.groupcount = res.resObject.length;
          }
        })
        .catch(err => console.log(err));
    },
    //删除素材分组
    deleteVoiceGroup(id) {
      this.$ajax
        .post('/material/materialsVoiceGroup/delete', { id: id })
        .then(res => {
          if (res.resCode == 200) {
            this.delFenzu = false;
            this.getVoiceGroupList();
            this.message('删除成功', 'success');
          }
        })
        .catch(res => console.log(res));
    },
    delGroupBtn(item) {
      this.delGroup = item;
      this.delFenzu = true;
    },
    delGroupBtn2() {
      this.deleteVoiceGroup(this.delGroup.id);
    },
    //编辑素材分组
    editVoiceGroup() {
      this.$ajax
        .post('/material/materialsVoiceGroup/update', {
          id: this.editGroup.id,
          name: this.editGroup.name,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.editFenzu = false;
            this.getVoiceGroupList();
            this.message('编辑成功', 'success');
          }
        })
        .catch(res => console.log(res));
    },
    editGroupBtn(item) {
      this.editGroup = JSON.parse(JSON.stringify(item));
      this.editFenzu = true;
    },
    editGroupBtn2() {
      if (this.editGroup.name == '') {
        this.message('请输入分组名称', 'error');
      } else if (this.editGroup.name.length > 6) {
        this.message('请输入6个字以内的名称', 'error');
      } else {
        this.editVoiceGroup();
      }
    },
    //批量移动分组
    moveVoiceGroupBtn() {
      if (this.ids.length == 0) {
        this.message('请选择需要移动的素材', 'error');
      } else if (this.removeGroupId == null) {
        this.message('请选择分组', 'error');
      } else {
        this.$ajax
          .post('/material/materialsVoice/batchChange', {
            id: this.ids.join(','),
            groupId: this.removeGroupId,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.moveVoiceGroupModal = false;
              this.getVoiceList();
              this.message('成功', 'success');
              this.ids = [];
              this.checkAll = false;
              this.removeGroupId = '';
              this.isIndeterminate = false;
              this.getVoiceGroupList();
              this.getVoiceGroupList();
            }
          })
          .catch(err => console.log(err));
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

    async getVoice(val) {
      this.addVoiceData.voicePath = val;
    },

    //获取单位
    unitList() {
      listSelfAndChildren().then(res => {
        if (res.resCode == 200) {
          this.unitListData = res.resObject.list;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.aplayer {
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}

.aplayer.aplayer-narrow {
  width: 118px;
}

/deep/ .aplayer-pic {
  height: 118px;
  width: 118px;
}

.el-select {
  width: 100%;
}

.managePage {
  /*//@extend %fill;*/
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);

  .el-checkbox {
    font-weight: normal;
  }

  .el-card {
    overflow: auto;
    height: calc(100vh - 187px);
  }

  &.managePageGroup {
    padding: 0;
    padding-left: 20px;
    .el-card {
      height: auto;
    }
  }

  .from-wrap {
    width: 100%;
    min-height: 64px;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px 15px 20px;

    /deep/ .el-form-item {
      margin-bottom: 0;
    }

    .title {
      cursor: pointer;
      font-size: 16px;
      color: #353535;

      span {
        color: #666666;
      }
    }
  }

  .img-box {
    display: flex;
    flex-wrap: wrap;
    /*justify-content: space-between;*/
    .img-item {
      margin-bottom: 20px;
      margin-right: 0.5%;
      margin-left: 0.5%;
      width: 120px;
      border: 1px solid #e5e9ef;
      display: flex;
      flex-flow: column;
    }

    img {
      height: 124px;
      background-color: #29bc4f;
    }

    .img-btn {
      color: #abb2c4;
      padding: 0 10px;
      background-color: #f5f7fa;
      border-top: 1px solid #e5e9ef;
      display: flex;
      justify-content: space-between;

      i {
        padding: 8px 0;
        cursor: pointer;

        :hover {
          color: #29bc4f;
        }
      }
    }
  }

  .text-item {
    color: #666666;
    font-size: 14px;
    line-height: 36px;
    padding-bottom: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      cursor: pointer;
    }

    .active {
      color: #29bc4f;
    }
  }
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

.uploader-text {
  font-size: 14px;
  color: #ccc;
}
</style>
