<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card">
      <el-form
        :inline="true"
        v-show="showSearch"
        ref="form"
        :model="form"
        label-width="80px"
        style="background-color: #f5f7fa; padding: 8px 0"
      >
        <el-form-item label="搜索标题">
          <el-input v-model="form.title" clearable placeholder="请输入" style="width: 320px;"></el-input>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="form.status" clearable placeholder="请选择" style="width: 320px;">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="已上线" value="1"></el-option>
            <el-option label="已下线" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布位置">
          <el-select v-model="form.releasePostion" clearable placeholder="请选择" style="width: 320px;">
            <el-option label="默认" value="0"></el-option>
            <el-option label="置顶" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布单位">
          <el-input v-model="form.unitName" style="width: 320px;" clearable placeholder="请输入"></el-input>
        </el-form-item>
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
        <el-button size="small" @click="goAddPage">创建问答</el-button>
        <el-button :disabled="!multipleTable.length" size="small" @click="batchOnline">批量上线</el-button>
        <el-button :disabled="!multipleTable.length" size="small" @click="batchOffline">批量下线</el-button>
        <el-button :disabled="!multipleTable.length" size="small" @click="deleteCourse">删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; flex: 1; background-color: #ffffff"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <span style="padding-left: 60px">{{ props.row.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="status" label="发布状态" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="unitName" label="发布单位" width="200"></el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" width="180"></el-table-column>
        <el-table-column prop="joinedNum" label="填报数" width="120"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="cancleTop(scope.row)"
            >{{scope.row.releasePostion?'取消置顶': '置顶'}}</el-button>
            <el-button type="text" size="small" @click="showData(scope.row)">数据</el-button>
            <el-button type="text" size="small" @click="goEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteCourse(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="batchOffline(scope.row)">下线</el-button>
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
    </el-card>
    <quesData :key="quesId" v-if="showQues" :studentId="quesId" @onClose="closeStudent"></quesData>
  </div>
</template>

<script>
// import cityList from '@/utils/citys';
import assign from 'object-assign';
import quesData from './quesData';
import { questList, delQuestion, checkQuestion, setQuestion, dealTime } from '../sever';

export default {
  name: '',
  data() {
    return {
      pageHeight: window.innerHeight - 100 + 'px',
      activeName: 'first',
      form: {
        courseTitle: '',
        courseStatus: '',
        unitName: '',
        date: [],
        pageNum: 1,
        pageSize: 10,
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      multipleTable: [],
      ids: [],
      showSearch: true,
      showQues: false,
      quesId: '',
    };
  },
  components: { quesData },
  mounted() {
    this.onSearch();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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
    changePicker(val) {
      console.log(val);
    },
    onSearch() {
      const that = this;
      const param = dealTime(['beginReleaseTime', 'endReleaseTime'], this.form);
      questList(param).then(res => {
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
        date: []
      };
    },
    goAddPage() {
      this.$router.push('/coursedirectmanager/add-questionsanswer');
    },
    goEdit(obj) {
      this.$router.push(`/coursedirectmanager/add-questionsanswer/${obj.id}`);
    },
    closeStudent() {
      this.showQues = false;
    },
    // 批量上线
    batchOnline(obj, flag) {
      const that = this;
      const a = this.multipleTable.map(v => v.id);
      const ids = a.length ? a : [obj.id];
      checkQuestion({
        status: 1,
        ids, // this.ids
      }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('批量上线成功');
          that.onSearch();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    // 批量下限
    batchOffline(obj, flag) {
      const that = this;
      const a = this.multipleTable.map(v => v.id);
      const ids = a.length ? a : [obj.id];
      checkQuestion({
        status: 2,
        ids,
      }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('批量下线成功');
          that.onSearch();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    // 批量删除
    deleteCourse(obj) {
      const that = this;
      const a = this.multipleTable.map(v => v.id);
      const ids = a.length ? a : [obj.id];
      delQuestion({ ids }).then(res => {
        if (res.resCode == 200) {
          that.$message.success(!a.length ? '删除成功' : '批量删除成功');
          that.onSearch();
        } else {
          that.$message.error(res.message, 'error');
        }
      });
    },
    // 取消置顶
    cancleTop(obj) {
      const that = this;
      setQuestion({
        id: obj.id,
        isTop: obj.releasePostion ? 0 : 1,
      }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('取消置顶成功');
          that.onSearch();
        } else {
          that.$message.error(res.message);
        }
      });
    },
    showData(obj) {
      this.showQues = true;
      this.quesId = obj.id;
    },
    formatter(row) {
      if (row.status === 0) return '待审核';
      if (row.status === 1) return '已发布';
      if (row.status === 2) return '已下线';
      return row.status || '';
    },
  },
};
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
</style>
