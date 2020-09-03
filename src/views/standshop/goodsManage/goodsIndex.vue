<template>
  <div class="activeManage">
    <!-- <formList></formList> -->
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="商品管理"
                     name="active">
          <standGoodsListHeader />
          <standGoodsListFooter />
        </el-tab-pane>
        <el-tab-pane label="品类设置"
                     name="second">
          <StandGoodClassify />
        </el-tab-pane>
        <el-tab-pane label="品牌设置"
                     name="third">
          <BrandSetting />
        </el-tab-pane>
        <el-tab-pane label="商品标签"
                     name="four">
          <TagSetting />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import formList from "@/components/FormComponent/index";
import StandGoodsListHeader from './standGoodsListHeader.vue'
import StandGoodsListFooter from './standGoodsListFooter.vue'
import StandGoodClassify from "./StandGoodClassify.vue";
import BrandSetting from "./BrandSetting.vue";
import TagSetting from "./TagSetting.vue";
export default {
  name: "addactiveManage",
  data () {
    return {
      activeName: "active"
    };
  },
  components: {
    formList,
    StandGoodsListHeader,
    StandGoodsListFooter,
    StandGoodClassify,
    BrandSetting,
    TagSetting
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" scoped>
.activeManage {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
  .box-card {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
