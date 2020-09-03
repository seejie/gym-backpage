<template>
  <div class="announcement">
    <!-- 公告管理 -->
    <div class="from-wrap">
      <el-form :inline="true" ref="formInline" label-width="80px" label-position="left" :model="searchData">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="搜索标题">
              <el-input v-model="searchData.title" placeholder="搜索标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布状态">
              <el-select placeholder="请选择" v-model="searchData.publish_status">
                <el-option label="待审核" value="2"></el-option>
                <el-option label="已上线" value="1"></el-option>
                <el-option label="已下线" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布位置">
              <el-select placeholder="请选择" v-model="searchData.position">
                <el-option label="置顶" value="1"></el-option>
                <el-option label="默认" value="99"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="栏目">
              <el-input v-model="searchData.column_name" placeholder="栏目"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="发布时间">
              <el-date-picker v-model="searchData.startTime" type="daterange" range-separator="~"
                              start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="addhelp">发布帮助</el-button>
        <el-button @click="batchTopicPublish(true)">批量上线</el-button>
        <el-button @click="batchTopicPublish(false)">批量下线</el-button>
        <el-button @click="batchTopicDel">删除</el-button>
      </div>
      <!--表格-->
      <el-table :data="tableList" style="width: 100%" @selection-change="selectionchange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="scope">{{scope.row.abstract_info}}</template>
        </el-table-column>
        <el-table-column label="标题" min-width="340px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px" v-if="scope.row.position==1">顶</el-tag>
            <el-avatar shape="square" size="medium" :src="scope.row.theme_img1"></el-avatar>
            <span style="margin-left: 10px">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publish_status" label="发布状态" width="150px">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.publish_status==1">已发布</span>
            <span v-if="scope.row.publish_status==0">未发布</span> -->
            <span style="color: #71b933" v-if="scope.row.publish_status==1">已上线</span>
            <span style="color: #ff5c7a" v-if="scope.row.publish_status==0">已下线</span>
            <span style="color: #ccc" v-if="scope.row.publish_status==2">待审核</span>
          </template>
        </el-table-column>
        <el-table-column prop="category_name" label="分类"></el-table-column>
        <el-table-column prop="user_appraise" label="用户评价" width="180px">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.user_appraise"
              disabled
              show-score
              text-color="#ff9900"
              :score-template="scope.row.user_appraise" >
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">{{$moment(scope.row.publish_time).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column prop="read_num" label="阅读数" width="100px"><template slot-scope="scope">{{scope.row.read_num || ''}}</template></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="{name:'information/comment',params:{type:2,id:scope.row.id}}">评论</router-link>
            </el-button>
            <el-button type="text" @click="editHelp(scope.row)">编辑</el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="text">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.publish_status!=1"
                                  :command="{id:scope.row.id,value:1}">上线
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.publish_status==1" :command="{id:scope.row.id,value:2}">下线
                </el-dropdown-item>
                <el-dropdown-item :command="{id:scope.row.id,value:5}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px">
        <Pagination :pageSize="pageSize"
                    :pageSizes="pageSizes" :total="totalCount"
                    @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {Message} from "element-ui";
  import Pagination from "../../../components/Pagination";

  export default {
    name: "announcement",
    components: {
      Pagination
    },
    data() {
      return {
        searchData: {
          title: '',
          publish_status: '',
          position: '',
          startTime: '',
          column_name: '',
        },
        //分页
        totalCount: 0,
        curPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 0,
        //
        tableList: [],
        //全选
        ids: [],
      }
    },
    created() {
      this.pageSize = this.pageSizes[0];
      this.getList();
    },
    methods: {
      //分页
      currentChange(val) {
        this.curPage = val;
        this.getList();
      },
      sizeChange(val) {
        this.pageSize = val;
        this.getList();
      },
      //全选
      selectionchange(val) {
        this.ids = [];
        for (var i = 0; i < val.length; i++) {
          this.ids.push(val[i].id);
        }
      },
      //下拉菜单点击事件
      dropdownMenu(data) {
        if (data.value == 1) {
          this.toggleTopicPublish(data.id); //上线
        }
        if (data.value == 2) {
          this.toggleTopicPublish(data.id); //下线
        }
        if (data.value == 5) {
          //删除
            this.$ajax.post('/setting/helpDel', {
            id: data.id
          })
            .then(res => {
              if (res.resCode == 200) {
                this.getList();
                this.message('成功', 'success');
              } else {
                this.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err))
        }
      },
      //上下线 2-上线 3-下线
      toggleTopicPublish(id) {
        this.$ajax.post('/setting/helpPublish', {id: id})
          .then(res => {
            if (res.resCode == 200) {
              this.getList();
              this.message('成功', 'success');
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err))
      },
      // 添加帮助
      addhelp() {
        this.$router.push({path: "addHelp"})
      },
      //编辑帮助
      editHelp(val){
        this.$router.push(`/saas/addHelp/${val.id}`)
      },
      //批量删除
      batchTopicDel(){
        if(this.ids.length==0){
          this.message('请选择需要操作的列','error');
        } else {
          this.$ajax.post('/setting/helpDel', {
            ids: this.ids.join(',')
          })
            .then(res => {
              if (res.resCode == 200) {
                this.getList();
                this.message('成功', 'success');
              } else {
                this.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err))
        }
      },
      //批量上下线   1 草稿（预览） 2未发布 3已发布 4已下线
      batchTopicPublish(publish_status) {
        console.log(this.ids);
        let url = publish_status ? "/setting/batchAble" : '/setting/batchDisable'
        if(this.ids.length==0){
          this.message('请选择需要操作的列','error');
        } else {
          this.$ajax.post(url, {
            ids: this.ids.join(','),
          })
            .then(res => {
              if (res.resCode == 200) {
                this.getList();
                this.message('成功', 'success');
              } else {
                this.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err))
        }
      },
      //获取表格数据
      getList() {
          let data = {
            curPage: this.curPage,
            pageSize: this.pageSize,
          }
          for (const key in this.searchData) {
            if(this.searchData[key]) {
              data[key] = this.searchData[key]
            }
          }
        this.$ajax.get('/setting/helpList', {
          params: {
            ...data
          }
        })
          .then(res => {
            if (res.resCode == 200) {
              this.tableList = res.resObject.index;
              this.totalCount = res.resObject.totalCount
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err))
      },
      //错误、成功提示
      message(message, type) {
        Message({
          message: message,
          type: type,
          duration: 5 * 1000
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .announcement {
    /*//@extend %fill;*/
    overflow: auto;
    /*padding: 20px;*/
    padding-bottom: 0;
    /*height: calc(100vh - 100px);*/

    .el-row {
      margin-bottom: 20px;
    }

    .el-form {
      width: 100%;
    }

    .el-range-editor--medium.el-input__inner {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }

    /deep/ .el-form-item {
      margin-bottom: 0;
      display: flex;
    }

    /deep/ .el-form-item__content {
      flex: 1;
    }

    /deep/ .el-card__header {
      padding-bottom: 0;
      border: none;
    }

    .el-dropdown {
      margin-left: 15px;
    }

    /deep/ .el-table .cell {
      display: flex;
      align-items: center;
    }

    .from-wrap {
      width: 100%;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 10px 0 20px;

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
