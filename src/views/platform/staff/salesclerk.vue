<template>
  <!-- 店员管理 -->
  <div class="salesclerk">
    <el-card class="box-card">
      <div class="search-menu">
        <div class="menu">
          <p>
            <span>账号名称：</span>
            <el-input v-model="searchData.loginName" placeholder="请输入"></el-input>
          </p>
          <p>
            <span>角色名称：</span>
            <el-input v-model="searchData.roleName" placeholder="请输入"></el-input>
          </p>

          <p>
            <span>生效状态：</span>
            <el-select v-model="searchData.status" placeholder="请选择" clearable>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </p>
          <p>
            <span>所属部门：</span>
            <el-input v-model="searchData.departmentName" placeholder="请输入"></el-input>
          </p>
        </div>
        <!-- <div class="search-btn">
                    <el-button type="primary">搜索</el-button>
                    <el-button>重置</el-button>
                </div> -->
      </div>

      <!-- 操作表格数据按钮 -->
      <div class="table-operate">
        <el-button type="primary" @click="showEditDialog()">创建账号</el-button>
        <el-button type="info" plain @click="batchAble()">批量生效</el-button>
        <el-button type="info" plain @click="batchDisable()">批量无效</el-button>
        <el-button type="info" @click="delbtn()" plain>删除</el-button>
      </div>

      <!-- 表格数据 -->
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="loginName" label="账号名称" min-width="100"></el-table-column>
        <el-table-column prop="name" label="真实姓名" min-width="100"> </el-table-column>
        <el-table-column prop="departmentName" label="所属部门" min-width="100"> </el-table-column>
        <el-table-column prop="roleName" label="角色" min-width="160"> </el-table-column>
        <el-table-column prop="status" label="生效状态" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status == 1 ? true : false" active-color="#13ce66" inactive-color="#ff4949" @change="scope.row.status == 1 ? batchDisable(scope.row) : batchAble(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="100"> </el-table-column>
        <el-table-column prop="email" label="电子邮箱" min-width="160"> </el-table-column>
        <el-table-column label="操作" align="right" width="240">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditDialog(scope.row)">编辑 </el-button>
            <el-button type="text" @click="delbtn(scope.row)">删除</el-button>
            <el-button type="text" @click="showResetDialog(scope.row)">重置密码 </el-button>
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
    <el-dialog @close="handlerclose" :title="form.id ? '编辑账号' : '创建账号'" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item label="账号名称" prop="loginName" :label-width="formLabelWidth">
          <el-input v-model="form.loginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="headUrl" :label-width="formLabelWidth">
          <YPImgUpload :imagePath.sync="form.headUrl"></YPImgUpload>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentsIndex" :label-width="formLabelWidth">
              <el-select v-model="form.departmentsIndex" placeholder="请选择">
                <el-option :label="item.name" :value="index" v-for="(item,index) in departments" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
        
        <el-form-item label="角色" prop="roleId" :label-width="formLabelWidth">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option :label="item.unitName" :value="item.id" v-for="item in roles" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限列表" :visible.sync="dialogRoleVisible">
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
    <el-dialog title="重置密码" :visible.sync="resetDialog">
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item label="重置后默认密码为：" prop="loginName" label-width="200px">
          <el-input v-model="defaultPassword" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit_reset">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import YPImgUpload from '@/components/NoCropperInclude';
