<template>
  <div class="container">
    <div class="from-wrap">
      <el-form :inline="true" ref="formInline" label-width="80px" label-position="left" :model="searchData">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="搜索标题">
              <el-input v-model="searchData.title" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布状态">
              <el-select placeholder="请选择" v-model="searchData.publishStatus">
                <el-option label="草稿（预览）" value="1"></el-option>
                <el-option label="未发布" value="2"></el-option>
                <el-option label="已发布" value="3"></el-option>
                <el-option label="已下线" value="4"></el-option>
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
          <el-col :span="8" :offset="16">
            <el-form-item style="text-align: right">
              <el-button type="primary" @click="searchBtn">搜索</el-button>
              <el-button @click="dataInit">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <div slot="header" class="clearfix">
        <el-button type="primary">
          <router-link :to="{ name: 'websiteCaseAdd', params: { id: -1 } }">
            发布案例
          </router-link>
        </el-button>
        <el-button @click="handleBatchUp()">批量上线</el-button>
        <el-button @click="handleBatchDown()">批量下线</el-button>
        <el-button @click="handleBatchDelete()">批量删除</el-button>
      </div>

      <el-table :data="listData" style="width: 100%;" @selection-change="selectionchange">
        <el-table-column type="selection" width="40px"></el-table-column>
        <el-table-column type="expand" width="30px">
          <template slot-scope="scope"> 摘要：{{ scope.row.abstractInfo }} </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="340px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px" v-if="scope.row.position == 2">
              置顶
            </el-tag>
            <el-avatar shape="square" size="medium" :src="scope.row.indexPic | indexPic"></el-avatar>
            <span style="margin-left:10px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" label="发布状态">
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus == 1">草稿</span>
            <span v-if="scope.row.publishStatus == 2">待发布</span>
            <span style="color: #71b933" v-if="scope.row.publishStatus == 3">
              已上线
            </span>
            <span style="color: #ff5c7a" v-if="scope.row.publishStatus == 4">
              已下线
            </span>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">
            {{ $moment(scope.row.publishTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  name: 'websiteCaseAdd',
                  params: { id: scope.row.id, data: scope.row },
                }"
              >
                编辑
              </router-link>
            </el-button>
            <el-button type="text" v-if="scope.row.publishStatus == 3" @click="handleSingleDown(scope.row)">
              下线
            </el-button>
            <el-button type="text" v-if="scope.row.publishStatus == 4" @click="handleSingleUp(scope.row)">
              上线
            </el-button>
            <el-button type="text" @click="handleSingleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="listData.length != 0"
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
import Api from '@/api/website/case';
import Pagination from '@/components/Pagination';
import { Message } from 'element-ui';

export default {
  data() {
    return {
      searchData: {
        title: '',
        publishStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
      },
      searchTime: '',
      listData: [],
      totalCount: 0,
      pageSizes: [10, 20, 30],
      ids: [],
    };
  },

  components: {
    Pagination,
  },

  created() {
    this.loadListData();
  },

  methods: {
    loadListData() {
      Api.listPage(this.searchData).then(res => {
        if (res.resCode == 200) {
          this.listData = res.resObject.list;
          this.totalCount = res.resObject.totalCount;
        }
      });
    },

    searchBtn() {
      this.searchData.pageNum = 1;
      if (this.searchTime != null) {
        this.searchData.startTime = this.searchTime[0];
        this.searchData.endTime = this.searchTime[1];
      } else {
        this.searchData.startTime = '';
        this.searchData.endTime = '';
      }

      this.loadListData();
    },

    handleSingleUp(row) {
      this.ids = [row.id];
      this.handleBatchUp();
    },

    handleBatchUp() {
      const paylaod = {
        ids: this.ids.join(','),
      };
      Api.batchUp(paylaod).then(res => {
        if (res.resCode == 200) {
          this.loadListData();
          this.message('成功', 'success');
        }
      });
    },

    handleSingleDown(row) {
      this.ids = [row.id];
      this.handleBatchDown();
    },

    handleBatchDown() {
      const paylaod = {
        ids: this.ids.join(','),
      };
      Api.batchDown(paylaod).then(res => {
        if (res.resCode == 200) {
          this.loadListData();
          this.message('成功', 'success');
        }
      });
    },

    handleBatchDelete() {
      const paylaod = {
        ids: this.ids.join(','),
      };
      Api.batchDelete(paylaod).then(res => {
        if (res.resCode == 200) {
          this.loadListData();
          this.message('成功', 'success');
        }
      });
    },

    handleSingleDelete(row) {
      const paylaod = {
        id: row.id,
      };
      Api.delete(paylaod).then(res => {
        if (res.resCode == 200) {
          this.loadListData();
          this.message('成功', 'success');
        }
      });
    },

    // 分页
    currentChange(val) {
      this.searchData.pageNum = val;
      this.loadListData();
    },

    sizeChange(val) {
      this.searchData.pageSize = val;
      this.loadListData();
    },

    // 全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },

    dataInit() {
      this.searchData = {
        title: '',
        publishStatus: '',
        startTime: '',
        endTime: '',
      };
      this.searchTime = '';
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

  filters: {
    indexPic(val) {
      return val ? val.split(',')[0] : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
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
