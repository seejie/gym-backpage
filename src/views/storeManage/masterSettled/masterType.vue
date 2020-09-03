<template>
  <div class="type">
    <div style="width: 900px">
      <el-form>
        <el-form-item style="width: 700px;">
          <el-col :span="10">
            <el-input placeholder="类型名称" v-model="typeName" style="width: 95%"></el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="search">
              <i class="el-icon-search" style="font-size: 15px"></i>
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="showdialog('',0)">添加</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="deletemutitype">删除</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-table
        ref="typelist"
        :data="typeList"
        tooltip-effect="dark"
        width="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="300">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name" label="类型名称" width="120">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="status" label="生效" width="180px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status==2" @change="change(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <el-link type="primary" @click="showdialog(scope.row.name, scope.row.id)">编辑</el-link>
            </el-button>
            <el-button type="text">
              <el-link type="primary" @click="deletetype(scope.row.id)">删除</el-link>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible.sync="typeeditdialog"
        :title="typeid>0?'编辑类型':'添加类型'"
        style="width: 70%; margin: auto"
      >
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-input v-model="typenames" placeholder="请输入类型"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="10">
            <el-button type="primary" @click="editdialog(typeid,typenames)">确定</el-button>
            <el-button @click="typeeditdialog=false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="typeList.length!=0"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :total="totalCount"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '../../../components/Pagination';
import {
  storePass,
  storeList,
  storeEnable,
  storeDisable,
  storeCategoryDelete,
  storeCategoryCreate,
  storeCategoryEdit,
} from '@/api/master/index';
export default {
  name: 'index',
  components: {
    Pagination,
  },
  data() {
    return {
      unitType: 31, // 单位类型，必传：31-大师；32-店铺场馆；33-艺术场馆；34-艺术大师
      typeName: '',
      pageIndex: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30],
      totalCount: 0,
      typeList: [],
      typeeditdialog: false,
      typenames: '',
      typeid: 0,
      ids: [],
    };
  },
  mounted() {
    this.storeList();
    // this.load();
  },
  methods: {
    storeList() {
      const params = {
        unitType: this.unitType,
      };
      if (this.typeName.trim()) {
        params.name = this.typeName;
      }
      storeList(params).then(res => {
        if (parseInt(res.resCode) === 200) {
          this.typeList = res.resObject.list;
        }
      });
    },
    // 分页
    currentChange(val) {
      this.pageIndex = val;
      this.load();
    },

    sizeChange(val) {
      this.pageSize = val;
      this.load();
    },

    // 多选
    handleSelectionChange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },

    change(scope) {
      let ids = [];
      ids[0] = scope.id;
      if (scope.status == '2') {
        storeDisable({ ids }).then(res => {
          if (res.resCode == 200) {
            this.storeList();
            this.$message({
              message: '操作成功',
              type: 'success',
            });
          }
        });
      } else {
        storeEnable({ ids }).then(res => {
          if (res.resCode == 200) {
            this.storeList();
            this.$message({
              message: '操作成功',
              type: 'success',
            });
          }
        });
      }
    },

    search() {
      this.storeList();
      // if (this.typeName == '') {
      //   this.message('请输入类型名称', 'error');
      // } else {
      //   this.storeList();
      // }
    },

    showdialog(typename, id) {
      this.typeeditdialog = true;
      this.typenames = typename;
      this.typeid = id;
    },

    editdialog(id, name) {
      if (id !== 0) {
        storeCategoryEdit({
          id: id,
          name: name,
          unitType: this.unitType,
        }).then(res => {
          if (res.resCode === 200) {
            this.message('更新成功', 'success');
            this.typeeditdialog = false;
            this.storeList();
          }
        });
      } else {
        storeCategoryCreate({
          name: name,
          unitType: this.unitType,
        }).then(res => {
          if (res.resCode == 200) {
            this.message('更新成功', 'success');
            this.typeeditdialog = false;
            this.storeList();
          }
        });
      }
    },

    deletetype(id) {
      this.ids = [id];
      this.deletemutitype();
    },

    deletemutitype() {
      if (this.ids.length === 0) {
        this.message('请勾选要删除的行', 'error');
      } else {
        this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            storeCategoryDelete({
              ids: this.ids,
            })
              .then(res => {
                if (res.resCode === 200) {
                  this.storeList();
                  this.message('删除成功', 'success');
                  this.load();
                } else {
                  this.message('删除失败', 'error');
                }
              })
              .catch(error => {});
          })
          .catch(() => {
            this.message('已取消删除', 'info');
          });
      }
    },

    //错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.type {
  margin: 20px;
  background: #fff;

  .el-row {
    margin-bottom: 10px;
  }
}
</style>
