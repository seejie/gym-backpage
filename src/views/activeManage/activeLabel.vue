<template>
  <div class="actve-label">

    <el-card>
      <!-- 表单 -->
      <div class="form-wrap">
        <el-form :inline="true"
                 :model="lableFrom"
                 class="demo-form-inline">
          <el-form-item>
            <el-input placeholder="请输入关键词内容"
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
                       @click="del">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <myTable hasSelection
                 hasIndex
                 @change="change"
                 :data="tableData"
                 :columns="columns"
                 @commitSelection="commitSelection">
        </myTable>

      </div>
    </el-card>
    <!-- 编辑框 -->
    <el-dialog title="编辑标签"
               :visible.sync="editShow">
      <el-form :model="editFrom">
        <el-form-item label="标签名称"
                      label-width="100">
          <el-input v-model="editFrom.tagName"
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
    <el-dialog title="添加标签"
               :visible.sync="addShow">
      <el-form :model="addFrom">
        <el-form-item label="标签名称"
                      label-width="100">
          <el-input v-model="addFrom.name"
                    placeholder="请输入添加标签"
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
export default {
  data () {
    return {
      tableData: [

      ],
      columns: [
        {
          label: '标签名称',
          prop: 'tagName',
        },
        {
          label: '生效',
          prop: 'isEffect',
          type: 'switch',
          disabled: true
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
        tagName: '',//编辑标签名称
        id: '',//
        is_effect: ''
      },
      addFrom: {
        name: '',//添加标签名称
      },
      addShow: false,//添加标签
      editShow: false,//编辑标签
      chooseItem: []
    }
  },
  mounted () {
    this.getLabelList()
  },
  methods: {
    commitSelection (val) {
      this.chooseItem = val
      console.log(this.chooseItem)
    },
    edit (row) {
      // console.log(row)
      this.editFrom = Object.assign({}, {
        tagName: row.tagName,
        id: row.id,//
        isEffect: row.isEffect
      })
      this.editShow = true

    },
    //添加数据
    add () {
      this.addFrom.name = ''
      this.addShow = true

    },
    //添加确定
    confirmAdd () {
      let data = { "tagName": this.addFrom.name }
      this.$ajax.post('/huigou/active/tag/inserttag', {

        tagName: this.addFrom.name

      }).then((res) => {
        if (res.resultCode == '200') {
          this.addShow = false
          this.$message.success("添加成功")
          this.getLabelList()
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
      // let data = { "tagName": this.addFrom.name }
      this.editRow(this.editFrom)
      // console.log(this.editFrom)

    },
    //删除数据
    del (row) {
      console.log(row)
      let delId
      if (this.chooseItem.length !== 0) {
        //点击上面的删除
        delId = this.chooseItem.map((item) => item.id)
      } else {
        //点击单行删除
        delId = [].concat(row.id)
      }
      console.log(delId)
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.delRow(delId)
      }).catch(action => {
        console.log('取消')
      });
    },
    //删除数据 走后台接口
    delRow (id) {
      this.$ajax.delete('/huigou/active/tag/delete', {
        data: id
      }).then((res) => {
        if (res.resultCode == '0000') {
          this.$message.success("删除成功")
          this.getLabelList()
        } else {
          this.$message.error("删除失败")
        }
      }).catch((err) => {
        console.log(err)

      })
    },
    getLabelList (keyWord = this.lableFrom.input) {
      this.$ajax.get('/huigou/active/tag/queryall', {
        params: {
          tagName: keyWord
        }
      }).then((res) => {
        this.tableData = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    //搜索
    search () {
      this.getLabelList()
    },
    //表格开关控制
    change (row) {
      this.editFrom = Object.assign({}, {
        tagName: row.tagName,
        id: row.id,//
        isEffect: row.isEffect
      })
      this.editRowBySwitch(this.editFrom)
    },
    //编辑标签
    editRow (data) {
      this.$ajax.post('/huigou/active/tag/updatetag', data).then((res) => {
        if (res.resultCode == '0000') {
          this.$message.success("修改成功")
          this.editShow = false
          this.getLabelList()
        } else {
          this.$message.error("修改失败")
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    editRowBySwitch (data) {
      this.$ajax.post('/huigou/active/tag/updatetagstatus', data).then((res) => {
        if (res.resultCode == '0000') {
          this.$message.success("修改成功")
          this.editShow = false
          this.getLabelList()
        } else {

        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("修改失败")
        this.getLabelList()
      })
    }
  }
}
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

