<template>
  <!-- 功能菜单 -->
  <div class="functionMenu">
    <el-card class="box-card">
      <!-- 操作表格数据按钮 -->
      <div class="table-operate" v-if="userLevel == 1">
        <el-button type="primary" @click="showEditDialog()">
          创建一级菜单
        </el-button>
      </div>

      <div class="search-container">
        <el-input v-model="search" size="mini" placeholder="输入关键字搜索" class="input" />
      </div>

      <el-collapse class="collapse-container">
        <el-collapse-item
          :disabled="!item.children"
          v-for="(item, parentIndex) in tableList.filter(
            data => !search || data.name.toLowerCase().includes(search.toLowerCase())
          )"
          :key="item.id"
        >
          <template slot="title">
            <div class="table-row">
              <div class="name">{{ item.name }}</div>
              <div class="url">{{ item.url }}</div>
              <div class="btn-container">
                <el-button v-if="userLevel == 1" size="mini" @click.stop="showEditDialog(item, 'addchild')">
                  新增子集
                </el-button>
                <el-button size="mini" @click.stop="showEditDialog(item)">
                  修改
                </el-button>
                <el-button v-if="userLevel != 3" size="mini" type="danger" @click.stop="delbtn(item)">
                  删除
                </el-button>
              </div>
            </div>
          </template>
          <div v-for="(child, index) in item.children" :key="index">
            <div class="table-row table-child-row">
              <div class="name">{{ child.name }}</div>
              <div class="url">{{ child.url }}</div>
              <div class="btn-container">
                <el-button size="mini" v-if="index != 0" @click="handleSonMenuSort(child, index, parentIndex, -1)">
                  上移
                </el-button>
                <el-button
                  size="mini"
                  v-if="index != item.children.length - 1"
                  @click="handleSonMenuSort(child, index, parentIndex, 1)"
                >
                  下移
                </el-button>
                <el-button size="mini" @click="showEditDialog(child, null, item)">
                  修改
                </el-button>
                <el-button v-if="userLevel != 3" size="mini" type="danger" @click="delbtn(child)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div style="padding: 20px">
        <el-button type="primary" @click="handleSort()">提交</el-button>
      </div>
    </el-card>
    <el-dialog @close="handlerclose" :title="form.id ? '编辑菜单' : '创建菜单'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" label-position="top" :model="form" ref="form">
        <el-form-item label="父菜单名称" prop="name" :label-width="formLabelWidth" v-if="form.menuParentId != 0">
          <el-input v-model="parentInfo.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="formLabelWidth">
          <el-input v-model="form.url" autocomplete="off" :disabled="userLevel != 1"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单LOGO，png、jpg格式，二级菜单无需传"
          :label-width="formLabelWidth"
          v-if="form.menuParentId == 0"
        >
          <img-include v-model="icon_pic" :max="1" :cropper="indexCropper" v-if="userLevel != 3"></img-include>
          <img
            :src="icon_pic.ratio1[0]"
            v-if="icon_pic.ratio1[0] && userLevel == 3"
            style="width: 100px; height: 100px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue';
import sortable from 'sortablejs';
import { getUserLevel } from '@/utils/storage';

