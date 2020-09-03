<template>
  <div>
    <el-form-item label="栏目设置">
      <el-button type="primary" @click="addMenuClick">新增栏目</el-button>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-table
        :data="menulist"
        v-show="menulist.length > 0"
        class="menu-list-table"
        border
        style="width: 510px;"
        row-key="id"
      >
        <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="60"></el-table-column>
        <el-table-column property="columnName" label="栏目" align="center" width="150"></el-table-column>
        <el-table-column label="有效状态" width="150" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="changeStatus($event, scope.$index)"
              v-model="scope.row.isEffective"
              :width="60"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateMenuClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteMenuClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="channel-text-desc" v-show="menulist.length > 0">提示：可拖动实现排序</div>
    </el-form-item>
    <el-dialog
      :close-on-click-modal="false"
      width="30%"
      :title="menuOptTitleName"
      :visible.sync="isShowNewMenuDialog"
      class="menu-mgmt-dialog"
    >
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
import sortable from 'sortablejs';
import {
  addColumnForChannelType,
  modifyColumnForChannelType,
  deleteColumnById,
  setColumnByUnitId,
} from '@/api/apiPlatformSetting';
import { info } from '@/utils/ddHelper';
import channelData from '@/utils/channelData';

export default {
  name: 'menu_list',

  data() {
    return {
      isShowMenuDialog: false,
      isShowNewMenuDialog: false,
      menuOptTitleName: '新建栏目',
      menuName: '',
      selMenuData: {},
      menulist: [],
    };
  },

  created() {
    this.loadColumnInfo();
  },

  mounted() {
    let el = document.querySelectorAll('.menu-list-table > .el-table__body-wrapper > table > tbody')[0];
    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          //监听拖动结束事件
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.menulist.splice(evt.oldIndex, 1)[0];
          this.menulist.splice(evt.newIndex, 0, currRow);
          console.log(JSON.stringify(this.menulist));

          let list = [];
          this.menulist.forEach((item, index) => {
            list.push({
              ...item,
              sortNum: index + 1,
            });
          });

          setColumnByUnitId(list).then(_ => {
            info(this, `排序成功`);
            this.loadColumnInfo();
          });
        },
      });
    }
  },
  methods: {
    loadColumnInfo() {
      this.$ajax
        .get(
          `/platformsetting/column/getColumnByChannelTypeUnitId?channelType=${channelData.information.channelType}`,
          {}
        )
        .then(res => {
          if (res.resObject) {
            this.menulist = res.resObject;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addMenuClick() {
      this.menuOptTitleName = '新增栏目';
      this.isShowNewMenuDialog = true;
      this.selMenuData = {};
      this.menuName = '';
    },
    updateMenuClick(row) {
      this.isShowNewMenuDialog = true;
      this.menuOptTitleName = '编辑栏目';
      this.selMenuData = row;
      this.menuName = row.columnName;
    },
    deleteMenuClick(row) {
      deleteColumnById({
        id: row.id,
      }).then(_ => {
        info(this, `删除成功`);
        this.loadColumnInfo();
      });
    },
    saveNewMenuDataClick() {
      this.isShowNewMenuDialog = false;

      if (this.selMenuData && this.selMenuData.id) {
        modifyColumnForChannelType({
          ...this.selMenuData,
          columnName: this.menuName,
        }).then(_ => {
          info(this, `编辑成功`);
          this.loadColumnInfo();
        });
      } else {
        addColumnForChannelType({
          channelType: 1,
          columnName: this.menuName,
          sortNum: this.menulist.length + 1,
        }).then(_ => {
          info(this, `添加成功`);
          this.loadColumnInfo();
        });
      }
    },

    changeStatus(value, index) {
      modifyColumnForChannelType({
        ...this.menulist[index],
        isEffective: value,
      }).then(_ => {
        info(this, `编辑成功`);
        this.loadColumnInfo();
      });
    },
  },
  components: {
    sortable,
  },
};
</script>
