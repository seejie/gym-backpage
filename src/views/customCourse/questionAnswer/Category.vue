<template>
 <el-card class="cate">
   <el-row align="middle" class="category">
     <el-col :span="2">栏目设置</el-col>
     <el-col :span="8"><el-button type="primary" @click="showdialog('',0)">新增栏目</el-button></el-col>
   </el-row>
   <el-row>
     <el-table
       class="table"
       ref="multipleTable"
       :data="list"
       tooltip-effect="dark"
       row-key="id"
       style="width: 100%; flex: 1; background-color: #ffffff"
       >
       <el-table-column prop="id" label="序号" width="120"></el-table-column>
       <el-table-column prop="categoryName" label="栏目名称" width="120"></el-table-column>
       <el-table-column prop="name" label="有效状态" width="120">
         <template slot-scope="scope"><el-switch v-model="scope.row.status==1" @change="activate(scope.row.id,scope.row.status==1?0:1)" active-color="#13ce66" inactive-color="#ff4949">
         </el-switch></template>
       </el-table-column>
       <el-table-column  label="操作" width="120">
         <template slot-scope="scope">
           <el-button type="text" size="small" @click="showdialog(scope.row.categoryName,scope.row.id)">编辑</el-button>
           <el-button type="text" size="small" @click="deletetype(scope.row.id)">删除</el-button>
         </template>
       </el-table-column>
     </el-table>
     <el-dialog :visible.sync="typeeditdialog" :title="typeid>0?'编辑栏目':'添加栏目'" style="width: 50%;margin: auto">
       <el-row type="flex" justify="center">
         <el-col :span="10">
           <el-input v-model="typenames" placeholder="请输入栏目分类" ></el-input>
         </el-col>
       </el-row>
       <el-row type="flex" justify="center">
         <el-col :span="10">
           <el-button type="primary" @click="editdialog(typeid)">确定</el-button> <el-button  @click="typeeditdialog=false">取消</el-button>
         </el-col>
       </el-row>
     </el-dialog>
     <div style="text-align: left;margin-top: 20px">
       <Pagination v-if="list.length!=0" :pageSize="pageSize" :pageSizes="pageSizes" :total="totalCount" @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
     </div>
   </el-row>
 </el-card>
</template>

<script>
import sortable from 'sortablejs'
import { QACategory } from '@/api/customCourse/customCourse'
import Pagination from '@/components/Pagination'
export default {
  name: 'Category',
  components: {
    sortable,
    Pagination
  },
  data() {
    return {
      list: [],
      typeeditdialog: false,
      typenames: '',
      typeid: 0,
      pageNum: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30],
      totalCount: 0,
    }
  },
  mounted() {
    this.load()
    const el = document.querySelectorAll('.table> .el-table__body-wrapper > table > tbody')[0]
    if (el) {
      sortable.create(el, {
        onEnd: evt => { // 监听拖动结束事件
          const currRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, currRow)
        }
      })
    }
  },
  methods: {
    load(params) {
      QACategory.load(params).then(res => {
        if (res.resCode == 200) {
          this.list = res.resObject.list
          this.totalCount = res.resObject.totalCount
        }
      })
    },
    activate(id, status) {
      QACategory.activate({ id: id, status: status }).then(res => {
        if (res.resCode == 200) {
          this.message('操作成功')
          this.load()
        }
      })
    },
    // 分页
    currentChange(val) { //
      this.pageNum = val
      this.load()
    },
    sizeChange(val) { //
      this.pageNum = val
      this.load()
    },
    showdialog(typename, id) {
      this.typeeditdialog = true
      this.typenames = typename
      this.typeid = id
    },
    editdialog(typeid) {
      if (typeid > 0) {
        QACategory.update({ id: typeid, categoryName: this.typenames }).then(res => {
          if (res.resCode == 200) {
            this.message('提交成功')
            this.typeeditdialog = false
            this.load()
          }
        })
      } else {
        QACategory.add({ id: typeid, categoryName: this.typenames }).then(res => {
          if (res.resCode == 200) {
            this.message('提交成功')
            this.typeeditdialog = false
            this.load()
          }
        })
      }
    },
    deletetype(id) {
      var that = this
      var ids = []
      ids.push(id)
      this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        QACategory.delete({ ids: ids }).then(res => {
          if (res.resCode == 200) {
            that.message('删除成功', 'success')
            that.load()
          } else {
            that.message('删除失败', 'error')
          }
        }).catch(error => {

        })
      }).catch(() => {
        that.message('已取消删除', 'info')
      })
    },
    // 错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type
      })
    }
  },
  watch: {
    list: {
      handler(newValue, oldValue) {
      },
      deep: true
    }
  }
}
</script>

<style scoped>
 .category{
   display: flex;align-items: center;margin-bottom: 20px
 }
 .el-row{
   margin-bottom: 10px;
 }
</style>
