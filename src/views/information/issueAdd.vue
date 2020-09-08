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
              rows="5"
              resize="none"
              v-model="addData.abstractInfo"
              placeholder="请输入介绍，150字以"
            ></el-input>
          </el-form-item>
          <el-form-item label="正文详情">
            <myEditor v-model="addData.content"></myEditor>
          </el-form-item>
          <!--图片 上传组件 -->
          <el-form-item label="图文封面">
            <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
          </el-form-item>
          <!--音频-->
          <el-form-item label="音频" prop="otherLink">
            <span style="margin-right: 10px" v-if="addData.mediaId">
              {{ mediaId.length != 0 && mediaId[0].title }}
            </span>
            <el-button @click="showVoicePage = true">
              {{ addData.mediaId ? '重新选择' : '选择音频' }}
            </el-button>
            <el-dialog
              custom-class="imagetextadd"
              title="选择音频"
              :visible.sync="showVoicePage"
              width="94%"
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
          <!--标签类型 多选框 -->
          <el-form-item label="标签类型" prop="LabelTyle">
            <el-select placeholder="请选择标签" v-model="addData.labelIds">
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
                    <el-button type="text" style="color: #353535" @click="editLabelBtn(scope.row)">
                      编辑
                    </el-button>
                    <el-button type="text" style="color: #353535" @click="deleteLabelBtn(scope.row.id)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div style="text-align: right;margin-top: 20px">
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
                <p style="margin-bottom: 5px;margin-top: 0">标签名称</p>
                <el-input v-model="addLabelData"></el-input>
                <!--内弹窗脚部-->
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addLabel">保 存</el-button>
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
                <p style="margin-bottom: 5px;margin-top: 0">标签名称</p>
                <el-input v-model="editLabelData.name"></el-input>
                <!--内弹窗脚部-->
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="editLabel">保 存</el-button>
                  <el-button @click="editbtn = false">取 消</el-button>
                </div>
              </el-dialog>
            </el-dialog>
          </el-form-item>

          <el-form-item label="三方链接">
            <el-input placeholder="请输入第三方地址" v-model="addData.sourceUrl"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card style="margin-top: 20px" class="box-card" shadow="never">
      <div slot="header">
        <span>发布设置</span>
      </div>
      <div style="padding-right:20px;">
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
              <el-option label="置顶" :value="2"></el-option>
              <el-option label="BANNER_1" :value="3"></el-option>
              <el-option label="BANNER_2" :value="4"></el-option>
              <el-option label="BANNER_3" :value="5"></el-option>
              <el-option label="默认" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-radio-group v-model="addData.publishType">
              <el-radio style="line-height: 2.8" :label="1">立即发布</el-radio>
              <br />
              <el-radio style="line-height: 2.8" :label="2">
                草稿，暂不发布
              </el-radio>
              <br />
              <el-radio style="line-height: 2.8" :label="3">定时发布</el-radio>
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
            <el-button style="margin-right: 10px" type="primary" @click="saveBtn()">
              提交
            </el-button>
            <router-link :to="{ name: 'information/issue' }">
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
import VoicePage from '../material/voice';
import ImgInclude from '@/components/CropImgInclue';
import Pagination from '../../components/Pagination';
import channelData from '@/utils/channelData';

import { informationFind, informationAdd, informationUpdate } from '@/api/information/info';

import {
  informationLabelListPage,
  informationLabelAdd,
  informationLabelDelete,
  informationLabelUpdate,
} from '@/api/information/label';

