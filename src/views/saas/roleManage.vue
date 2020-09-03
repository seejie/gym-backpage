<template>
  <!-- 角色管理 -->
  <div class="roleManage">
    <el-card class="box-card">
      <div class="search-menu">
        <div class="menu">
          <p>
            <span>角色名称：</span>
            <el-input v-model="searchData.name" placeholder="请输入"></el-input>
          </p>
          <p>
            <span>生效状态：</span>
            <el-select v-model="searchData.status" placeholder="请选择">
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </p>
          <p>
            <span>关联店铺：</span>
            <el-input v-model="searchData.unit_name" placeholder="请输入"></el-input>
          </p>
        </div>
        <!-- <div class="search-btn">
                    <el-button type="primary">搜索</el-button>
                    <el-button>重置</el-button>
                </div> -->
      </div>

      <!-- 操作表格数据按钮 -->
      <div class="table-operate">
        <el-button type="primary" @click="showEditDialog()">创建角色</el-button>
        <el-button type="info" @click="batchTopicPublish(0)" plain>
          批量生效
        </el-button>
        <el-button type="info" @click="batchTopicPublish(1)" plain>
          批量无效
        </el-button>
        <el-button type="info" @click="delbtn()" plain>批量删除</el-button>
      </div>

      <!-- 表格数据 -->
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="130"></el-table-column>
        <el-table-column prop="defaultRole" label="是否默认角色" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.defaultRole == 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="英文名" width="min-120"></el-table-column>
        <el-table-column prop="status" label="生效状态" min-width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status == 1 ? true : false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="batchTopicPublish(scope.row.status, scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="dataScope" label="数据范围" min-width="120">
          <template slot-scope="scope">
            本单位及下属单位
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="showRoleDialog(scope.row)">
              权限 |
            </el-button>
            <el-button type="text" @click="showEditDialog(scope.row)">
              编辑 |
            </el-button>
            <el-button type="text" @click="delbtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-control">
        <Pagination
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :total="totalCount"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></Pagination>
      </div>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      @close="handlerclose"
      :title="form.id ? '编辑角色' : '创建角色'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="nameEn" :label-width="formLabelWidth">
          <el-input v-model="form.nameEn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="introduction" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.introduction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="关联部门"
          prop="unitId"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.unitId" placeholder="请选择">
            <el-option :label="item.unitName" :value="item.id" v-for="item in units" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="role_name + '权限列表'" :visible.sync="dialogRoleVisible">
      <el-tree :data="roletree" show-checkbox ref="roletree" node-key="id" :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span v-if="node.childNodes.length != 0" @click="append(node, data)">
            {{ node.childNodes.filter(v => v.checked).length + '/' + node.childNodes.length }}
          </span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit_role">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '../../components/Pagination';
