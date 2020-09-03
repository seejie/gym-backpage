<template>
  <div class="mapnetwork">
    <el-card class="box-card" >
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="日常QA" name="first">
          <!-- 表单 -->
          <div class="from-wrap">
            <el-form v-if="isshowsearch" :inline="true" ref="formInline" label-width="80px" label-position="left"  :model="searchData">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="title" label="搜索标题">
                    <el-input v-model="searchData.qaTitle" placeholder="请输入" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="company" label="发布状态">
                    <el-select placeholder="请选择" v-model="searchData.status" >
                      <el-option label="待审核" value="0"></el-option>
                      <el-option label="已上线" value="1"></el-option>
                      <el-option label="已下线" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="company" label="发布位置">
                    <el-select placeholder="请选择" v-model="searchData.courseSort" >
                      <el-option label="置顶" value="1"></el-option>
                      <el-option label="默认" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="8">
                  <el-form-item label="栏目">
                    <el-select v-model="searchData.categoryId" placeholder="请选择" style="width: 160px;">
                      <el-option :label="item.categoryName" v-for="(item,index) in catelist" :key="index" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="company" label="发布时间">
                    <el-date-picker v-model="searchData.searchdate" type="daterange" range-separator="~"
                                    format="yyyy-MM-dd"  value-format="yyyy-MM-dd"      start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
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
              <el-button type="primary" @click="$router.push('questionAnswer/Add/0')">发布帮助</el-button>
              <el-button @click="batchPublish(1)">批量上线</el-button>
              <el-button @click="batchPublish(2)">批量下线</el-button>
              <el-button @click="batchDel">删除</el-button>
            </div>
            <!--表格-->
            <el-table :data="list"  style="width: 100%;" @selection-change="selectionchange">
              <el-table-column type="selection" width="55px"></el-table-column>
              <el-table-column prop="qaTitle" label="标题" min-width="400px" >
                <template slot-scope="scope" >
                  <el-row type="flex" align="middle" style="justify-content: left">
                    <el-col :span="2" v-if="scope.row.isTop==1" class="topplue"><i class="topborder" @click="dropdownMenu({id:scope.row.id,value:4,istop:1})">-</i><i class="topborder color">顶</i></el-col>
                    <el-col :span="2" v-if="(scope.row.isTop==0||scope.row.isTop==null)" class="topplue" ><i @click="dropdownMenu({id:scope.row.id,value:4,istop:0})" class="topborder">+</i><i class="kong" ></i></el-col>
                    <el-col :span="2">
                      <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.coverUrl"></el-avatar>
                    </el-col>
                    <el-col :span="10">
                      <span style="margin-left:10px">{{scope.row.qaTitle}}</span>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="publishStatus" label="发布状态">
                <template slot-scope="scope">
                  <span style="color: #666666" v-if="scope.row.status==0">• 待审核</span>
                  <span style="color: #2EBA07" v-if="scope.row.status==1">▪ 已上线</span>
                  <span style="color: #CC0000" v-if="scope.row.status==2">• 已下线</span>
                </template>
              </el-table-column>
              <el-table-column prop="categoryName" label="栏目" width="260px"></el-table-column>
              <el-table-column label="发布时间" width="180px">
                <template slot-scope="scope">{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column prop="readCount" label="阅读数" width="100px"></el-table-column>
              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                  <el-button type="text"><router-link :to="{name:'questionAnswerAdd',params:{id:scope.row.id}}">编辑</router-link></el-button>
                  <el-dropdown @command="dropdownMenu" style="margin-left: 10px">
                    <el-button type="text">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="scope.row.status==2 || scope.row.status==0" :command="{id:scope.row.id,value:1}">上线</el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.status==1" :command="{id:scope.row.id,value:2}">下线</el-dropdown-item>
                      <el-dropdown-item :command="{id:scope.row.id,value:3}">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
        </el-tab-pane>
        <el-tab-pane label="栏目管理" name="second">
          <Category />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Pagination from '../../../components/Pagination'
import Category from './Category.vue'
import { QA, QACategory } from '@/api/customCourse/customCourse'
export default {
  name: 'networkManage',
  components: {
    Pagination,
    Category
  },
  data() {
    return {
      active: 'first',
      searchData: {
        qaTitle: '',
        status: '',
        courseSort: '',
        beginReleaseTime: [],
        endReleaseTime: [],
        searchdate: [],
        categoryId: '',
      },
      catelist: [], // 类型
      // 分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      //
      list: [],
      // 全选
      ids: [],
      isshowsearch: true,
      areaList: [],

    }
  },
  created() {
    this.pageSize = this.pageSizes[0]
    this.load()
    this.loadcate()
  },
  methods: {
    // 获取表格数据
    load() {
      if (this.searchData.searchdate.length > 1) {
        this.searchData.beginReleaseTime.push(this.searchData.searchdate[0] || '')
        this.searchData.endReleaseTime.push(this.searchData.searchdate[1] || '')
      }
      QA.load(this.searchData).then(res => {
        if (res.resCode == 200) {
          this.totalCount = res.resObject.totalCount
          this.list = res.resObject.list
        } else {
          this.message(res.message, 'error')
        }
      })
        .catch(err => console.log(err))
    },
    loadcate() {
      QACategory.load({ pageSize: 100 }).then(res => {
        if (res.resCode == 200) {
          this.catelist = res.resObject.list
        }
      })
    },
    reset() {
      this.searchData = {
        qaTitle: '',
        status: '',
        courseSort: '',
        beginReleaseTime: [],
        endReleaseTime: [],
        searchdate: [],
        categoryId: '',
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

    // 上下线 上3 下4
    togglePublish(id, status) {
      var idList = []
      idList.push(id)
      QA.activate({ idList: idList, status: status })
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
    // 批量删除
    batchDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error')
      } else {
        QA.delete({ ids: this.ids })
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
    // 批量上下线  1 草稿（预览） 2未发布 3已发布 4已下线
    batchPublish(status) {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error')
      } else {
        QA.activate({ idList: this.ids, status: status })
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
    // 下拉菜单点击事件
    dropdownMenu(data) {
      if (data.value == 1) {
        this.togglePublish(data.id, 1) // 上线
      }
      if (data.value == 2) {
        this.togglePublish(data.id, 2) // 下线
      }
      if (data.value == 3) {
        var ids = []
        ids.push(data.id)
        QA.delete({ ids: ids })
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
