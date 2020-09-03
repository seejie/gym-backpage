<template>
  <div class="comment">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form :inline="true" ref="formInline" label-width="80px" label-position="left" :model="searchData">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="搜索评论">
              <el-input v-model="searchData.comment" placeholder="搜索评论"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布状态">
              <el-select placeholder="请选择" v-model="searchData.status">
                <el-option label="待审核" value="2"></el-option>
                <el-option label="已上线" value="1"></el-option>
                <el-option label="已下线" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布位置">
              <el-select placeholder="请选择" v-model="searchData.isTop">
                <el-option label="置顶" value="1"></el-option>
                <el-option label="默认" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="搜索用户">
              <el-input v-model="searchData.memberName" placeholder="搜索用户"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布时间">
              <el-date-picker
                v-model="searchTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item style="text-align: right">
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearchData">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--表格-->
      <el-table :data="commentData" style="width: 100%" @selection-change="selectionchange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column>
          <!--全选、添加等操作按钮-->
          <template slot="header" slot-scope="scope">
            <div style="display: flex;justify-content: space-between;padding: 0">
              <div style="padding: 0">
                <el-button @click="commentBatchPublish(1)">批量上线</el-button>
                <el-button @click="commentBatchPublish(0)">批量下线</el-button>
                <el-button @click="commentBatchDel">删除</el-button>
              </div>
              <div style="text-align: right">
                <el-button type="text" @click="pxBtn(3)">
                  按时间排序
                  <i class="el-icon-sort"></i>
                </el-button>
                <el-button type="text" @click="pxBtn(2)">
                  按点赞数排序
                  <i class="el-icon-sort"></i>
                </el-button>
              </div>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="pl-box">
              <div class="pl-left">
                <el-tag size="mini" v-if="scope.row.isTop == 1">置顶</el-tag>
                <el-avatar size="medium" :src="scope.row.memberImg"></el-avatar>
              </div>
              <div class="pl-right">
                <div class="right-item">
                  <div class="right-top">
                    <div class="right-top-txt">
                      <span>{{ scope.row.memberName }}</span>
                      <span>
                        {{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:SS') }}
                      </span>
                    </div>
                    <span style="color: #71b933" v-if="scope.row.status == 1">
                      已上线
                    </span>
                    <span style="color: #ff5c7a" v-if="scope.row.status == 0">
                      已下线
                    </span>
                    <span style="color: #ff5c7a" v-if="scope.row.status == 2">
                      待审核
                    </span>
                    <div class="right-top-btn">
                      <el-button
                        size="mini"
                        v-if="scope.row.isTop == 1"
                        @click="commentTop(scope.row.id, scope.row.informationId, 0)"
                      >
                        取消置顶
                      </el-button>
                      <el-button size="mini" v-else @click="commentTop(scope.row.id, scope.row.informationId, 1)">
                        置顶
                      </el-button>
                      <svg-icon icon-class="huifu" @click="getinformationId(scope.row, scope.$index)" />
                      <i class="el-icon-delete" @click="commentDel(scope.row.id, scope.row.informationId)"></i>
                      <div>
                        <svg-icon icon-class="zang" @click="commentFabulous(scope.row.id, 1)" />
                        <span>{{ scope.row.dianzanNum }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="right-pl">{{ scope.row.comment }}</div>
                  <div class="pl-form" v-if="isplForm[scope.$index]">
                    <el-input type="textarea" v-model="reply.reply"></el-input>
                    <el-button type="primary" style="margin-top: 10px" @click="commentReply">
                      发布
                    </el-button>
                    <el-button @click="showplForm(scope.$index)">
                      取消
                    </el-button>
                  </div>
                </div>
                <!--回复的-->
                <div class="pl-box" v-if="scope.row.reply">
                  <div class="pl-left">
                    <el-avatar size="medium" :src="scope.row.sys_reply_head"></el-avatar>
                  </div>
                  <div class="pl-right">
                    <div class="right-item">
                      <div class="right-top">
                        <div class="right-top-txt">
                          <span>
                            {{ scope.row.sys_reply_name }} 回复
                            {{ scope.row.name }}
                          </span>
                          <span>
                            {{ $moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:SS') }}
                          </span>
                        </div>
                        <div class="right-top-btn">
                          <div>
                            <svg-icon icon-class="zang" @click="commentFabulous(scope.row.id, 2)" />
                            <span>{{ scope.row.replyDianzanNum }}</span>
                          </div>
                          <i class="el-icon-delete" @click="commentReplyDel(scope.row.id)"></i>
                        </div>
                      </div>
                      <div class="right-pl">{{ scope.row.reply }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="commentData.length != 0"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :total="totalCount"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></Pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '../../components/Pagination';

import { informationCommentListPage } from '@/api/information/comment';

export default {
  name: 'comment',
  components: {
    Pagination,
  },
  data() {
    return {
      searchTimeRange: '',
      //
      searchData: {
        comment: '',
        status: '',
        isTop: '',
        memberName: '',
        startTime: '',
        endTime: '',
      },
      //分页
      totalCount: 0,
      current: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      //
      commentData: [],
      //排序
      orderType: 1,
      //
      isplForm: [],
      //回复
      reply: {
        id: null,
        informationId: null,
        reply: '',
      },
      //全选
      ids: [],
    };
  },
  created() {
    this.informationId = this.$route.params.id;
    this.type = this.$route.params.type;
    this.pageSize = this.pageSizes[0];
    this.commentList();
  },

  watch: {
    searchTimeRange(val) {
      this.searchData.startTime = val[0]
      this.searchData.endTime = val[1]
    }
  },

  methods: {
    //分页
    currentChange(val) {
      this.current = val;
      this.commentList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.commentList();
    },
    //全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },
    //批量删除
    commentBatchDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/cms/information/commentBatchDel', {
            ids: this.ids.join(','),
            informationId: this.informationId,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.commentList();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      }
    },

    //批量上下线  0批量下线 1批量上线
    commentBatchPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
        return;
      }

      if (status == 1) {
        this.$ajax
          .post('/cms/informationComment/batchUp', {
            ids: this.ids.join(','),
            informationId: this.informationId,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.commentList();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      } else if (status == 0) {
        this.$ajax
          .post('/cms/informationComment/batchDown', {
            ids: this.ids.join(','),
            informationId: this.informationId,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.commentList();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      }
    },

    //显示回复框
    showplForm(index) {
      this.$set(this.isplForm, index, !this.isplForm[index]);
    },
    //点击获取informationId
    getinformationId(item, index) {
      this.reply.informationId = item.informationId;
      this.reply.id = item.id;
      this.showplForm(index);
    },
    //删除回复
    commentReplyDel(id) {
      this.$ajax
        .post('/cms/information/commentReplyDel', { id: id })
        .then(res => {
          if (res.resCode == 200) {
            this.commentList();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    //回复评论
    commentReply() {
      this.$ajax
        .post('/cms/informationComment/commentReply', this.reply)
        .then(res => {
          if (res.resCode == 200) {
            this.commentList();
            this.message('成功', 'success');
            this.reply = {
              id: null,
              informationId: null,
              reply: '',
            };
          }
        })
        .catch(err => console.log(err));
    },
    //置顶
    commentTop(id, informationId, isTop) {
      this.$ajax
        .post('/cms/informationComment/commentTop', {
          id: id,
          informationId: informationId,
          isTop,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.commentList();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },

    //点赞 type字段, 1-评论点赞 2-回复点赞
    commentFabulous(id, type) {
      this.$ajax
        .post('/cms/informationComment/commentFabulous', { id: id, type })
        .then(res => {
          if (res.resCode == 200) {
            this.commentList();
            this.message('点赞成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },

    //删除
    commentDel(id, informationId) {
      this.$ajax
        .post('/cms/informationComment/delete', {
          id: id,
          informationId: informationId,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.commentList();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    //排序
    pxBtn(orderType) {
      this.orderType = orderType;
      this.commentList();
    },

    handleSearch() {
      this.current = 0;
      this.commentData = [];
      this.totalCount = 0;

      this.commentList();
    },

    //获取某发布的评价列表
    // 专题 topicId
    // 资讯 informationId
    commentList() {
      console.log(this.searchData);
      let params = {
        pageNum: this.current,
        pageSize: this.pageSize,
        orderType: this.orderType,
        ...this.searchData,
      };
      if (this.type == 1) {
        params.informationId = this.informationId;
      } else {
        params.topicId = this.informationId;
      }
      informationCommentListPage(params)
        .then(res => {
          if (res.resCode == 200) {
            this.totalCount = res.resObject.totalCount;
            this.commentData = res.resObject.list;
            for (let i = 0; i < this.commentData.length; i++) {
              this.isplForm[i] = false;
            }
          }
        })
        .catch(err => console.log(err));
    },

    resetSearchData() {
      this.searchTimeRange = ''
      this.searchData = {
        comment: '',
        status: '',
        isTop: '',
        memberName: '',
        startTime: '',
        endTime: '',
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
.comment {
  overflow: auto;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);

  .el-row {
    margin-bottom: 20px;
  }

  .el-form {
    width: 100%;
  }

  .el-range-editor--medium.el-input__inner {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    display: flex;
  }

  /deep/ .el-form-item__content {
    flex: 1;
  }

  /deep/ .el-card__header {
    padding-bottom: 0;
    border: none;
  }

  .el-dropdown {
    margin-left: 10px;
  }

  .el-tag {
    margin-right: 10px;
  }

  /deep/ .el-table td {
    vertical-align: top;
  }

  .from-wrap {
    width: 100%;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px 0 20px;

    .title {
      cursor: pointer;
      font-size: 16px;
      color: #353535;

      span {
        color: #666666;
      }
    }
  }

  .pl-box {
    display: flex;

    .pl-left {
      margin-right: 20px;
      display: flex;
    }

    .pl-right {
      flex: 1;

      .right-item {
        margin-bottom: 20px;

        .right-top {
          display: flex;
          justify-content: space-between;

          .right-top-txt {
            span {
              margin-right: 15px;
            }
          }

          .right-top-btn {
            display: flex;
            align-items: center;

            > * {
              margin-left: 20px;
              cursor: pointer;
            }

            div {
              display: flex;
              align-items: center;
              justify-content: space-around;
              width: 50px;

              span {
                margin-left: 5px;
              }
            }
          }
        }

        .right-pl {
          color: #000000;
        }

        .pl-form {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
