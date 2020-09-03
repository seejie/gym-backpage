<template>
  <div class="selfAdvanceRecord ticketListHeader">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form
        :inline="true"
        ref="refname"
        :model="searchData"
        label-width="130px"
        class="demo-form-inline"
        style="width:100%"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item prop="name" label="搜索名称">
              <el-input v-model="searchData.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="unitStatus" label="审核状态">
              <el-select placeholder="请选择" v-model="searchData.unitStatus" clearable>
                <el-option label="已上线" value="2"></el-option>
                <el-option label="已下线" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="searchData.mobile" type="number" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="createTime" label="注册时间">
              <el-date-picker
                v-model="searchData.createTime"
                type="datetimerange"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流派类型">
              <el-select v-model="searchData.category" placeholder="请选择流派类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.unitId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区筛选" prop="provinceCity">
              <area-cascader
                v-model="searchData.provinceCity"
                :data="pcaa"
                aria-placeholder="省市"
                :level="1"
              ></area-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="getStoreList()">搜索</el-button>
              <el-button @click="resetForm('refname')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button size="small" @click="goAddStore" type="primary">添加大师</el-button>
        <!--<el-button>批量导入</el-button>-->
        <el-button @click="storeSetStatus(2)">审核通过</el-button>
        <el-button @click="storeSetStatus(3)">驳回</el-button>
        <el-button @click="storeDelete()">批量删除</el-button>
        <!--<el-button>导出</el-button>-->
      </div>
      <!--表格-->
      <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50px"></el-table-column>
        <el-table-column prop="name" label="大师名称" width="150px">
          <template slot-scope="scope">
            <div class="master-info">
              <img
                v-if="scope.row.coverImage && scope.row.coverImage.length"
                :src="scope.row.coverImage[0].url"
              />
              <span class="name">{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" :formatter="categoryFormatter" label="流派"></el-table-column>
        <el-table-column prop="provinceName" label="归属地区" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.provinceName||''}}{{scope.row.cityName||''}}{{scope.row.areaName||''}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="createTime"
          label="大师介绍"
          width="640px"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.introduction"></div>
          </template>
        </el-table-column>-->

        <el-table-column prop="jobInfo" label="职务信息" width="200px" />
        <el-table-column prop="mobile" label="关联手机号" width="110px"></el-table-column>
        <el-table-column prop="fans" label="粉丝数" width="100px"></el-table-column>
        <el-table-column prop="createTime" label="申请日期" width="100px"></el-table-column>
        <el-table-column prop="status" label="上线状态">
          <template slot-scope="scope">
            <span v-if="scope.row.unitStatus==3">草稿</span>
            <span v-if="scope.row.unitStatus==2">上线</span>
            <span v-if="scope.row.unitStatus==1">下线</span>
          </template>
        </el-table-column>
        <el-table-column width="240" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.releaseLoc==1"
              @click="storeSetTop(2,scope.row)"
            >置顶</el-button>
            <el-button type="text" v-else @click="storeSetTop(1,scope.row)">取消置顶</el-button>
            <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
            <!-- 状态：-1 待审核；2 - 已上线；3 - 未通过；4 - 已下线； -->
            <el-button
              type="text"
              v-if="scope.row.status==2"
              size="small"
              @click="storeSetStatus(4,scope.row)"
            >下线</el-button>
            <el-button
              type="text"
              v-if="scope.row.status==4"
              size="small"
              @click="storeSetStatus(2,scope.row)"
            >上线</el-button>
            <el-button type="text" size="small" @click="storeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px"></div>
    </el-card>
    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        :page-sizes="[5, 10, 15]"
        :page-size.sync="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >></el-pagination>
    </div>
  </div>
</template>
<script>
import { pca, pcaa } from 'area-data';
import { AreaCascader } from 'vue-area-linkage';
import {
  storePass,
  storeList,
  storeSetOpen,
  setMapStatus,
  storeReject,
  storeDelete,
  storeSetStatus,
  storeCheckClaim,
  storeSetTop,
} from '@/api/master/index';
export default {
  name: 'selfAdvanceRecord',
  data() {
    return {
      unitType: 31, // 单位类型，必传：31-大师；32-店铺场馆；33-艺术场馆；34-艺术大师
      searchData: {
        name: '',
        unitStatus: '',
        provinceCity: [],
        createTime: [],
        category: '',
        mobile: '',
      },
      typeList: [],
      tableData: [],
      currentPage: 1,
      totalCount: 1,
      currentPageSize: 10,
      title: '新建账号',
      pca: pca,
      pcaa: pcaa,
    };
  },
  mounted() {
    this.storeList();
    this.getWokerList();
  },
  methods: {
    categoryFormatter(store) {
      if (!store.category) {
        return '';
      }
      for (var i in this.typeList) {
        if (this.typeList[i].id === store.category) {
          return this.typeList[i].name;
        }
      }
      return '';
    },
    storeList() {
      storeList({ unitType: this.unitType }).then(res => {
        if (res.resCode === 200) {
          this.typeList = res.resObject.list;
        }
      });
    },
    // 查询列表数据
    getWokerList() {
      const params = {
        unitType: this.unitType,
        name: this.searchData.name,
        unitStatus: this.searchData.unitStatus,
        provinceId: this.searchData.provinceCity[0], // 省-id
        cityId: this.searchData.provinceCity[1], // 城市-id
        areaId: this.searchData.provinceCity[2], // 县区-id
        regTimeBegin: this.searchData.createTime[0],
        regTimeEnd: this.searchData.createTime[1],
        category: this.searchData.category,
        mobile: this.searchData.mobile,
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
      };
      this.$ajax
        .get('/storemanager/master/list', {
          params: params,
        })
        .then(res => {
          if (res.resCode === 200) {
            this.tableData = res.resObject.list;
            this.totalCount = res.resObject.totalCount;
          }
        });
    },
    storeSetStatus(status, scope) {
      const multipleSelection = [];
      if (scope) {
        multipleSelection.push(scope.id);
      } else {
        this.multipleSelection.map(function (itmes, index) {
          multipleSelection.push(itmes.id);
        });
      }
      const datas = {
        ids: multipleSelection,
        unitStatus: status,
      };
      storeSetStatus(datas).then(res => {
        if (res.resCode === 200) {
          this.getWokerList();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        }
      });
    },
    // 认领审核
    storeCheckClaim(status, scope) {
      const multipleSelection = [];
      if (scope) {
        multipleSelection.push(scope.id);
      } else {
        this.multipleSelection.map(function (itmes, index) {
          multipleSelection.push(itmes.id);
        });
      }
      const datas = {
        storeIds: multipleSelection,
        claimStatus: status,
      };
      storeCheckClaim(datas).then(res => {
        if (res.resCode === 200) {
          this.getWokerList();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        }
      });
    },
    // 批量删除
    storeDelete(scope) {
      const multipleSelection = [];
      if (scope) {
        multipleSelection.push(scope.id);
      } else {
        this.multipleSelection.map(function (itmes, index) {
          multipleSelection.push(itmes.id);
        });
      }
      const datas = {
        ids: multipleSelection,
      };
      storeDelete(datas).then(res => {
        if (res.resCode === 200) {
          this.getWokerList();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        }
      });
    },
    // 审核通过
    auditPass(scope) {},
    goAddStore() {
      this.$router.push('/storemanage/masteradd');
    },
    // 编辑
    editClick(scope) {
      this.$router.push({
        name: `masteradd`,
        query: {
          masterId: scope.id,
        },
      });
    },
    // 下线
    offlineClick(scope) {},
    // 置顶
    storeSetTop(status, scope) {
      const ids = [];
      ids[0] = scope.id;
      storeSetTop({ ids, releaseLoc: status }).then(res => {
        if (res.resCode === 200) {
          this.getWokerList();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        }
      });
    },
    // 营业状态
    openClick(scope) {
      const ids = [scope.id];
      storeSetOpen({ ids, open: scope.open }).then(res => {
        if (res.resCode === 200) {
          this.getWokerList();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        }
      });
    },
    onMapClick(scope) {
      let ids = [],
        showOnMap;
      ids[0] = scope.id;
      if (scope.showOnMap == '1') {
        showOnMap = 0;
      } else {
        showOnMap = 1;
      }
      console.log('scope.open', scope.open);
      setMapStatus({ ids, showOnMap: showOnMap }).then(res => {
        if (res.resCode == 200) {
          this.getWokerList();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getStoreList() {
      this.getWokerList();
    },

    resetForm(refname) {
      this.$refs[refname].resetFields();
      this.searchData = {
        name: '',
        unitStatus: '',
        provinceCity: [],
        createTime: [],
        category: '',
        mobile: '',
      };
      this.getWokerList();
    },
    // 详情
    detail(item) {
      console.log(item);
      this.detailShow = true;
    },
    // 批量核销
    deleteRow() {
      console.log('批量核销');
    },
    // 批量退款
    allDown() {
      console.log('批量下线');
    },
    // 导出
    allUp() {
      console.log('批量上线');
    },
    handleSizeChange(val) {
      this.getWokerList();
    },
    handleCurrentChange(val) {
      this.getWokerList();
    },
    // 创建优惠券
    addCard() {
      this.$router.push({
        name: 'storeadd',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.selfAdvanceRecord {
  @extend %fill;
  overflow: auto;
  .card {
    height: 100%;
    .from-wrap {
      width: 100%;
      // height: 60px;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      padding: 20px;
      padding-bottom: 0;
      /deep/ .el-form-item {
        margin-bottom: 40px;
      }
    }
    .table-wrap {
      overflow: auto;
    }
    .content {
      width: 100%;
      height: auto;
      padding: 20px;
      &-top {
        height: auto;
        width: 100%;
        display: flex;
        .img-wrap {
          width: 110px;
        }
        .detail-info {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          font-size: 16px;
          justify-content: space-between;
          div {
            height: 1em;
            height: 1em;
            margin-bottom: 1.5em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .left {
            width: 35%;
          }
          .right {
            width: 20%;
          }
          .center {
            width: 45%;
          }
        }
      }
      &-bottom {
        width: 100%;
        .rote {
          height: 80px;
          line-height: 80px;
          display: flex;
          align-items: center;
          span {
            font-size: 16px;
            font-weight: 500;
            margin-right: 20px;
          }
        }
        .suggest {
          width: 100%;
        }
      }
    }
    .pagination-wrap {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>

<style lang="scss" scoped>
.ticketListHeader {
  @extend %fill;
  // overflow: auto;
  .from-wrap {
    width: 100%;
    // height: 60px;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 20px;
    padding-bottom: 0;
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
  .op-button-wrap {
    background: #f5f7fa;
    padding-left: 20px;
    border-left: 1px solid #e5e9ef;
    border-right: 1px solid #e5e9ef;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .table-wrap {
    // max-height: 650px;
    overflow: auto;
  }
  .pagination-wrap {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .content {
    height: auto;
    max-height: 600px;
    overflow: auto;
    /deep/ .el-select {
      width: 100px;
    }
  }
}
</style>
<style lang="scss">
.ticketListHeader {
  .area-select.large {
    width: 100%;
    line-height: 16px;
  }
  .area-select.medium {
    width: 85px;
  }
  .area-select {
    line-height: 16px;
  }
  .area-select .area-selected-trigger {
    color: #ccc9d6;
  }
  .area-select .area-select-icon {
    display: none;
  }
  .master-info {
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
