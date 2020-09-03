<template>
  <div>
    <el-form-item label="*服务介绍">
      <el-button type="primary" @click="addMenuClick">添加</el-button>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-table
        :data="serviceSelection"
        v-show="serviceSelection.length > 0"
        class="service-list-table"
        border
        style="width: 510px"
        row-key="id"
      >
        <el-table-column label="排序" type="index" align="center" width="60"></el-table-column>

        <el-table-column prop="logo" label="Logo">
          <template slot-scope="scope">
            <img style="width: 50px;" :src="scope.row.indexPic | indexPic" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" width="150"></el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteMenuClick(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-dialog
      width="50%"
      title="选择服务介绍"
      :visible="isShowNewMenuDialog"
      class="menu-mgmt-dialog"
      @close="isShowNewMenuDialog = false"
    >
      <el-table
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="80"></el-table-column>

        <el-table-column prop="logo" width="80" label="封面">
          <template slot-scope="scope">
            <img style="width: 55px" :src="scope.row.indexPic | indexPic" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowNewMenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveNewMenuDataClick">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import sortable from 'sortablejs';
import serviceApi from '@/api/website/service';
import { informationListPage } from '@/api/information/info';

export default {
  name: 'select-service',
  props: {
    websiteServices: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      isShowNewMenuDialog: false,
      multipleSelection: [],
      serviceSelection: [],

      listData: [],
    };
  },

  mounted() {
    let el = document.querySelectorAll('.service-list-table > .el-table__body-wrapper > table > tbody')[0];
    if (el) {
      sortable.create(el, {
        onEnd: evt => {
          //监听拖动结束事件
          console.log(evt.oldIndex); //当前行的被拖拽前的顺序
          console.log(evt.newIndex); //当前行的被拖拽后的顺序
          const currRow = this.serviceSelection.splice(evt.oldIndex, 1)[0];
          this.serviceSelection.splice(evt.newIndex, 0, currRow);
          this.serviceSelection.map((func, index) => {
            this.serviceSelection[index].catSort = parseInt(index + 1);
          });
          this.$emit('getServiceList', this.serviceSelection);
        },
      });
    }
  },

  created() {
    this.loadServiceList();
    this.serviceSelection = this.websiteServices;
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    addMenuClick() {
      this.isShowNewMenuDialog = true;
      let checkList = [];
      this.serviceSelection.forEach(service_id => {
        this.listData.forEach((item, index) => {
          if (item.id == service_id.id) {
            checkList.push(item);
          }
        });
      });
      setTimeout(() => {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
          if (checkList.length > 0) {
            checkList.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          }
        }
      }, 100);
    },

    loadServiceList() {
      serviceApi
        .listPage({
          pageNum: 1,
          pageSize: 99,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.listData = res.resObject.list || [];
          }
        });
    },

    deleteMenuClick(row) {
      this.serviceSelection = this.serviceSelection.filter(menu => menu.id != row.id);
      this.$emit('getServiceList', this.serviceSelection);
    },

    saveNewMenuDataClick() {
      this.isShowNewMenuDialog = false;
      this.serviceSelection = this.multipleSelection;
      this.$emit('getServiceList', this.serviceSelection);
    },
  },
  components: {
    sortable,
  },

  filters: {
    indexPic(val) {
      return val ? val.split(',')[0] : '';
    },
  },
};
</script>
