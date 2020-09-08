<template>
  <div class="activeManage">
    <el-form
      :inline="true"
      v-show="showSearch"
      ref="form"
      :model="filter"
      label-width="75px"
      style="background-color: #ffffff; padding: 8px 0"
    >
      <el-form-item label="订单编号">
        <el-input v-model="filter.orderCode" clearable placeholder="请输入" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="filter.status" clearable placeholder="请选择" style="width: 300px;">
          <el-option v-for="item in statusList " :label="item.name" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker
          v-model="filter.date"
          type="daterange"
          style="width: 300px"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="filter.customerName" clearable placeholder="请输入" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="用户手机">
        <el-input v-model="filter.customerPhone" clearable placeholder="请输入" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="店铺名称">
        <el-input v-model="filter.unitName" style="width: 300px;" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="系统来源">
        <el-select v-model="filter.idfv" clearable placeholder="请选择" style="width: 300px;">
          <el-option label="公众号" :value="1"></el-option>
          <el-option label="小程序" :value="2"></el-option>
          <el-option label="APP" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道来源">
        <el-select
          v-model="filter.qudaoId"
          clearable
          placeholder="请选择"
          style="width: 300px;"
        >
          <el-option label="公众号" :value="1"></el-option>
          <el-option label="小程序" :value="2"></el-option>
          <el-option label="APP" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <div style="text-align: right">
        <el-button type="primary" @click="search">搜索</el-button>
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
      <el-button size="small" @click="createCourseVerify">批量核销</el-button>
      <el-button size="small" @click="createTuikuan">批量退款</el-button>
      <el-button size="small" @click="downCourse">导出</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%; flex: 1; background-color: #ffffff"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="序号" width="120"></el-table-column>
      <el-table-column prop="code" label="订单编号" width="120"></el-table-column>
      <el-table-column prop="productName" label="商品名称" width="120"></el-table-column>
      <el-table-column prop="realPrice" label="金额(元)" width="120"></el-table-column>
      <el-table-column prop="customerName" label="客户姓名" width="120"></el-table-column>
      <el-table-column prop="customerMobile" label="手机号" width="120"></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" :formatter="formatter" width="120"></el-table-column>
      <el-table-column prop="coursePackageName" label="归属专题" width="120"></el-table-column>
      <el-table-column prop="unitName" label="店铺" width="120"></el-table-column>
      <el-table-column prop="qudaoName" label="渠道" width="120"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row.id)">详情</el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.orderStatus === 3"
            @click="createCourseVerifySingle(scope.row.id)"
          >核销</el-button>
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.orderStatus === 4"
            @click="createTuikuanSingle(scope.row.id)"
          >退款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right; margin-top: 8px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="filter.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="filter.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <Modal v-if="showModal" mk="112222" :id="detailId" @onClose="closeModal" />
  </div>
</template>

<script>
import assign from 'object-assign';
import Modal from './modal';
import { listData } from './default';
import {
  orderPageList,
  checkCourse,
  deleteCourse,
  dealTime,
  exportOrder,
  refundCourseOrder,
  finishCourseOrder,
  createCourseVerifyRecord,
} from '../sever';

export default {
  name: '',
  props: ['status'],
  data() {
    return listData;
  },
  mounted() {
    if (this.$props && this.$props.status) {
      this.filter.status = this.$props.status;
    }
    this.search();
  },
  components: { Modal },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },

    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.search();
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.search();
    },
    changeShowSearch(val) {
      this.showSearch = val;
    },
    changePicker(val) {
      console.log(val);
    },
    search() {
      const that = this;
      const param = dealTime(['beginTime', 'endTime'], this.filter);
      orderPageList(param).then(res => {
        if (res.resCode == 200) {
          that.tableData = (res.resObject.list || []).map((v, i) => assign(v, { num: i + 1 }));
          that.total = res.resObject.totalCount;
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    onReset() {
      this.filter = {
        orderSn: '',
        customerName: '',
        customerPhone: '',
        status: '',
        unitName: '',
        beginTime: '',
        date: [],
        endTime: '',
        pageSize: 10,
        pageNum: 1,
      };
    },
    downCourse() {
      const that = this;
      const param = dealTime(['beginTime', 'endTime'], this.filter);
      exportOrder(param).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    createCourseVerifySingle(id) {
      const idList = [id];
      finishCourseOrder({ idList }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
          that.search();
        } else {
          that.$message.success(res.message);
        }
      });
    },
    createCourseVerify(code) {
      const that = this;
      if (this.multipleTable.length == 0) {
        this.$message.warning('请选择数据');
        return;
      }
      const idList = this.multipleTable.map(v => {
        return v.id;
      });
      finishCourseOrder({ idList }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
          that.search();
        } else {
          that.$message.success(res.message);
        }
      });
    },
    createTuikuanSingle(id) {
      const idList = [id]
      refundCourseOrder({ idList, status: 1 }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
          that.search();
        } else {
          that.$message.success(res.message);
        }
      });
    },
    createTuikuan() {
      const that = this;
      if (this.multipleTable.length == 0) {
        this.$message.warning('请选择数据');
        return;
      }
      const idList = this.multipleTable.map(v => {
        return v.id;
      });
      refundCourseOrder({ idList, status: 1 }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
          that.search();
        } else {
          that.$message.success(res.message);
        }
      });
    },
    showDetail(id) {
      this.detailId = id;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    formatter(row) {
      if (row.orderStatus === 0) return '待付款';
      if (row.orderStatus === 1) return '已付款待发货';
      if (row.orderStatus === 2) return '已发货待收货';
      if (row.orderStatus === 3) return '已完成';
      if (row.orderStatus === 4) return '已取消';
      return row.orderStatus || '';
    },
  },
};
</script>

<style scoped>
.activeManage {
  width: 100%;
  padding: 0;
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
</style>
