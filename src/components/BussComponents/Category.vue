<!--品类筛选-->
<template>
  <div>
    <el-select
      v-model="form.firstCategoryId"
      clearable
      placeholder="请选择一级分类"
      style="width: 160px;"
      @change="searchSecondMenu"
      @clear="clearSecondMenu"
    >
      <el-option
        v-for="item in oneMenus"
        :key="item.id"
        :label="item.categoryName"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-select
      v-model="form.secondCategoryId"
      clearable
      placeholder="请选择二级分类"
      style="width: 160px;"
    >
      <el-option
        v-for="item in twoMenus"
        :key="item.id"
        :label="item.categoryName"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>

</template>

<script>
export default {
  data(){
    return {
      form:{
        firstCategoryId:"",
        secondCategoryId:""
      },
      oneMenus: [],
      twoMenus: [],
    }
  },
  methods:{
    clearSecondMenu(){
      this.twoMenus = [];
      this.form.secondCategoryId="";
    },
    searchFirstMenu(num) {
      // 获取一级菜单
      const that = this;
      searchCourseCategoryList({ pageSize: 0 }).then(res => {
        if (res.resCode == 200) {
          const arr = (res.resObject.list || []).filter(v => !v.catParentId);
          that.oneMenus = arr;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    searchSecondMenu(id) {
      if(id){
        // 获取二级菜单
        this.twoMenus = [];
        this.form.secondCategoryId="";
        const that = this;
        findCourseCategoryId({ unitParentId: id }).then(res => {
          if (res.resCode == 200) {
            that.twoMenus = res.resObject.list || [];
          } else {
            that.$message.error(res.message);
          }
        });
      }else{
        this.twoMenus = [];
        this.form.secondCategoryId="";
      }
    }
  }
};
</script>

<style>
</style>
