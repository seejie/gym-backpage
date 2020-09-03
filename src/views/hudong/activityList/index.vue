<template>
  <div class="activityList">
    <el-card class="box-card card" shadow="never">
      <!--查询表单-->
      <div class="from-wrap">
        <el-form
          :inline="true"
          :model="formInline"
          label-width="80px"
          class="demo-form-inline"
          style="width:100%"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="搜索标题">
                <el-input v-model="formInline.content" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布状态">
                <el-select v-model="formInline.publish" placeholder="请选择">
                  <el-option label="待审核" :value="1"></el-option>
                  <el-option label="立即发布" :value="2"></el-option>
                  <el-option label="存草稿" :value="3"></el-option>
                  <el-option label="下线" :value="4"></el-option>
                  <el-option label="定时发布" :value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布位置">
                <el-select v-model="formInline.place" placeholder="请选择">
                  <el-option label="置顶" :value="2"></el-option>
                  <el-option label="默认" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="评论权限">
                <el-select v-model="formInline.commentPurview" placeholder="请选择">
                  <el-option label="禁言" :value="1"></el-option>
                  <el-option label="未禁言" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布单位">
                <el-input v-model="formInline.unitId" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="formInline.time"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:MM:SS"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="活动类型">
                <el-select v-model="formInline.type" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in typeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="付费类型">
                <el-select v-model="formInline.needFee" placeholder="请选择">
                  <el-option label="收费" :value="1"></el-option>
                  <el-option label="免费" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item style="float:right">
              <el-button type="primary" @click="informationList">搜索</el-button>
              <el-button @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <!--操作按钮-->
      <div class="button-wrap">
        <el-button size="mini" style="padding: 5px 20px">
          <el-checkbox v-model="checked" @change="handleSelectAll"></el-checkbox>
        </el-button>
        <el-button @click="wayBatchPublish(2)" size="mini">批量上线</el-button>
        <el-button @click="wayBatchPublish(4)" size="mini">批量下线</el-button>
        <el-button type="danger" @click="wayBatchDel" size="mini">删除</el-button>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;padding:0 12px"
          @selection-change="selectionchange"
          :header-cell-class-name="headerRowStyle"
          :cell-class-name="cellClassName"
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div>{{props.row.introduction}}</div>
              <template v-if="props.row.tuJingList && props.row.tuJingList.length">
                <div class="tujing-list">
                  <div>途径路线:</div>
                  <div>
                    <div v-for="(item,index) in props.row.tuJingList" :key="index">
                      <div>{{item.store.introduction}}</div>
                      <el-image
                        v-for="(l,i) in item.store.coverImage"
                        :key="i"
                        style="width: 100px; height: 100px"
                        :src="l.url"
                      ></el-image>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" width="350">
            <template slot-scope="scope">
              <div style="display: flex;align-items: center">
                <el-tag size="mini" style="margin-right: 10px" v-if="scope.row.releaseLoc==2">顶</el-tag>
                <el-tag size="mini" style="margin-right: 10px;visibility:hidden" v-else></el-tag>
                <div class="title">
                  <div class="img-wrap">
                    <el-image :src="scope.row.picUrl" fit="contain">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                  <div class="text-wrap">
                    <p class="oneTitle">{{scope.row.title}}</p>
                    <p class="twoTitle">{{scope.row.summary}}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="发布状态" width="80">
            <template slot-scope="scope">
              <span class="publish_status sD" v-if="scope.row.status == 1">待审核</span>
              <span class="publish_status sYs" v-if="scope.row.status == 2">已上线</span>
              <span class="publish_status sC" v-if="scope.row.status == 3">存草稿</span>
              <span class="publish_status sYx" v-if="scope.row.status == 4">已下线</span>
              <span class="publish_status sDs" v-if="scope.row.status == 9">定时发布</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="栏目" width="80">
            <template slot-scope="scope">
              <span>{{typeList.find( v=> scope.row.type == v.value).label}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="发布单位" width="80"></el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.createTime && $moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="views" label="阅读数" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.views">浏览&nbsp;{{scope.row.views}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="margin-right:5px" @click="handleSQLClick(scope)">数据</el-button>|
              <el-button type="text" style="margin-left:5px;margin-right: 5px">
                <router-link
                  :to="{name: typeList.find(v => v.value == scope.row.type).url,params:{id:scope.row.id}}"
                >编辑</router-link>
              </el-button>|
              <el-dropdown @command="dropdownMenu" style="margin-left:5px">
                <el-button type="text">
                  更多
                  <i class="el-icon-arrow-down"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{id:scope.row.id,type:1,status:scope.row.status==2?4:2}"
                  >{{scope.row.status==2?'下线':'上线'}}</el-dropdown-item>
                  <el-dropdown-item
                    :command="{id:scope.row.id,type:2,muted:scope.row.muted==0?1:0}"
                  >{{scope.row.muted==0?"取消禁言":"禁言"}}</el-dropdown-item>
                  <el-dropdown-item
                    :command="{id:scope.row.id,type:3,releaseLoc: scope.row.releaseLoc == 1?2:1}"
                  >{{scope.row.releaseLoc==2?"取消置顶":"置顶"}}</el-dropdown-item>
                  <el-dropdown-item :command="{id:scope.row.id,type:4}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="text-align: right;margin-top: 20px">
          <Pagination
            v-if="tableData.length!=0"
            :pageSize="pageSize"
            :pageSizes="pageSizes"
            :total="totalCount"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></Pagination>
        </div>
      </div>
    </el-card>
    <el-dialog :visible.sync="registerdata.isshow" title="报名数据">
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" style="justify-content: space-around">
            <el-col :span="4">
              <el-select placeholder="选项" v-model="registerdata.searchdata.select">
                <el-option v-for="item in registerdata.searchdata.option" :key="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-input placeholder="请输入关键字" style="width: 150px" v-model="registerdata.key"></el-input>
              <el-button
                type="primary"
                @click="getinteraction_typeclick(registerdata.searchdata.currenttype,registerdata.searchdata.currentid)"
              >搜索</el-button>
            </el-col>
            <el-col :span="4" style="width: 100px">
              <el-select placeholder="状态" v-model="registerdata.searchdata.statu">
                <el-option v-for="item in registerdata.searchdata.status" :key="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-button type="primary">审核通过</el-button>
              <el-button type="primary">导出</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table
        ref="registerdata"
        :data="registerdata.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name" label="头像" width="120">
          <template slot-scope="scope">
            <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.unitImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="昵称" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.user_name}}</template>
        </el-table-column>
        <el-table-column prop="address" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="name" label="上传" width="120">
          <template slot-scope="scope">
            <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.unitImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="审核" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status==1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="registerdata.length!=0"
          :pageSize="registerdata.pageSize"
          :pageSizes="registerdata.pageSizes"
          :total="registerdata.totalCount"
          @currentChange="currentChange(scope.row.interaction_type,scope.row.id)"
          @sizeChange="sizeChange(scope.row.interaction_type,scope.row.id)"
        ></Pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="answersdata.isshow" title="答题数据">
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" style="justify-content: space-around">
            <el-col :span="4">
              <el-select placeholder="选项" v-model="answersdata.searchdata.select">
                <el-option v-for="item in answersdata.searchdata.option" :key="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-input placeholder="请输入关键字" style="width: 150px" v-model="answersdata.key"></el-input>
              <el-button
                type="primary"
                @click="getinteraction_typeclick(answersdata.searchdata.currenttype,answersdata.searchdata.currentid)"
              >搜索</el-button>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">导出</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table
        ref="answersdata"
        :data="answersdata.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name" label="头像" width="120">
          <template slot-scope="scope">
            <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.unitImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="昵称" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.user_name}}</template>
        </el-table-column>
        <el-table-column prop="address" label="年级" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="联系方式" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="地区" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="正确率" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="answersdata.length!=0"
          :pageSize="answersdata.pageSize"
          :pageSizes="answersdata.pageSizes"
          :total="answersdata.totalCount"
          @currentChange="currentChange(scope.row.interaction_type,scope.row.id)"
          @sizeChange="sizeChange(scope.row.interaction_type,scope.row.id)"
        ></Pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="votedata.isshow" title="投票数据">
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" style="text-align: right">
            <el-col>
              <el-button type="primary">导出</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table
        ref="votedata"
        :data="votedata.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name" label="头像" width="120">
          <template slot-scope="scope">
            <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.pic_url"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="选项" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column prop="address" label="票数" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.vote_num}}</template>
        </el-table-column>
        <el-table-column prop="address" label="占比" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.per}}</template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="votedata.length!=0"
          :pageSize="votedata.pageSize"
          :pageSizes="votedata.pageSizes"
          :total="votedata.totalCount"
          @currentChange="currentChange(scope.row.interaction_type,scope.row.id)"
          @sizeChange="sizeChange(scope.row.interaction_type,scope.row.id)"
        ></Pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="lottorydata.isshow" title="中奖数据">
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" style="justify-content: space-around">
            <el-col :span="4">
              <el-select placeholder="选项" v-model="lottorydata.searchdata.select">
                <el-option v-for="item in lottorydata.searchdata.option" :key="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-input placeholder="请输入关键字" style="width: 150px" v-model="lottorydata.key"></el-input>
              <el-button
                type="primary"
                @click="getinteraction_typeclick(lottorydata.searchdata.currenttype,lottorydata.searchdata.currentid)"
              >搜索</el-button>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">导出</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table
        ref="lottorydata"
        :data="lottorydata.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name" label="头像" width="120">
          <template slot-scope="scope">
            <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.unitImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="昵称" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="address" label="联系方式" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column prop="address" label="奖项" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="参与时间" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="正确率" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="lottorydata.length!=0"
          :pageSize="lottorydata.pageSize"
          :pageSizes="lottorydata.pageSizes"
          :total="lottorydata.totalCount"
          @currentChange="currentChange(scope.row.interaction_type,scope.row.id)"
          @sizeChange="sizeChange(scope.row.interaction_type,scope.row.id)"
        ></Pagination>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="questiondata.isshow" title="问卷数据">
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" style="justify-content: left">
            <el-col :span="4">
              <el-select placeholder="选项" v-model="questiondata.searchdata.select">
                <el-option v-for="item in questiondata.searchdata.option" :key="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" style="display: flex">
              <el-input placeholder="请输入关键字" style="width: 150px" v-model="questiondata.key"></el-input>
              <el-button
                type="primary"
                @click="getinteraction_typeclick(questiondata.searchdata.currenttype,questiondata.searchdata.currentid)"
              >搜索</el-button>
            </el-col>
            <el-col :span="7">
              <el-button type="primary">导出</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table
        ref="questiondata"
        :data="questiondata.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="name" label="头像" width="120">
          <template slot-scope="scope">
            <el-avatar class="headimg" shape="square" size="medium" :src="scope.row.unitImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="昵称" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.user_name}}</template>
        </el-table-column>
        <el-table-column prop="address" label="年级" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="联系方式" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="地区" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column prop="address" label="参与时间" show-overflow-tooltip width="150px">
          <template
            slot-scope="scope"
          >{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px">
        <Pagination
          v-if="questiondata.length!=0"
          :pageSize="questiondata.pageSize"
          :pageSizes="questiondata.pageSizes"
          :total="questiondata.totalCount"
          @currentChange="currentChange(scope.row.interaction_type,scope.row.id)"
          @sizeChange="sizeChange(scope.row.interaction_type,scope.row.id)"
        ></Pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import Pagination from '@/components/Pagination';
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      /*表格数据*/
      tableData: [],
      sqlType: '', //显示表格类型
      SQLTableVisible: false, //是否显示弹出框
      checked: false,
      typeList: [
        {
          label: '基础报名',
          value: 'BASIC_REG',
          url: 'basicregistration',
        },
        {
          label: '高级报名',
          value: 'ADVANCED_REG',
          url: 'advancedregistration',
        },
        {
          label: '基础问卷',
          value: 'BASIC_QA',
          url: 'basicquestionnaire',
        },
        {
          label: '投票',
          value: 'VOTE',
          url: 'vote',
        },
        {
          label: '答题',
          value: 'ANSWER',
          url: 'answequestions',
        },
        {
          label: '众筹',
          value: 'CROWD_FUND',
          url: 'crowdfunding',
        },
        {
          label: '测试',
          value: 'TEST',
          url: 'answequestionstest',
        },
        {
          label: '共享报名',
          value: 'SHARE_REG',
          url: 'sharingregistration',
        },
      ],
      formInline: {
        content: '',
        publish: '',
        place: '',
        commentPurview: '',
        unitId: '',
        time: [],
        type: '',
        needFee: '',
      },
      registerdata: {
        //报名数据
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        key: '',
        isshow: false,
        ids: [],
        list: [],
        searchdata: { option: [], status: [], statu: '', select: '', currenttype: '', currentid: '' },
      },
      answersdata: {
        //答题数据
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        key: '',
        isshow: false,
        list: [],
        ids: [],
        searchdata: { option: [], select: '', currenttype: '', currentid: '' },
      },
      questiondata: {
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        key: '',
        isshow: false,
        list: [],
        ids: [],
        searchdata: { option: [], select: '', currenttype: '', currentid: '' },
      }, //问卷数据
      lottorydata: {
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        key: '',
        isshow: false,
        list: [],
        ids: [],
        searchdata: { option: [], select: '', currenttype: '', currentid: '' },
      }, //中奖数据
      votedata: {
        totalCount: 0,
        curPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5,
        key: '',
        isshow: false,
        list: [],
        ids: [],
      }, //投票数据
      // 分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      ids: [],
    };
  },
  mounted() {},
  created() {
    this.pageSize = this.pageSizes[0];
    this.informationList();
  },
  methods: {
    informationList() {
      this.$ajax
        .get('/huodong/list', {
          params: {
            pageNum: this.curPage,
            pageSize: this.pageSize,
            unitId: this.formInline.unitId,
            muted: this.formInline.commentPurview,
            status: this.formInline.publish,
            releaseLoc: this.formInline.place,
            title: this.formInline.content,
            releaseTimeBegin: this.formInline.time[0],
            releaseTimeEnd: this.formInline.time[1],
            needFee: this.formInline.needFee,
            type: this.formInline.type,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.tableData = res.resObject.list;
            this.totalCount = res.resObject.totalCount;
          }
        })
        .catch(err => console.log(err));
    },
    //  全选
    selectionchange(val) {
      this.ids = [];
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id);
      }
      if (this.tableData.length == val.length) {
        this.checked = true;
      } else {
        this.checked = !1;
      }
    },
    //  重置表单搜索
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //   分页
    currentChange(val) {
      this.curPage = val;
      this.informationList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.informationList();
    },
    dropdownMenu(data) {
      switch (data.type) {
        case 1: // s上下线
          this.wayPublish(data.id, data.status);
          break;
        case 2: //  禁言
          this.waycomment(data.id, data.muted);
          break;
        case 3: //  置顶
          this.wayposition(data.id, data.releaseLoc);
          break;
        case 4: // 删除
          this.waydel(data.id);
          break;
      }
    },
    wayBatchPublish(status) {
      if (this.ids.length === 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        this.$ajax
          .post('/huodong/setStatus', {
            ids: this.ids,
            status: status,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.informationList();
              this.message('成功', 'success');
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    wayPublish(id, status) {
      // 上下线
      this.$ajax
        .post('/huodong/setStatus', { ids: [id], status: status })
        .then(res => {
          if (res.resCode === 200) {
            this.informationList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    waycomment(id, muted) {
      // 禁言
      this.$ajax
        .post('/huodong/setMuted', { ids: [id], muted: muted })
        .then(res => {
          if (res.resCode === 200) {
            this.informationList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    wayposition(id, releaseLoc) {
      // 置顶
      this.$ajax
        .post('/huodong/setReleaseLoc', { ids: [id], releaseLoc: releaseLoc })
        .then(res => {
          if (res.resCode === 200) {
            this.informationList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    // 批量删除
    wayBatchDel() {
      if (this.ids.length == 0) {
        this.message('请选择需要操作的列', 'error');
      } else {
        var that = this;
        this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            that.$ajax
              .post('/huodong/delete', {
                ids: that.ids,
              })
              .then(res => {
                if (res.resCode == 200) {
                  that.informationList();
                  that.message('成功', 'success');
                } else {
                  that.message(res.message, 'error');
                }
              })
              .catch(err => console.log(err));
          })
          .catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    waydel(id) {
      // 删除
      var that = this;
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          that.$ajax
            .post('/huodong/delete', { ids: [id] })
            .then(res => {
              if (res.resCode === 200) {
                that.informationList();
                that.message('成功', 'success');
              } else {
                that.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    //  全部选中
    handleSelectAll(val) {
      this.$refs['multipleTable'].toggleAllSelection();
    },
    //  设置表头样式
    headerRowStyle(row) {
      if (row.columnIndex == 1) {
        return 'first-cell-style';
      }
    },
    //  设置行内单元格class
    cellClassName(cell) {
      if (cell.columnIndex == 7) {
        return 'cell-self-style';
      }
    },
    // 点击数据按钮
    handleSQLClick(scope) {
      this.sqlType = scope.row.type;
      this.SQLTableVisible = true;
    },
    // 错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type,
        duration: 5 * 1000,
      });
    },
    handleSelectionChange(val, type) {
      //全选
      switch (type) {
        case 1:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.registerdata.ids.push(val[i].id);
            }
          }
          break;
        case 2:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.answersdata.ids.push(val[i].id);
            }
          }
          break;
        case 3:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.votedata.ids.push(val[i].id);
            }
          }
          break;
        case 4:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.lottorydata.ids.push(val[i].id);
            }
          }
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.questiondata.ids.push(val[i].id);
            }
          }
          break;
        case 8:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.registerdata.ids.push(val[i].id);
            }
          }
          break;
        case 9:
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.registerdata.ids.push(val[i].id);
            }
          }
          break;
        default:
          this.form.ids = [];
          if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
              this.searchData.ids.push(val[i].id);
            }
          }
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../scss/main.scss';
.activityList {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
}
.card {
  .button-wrap {
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  /deep/ .el-table {
    .cell {
      font-size: 12px;
      color: rgb(152, 152, 152);
      display: flex;
      align-items: center;
    }
    .el-table-column--selection .cell {
      padding-left: 10px;
    }
    .el-table__expanded-cell {
      padding: 8px 122px;
      background-color: #fbfbfb;
      * {
        color: rgb(204, 204, 204);
      }
      & > div:nth-child(1) {
        margin-bottom: 8px;
      }
    }
    .tujing-list {
      width: 100%;
      display: flex;
      & > div:nth-child(1) {
        width: 70px;
      }
    }
    .has-gutter {
      tr {
        th:nth-child(1) {
          div.cell {
            display: none;
          }
        }
      }
    }
    .first-cell-style {
      padding-left: 40px;
    }
    .cell-self-style {
      .cell {
        display: flex;
        justify-content: left;
        align-items: center;
        .el-button {
          margin-left: 5px;
          margin-right: 5px;
        }
      }
    }
    .title {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;

      .img-wrap {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background-color: rgba(242, 242, 242, 1);
        border-radius: 3px;
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;
          .image-slot {
            @extend .el-image;
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            i {
              font-size: 20px;
              color: #e3e3e3;
            }
          }
        }
      }
      .text-wrap {
        overflow: hidden;
        height: 40px;
        p {
          margin: 0;
          padding: 0;
        }
        .oneTitle {
          font-weight: 650;
          font-size: 16px;
        }
        .twoTitle {
          font-size: 12px;
          color: rgb(152, 152, 152);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .publish_status {
      position: relative;
      &::before {
        width: 5px;
        height: 5px;
        content: '';
        border-radius: 50%;
        position: absolute;
        left: -10px;
        top: 5px;
      }
      &.sD {
        color: #989898;
        &::before {
          background-color: #989898;
        }
      }
      &.sYs {
        color: #2eba07;
        &::before {
          background-color: #108de9;
        }
      }
      &.sC {
        color: #2eba07;
        &::before {
          background-color: #108de9;
        }
      }
      &.sYx {
        color: #cc0000;
        &::before {
          background-color: #cc0000;
        }
      }
      &.sDs {
        color: #2eba07;
        &::before {
          background-color: #108de9;
        }
      }
    }
  }
}
</style>
