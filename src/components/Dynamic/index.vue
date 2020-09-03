<template>
  <div class="dyTable">
    <el-table :data="gonglueData" style="width: 58%" @selection-change="selectionchange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column>
        <!--全选、添加等操作按钮-->
        <template slot="header">
          <div style="display: flex;justify-content: space-between;padding: 0">
            <div
              style="font-size:12px;color:#CCCCCC;line-height:28px"
              v-if="gonglueData.length"
            >共{{ gonglueData.length }}条动态</div>
            <div style="font-size:12px;color:#CCCCCC;line-height:28px" v-else>暂无动态</div>
            <div style="padding: 0">
              <el-button @click="gonglueBatchPublish(2)" size="mini">批量上线</el-button>
              <el-button @click="gonglueBatchPublish(4)" size="mini">批量下线</el-button>
              <el-button @click="gonglueBatchDel" size="mini">删除</el-button>
            </div>
            <div style="text-align: right">
              <el-button type="text" @click="pxBtn('time')" size="mini">
                按时间排序
                <i class="el-icon-sort"></i>
              </el-button>
              <el-button type="text" @click="pxBtn('zan')" size="mini" style="margin-left:35px">
                按点赞数排序
                <i class="el-icon-sort"></i>
              </el-button>
            </div>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="pl-box">
            <div class="pl-left">
              <!-- <el-tag size="mini" v-if="scope.row.position==1">置顶</el-tag> -->
              <el-avatar size="medium" :src="scope.row.memberAvatar"></el-avatar>
            </div>
            <div class="pl-right">
              <div class="right-item">
                <div class="right-top">
                  <div class="right-top-txt">
                    <span>{{ scope.row.memberNickname }}</span>
                    <span>{{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:SS') }}</span>
                  </div>

                  <div class="right-top-btn">
                    <span
                      class="aleady-up"
                      style="color: #2EBA07"
                      v-if="scope.row.checkStatus == 2"
                    >已上线</span>
                    <span
                      class="aleady-down"
                      style="color: #FF0000"
                      v-if="scope.row.checkStatus == 4"
                    >已下线</span>
                    <el-button
                      size="mini"
                      round
                      v-if="scope.row.releaseLoc == 2"
                      style="background-color:rgba(0, 207, 226, 1);color:#fff"
                      @click="gonglueTop(scope.row.id, 1)"
                    >取消置顶</el-button>
                    <el-button
                      size="mini"
                      round
                      style="background-color:rgba(153, 153, 153, 1);color:#fff"
                      v-if="scope.row.releaseLoc == 1"
                      @click="gonglueTop(scope.row.id, 2)"
                    >置顶</el-button>
                    <svg-icon
                      icon-class="huifu"
                      @click="getInformation_id(scope.row, scope.$index)"
                    />
                    <i class="el-icon-delete" @click="gonglueDel(scope.row.id)"></i>
                    <div>
                      <svg-icon icon-class="zang" />
                      <span>{{ scope.row.thumbsUpCount }}</span>
                    </div>
                  </div>
                </div>
                <div class="right-pl">{{ scope.row.content }}</div>
                <div style="width: 230px;white-space: wrap">
                  <template v-if="scope.row.images">
                    <el-image
                      style="width: 71px;height: 71px;margin:0 5px 5px 0px;display: block;float:left"
                      v-for="item in scope.row.images.split(',')"
                      :src="item"
                      :key="item"
                    ></el-image>
                  </template>
                </div>
                <div style="clear:both"></div>
                <div
                  v-if="scope.row.commentCount && !commentDataList.find(v => v.id == scope.row.id).list.length"
                  class="pl-button"
                >
                  <span @click="getCommentById(scope.row.id)">查看更多{{ scope.row.commentCount }}条评论</span>
                </div>
                <div
                  v-if="
                    !scope.row.commentCount &&
                      !commentDataList.find(v => v.id == scope.row.id).list.length &&
                      !(isplForm[scope.$index] && reply.id == scope.row.id)
                  "
                  class="pl-button no-comment"
                >暂无评论</div>
              </div>
              <!--回复的-->
              <template v-if="commentDataList.find(v => v.id == scope.row.id).list.length">
                <div
                  class="pl-box"
                  v-for="(item, index) in commentDataList.find(v => v.id == scope.row.id).list"
                  :key="index"
                >
                  <div class="pl-left">
                    <el-avatar size="medium" :src="scope.row.memberAvatar"></el-avatar>
                  </div>
                  <div class="pl-right">
                    <div class="right-item">
                      <div class="right-top">
                        <div class="right-top-txt">
                          <span>{{ item.memberNickname }} 回复 {{ scope.row.memberNickname }}</span>
                          <span>{{ $moment(item.create_time).format('YYYY-MM-DD HH:mm:SS') }}</span>
                        </div>
                        <div class="right-top-btn">
                          <div>
                            <svg-icon icon-class="zang" />
                            <span>{{ item.thumbsUpCount }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="right-pl">{{ item.content }}</div>
                    </div>
                  </div>
                </div>
              </template>
              <div class="pl-form" v-if="isplForm[scope.$index] && reply.id == scope.row.id">
                <el-input type="textarea" placeholder="评论内容" v-model="reply.reply"></el-input>
                <el-button
                  type="primary"
                  style="margin-top: 10px"
                  @click="commentReply(scope.row.id, scope.$index)"
                >发布</el-button>
                <el-button @click="showplForm(scope.$index)">取消</el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-top: 20px">
      <Pagination
        v-if="gonglueData.length != 0"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :total="totalCount"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '@/components/Pagination';
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      gonglueData: [],
      //
      commentData: [],
      commentDataList: [],
      //排序
      sort: '',
      timeSortType: false,
      zanSortType: false,
      //
      isplForm: [],
      //回复
      reply: {
        id: null,
        information_id: null,
        reply: '',
      },
      //全选
      ids: [],
    };
  },
  props: {
    searchFrom: {
      type: Object,
      default() {
        return {};
      },
    },
    type: [Number, String],
    bizId: {
      type: [Number, String, Object],
      default: undefined,
    },
  },
  created() {
    this.pageSize = this.pageSizes[0];
    this.gonglueList();
  },
  methods: {
    //分页
    currentChange(val) {
      this.curPage = val;
      this.gonglueList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.gonglueList();
    },
    //全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },
    //批量删除
    gonglueBatchDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/community/moment/delete', {
            ids: this.ids,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.gonglueList();
              this.message('成功', 'success');
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    gonglueBatchPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/community/moment/setCheckStatus', {
            ids: this.ids,
            checkStatus: status,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.gonglueList();
              this.message('成功', 'success');
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    gonglueTop(id, loc) {
      //攻略置顶
      this.$ajax
        .post('/community/moment/setReleaseLoc', { ids: [id], releaseLoc: loc })
        .then(res => {
          if (res.resCode == 200) {
            this.gonglueList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    gonglueBatchPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/community/moment/setCheckStatus', {
            ids: this.ids,
            checkStatus: status,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.gonglueList();
              this.message('成功', 'success');
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    gonglueTop(id, loc) {
      //攻略置顶
      this.$ajax
        .post('/community/moment/setReleaseLoc', { ids: [id], releaseLoc: loc })
        .then(res => {
          if (res.resCode == 200) {
            this.gonglueList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    //显示回复框
    showplForm(index) {
      this.$set(this.isplForm, index, !this.isplForm[index]);
    },
    //点击获取information_id
    getInformation_id(item, index) {
      this.getCommentById(item.id);
      this.reply.id = item.id;
      this.reply.reply = '';
      this.showplForm(index);
    },
    //删除攻略
    gonglueDel(id) {
      var that = this;
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          that.$ajax
            .post('/community/moment/delete', { ids: [id] })
            .then(res => {
              if (res.resCode == 200) {
                that.gonglueList();
                that.message('成功', 'success');
              } else {
                that.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    getCommentById(id) {
      let params = {
        pageIndex: 1,
        pageSize: 100,
        momentId: id,
      };
      this.$ajax
        .get('/community/moment/listComment', { params })
        .then(res => {
          if (res.resCode == 200) {
            this.commentDataList.forEach(v => {
              if (v.id == id) {
                v.list = res.resObject.list;
              }
            });
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    //回复评论
    commentReply(id, index) {
      if (this.reply.reply.length == 0) {
        this.message('请添加评论内容', 'info');
      } else {
        this.$ajax
          .post('/community/moment/createComment', { content: this.reply.reply, momentId: this.reply.id, memberId: 0 })
          .then(res => {
            if (res.resCode == 200) {
              this.getCommentById(id);
              this.message('成功', 'success');
              this.showplForm(index);
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    //排序
    pxBtn(flag) {
      if (flag == 'time') {
        this.timeSortType = !this.timeSortType;
        this.sort = this.timeSortType ? 'time:asc' : 'time:desc';
      } else {
        this.zanSortType = !this.zanSortType;
        this.sort = this.zanSortType ? 'thumbs:asc' : 'thumbs:desc';
      }
      this.gonglueList();
    },
    //获取某发布的评价列表
    gonglueList() {
      //攻略发布列表
      let params = {
        pageNum: this.curPage,
        pageSize: this.pageSize,
        memberId: this.searchFrom.memberId,
        channelType: this.type,
        orderBy: this.sort,
        bizId: this.bizId,
        releaseLoc: this.searchFrom.place,
        releaseStatus: this.searchFrom.publish,
        releaseBeginTime: this.searchFrom.time.length > 0 ? this.searchFrom.time[0] : '',
        releaseEndTime: this.searchFrom.time.length > 0 ? this.searchFrom.time[1] : '',
      };
      this.$ajax
        .get('/community/moment/list', { params })
        .then(res => {
          if (res.resCode == 200) {
            this.totalCount = res.resObject.totalCount;
            this.gonglueData = res.resObject.list;
            for (let i = 0; i < this.gonglueData.length; i++) {
              this.isplForm[i] = false;
              this.commentDataList.push({
                id: this.gonglueData[i].id,
                list: [],
              });
            }
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
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
.dyTable {
  /deep/.el-table {
    &::before {
      background-color: #fff;
    }

    td {
      vertical-align: top;
      border-bottom: 0px;
    }

    th {
      border-bottom: 0px;
    }

    .el-table-column--selection .cell {
      padding-left: 10px;
      padding-right: 5px;
    }

    tr {
      & > td:nth-child(1) {
        div.cell {
          padding-top: 7px;
        }
      }
      .pl-button {
        text-align: center;
        position: absolute;
        cursor: pointer;
        width: 100%;
        bottom: 0px;
        &.no-comment {
          cursor: default;
        }
      }
    }

    .el-avatar--medium {
      width: 40px;
      height: 40px;
      line-height: 40px;
    }

    .aleady-up,
    .aleady-down {
      position: relative;

      &::before {
        position: absolute;
        content: '';
        left: -10px;
        top: 8px;
        border-radius: 50%;
        width: 5px;
        height: 5px;
        background-color: #108de9;
      }
    }

    .aleady-down {
      &::before {
        background-color: #ff0000;
      }
    }
  }
  .pl-box {
    display: flex;

    .pl-left {
      margin-right: 20px;
      display: flex;
      padding-top: 4px;
    }

    .pl-right {
      flex: 1;
      position: relative;
      .right-item {
        margin-bottom: 20px;

        .right-top {
          display: flex;
          justify-content: space-between;

          .right-top-txt {
            span {
              margin-right: 15px;
              color: #999999;
              font-size: 12px;
            }
          }

          .right-top-btn {
            display: flex;
            align-items: center;

            > * {
              margin-left: 20px;
              cursor: pointer;
            }
            .el-button--mini.is-round {
              padding: 5px 15px;
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