export default {
  data() {
    return {
      search: '',
      tableList: [],
      loading: true,
      form: {
        name: '',
        url: '',
        icon: '',
        permission: '',
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogRoleVisible: false,
      units: [], // 单位
      ids: [],
      role_id: '', // 角色id
      //分页
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
      },

      icon_pic: {
        ratio1: [],
      },

      indexCropper: [
        {
          name: '菜单LOGO',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '菜单LOGO',
        },
      ],

      // 编辑子菜单时，展示父菜单名字
      parentInfo: {},
    };
  },
  watch: {
    'icon_pic.ratio1'(val) {
      this.form.icon = val[0];
    },
  },
  components: {
    ImgInclude,
  },

  computed: {
    // 用户等级 1-A，2-B，3-C
    userLevel() {
      return getUserLevel();
    },
  },

  mounted() {
    let collapse = document.querySelectorAll('.el-collapse')[0];
    if (collapse) {
      sortable.create(collapse, {
        onEnd: evt => {
          //监听拖动结束事件
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序

          const currRow = this.tableList.splice(evt.oldIndex, 1)[0];
          this.tableList.splice(evt.newIndex, 0, currRow);
        },
      });
    }
  },

  methods: {
    // 删除
    delbtn(val) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.$ajax
            .post('/sys/menu/delete', {
              ids: val.id.toString(),
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
            this.role_id = val.id;
            this.$ajax
              .get('/sys/role/getMenuByRole', {
                params: {
                  role_id: val.id,
                },
              })
              .then(res_ => {
                if (res_.resCode == 200) {
                  this.role_id = val.id;

                  let checkennodes = [];
                  function getids(param) {
                    if (!param) return;
                    param.forEach(v => {
                      console.log(v);
                      if (v.checked) {
                        checkennodes.push(v.id);
                      }
                      if (v.children) {
                        getids(v.children);
                      }
                    });
                  }
                  getids(res_.resObject);
                  console.log(res_.resObject, this.checkennodes, this.$refs.roletree);
                  this.$refs.roletree.setCheckedKeys(checkennodes);

                  console.log(res_);
                } else {
                  this.$message.error(res_.message);
                }
              })
              .catch(err => console.log(err));
            this.roletree = res.resObject;
            console.log(res);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑
    showEditDialog(val, addchild, parent) {
      if (!!(val && addchild)) {
        // 新增子集
        this.form = {
          name: '',
          url: '',
          icon: '',
          menuParentId: val.id,
        };
        this.parentInfo = val;
      } else if (val) {
        // 修改
        this.form = {
          id: val.id,
          name: val.name,
          url: val.url,
          icon: val.icon,
          menuParentId: val.menuParentId,
        };

        this.parentInfo = parent;

        this.icon_pic = {
          ratio1: [val.icon],
        };
      } else {
        // 创建一级菜单
        this.form = {
          name: '',
          url: '',
          icon: '',
          menuParentId: 0,
        };

        this.icon_pic = {
          ratio1: '',
        };
      }
      this.dialogFormVisible = true;
    },
    // 提交
    submit(val) {
      let url = this.form.id ? '/sys/menu/edit' : '/sys/menu/add';
      this.form.isShow = 1;
      // this.form.permission = this.form.url.replace("/",":")
      let data = {};
      for (const key in this.form) {
        if (this.form[key] !== '') {
          data[key] = this.form[key];
        }
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$ajax
            .post(url, data)
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
    // 关闭
    handlerclose(val) {
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
    },
    // 列表
    getList() {
      this.$ajax
        .get('/sys/menu/menuListByUser', {
          params: {},
        })
        .then(res => {
          if (res.resCode == 200) {
            this.tableList = res.resObject;
            this.loading = false;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },

    handleSonMenuSort(child, index, parentIndex, type) {
      let tableList = this.tableList.slice();
      let children = tableList[parentIndex].children;
      const currRow = children.splice(index, 1)[0];
      children.splice(index + type, 0, currRow);

      children.forEach((item, index) => {
        children[index].sort = index + 1;
      });

      tableList[parentIndex].children = children;
      this.tableList = tableList;
    },

    // 提交排序
    handleSort() {
      let list = [];
      this.tableList.forEach((item, index) => {
        list.push({
          ...item,
          sort: index + 1,
        });
      });

      this.$ajax
        .post('/sys/menu/batchEdit', { menu: list })
        .then(res => {
          if (res.resCode == 200) {
            this.getList();
            this.$message.success('排序成功');
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.functionMenu {
  .uploader-text {
    display: none !important;
  }
}

.search-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;

  .input {
    width: 266px;
  }
}

.table-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  align-items: center;

  .name,
  .url {
    font-size: 14px;
    color: #606266;
    font-weight: normal;
  }

  .name {
    width: 260px;
  }

  .url {
    flex: 1;
  }

  .btn-container {
    width: 300px;
    height: 28px;
    display: flex;
    justify-content: flex-end;
  }
}

.table-child-row {
  border-top: 1px solid #e6ebf5;
  height: 48px;
  align-items: center;

  .name {
    padding-left: 20px;
  }
}

.collapse-container {
  position: relative;
}

/deep/ .el-collapse-item__arrow {
  position: absolute;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}
</style>
