<template>
  <div class="ticketListHeader">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form :inline="true"
               :model="formInline"
               ref="formInline"
               class="demo-form-inline"
               style="width:100%">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品标题"
                          prop="name">
              <el-input v-model="formInline.name"
                        placeholder="商品标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布状态"
                          prop="publishStatus">
              <el-select v-model="formInline.publishStatus"
                         placeholder="发布状态">
                <el-option label="下架"
                           value="0"></el-option>
                <el-option label="上架"
                           value="1"></el-option>
                <el-option label="待审核"
                           value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布单位"
                          prop="unit">
              <el-select v-model="formInline.unit"
                         placeholder="发布单位">
                <el-option :label="item.unitName"
                            v-for="(item, index) in unitList"
                            :key="index"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品类筛选"
                          prop="productCategoryIdExtras">
              <el-cascader v-model="formInline.productCategoryIdExtras"
                           :options="productCategoryIdOptios"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌筛选"
                          prop="brandId">
              <el-select v-model="formInline.brandId"
                         placeholder="">
                <el-option v-for="item in coderOptions"
                           :key="item.brandId"
                           :label="item.brandName"
                           :value="item.brandId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item style="float:right;text-align:right">
              <el-button type="primary"
                         @click="submitForm('formInline')">搜索</el-button>
              <el-button @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";

import {
  shopCategoryTree,
  shopBrandPage
} from "@/api/standshop/goodsManage";

import { listSelfAndChildren } from "@/api/sass/unit";

import eventVue from "./eventVue.js";
export default {
  data () {
    return {
      formInline: {
        name: "",
        publishStatus: "", // 0->下架；1->上架
        sort: "", //缺定义字段
        unit: "",
        productCategoryIdExtras: [],
        //productCategoryId: "",
        brandId: ""
      },
      netShow: true, //不能重置数据
      pca: pca,
      pcaa: pcaa,
      coderOptions: [],
      productCategoryIdOptios: [],

      unitList: []
    };
  },
  created () {
    this.getList({
      pageNum: 1,
      pageSize: 99
    });
    this.getClassifyList({ catParentId: 0 });
    this.getUnitList();
  },
  methods: {
    //搜索
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        //console.log("搜索参数", this[formName]);
        let params = {
          ...this[formName],
          productCategoryId:
            (this[formName].productCategoryIdExtras.length > 1 &&
              this[formName].productCategoryIdExtras[1]) ||
            ""
        };
        delete params.productCategoryIdExtras;
        delete params.startAndEndTime;
        delete params.provinceCity;
        //console.log("搜索参数", params);
        eventVue.$emit("myFun", params); //$emit这个方法会触发一个事件
      });
    },

    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
      eventVue.$emit("myFun", {});
      this.netShow = false;
      setTimeout(() => {
        this.netShow = true;
      }, 0);
    },

    // 获取品牌筛选下拉数据
    async getList (params) {
      shopBrandPage(params).then(res => {
        if(res.resCode == 200) {
          this.coderOptions = res.resObject.list;
        }
      })
    },

    // 单位列表【查询自己以及所有下级C单位列表】
    getUnitList() {
      listSelfAndChildren().then(res => {
        if(res.resCode == 200) {
          this.unitList = res.resObject.list
        }
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
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.ticketListHeader {
  @extend %fill;
  // overflow: auto;
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
      margin-bottom: 15px;
      width: 100%;
      /deep/ .el-form-item__label {
        width: 20%;
      }
      /deep/ .el-form-item__content {
        width: 80%;
        /deep/ .el-select,
        .el-cascader {
          width: 100%;
        }
      }
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
.ticketListHeader {
  .area-select.large {
    width: 100%;
    line-height: 20px;
  }
  .area-select.medium {
    width: 85px;
  }
  .area-select {
    line-height: 16px;
  }
}
</style>
