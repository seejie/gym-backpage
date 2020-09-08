<template>
  <div class="student-wrap-mask">
    <div class="wrap-mask">
      <div class="wrap-content">
        <div class="main-body">
          <div class="student-wrap-header">
            <span>问卷数据</span>
            <i
              class="el-icon-close"
              style="cursor: pointer"
              @click="closeStudent"
            ></i>
          </div>
          <div class="main-search">
            <el-row type="flex">
              <el-col :span="3">
                <el-select
                  value="0"
                  placeholder="请选择"
                  style="width: 102px;"
                >
                  <el-option
                    label="昵称"
                    value="0"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col
                :span="8"
                style="display: flex"
              >
                <el-input
                  placeholder="请输入关键词，例如：张帅"
                  style="width: 200px"
                  v-model="form.keyword"
                ></el-input>
                <el-button
                  type="primary"
                  style="margin-left: 10px"
                  @click="onSearch"
                >搜索</el-button>
              </el-col>
              <el-col
                :span="7"
                style="display: flex"
              >
                <el-button
                  type="primary"
                  @click="exportQuestionaireData"
                >导出</el-button>
                <el-button
                  type="primary"
                  @click="feedback"
                >回复</el-button>
              </el-col>
            </el-row>
          </div>
          <div style="padding: 8px">
            <el-table
              ref="data"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="selectionchange"
            >
              <el-table-column
                v-if="header!=null"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column
                v-for="(item,index) in header"
                :key="index"
                :label="item.name"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-avatar
                    v-if="item.key=='avatarUrl' "
                    class="headimg"
                    shape="square"
                    size="medium"
                    :src="scope.row.avatarUrl"
                  ></el-avatar>
                  <el-row v-else>
                    {{scope.row[item.key]}}
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column label="回复">
                <template slot-scope="scope">
                  <el-link
                    v-if="scope.row.feedbacks!=''"
                    @click="showreply(scope.row)"
                    v-html="scope.row.feedbacks"
                  ></el-link>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="text-align: center; margin-top: 8px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="form.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>

            <el-dialog
              title="回复"
              :visible.sync="replyFlag"
              width="56%"
              @close="replyClose"
              append-to-body
            >
              <el-form
                ref="form1"
                label-width="80px"
              >
                <el-form-item
                  v-for="(item,index) in feedbackList"
                  :key="index"
                  :label="item.loginName == null?'用户留言':'通知用户'"
                >
                  <el-row>
                    <el-row class="content">
                      <span v-html="item.content"></span>
                      <el-row>
                        <img
                          style="margin-left: 10px"
                          v-if="item.photos.length>0"
                          v-for="(item1,index1) in item.photos.split(',')"
                          :key="index1"
                          :src="item1"
                          width="70"
                          height="70"
                        />
                      </el-row>
                      <div class="time">{{item.createTime}} <el-link
                          v-if="item.memberId>0"
                          class="delcontent"
                          type="primary"
                          @click="delcontent(item.id)"
                        >删除</el-link>
                      </div>
                    </el-row>

                  </el-row>
                </el-form-item>
                <el-form-item label="消息内容">
                  <myEditor
                    refs='name1'
                    v-model="replyForm.replycontent"
                  ></myEditor>
                </el-form-item>
                <el-form-item label="">
                  <up-load
                    :limit="9"
                    :imagePath.sync="replyForm.imgs"
                  ></up-load>
                </el-form-item>
                <el-form-item align="center">
                  <el-button
                    type="primary"
                    @click="submitfeedback"
                  >提交</el-button>
                  <el-button @click="replyClose">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findAnswerData, searchFeedbackList, feedback, deleteFeedback } from '../sever';
import { Message } from 'element-ui';
import UpLoad from '@/components/customcourse/uploadimg';

export default {
  name: 'student-info',
  props: ['studentId'],
  components: {
    UpLoad,
  },
  data() {
    return {
      form: {
        questionaireId: '',
        keyword: '',
        pageNum: 1,
        pageSize: 10,
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      header: {},

      replyFlag: false,
      feedbackList: [],
      replyForm: {
        replycontent: '',
        imgs: [],
      },
    };
  },
  mounted() {
    this.form.questionaireId = this.studentId;
    this.ids = [];
    this.onSearch();
  },
  methods: {
    feedback() {
      // 回复
      if (!this.ids.length) {
        return this.message('请选择需要回复的人员', 'info');
      }
      this.replyFlag = true;
      this.FeedbackList(this.ids[0]);
    },
    selectionchange(val) {
      this.ids = val;
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.onSearch();
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.onSearch();
    },
    closeStudent() {
      this.$emit('onClose');
    },
    onSearch() {
      findAnswerData({ ...this.form }).then(res => {
        if (res.resCode == 200) {
          const { header, data: { totalCount, list } = {} } = res.resObject || {};
          this.tableData = list || [];
          this.header = header;
          this.total = totalCount;
          this.tableData.forEach(item => {
            this.FeedbackList(item);
          });
        } else {
          this.message(res.message, 'error');
        }
      });
    },
    exportQuestionaireData() {
      const { questionaireId, keyword } = this.form;
      location.href =
        '/xqn/course/questionaire/exportQuestionaireData?questionaireId=' + questionaireId + '&keyword=' + keyword;
    },
    FeedbackList(item) {
      searchFeedbackList({ joinRecordId: item.joinRecordId }).then(res => {
        if (res.resCode == 200) {
          this.feedbackList = res.resObject;
          const feedbacks = (res.resObject[0] || {}).content || '';
          this.$set(item, 'feedbacks', feedbacks);
        }
      });
    },
    showreply(item) {
      this.replyFlag = true;
      this.item = item;
      this.FeedbackList(item);
    },
    submitfeedback() {
      const { replycontent, imgs } = this.replyForm;
      if (replycontent === '') {
        this.message('回复内容不能为空');
      } else {
        const item = this.item || this.ids[0];
        const { joinRecordId, memberId } = item;
        feedback({
          content: replycontent,
          joinRecordId,
          photos: imgs.join(','),
          memberId,
        }).then(res => {
          if (res.resCode == 200) {
            this.replyClose()
            this.message('回复成功', 'success');
            this.FeedbackList(item);
          } else {
            this.message('回复失败', 'fail');
          }
        });
      }
    },
    replyClose () {
      this.replyFlag = false;
      this.replyForm.replycontent = ''
      this.replyForm.imgs = []
      this.item = null;
    },
    delcontent(id) {
      if (confirm('确定删除吗')) {
        deleteFeedback({ id }).then(res => {
          if (res.resCode == 200) {
            const item = this.item || this.ids[0];
            this.message('删除成功', 'success');
            this.FeedbackList(this.tableData.find(f => f.id == item.id));
          }
        });
      }
    },
    // 错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type,
      });
    },
  },
};
</script>

<style scoped>
.student-wrap-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  left: 0;
  background-color: rgba(55, 55, 55, 0.6);
}
.wrap-mask {
  width: auto;
  margin: 0 auto;
  position: relative;
  outline: 0;
  top: 100px;
}
.wrap-content {
  width: 1000px;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
  border: 0;
  background-clip: padding-box;
}
.main-body {
}
.student-wrap-header {
  display: flex;
  justify-content: space-between;
  background-color: #f5f7fa;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e3e8ee;
}
.main-search {
  padding: 0 16px;
  margin: 8px 0;
  margin-top: 16px;
}
</style>
