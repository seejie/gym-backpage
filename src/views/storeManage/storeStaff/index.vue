<template>
  <div class="accountManage">
    <!-- 账号管理 -->
    <div class="from-wrap">
      <el-form
        :inline="true"
        ref="formInline"
        label-width="80px"
        label-position="left"
        :model="searchData"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="账号名称">
              <el-input v-model="searchData.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="生效状态">
              <el-select placeholder="请选择" v-model="searchData.status">
                <el-option label="可用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="title" label="所属店铺">
              <el-input v-model="searchData.unitName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="角色名称">
              <el-input v-model="searchData.roleName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="addresidentUnit()">创建账号</el-button>
        <el-button @click="batchTopicPublish(0)">批量生效</el-button>
        <el-button @click="batchTopicPublish(1)">批量无效</el-button>
        <el-button @click="batchTopicDel()">删除</el-button>
      </div>
      <!--表格-->
      <el-table :data="tableList" style="width: 100%" @selection-change="selectionchange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名" width="160px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px" v-if="scope.row.position == 1">置顶</el-tag>
            <el-avatar shape="square" size="medium" :src="scope.row.headUrl"></el-avatar>
            <span style="margin-left: 10px">{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="所属单位" min-width="100px"></el-table-column>
        <el-table-column prop="roleName" label="角色" min-width="100px"></el-table-column>
        <el-table-column prop="defaultUser" label="是否默认账号" width="80">
          <template slot-scope="scope">{{ scope.row.defaultUser == 1 ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="生效状态" width="100px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status == 1 ? true : false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="batchTopicPublish(scope.row.status, scope.row.id)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="130px"></el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="180px"></el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="showTheRoleTree(scope.row)">权限 |</el-button> -->
            <el-button type="text" @click="addresidentUnit(scope.row)">编辑 |</el-button>
            <el-button type="text" @click="batchTopicDel(scope.row)">删除 |</el-button>
            <el-button type="text" @click="resetPwd(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :close-on-click-modal="false"
        :title="form.id ? '编辑账号' : '新建账号'"
        :visible.sync="innerVisible"
      >
        <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
          <!--begin 让浏览器自动填充到这个input-->
          <div class="replace-input">
            <input v-model="form.name" type="text" class="form-control" />
          </div>
          <div class="replace-input">
            <input v-model="form.password" type="password" class="form-control" />
          </div>
          <!--end 让浏览器自动填充到这个input-->
          <el-form-item label="账号名称" prop="loginName">
            <el-input v-model="form.loginName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号（登录用）" prop="mobile">
            <el-input type="tel" v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input
              type="text"
              v-model="form.name_true"
              autocomplete="new-text"
              :readonly="isReadonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录密码" :prop="form.id ? '' : 'password'">
            <el-input
              show-password
              name="txtPassword"
              v-model="form.password_true"
              autocomplete="new-password"
              :readonly="isReadonly"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户头像" prop="headUrl">
            <img-include v-model="account_img" :max="1" :cropper="indexCropper"></img-include>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input type="email" v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="unitId">
            <el-select placeholder="请选择" v-model="form.unitId">
              <el-option
                v-for="item in units"
                :key="item.id"
                :label="item.unitName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select placeholder="请选择" v-model="form.roleId">
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUnit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :total="totalCount"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></Pagination>
      </div>
    </el-card>
    <el-dialog title="权限列表" :visible.sync="dialogRoleVisible">
      <el-tree
        :default-expand-all="false"
        :auto-expand-parent="false"
        :expand-on-click-node="false"
        ref="tree"
        class="filter-tree"
        :data="roleData"
        :props="defaultProps"
        :filter-node-method="filterNode"
      ></el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '@/components/Pagination';
import ImgInclude from '@/components/CropImgInclue/index.vue';

export default {
  name: 'residentUnit',
  components: {
    Pagination,
    ImgInclude,
  },
  data() {
    return {
      searchData: {
        name: '',
        status: '',
        unitId: '',
        roleName: '',
        unitName: '',
      },
      form: {
        name: '',
        password: '',
        name_true: '',
        password_true: '',
        headUrl: '',
        mobile: '',
        email: '',
        roleId: '',
        loginName: '',
        unitId: '',
      },
      formLabelWidth: '140px',
      innerVisible: false,
      dialogRoleVisible: false,
      roleData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      // 分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      // 角色和单位
      roles: [],
      tableList: [],
      units: [],
      // 全选
      ids: [],
      rules: {
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        unitId: [{ required: true, message: '请选择单位', trigger: 'blur' }],
      },

      account_img: {
        ratio1: [],
      },

      indexCropper: [
        {
          name: '用户头像',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '用户头像',
        },
      ],

      isReadonly: true,
    };
  },
  watch: {
    searchData: {
      handler() {
        this.getList();
      },
      deep: true,
    },

    'account_img.ratio1'(value) {
      this.form.headUrl = value[0];
    },

    innerVisible(val) {
      if (val) {
        setTimeout(() => {
          this.isReadonly = false;
        }, 500);
      }
    },
  },
  created() {
    this.pageSize = this.pageSizes[0];
    this.getList();
    this.getRoles();
    this.getUnits();
  },
  methods: {
    filterNode(value, data) {
      return data.checked;
    },
    // 分页
    currentChange(val) {
      this.curPage = val;
      this.getList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    // 全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
    },
    resetPwd(val) {
      this.$ajax
        .get('/sys/storemanager/user/resetPassword', {
          params: {
            userId: val.id,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.message('成功', 'success');
          }
        })
        .catch(err => console.log(err));
    },
    // 添加对话框
    addresidentUnit(val) {
      if (val) {
        this.form = {
          id: val.id,
          name: val.name || val.loginName,
          password: val.password,
          name_true: val.name,
          password_true: val.password,
          headUrl: val.headUrl,
          mobile: val.mobile,
          email: val.email,
          roleId: val.roleId,
          unitId: val.unitId,
          loginName: val.loginName,
        };

        this.account_img = {
          ratio1: [val.headUrl],
        };
      } else {
        this.form = {
          name: '',
          password: '',
          headUrl: '',
          mobile: '',
          email: '',
          roleId: '',
          unitId: '',
          loginName: '',
          name_true: '',
          password_true: '',
        };

        this.account_img = {
          ratio1: [],
        };
      }
      this.innerVisible = true;
    },
    // 提交添加编辑
    submitUnit() {
      const url = this.form.id ? '/sys/storemanager/user/edit' : '/sys/storemanager/user/add';
      this.$refs.form.validate(valid => {
        if (valid) {
          const payload = {
            ...this.form,
            name: this.form.name_true,
            password: this.form.password_true,
          };

          delete payload.name_true;
          delete payload.password_true;

          this.$ajax
            .post(url, payload)
            .then(res => {
              if (res.resCode == 200) {
                this.innerVisible = false;
                this.getList();
                this.message('成功', 'success');
              }
            })
            .catch(err => console.log(err));
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 批量删除
    batchTopicDel(val) {
      this.ids = [val.id];
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$confirm('确认删除？')
          .then(_ => {
            this.$ajax
              .post('/sys/storemanager/user/delete', {
                ids: this.ids,
              })
              .then(res => {
                if (res.resCode == 200) {
                  this.getList();
                  this.message('成功', 'success');
                }
              })
              .catch(err => console.log(err));
          })
          .catch(_ => {
            this.message('已取消删除', 'info');
          });
      }
    },

    // 批量生效/无效 1生效 0 无效
    batchTopicPublish(status, val) {
      if (val) {
        this.ids = [val];
      }

      const url = status === 0 ? '/sys/storemanager/user/enable' : '/sys/storemanager/user/disable';

      if (this.ids.length === 0) {
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
    // 获取表格数据
    getList() {
      this.$ajax
        .get('/sys/storemanager/user/userList', {
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
          }
        })
        .catch(err => console.log(err));
    },
    // 获取角色
    getRoles() {
      this.$ajax
        .get('/sys/storemanager/role/roleList', {
          params: {
            pageNum: 1,
            pageSize: 99999,
          },
        })
        .then(res => {
          if (res.resCode === 200) {
            this.roles = res.resObject.list;
          }
        })
        .catch(err => console.log(err));
    },
    // 获取单位数据
    getUnits() {
      this.$ajax
        .get('/sys/unit/listUnit', {
          params: {
            pageNum: 1,
            pageSize: 99999,
          },
        })
        .then(res => {
          if (res.resCode === 200) {
            this.units = res.resObject.list;
          }
        })
        .catch(err => console.log(err));
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
};
</script>

<style lang="scss" scoped>
.accountManage {
  /*//@extend %fill;*/
  overflow: auto;
  /*padding: 20px;*/
  padding-bottom: 0;
  /*height: calc(100vh - 100px);*/

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
    .el-form-item {
      margin-bottom: 0;
    }
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

.replace-input {
  position: relative;
}
/*让input看不见，而不是直接display: none，如果直接display: none，则不生效*/
.replace-input .form-control {
  position: absolute;
  left: -1000px;
  opacity: 0;
}
</style>
