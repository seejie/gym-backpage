<template>
  <div class="subject">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form :inline="true" ref="formInline" label-width="80px" label-position="left" :model="searchData">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="搜索标题">
              <el-input v-model="searchData.title" placeholder="搜索标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布状态">
              <el-select placeholder="请选择" v-model="searchData.publishStatus">
                <el-option label="草稿" value="1"></el-option>
                <el-option label="未发布" value="2"></el-option>
                <el-option label="已发布" value="3"></el-option>
                <el-option label="已下线" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布位置">
              <el-select placeholder="请选择" v-model="searchData.position">
                <el-option label="置顶" value="2"></el-option>
                <el-option label="默认" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="评论权限">
              <el-select placeholder="请选择" v-model="searchData.isComment">
                <el-option label="开" value="0"></el-option>
                <el-option label="关" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布时间">
              <el-date-picker
                v-model="searchTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="栏目">
              <el-select placeholder="栏目" v-model="searchData.columnId">
                <el-option
                  v-for="item in columnData"
                  :key="item.id"
                  :label="item.columnName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item style="text-align: right;">
              <el-button type="primary" @click="searchBtn">搜索</el-button>
              <el-button @click="dataInit">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button type="primary">
          <router-link :to="{ name: 'information/subjectAdd', params: { id: -1 } }">
            发布专题
          </router-link>
        </el-button>
        <el-button @click="batchTopicPublish(3)">批量上线</el-button>
        <el-button @click="batchTopicPublish(4)">批量下线</el-button>
        <el-button @click="batchTopicDel">删除</el-button>
      </div>
      <!--表格-->
      <el-table :data="issueData" style="width: 100%;" @selection-change="selectionchange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="scope">{{ scope.row.abstractInfo }}</template>
        </el-table-column>
        <el-table-column label="标题" min-width="340px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px;" v-if="scope.row.position == 2">
              置顶
            </el-tag>
            <el-avatar shape="square" size="medium" :src="scope.row.indexPic"></el-avatar>
            <span style="margin-left: 10px;">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publish_status" label="发布状态" width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus == 1">草稿</span>
            <span v-if="scope.row.publishStatus == 2">待发布</span>
            <span style="color: #71b933;" v-if="scope.row.publishStatus == 3">
              已上线
            </span>
            <span style="color: #ff5c7a;" v-if="scope.row.publishStatus == 4">
              已下线
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="columnName" label="栏目"></el-table-column>
        <el-table-column prop="unitName" label="发布单位"></el-table-column>
        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="reading" label="阅读数" width="100px"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  name: 'information/comment',
                  params: { type: 2, id: scope.row.id },
                }"
              >
                评论
              </router-link>
            </el-button>
            <el-button type="text">
              <router-link
                :to="{
                  name: 'information/subjectAdd',
                  params: { id: scope.row.id },
                }"
              >
                编辑
              </router-link>
            </el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="text">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.publishStatus == 4 || scope.row.publishStatus == 2"
                  :command="{ id: scope.row.id, value: 1 }"
                >
                  上线
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.publishStatus == 3" :command="{ id: scope.row.id, value: 2 }">
                  下线
                </el-dropdown-item>
                <el-dropdown-item :command="{ ...scope.row, value: 3 }">
                  {{ scope.row.isComment == 0 ? '禁言' : '取消禁言' }}
                </el-dropdown-item>
                <el-dropdown-item :command="{ ...scope.row, value: 4 }">
                  {{ scope.row.position == 2 ? '取消置顶' : '置顶' }}
                </el-dropdown-item>
                <el-dropdown-item :command="{ id: scope.row.id, value: 5 }">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right; margin-top: 20px;">
        <Pagination
          v-if="issueData.length != 0"
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
import channelData from '@/utils/channelData';
import { listSelfAndChildren } from '@/api/sass/unit';

import {
  informationTopicDelete,
  informationTopicListPage,
  informationTopicBan,
  informationTopicUnban,
} from '@/api/information/topic';

