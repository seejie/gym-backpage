<template>
  <div class="announcement">
    <!-- 入住单位 -->
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
                <el-option label="已上线" value="3"></el-option>
                <el-option label="已下线" value="4"></el-option>
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
        <el-button type="primary" @click="addAnnouncement">发布公告</el-button>
        <el-button @click="batchTopicPublish(3)">批量上线</el-button>
        <el-button @click="batchTopicPublish(4)">批量下线</el-button>
        <el-button @click="batchTopicDel">删除</el-button>
      </div>
      <!--表格-->
      <el-table :data="issueData" style="width: 100%" @selection-change="selectionchange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="expand" width="30">
          <template slot-scope="scope">{{scope.row.abstract_info}}</template>
        </el-table-column>
        <el-table-column label="标题" min-width="340px">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-right: 10px" v-if="scope.row.position==1">置顶</el-tag>
            <el-avatar shape="square" size="medium" :src="scope.row.theme_img1"></el-avatar>
            <span style="margin-left: 10px">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publish_status" label="发布状态" width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.publish_status==1">草稿</span>
            <span v-if="scope.row.publish_status==2">待发布</span>
            <span style="color: #71b933" v-if="scope.row.publish_status==3">已上线</span>
            <span style="color: #ff5c7a" v-if="scope.row.publish_status==4">已下线</span>
          </template>
        </el-table-column>
        <el-table-column prop="colname" label="分类"></el-table-column>
        <el-table-column prop="unname" label="用户评价" width="180px">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{scope.row}">
            </el-rate>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180px">
          <template slot-scope="scope">{{$moment(scope.row.publish_time).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column prop="reading" label="阅读数" width="100px"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="{name:'information/comment',params:{type:2,id:scope.row.id}}">评论</router-link>
            </el-button>
            <el-button type="text">编辑</el-button>
            <el-dropdown @command="dropdownMenu">
              <el-button type="text">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.publish_status==4||scope.row.publish_status==2"
                                  :command="{id:scope.row.id,value:1}">上线
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.publish_status==3" :command="{id:scope.row.id,value:2}">下线
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
        issueData: [],
        //全选
        ids: [],
      }
    },
    created() {
      this.pageSize = this.pageSizes[0];
      this.announcementlist();
    },
    methods: {
      //分页
      currentChange(val) {
        this.curPage = val;
        this.announcementlist();
      },
      sizeChange(val) {
        this.pageSize = val;
        this.announcementlist();
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
          this.toggleTopicPublish(data.id, 2); //上线
        }
        if (data.value == 2) {
          this.toggleTopicPublish(data.id, 3); //下线
        }
        if (data.value == 5) {
          //删除
        }
      },
      //上下线 2-上线 3-下线
      toggleTopicPublish(id, publish_status) {
        this.$ajax.post('/cms/information/toggleTopicPublish', {id: id, publish_status: publish_status})
          .then(res => {
            if (res.resCode == 200) {
              this.topiclist();
              this.message('成功', 'success');
            }
          })
          .catch(err => console.log(err))
      },
      // 添加公告
      addAnnouncement() {
        this.$router.push({path: "addAnnouncement"})
      },
      //批量删除
      batchTopicDel(){
        if(this.ids.length==0){
          this.message('请选择需要操作的列','error');
        } else {
          this.$ajax.post('/cms/information/batchTopicDel', {
            ids: this.ids.join(',')
          })
            .then(res => {
              if (res.resCode == 200) {
                this.topiclist();
                this.message('成功', 'success');
              }
            })
            .catch(err => console.log(err))
        }
      },
      //批量上下线   1 草稿（预览） 2未发布 3已发布 4已下线
      batchTopicPublish(publish_status) {
        if(this.ids.length==0){
          this.message('请选择需要操作的列','error');
        } else {
          this.$ajax.post('/cms/information/batchTopicPublish', {
            ids: this.ids.join(','),
            publish_status: publish_status
          })
            .then(res => {
              if (res.resCode == 200) {
                this.topiclist();
                this.message('成功', 'success');
              }
            })
            .catch(err => console.log(err))
        }
      },
      //获取表格数据
      announcementlist() {
        this.$ajax.get('/setting/ announceList', {
          params: {

          }
        })
          .then(res => {
            if (res.resCode == 200) {
              this.totalCount = res.resultList.totalCount;
              // this.totalCount = res.resObject.totalCount;
              // this.issueData = res.resObject.list;
              this.issueData = res.resultList.index;
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
