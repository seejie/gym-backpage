<template>
    <!-- 物流管理 -->
    <div class="logistics">
        <el-card class="box-card">
            <div class="search-menu">
                <div class="menu">
                    <p><span>公司名称：</span>
                        <el-input v-model="searchData.name" placeholder="请输入"></el-input>
                    </p>
                    <p><span>生效状态：</span>
                        <el-select v-model="searchData.status" placeholder="请选择">
                            <el-option label="有效" :value="1"></el-option>
                            <el-option label="无效" :value="0"></el-option>
                        </el-select>
                    </p>
                </div>
                <!-- <div class="search-btn">
                    <el-button type="primary">搜索</el-button>
                    <el-button>重置</el-button>
                </div> -->
            </div>

            <!-- 操作表格数据按钮 -->
            <div class="table-operate">
                <el-button type="primary" @click="showEditDialog()">创建物流</el-button>
                <el-button type="info" plain @click="changeStatus(1)">批量生效</el-button>
                <el-button type="info" plain @click="changeStatus(2)">批量无效</el-button>
                <el-button type="info" @click="delbtn()" plain>删除</el-button>
            </div>

            <!-- 表格数据 -->
            <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableList" tooltip-effect="dark" style="width: 100%">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="name" label="物流公司名称" min-width="160"></el-table-column>
                <el-table-column prop="code" label="物流公司代码" min-width="160"> </el-table-column>
                <el-table-column prop="status" label="生效状态" width="80">
                  <template slot-scope="scope">
                    <el-switch
                    v-model="scope.row.statusChange"
                    active-color="#13ce66"
                    inactive-color="#ff4949" @change="changeStatus(scope.row)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="right" width="160">
                <template slot-scope="scope" >
                  <el-button type="text" @click="showEditDialog(scope.row)">编辑 |</el-button>
                  <el-button type="text"  @click="delbtn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            </el-table>

            <div class="pagination-control">
                <Pagination :pageSize="pageSize"
                    :pageSizes="pageSizes" :total="totalCount"
                    @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
            </div>

        </el-card>
        <el-dialog @close="handlerclose" :title="form.id ?'编辑角色' : '创建角色'" :visible.sync="dialogFormVisible">
          <el-form :rules="rules" :model="form" ref="form">
            <el-form-item label="公司名称" prop="name" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="公司代码" prop="code" :label-width="formLabelWidth">
              <el-input v-model="form.code" autocomplete="off"></el-input>
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
              tableList:[],
              form: {
                name: '',
                code: '',
              },
              formLabelWidth: "100px",
              dialogFormVisible: false ,
              ids: [],
              //分页
              totalCount: 0,
              curPage: 1,
              pageSizes: [10, 20, 30],
              pageSize: 0,

              rules: {
                name: [
                  { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                code: [
                  { required: true, message: '请公司代码', trigger: 'blur' }
                ],
              }
            };
        },
        watch: {
          searchData: {
            handler () {
              this.getList()
            },
            deep:true
          }
        },
        components: {
          Pagination
        },
        methods:{

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
            changeStatus(item){
              let status = '';
              if(item == 1) status = 1;
              else if(item == 2) status = 0;
              else if(item.id) status = item.status == 1 ? 0 : 1;
              this.$ajax.get('/platformsetting/logistics/batchChangeStatus', {
                params:{
                  status: status,
                  ids: item.id ? item.id : this.ids.map(v => v.id).join(',')
                }
              }).then(res => {
                this.getList();
              })
            },
            // 删除
            delbtn(val) {
              console.log(this.ids)
              if(this.ids.length==0 && !val){
                this.$message.error('请选择需要操作的列');
              } else {
                this.$confirm('确认删除？')
                .then(_ => {
                  let ids = val ? val.id : this.ids.map(v => v.id).join(',')
                  this.$ajax.delete(`/platformsetting/logistics/deletes?ids=${ids}`)
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
                  code: val.code,
                }
              } else {
                this.form = {
                  name: '',
                  code: '',

                }
              }
              this.dialogFormVisible = true
            },
            // 提交
            submit(val) {
              let url = "/platformsetting/logistics/save";
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
              this.$ajax.post(`/platformsetting/logistics/logisticsList/?pageNum=${this.curPage}&pageSize=${this.pageSize}&name=${this.searchData.name}&status=${this.searchData.status}`)
                .then(res => {
                  if (res.resObject) {
                    this.tableList = res.resObject.list;
                    this.totalCount = res.resObject.totalCount;
                    for(let i =0;i<this.tableList.length;i++){
                      !this.tableList[i].status ? this.tableList[i].statusChange = false : this.tableList[i].statusChange = true;
                    }
                  } else {
                    this.$message.error(res.message);
                  }
                })
                .catch(err => console.log(err))
            },
        },
        created() {
          this.pageSize = this.pageSizes[0];
          this.getList()
        },
    };
</script>

<style lang="scss">
    .logistics {
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
        .table-operate{
            display: flex;
            justify-content: flex-start;
            width: 100%;
            margin: 20px;
        }
        .pagination-control{
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
        }

    }

</style>


