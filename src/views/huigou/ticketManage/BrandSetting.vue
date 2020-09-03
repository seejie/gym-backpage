
<template>
  <div class="ticket-brand">

    <el-card>
      <!-- 表单 -->
      <div class="form-wrap">
        <el-form :inline="true"
                 :model="lableFrom"
                 class="demo-form-inline">
          <el-form-item>
            <el-input placeholder="请输入闸机商"
                      v-model="lableFrom.input"
                      class="input-with-select">
              <el-button slot="append"
                         @click="search"
                         icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="primary"
                       @click="add">添加</el-button>
            <el-button type="danger"
                       @click="delRows">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <myTable hasSelection
                 hasIndex
                 :data="tableData"
                 :columns="columns"
                 @commitSelection="commitSelection">
        </myTable>

      </div>
    </el-card>
    <!-- 编辑框 -->
    <el-dialog title="编辑码商"
               :visible.sync="editShow">
      <el-form :model="editFrom"
               ref="addForm"
               :rules="rules">
        <el-form-item label="闸机厂商"
                      label-width="100"
                      prop="supplyCompany">
          <el-input v-model="editFrom.supplyCompany"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称"
                      label-width="100"
                      prop="codeName">
          <el-input v-model="editFrom.codeName"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号"
                      label-width="100"
                      prop="account">
          <el-input v-model="editFrom.account"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业码"
                      label-width="100"
                      prop="companyCode">
          <el-input v-model="editFrom.companyCode"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加框 -->
    <el-dialog title="添加码商"
               :visible.sync="addShow">
      <el-form :model="addForm"
               ref="addForm"
               :rules="rules">
        <el-form-item label="闸机厂商"
                      label-width="100"
                      prop="supplyCompany">
          <el-input v-model="addForm.supplyCompany"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称"
                      label-width="100"
                      prop="codeName">
          <el-input v-model="addForm.codeName"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号"
                      label-width="100"
                      prop="account">
          <el-input v-model="addForm.account"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业码"
                      label-width="100"
                      prop="companyCode">
          <el-input v-model="addForm.companyCode"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Qs from 'qs'
import * as http from '@/api/huigou/ticket/brand.js'
export default {
  data () {
    return {
      tableData: [

      ],
      columns: [
        {
          label: '闸机商',
          prop: 'supplyCompany',
        },
        {
          label: '名称',
          prop: 'codeName',
        },
        {
          label: '账号',
          prop: 'account',
        },
        {
          label: '企业码',
          prop: 'companyCode',
        },
        {
          label: '操作',
          operateData: [
            {
              btn: '编辑',
              cb: this.edit
            },
            {
              btn: '删除',
              cb: this.del
            },
          ]
        },
      ],
      lableFrom: {
        input: ''//搜索条件
      },
      editFrom: {
        supplyCompany: '',//闸机商
        codeName: '',//添加标签名称
        account: '',//账号
        companyCode: '',//企业码
        codeId: ''
      },
      rules: {
        supplyCompany: [
          { required: true, message: '请输入闸机商', trigger: 'blur' },

        ],
        codeName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        companyCode: [
          { required: true, message: '请输入企业码', trigger: 'blur' }
        ],
      },
      addForm: {
        supplyCompany: '',//闸机商
        codeName: '',//添加标签名称
        account: '',//账号
        companyCode: ''//企业码
      },
      addShow: false,//添加标签
      editShow: false,//编辑标签
      chooseItem: []
    }
  },
  mounted () {
    this.getTabelList()
  },
  methods: {
    commitSelection (val) {
      this.chooseItem = val
    },
    edit (row) {
      // console.log(row)
      this.editFrom = Object.assign({}, {
        supplyCompany: row.supplyCompany,
        codeName: row.codeName,//
        account: row.account,
        companyCode: row.companyCode,
        codeId: row.codeId
      })
      this.editShow = true

    },
    //添加数据
    add () {
      this.addForm = {
        supplyCompany: '',
        codeName: '',
        account: '',
        companyCode: ''
      }
      this.addShow = true

    },
    //添加确定
    confirmAdd () {
      console.log(this.addForm)
      http.addBrand({

        account: this.addForm.account,
        codeName: this.addForm.codeName,
        companyCode: this.addForm.companyCode,
        supplyCompany: this.addForm.supplyCompany

      }).then((res) => {
        if (res.resCode === 200) {
          this.addShow = false
          this.$message.success("添加成功")
          this.getTabelList()
        } else {
          this.$message.error(res.resultDesc)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('添加失败')
      })
    },
    //编辑确定
    confirmEdit () {
      this.editRow(this.editFrom)
    },
    //单行删除数据
    del (row) {
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.delRow(row.codeId)
      }).catch(action => {
        console.log('取消')
      });
    },
    //单行删除数据 走后台接口
    delRow (id) {
      http.deletLabel({
        idsArr: id
      }).then((res) => {
        if (res.resCode === 200) {
          this.$message.success("删除成功")
          this.getTabelList()
        } else {
          this.$message.error("删除失败")
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    //多选删除
    delRows () {
      if (this.chooseItem.length === 0) {
        this.$message.error("请选择要删除的数据")
      } else {
        this.$confirm('确定删除该数据？', '删除信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          http.deletLabel({
            idsArr: this.chooseItem.map(item => item.codeId).join(',')
          }).then((res) => {
            if (res.resCode === 200) {
              this.$message.success("删除成功")
              this.getTabelList()
            } else {
              this.$message.error("删除失败")
            }
          })
        }).catch(action => {
          console.log('取消')
        });

      }
    },
    getTabelList (keyWord = this.lableFrom.input) {
      http.getTabelList({
        supplyCompany: this.lableFrom.input === '' ? null : this.lableFrom.input
      }).then((res) => {
        this.tableData = res.resObject
      }).catch((err) => {
        console.log(err)
      })
    },
    //搜索
    search () {
      this.getTabelList()
    },
    //编辑标签
    editRow (data) {
      // this.$ajax.post('/huigou/active/tag/updatetag', data)
      http.editLabel(data).then((res) => {
        if (res.resCode === 200) {
          this.$message.success("修改成功")
          this.editShow = false
          this.getTabelList()
        } else {
          this.$message.error("修改失败")
        }
      }).catch((err) => {
        console.log(err)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.ticket-brand {
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