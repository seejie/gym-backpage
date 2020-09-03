<template>
  <div class="issue">
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
                <el-option label="待发布" value="2"></el-option>
                <el-option label="已上线" value="3"></el-option>
                <el-option label="已下线" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布位置">
              <el-select placeholder="请选择" v-model="searchData.position">
                <el-option label="置顶" value="2"></el-option>
                <el-option label="BANNER_1" value="3"></el-option>
                <el-option label="BANNER_2" value="4"></el-option>
                <el-option label="BANNER_3" value="5"></el-option>
                <el-option label="默认" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="评论权限">
              <el-select placeholder="请选择" v-model="searchData.isComment">
                <el-option label="开" value="1"></el-option>
                <el-option label="关" value="0"></el-option>
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
        <el-button type="primary" @click="$router.push({ name: 'information/issueAdd', params: { id: -1 } })">
          发布文章
        </el-button>
        <el-button @click="handleBatchUp()">批量上线</el-button>
        <el-button @click="handleBatchDown()">批量下线</el-button>
        <el-button @click="handleBatchDelete()">批量删除</el-button>
      </div>
      <!--表格-->
      <el-table :data="issueData" style="width: 100%;" @selection-change="selectionchange">
        <el-table-column type="selection" width="40px"></el-table-column>
        <el-table-column type="expand" width="30px">
          <template slot-scope="scope">{{ scope.row.abstractInfo }}</template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="340px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px;" v-if="scope.row.position == 2">
              置顶
            </el-tag>
            <el-avatar shape="square" size="medium" :src="scope.row.indexPic | indexPic"></el-avatar>
            <span style="margin-left: 10px;">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" label="发布状态">
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
        <el-table-column prop="position" label="位置">
          <template slot-scope="scope">
            {{ scope.row.position | position }}
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="发布单位"></el-table-column>
        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">
            {{ $moment(scope.row.updateTime || scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="reading" label="阅读数" width="100px"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  name: 'information/comment',
                  params: { type: 1, id: scope.row.id },
                }"
              >
                评论
              </router-link>
            </el-button>
            <el-button type="text">
              <router-link
                :to="{
                  name: 'information/issueAdd',
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
                <el-dropdown-item
                  :command="{
                    id: scope.row.id,
                    value: 3,
                    isComment: scope.row.isComment,
                  }"
                >
                  {{ scope.row.isComment == 0 ? '禁言' : '取消禁言' }}
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{
                    id: scope.row.id,
                    value: 4,
                    position: scope.row.position,
                  }"
                >
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
          :pageSize="searchData.pageSize"
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
import {
  informationListPage,
  informationBatchUp,
  informationBatchDown,
  informationBatchDelete,
  informationDelete,
  informationBan,
  informationUnban,
  informationTop,
  informationUntop,
} from '@/api/information/info';
import { listSelfAndChildren } from '@/api/sass/unit';

export default {
  name: 'issue',
  components: {
    Pagination,
  },
  data() {
    return {
      searchData: {
        title: '',
        publishStatus: '',
        position: '',
        isComment: '',
        startTime: '',
        endTime: '',
        columnId: '',
        pageNum: 1,
        pageSize: 0,
        unitId: '', //发布单位
      },
      searchTime: '',
      //分页
      totalCount: 0,
      // pageNum: 1,
      pageSizes: [10, 20, 30],
      // pageSize: 0,
      //
      issueData: [],
      //全选
      ids: [],
      columnData: [],
      unitListData: [],
    };
  },
  created() {
    // this.pageSize = this.pageSizes[0];
    this.searchData.pageSize = this.pageSizes[0];
    this.informationList();
    this.listByChannelShort();
    this.unitList();
  },
  methods: {
    //查询
    searchBtn() {
      this.searchData.pageNum = 1;
      if (this.searchTime != null) {
        this.searchData.startTime = this.searchTime[0];
        this.searchData.endTime = this.searchTime[1];
      } else {
        this.searchData.startTime = '';
        this.searchData.endTime = '';
      }
      this.informationList();
    },
    //重置
    dataInit() {
      this.searchData = {
        title: '',
        publishStatus: '',
        position: '',
        isComment: '',
        startTime: '',
        endTime: '',
        columnId: '',
        unit_name: '', //发布单位
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
      this.searchData.pageNum = val;
      this.informationList();
    },

    sizeChange(val) {
      this.searchData.pageSize = val;
      this.informationList();
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
        this.handleBatchUp();
      }
      if (data.value == 2) {
        this.ids = [data.id];
        this.handleBatchDown();
      }
      if (data.value == 3) {
        if (data.isComment == 0) {
          this.handleBan(data.id);
        } else {
          this.handleUnban(data.id);
        }
      }
      if (data.value == 4) {
        if (data.position != 2) {
          this.handleTop(data.id);
        } else {
          this.handleUntop(data.id);
        }
      }
      if (data.value == 5) {
        this.deleteSingleInfo(data.id); //删除
      }
    },

    // 删除单条
    deleteSingleInfo(id) {
      informationDelete({ id: id })
        .then(res => {
          if (res.resCode == 200) {
            this.informationList();
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },

    // 置顶
    handleTop(id) {
      informationTop({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    // 取消置顶
    handleUntop(id) {
      informationUntop({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    // 禁言
    handleBan(id) {
      informationBan({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    // 取消禁言
    handleUnban(id) {
      informationUnban({ id: id }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    // 批量上线
    handleBatchUp() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
        return;
      }
      informationBatchUp({ ids: this.ids.join(',') }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    // 批量下线
    handleBatchDown() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
        return;
      }
      informationBatchDown({ ids: this.ids.join(',') }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    // 批量删除
    handleBatchDelete() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
        return;
      }
      informationBatchDelete({ ids: this.ids.join(',') }).then(res => {
        if (res.resCode == 200) {
          this.informationList();
          this.message('成功', 'success');
        }
      });
    },

    //获取表格数据
    informationList() {
      informationListPage(this.searchData).then(res => {
        if (res.resCode == 200) {
          this.issueData = res.resObject.list;
          this.totalCount = res.resObject.totalCount;
        }
      });
    },
    //错误、成功提示
    message(message, type) {
      Message.closeAll();
      Message({
        message: message,
        type: type,
        duration: 5 * 1000,
      });
    },
  },

  filters: {
    indexPic(val) {
      return val.split(',')[0];
    },
    position(val) {
      let positionMap = {
        1: '默认',
        2: '置顶',
        3: 'BANNER_1',
        4: 'BANNER_2',
        5: 'BANNER_3',
      };
      return positionMap[val];
    },
  },
};
</script>

<style lang="scss" scoped>
.issue {
  overflow: auto;
  padding-bottom: 0;

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
