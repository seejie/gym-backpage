<template>
  <div class="mapnetwork">
    <el-card class="box-card" >
          <!-- 表单 -->
          <div class="from-wrap">
            <el-form v-if="isshowsearch" :inline="true" ref="formInline" label-width="80px" label-position="left"  :model="searchData">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="title" label="搜索标题">
                    <el-input v-model="searchData.title" placeholder="请输入" ></el-input>
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
                    <el-select placeholder="请选择" v-model="searchData.isTop" >
                      <el-option label="置顶" value="1"></el-option>
                      <el-option label="默认" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="8">
                  <el-form-item prop="unitName" label="发布单位">
                    <el-input v-model="searchData.unitName" placeholder="请输入"></el-input>
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
              <el-button type="primary" @click="$router.push('coursequestionaire/Add/0')">发布调研</el-button>
              <el-button @click="batchPublish(1)">批量上线</el-button>
              <el-button @click="batchPublish(2)">批量下线</el-button>
              <el-button @click="batchDel">删除</el-button>
            </div>
            <!--表格-->
            <el-table :data="list"  style="width: 100%;" @selection-change="selectionchange">
              <el-table-column type="selection" width="55px"></el-table-column>
              <el-table-column prop="title" :label="'标题'" min-width="340px" >
                <template slot-scope="scope" >
                  <el-row type="flex" align="middle" style="justify-content: left">
                    <el-col :span="2" v-if="scope.row.isTop==1" class="topplue"><i class="topborder" @click="dropdownMenu({id:scope.row.id,value:4,istop:1})">-</i><i class="topborder color">顶</i></el-col>
                    <el-col :span="2" v-if="(scope.row.isTop==0||scope.row.isTop==null)" class="topplue" ><i @click="dropdownMenu({id:scope.row.id,value:4,istop:0})" class="topborder">+</i><i class="kong" ></i></el-col>
                    <el-col :span="2">
                      <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.banner"></el-avatar>
                    </el-col>
                    <el-col :span="8">
                      <span style="margin-left:10px">{{scope.row.title}}</span>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="publishStatus" label="发布状态">
                <template slot-scope="scope">
                  <span style="color: #666666" v-if="scope.row.status==0 ||scope.row.status==null">• 待审核</span>
                  <span style="color: #2EBA07" v-if="scope.row.status==1">▪ 已上线</span>
                  <span style="color: #CC0000" v-if="scope.row.status==2">• 已下线</span>
                </template>
              </el-table-column>
              <el-table-column prop="unitName" label="发布单位"></el-table-column>
              <el-table-column label="发布时间" width="180px">
                <template slot-scope="scope">{{scope.row.createTime}}</template>
              </el-table-column>
              <el-table-column prop="joinedNum" label="填报数" width="100px"></el-table-column>
              <el-table-column label="操作" width="250px">
                <template slot-scope="scope">
                  <el-button type="text"><el-link type="primary" @click="setTop(scope.row.id,scope.row.releasePostion==0?1:0)">{{scope.row.releasePostion==0?'置顶':'取消置顶'}}</el-link></el-button>
                  <!--<el-button type="text"><el-link type="primary" @click="showlinks(scope.row.linkUrl,scope.row.id)">链接</el-link></el-button>-->
                  <el-button type="text"><el-link type="primary" @click="showstatusdata(scope.row.id)">数据</el-link></el-button>
                  <el-button type="text"><router-link :to="{name:'coursequestionaireAdd',params:{id:scope.row.id}}">编辑</router-link></el-button>
                  <el-button type="text"><el-link type="primary" @click="deleteone(scope.row.id)">删除</el-link></el-button>
                  <el-button type="text"><el-link type="primary" @click="togglePublish(scope.row.id,scope.row.status==1?2:1)">{{scope.row.status==1?'下线':'上线'}}</el-link></el-button>
                  <el-dialog title="链接" :visible.sync="showlink" width="20%">
                    <el-row>
                      <el-row>
                        访问链接
                      </el-row>
                      <el-row>
                        {{linkUrl}}
                      </el-row>
                    </el-row>
                    <el-row slot="footer" class="dialog-footer">
                      <el-button  type="primary" class="fs12" v-clipboard:copy="linkUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
                    </el-row>
                  </el-dialog>
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
    </el-card>
    <el-dialog class="showdata" :visible.sync="data.isshow" title="问卷数据" >
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" >
            <el-col :span="3" >
              <el-select style="width: 100px" placeholder="选项" v-model="data.searchdata.select" >
                <el-option v-for="(item,index) in data.searchdata.option" :label="item.name" :key="index" :value="item.id">

                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-input placeholder="请输入关键字" style="width: 150px" v-model="data.searchdata.key"></el-input>
              <el-button type="primary" style="margin-left: 10px" @click="showstatusdata(data.id)">搜索</el-button>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-button type="primary" @click="exportQuestionaireData">导出</el-button>
              <el-button type="primary" @click="feedback">回复</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table
        ref="data" :data="data.list" tooltip-effect="dark" style="width: 100%" @selection-change="handleStudentSelectionChange">
        <el-table-column v-if="data.header!=null" type="selection" width="55"></el-table-column>
        <el-table-column  v-for="(item,index) in data.header" :key="index" :label="item.name" show-overflow-tooltip>
          <template slot-scope="scope" >
            <el-avatar v-if="item.key=='avatarUrl' " class="headimg" shape="square" size="medium" :src="scope.row.avatarUrl"></el-avatar>
            <el-row v-else>
              {{scope.row[item.key]}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column   label="回复">
          <template slot-scope="scope">
            <el-link v-if="scope.row.Feedbacks!=''" @click="showreply(scope.row)" v-html="scope.row.Feedbacks"></el-link>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <Pagination v-if="data.length!=0" :pageSize="data.pageSize"
                    :pageSizes="data.pageSizes" :total="data.totalCount"
                    @currentChange="currentdataChange" @sizeChange="sizedataChange"></Pagination>
      </div>
      <el-dialog title="回复" :visible.sync="data.reply" append-to-body>
        <el-form ref="form1"  label-width="80px" >
          <el-form-item v-for="(item,index) in data.FeedbackLists" :key="index" :label="item.loginName==null?'用户留言':'通知用户'">
            <el-row>
              <el-row class="content">
                <span  v-html="item.content"></span>
                <el-row>
                  <img style="margin-left: 10px" v-if="item.photos.length>0" v-for="(item1,index1) in item.photos.split(',')" :key="index1" :src="item1" width="70" height="70" />
                </el-row>
                <div class="time">{{item.createTime}} <el-link v-if="item.memberId>0" class="delcontent" type="primary" @click="delcontent(item.id)">删除</el-link></div>
              </el-row>

            </el-row>
          </el-form-item>
          <el-form-item label="消息内容">
            <myEditor refs='name1' v-model="data.replycontent"></myEditor>
          </el-form-item>
          <el-form-item label="">
            <up-load :limit="9" :imagePath.sync="data.imgs"></up-load>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary" @click="submitfeedback">提交</el-button>
            <el-button @click="data.reply=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import clipboards from 'vue-clipboard2'
import { Message } from 'element-ui'
import Pagination from '../../../components/Pagination'
import { CourseQuestionaire } from '@/api/customCourse/customCourse'
import UpLoad from '@/components/customcourse/uploadimg'
Vue.use(clipboards)
export default {
  name: 'networkManage',
  components: {
    Pagination,
    clipboards,
    UpLoad
  },
  data() {
    return {
      showlink: false,
      searchData: {
        title: '',
        status: '',
        isTop: '',
        unitName: '',
        beginReleaseTime: [],
        endReleaseTime: [],
        searchdate: [],
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
      isshowsearch: true,
      areaList: [],
      data: { // 报名数据
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        isshow: false,
        id: '',
        ids: [],
        list: [],
        header: [],
        searchdata: { option: [{ id: 0, name: '昵称' }], key: '', select: 0 },
        reply: false,
        replycontent: '',
        FeedbackLists: [],
        imgs: []
      },
      linkUrl: '',

    }
  },
  created() {
    this.pageSize = this.pageSizes[0]
    this.load()
  },
  methods: {
    // 获取表格数据
    load() {
      if (this.searchData.searchdate.length > 1) {
        this.searchData.beginReleaseTime.push(this.searchData.searchdate[0] || '')
        this.searchData.endReleaseTime.push(this.searchData.searchdate[1] || '')
      }
      var params = {
        title: this.searchData.title,
        pageNum: this.curPage,
        pageSize: this.pageSize,
        status: this.searchData.courseStatus,
        isTop: this.searchData.courseSort,
        unitName: this.searchData.unitName,
        beginReleaseTime: this.searchData.beginReleaseTime,
        endReleaseTime: this.searchData.endReleaseTime,
      }
      CourseQuestionaire.load(params).then(res => {
        if (res.resCode == 200) {
          this.totalCount = res.resObject.totalCount
          this.list = res.resObject.list != null ? res.resObject.list : []
          console.log(this.list)
        } else {
          this.message(res.message, 'error')
        }
      })
        .catch(err => console.log(err))
    },
    reset() {
      this.searchData = {
        title: '',
        status: '',
        isTop: '',
        unitName: '',
        beginReleaseTime: [],
        endReleaseTime: [],
        searchdate: [],
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
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        CourseQuestionaire.delete({ ids: ids })
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

    // 上下线 上3 下4
    togglePublish(id, publish_status) {
      var ids = []
      ids.push(id)
      CourseQuestionaire.setStatus({ ids: ids, status: publish_status })
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
        CourseQuestionaire.delete({ ids: this.ids })
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
        CourseQuestionaire.setStatus({ ids: this.ids, status: status })
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
    showVenue(id, isshow) { // 展示开关
      this.$ajax.post('/back/venue/showVenue', { id: id, isShow: isshow }).then(res => {
        if (res.resCode == 200) {
          this.load()
          this.message('成功', 'success')
        } else {
          this.message(res.message, 'error')
        }
      }).catch(error => {

      })
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    onCopy: function (e) {
      this.message('复制成功', 'success')
      this.showlink = false
    },
    onError: function (e) {
      console.log(e)
      alert('Failed to copy texts')
    },
    showstatusdata(id) {
      this.data.isshow = true
      this.data.id = id
      this.data.list = []
      CourseQuestionaire.record({ questionaireId: id, keyword: this.data.searchdata.key, pageSize: this.data.pageSize, pageNum: this.data.curPage }).then(res => {
        if (res.resCode == 200) {
          this.data.header = res.resObject.header
          this.data.list = res.resObject.data != null ? res.resObject.data.list : []
          this.data.totalCount = res.resObject.data != null ? res.resObject.data.totalCount : 0
          this.data.list.forEach(f => {
            this.FeedbackList(f);
          })
        }
      })
    },
    FeedbackList(item) {
      CourseQuestionaire.searchFeedbackList({ joinRecordId: item.id }).then(res => {
        if (res.resCode == 200) {
          this.data.FeedbackLists = res.resObject;
          this.$set(item, 'Feedbacks', res.resObject[0] != null ? res.resObject[0].content : '');
        }
      });
    },
    currentdataChange(val) {
      this.data.curPage = val
      this.showstatusdata(this.data.id)
    },
    sizedataChange(val) {
      this.data.pageSize = val
      this.showstatusdata(this.data.id)
    },
    handleStudentSelectionChange(val) {
      if (val.length > 0) {
        for (var i = 0; i < val.length; i++) {
          this.data.ids.push({ id: val[i].id, joinRecordId: val[i].joinRecordId, memberId: val[i].memberId })
        }
      }
    },
    exportQuestionaireData() {
      location.href = '/xqn/customCourse/questionaire/exportQuestionaireData?questionaireId=' + this.data.id + '&keyword=' + this.data.searchdata.key;
    },
    showlinks(link, id) {
      this.showlink = true;
      this.linkUrl = link + '/customcourse/coursequestionaire/' + id;
    },
    feedback() { // 回复
      if (this.data.ids.length == 0) {
        this.message('请选择需要回复的人员', 'info')
      } else {
        this.data.reply = true;
        this.FeedbackList(this.data.ids[0]);
      }
    },
    showreply(item) {
      this.data.reply = true;
      this.data.ids[0] = item;
      this.FeedbackList(item);
    },
    submitfeedback() {
      if (this.data.replycontent === '') {
        this.message('回复内容不能为空');
      } else {
        CourseQuestionaire.feedback({
          content: this.data.replycontent,
          joinRecordId: this.data.ids[0].id,
          photos: this.data.imgs.join(','),
          memberId: this.data.ids[0].memberId
        }).then(res => {
          if (res.resCode == 200) {
            this.message('回复成功', 'success');
            this.data.reply = false;
            this.FeedbackList(this.data.ids[0]);
          } else {
            this.message('回复失败', 'fail');
          }
        })
      }
    },
    setTop(id, istop) {
      CourseQuestionaire.setTop({ id: id, isTop: istop }).then(res => {
        if (res.resCode == 200) {
          this.message('设置成功', 'success');
          this.load();
        } else {
          this.message('设置失败', 'fail');
        }
      })
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
    .showdata{
      /deep/ .el-dialog{
        width: 1000px;
      }
    }
  }

  .time{
    font-size:12px;
    color:#a29f9f;
    line-height: 0;
  }
  .content{
    position: relative;
    width: 80%;
    .delcontent{
      position: absolute;
      right: 0;
      bottom: 5px;
    }
  }
</style>
