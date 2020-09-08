<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card" >
      <el-form :inline="true" ref="form" :model="form" label-width="80px" style="background-color: #f5f7fa;padding-top: 10px">
        <el-form-item label="地区筛选">
          <el-cascader
             v-model="form.proCity"
             style="width: 160px;"
             :options="options"
             placeholder="请选择省市"
             @change="handleCity"></el-cascader>
          <el-select v-model="form.area" placeholder="请选择县区" style="width: 160px;">
            <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="form.courseStatus" clearable placeholder="请选择" style="width: 320px;">
            <el-option label="草稿" value=0></el-option>
            <el-option label="已上线" value=1></el-option>
            <el-option label="已下线" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
             v-model="form.date"
             type="daterange"
             style="width: 325px"
             range-separator="-"
             start-placeholder="开始日期"
             end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div
         style="color: #29bc4f;font-size: 14px; text-align: center; cursor: pointer" @click="changeShowSearch(true)"
         v-show="!showSearch"
      >展开<i class="el-icon-arrow-down"></i>
      </div>
      <div style="margin: 8px 0; background-color: #ffffff;padding: 8px">
        <el-button size="small" @click="downData">导出</el-button>
      </div>
      <el-table
         ref="multipleTable"
         :data="tableData"
         tooltip-effect="dark"
         style="width: 100%; flex: 1; background-color: #ffffff"
         @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" width="120"></el-table-column>
        <el-table-column prop="date" label="日期" width="120"></el-table-column>
        <el-table-column prop="provinceCity" label="区域" width="120"></el-table-column>
        <el-table-column prop="status" label="类型" width="120"></el-table-column>
        <el-table-column prop="newOrderNum" label="新增订单" width="120"></el-table-column>
        <el-table-column prop="finishOrderNum" label="完成订单" width="120"></el-table-column>
        <el-table-column prop="finishAmount" label="完成金额" width="120"></el-table-column>
        <el-table-column prop="refundOrderNum" label="退款订单" width="120"></el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" width="120"></el-table-column>
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
    </el-card>
  </div>
</template>

<script>
import cityList from '@/utils/citys';
import assign from 'object-assign';
import moment from 'moment';
import { courseOrderReport, dealTime, exportOrder } from '../sever'
import { count } from './default';

export default {
  name: '',
  data() {
    return count;
  },
  mounted() {
    this.onSearch();
  },
  methods: {
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
    handleCity(val) {
      this.form.proCity = val;
      const obj = cityList.find(v => v.code === val[0]).city.find(v => v.code === val[1]);
      this.areaList = obj.area.map(v => ({ value: v.code, label: v.name }));
      this.form.areaId = '';
    },
    changePicker(val) {
      console.log(val)
    },
    onSearch() {
      const obj = assign({}, this.form, {
        province: this.form.proCity[0],
        city: this.form.proCity[1],
      })
      const param = dealTime(['beginTime', 'endTime'], obj);
      const that = this;
      courseOrderReport(param).then(res => {
        if (res.resCode == 200) {
          // that.tableData = res.resObject.list || [];
          that.tableData = (res.resObject.list || []).map(v => assign(v, { createTime: moment(v.createTime).format('YYYY-MM-DD') }));
          that.total = res.resObject.totalCount;
          this.$refs.multipleTable.clearSelection();
        } else {
          that.$message(res.message, 'error');
        }
      })
    },
    onReset() {
      this.form = {
        courseTitle: '',
        courseStatus: '',
        unitName: '',
        proCity: [],
        areaId: '',
        date: [],
        firstCategoryId: '',
        secondCategoryId: '',
      };
    },
    downData() {
      const that = this;
      const obj = assign({}, this.form, {
        province: this.form.proCity[0],
        city: this.form.proCity[1],
      })
      const param = dealTime(['beginTime', 'endTime'], obj);
      exportOrder(param).then(res => {
        if (res.resCode == 200) {
          that.$message.success('导出成功');
          that.onSearch();
        } else {
          that.$message(res.message, 'error');
        }
      })
    }

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
