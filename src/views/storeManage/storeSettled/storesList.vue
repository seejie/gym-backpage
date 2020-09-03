<template>
  <div class="selfAdvanceRecord ticketListHeader">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form
        :inline="true"
        ref="refname"
        :model="searchData"
        class="demo-form-inline"
        label-width="130px"
        style="width:100%"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item prop="name" label="搜索名称">
              <el-input v-model="searchData.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="unitStatus" label="状态">
              <el-select placeholder="请选择" v-model="searchData.unitStatus" clearable>
                <el-option label="已上线" value="2"></el-option>
                <el-option label="已下线" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="claimStatus" label="认领状态">
              <el-select placeholder="请选择" v-model="searchData.claimStatus" clearable>
                <el-option label="未认领" :value="0"></el-option>
                <el-option label="待审核" :value="1"></el-option>
                <el-option label="已认领" :value="2"></el-option>
                <el-option label="已驳回" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="createTime" label="查询时间">
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
            <el-form-item label="地区筛选" prop="provinceCity">
              <area-cascader
                v-model="searchData.provinceCity"
                :data="pcaa"
                aria-placeholder="省市"
                :level="1"
                style="width: 218px;"
              ></area-cascader>
              <!-- <area-select v-model="formInline.provinceCity" type="text" :data="pcaa" :level='2'></area-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品类类型" prop="category">
              <el-select v-model="searchData.category" placeholder="请选择一级分类">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="showEntrust" :span="8">
            <el-form-item label="接受委托" prop="isOpenEntrustSell">
              <el-select v-model="searchData.isOpenEntrustSell" placeholder="请选择">
                <el-option
                  v-for="(item,index) in entrustSellList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
        <el-button size="small" @click="goAddStore" type="primary">创建店铺</el-button>
        <el-button>批量上线</el-button>
        <el-button>批量下线</el-button>
        <el-button @click="storeDelete">批量删除</el-button>
        <el-button>批量导入</el-button>
        <el-button>批量导出</el-button>
      </div>
      <!--表格-->
      <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50px"></el-table-column>
        <el-table-column prop="name" label="商铺名称" width="160px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.releaseLoc !== 1" size="mini">置顶</el-tag>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="商铺ID"></el-table-column>
        <el-table-column prop="isOpenEntrustSell" label="可委托" v-if="showEntrust">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isOpenEntrustSell"
              disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="category" :formatter="categoryFormatter" label="网点类型"></el-table-column>
        <el-table-column prop="unitStatus" label="上线状态">
          <template slot-scope="scope">
            <span v-if="scope.row.unitStatus==3">草稿</span>
            <span v-if="scope.row.unitStatus==2">上线</span>
            <span v-if="scope.row.unitStatus==1">下线</span>
          </template>
        </el-table-column>
        <el-table-column prop="defaultAccount" label="管理员" width="100px"></el-table-column>
        <el-table-column prop="address" label="地址" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.provinceName||''+''+scope.row.cityName||''+''+scope.row.areaName||''+''+scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="100px"></el-table-column>
        <el-table-column prop="claimAmount" label="认领费用" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.claimAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="claimStatus" label="认领状态">
          <template slot-scope="scope">
            <span v-if="scope.row.claimStatus==0">未认领</span>
            <span v-if="scope.row.claimStatus==1">待审核</span>
            <span v-if="scope.row.claimStatus==2">已认领</span>
            <span v-if="scope.row.claimStatus==3">已驳回</span>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus==1">待支付</span>
            <span v-else-if="scope.row.payStatus==2">支付成功</span>
            <span v-else-if="scope.row.payStatus==4">支付失败</span>
            <span v-else>无需线上支付</span>
          </template>
        </el-table-column>
        <el-table-column prop="open" label="营业状态" width="100px">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.open"
              @change="openClick(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="showOnMap" label="地图显示" width="100px">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showOnMap"
              @change="onMapClick(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>-->
        <el-table-column width="240" label="操作">
          <template slot-scope="scope">
            <!-- 待审核状态 可以审核 -->
            <template v-if="[1].includes(scope.row.claimStatus)">
              <el-button type="text" size="small" @click="storeCheckClaim(2,scope.row,)">认领通过</el-button>
              <el-button type="text" size="small" @click="storeCheckClaim(3,scope.row)">认领驳回</el-button>
            </template>
            <el-button
              type="text"
              v-if="scope.row.releaseLoc==1"
              @click="storeSetTop(2,scope.row)"
            >置顶</el-button>
            <el-button type="text" v-else @click="storeSetTop(1,scope.row)">取消置顶</el-button>
            <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
            
            <el-button
              type="text"
              v-if="scope.row.unitStatus==2 && [2].includes(scope.row.claimStatus)"
              size="small"
              @click="storeSetStatus(1,scope.row)"
            >下线</el-button>
            <el-button
              type="text"
              v-if="scope.row.unitStatus==1 && [2].includes(scope.row.claimStatus)"
              size="small"
              @click="storeSetStatus(2,scope.row)"
            >上线</el-button>

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
} from '@/api/store/index';
export default {
  name: 'selfAdvanceRecord',
  data() {
    return {
      showEntrust: false,
      searchData: {
        name: '',
        unitStatus: '',
        provinceCity: [],
        claimStatus: '',
        category: '',
        createTime: [],
        isOpenEntrustSell: '',
      },
      entrustSellList: [
        {
          label: '否',
          value: 0,
        },
        {
          label: '是',
          value: 1,
        },
      ],
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
    this.getSetsData();
    this.getWokerList();
  },
  methods: {
    getSetsData() {
      // 277
      this.$ajax
        .get(`/storemanager/map-setting/get?unitId=4&channelType=11`)
        .then(res => {
          if (res.resObject && res.resCode === 200) {
            this.showEntrust = res.resObject.isOpenEntrustSell || 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
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
      storeList({ unitType: '32' }).then(res => {
        if (res.resCode === 200) {
          this.typeList = res.resObject.list;
        }
      });
    },
    // 查询列表数据
    getWokerList() {
      const params = {
        unitType: '32',
        name: this.searchData.name,
        unitStatus: this.searchData.unitStatus,
        provinceId: this.searchData.provinceCity[0], // 省-id
        cityId: this.searchData.provinceCity[1], // 城市-id
        areaId: this.searchData.provinceCity[2], // 县区-id
        regTimeBegin: this.searchData.createTime[0],
        claimStatus: this.searchData.claimStatus,
        regTimeEnd: this.searchData.createTime[1],
        category: this.searchData.category,
        pageNum: this.currentPage,
        isOpenEntrustSell: this.searchData.isOpenEntrustSell,
        pageSize: this.currentPageSize,
      };
      this.$ajax
        .get('/storemanager/store/list', {
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
    storeDelete() {
      console.log(this.multipleSelection);
      const multipleSelection = [];
      this.multipleSelection.map(function (itmes, index) {
        multipleSelection.push(itmes.id);
      });
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
      this.$router.push('/storemanage/storeadd');
    },
    // 编辑
    editClick(scope) {
      this.$router.push({
        name: `storeadd`,
        query: {
          id: scope.id,
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
      // let ids = [],
      //   showOnMap;
      // ids[0] = scope.id;
      // if (scope.showOnMap == '1') {
      //   showOnMap = 0;
      // } else {
      //   showOnMap = 1;
      // }
      // console.log('scope.open', scope.open);
      // setMapStatus({ ids, showOnMap: showOnMap }).then(res => {
      //   if (res.resCode == 200) {
      //     this.getWokerList();
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success',
      //     });
      //   }
      // });
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
        claimStatus: '',
        category: '',
        createTime: [],
        isOpenEntrustSell: '',
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
<style lang="scss" scoped>
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
}
.demo-form-inline {
  .el-form-item {
    display: flex;
    .el-form-item__content {
      width: 100%;
      .el-select,
      .el-date-editor {
        @extend .el-form-item__content;
      }
    }
  }
}
</style>



