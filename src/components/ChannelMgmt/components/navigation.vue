<template>
  <div class="navigation-component">
    <el-form-item label="导航设置">
      <el-button type="primary" @click="addMenuClick">添加</el-button>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-table
        style="width: 910px;"
        :data="menuListData"
        v-show="menuListData.length > 0"
        class="nav-list-table"
        border
        row-key="id"
      >
        <el-table-column label="排序" type="index" align="center" width="60"></el-table-column>
        <el-table-column width="100" label="图片">
          <template slot-scope="scope">
            <div class="icon-div">
              <img
                :src="menuListData[scope.$index].image"
                alt=""
                v-if="menuListData[scope.$index].image"
                class="icon-img"
              />
              <div
                @click="clickImage(scope.$index)"
                :style="{ opacity: menuListData[scope.$index].image ? 0 : 1 }"
                class="upload-include"
              >
                <img-include v-model="cover_pic" :max="1" :width="55" :cropper="indexCropper"></img-include>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="590" label="链接">
          <template slot-scope="scope">
            <el-cascader
              v-model="linkSelect[scope.$index].val"
              :options="urlOptions"
              @change="selectOptions($event, scope.$index)"
              class="cascader-dianshang"
            ></el-cascader>
            <el-row>
              <el-col :span="5">
                <el-input
                  v-model="menuListData[scope.$index].name"
                  placeholder="请输入名称"
                  v-if="menuListData[scope.$index].first_menu == 'custom_link'"
                ></el-input>
              </el-col>
              <el-col :span="16">
                <el-input
                  v-model="menuListData[scope.$index].custom_url"
                  placeholder="请输入链接"
                  v-if="menuListData[scope.$index].first_menu == 'custom_link'"
                ></el-input>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteMenuClick(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>
<script>
import sortable from 'sortablejs';
import ImgInclude from '@/components/CropImgInclue/index.vue';
export default {
  components: {
    sortable,
    ImgInclude,
  },
  name: 'menu_list',
  props: {
    menuListData: {
      type: Array,
    },
    category: {
      type: Array,
    },
  },
  data() {
    return {
      urlOptions: [
        {
          value: 'func_url',
          label: '功能链接',
          children: [
            {
              value: 'classify',
              label: '分类',
              children: [],
            },
            {
              value: 'shop_cart',
              label: '购物车',
              h5_route: '1',
              mini_program_route: 'pages/mall/cart/cart',
            },
            {
              value: 'all_goods',
              label: '所有商品',
              h5_route: '2',
              mini_program_route: 'pages/mall/search/search',
            },
            {
              value: 'my_orders',
              label: '我的订单',
              h5_route: '3',
              mini_program_route: 'pages/my/order/order',
            },
            {
              value: 'coupon',
              label: '优惠券',
              h5_route: '4',
              mini_program_route: 'pages/my/card/card',
            },
          ],
        },
        {
          value: 'custom_link',
          label: '自定义链接',
        },
      ],
      linkSelect: [],
      cover_pic: {
        ratio1: [],
      },

      indexCropper: [
        {
          name: '导航图片',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '导航图片',
        },
      ],

      row_index: null,
    };
  },

  mounted() {
    let el = document.querySelectorAll('.nav-list-table > .el-table__body-wrapper > table > tbody')[0];
    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          //监听拖动结束事件
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.menuListData.splice(evt.oldIndex, 1)[0];
          this.menuListData.splice(evt.newIndex, 0, currRow);
          this.menuListData.map((func, index) => {
            this.menuListData[index].catSort = parseInt(index + 1);
          });
          this.$emit('changeNavSort', this.menuListData);
        },
      });
    }
  },

  methods: {
    addMenuClick() {
      if (this.menuListData.length > 0 && !this.menuListData[this.menuListData.length - 1].image) {
        this.$message.error('请先上传图片');
        return;
      }
      this.menuListData.push({
        sort: this.menuListData.length + 1,
        image: '',
        custom_url: '',
      });
      this.linkSelect.push({
        val: '',
      });
    },
    getIcon(val, index) {
      this.menuListData[index].image = val;
    },
    selectOptions(v, i) {
      var arr = this.getCascaderObj(v, this.urlOptions);
      this.menuListData[i].first_menu = v[0];
      this.menuListData[i].second_menu = v[1] || '';
      this.menuListData[i].third_menu = v[2] || '';
      this.menuListData[i].h5_route = (arr[arr.length - 1] && arr[arr.length - 1].h5_route) || '';
      this.menuListData[i].mini_program_route = (arr[arr.length - 1] && arr[arr.length - 1].mini_program_route) || '';
      if (v[0] == 'custom_link') {
        this.menuListData[i].route_type = '';
      }
      if (v[1] == 'classify') {
        this.menuListData[i].route_type = '5';
      } else {
        this.menuListData[i].route_type = this.menuListData[i].h5_route;
      }
    },
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    deleteMenuClick(index, row) {
      this.menuListData.splice(index, 1);
      this.linkSelect.splice(index, 1);
    },

    clickImage(index) {
      this.row_index = index;
    },
  },

  watch: {
    menuListData(newVal, oldVal) {
      newVal.forEach(v => {
        this.linkSelect.push({
          val: v.third_menu || v.second_menu || v.first_menu,
        });
      });
    },

    category(value) {
      let list = [];
      value.forEach(val => {
        list.push({
          value: val.catId,
          label: val.catName,
        });
      });
      this.urlOptions[0].children[0].children = list;
    },

    'cover_pic.ratio1'(value) {
      if (value && value[0]) {
        this.menuListData[this.row_index].image = value[0];
        this.cover_pic = { ratio1: [] };
      }
    },
  },
};
</script>

<style lang="scss">
.navigation-component {
  padding-bottom: 15px;
  border-bottom: 1px solid #cccccc;
  .icon-div {
    width: 60px;
    height: 60px;
  }

  .icon-img {
    width: 60px;
    height: 60px;
  }

  .icon-add {
    font-size: 60px;
    position: absolute;
    pointer-events: none;
  }

  .upload-container {
    width: 50px;
    height: 50px;
    border: 1px solid #ccc;
  }

  .el-upload {
    height: 50px;
    line-height: 50px;
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
.cascader-dianshang {
  width: 300px;
}

.upload-include {
  opacity: 0;
  width: 62px;
  position: absolute;
  left: 10px;
  top: 10px;
}
</style>
