<template>
  <!-- 部门管理 -->
  <div class="department">
    <el-card class="box-card">
      <div class="search-menu">
        <div class="menu">
          <p><span>搜索名称：</span>
            <el-input v-model="searchData.name" placeholder="请输入"></el-input>
          </p>
          <p><span>生效状态：</span>
            <el-select v-model="searchData.status" placeholder="请选择" clearable>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </p>
          <br>
          <p><span>查询时间：</span>
            <el-date-picker v-model="times" type="datetimerange" range-separator="至" value-format="timestamp"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </p>
        </div>
        <!-- <div class="search-btn">
                    <el-button type="primary">搜索</el-button>
                    <el-button>重置</el-button>
                </div> -->
      </div>

      <!-- 操作表格数据按钮 -->
      <div class="table-operate">
        <el-button type="primary" @click="showEditDialog()">创建部门</el-button>
        <el-button type="info" @click="delbtn()" plain>删除</el-button>
      </div>

      <!-- 表格数据 -->
      <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableList" tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="部门名称" min-width="160"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160">
          <template slot-scope="scope">
            {{scope.row.createTime ? $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="启用状态" width="80">
          <template slot-scope="scope">
            <el-switch :active-value="2"
                   :inactive-value="4" @change="(v) => statusChange(v, scope.row)" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="right" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditDialog(scope.row)">编辑 |</el-button>
            <el-button type="text" @click="delbtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-control">
        <Pagination :pageSize="pageSize" :pageSizes="pageSizes" :total="totalCount" @currentChange="currentChange"
          @sizeChange="sizeChange"></Pagination>
      </div>

    </el-card>
    <el-dialog @close="handlerclose" :title="form.id ?'编辑部门' : '创建部门'" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item label="部门名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="introduction" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.introduction" autocomplete="off"></el-input>
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
  import Pagination from "@/components/Pagination";
  export default {
    data() {
      return {
        searchData: {
          status: '',
          name: "",
        },
        times: [],
        tableList: [],
        form: {
          name: '',
          introduction: '',
          id: 0,
          unitId:0
        },
        formLabelWidth: "100px",
        dialogFormVisible: false,
        ids: [],
        //分页
        totalCount: 0,
        curPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 0,
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
        }
      };
    },
    watch: {
      searchData: {
        handler() {
          this.getList()
        },
        deep: true
      },
      times: {
        handler(val) {
          if (!val[0] || !val[1]) return
          this.searchData.start_time = val[0]
          this.searchData.end_time = val[1]
        },
        deep: true
      }
    },
    components: {
      Pagination
    },
    methods: {
      append(val, vll) {
        console.log(val, vll)
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
        console.log(this.ids)
        if (this.ids.length == 0 && !val) {
          this.$message.error('请选择需要操作的列');
        } else {
          this.$confirm('确认删除？')
            .then(_ => {
              this.$ajax.post('/sys/department/delete', {
                  ids: val ? [val.id] : this.ids.map(v => v.id).join(',')
                })
                .then(res => {
                  if (res.resCode == 200) {
                    this.getList();
                    this.$message.success('成功');
                  } else {
                    this.$message.error(res.message);
                  }
                })
                .catch(err => console.log(err))
            })
            .catch(_ => {
              this.$message.info("已取消删除")
            });
        }
      },
      // 编辑
      showEditDialog(val) {
        if (val) {
          this.form = {
                  id: val.id,
                  name: val.name,
                  introduction: val.introduction,
                  unitId:val.unitId
                }
          // this.$ajax.get('/sys/department/findOne', {
          //     params: {
          //       id: val.id
          //     }
          //   })
          //   .then(res => {
          //     if (res.resCode == 200) {
          //       this.form = {
          //         id: res.resObject.id,
          //         name: res.resObject.name,
          //         introduction: res.resObject.introduction,
          //       }
          //       console.log(this.form)
          //     } else {
          //       this.$message.error(res.message);
          //     }
          //   })
          //   .catch(err => console.log(err))
        } else {
          this.form = {
            name: '',
            introduction: '',
            id: 0,
            unitId:0
          }
        }
        this.dialogFormVisible = true
      },
      // 提交
      submit(val) {
        let url = "/sys/department/save"
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.$ajax.post(url, this.form)
              .then(res => {
                if (res.resCode == 200) {
                  this.dialogFormVisible = false;
                  this.handlerclose()
                  this.getList()
                  this.$message.success('成功');
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(err => console.log(err))
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 关闭
      handlerclose(val) {
        this.dialogFormVisible = false
        this.$refs.form.resetFields()
      },
      // 列表
      getList() {
        this.$ajax.get('/sys/department/list', {
            params: {
              curPage: this.curPage,
              pageSize: this.pageSize,
              ...this.duplicateRemoval(this.searchData)
            }
          })
          .then(res => {
            if (res.resCode == 200) {
              this.tableList = res.resObject.list;
              this.totalCount = res.resObject.totalCount
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => console.log(err))
      },
      statusChange(val,row){
        row.status=val
        let url = "/sys/department/save"
        this.$ajax.post(url, row)
              .then(res => {
                if (res.resCode == 200) {
                  this.$message.success(val=='2'?'状态已启用成功':'状态已禁用成功！');
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch(err => console.log(err))

      }
    },
    created() {
      this.pageSize = this.pageSizes[0];
      this.getList()
    },
  };

</script>

<style lang="scss">
  .department {
    .search-menu {
      width: 100%;
      background: #f5f4f4;

      .menu {
        padding: 20px 0px;
        width: 100%;
        display: flex;
        justify-content: space-around;

        p {
          // width: 50%;
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