export default {
  data() {
    return {
      searchData: {
        unit_name: '',
        status: '',
        name: '',
      },
      tableList: [],
      roletree: [],
      checkennodes: [],
      form: {
        name: '',
        nameEn: '',
        unitId: '',
        introduction: '',
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogRoleVisible: false,
      units: [], // 单位
      ids: [],
      role_id: '', // 角色id
      role_name: '', // 角色name
      //分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        nameEn: [{ required: true, message: '请英文名称', trigger: 'blur' }],
        unitId: [{ required: true, message: '请选择', trigger: 'blur' }],
        introduction: [{ required: true, message: '请填写', trigger: 'blur' }],
      },
    };
  },
  watch: {
    searchData: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
  components: {
    Pagination,
  },
  methods: {
    append(val, vll) {
      console.log(val, vll);
    },
    //分页
    currentChange(val) {
      this.curPage = val;
      this.getList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.ids = val.map(v => v.id);
    },
    //批量生效/无效 1生效 0 无效
    batchTopicPublish(status, val) {
      console.log(status, val);
      let url = status == 0 ? '/sys/role/enable' : '/sys/role/disable';
      if (val) {
        this.ids = [val];
      }
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post(url, {
            ids: this.ids,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.getList();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err));
      }
    },
    // 删除
    delbtn(val) {
      if (val) {
        this.ids = [val.id];
      }

      if (this.ids.length == 0) {
        this.$message.error('请选择需要操作的列');
      } else {
        this.$confirm('确认删除？')
          .then(_ => {
            this.$ajax
              .post('/sys/role/delete', {
                ids: this.ids,
              })
              .then(res => {
                if (res.resCode == 200) {
                  this.getList();
                  this.$message.success('成功');
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(err => console.log(err));
          })
          .catch(_ => {
            this.$message.info('已取消删除');
          });
      }
    },
    // 权限
    showRoleDialog(val) {
      this.roletree = [];
      this.dialogRoleVisible = true;
      this.role_id = val.id;
      this.role_name = val.name;
      this.$ajax
        .get('/sys/role/getRoleMenu', {
          params: {
            roleId: val.id,
          },
        })
        .then(res_ => {
          if (res_.resCode == 200) {
            this.roletree = res_.resObject;
            this.role_id = val.id;

            let checkennodes = [];
            function getids(param) {
              if (!param) return;
              param.forEach(v => {
                if (v.children) {
                  v.children.forEach(c => {
                    if (c.include) {
                      checkennodes.push(c.id);
                    }
                  });
                }
              });
            }
            getids(res_.resObject);

            this.$refs.roletree.setCheckedKeys(checkennodes);
          } else {
            this.$message.error(res_.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑
    showEditDialog(val) {
      if (val) {
        this.$ajax
          .get('/sys/role/roleInfo', {
            params: {
              id: val.id,
            },
          })
          .then(res => {
            if (res.resCode == 200) {
              this.form = {
                id: res.resObject.id,
                name: res.resObject.name,
                nameEn: res.resObject.nameEn,
                unitId: res.resObject.unitId,
                introduction: res.resObject.introduction,
                defaultRole: res.resObject.defaultRole,
              };
              console.log(this.form);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => console.log(err));
      } else {
        this.form = {
          name: '',
          nameEn: '',
          unitId: '',
          introduction: '',
        };
      }
      this.dialogFormVisible = true;
    },
    // 提交
    submit(val) {
      let url = this.form.id ? '/sys/role/edit' : '/sys/role/add';
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax
            .post(url, this.form)
            .then(res => {
              if (res.resCode == 200) {
                this.dialogFormVisible = false;
                this.handlerclose();
                this.getList();
                this.$message.success('成功');
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(err => console.log(err));
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 提交权限
    submit_role(val) {
      let url = '/sys/role/setRoleMenu';
      let data = {
        roleId: this.role_id,
        menuIds: this.$refs.roletree.getCheckedNodes(false, true).map(v => v.id),
      };
      this.$ajax
        .post(url, data)
        .then(res => {
          if (res.resCode == 200) {
            this.dialogRoleVisible = false;
            this.getList();
            this.$message.success('成功');
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 关闭
    handlerclose(val) {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
    // 列表
    getList() {
      this.$ajax
        .get('/sys/role/roleList', {
          params: {
            pageNum: this.curPage,
            pageSize: this.pageSize,
            ...this.searchData,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.tableList = res.resObject.list;
            this.totalCount = res.resObject.totalCount;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 单位
    getUnits() {
      this.$ajax
        .get('/sys/unit/listUnit', {
          params: {
            pageNum: 1,
            pageSize: 99999,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.units = res.resObject.list;
          } else {
            this.$message.error(res.message);
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
  created() {
    this.pageSize = this.pageSizes[0];
    this.getUnits();
    this.getList();
  },
};
</script>

<style lang="scss">
.roleManage {
  .search-menu {
    width: 100%;
    background: #f5f4f4;
    .menu {
      padding: 20px 0px;
      width: 100%;
      display: flex;
      justify-content: space-around;
      p {
        width: 30%;
        color: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-input {
        width: 200px;
      }
    }
    .search-btn {
      display: flex;
      justify-content: flex-end;
      margin-right: 30px;
      button {
        margin-left: 20px;
      }
    }
  }
  .table-operate {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin: 20px;
  }
  .pagination-control {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
