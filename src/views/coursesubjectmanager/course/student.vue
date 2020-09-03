<template>
  <div class="student-wrap-mask">
    <div class="wrap-mask">
      <div class="wrap-content">
        <div class="main-body">
          <div class="student-wrap-header">
            <span>学员数据</span>
            <i class="el-icon-close" style="cursor: pointer" @click="closeStudent"></i>
          </div>
          <div class="main-search">
            <el-select v-model="form.courseStatus" placeholder="请选择" style="width: 102px;">
              <el-option label="昵称" value=0></el-option>
              <el-option label="姓名" value=1></el-option>
              <el-option label="联系方式" value=2></el-option>
            </el-select>
            <el-input v-model="form.courseTitle" placeholder="请输入关键词，例如：张帅" style="width: 240px;"></el-input>
            <el-button type="primary" @click="onSearch" style="margin-left: 8px">搜索</el-button>
            <el-button type="primary" @click="exportData">导出</el-button>
          </div>
          <div style="padding: 8px">
            <el-table
               ref="multipleTable"
               :data="tableData"
               tooltip-effect="dark"
               style="width: 100%; flex: 1; background-color: #ffffff"
               @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="courseTitle" label="序号" width="120"></el-table-column>
              <el-table-column prop="accessLevel" label="头像" width="120"></el-table-column>
              <el-table-column prop="name" label="昵称" width="120"></el-table-column>
              <el-table-column prop="name" label="姓名" width="120"></el-table-column>
              <el-table-column prop="courseStatus" label="联系方式" width="120"></el-table-column>
              <el-table-column prop="courseReleaseType" label="参与时间" width="120"></el-table-column>
            </el-table>
            <el-pagination
               style="text-align: center; margin-top: 8px"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="form.pageNum"
               :page-sizes="[10, 20, 30, 40]"
               :page-size="form.pageSize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
            </el-pagination>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { studentList, exportCourseStudents } from '../sever'

  export default {
    name: "student-info",
    props: ['studentId'],
    data() {
      return {
        pageHeight: window.innerHeight - 100 + 'px',
        activeName: 'first',
        form: {
          courseStatus: '0',
          courseTitle: '',
          courseId: '',
          pageNum: 1,
          pageSize: 10
        },
        currentPage: 1,
        total: 0,
        tableData: [],
      };
    },
    mounted(){
      this.form.courseId = this.$props.studentId;
    },
    methods: {
      handleSelectionChange(val){
        this.ids = val.map(v => v.id);
      },
      handleCurrentChange(val){
        this.form.pageNum = val;
        this.onSearch();
      },
      handleSizeChange(val){
        this.form.pageSize = val;
        this.onSearch();
      },
      closeStudent(){
        this.$emit('onClose')
      },
      onSearch(){
        const obj = this.form;
        studentList({...obj, keyword: obj.courseTitle }).then(res => {
          if (res.resCode == 200) {
            this.tableData = res.resObject.list || [];
            this.total= res.resObject.total;
          } else {
            this.message(res.message, 'error');
          }
        })
      },
      exportData(){
        const obj = this.form;
        exportCourseStudents({ productId: obj.courseId, keyword: obj.courseTitle }).then(res => {
          if (res.resCode == 200) {
            this.message.success('导出成功');
          } else {
            this.message(res.message, 'error');
          }
        })
      },
    }
  }
</script>

<style scoped>
  .student-wrap-mask{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    left: 0;
    background-color: rgba(55,55,55,.6);
  }
  .wrap-mask{
    width: auto;
    margin: 0 auto;
    position: relative;
    outline: 0;
    top: 100px;
  }
  .wrap-content{
    width: 800px;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    border: 0;
    background-clip: padding-box;
  }
  .main-body{

  }
  .student-wrap-header{
    display: flex;
    justify-content: space-between;
    background-color: #f5f7fa;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e3e8ee;
  }
  .main-search{
    padding: 0 16px;
    margin: 8px 0;
    margin-top: 16px;
  }



</style>