import Pagination from '@/components/Pagination';
export default {
  data() {
    return {
      searchData: {
        loginName: '',
        status: '',
        roleName: '',
        departmentName: '',
      },
      tableList: [],
      departments: [],
      roles: [],
      roletree: [],
      form: {
        name: '',
        loginName: '',
        mobile: '',
        password: '',
        headUrl: '',
        email: '',
        departmentId: '',
        roleId: '',
        departmentName: '',
        unitId: '',
        departmentsIndex: '',
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogRoleVisible: false,
      units: [], // 单位
      ids: [],
      roleId: '', // 角色id
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
        loginName: [
          {
            required: true,
            message: '请输入账号名称',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur',
          },
        ],
        departmentsIndex: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'change',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change',
          },
        ],
      },
      resetDialog: false,
      defaultPassword: '123456',
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
    YPImgUpload,
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
      this.ids = val;
    },
    // 删除
    delbtn(val) {
      console.log(this.ids);
      if (this.ids.length == 0 && !val) {
        this.$message.error('请选择需要操作的列');
      } else {
        this.$confirm('确认删除？')
          .then(_ => {
            this.$ajax
              .post('/sys/user/delete', {
                ids: val ? [val.id] : this.ids.map(v => v.id),
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
    showResetDialog(val) {
      this.form = {
        id: val.id,
        name: val.name,
        loginName: val.loginName,
        mobile: val.mobile,
        password: val.password,
        headUrl: val.headUrl,
        email: val.email,
        departmentId: val.departmentId,
        roleId: val.roleId,
        departmentName: val.departmentName,
        unitId: val.unitId,
      };
      this.resetDialog = true;
    },
    submit_reset() {
      this.form.password = '123456';
      this.$ajax
        .post('/sys/user/edit', this.duplicateRemoval(this.form))
        .then(res => {
          if (res.resCode == 200) {
            this.dialogFormVisible = false;
            this.resetDialog = false;
            this.getList();
            this.$message.success('成功');
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 权限
    showRoleDialog(val) {
      this.$ajax
        .get('/sys/role/getMenuByRole', {
          params: {},
        })
        .then(res => {
          if (res.resCode == 200) {
            this.dialogRoleVisible = true;
            this.roleId = val.id;
            this.$ajax
              .get('/sys/role/getMenuByRole', {
                params: {
                  roleId: val.id,
                },
              })
              .then(res_ => {
                if (res_.resCode == 200) {
                  this.roleId = val.id;

                  let checkennodes = [];

                  function getids(param) {
                    if (!param) return;
                    param.forEach(v => {
                      if (v.checked) {
                        checkennodes.push(v.id);
                      }
                      if (v.children) {
                        getids(v.children);
                      }
                    });
                  }
                  this.$refs.roletree.setCheckedKeys(checkennodes);
                } else {
                  this.$message.error(res_.message);
                }
              })
              .catch(err => console.log(err));
            this.roletree = res.resObject;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑
    showEditDialog(val) {
      if (val) {
        this.form = {
          id: val.id,
          name: val.name,
          loginName: val.loginName,
          mobile: val.mobile,
          password: val.password,
          headUrl: val.headUrl,
          email: val.email,
          departmentId: val.departmentId,
          roleId: val.roleId,
          departmentName: val.departmentName,
          unitId: val.unitId,
        };
        this.departments.forEach((v, i) => {
          if (v.id == val.departmentId) {
            this.form.departmentsIndex = i;
          }
        });
      } else {
        Object.assign(this.$data.form, this.$options.data().form);
      }
      this.dialogFormVisible = true;
    },
    // 提交
    submit(val) {
      let url = this.form.id ? '/sys/user/edit' : '/sys/user/add';
      if (this.form.departmentsIndex || this.form.departmentsIndex === 0) {
        this.form.departmentId = this.departments[this.form.departmentsIndex].id;
        this.form.departmentName = this.departments[this.form.departmentsIndex].deptName;
        this.form.unitId = this.departments[this.form.departmentsIndex].unitId;
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax
            .post(url, this.duplicateRemoval(this.form))
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
      console.log(this.$refs.roletree.getCheckedNodes());
      let data = {
        roleId: this.roleId,
        menu_ids: this.$refs.roletree
          .getCheckedNodes()
          .map(v => v.id)
          .join(','),
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
        .get('/sys/user/userList', {
          params: {
            curPage: this.curPage,
            pageSize: this.pageSize,
            ...this.duplicateRemoval(this.searchData),
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
    batchAble(val) {
      if (this.ids.length == 0 && !val) {
        this.$message.error('请选择需要操作的列');
      } else {
        this.$confirm('确认？')
          .then(_ => {
            this.$ajax
              .post('/sys/user/enable', {
                ids: val ? [val.id] : this.ids.map(v => v.id),
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
            this.$message.info('已取消');
          });
      }
    },
    batchDisable(val) {
      if (this.ids.length == 0 && !val) {
        this.$message.error('请选择需要操作的列');
      } else {
        this.$confirm('确认？')
          .then(_ => {
            this.$ajax
              .post('/sys/user/disable', {
                ids: val ? [val.id] : this.ids.map(v => v.id),
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
            this.$message.info('已取消');
          });
      }
    },
    // 单位
    getUnits() {
      this.$ajax
        .get('/sys/department/list', {
          params: {
            curPage: 1,
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
    getDepartments() {
      this.$ajax
        .get('/sys/department/list', {
          params: {
            curPage: 1,
            pageSize: 99999,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.departments = res.resObject.list;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    getRoles() {
      this.$ajax
        .get('/sys/role/roleList', {
          params: {
            curPage: 1,
            pageSize: 99999,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.roles = res.resObject.list;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
  },
  created() {
    this.pageSize = this.pageSizes[0];
    this.getUnits();
    this.getList();
    this.getDepartments();
    this.getRoles();
  },
};
</script>

<style lang="scss">
.salesclerk {
  .search-menu {
    width: 100%;
    background: #f5f4f4;

    .menu {
      padding: 20px 0px;
      width: 100%;
      display: flex;
      justify-content: space-around;

      p {
        width: 25%;
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
