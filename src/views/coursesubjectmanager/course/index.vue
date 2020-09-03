<!--课程管理-->
<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card" >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="课程资源管理" name="first">
          <el-form :inline="true" v-show="showSearch" ref="form" :model="form" label-width="80px" style="background-color: #ffffff; padding: 8px 0">
            <el-form-item label="搜索名称">
              <el-input v-model="form.courseTitle" clearable placeholder="请输入" style="width: 320px;"></el-input>
            </el-form-item>
            <el-form-item label="发布状态">
              <el-select v-model="form.courseStatus" clearable placeholder="请选择" style="width: 320px;">
                <el-option label="待审核" value='0'></el-option>
                <el-option label="已发布" value='1'></el-option>
                <el-option label="已下线" value='2'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布单位">
              <el-input v-model="form.unitName" style="width: 320px;" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <!-- <el-form-item label="地区筛选">
              <el-cascader
                 v-model="form.proCity"
                 style="width: 160px;"
                 :options="options"
                 placeholder="请选择省市"
                 @change="handleCity"></el-cascader>
              <el-select v-model="form.areaId" placeholder="请选择县区" style="width: 160px;">
                <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="form.date"
                type="daterange"
                style="width: 320px"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <div style="text-align: right">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button @click="onReset">重置</el-button>
              <span style="color: #29bc4f;font-size: 14px; margin: 0 10px; cursor: pointer" @click="changeShowSearch(false)">
              收起<i class="el-icon-arrow-up"></i>
            </span>
            </div>
          </el-form>
        </el-tab-pane>
        <div
           style="color: #29bc4f;font-size: 14px; text-align: center; cursor: pointer" @click="changeShowSearch(true)"
           v-show="!showSearch"
        >展开<i class="el-icon-arrow-down"></i>
        </div>
        <div style="margin: 8px 0; background-color: #ffffff;padding: 8px">
          <el-button size="small" @click="goAddPage">创建课程</el-button>
          <el-button size="small" :disabled="!multipleTable.length" @click="batchOnline">批量上线</el-button>
          <el-button size="small" :disabled="!multipleTable.length" @click="batchOffline">批量下线</el-button>
          <el-button size="small"  :disabled="!multipleTable.length" @click="deleteCourse">删除</el-button>
        </div>
        <el-table
           ref="multipleTable"
           :data="tableData"
           tooltip-effect="dark"
           style="width: 100%; flex: 1; background-color: #ffffff"
           @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="courseTitle" label="课程名称" width="240"></el-table-column>
          <el-table-column prop="accessLevelName" label="最低访问等级" width="120"></el-table-column>
          <el-table-column prop="orginalPrice" label="原价" width="120"></el-table-column>
          <el-table-column prop="currentPrice" label="现价" width="120"></el-table-column>
          <el-table-column prop="courseDuration" label="课时" width="120"></el-table-column>
          <el-table-column prop="courseStatus" label="发布状态" width="120" :formatter="formatter"></el-table-column>
          <el-table-column prop="unitName" label="单位" width="120"></el-table-column>
          <el-table-column prop="releaseTime" label="发布时间" width="120"></el-table-column>
          <el-table-column prop="selledAmount" label="购买量" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="240">
            <template slot-scope="scope">
              <el-button v-if="scope.row.courseStatus === 1" type="text" size="small" @click="batchOffline(scope.row, true)">下线</el-button>
              <el-button v-if="scope.row.courseStatus !== 1" type="text" size="small" @click="batchOnline(scope.row, true)">上线</el-button>
              <el-button type="text" size="small" @click="goEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="goComment(scope.row)">评论</el-button>
              <el-button type="text" size="small" @click="show(scope.row)">学员</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
           style="text-align: right; margin-top: 8px"
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="form.pageNum"
           :page-sizes="[10, 20, 30, 40]"
           :page-size="form.pageSize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="total">
        </el-pagination>
      </el-tabs>
    </el-card>
    <Student :key="studentId" v-show="showStudent" :studentId="studentId" @onClose="closeStudent"></Student>
  </div>
</template>

