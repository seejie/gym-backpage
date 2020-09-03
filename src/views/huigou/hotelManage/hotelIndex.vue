<template>
  <div class="hotelManage">
    <!-- <formList></formList> -->
    <el-card class="box-card">
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="房间管理"
                     name="active">
          <hotelManage />
        </el-tab-pane>
        <el-tab-pane label="品类设置"
                     lazy
                     name="second">
          <hotelClassify />
        </el-tab-pane>
        <el-tab-pane label="品牌设置"
                     lazy
                     name="third">
          <BrandSetting />
        </el-tab-pane>
        <el-tab-pane label="酒店标签"
                     lazy
                     name="four">
          <HotelLabel />
        </el-tab-pane>
        <el-tab-pane label="设施设置"
                     lazy
                     name="five">
          <FacilitySet></FacilitySet>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import hotelManage from './hotelManage.vue'
import hotelClassify from './hotelClassify.vue'
import BrandSetting from './BrandSetting.vue'
import HotelLabel from './hotelLabel.vue'
import FacilitySet from './facilitySetting'
export default {
  name: 'hotelIndex',
  data () {
    return {
      activeName: 'active'
    }
  },
  components: {
    FacilitySet,
    hotelManage,
    hotelClassify,
    BrandSetting,
    HotelLabel
  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>
<style lang="scss" scoped>
.hotelManage {
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
