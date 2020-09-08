<template>
  <div class="wayManage">
    <el-card class="box-card card" shadow="never">
      <!--查询表单-->
      <div class="from-wrap">
        <el-form
          :inline="true"
          :model="formInline"
          label-width="80px"
          class="demo-form-inline"
          style="width:100%"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="搜索标题">
                <el-input v-model="formInline.content" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布状态">
                <el-select v-model="formInline.publish" placeholder="请选择">
                  <el-option label="待审核" :value="1"></el-option>
                  <el-option label="立即发布" :value="2"></el-option>
                  <el-option label="存草稿" :value="3"></el-option>
                  <el-option label="下线" :value="4"></el-option>
                  <el-option label="定时发布" :value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布位置">
                <el-select v-model="formInline.place" placeholder="请选择">
                  <el-option label="置顶" :value="2"></el-option>
                  <el-option label="默认" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="评论权限">
                <el-select v-model="formInline.commentPurview" placeholder="请选择">
                  <el-option label="禁言" :value="1"></el-option>
                  <el-option label="未禁言" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布单位">
                <el-input v-model="formInline.unitId" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="formInline.time"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:MM:SS"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item style="float:right">
              <el-button type="primary" @click="informationList">搜索</el-button>
              <el-button @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <!--操作按钮-->
      <div class="button-wrap">
        <el-button size="mini" style="padding: 5px 20px">
          <el-checkbox v-model="checked" @change="handleSelectAll"></el-checkbox>
        </el-button>
        <el-button type="primary" size="mini">
          <router-link :to="{name:'chuangjian',params:{id: 'null'}}">添加路线</router-link>
        </el-button>

        <el-button @click="wayBatchPublish(2)" size="mini">批量上线</el-button>
        <el-button @click="wayBatchPublish(4)" size="mini">批量下线</el-button>
        <el-button type="danger" @click="wayBatchDel" size="mini">删除</el-button>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;padding:0 12px"
          @selection-change="selectionchange"
          :header-cell-class-name="headerRowStyle"
          :cell-class-name="cellClassName"
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>{{props.row.introduction}}</div>
              <template v-if="props.row.tuJingList && props.row.tuJingList.length">
                <div class="tujing-list">
                  <div>途径路线:</div>
                  <div>
                    <div v-for="(item,index) in props.row.tuJingList" :key="index">
                      <div v-html="item.store.introduction"></div>
                      <el-image
                        v-for="(l,i) in item.store.coverImage"
                        :key="i"
                        style="width: 100px; height: 100px"
                        :src="l.url"
                      ></el-image>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" width="350">
            <template slot-scope="scope">
              <div style="display: flex;align-items: center">
                <el-tag size="mini" style="margin-right: 10px" v-if="scope.row.releaseLoc==2">顶</el-tag>
                <el-tag size="mini" style="margin-right: 10px;visibility:hidden" v-else>顶</el-tag>
                <div class="title">
                  <div class="img-wrap">
                    <el-image :src="scope.row.img1" fit="contain">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                  <div class="text-wrap">
                    <p class="oneTitle">{{scope.row.title}}</p>
                    <p class="twoTitle">{{scope.row.subTitle}}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="发布状态" width="150">
            <template slot-scope="scope">
              <span class="publish_status sD" v-if="scope.row.status == 1">待审核</span>
              <span class="publish_status sYs" v-if="scope.row.status == 2">已上线</span>
              <span class="publish_status sC" v-if="scope.row.status == 3">存草稿</span>
              <span class="publish_status sYx" v-if="scope.row.status == 4">已下线</span>
              <span class="publish_status sDs" v-if="scope.row.status == 9">定时发布</span>
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="发布单位"></el-table-column>
          <el-table-column prop="createTime" label="发布时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime && $moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="views" label="阅读数">
            <template slot-scope="scope">
              <span v-if="scope.row.views">浏览&nbsp;{{scope.row.views}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text">
                <router-link :to="{name:'pinglun',params:{id:scope.row.id}}">评论</router-link>
              </el-button>|
              <el-button type="text">
                <router-link :to="{name:'chuangjian',params:{id:scope.row.id}}">编辑</router-link>
              </el-button>|
              <el-dropdown @command="dropdownMenu">
                <el-button type="text">
                  更多
                  <i class="el-icon-arrow-down"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{id:scope.row.id,type:1,status:scope.row.status==2?4:2}"
                  >{{scope.row.status==2?'下线':'上线'}}</el-dropdown-item>
                  <el-dropdown-item
                    :command="{id:scope.row.id,type:2,muted:scope.row.muted==0?1:0}"
                  >{{scope.row.muted==0?"取消禁言":"禁言"}}</el-dropdown-item>
                  <el-dropdown-item
                    :command="{id:scope.row.id,type:3,releaseLoc: scope.row.releaseLoc == 1?2:1}"
                  >{{scope.row.releaseLoc==2?"取消置顶":"置顶"}}</el-dropdown-item>
                  <el-dropdown-item :command="{id:scope.row.id,type:4}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="text-align: right;margin-top: 20px">
          <Pagination
            v-if="tableData.length!=0"
            :pageSize="pageSize"
            :pageSizes="pageSizes"
            :total="totalCount"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></Pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '@/components/Pagination';
export default {
  components: {
    Pagination,
  },
  props: {
    columns: {
      type: Array,
      default: () => [
        {
          hasSort: false, //  <Boolean> 是否排序
          prop: 'title', //  <String>  对应属性名
          label: '标题', //  <String>   表头标签
        },
        {
          hasSort: false, //  <Boolean> 是否排序
          prop: 'status', //  <String>  对应属性名
          label: '发布状态', //  <String>   表头标签
        },
        {
          hasSort: false, //  <Boolean> 是否排序
          prop: 'classify', //  <String>  对应属性名
          label: '活动分类', //  <String>   表头标签
        },
        {
          hasSort: false, //  <Boolean> 是否排序
          prop: 'company', //  <String>  对应属性名
          label: '发布单位', //  <String>   表头标签
        },
        {
          hasSort: false, //  <Boolean> 是否排序
          prop: 'time', //  <String>  对应属性名
          label: '发布时间', //  <String>   表头标签
        },
        {
          hasSort: false, //  <Boolean> 是否排序
          prop: 'readTime', //  <String>  对应属性名
          label: '阅读数', //  <String>   表头标签
        },
      ],
    },
    operate: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      /* 表格数据 */
      tableData: [],
      checked: false,
      formInline: {
        content: '',
        publish: '',
        place: '',
        commentPurview: '',
        unitId: '',
        time: [],
      },
      // 分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      ids: [],
    };
  },
  mounted() {},
  created() {
    this.pageSize = this.pageSizes[0];
    this.informationList();
  },
  methods: {
    informationList() {
      this.$ajax
        .get('/gonglue/listLx', {
          params: {
            pageNum: this.curPage,
            pageSize: this.pageSize,
            unitId: this.formInline.unitId,
            muted: this.formInline.commentPurview,
            status: this.formInline.publish,
            releaseLoc: this.formInline.place,
            title: this.formInline.content,
            releaseTimeBegin: this.formInline.time[0],
            releaseTimeEnd: this.formInline.time[1],
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.tableData = res.resObject.list;
            this.totalCount = res.resObject.totalCount;
          }
        })
        .catch(err => console.log(err));
    },
    //  全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
      if (this.tableData.length == val.length) {
        this.checked = true;
      } else {
        this.checked = !1;
      }
    },
    //  重置表单搜索
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //   分页
    currentChange(val) {
      this.curPage = val;
      this.informationList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.informationList();
    },
    dropdownMenu(data) {
      switch (data.type) {
        case 1: // s上下线
          this.wayPublish(data.id, data.status);
          break;
        case 2: //  禁言
          this.waycomment(data.id, data.muted);
          break;
        case 3: //  置顶
          this.wayposition(data.id, data.releaseLoc);
          break;
        case 4: // 删除
          this.waydel(data.id);
          break;
      }
    },
    // 批量上下线  0未审核1审核通过
    wayBatchPublish(status) {
      if (this.ids.length === 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/gonglue/setStatus', {
            ids: this.ids,
            status: status,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.informationList();
              this.message('成功', 'success');
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    wayPublish(id, status) {
      // 上下线
      this.$ajax
        .post('/gonglue/setStatus', { ids: [id], status: status })
        .then(res => {
          if (res.resCode === 200) {
            this.informationList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    waycomment(id, muted) {
      // 禁言
      this.$ajax
        .post('/gonglue/setMuted', { ids: [id], muted: muted })
        .then(res => {
          if (res.resCode === 200) {
            this.informationList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    wayposition(id, releaseLoc) {
      // 置顶
      this.$ajax
        .post('/gonglue/setReleaseLoc', { ids: [id], releaseLoc: releaseLoc })
        .then(res => {
          if (res.resCode === 200) {
            this.informationList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    // 批量删除
    wayBatchDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        var that = this;
        this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            that.$ajax
              .post('/gonglue/deleteLx', {
                ids: that.ids,
              })
              .then(res => {
                if (res.resCode == 200) {
                  that.informationList();
                  that.message('成功', 'success');
                } else {
                  that.message(res.message, 'error');
                }
              })
              .catch(err => console.log(err));
          })
          .catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    waydel(id) {
      // 删除
      var that = this;
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          that.$ajax
            .post('/gonglue/deleteLx', { id: id })
            .then(res => {
              if (res.resCode === 200) {
                that.informationList();
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
    //  全部选中
    handleSelectAll(val) {
      this.$refs.multipleTable.toggleAllSelection();
    },
    //  设置表头样式
    headerRowStyle(row) {
      if (row.columnIndex == 1) {
        return 'first-cell-style';
      }
    },
    //  设置行内单元格class
    cellClassName(cell) {
      if (cell.columnIndex == 7) {
        return 'cell-self-style';
      }
    },
    // 错误、成功提示
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
@import '../scss/main.scss';
.wayManage {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
}
.card {
  .button-wrap {
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  /deep/ .el-table {
    .cell {
      font-size: 12px;
      color: rgb(152, 152, 152);
    }
    .el-table-column--selection .cell {
      padding-left: 10px;
    }
    .el-table__expanded-cell {
      padding: 8px 122px;
      background-color: #fbfbfb;
      * {
        color: rgb(204, 204, 204);
      }
      & > div:nth-child(1) {
        margin-bottom: 8px;
      }
    }
    .tujing-list {
      width: 100%;
      display: flex;
      & > div:nth-child(1) {
        width: 70px;
      }
    }
    .has-gutter {
      tr {
        th:nth-child(1) {
          div.cell {
            display: none;
          }
        }
      }
    }
    .first-cell-style {
      padding-left: 40px;
    }
    .cell-self-style {
      .cell {
        display: flex;
        justify-content: left;
        align-items: center;
        .el-button {
          margin-left: 5px;
          margin-right: 5px;
        }
      }
    }
    .title {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;

      .img-wrap {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background-color: rgba(242, 242, 242, 1);
        border-radius: 3px;
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;
          .image-slot {
            @extend .el-image;
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            i {
              font-size: 20px;
              color: #e3e3e3;
            }
          }
        }
      }
      .text-wrap {
        overflow: hidden;
        height: 40px;
        p {
          margin: 0;
          padding: 0;
        }
        .oneTitle {
          font-weight: 650;
          font-size: 16px;
        }
        .twoTitle {
          font-size: 12px;
          color: rgb(152, 152, 152);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .publish_status {
      position: relative;
      &::before {
        width: 5px;
        height: 5px;
        content: '';
        border-radius: 50%;
        position: absolute;
        left: -10px;
        top: 5px;
      }
      &.sD {
        color: #989898;
        &::before {
          background-color: #989898;
        }
      }
      &.sYs {
        color: #2eba07;
        &::before {
          background-color: #108de9;
        }
      }
      &.sC {
        color: #2eba07;
        &::before {
          background-color: #108de9;
        }
      }
      &.sYx {
        color: #cc0000;
        &::before {
          background-color: #cc0000;
        }
      }
      &.sDs {
        color: #2eba07;
        &::before {
          background-color: #108de9;
        }
      }
    }
  }
}
</style>
