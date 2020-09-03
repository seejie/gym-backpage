<template>
  <div class="imgAdd">
    <el-row>
      <el-col :span="16">
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <span>基本信息</span>
          </div>
          <div style="padding-right: 20px;">
            <el-form ref="ruleForm" label-width="100px">
              <el-form-item label="专题标题">
                <el-input type="text" placeholder="请输入名称，30字以内" v-model="addData.title"></el-input>
              </el-form-item>
              <el-form-item label="副标题">
                <el-input type="text" placeholder="请输入名称，45字以内" v-model="addData.subtitle"></el-input>
              </el-form-item>
              <el-form-item label="专题介绍">
                <el-input
                  type="textarea"
                  maxlength="150"
                  show-word-limit
                  v-model="addData.abstractInfo"
                  placeholder="请输入介绍，150字以"
                ></el-input>
              </el-form-item>
              <!--图片 上传组件 -->
              <el-form-item label="专题封面">
                <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
              </el-form-item>
              <!--标签类型 多选框 -->
              <el-form-item label="标签类型" prop="LabelTyle">
                <el-select placeholder="请选择标签" v-model="addData.labelId">
                  <el-option v-for="item in labelData2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button @click="outerVisible = true">标签管理</el-button>
                <!--标签管理弹窗-->
                <el-dialog
                  title="标签管理"
                  :visible.sync="outerVisible"
                  width="30%"
                  top="5vh"
                  :close-on-click-modal="false"
                  :close-on-press-escape="false"
                >
                  <el-button type="primary" @click="innerVisible = true">
                    新建标签
                  </el-button>
                  <el-table :data="labelData">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column property="name" label="标签名称"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" style="color: #353535;" @click="editLabelBtn(scope.row)">
                          编辑
                        </el-button>
                        <el-button type="text" style="color: #353535;" @click="deleteLabelBtn(scope.row.id)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <div style="text-align: right; margin-top: 20px;">
                    <Pagination
                      v-if="labelData.length != 0"
                      :pageSize="pageSize"
                      :pageSizes="pageSizes"
                      :total="totalCount"
                      @currentChange="currentChange"
                      @sizeChange="sizeChange"
                    ></Pagination>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible = false">关 闭</el-button>
                  </div>
                  <!--新增标签 内弹窗-->
                  <el-dialog
                    width="20%"
                    title="添加标签"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :visible.sync="innerVisible"
                    append-to-body
                  >
                    <!--表单-->
                    <p style="margin-bottom: 5px; margin-top: 0;">标签名称</p>
                    <el-input v-model="addLabelData"></el-input>
                    <!--内弹窗脚部-->
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="addLabel">
                        保 存
                      </el-button>
                      <el-button @click="innerVisible = false">取 消</el-button>
                    </div>
                  </el-dialog>
                  <!--删除标签 内弹窗-->
                  <el-dialog
                    width="20%"
                    title="删除标签"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :visible.sync="delbtn"
                    append-to-body
                  >
                    <p style="margin: 0;">确定删除此标签吗？</p>
                    <!--内弹窗脚部-->
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="deleteLabel">
                        确 定
                      </el-button>
                      <el-button @click="delbtn = false">取 消</el-button>
                    </div>
                  </el-dialog>
                  <!--编辑标签 内弹窗-->
                  <el-dialog
                    width="20%"
                    title="编辑标签"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :visible.sync="editbtn"
                    append-to-body
                  >
                    <!--表单-->
                    <p style="margin-bottom: 5px; margin-top: 0;">标签名称</p>
                    <el-input v-model="editLabelData.name"></el-input>
                    <!--内弹窗脚部-->
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="editLabel">
                        保 存
                      </el-button>
                      <el-button @click="editbtn = false">取 消</el-button>
                    </div>
                  </el-dialog>
                </el-dialog>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <el-card style="margin-top: 20px;" class="box-card" shadow="never">
          <div slot="header">
            <span>发布设置</span>
          </div>
          <div style="padding-right: 20px;">
            <el-form ref="ruleForm" label-width="100px">
              <el-form-item label="发布位置">
                <el-select placeholder="栏目" v-model="addData.columnId">
                  <el-option
                    v-for="item in columnData"
                    :key="item.id"
                    :label="item.columnName"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select placeholder="排序位置" v-model="addData.position">
                  <el-option label="置顶" value="2"></el-option>
                  <el-option label="默认" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-radio-group v-model="addData.publishStatus">
                  <el-radio style="line-height: 2.8;" label="3">
                    立即发布
                  </el-radio>
                  <br />
                  <el-radio style="line-height: 2.8;" label="1">
                    草稿，暂不发布
                  </el-radio>
                  <br />
                  <el-radio style="line-height: 2.8;" label="2">
                    定时发布
                  </el-radio>
                </el-radio-group>
                <br />
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="time.date"
                ></el-date-picker>
                <el-time-picker placeholder="选择时间" value-format="HH:mm:ss" v-model="time.time"></el-time-picker>
              </el-form-item>
              <el-form-item>
                <el-button style="margin-right: 10px;" type="primary" @click="saveBtn()">
                  提交
                </el-button>
                <router-link :to="{ name: 'information/subject' }">
                  <el-button>取消</el-button>
                </router-link>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="margin-left: 20px;" class="box-card" shadow="never">
          <div slot="header">
            <span>素材选择</span>
          </div>
          <div class="img-box">
            <img :class="{ noImg: !imgs['ratio1.33'][0] }" :src="imgs['ratio1.33'][0]" />
            <p style="margin-bottom: 10px;">
              {{ addData.title == '' ? '专题标题' : addData.title }}
            </p>
            <p>
              {{ addData.abstractInfo == '' ? '专题介绍，仅150字以内哦' : addData.abstractInfo }}
            </p>
          </div>
          <div class="img2-box">
            <div class="img-item" v-for="(i, index) in materialId" :key="index">
              <img :src="i.indexPic" />
              <div class="img-txt">
                <div class="title">{{ i.title }}</div>
                <div class="small-title">
                  <span class="label">标签</span>
                  <span>
                    {{ $moment(i.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                  </span>
                </div>
              </div>
              <!--操作按钮-->
              <div class="btn-box">
                <el-button icon="el-icon-close" circle @click="delBtn(index)"></el-button>
                <el-button icon="el-icon-top" circle @click="upBtn(index, i)"></el-button>
                <el-button icon="el-icon-bottom" circle @click="downBtn(index, i)"></el-button>
              </div>
            </div>
          </div>

          <el-button style="width: 100%;" type="primary" @click="showImgText = true">
            从素材库添加图文素材
          </el-button>
          <el-button
            style="width: 100%; margin-left: 0; margin-top: 10px;"
            @click="$router.push({ name: 'material/imagetextAdd' })"
          >
            创建素材
          </el-button>
          <!--图文modal-->
          <el-dialog
            custom-class="imagetextadd"
            title="选择素材"
            :visible.sync="showImgText"
            width="94%"
            top="0"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
          >
            <image-text
              :getId="false"
              :modal="showModal"
              @handleCheckedCitiesChange="handleCheckedCitiesChange"
            ></image-text>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="getMediaId">确 定</el-button>
              <!--<el-button @click="getMediaId">关 闭</el-button>-->
            </div>
          </el-dialog>
          <!--图文modal-->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ImageText from '@/views/material/imagetext';
import ImgInclude from '@/components/CropImgInclue';
import Pagination from '../../components/Pagination';
import channelData from '@/utils/channelData';

import {
  informationLabelListPage,
  informationLabelAdd,
  informationLabelDelete,
  informationLabelUpdate,
} from '@/api/information/label';

import {
  informationTopicAdd,
  informationTopicUpdate,
  informationTopicFind,
  informationTopicListMatterialPage,
} from '@/api/information/topic';

export default {
  name: 'subjectAdd',
  components: {
    ImageText,
    ImgInclude,
    Pagination,
  },
  data() {
    return {
      editbtn: false,
      delbtn: false,
      outerVisible: false,
      innerVisible: false,
      checkboxs: '',
      //图片上传
      imgs: {
        'ratio1.33': [],
      },
      cropper: [
        {
          name: '专题封面',
          ratio_x: 4,
          ratio_y: 3,
          ratio: 1.33,
          desc: '你的用户将在资讯专题模块，看到此封面。',
        },
      ],
      //子组件的遮罩层显示
      showModal: false,
      //增加
      addData: {
        title: '',
        subtitle: '',
        abstractInfo: '',
        indexPic: '',
        labelId: '',
        columnId: '',
        position: '',
        publishStatus: '3',
        publishTime: '',
        materialIds: '',
        channelId: '',
      },
      time: {
        date: '',
        time: '',
      },
      materialId: [],
      materialId2: [],
      routerId: null,
      showImgText: false,
      //标签
      labelData: [],
      labelData2: [],
      addLabelData: '',
      editLabelData: {},
      deleteLabelId: '',
      //分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10],
      pageSize: 0,
      columnData: [],
    };
  },
  created() {
    this.routerId = this.$route.params.id;
    if (this.routerId != -1) {
      this.topicdetail();
      this.loadSubjectDetail();
    }
    this.pageSize = this.pageSizes[0];
    this.labelList();
    this.labelList2();
    this.listByChannelShort();
  },
  methods: {
    //分页
    currentChange(val) {
      this.curPage = val;
      this.labelList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.labelList();
    },
    //判断图片
    imgData() {
      if (this.imgs['ratio1.33'] != undefined) {
        this.addData.indexPic = this.imgs['ratio1.33'][0];
      }
    },
    saveBtn() {
      if (this.addData.publishStatus == 2) {
        this.addData.publishTime = this.time.date + ' ' + this.time.time;
      } else {
        delete this.addData.publishTime;
      }
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
      } else if (this.addData.subtitle == '') {
        this.message('请输入副标题', 'error');
      } else if (this.addData.abstractInfo == '') {
        this.message('请输入专题介绍', 'error');
      } else if (this.addData.indexPic == '') {
        this.message('请选择图文封面', 'error');
      } else if (this.addData.labelId == '') {
        this.message('请选择标签', 'error');
      } else if (this.addData.columnId == '' || this.addData.position == '') {
        this.message('请选择发布位置', 'error');
      } else if (this.addData.publishStatus == '') {
        this.message('请选择发布时间', 'error');
      } else if (this.addData.publishStatus == '2' && this.addData.publishTime == ' ') {
        this.message('请选择发布时间', 'error');
      } else if (this.addData.materialIds == '' && this.addData.publishStatus != 1) {
        this.message('请选择素材', 'error');
      } else {
        if (this.routerId == -1) {
          this.addTopic();
        } else {
          this.editTopic();
        }
      }
    },
    //创建发布
    addTopic() {
      informationTopicAdd(this.addData)
        .then(res => {
          if (res.resCode == 200) {
            this.message('提交成功', 'success');
            this.$router.push({ name: 'information/subject' });
          }
        })
        .catch(err => console.log(err));
    },
    //编辑发布
    editTopic() {
      informationTopicUpdate(this.addData)
        .then(res => {
          if (res.resCode == 200) {
            this.message('提交成功', 'success');
            this.$router.push({ name: 'information/subject' });
          }
        })
        .catch(err => console.log(err));
    },

    // 获取专题详情
    loadSubjectDetail() {
      informationTopicFind({
        id: this.routerId,
      })
        .then(res => {
          if (res.resCode == 200) {
            this.addData.title = res.resObject.title;
            this.addData.subtitle = res.resObject.subtitle;
            this.addData.abstractInfo = res.resObject.abstractInfo;
            this.imgs['ratio1.33'] = [res.resObject.indexPic];
            this.addData.labelId = res.resObject.labelId;
            this.addData.columnId = res.resObject.columnId;
            this.addData.position = res.resObject.position;
            this.addData.publishStatus = res.resObject.publishStatus + '';
            this.addData.publishTime = res.resObject.publishTime;
            this.addData.channelId = res.resObject.channelId;
          }
        })
        .catch(err => console.log(err));
    },

    //获取素材详情
    topicdetail() {
      informationTopicListMatterialPage({ id: this.routerId })
        .then(res => {
          if (res.resCode == 200) {
            let ids = [];
            let list = res.resObject;

            for (let i = 0; i < list.length; i++) {
              list[i].indexPic = list[i].indexPic.split(',')[0];
              ids.push(list[i].id);
            }

            this.materialId2 = list;
            this.materialId = list;
            this.addData.materialIds = ids.join(',');
          }
        })
        .catch(err => console.log(err));
    },

    //标签
    labelList() {
      informationLabelListPage({
        pageNum: this.curPage,
        pageSize: this.pageSize,
        type: 2, //1-资讯  2-专题
      })
        .then(res => {
          if (res.resCode == 200) {
            this.labelData = res.resObject.list;
            this.totalCount = res.resObject.totalCount;
          }
        })
        .catch(err => console.log(err));
    },
    labelList2() {
      informationLabelListPage({
        pageNum: this.curPage,
        pageSize: 100,
        type: 2, //1-资讯  2-专题
      })
        .then(res => {
          if (res.resCode == 200) {
            this.labelData2 = res.resObject.list;
          }
        })
        .catch(err => console.log(err));
    },

    //添加标签
    addLabel() {
      informationLabelAdd({
        name: this.addLabelData,
        type: 2,
      })
        .then(res => {
          if (res.resCode == 200) {
            this.message('添加成功', 'success');
            this.labelList();
            this.labelList2();
            this.innerVisible = false;
          }
        })
        .catch(err => console.log(err));
    },

    //编辑标签
    editLabelBtn(item) {
      this.editLabelData = item;
      this.editbtn = true;
    },

    editLabel() {
      informationLabelUpdate({
        name: this.editLabelData.name,
        id: this.editLabelData.id,
      })
        .then(res => {
          if (res.resCode == 200) {
            this.message('编辑成功', 'success');
            this.labelList();
            this.labelList2();
            this.editbtn = false;
          }
        })
        .catch(err => console.log(err));
    },

    //删除标签
    deleteLabelBtn(id) {
      this.deleteLabelId = id;
      this.delbtn = true;
    },

    deleteLabel() {
      informationLabelDelete({
        id: this.deleteLabelId,
      })
        .then(res => {
          if (res.resCode == 200) {
            this.message('删除成功', 'success');
            this.labelList();
            this.labelList2();
            this.delbtn = false;
          }
        })
        .catch(err => console.log(err));
    },

    //删除图文数组
    delBtn(index) {
      this.materialId.splice(index, 1);
      this.setMaterialIds();
    },

    //排序上
    upBtn(index, value) {
      if (index != 0) {
        this.materialId.splice(index - 1, 0, value);
        this.materialId.splice(index + 1, 1);
        this.setMaterialIds();
      } else {
        this.message('已经第一个了', 'error');
      }
    },

    //排序下
    downBtn(index, value) {
      if (index + 1 != this.materialId.length) {
        this.materialId.splice(index + 2, 0, value);
        this.materialId.splice(index, 1);
        this.setMaterialIds();
      } else {
        this.message('已经最后一个了', 'error');
      }
    },

    //获取栏目
    listByChannelShort() {
      this.$ajax
        .get(`platformsetting/column/getColumnByChannelTypeUnitId?channelType=${channelData.information.channelType}`)
        .then(res => {
          if (res.resCode == 200) {
            this.columnData = res.resObject;
            this.addData.channelId = res.resObject[0].id; //频道id
          }
        })
        .catch(err => console.log(err));
    },

    //关闭图文组件
    getMediaId() {
      this.showImgText = false;
      this.setMaterialIds();
    },

    //子组件方法 选中的素材
    handleCheckedCitiesChange(val) {
      this.handleMaterialCheck(this.materialId2, val);
      this.materialId = this.materialId2.concat(val);
      this.setMaterialIds();
    },

    handleMaterialCheck(oldVal, newVal) {
      oldVal.map((old_item, old_index) => {
        newVal.map((new_item, new_index) => {
          if (new_item.id == old_item.id) {
            oldVal.splice(old_index, 1);
          }
        });
      });
    },

    //设置materialIds
    setMaterialIds() {
      let arr = [];
      this.addData.materialIds = '';
      for (let i = 0; i < this.materialId.length; i++) {
        arr.push(this.materialId[i].id);
      }
      this.addData.materialIds = arr.join(',');
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

.img-box {
  /*margin-bottom: 10px;*/
  width: 100%;
  /*background-color: #888888;*/
  img {
    display: block;
    margin: 0;
    width: 100%;
    background-color: #eee;
  }

  .noImg {
    padding-top: calc(100% * 1 / 1.33);
  }

  p {
    margin: 10px 0 30px 0;
  }
}

.img2-box {
  /*margin-bottom: 30px;*/
  width: 100%;

  .img-item {
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;

    &:hover {
      .btn-box {
        display: flex;
      }
    }

    img {
      margin-right: 10px;
      width: 100px;
      height: calc(100px * 1 / 1.53);
      background-color: #29bc4f;
    }

    .img-txt {
      flex: 1;
      display: flex;
      flex-flow: column;
      justify-content: space-between;

      .small-title {
        display: flex;
        justify-content: space-between;
      }
    }

    .btn-box {
      display: none;
      height: 100%;
      width: 100%;
      background-color: #9b9e9e8f;
      align-items: center;
      justify-content: space-evenly;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
