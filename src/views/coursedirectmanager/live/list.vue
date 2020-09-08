<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <!-- <el-card class="box-card"> -->
      <!-- <el-tabs> -->
        <el-form
          :inline="true"
          v-show="showSearch"
          ref="form"
          :model="form"
          label-width="80px"
          style="background-color: #ffffff; padding: 8px 0"
        >
          <el-form-item label="搜索名称">
            <el-input v-model="form.courseTitle" clearable placeholder="请输入" style="width: 320px;"></el-input>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select
              clearable
              v-model="form.courseStatus"
              placeholder="请选择"
              style="width: 320px;"
            >
              <el-option label="待审核" value="0"></el-option>
              <el-option label="已上线" value="1"></el-option>
              <el-option label="已下线" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布位置">
            <el-select clearable v-model="form.columnSort" placeholder="请选择" style="width: 320px;">
              <el-option label="默认" value="0"></el-option>
              <el-option label="置顶" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布单位">
            <el-select clearable style="width: 320px;" placeholder="请选择" v-model="form.unitId">
              <el-option
                v-for="item in unitListData"
                :key="item.id"
                :label="item.unitName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="发布单位">
            <el-input v-model="form.unitName" style="width: 320px;" placeholder="请输入"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="地区筛选">
            <el-cascader
              v-model="form.proCity"
              style="width: 160px;"
              :options="options"
              placeholder="请选择省市"
              @change="handleCity"
            ></el-cascader>
            <el-select v-model="form.areaId" placeholder="请选择县区" style="width: 160px;">
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
            <span
              style="color: #29bc4f;font-size: 14px; margin: 0 10px; cursor: pointer"
              @click="changeShowSearch(false)"
            >
              收起
              <i class="el-icon-arrow-up"></i>
            </span>
          </div>
        </el-form>
        <div
          style="color: #29bc4f;font-size: 14px; text-align: center; cursor: pointer"
          @click="changeShowSearch(true)"
          v-show="!showSearch"
        >
          展开
          <i class="el-icon-arrow-down"></i>
        </div>
        <div style="margin: 8px 0; background-color: #ffffff;padding: 8px">
          <el-button size="small" @click="goAddPage">创建直播</el-button>
          <el-button size="small" @click="batchOnline">批量上线</el-button>
          <el-button size="small" @click="batchOffline">批量下线</el-button>
          <el-button size="small" @click="deleteCourse">删除</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%; flex: 1; background-color: #ffffff"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="courseTitle" label="直播名称" width="240">
            <template slot-scope="scope">
              <span :class="{ isTop: scope.row.columnSort === 1 }">{{scope.row.courseTitle}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="courseAnchor" label="主播" width="120"></el-table-column>
          <el-table-column prop="name" label="发布人" width="120"></el-table-column>
          <el-table-column
            prop="courseBeginTime"
            :formatter="timeFormatter"
            label="直播时间"
            width="240"
          ></el-table-column>
          <el-table-column prop="courseStatus" label="发布状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.courseStatus === 0" class="unline">草稿</span>
              <span v-if="scope.row.courseStatus === 1" class="online">已上线</span>
              <span v-if="scope.row.courseStatus === 2" class="downline">已下线</span>
            </template>
          </el-table-column>
          <el-table-column prop="commentStatus" label="评论开关" width="120">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.commentStatus"
                @change="changeCommentStatus(scope.row)"
                :active-value="1"
                :inactive-value="0"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="releaseTime" label="发布时间" width="120"></el-table-column>
          <el-table-column prop="name" label="访问量" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="240">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="openHome(scope.row)">直播间</el-button>
              <el-button
                v-if="scope.row.courseStatus === 1"
                type="text"
                size="small"
                @click="batchOffline(scope.row, true)"
              >下线</el-button>
              <el-button
                v-if="scope.row.courseStatus !== 1"
                type="text"
                size="small"
                @click="batchOnline(scope.row, true)"
              >上线</el-button>
              <el-button type="text" size="small" @click="goEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="goComment(scope.row)">评论</el-button>
              <el-button type="text" size="small" @click="plugFlow(scope.row)">推流地址</el-button>
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
          :total="total"
        ></el-pagination>
      <!-- </el-tabs> -->
    <!-- </el-card> -->
    <PlugFlow v-if="showPlugFlow" :address="liveUrl" @onClose="changeValue('showPlugFlow', false)" />
    <el-dialog :visible.sync="liveHomeAble" width="400px">
      <div id="id_test_video" style="width:100%; height:300px;"></div>
    </el-dialog>
  </div>
</template>

<script>
// import cityList from '@/utils/citys';
import assign from 'object-assign';
import moment from 'moment/moment';
import CheckConfig from './modal/check';
import PlugFlow from './modal/plug-flow';
import { liveList, deleteLive, setCommentStatus, dealTime, oneCategory, twoCategory, checkLive } from '../sever';
import { listSelfAndChildren } from '@/api/sass/unit';

export default {
  name: '',
  data() {
    return {
      pageHeight: window.innerHeight - 100 + 'px',
      liveUrl: '',
      liveHomeAble: false,
      form: {
        courseTitle: '',
        courseStatus: '',
        unitName: '',
        unitId: '',
        // proCity: [],
        // areaId: '',
        date: [],
        // firstCategoryId: '',
        // secondCategoryId: '',
        pageNum: 1,
        pageSize: 10,
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      multipleTable: [],
      // options: cityList.map(v =>
      //   assign({
      //     value: v.code,
      //     label: v.name,
      //     children: v.city.map(v => ({
      //       value: v.code,
      //       label: v.name,
      //     })),
      //   })
      // ),
      // areaList: [],
      ids: [],
      // oneCategoryArr: [],
      // twoCategoryArr: [],
      showSearch: true,
      showCheck: false,
      showPlugFlow: false,
      player: '',
      unitListData: [], // 单位列表
    };
  },
  created() {
    this.unitList();
  },
  mounted() {
    this.init();
    this.onSearch();
  },
  components: { CheckConfig, PlugFlow },
  methods: {
    changeValue(key, value) {
      this[key] = value;
    },
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.onSearch();
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.onSearch();
    },
    changeShowSearch(val) {
      this.showSearch = val;
    },
    // handleCity(val) {
    //   this.form.proCity = val;
    //   const obj = cityList.find(v => v.code === val[0]).city.find(v => v.code === val[1]);
    //   this.areaList = obj.area.map(v => ({ value: v.code, label: v.name }));
    //   this.form.areaId = '';
    // },
    onSearch() {
      const that = this;
      // let param = assign({}, this.form, { provinceId: this.form.proCity[0], cityId: this.form.proCity[1] });
      const param = dealTime(['beginReleaseTime', 'endReleaseTime'], this.form);
      liveList(param).then(res => {
        if (res.resCode == 200) {
          that.tableData = res.resObject.list || [];
          that.total = res.resObject.totalCount;
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    onReset() {
      this.form = {
        courseTitle: '',
        courseStatus: '',
        unitName: '',
        unitId: '',
        // proCity: [],
        // areaId: '',
        date: [],
        // firstCategoryId: '',
        // secondCategoryId: '',
      };
    },
    goAddPage() {
      this.$router.push({
        name: 'coursedirectmanager/add-live',
      });
    },
    goEdit(obj) {
      this.$router.push(`/coursedirectmanager/add-live/${obj.id}`);
    },
    goComment(obj) {
      this.$router.push(`/coursedirectmanager/comment-details/${obj.id}`);
    },
    batchOnline(obj, flag) {
      const that = this;
      const a = this.multipleTable.map(v => v.id);
      const courseId = !flag ? a : [obj.id];
      checkLive({
        status: 1,
        courseId, //
      }).then(res => {
        if (res.resCode == 200) {
          that.$message.success(!flag ? '批量上线成功' : '上线成功');
          that.onSearch();
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    batchOffline(obj, flag) {
      const that = this;
      const a = this.multipleTable.map(v => v.id);
      const courseId = flag ? [obj.id] : a;
      checkLive({
        status: 2,
        courseId,
      }).then(res => {
        if (res.resCode == 200) {
          that.$message.success(!flag ? '批量下线成功' : '下线成功');
          that.onSearch();
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    changeCommentStatus(obj) {
      const that = this;
      setCommentStatus({ commentStatus: obj.commentStatus, courseId: obj.id }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
          that.onSearch();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    deleteCourse() {
      const that = this;
      deleteLive({ ids: this.multipleTable.map(v => v.id) }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('批量删除成功');
          that.onSearch();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    openHome(obj) {
      this.liveHomeAble = true;
      const that = this;
      setTimeout(() => {
        if (that.player) that.player.destroy();
        that.player = new TcPlayer('id_test_video', {
          m3u8: obj.liveUrl || 'http://live.pulishanpin.com/live/jdm.m3u8', // 请替换成实际可用的播放地址
          autoplay: true, // iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          poster: 'http://www.test.com/myimage.jpg',
          width: '400', // 视频的显示宽度，请尽量使用视频分辨率宽度
          height: '300', // 视频的显示高度，请尽量使用视频分辨率高度
        });
      }, 1000);
    },
    // getParam(obj) {
    //   const arr = [
    //     'courseTitle',
    //     'courseStatus',
    //     'unitName',
    //     'areaId',
    //     'firstCategoryId',
    //     'secondCategoryId',
    //     'pageNum',
    //     'pageSize',
    //   ];
    //   let param = arr.reduce((p, c) => {
    //     if (obj[c]) return assign(p, { [c]: obj[c] });
    //     return p;
    //   }, {});
    //   if (obj.data.length)
    //     param = assign(param, {
    //       beginReleaseTime: moment(obj.date[0]).format('YYYY-MM-DD'),
    //       endReleaseTime: moment(obj.date[1]).format('YYYY-MM-DD'),
    //     });
    //   if (obj.proCity.length) param = assign(param, { provinceId: obj.proCity[0], cityId: obj.proCity[1] });
    //   return param;
    // },
    init() {
      // oneCategory({}).then(res => {
      //   if (res.resCode == 200) {
      //     this.oneCategoryArr = res.resObject || [];
      //   } else {
      //     that.$message.error(res.message);
      //   }
      // });
    },
    // getTwoCategory(unitParentId) {
    //   twoCategory({ unitParentId }).then(res => {
    //     if (res.resCode == 200) {
    //       this.twoCategoryArr = res.resObject || [];
    //     } else {
    //       that.$message.error(res.message);
    //     }
    //   });
    // },
    // statusFormatter(row) {
    //   if (row.courseStatus === 0) return '<span>草稿</span>';
    //   if (row.courseStatus === 1) return '<span>已发布</span>';
    //   if (row.courseStatus === 2) return '已下线';
    //   return row.courseStatus || '';
    // },
    timeFormatter(row) {
      if (!row.courseBeginTime || !row.courseEndTime) return '';
      return row.courseBeginTime + '～' + row.courseEndTime;
    },
    plugFlow(obj) {
      this.showPlugFlow = true;
      this.liveUrl = obj.liveUrl;
    },
    // 获取单位
    unitList() {
      listSelfAndChildren().then(res => {
        if (res.resCode == 200) {
          this.unitListData = res.resObject.list;
        }
      });
    },
  },
};
</script>

<style scoped>
.activeManage {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
}
.activeManage .box-card {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.box-card {
  display: flex;
  flex-direction: column;
}
.box-card >>> .el-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.box-card >>> .el-tab-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.box-card >>> .el-form-item {
  margin-bottom: 10px;
}
.box-card .unline {
  color: rgb(152, 152, 152);
}
.box-card .unline:before {
  content: '●';
  font-size: 12px;
  color: rgb(152, 152, 152);
}
.box-card .online {
  color: #2eba07;
}
.box-card .online:before {
  content: '●';
  font-size: 12px;
  color: #108de9;
}
.box-card .downline {
  color: #cc0000;
}
.box-card .downline:before {
  content: '●';
  font-size: 12px;
  color: #cc0000;
}
.box-card .isTop {
  padding-left: 25px;
  background-image: url('../ding.png');
  background-position: left center;
  background-repeat: no-repeat;
  background-size: 15px 16px;
}
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__header .el-dialog__headerbtn {
  z-index: 200;
}
/deep/ .el-dialog__body {
  padding: 0;
}
/deep/ .el-dialog__header .el-dialog__headerbtn {
  top: 6px;
}
</style>
