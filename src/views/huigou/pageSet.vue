
<template>
  <div class="ticket-brand">
    <el-card>
      <!-- 表单 -->
      <!-- 表格 -->
      <div class="table-wrap">
        <myTable hasSelection
                 hasIndex
                 @change="change"
                 :data="tableData"
                 :columns="columns"
                 @changeSort='changeSort'>
        </myTable>

      </div>
    </el-card>
    <!-- 编辑框 -->
    <el-dialog title="编辑名称"
               :visible.sync="editShow">
      <el-form :model="editForm"
               ref="editForm">
        <el-form-item label="栏目名称"
                      label-width="100"
                      prop="brandName">
          <el-input v-model="editForm.name"
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

  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [

      ],
      columns: [
        {
          label: '栏目类型',
          prop: 'typeName',
        },
        {
          label: '栏目名称',
          prop: 'name',
        },
        {
          label: '排序',
          prop: 'sort',
          type: 'sort'
        },
        {
          label: '展示',
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
            }
          ]
        },
      ],
      editForm: {
        typeId: '',
        name: '',
      },
      editShow: false, // 编辑标签
    }
  },
  mounted () {
    this.getTabelList()
  },
  methods: {
    // 排序输入
    changeSort (num, row) {
      this.$ajax.post('/sys/huigou/channelsetting/update', {
        typeId: row.typeId,
        sort: num
      }).then((res) => {
        if (res.resCode === 200) {
          this.$message.success('编辑成功')
          this.getTabelList()
        } else {
          this.$message.error('编辑失败')
        }
      })
    },
    change (row) {
      console.log(row)
      this.$ajax.post('/sys/huigou/channelsetting/update', {
        typeId: row.typeId,
        isShow: row.isShow === 1 ? 0 : 1
      }).then((res) => {
        if (res.resCode === 200) {
          this.$message.success('编辑成功')
          this.getTabelList()
        } else {
          this.$message.error('编辑失败')
        }
      })
    },
    edit (row) {
      // console.log(row)
      this.editForm = Object.assign({}, {
        typeId: row.typeId,
        name: row.name
      })
      this.editShow = true
    },
    // 编辑确定
    confirmEdit () {
      this.editRow(this.editForm)
    },
    getTabelList () {
      this.$ajax.get('/sys/huigou/channelsetting/findAll', {
        params: {
          sortStr: 'sort asc'
        }
      }).then((res) => {
        this.tableData = res.resObject.map((item) => {
          return {
            ...item,
            typeName: this.getName(item.typeId),
            isEffect: item.isShow
          }
        })
      })
    },
    getName (id) {
      switch (id) {
        case 1:
          return '门票类'
        case 2:
          return '客栈类'
        case 3:
          return '活动类'
        case 4:
          return '商品类'
      }
    },
    // 编辑标签
    editRow (data) {
      this.$ajax.post('/sys/huigou/channelsetting/update', data).then((res) => {
        if (res.resCode === 200) {
          this.$message.success('编辑成功')
          this.getTabelList()
          this.editShow = false
        } else {
          this.$message.error('编辑失败')
          this.editShow = false
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.ticket-brand {
  height: 100%;
  width: 100%;
  .el-card {
    height: 100%;
    /deep/ .el-card__body {
      height: 100%;
    }
    .table-wrap {
      height: 100%;
    }
  }
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
</style>s