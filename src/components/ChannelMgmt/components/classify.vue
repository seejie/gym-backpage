<template>
  <div class="classify">
    <el-form-item label="分类展示">
      <el-button type="primary" @click="addMenuClick">选择分类</el-button>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-table :data="classifySelection" v-show="classifySelection.length>0" class="menu-list-table" border
        style="width: 510px;" row-key="catId">
        <el-table-column label="排序" prop="catSort" align="center" width="60"></el-table-column>
        <el-table-column prop="catName" label="分类名称" align="center" width="150"></el-table-column>
        <el-table-column prop="logo" label="Logo">
          <template slot-scope="scope"><img style="width: 50px;" :src="scope.row.catImg || ''" alt="" /></template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteMenuClick(scope.row)">取消展示</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-dialog width="30%" title="选择商品分类" :visible.sync="isShowNewMenuDialog" class="menu-mgmt-dialog">
      <p>从已经创建的商品分类中选择</p>
      <el-table ref="multipleTable" :data="classifyData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="120">
        </el-table-column>
        <el-table-column prop="catName" label="一级分类" width="120">
        </el-table-column>
        <el-table-column prop="logo" label="Logo">
          <template slot-scope="scope"><img style="width: 55px" :src="scope.row.catImg || ''" alt="" /></template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowNewMenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveNewMenuDataClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import sortable from "sortablejs";

  export default {
    name: "menu_list",
    props: ['classifySelectData', "category"],
    data() {
      return {
        isShowNewMenuDialog: false,
        classifyData: [],
        multipleSelection: [],
        classifySelection: this.classifySelectData
      };
    },

    watch: {
      classifySelection: {
        handler(n, o) {
          this.$emit('getClassify', n);
        },
        deep: true
      },

      category(value) {
        this.classifyData = value
        for (var i = 0; i < this.classifyData.length; i++) {
          for (var j in this.classifyData[i]) {
            if (this.classifyData[i][j] === null) {
              delete this.classifyData[i][j];
            }
          }
        }
        this.classifySelection = this.classifyData.filter(
          menu => menu.catIsShow !== 0
        );
      }
    },

    mounted() {
      let el = document.querySelectorAll('.menu-list-table > .el-table__body-wrapper > table > tbody')[0];
      if (el) {
        sortable.create(el, {
          onEnd: evt => { //监听拖动结束事件
            console.log(evt.oldIndex) //当前行的被拖拽前的顺序
            console.log(evt.newIndex) //当前行的被拖拽后的顺序
            const currRow = this.classifySelection.splice(evt.oldIndex, 1)[0];
            this.classifySelection.splice(evt.newIndex, 0, currRow);
            this.classifySelection.map((func, index) => {
              this.classifySelection[index].catSort = parseInt(index + 1)
            });
            this.$emit('changeClassifySort', this.classifySelection);
          }
        })
      }
    },

    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      addMenuClick() {
        this.isShowNewMenuDialog = true;
        setTimeout(() => {
          if (this.$refs.multipleTable) {
            this.$refs.multipleTable.clearSelection();
            if (this.classifySelection.length > 0) {
              this.classifySelection.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
              });
            }
          }
        },100)

      },
      deleteMenuClick(row) {
        this.classifySelection = this.classifySelection.filter(
          menu => menu.catId != row.catId
        );
        this.$emit('getClassify', this.classifySelection);
      },
      saveNewMenuDataClick() {
        this.isShowNewMenuDialog = false;
        this.classifySelection = this.multipleSelection;
        this.$emit('getClassify', this.classifySelection);
      }
    },
    components: {
      sortable
    }
  };

</script>
<style>
.classify {
  padding: 15px 0px;
  border-bottom: 1px solid #cccccc;
}
</style>
