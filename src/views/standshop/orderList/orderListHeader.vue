<template>
  <div class="OrderHeader">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
        style="width:100%"
      >

       <el-row>
          <el-col :span="8">
            <el-form-item label="订单编号" prop="code">
              <el-input v-model="formInline.code" placeholder="搜索订单"></el-input>
             </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="下单时间" prop="createTime">
              <el-date-picker
                v-model="formInline.createTime"
                type="datetimerange"
                range-separator="至"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:380px"
              ></el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
  
          <el-col :span="8">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="formInline.productName" placeholder="搜索商品"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="品类筛选"
                          prop="productCategoryIdExtras">
              <el-cascader v-model="formInline.productCategoryIdExtras"
                           :options="productCategoryIdOptios"></el-cascader>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户姓名" prop="customerName">
              <el-input v-model="formInline.customerName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户手机" prop="customerMobile">
              <el-input v-model="formInline.customerMobile" placeholder=""></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="物流公司" prop="waybillCompany">
              <el-select v-model="waybillCompany">
                <el-option
                  v-for="item in LogisticsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row>

          <el-col :span="8">
            <el-form-item label="店铺名称" prop="venueName">
              <el-input v-model="formInline.venueName" placeholder="店铺名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="渠道来源" prop="fromChannelId">
              <!-- <el-input v-model="formInline.fromChannelId" placeholder="渠道来源"></el-input> -->
              <el-select v-model="formInline.fromChannelId" placeholder="渠道来源">
                <el-option v-for="item in channelList" :label="item.qudao_name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

                <el-col :span="8">
            <el-form-item label="系统来源" prop="idfv">
              <el-input v-model="formInline.fromSystem" placeholder="系统来源"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-form-item style="float:right">
              <el-button type="primary" @click="submitForm('formInline')">搜索</el-button>
              <el-button @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { orderStatusOptions } from "../commonText.js";
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";
import eventVue from "./eventVue.js";
import { getLogisticsListByunit } from '@/api/apiPlatformSetting';

import {
  shopCategoryTree,
  shopBrandPage
} from "@/api/standshop/goodsManage";


export default {
  data() {
    return {
      formInline: {
        code: "",
        // status: "",
        startAndEndTime: [],
        customerName: "",
        customerMobile: "",
        unitName: "",
        idfv: "",
        qudaoName: "",
        waybillCompany: "",
        productCategoryIdExtras: []
      },
      netShow: true,
      pca: pca,
      pcaa: pcaa,
      orderStatusOptions,
      channelList: [],

      productCategoryIdOptios: [],
      waybillCode: '', // 物流公司编号
      waybillCompany: '', // 物流公司
      LogisticsList: [], // 物流列表
    };
  },
  created () {
    this.getchannelList();
    this.loadLogisticsList();
    this.getClassifyList({ catParentId: 0 });
  },
  methods: {
    // 搜索
    async getchannelList () {
      // 加载渠道信息
      this.channelList = []
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        let params = {
          ...this[formName],

            productCategoryId:
            (this[formName].productCategoryIdExtras.length > 1 &&
              this[formName].productCategoryIdExtras[1]) ||
            "",

          queryStartTime:
            (this[formName].startAndEndTime.length > 0 &&
              this.$moment(this[formName].startAndEndTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              )) ||
            "",
          queryEndTime:
            (this[formName].startAndEndTime.length > 0 &&
              this.$moment(this[formName].startAndEndTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              )) ||
            ""
        };
        delete params.productCategoryIdExtras;
        delete params.startAndEndTime;
        eventVue.$emit("myFun", params); //$emit这个方法会触发一个事件
      });
    },


    // 获取所有物流公司
    loadLogisticsList() {
      getLogisticsListByunit({
        pageNum: 1,
        pageSize: 99,
      }, data => {
        this.LogisticsList = data.list
      })
    },



    //获取所有品类数据
    async getClassifyList (params) {
      this.productCategoryIdOptios = [];
      shopCategoryTree().then(res => {
        if(res.resCode == 200) {
          let categoryTree = res.resObject
          Object.keys(categoryTree).forEach((key, index) => {
            this.productCategoryIdOptios.push({
                ...categoryTree[key].key,
                label: categoryTree[key].key.catName,
                value: categoryTree[key].key.catId,
                children: categoryTree[key].sonList.map(jj => ({
                  ...jj,
                  label: jj.catName,
                  value: jj.catId
                }))
              });
          })
        }
      })
    },


    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      eventVue.$emit("myFun", {});
      this.netShow = false;
      setTimeout(() => {
        this.netShow = true;
      }, 0);
    }
  },



  components: {}
};
</script>
<style lang="scss" scoped>
.managePage {
  @extend %fill;
  overflow: auto;
  .from-wrap {
    width: 100%;
    // height: 60px;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 20px;
    padding-bottom: 0;
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
  .op-button-wrap {
    background: #f5f7fa;
    padding-left: 20px;
    border-left: 1px solid #e5e9ef;
    border-right: 1px solid #e5e9ef;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .table-wrap {
    // max-height: 650px;
    overflow: auto;
  }
  .pagination-wrap {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .content {
    height: auto;
    max-height: 600px;
    overflow: auto;
    /deep/ .el-select {
      width: 100px;
    }
  }
}
</style>
<style lang="scss">
.OrderHeader {
  .el-upload--picture-card {
    height: 50px;
    width: 50px;
    line-height: 50px;
  }
  .el-input-number--medium {
    width: 120px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 150px;
  }
}