export default {
  name: 'subject',
  components: {
    Pagination,
  },
  data() {
    return {
      searchData: {
        title: '',
        publish_status: '',
        position: '',
        startTime: '',
        endTime: '',
        columnId: '',
        isComment: '', //评论开关 1-开启 0-关闭
        unitId: '',
        size: 0,
        current: 1,
      },
      searchTime: '',
      //分页
      totalCount: 0,
      current: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      //
      issueData: [],
      //全选
      ids: [],
      columnData: [],
      unitListData: [],
    };
  },
  created() {
    this.searchData.size = this.pageSizes[0];
    this.topiclist();
    this.listByChannelShort();
    this.unitList();
  },
  methods: {
    //查询
    searchBtn() {
      this.searchData.current = 1;
      if (this.searchTime != null) {
        this.searchData.startTime = this.searchTime[0];
        this.searchData.endTime = this.searchTime[1];
      } else {
        this.searchData.startTime = '';
        this.searchData.endTime = '';
      }
      this.topiclist();
    },
    //重置
    dataInit() {
      this.searchData = {
        title: '',
        publish_status: '',
        position: '',
        startTime: '',
        endTime: '',
        columnId: '',
        isComment: '', //评论开关 0-开启 1-关闭
        unitId: '',
      };
      this.searchTime = '';
    },
    //获取单位
    unitList() {
      listSelfAndChildren().then(res => {
        if (res.resCode == 200) {
          this.unitListData = res.resObject.list;
        }
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
    //分页
    currentChange(val) {
      this.searchData.current = val;
      this.topiclist();
    },
    sizeChange(val) {
      this.searchData.size = val;
      this.topiclist();
    },
    //全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },
    //下拉菜单点击事件
    dropdownMenu(data) {
      if (data.value == 1) {
        this.ids = [data.id];
        this.batchTopicPublish(3); //上线
      }
      if (data.value == 2) {
        this.ids = [data.id];
        this.batchTopicPublish(4); //下线
      }
      if (data.value == 3) {
        //禁言、不禁言
        if (data.isComment == 0) {
          this.handleBan(data.id);
        } else {
          this.handleUnban(data.id);
        }
      }
      if (data.value == 4) {
        if (data.position == 2) {
          // 取消置顶
          this.untopTopic(data.id);
        } else {
          this.topTopic(data.id); //置顶
        }
      }
      if (data.value == 5) {
        this.topicDel(data.id); //删除
      }
    },

    // 禁言
    handleBan(id) {
      informationTopicBan({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.topiclist();
          this.message('成功', 'success');
        }
      });
    },

    // 取消禁言
    handleUnban(id) {
      informationTopicUnban({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.topiclist();
          this.message('成功', 'success');
        }
      });
    },

    //置顶
    topTopic(id) {
      this.$ajax
        .post('/cms/informationTopic/top', { id: id })
        .then(res => {
          if (res.resCode == 200) {
            this.topiclist();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },

    // 取消置顶
    untopTopic(id) {
      this.$ajax
        .post('/cms/informationTopic/untop', { id: id })
        .then(res => {
          if (res.resCode == 200) {
            this.topiclist();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },

    //上下线 2-上线 3-下线
    toggleTopicPublish(id, publish_status) {
      this.$ajax
        .post('/cms/information/toggleTopicPublish', {
          id: id,
          publish_status: publish_status,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.topiclist();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    //禁言
    toggleTopic(id) {
      this.$ajax
        .post('/cms/information/toggleTopic', { id: id })
        .then(res => {
          if (res.resCode == 200) {
            this.topiclist();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    //删除
    topicDel(id) {
      informationTopicDelete({
        id: id,
      })
        .then(res => {
          if (res.resCode == 200) {
            this.topiclist();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    //批量删除
    batchTopicDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/cms/informationTopic/batchDelete', {
            ids: this.ids.join(','),
          })
          .then(res => {
            if (res.resCode == 200) {
              this.topiclist();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      }
    },
    //批量上下线 3批量上线 4批量下线
    batchTopicPublish(publish_status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
        return;
      }

      if (publish_status == 3) {
        this.$ajax
          .post('/cms/informationTopic/batchUp', {
            ids: this.ids.join(','),
          })
          .then(res => {
            if (res.resCode == 200) {
              this.topiclist();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      } else if (publish_status == 4) {
        this.$ajax
          .post('/cms/informationTopic/batchDown', {
            ids: this.ids.join(','),
          })
          .then(res => {
            if (res.resCode == 200) {
              this.topiclist();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      }
    },
    //获取表格数据
    topiclist() {
      informationTopicListPage({
        pageNum: this.searchData.current,
        pageSize: this.searchData.size,
        ...this.searchData,
      })
        .then(res => {
          if (res.resCode == 200) {
            this.totalCount = res.resObject.totalCount;
            this.issueData = res.resObject.list;
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
.subject {
  /*//@extend %fill;*/
  overflow: auto;
  /*padding: 20px;*/
  padding-bottom: 0;
  /*height: calc(100vh - 100px);*/

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
    margin-left: 15px;
  }

  /deep/ .el-table .cell {
    display: flex;
    align-items: center;
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
}
</style>
