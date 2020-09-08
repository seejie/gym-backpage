<template>
  <div class="mapnetwork">
    <el-card class="box-card" >
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="教师管理" name="first">
          <!-- 表单 -->
          <div class="from-wrap">
            <el-form v-if="isshowsearch" :inline="true" ref="formInline" label-width="80px" label-position="left"  :model="searchData">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="title" label="账号名称">
                    <el-input v-model="searchData.teacherName" placeholder="请输入" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="company" label="状态">
                    <el-select placeholder="请选择" v-model="searchData.status" >
                      <el-option label="已通过" value="1"></el-option>
                      <el-option label="未审核" value="0"></el-option>
                      <el-option label="已上线" value="2"></el-option>
                      <el-option label="已下线" value="3"></el-option>
                      <el-option label="已驳回" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="品类筛选">
                    <el-select v-model="searchData.firstCategoryId" placeholder="请选择一级分类" style="width: 160px;" @change="changeCate">
                      <el-option v-if="cateData.first.length>0" :label="item.categoryName" :key="index" :value="item.id" v-for="(item,index) in cateData.first"></el-option>
                    </el-select>
                    <el-select v-model="searchData.secondCategoryId" placeholder="请选择二级分类" style="width: 160px;">
                      <el-option v-if="cateData.sencond.length>0" :label="item.categoryName" :key="index" :value="item.id" v-for="(item,index) in cateData.sencond"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item  prop="area" class="selectclass" label="地区筛选">
                    <el-cascader
                      v-model="searchData.proCity"
                      style="width: 160px;"
                      :options="options"
                      placeholder="请选择省市"
                      @change="handleCity"></el-cascader>
                    <el-select v-model="searchData.addressDistrict" placeholder="请选择县区" style="width: 160px;ma">
                      <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col  :span="24" style="text-align: right">
                  <el-form-item>
                    <el-button type="primary" @click="load">搜索</el-button>
                    <el-button @click="reset">重置</el-button>
                    <span style="color:#409EFF;cursor: pointer" @click="showsearch">收起 <i class="el-icon-arrow-up"></i></span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-form v-else>
              <el-row >
                <el-col  :span="24" style="text-align: center">
                  <el-form-item>
                    <span style="color:#409EFF;cursor: pointer" @click="showsearch">展开 <i class="el-icon-arrow-down"></i></span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <el-card shadow="never" class="card">
            <!--全选、添加等操作按钮-->
            <div slot="header" class="clearfix">
              <el-button type="primary" @click="$router.push('teacher/Add/0')">创建教练</el-button>
              <el-button @click="batchPublish(1)">批量通过</el-button>
              <el-button @click="batchPublish(4)">批量驳回</el-button>
              <el-button @click="batchPublish(2)">批量上线</el-button>
              <el-button @click="batchPublish(3)">批量下线</el-button>
              <el-button @click="batchDel">删除</el-button>
            </div>
            <!--表格-->
            <el-table :data="list"  style="width: 100%;" @selection-change="selectionchange">
              <el-table-column type="selection" width="55px"></el-table-column>
              <el-table-column prop="title" label="教师名称" min-width="340px" >
                <template slot-scope="scope" >
                  <el-row type="flex" align="middle" style="justify-content: left">
                    <el-col :span="2" v-if="scope.row.isTop==1" class="topplue"><i class="topborder" @click="dropdownMenu({id:scope.row.id,value:4,istop:1})">-</i><i class="topborder color">顶</i></el-col>
                    <el-col :span="2" v-if="(scope.row.isTop==0||scope.row.isTop==null)" class="topplue" ><i @click="dropdownMenu({id:scope.row.id,value:4,istop:0})" class="topborder">+</i><i class="kong" ></i></el-col>
                    <el-col :span="2">
                      <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.photos"></el-avatar>
                    </el-col>
                    <el-col :span="8">
                      <span style="margin-left:10px">{{scope.row.teacherName}}</span>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="gender" label="性别" ><template slot-scope="scope">
                {{scope.row.gender==1?'男':'女'}}
              </template></el-table-column>
              <el-table-column prop="secondCategoryName" label="分类" ></el-table-column>
              <el-table-column prop="currentPrice" label="授课费用" ></el-table-column>
              <el-table-column prop="publishStatus" label="生效状态">
                <template slot-scope="scope">
                  <!--<el-switch v-model="scope.row.status==1" @change="approveTeacher(scope.row.status==0?1:0,scope.row.id)" active-color="rgba(51, 153, 255, 1)" inactive-color="rgba(153, 153, 153, 1)">-->
                  <!--</el-switch>-->
                  <span style="color: #666666" v-if="scope.row.status==0 ||scope.row.status==null">• 待审核</span>
                  <span style="color: #2EBA07" v-if="scope.row.status==1">▪ 已通过</span>
                  <span style="color: #2EBA07" v-if="scope.row.status==2">▪ 已上线</span>
                  <span style="color: #CC0000" v-if="scope.row.status==3">• 已下线</span>
                  <span style="color: #666666" v-if="scope.row.status==4">• 已驳回</span>
                </template>
              </el-table-column>
              <el-table-column prop="addressProCity" width="180px"  label="省市">
              </el-table-column>
              <el-table-column prop="phone" label="手机号" ></el-table-column>
              <el-table-column prop="email" label="电子邮箱"></el-table-column>
              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">

                  <el-button type="text"><router-link :to="{name:'teacherAdd',params:{id:scope.row.id}}">编辑</router-link></el-button>
                  <el-button type="text"><el-link type="primary" @click="deleteone(scope.row.id)">删除</el-link></el-button>
                  <el-button type="text"><el-link type="primary" @click="showstatusdata(scope.row.id)">学员</el-link></el-button>
                  <el-button type="text" v-if="scope.row.status==0"><el-link type="primary" @click="approveTeacher(1,scope.row.id)">通过</el-link></el-button>
                  <el-button type="text" v-if="scope.row.status==0"><el-link type="primary" @click="approveTeacher(4,scope.row.id)">驳回</el-link></el-button>
                  <el-button type="text" v-if="scope.row.status==1 || scope.row.status==3 "><el-link type="primary" @click="approveTeacher(2,scope.row.id)">上线</el-link></el-button>
                  <el-button type="text" v-if="scope.row.status==2"><el-link type="primary" @click="approveTeacher(3,scope.row.id)">下线</el-link></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="text-align: right;margin-top: 20px">
              <Pagination v-if="list.length!=0" :pageSize="pageSize"
                          :pageSizes="pageSizes" :total="totalCount"
                          @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
            </div>
          </el-card>
          <el-dialog :visible.sync="studentdata.isshow" title="学员数据">
            <el-form class="el-row">
              <el-form-item>
                <el-row type="flex" >
                  <el-col :span="3" >
                    <el-select style="width: 100px" placeholder="选项" v-model="studentdata.searchdata.select" >
                      <el-option v-for="(item,index) in studentdata.searchdata.option" :label="item.name" :key="index" :value="item.id">

                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7" style="display: flex">
                    <el-input placeholder="请输入关键字" style="width: 150px" v-model="studentdata.searchdata.key"></el-input>
                    <el-button type="primary" style="margin-left: 10px" @click="showstatusdata(studentdata.id)">搜索</el-button>
                  </el-col>
                  <el-col :span="7" style="display: flex">
                    <el-button type="primary" @click="exportTeacherStudents">导出</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <el-table
              ref="studentdata" :data="studentdata.list" tooltip-effect="dark" style="width: 100%" @selection-change="handleStudentSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" width="120">
                <template slot-scope="scope">{{ scope.row.id }}</template>
              </el-table-column>
              <el-table-column prop="name" label="头像" width="120">
                <template slot-scope="scope">
                  <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.avatarUrl"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="昵称" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.nickName}}</template>
              </el-table-column>
              <el-table-column prop="address" label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column prop="address" label="联系方式" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.mobile}}</template>
              </el-table-column>
              <el-table-column prop="address" label="参与时间" show-overflow-tooltip>
                <template slot-scope="scope">{{$moment(scope.row.studyTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
            </el-table>
            <div style="text-align: right;margin-top: 20px">
              <Pagination v-if="studentdata.length!=0" :pageSize="studentdata.pageSize"
                          :pageSizes="studentdata.pageSizes" :total="studentdata.totalCount"
                          @currentChange="currentChange(scope.row.interaction_type,scope.row.id)" @sizeChange="sizeChange(scope.row.interaction_type,scope.row.id)"></Pagination>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="品类设置" name="second">
          <Category />
        </el-tab-pane>
        <el-tab-pane label="使用说明" name="third">
          <TeacherInstructions />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import cityList from '@/utils/citys'
import assign from 'object-assign'
import Pagination from '../../../components/Pagination'
import Category from './Category.vue'
import TeacherInstructions from './TeacherInstructions.vue'
import { teacher, teacherCategory } from '@/api/customCourse/customCourse'
export default {
  name: 'networkManage',
  components: {
    Pagination,
    cityList,
    Category,
    TeacherInstructions
  },
  data() {
    return {
      active: 'first',
      searchData: {
        teacherName: '',
        status: '',
        firstCategoryId: '',
        secondCategoryId: '',
        teacherCategoryId: '',
        addressProvince: '',
        addressCity: '',
        addressDistrict: '',
        proCity: []

      },
      getVenueTypelistData: [], // 网点类型
      // 分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      //
      list: [],
      // 全选
      ids: [],
      cateData: { first: [], sencond: [] },
      isshowsearch: true,
      areaList: [],
      studentdata: { // 报名数据
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        isshow: false,
        id: '',
        ids: [],
        list: [],
        searchdata: { option: [{ id: 0, name: '昵称' }], key: '', select: 0 }
      },
      options: cityList.map(v => assign({
        value: v.code,
        label: v.name,
        children: v.city.map(v => ({
          value: v.code,
          label: v.name
        }))
      })),
    }
  },
  created() {
    this.pageSize = this.pageSizes[0]
    this.load()
    this.loadcate(0)
  },
  methods: {
    // 获取表格数据
    load() {
      var params = {
        teacherName: this.searchData.teacherName,
        pageNum: this.curPage,
        pageSize: this.pageSize,
        status: this.searchData.status,
        teacherCategoryId: this.searchData.secondCategoryId != '' ? this.searchData.secondCategoryId : this.searchData.firstCategoryId,
        firstCategoryId: this.searchData.firstCategoryId,
        secondCategoryId: this.searchData.secondCategoryId,
        addressProvince: this.searchData.proCity[0] || '',
        addressCity: this.searchData.proCity[1] || '',
        addressDistrict: this.searchData.addressDistrict
      }
      teacher.load(params).then(res => {
        if (res.resCode == 200) {
          this.totalCount = res.resObject.totalCount
          this.list = res.resObject.list;
          this.list.forEach(f => {
            f.addressProCity = this.getprocity(f.addressProvince, f.addressCity, f.addressDistrict)
          });
        } else {
          this.message(res.message, 'error')
        }
      })
        .catch(err => console.log(err))
    },
    loadcate(catParentId) {
      teacherCategory.load({ catParentId: catParentId, PageSize: 100 }).then(res => {
        if (res.resCode == 200) {
          if (catParentId > 0) { this.cateData.sencond = res.resObject.list } else { this.cateData.first = res.resObject.list }
        }
      })
    },
    changeCate(id) {
      this.loadcate(id)
    },
    reset() {
      this.searchData = {
        teacherName: '',
        status: '',
        firstCategoryId: '',
        secondCategoryId: '',
        teacherCategoryId: '',
        addressProvince: '',
        addressCity: '',
        addressDistrict: '',
        proCity: []

      }
    },
    showsearch() {
      this.isshowsearch = !this.isshowsearch
    },
    // 分页
    currentChange(val) {
      this.curPage = val
      this.load()
    },
    sizeChange(val) {
      this.pageSize = val
      this.load()
    },
    // 全选
    selectionchange(val) {
      this.ids = []
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id)
      }
    },

    // 置顶
    top(id, istop) {
      this.$ajax.post('/back/venue/topVenue', { id: id, isTop: istop })
        .then(res => {
          if (res.resCode == 200) {
            this.load()
            this.message('成功', 'success')
          } else {
            this.message(res.message, 'error')
          }
        })
        .catch(err => console.log(err))
    },
    deleteone(id) {
      var that = this
      var ids = []
      ids.push(id)
      this.$confirm('此操作将永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.delete({ ids: ids })
          .then(res => {
            if (res.resCode == 200) {
              that.load()
              that.message('成功', 'success')
            } else {
              that.message(res.message, 'error')
            }
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除
    batchDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error')
      } else {
        teacher.delete({ ids: this.ids })
          .then(res => {
            if (res.resCode == 200) {
              this.load()
              this.message('成功', 'success')
            } else {
              this.message(res.message, 'error')
            }
          })
          .catch(err => console.log(err))
      }
    },
    getprocity(addressProvince, addressCity, addressDistrict) {
      const obj = cityList.find(v => v.code === addressProvince);
      return obj.name + '/' + obj.city.find(v => v.code === addressCity).name + '/' + obj.city.find(v => v.code === addressCity).area.find(v => v.code === addressDistrict).name
    },
    // 批量上下线  1 草稿（预览） 2未发布 3已发布 4已下线
    batchPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error')
      } else {
        teacher.approveTeacher({ status: status, teacherIdList: this.ids })
          .then(res => {
            if (res.resCode == 200) {
              this.load()
              this.message('成功', 'success')
            } else {
              this.message(res.message, 'error')
            }
          })
          .catch(err => console.log(err))
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    handleCity(val) {
      this.searchData.proCity = val
      const obj = cityList.find(v => v.code === val[0]).city.find(v => v.code === val[1])
      this.areaList = obj.area.map(v => ({ value: v.code, label: v.name }))
      this.searchData.addressDistrict = ''
    },
    approveTeacher(status, teacherid) {
      var teacherIdList = []
      teacherIdList.push(teacherid)
      teacher.approveTeacher({ status: status, teacherIdList: teacherIdList }).then(res => {
        if (res.resCode == 200) {
          this.load()
          this.message('成功', 'success')
        } else {
          this.message(res.message, 'error')
        }
      })
    },
    showstatusdata(id) {
      this.studentdata.isshow = true
      this.studentdata.id = id
      this.studentdata.list = []
      teacher.record({ teacherId: id, keyword: this.studentdata.searchdata.key, pageSize: this.studentdata.pageSize, pageNum: this.studentdata.curPage }).then(res => {
        if (res.resCode == 200) {
          this.studentdata.list = res.resObject.list
        }
      })
    },
    handleStudentSelectionChange(val) {
      if (val.length > 0) {
        for (var i = 0; i < val.length; i++) {
          this.studentdata.ids.push(val[i].id)
        }
      }
    },
    exportTeacherStudents() {
      location.href = '/xqn/customCourse/teacher/exportTeacherStudents?productId=' + this.studentdata.id + '&keyword=' + this.studentdata.searchdata.key;
      // teacher.exportTeacherStudents({ productId: this.studentdata.id, keyword: this.studentdata.searchdata.key }).then(res => {
      //   if (res.resCode == 200) {
      //     this.message('导出成功', 'success')
      //   }
      // })
    },
    // 错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mapnetwork {
    overflow: hidden;
    margin: 20px 20px 0 20px;
    background: #fff;

    .el-form {
      width: 100%;
    }

    /deep/ .el-form-item {
      display: flex;
    }
    /deep/ .el-form-item__content {
      flex: 1;
    }
    /deep/ .area-select{
      width: 100%;
    }
    .el-range-editor--medium.el-input__inner{
      width: 100%;
    }
    .el-select{
      width: 100%;
    }
    .el-card{
      border:none;
    }
    .selectclass{
      .el-select{
        width: 40%;
      }
    }
    .headimg{
      display: flex;align-items: center
    }
    .topborder{
      padding: 0 2px;
      border: 1px solid #cacaca;
      text-align: center;
      font-size: 0.1rem;
      font-style: normal;
      margin-right: 5px;
      width: 15px;
      cursor: pointer;
    }
    .topborder.color{
      color: #fff;
      background: #0a76a4;
      transform: scale(1);
      padding: 0;
    }
    .topplue{
      display: flex;
      height: 15px;
      line-height: 15px;
    }
    .kong{

    }
    .from-wrap {
      margin: 0 20px;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 0 20px;

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
</style>