<script>
  // import cityList from "@/utils/citys";
  import assign from 'object-assign';
  import Student from './student';
  import { courseList, checkCourse, deleteCourse, dealTime, exportCourseStudents  } from '../sever'

  export default {
    name: "",
    data() {
      return {
        pageHeight: window.innerHeight - 100 + 'px',
        activeName: 'first',
        form: {
          courseTitle: '',
          courseStatus: '',
          unitName: '',
          // proCity: [],
          // areaId: '',
          date: [],
          firstCategoryId: '',
          secondCategoryId: '',
          pageNum: 1,
          pageSize: 10
        },
        currentPage: 1,
        total: 0,
        tableData: [],
        multipleTable: [],
        // options: cityList.map(v => assign({
        //   value: v.code,
        //   label: v.name,
        //   children: v.city.map(v => ({
        //     value: v.code,
        //     label: v.name
        //   }))
        // })),
        // areaList:[],
        ids: [],
        showSearch: true,
        showStudent: false,
        studentId: ''
      };
    },
    components: { Student },
    mounted(){
      this.onSearch();
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },

      handleSelectionChange(val){
        this.multipleTable = val;
      },
      handleCurrentChange(val){
        this.form.pageNum = val;
        this.onSearch();
      },
      handleSizeChange(val){
        this.form.pageSize = val;
        this.onSearch();
      },
      changeShowSearch(val){
        this.showSearch = val;
      },
      // handleCity(val){
      //   this.form.proCity = val;
      //   const obj = cityList.find(v => v.code === val[0]).city.find(v => v.code === val[1]);
      //   this.areaList = obj.area.map(v => ({ value: v.code, label: v.name }));
      //   this.form.areaId = '';
      // },
      changePicker(val){
        console.log(val)
      },
      onSearch(){
        let that = this;
        // let param = assign({}, this.form, { provinceId: this.form.proCity[0], cityId: this.form.proCity[1] });
        let param = dealTime(['beginReleaseTime', 'endReleaseTime'], this.form);
        courseList(param).then(res => {
          if (res.resCode == 200) {
            that.tableData = res.resObject.list || [];
            that.total= res.resObject.totalCount;
            that.multipleTable = [];
          } else {
            that.$message.error(res.message);
          }
        })
      },
      onReset(){
        this.form ={
          courseTitle: '',
          courseStatus: '',
          unitName: '',
          // proCity: [],
          // areaId: '',
          date: [],
          firstCategoryId: '',
          secondCategoryId: '',
        };
      },
      goAddPage(){ this.$router.push('/coursesubjectmanager/add-course') },
      goEdit(obj){ this.$router.push(`/coursesubjectmanager/add-course/${obj.id}`) },
      goComment(obj){ this.$router.push(`/coursesubjectmanager/comment-details/${obj.id}`) },
      closeStudent(){
        this.showStudent = false
      },
      batchOnline(obj, flag){
        let that = this;
        const a = this.multipleTable.map(v => v.id);
        const courseId = !flag ? a : [obj.id];
        checkCourse({
          status: 1,
          courseId, // this.ids
        }).then(res => {
          if (res.resCode == 200) {
            that.$message.success('批量上线成功');
            that.onSearch();
          } else {
            that.$message.error(res.message);
          }
        })
      },
      batchOffline(obj, flag){
        let that = this;
        const a = this.multipleTable.map(v => v.id);
        const courseId = !flag ? a : [obj.id];
        checkCourse({
          status: 2,
          courseId, // this.ids
        }).then(res => {
          if (res.resCode == 200) {
            that.$message.success(!flag ? '批量下线成功' : '下线成功');
            that.onSearch();
          } else {
            that.$message.error(res.message, 'error');
          }
        })
      },
      deleteCourse(){
        let that = this;
        deleteCourse({ ids: this.multipleTable.map(v => v.id) }).then(res => {
          if (res.resCode == 200) {
            that.$message.success('批量删除成功');
            that.onSearch();
          } else {
            that.$message.error(res.message);
          }
        })
      },
      show(obj){
        this.showStudent = true;
        this.studentId = obj.id
      },
      formatter(row){
        if (row.courseStatus === 0) return '待审核';
        if (row.courseStatus === 1) return '已发布';
        if (row.courseStatus === 2) return '已下线';
        return row.courseStatus || '';
      },

    }
  }
</script>

<style scoped>
  .activeManage {
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
    height: calc(100vh - 90px);
  }
  .activeManage .box-card {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .box-card{
    display: flex;
    flex-direction: column;
  }
  .box-card >>> .el-tabs__content{
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .box-card >>> .el-tab-pane{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .box-card >>> .el-form-item{
    margin-bottom: 10px;
  }
</style>
