<template>
  <div class="banner-component">
    <el-form-item :label="btntitle">
      <el-button type="primary" @click="addMenuClick">添加</el-button>
    </el-form-item>
    <el-form-item label-width="20px" class="form-border_line">
      <div class="form-content">
        <el-form class="form_inline">
          <draggable
            class="list_group"
            :list="menuListData"
            ghost-class="ghost"
            @start="dragging = true"
            @end="dragging = false"
          >
            <el-form-item v-for="(item,index) in menuListData" :key="index">
              <template>
                <div class="list_group_item">
                  <div class="icon-div">
                    <div
                      @click="clickImage(index)"
                      :style="{ opacity: item.banner ? 0 : 1 }"
                      class="upload-include-banner"
                    >
                      <img-include
                        v-model="item.cover_pic"
                        :width="55"
                        :max="1"
                        :cropper="indexCropper"
                      ></img-include>
                    </div>
                  </div>
                  <el-select
                    v-if="hasType"
                    v-model="item.bannerType"
                    class="select"
                    placeholder="请选择"
                    :disabled="item.disabled"
                  >
                    <el-option
                      v-for="options in optionsList"
                      :key="options.id"
                      :label="options.name"
                      :value="options.id"
                    />
                  </el-select>
                  <span v-else>页面跳转链接:</span>
                  <el-input
                    v-model.trim="item.productName"
                    class="input"
                    readonly
                    v-if="item.bannerType == 1"
                    placeholder="请点击右边选择商品"
                    maxlength="30"
                  />
                  <el-input
                    v-model.trim="item.thirdUrl"
                    class="input"
                    v-else
                    placeholder="请输入图片跳转链接地址"
                    maxlength="30"
                  />
                  <el-button v-if="item.bannerType == 1" @click="handleShowDialog(index)">选择商品</el-button>
                  <el-popconfirm title="确定删除吗？" @onConfirm="deleteItem(index)">
                    <el-button
                      class="icon"
                      type="info"
                      icon="el-icon-delete"
                      circle
                      slot="reference"
                    />
                  </el-popconfirm>
                </div>
              </template>
            </el-form-item>
          </draggable>
        </el-form>
      </div>
    </el-form-item>
    <el-dialog :visible.sync="showShopDetail" title="商品选择" class="store-dialog">
      <el-form
        :model="searchData"
        :inline="true"
        ref="formInline"
        class="demo-form-inline"
        style="width:100%"
      >
        <el-col :span="12">
          <el-form-item label="商品类型" prop="productCategoryIdExtras">
            <el-cascader
              v-model="searchData.productCategoryIdExtras"
              :options="productCategoryIdOptios"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-input v-model="searchData.search" type="text" placeholder="请输入关键字">
            <el-button slot="append" icon="el-icon-search" @click="handletoSearch"></el-button>
          </el-input>
        </el-col>
        <div style="clear: both"></div>
      </el-form>

      <el-table ref="multipleTable" :data="tableData" style="width: 100%">
        <el-table-column label="选择" width="55">
          <template slot-scope="scope">
            <el-radio v-model="tableRadio" :label="scope.row">
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" width="120" prop="id"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productCategoryName" label="类型"></el-table-column>
        <el-table-column prop="unitName" label="商铺" show-overflow-tooltip></el-table-column>
        <el-table-column prop="originalPrice" label="价格"></el-table-column>
      </el-table>
      <div style="padding: 15px 0px">
        <el-pagination
          @current-change="currentChange"
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="handleSubmit">提交</el-button>
        <el-button @click="showShopDetail = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { shopProductPage } from '@/api/standshop/goodsManage';