export default {
  name: 'issueAdd',
  components: {
    VoicePage,
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
        'ratio1.53': [],
        'ratio1.89': [],
      },
      cropper: [
        {
          name: '普通封面',
          ratio_x: 280,
          ratio_y: 183,
          ratio: 1.53,
          desc: '你的用户将在资讯列表里，看到此封面。',
        },
        {
          name: 'Banner封面',
          ratio_x: 280,
          ratio_y: 148,
          ratio: 1.89,
          desc: '你的用户将在资讯频道顶部banner，看到此封面。',
        },
      ],
      //子组件的遮罩层显示
      showModal: false,
      //增加
      addData: {
        title: '',
        abstractInfo: '',
        content: '',
        mediaId: '',
        labelIds: '',
        sourceUrl: '',
        columnId: '',
        columnName: '',
        position: '', //1-置顶  99-默认）
        publishStatus: '',
        publishTime: '',
        indexPic: '',
        channel_id: '',
        publishType: 1, // 1立即，2草稿 ，3定时
      },
      time: {
        date: '',
        time: '',
      },
      mediaId: [],
      routerId: null,
      //标签
      labelData: [],
      labelData2: [],
      showVoicePage: false,
      addLabelData: '',
      editLabelData: {},
      deleteLabelId: '',
      //分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10],
      pageSize: 0,
      //栏目
      columnData: [],
    };
  },

  watch: {
    'addData.columnId'(val) {
      let item = this.columnData.filter(item => {
        return item.id == val;
      });

      if (item.length != 0) {
        this.addData.columnName = item[0].columnName;
      }
    },
  },

  created() {
    this.routerId = this.$route.params.id;
    if (this.routerId !== -1) {
      //查询详情
      this.getDetail(this.routerId);
    } else {
      this.addData.publishStatus = 3;
    }
    this.pageSize = this.pageSizes[0];
    this.labelList();
    this.labelList2();
    this.listByChannelShort();

    this.loadChannelInfo();
  },
  methods: {
    getDetail(id) {
      informationFind({ id: id }).then(res => {
        this.addData.title = res.resObject.title;
        this.addData.abstractInfo = res.resObject.abstractInfo;
        this.addData.content = res.resObject.content;
        this.addData.mediaId = res.resObject.mediaId;
        this.addData.labelIds = parseInt(res.resObject.labelIds);
        this.addData.sourceUrl = res.resObject.sourceUrl;
        this.addData.columnId = res.resObject.columnId;
        this.addData.columnName = res.resObject.columnName;
        this.addData.position = res.resObject.position;
        this.addData.publishStatus = res.resObject.publishStatus;
        this.addData.publishTime = res.resObject.publishTime;
        this.addData.indexPic = res.resObject.indexPic;
        this.addData.channelId = res.resObject.channelId;
        this.addData.publishType = res.resObject.publishType;

        this.time.date = res.resObject.publishTime
          ? this.$moment(res.resObject.publishTime).format('YYYY-MM-DD')
          : this.$moment().format('YYYY-MM-DD');

        this.time.time = res.resObject.publishTime
          ? this.$moment(res.resObject.publishTime).format('HH:mm:ss')
          : this.$moment().format('HH:mm:ss');

        this.imgs['ratio1.53'] = [res.resObject.indexPic.split(',')[0]];
        this.imgs['ratio1.89'] = [res.resObject.banner.split(',')[0]];
      });
    },
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
      this.addData.indexPic = `${this.imgs['ratio1.53'][0]}`;
      this.addData.banner = `${this.imgs['ratio1.89'][0]}`;
    },
    saveBtn() {
      if (this.addData.publishType == 3) {
        this.addData.publishTime = this.time.date + ' ' + this.time.time;
      } else {
        delete this.addData.publishTime;
      }
      this.imgData();
      this.addNewsBtn();
    },
    addNewsBtn() {
      if (this.addData.title == '') {
        this.message('请输入标题', 'error');
        return;
      } else if (this.addData.abstractInfo == '' && !this.addData.sourceUrl) {
        this.message('请输入摘要', 'error');
        return;
      } else if (this.addData.content == '' && !this.addData.sourceUrl) {
        this.message('请输入正文', 'error');
        return;
      } else if (!this.imgs['ratio1.53'][0] || this.imgs['ratio1.53'][0].length == 0) {
        this.message('请选择图文封面', 'error');
        return;
      } else if (this.addData.labelIds == '') {
        this.message('请选择标签', 'error');
        return;
      } else if (this.addData.columnId == '' || this.addData.position == '') {
        this.message('请选择发布位置', 'error');
        return;
      } else if (this.addData.publishType == '') {
        this.message('请选择发布时间', 'error');
        return;
      } else if (this.addData.publishType == 3 && this.addData.publishTim == '') {
        this.message('请选择发布时间', 'error');
        return;
      }

      if (this.routerId == -1) {
        this.addHttp();
      } else {
        this.addData.id = this.routerId;
        this.editHttp();
      }
    },
    //创建发布
    addHttp() {
      informationAdd(this.addData)
        .then(res => {
          if (res.resCode == 200) {
            this.message('提交成功', 'success');
            this.$router.push({ name: 'information/issue' });
          }
        })
        .catch(err => console.log(err));
    },
    //编辑发布
    editHttp() {
      informationUpdate(this.addData)
        .then(res => {
          if (res.resCode == 200) {
            this.message('提交成功', 'success');
            this.$router.push({ name: 'information/issue' });
          }
        })
        .catch(err => console.log(err));
    },

    //标签
    labelList() {
      let payload = {
        pageNum: this.curPage,
        pageSize: this.pageSize,
        type: 1, //1-资讯  2-专题
      };
      informationLabelListPage(payload)
        .then(res => {
          if (res.resCode == 200) {
            this.labelData = res.resObject.list;
            this.totalCount = res.resObject.totalCount;
          }
        })
        .catch(err => console.log(err));
    },

    labelList2() {
      let payload = {
        pageNum: this.curPage,
        pageSize: 100,
        type: 1, //1-资讯  2-专题
      };
      informationLabelListPage(payload)
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
        type: 1,
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

    loadChannelInfo() {
      this.$ajax
        .get(
          `/platformsetting/channel/getChannelByUnitIdAndChannelType?channelType=${channelData.information.channelType}`,
          {}
        )
        .then(res => {
          if (res.resObject) {
            this.addData.channelId = res.resObject.id; //频道id
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取栏目
    listByChannelShort() {
      this.$ajax
        .get(`platformsetting/column/getColumnByChannelTypeUnitId?channelType=${channelData.information.channelType}`)
        .then(res => {
          if (res.resCode == 200) {
            this.columnData = res.resObject;
          }
        })
        .catch(err => console.log(err));
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
