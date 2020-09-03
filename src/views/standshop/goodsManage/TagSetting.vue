<template>
  <div class="actve-label">
    <el-card>
      <!-- 表单 -->
      <div class="form-wrap">
        <el-form :inline="true" :model="lableFrom" class="demo-form-inline" ref="lableFrom">
          <el-form-item>
            <el-input placeholder="请输入关键词内容" v-model="lableFrom.name" class="input-with-select">
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
          <el-table-column type="index" label="序号" width="120"></el-table-column>
          <el-table-column prop="name" label="标签名称" width="350"></el-table-column>
          <el-table-column prop="isValid" label="生效" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isValid ? false : true"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changStatus(scope.$index, scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
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
    <el-dialog title="添加标签" :visible.sync="addShow" :close-on-click-modal="false">
      <el-form :model="addFrom" ref="addFrom" :rules="rules">
        <el-form-item label="标签名称" label-width="100" prop="name">
          <el-input
            v-model="addFrom.name"
            placeholder="请输入添加标签,4个字以内"
            autocomplete="off"
            maxlength="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="saveTag('addFrom')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { pageSizesRange } from '../commonText.js';

import { shopTagSaveOrUpdate, shopTagPage, shopTagDelByIds } from '@/api/standshop/goodsManage';

export default {
  data() {
    return {
      pageSizesRange,
      id: '',
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 5,
      multipleSelection: [],
      lableFrom: {
        name: '', //搜索条件
      },
      rules: {
        name: [
          { required: true, message: '请输入名称' },
          { max: 4, message: '长度在4字符以内' },
        ],
      },
      addFrom: {
        name: '', //添加标签名称
      },
      addShow: false, //添加标签
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
        name: this.lableFrom.name,
      };

      shopTagPage(newParams).then(res => {
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
      this.getList({ pageSize: val, pageNum: 1 });
    },
    currentChange(val) {
      this.current = val;
      this.getList({ pageNum: val, pageSize: this.pageSize });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //顶部搜索
    topSearh() {
      this.getList({ name: this.lableFrom.name, pageNum: 1, pageSize: 10 });
    },
    //生效
    async changStatus(index, row) {
      let status = row.isValid ? 0 : 1;
      let params = {
        isValid: status,
        id: row.id,
      };

      shopTagSaveOrUpdate(params).then(res => {
        if (deleteResult.resCode == 200) {
          this.getList();
        }
      });
    },
    //顶部添加
    topAdd() {
      this.addShow = true;
      this.id = '';
      this.addFrom = {
        name: '',
      };
    },
    //删除事件
    async onDelete(ids) {
      shopTagDelByIds({ ids: ids }).then(res => {
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
    // 单删
    deleteOne(row) {
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(() => {
        this.onDelete([row.id]);
      });
    },
    //保存
    saveTag(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            name: this[formName].name,
          };

          if (this.id) {
            params.id = this.id;
          }

          shopTagSaveOrUpdate(params).then(res => {
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
      //this.$refs[formName].resetFields();
      this.addFrom = {
        name: '',
      };
    },
    onEdit(row) {
      this.addShow = true;
      this.addFrom = {
        name: row.name, //添加标签名称
      };
      this.id = row.id;
    },
    onCancel() {
      this.addShow = false;
      this.resetForm('addFrom');
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
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