import ImgInclude from '@/components/CropImgInclue/index.vue';
import draggable from 'vuedraggable';
import { shopCategoryTree } from '@/api/standshop/goodsManage';
export default {
  components: {
    ImgInclude,
    draggable,
  },
  name: 'menu_list',
  props: {
    menuListData: {
      type: Array,
      default: () => []
    },
    hasType: {
      type: Boolean,
      default: true,
    },
    btntitle: {
      type: String,
      default: 'banner设置',
    },
    bannerWith: {
      default: 375,
    },
    bannerHight: {
      default: 166,
    },
    indexCroppertitle: {
      type: String,
      default: 'banner图片',
    },
  },

  computed: {
    ratio() {
      let ratio = (this.bannerWith / this.bannerHight).toFixed(2);
      if (ratio.substring(ratio.length - 3) == '.00') {
        return parseInt(ratio);
      } else {
        return ratio;
      }
    },
  },

  data() {
    return {
      linkSelect: [],
      cover_pic: {
        ratio1: [],
      },
      tableRadio: null,
      showShopDetail: false,
      searchData: {
        productCategoryIdExtras: [],
        search: '',
      },
      tableData: [],
      current: 1,
      pageSize: 5,
      total: 0,
      set_index: null,
      multipleSelection: [],
      dragging: false,
      productCategoryIdOptios: [],
      optionsList: [
        {
          id: 1,
          name: '商品链接',
        },
        {
          id: 2,
          name: '自定义链接',
        },
      ],
      indexCropper: [
        {
          name: this.indexCroppertitle,
          ratio_x: 375,
          ratio_y: 166,
          ratio: 1,
          desc: this.indexCroppertitle,
        },
      ],

      row_index: null,
    };
  },
  methods: {
    handleSubmit() {
      if (this.tableRadio) {
        this.showShopDetail = false;
        this.menuListData[this.set_index].productId = this.tableRadio.id;
        this.menuListData[this.set_index].productName = this.tableRadio.name;
        // this.menuListData[this.set_index].configId = this.tableRadio.id;
      } else {
        this.$message.warning('请选择一条数据');
      }
    },
    handletoSearch() {
      this.getList();
    },
    handleShowDialog(index) {
      this.set_index = index;
      this.tableRadio = null;
      this.showShopDetail = true;
      this.current = 1;
      this.getClassifyList();
      this.getList();
    },
    currentChange(val) {
      this.current = val;
      this.getList();
    },
    getList() {
      const newParams = {
        pageNum: this.current,
        pageSize: 5,
        name: this.searchData.search,
        productCategoryId:
          (this.searchData.productCategoryIdExtras.length > 1 && this.searchData.productCategoryIdExtras[1]) || '',
      };

      shopProductPage(newParams).then(res => {
        if (res.resCode == 200) {
          this.tableData = res.resObject.list;
          this.current = res.resObject.pageNum;
          this.pageSize = res.resObject.pageSize;
          this.total = res.resObject.total;
          this.multipleSelection = [];
        }
      });
    },
    //获取所有品类数据
    getClassifyList(params) {
      this.productCategoryIdOptios = [];
      shopCategoryTree().then(res => {
        if (res.resCode == 200) {
          let categoryTree = res.resObject;
          Object.keys(categoryTree).forEach((key, index) => {
            this.productCategoryIdOptios.push({
              ...categoryTree[key].key,
              label: categoryTree[key].key.catName,
              value: categoryTree[key].key.catId,
              children: categoryTree[key].sonList.map(jj => ({
                ...jj,
                label: jj.catName,
                value: jj.catId,
              })),
            });
          });
        }
      });
    },

    clickImage(index) {
      this.row_index = index;
    },

    deleteItem(index) {
      this.menuListData.splice(index, 1);
    },

    addMenuClick() {
      if (this.menuListData.length > 0 && !this.menuListData[this.menuListData.length - 1].cover_pic[Object.keys(this.menuListData[this.menuListData.length - 1].cover_pic)[0]].length) {
        this.$message.error('请先上传图片');
        return;
      }
      this.menuListData.push({
        sort: this.menuListData.length + 1,
        cover_pic: {
          ratio1: [],
        },
      });

      this.linkSelect.push({
        val: '',
      });
    },

  },

  watch: {
    cover_pic: {
      handler(value) {
        let list = value[`ratio${this.ratio}`];
        if (!list || !list[0]) {
          list = value.ratio2;
        }
        if (list && list[0]) {
          // this.menuListData[this.row_index].banner = list[0];
          this.menuListData[this.row_index].cover_pic[`ratio${this.ratio}`] = []
          this.cover_pic = { [`ratio${this.ratio}`]: [] };
        }
      },
      deep: true,
    },

    ratio(val) {
      this.indexCropper = [
        {
          name: this.indexCroppertitle,
          ratio_x: this.bannerWith,
          ratio_y: this.bannerHight,
          ratio: parseFloat(val),
          desc: this.indexCroppertitle,
        },
      ];
      this.cover_pic = {
        [`ratio${val}`]: [],
      };
    },
  },
};
</script>

<style lang="scss">
.banner-component {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 30px;
  .icon-div {
    width: 136px;
    height: 60px;
    margin-right: 12px;
  }

  .banner-img {
    width: 136px;
    height: 60px;
  }

  .icon-add {
    font-size: 60px;
    position: absolute;
    pointer-events: none;
  }
}

.el-table_6_column_22 .cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-input--medium {
    flex: 1;
  }
}

.upload-include-banner {
  opacity: 0;
  width: 136px;

  .add--single {
    width: 136px !important;
  }
  .item--single {
    width: 136px !important;
  }
}

.form-content {
  margin-top: 20px;
  .list_group {
    cursor: move;
    .ghost {
      opacity: 0.5;
      background: #c8ebfb;
    }
    .list_group_item {
      display: flex;
      align-items: center;
      .name {
        display: inline-block;
        width: 56px;
        font-size: 14px;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .input {
        margin-left: 15px;
        width: 400px;
        margin-right: 15px;
      }
      .select {
        margin-left: 15px;
        width: 120px;
      }
      .checkbox {
        margin-left: 30px;
      }
      .icon {
        margin-left: 30px;
      }
    }
  }
}
.store-dialog {
  .el-dialog__body {
    padding-bottom: 0px;
  }
}
</style>
