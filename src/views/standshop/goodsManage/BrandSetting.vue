<template>
  <div class="actve-label">
    <el-card>
      <!-- 表单 -->
      <div class="form-wrap">
        <el-form :inline="true" :model="lableFrom" class="demo-form-inline" ref="lableFrom">
          <el-form-item>
            <el-input placeholder="请输入关键词内容" v-model="lableFrom.brandName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="topSearh"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="primary" @click="topAdd">添加</el-button>
            <el-button type="danger" @click="deleteMore" :disabled="multipleSelection.length == 0">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <el-table :data="tableData" border="" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="brandLogo" label="品牌LOGO" width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <img :src="scope.row.brandLogo" alt="" width="30" height="30" />
            </template>
          </el-table-column>
          <el-table-column prop="brandName" label="品牌名称" width="280"></el-table-column>
          <el-table-column prop="brandNickname" label="品牌别名" width="200"></el-table-column>
          <el-table-column prop="brandSort" label="品牌排序" width="200">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.brandSort"
                :step="1"
                style="width:100%"
                step-strictly
                @change="changeSort($event, scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteOne(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="textAlign:right">
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
      </div>
    </el-card>
    <!-- 添加框 -->
    <el-dialog title="添加品牌" :visible.sync="addShow" :before-close="closeDialog" :close-on-click-modal="false">
      <el-form :model="addFrom" ref="addFrom" :rules="rules">
        <el-form-item label="品牌名称" label-width="100" prop="brandName">
          <el-input v-model="addFrom.brandName" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌别名" label-width="100" prop="brandNickname">
          <el-input v-model="addFrom.brandNickname" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100" prop="brandLogo">
          <!-- <el-input v-model="addFrom.brandLogo" placeholder="请输入" autocomplete="off"></el-input> -->
          <!-- <myUpload type="1:1" v-model="addFrom.brandLogo" :max= 1></myUpload> -->
          <img-include v-model="addFrom.brandLogo" :max="1" :cropper="cropper"></img-include>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="saveTag('addFrom')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { pageSizesRange } from '../commonText.js';
import ImgInclude from '@/components/CropImgInclue';
import { shopBrandSaveOrUpdate, shopBrandPage, shopBrandDelByIds } from '@/api/standshop/goodsManage';

export default {
  components: {
    ImgInclude,
  },
  data() {
    return {
      cropper: [
        {
          name: '品牌LOGO',
          ratio_x: 280,
          ratio_y: 280,
          ratio: 1,
          desc: '品牌LOGO',
        },
      ],
      pageSizesRange,
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      multipleSelection: [],
      lableFrom: {
        brandName: '', //搜索条件
      },
      rules: {
        brandName: [{ required: true, message: '请输入品牌名称' }],
      },
      addFrom: {
        brandName: '',
        brandNickname: '',
        brandLogo: {},
      },
      addShow: false, //添加标签
      brandId: '',
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList(params) {
      const newParams = {
        pageNum: this.current,
        pageSize: this.pageSize,
        brandName: this.lableFrom.brandName,
      };

      shopBrandPage(newParams).then(res => {
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
    //顶部搜索
    topSearh() {
      this.getList({ brandName: this.lableFrom.brandName, page: 1, limit: 10 });
    },

    // 修改排序
    changeSort(val, row) {
      let payload = {
        brandSort: val,
        brandId: row.brandId,
      };

      shopBrandSaveOrUpdate(payload).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList();
        }
      });
    },
    //顶部添加
    topAdd() {
      this.addShow = true;
      this.brandId = '';
      this.addFrom = {
        brandName: '',
        brandNickname: '',
        brandLogo: {},
      };
    },
    //删除事件
    async onDelete(ids) {
      shopBrandDelByIds({ ids: ids }).then(res => {
        if (res.resCode == 200) {
          this.$message({
            message: '操作成功!',
            type: 'success',
          });
          this.getList();
        }
      });
    },
    //多删
    deleteMore() {
      const ids = this.multipleSelection.map(i => {
        return i.brandId;
      });
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(res => {
        this.onDelete(ids);
      });
    },
    // 单删
    deleteOne(row) {
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(res => {
        this.onDelete([row.brandId]);
      });
    },
    //保存
    saveTag(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            ...this[formName],
            brandLogo: this[formName].brandLogo['ratio1'] ? this[formName].brandLogo['ratio1'].join(',') : '',
          };
          if (this.brandId) {
            params.brandId = this.brandId;
          }
          shopBrandSaveOrUpdate(params).then(res => {
            if (res.resCode == 200) {
              this.$message({
                message: '操作成功!',
                type: 'success',
              });
              this.getList();
              this.addShow = false;
              this.resetForm(formName);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs['addFrom'].clearValidate();
    },
    onEdit(row) {
      console.log(row.brandLogo);
      this.addShow = true;
      this.brandId = row.brandId;
      this.$nextTick(() => {
        this.addFrom = {
          brandName: row.brandName,
          brandNickname: row.brandNickname,
          brandLogo: row.brandLogo && { ratio1: row.brandLogo.split(',') },
        };
      });

      console.log(this.addFrom.brandLogo);
    },
    closeDialog(done) {
      this.$refs['addFrom'].clearValidate();
      done();
    },
  },
};
</script>
<style lang="scss" scoped>
.actve-label {
  height: auto;
  width: 100%;
  .from-wrap {
    width: 100%;
    // height: 60px;
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 20px;
    padding-bottom: 0;
    /deep/ .el-input-number--medium {
      width: 100%;
    }
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
