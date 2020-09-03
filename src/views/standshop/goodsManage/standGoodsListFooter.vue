<template>
  <el-card class="card">
    <div class="button-wrap">
      <el-button
        type="primary"
        @click="
          () => {
            this.$router.push({ name: 'addGood', params: { type: 'add' } });
          }
        "
        >创建商品</el-button
      >
      <el-button @click="auditShow = true">审核设置</el-button>
      <el-button :disabled="multipleSelection.length == 0" @click="publishMore(1)">批量上线</el-button>
      <el-button :disabled="multipleSelection.length == 0" @click="publishMore(0)">批量下线</el-button>
      <el-button type="danger" @click="deleteMore" :disabled="multipleSelection.length == 0">删除</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="image" label="商品图片">
        <template slot-scope="scope">
          <div class="title">
            <el-tag v-if="scope.row.sort == 1" type="">置顶</el-tag>
            <div class="img-wrap">
              <img :src="scope.row.indexPic && scope.row.indexPic.split(',')[0]" alt="" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
        <template slot-scope="scope">
          <div class="title">
            <div class="text-wrap">
              <p class="oneTitle">{{ scope.row.name }}</p>
              <p class="twoTitle">{{ scope.row.subTitle }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="商品编号"> </el-table-column>
      <el-table-column prop="currentPrice" label="销售价"> </el-table-column>

      <el-table-column prop="publishStatus" label="发布状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.publishStatus" :active-value="1" :inactive-value="0" disabled> </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌"> </el-table-column>
      <el-table-column prop="factoryPlace" label="产地溯源"> </el-table-column>
      <el-table-column prop="productCategoryName" label="分类"> </el-table-column>
      <el-table-column prop="unitName" label="发布单位"> </el-table-column>
      <el-table-column prop="publishTime" label="发布时间">
        <template slot-scope="scope">
          {{ $moment(scope.row.publishTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="visitNum" label="访问量"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{ $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            type="success"
            style="color: #409eff; margin-right: 5px;"
            @click="
              () => {
                $router.push({ name: 'addGood', params: { type: 'edit', id: scope.row.id } });
              }
            "
            >编辑</el-link
          >
          <el-dropdown @command="controlCommand($event, scope.row)">
            <el-link type="success" style="color: #409eff;" disabled>
              更多
              <i class="el-icon-arrow-down"></i>
            </el-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="u">{{ scope.row.publishStatus === 1 ? '下线' : '上线' }}</el-dropdown-item>
              <!-- <el-dropdown-item command="f">{{scope.row.sort===1?'取消置顶':'置顶'}}</el-dropdown-item> -->
              <el-dropdown-item command="d">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="current"
        :page-sizes="pageSizesRange"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="审核设置" :visible.sync="auditShow">
      <el-form :model="auditForm" ref="auditForm">
        <el-form-item label="是否启用" label-width="100" prop="status">
          <el-radio-group v-model="auditForm.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditShow = false">取 消</el-button>
        <el-button type="primary" @click="saveAudit('auditForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  shopProductPage,
  shopProductPublish,
  shopConfigSetting,
  shopProductDelByIds,
} from '@/api/standshop/goodsManage';

import eventVue from './eventVue.js';
import { pageSizesRange, deleteEmptyParams } from '../commonText.js';

export default {
  name: 'myTable',
  data() {
    return {
      headerParams: {},
      pageSizesRange,
      publishStatusText: {
        0: '下架',
        1: '上架',
        2: '待审核',
      },
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      multipleSelection: [],
      auditForm: {
        status: 1,
      },
      auditShow: false,
      brandList: [],
    };
  },
  created() {
    this.getList();
    this.bbtn();
  },
  computed: {},
  methods: {
    async getList(params) {
      const newParams = {
        pageNum: this.current,
        pageSize: 10,
        name: '',
        publishStatus: '',
        sort: '',
        unit: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        queryStartTime: '',
        queryEndTime: '',
        productCategoryId: '',
        brandId: '',
        ...this.headerParams,
        ...params,
      };

      shopProductPage(deleteEmptyParams(newParams)).then(res => {
        if (res.resCode == 200) {
          this.tableData = res.resObject.list;
          this.current = res.resObject.pageNum;
          this.pageSize = res.resObject.pageSize;
          this.total = res.resObject.totalCount;
          this.multipleSelection = [];
        }
      });
    },
    sizeChange(val) {
      this.pageSize = val;
      this.current = 1;
      this.getList({ limit: val, page: 1 });
    },
    currentChange(val) {
      this.current = val;
      this.getList({ page: val, limit: this.pageSize });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 保存审核设置
    saveAudit(formName) {
      let params = {
        ...this[formName],
        id: 1,
      };

      shopConfigSetting(params).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList();
          this.auditShow = false;
        }
      });
    },

    // 删除事件
    async onDelete(ids) {
      shopProductDelByIds({ ids: ids }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          });
          this.getList();
        }
      });
    },

    //多删
    deleteMore() {
      const ids = this.multipleSelection.map(i => {
        return i.id;
      });
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        this.onDelete(ids);
      });
    },

    //上下线事件
    async onPublish(ids, publishStatus) {
      shopProductPublish({
        shopProductIds: ids,
        publishStatus,
      }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
          });
          this.getList();
        }
      });
    },

    //多线
    publishMore(publishStatus) {
      const ids = this.multipleSelection.map(i => {
        return i.id;
      });
      this.onPublish(ids, publishStatus);
    },

    // 删除-置顶-上线
    controlCommand(command, row) {
      if (command == 'd') {
        this.$confirm('确定删除该数据？', '删除信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        }).then(() => {
          this.onDelete([row.id]);
        });
      }
      if (command == 'f') {
        // 置顶操作
      }
      if (command == 'u') {
        this.onPublish([row.id], row.publishStatus === 1 ? 0 : 1); //1-上线
      }
    },
    bbtn() {
      eventVue.$on('myFun', params => {
        this.headerParams = params;
        this.getList(params);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.card {
  /deep/ .el-card__body {
    // padding-top: 0;
  }
  .button-wrap {
    height: 60px;
    margin-top: -20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  /deep/ .title {
    // width: 100%;
    height: auto;
    display: flex;
    align-items: center;

    .img-wrap {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .text-wrap {
      overflow: hidden;
      .oneTitle {
        font-weight: 650;
        font-size: 18px;
      }
      .twoTitle {
        font-size: 14px;
        color: #999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  /deep/ .avatar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    padding-left: 5px;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .pagination {
    text-align: right;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
