<template>
  <div class="zplist-wrapper">
    <div class="header-wrapper">
      <div class="h-w-search">
        <el-form
          :inline="true"
          ref="searchFormRef"
          :model="searchFormData"
          class="form-inline"
          style="width:100%"
        >
          <el-row>
            <el-col :span="7">
              <el-form-item label="搜索名称：" label-width="100" prop="title">
                <el-input v-model="searchFormData.title" type="text" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="发布状态：" label-width="100" prop="status">
                <el-select placeholder="请选择" v-model="searchFormData.status">
                  <el-option label="待审核" value="1"></el-option>
                  <el-option label="立即发布/已上线" value="2"></el-option>
                  <el-option label="草稿" value="3"></el-option>
                  <el-option label="已下线" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="创作时间：" label-width="100" prop="createTime">
                <el-date-picker
                  v-model="searchFormData.createTime"
                  type="datetimerange"
                  range-separator="~"
                  value-format="yyyy-MM"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="作者名称：" label-width="100" prop="masterName">
                <el-input v-model="searchFormData.masterName" type="text" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="品类筛选：" label-width="100">
                <el-row>
                  <el-col :span="11">
                    <el-select
                      placeholder="选择一级分类"
                      v-model="searchFormData.categoryId1"
                      @change="handleCategoryId1Change"
                    >
                      <el-option
                        v-for="(item,index) in categoryId1List"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="1" style="text-align:center;color:#606266;margin:0 2px;">-</el-col>
                  <el-col :span="11">
                    <el-select placeholder="选择二级分类" v-model="searchFormData.categoryId2">
                      <el-option
                        v-for="(item,index) in categoryId2List"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="收藏场馆：" label-width="100" prop="storeName">
                <el-input v-model="searchFormData.storeName" type="text" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="bindClickDoSearch()">搜索</el-button>
                <el-button @click="doResetForm('searchFormRef')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button size="small" @click="bindClickCreate" type="primary">创建作品</el-button>
        <!--<el-button>批量导入</el-button>-->
        <el-button @click="bindClickOnLine">批量上线</el-button>
        <el-button @click="bindClickOffLine">批量下线</el-button>
        <el-button @click="bindClickDelete">批量删除</el-button>
        <!--<el-button>导出</el-button>-->
      </div>
      <!--表格-->
      <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50px"></el-table-column>
        <el-table-column prop="name" label="作品名称" width="150px">
          <template slot-scope="scope">
            <div class="table-imgcolumn">
              <img v-if="scope.row.coverImage && scope.row.coverImage" :src="scope.row.coverImage" />
              <span class="name">{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creationDate" label="创作时间"></el-table-column>
        <el-table-column prop="status" label="发布状态">
          <template slot-scope="scope">
            <!-- {{scope.row.status==2?'已发布':'草稿'}} -->
            <!-- 状态：1 - 待审核；2 - 立即发布/已上线；3 - 草稿；4 - 已下线 -->
            <span v-if="scope.row.status==1">待审核</span>
            <span v-else-if="scope.row.status==2">已上线</span>
            <span v-else-if="scope.row.status==3">草稿</span>
            <span v-else-if="scope.row.status==4">已下线</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryId1Name" label="分类"></el-table-column>
        <el-table-column prop="master.name" label="作者"></el-table-column>
        <el-table-column prop="store.name" label="馆藏"></el-table-column>
        <el-table-column prop="releaseTime" label="发布时间"></el-table-column>
        <el-table-column prop="faver" label="收藏量"></el-table-column>
        <el-table-column prop="viewer" label="点击量"></el-table-column>
        <el-table-column width="240" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==2"
              type="text"
              size="small"
              @click="bindClickOffLine(scope.row)"
            >下线</el-button>
            <el-button
              v-if="scope.row.status==4"
              type="text"
              size="small"
              @click="bindClickOnLine(scope.row)"
            >上线</el-button>
            <el-button type="text" size="small" @click="bindClickEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="bindClickDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import request from '@/utils/request';
import to from '@/api/to';
import { list, del, status } from '@/api/zuopin';
import { worksCategoryQueryAll } from '@/api/zuopin/cateory.js';
export default {
  name: 'zuopinlist',
  desc: '作品管理列表',
  data() {
    return {
      multipleSelection: [],
      categoryId1List: [],
      categoryId2List: [],
      searchFormData: {
        title: undefined,
        status: undefined,
        createTime: undefined,
        storeName: undefined,
        categoryId1: undefined,
        categoryId2: undefined,
        masterName: undefined,
      },
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.getTableData();
    this.getWorksCategory(0);
  },
  methods: {
    async getTableData() {
      // 获取详情数据
      this.searchFormData.creationDateMin = this.searchFormData.createTime
        ? this.searchFormData.createTime[0].split('-').join('')
        : undefined;
      this.searchFormData.creationDateMax = this.searchFormData.createTime
        ? this.searchFormData.createTime[1].split('-').join('')
        : undefined;
      delete this.searchFormData.createTime;
      const { resCode, resObject } = await to(
        list({
          ...this.searchFormData,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNum,
        })
      );
      if (resCode === 200 && resObject && resObject.list) {
        this.tableData = resObject.list;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    bindClickCreate() {
      // 创建作品
      this.$router.push('addzuopin');
    },
    bindClickEdit(row) {
      // 编辑
      this.$router.push({ name: 'addzuopin', query: { id: row.id } });
    },
    async bindClickDelete(row) {
      // 批量删除
      let ids = [];
      // 搜索
      if (row && row.id) {
        // 单条记录
        ids.push(row.id);
      } else {
        ids = this.multipleSelection.map(item => {
          return item.id;
        });
      }
      const { resCode, msg } = await to(
        del({
          ids: ids,
        })
      );
      if (resCode === 200) {
        this.$message(msg || '成功');
        this.getTableData();
      }
    },
    async bindClickOnLine(row) {
      // 上线
      let ids = [];
      if (row && row.id) {
        // 单条记录
        ids.push(row.id);
      } else {
        ids = this.multipleSelection.map(item => {
          return item.id;
        });
      }
      const { resCode, msg } = await to(
        status({
          ids: ids,
          status: 2,
        })
      );
      if (resCode === 200) {
        this.$message(msg || '成功');
        this.getTableData();
      }
    }, // 下线
    async bindClickOffLine(row) {
      let ids = [];
      if (row && row.id) {
        // 单条记录
        ids.push(row.id);
      } else {
        ids = this.multipleSelection.map(item => {
          return item.id;
        });
      }
      const { resCode, msg } = await to(
        status({
          ids: ids,
          status: 4,
        })
      );
      if (resCode === 200) {
        this.$message(msg || '成功');
        this.getTableData();
      }
    },
    bindClickDoSearch(row) {
      this.getTableData();
    },
    doResetForm(refname) {
      // 重置
      this.$refs[refname].resetFields();
      this.searchFormData.categoryId1 = '';
      this.searchFormData.categoryId2 = '';
      this.searchFormData.creationDateMin = '';
      this.searchFormData.creationDateMax = '';
      this.getTableData();
    },
    getWorksCategory(parentId = 0) {
      worksCategoryQueryAll({ parentId: parentId }).then(res => {
        if (res.resCode === 200) {
          if (parentId === 0) {
            this.categoryId1List = res.resObject.list;
          } else {
            this.categoryId2List = res.resObject.list;
          }
        }
      });
    },
    handleCategoryId1Change(val) {
      this.searchFormData.categoryId2 = '';
      this.categoryId2List = [];
      this.getWorksCategory(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.zplist-wrapper {
  width: 100%;
  // .box-card {
  //   width: 100%;
  // overflow: auto;
  .header-wrapper {
    overflow: auto;
    .h-w-search {
      width: 100%;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      padding: 20px;
      padding-bottom: 0;
      /deep/ .el-form-item {
        margin-bottom: 10px;
        width: 100%;
        .el-form-item__content {
          width: calc(100% - 100px);
          .el-select {
            width: 100%;
            flex: 1;
          }
          .el-range-editor {
            width: 100%;
          }
        }
      }
    }
    // }
  }
  .card {
    height: 100%;
  }
  .table-imgcolumn {
    display: flex;
    height: 40px;
    line-height: 40px;
    img {
      flex: 0 0 40px;
      width: 40px;
      height: 100%;
      border-radius: 40px;
      padding-right: 3px;
    }
    .name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }
}
</style>
