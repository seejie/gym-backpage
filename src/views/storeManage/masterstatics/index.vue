<style lang="scss" scoped>
</style>
<template>
  <div class="mypage-wrapper">
    <div class="head-wrapper">
      <div class="c-w-search">
        <el-form
          :inline="true"
          ref="searchFormRef"
          :model="searchFormData"
          class="form-inline"
          style="width:100%"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="所在地区" label-width="100" class="el-form-item-areas">
                <area-select
                  v-model="searchFormData.areas"
                  :data="pcaa"
                  type="all"
                  aria-placeholder="省市"
                  placeholder="请选择地区"
                  :level="2"
                ></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="status" label="系统来源">
                <el-select placeholder="请选择" v-model="searchFormData.xt">
                  <el-option label="已上线" value="2"></el-option>
                  <el-option label="已下线" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="status" label="渠道来源">
                <el-select placeholder="请选择" v-model="searchFormData.qd">
                  <el-option label="已上线" value="2"></el-option>
                  <el-option label="已下线" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="17">
              <el-form-item label="查询时间">
                <el-date-picker
                  v-model="searchFormData.createTime"
                  type="datetimerange"
                  range-separator="~"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="bindClickDoSearch()">搜索</el-button>
                <el-button @click="doResetForm('searchFormRef')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-card shadow="never" class="card">
      <div slot="header" class="clearfix">
        <el-button>导出</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50px"></el-table-column>
        <el-table-column prop="category" label="统计日期"></el-table-column>
        <el-table-column prop="category" label="系统来源"></el-table-column>
        <el-table-column prop="category" label="渠道"></el-table-column>
        <el-table-column prop="category" label="地区"></el-table-column>
        <el-table-column prop="category" label="新增申请"></el-table-column>
        <el-table-column prop="category" label="新增认证大师"></el-table-column>
        <el-table-column prop="category" label="累计认证大师"></el-table-column>
        <el-table-column prop="category" label="日活跃数"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { pca, pcaa } from 'area-data';
import { AreaCascader } from 'vue-area-linkage';
export default {
  name: 'masterstatics',
  desc: '大师统计',
  data() {
    return {
      searchFormData: {
        status: '',
        areas: [],
      },
      pcaa,
      tableData: [
        {
          category:1,
        }
      ],
    };
  },
  mounted() {},
  methods: {
    handleSelectionChange(chks) {},
    getFormData() {},
    bindClickDoSearch() {
      // 搜索
      this.getFormData();
    },
    doResetForm(refname) {
      this.$refs[refname].resetFields();
      this.getFormData();
    },
  },
};
</script>
<style lang="scss" scoped>
.mypage-wrapper {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
  // .box-card {
  //   width: 100%;
  // overflow: auto;
  .head-wrapper {
    overflow: auto;
    .c-w-search {
      width: 100%;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      padding: 20px;
      padding-bottom: 0;
      /deep/ .el-form-item {
        margin-bottom: 10px;
        &.el-form-item-areas {
          width: 100%;
          .el-form-item__content {
            width: calc(100% - 80px);
            .area-select-wrap {
              width: 100%;
              display: flex;
              .area-select {
                &.medium {
                  width: 100%;
                  height: 36px;
                  line-height: 18px;
                  margin-left: 0;
                  margin-right: 10px;
                  .area-selected-trigger {
                    // color: #ccc9d6;
                  }
                  .area-select-icon {
                    // display: none;
                  }
                }
              }
            }
          }
        }
      }
    }
    // }
  }
  .card {
    height: 100%;
  }
}
</style>