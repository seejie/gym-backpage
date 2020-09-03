<template>
  <div>
    <el-form-item label="栏目设置">
      <el-button type="primary" @click="addMenuClick">新增栏目</el-button>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-table :data="menulist" v-show="menulist.length>0" class="menu-list-table" border style="width: 510px;"
        row-key="id">
        <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column property="column_name" label="栏目" align="center" width="150"></el-table-column>
        <el-table-column label="有效状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_show" :width="60" :active-value="1" :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateMenuClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteMenuClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="channel-text-desc" v-show="menulist.length>0">提示：可拖动实现排序</div>
    </el-form-item>
    <el-dialog width="30%" :title="menuOptTitleName" :visible.sync="isShowNewMenuDialog" class="menu-mgmt-dialog">
      <el-form class="demo-ruleForm">
        <el-form-item label="栏目名称">
          <el-input v-model="menuName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowNewMenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveNewMenuDataClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import sortable from 'sortablejs'

  export default {
    name: 'menu_list',
    props: {
      menuListData: {
        type: Array
      }
    },
    data() {
      return {
        isShowMenuDialog: false,
        isShowNewMenuDialog: false,
        menuOptTitleName: '新建栏目',
        menuName: '',
        selMenuData: {},
        menulist: this.menuListData
      }
    },
    watch: {
      menulist: {
        handler(newValue, oldValue) {
          this.$emit('getMenuList', newValue);
        },
        deep: true
      }
    },
    mounted() {
      let el = document.querySelectorAll('.menu-list-table > .el-table__body-wrapper > table > tbody')[0];
      if (el) {
        sortable.create(el, {
          onEnd: evt => { //监听拖动结束事件
            console.log(evt.oldIndex) //当前行的被拖拽前的顺序
            console.log(evt.newIndex) //当前行的被拖拽后的顺序
            const currRow = this.menulist.splice(evt.oldIndex, 1)[0];
            this.menulist.splice(evt.newIndex, 0, currRow);
            console.log(JSON.stringify(this.menulist));
          }
        })
      }
    },
    methods: {
      addMenuClick() {
        this.menuOptTitleName = "新增栏目";
        this.isShowNewMenuDialog = true;
        this.selMenuData = {};
        this.menuName = '';
      },
      updateMenuClick(row) {
        this.isShowNewMenuDialog = true;
        this.menuOptTitleName = '编辑栏目';
        this.selMenuData = row;
        this.menuName = row.column_name;
      },
      deleteMenuClick(row) {
        this.menulist = this.menulist.filter(menu => menu.id != row.id);
      },
      saveNewMenuDataClick() {
        this.isShowNewMenuDialog = false;
        if (this.selMenuData && this.selMenuData.id) {
          //修改
          this.selMenuData.column_name = this.menuName;
        } else {
          //新增
          //取最大的 id
          if (this.menulist.filter(menu => menu.column_name == this.menuName).length > 0) {
            this.$message.error("已存在同样名称的栏目");
            return;
          }
          if (this.menulist.length <= 0) {
            this.menulist.push({
              id: 1,
              column_name: this.menuName,
              is_show: 1
            })
          } else {
            this.menulist.push({
              id: Math.max.apply(Math, this.menulist.map(menu => menu.id)) + 1,
              column_name: this.menuName,
              is_show: 1
            })
          }
        }
      }
    },
    components: {
      sortable
    }
  }

</script>
