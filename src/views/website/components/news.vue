<template>
  <div>
    <el-form-item label="*新闻设置">
      <el-button type="primary" @click="addMenuClick">添加</el-button>
    </el-form-item>
    <el-form-item label-width="20px">
      <el-table
        :data="newsSelection"
        v-show="newsSelection.length > 0"
        class="news-list-table"
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
      title="选择新闻"
      :visible="isShowNewMenuDialog"
      class="menu-mgmt-dialog"
      @close="isShowNewMenuDialog = false"
    >
      <el-select placeholder="请选择" v-model="newsType">
        <el-option label="官网新闻" value="1"></el-option>
        <el-option label="资讯频道" value="2"></el-option>
      </el-select>
      <el-select placeholder="请选择栏目" v-if="newsType == 2" v-model="columnId">
        <el-option
          :label="item.columnName"
          :value="item.id"
          v-for="(item, index) in columnData"
          :key="index"
        ></el-option>
      </el-select>
      <el-table
        ref="multipleTable1"
        :data="newsData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange1"
        v-show="newsType == 1"
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
      <el-table
        ref="multipleTable2"
        :data="informationData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange2"
        v-show="newsType == 2"
        :row-key="getRowKeys"
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
import newsApi from '@/api/website/news';
import { informationListPage } from '@/api/information/info';
import channelData from '@/utils/channelData';

export default {
  name: 'select-news',
  props: {
    websiteNews: {
      type: Array,
      default: [],
    },
    websiteInformations: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      isShowNewMenuDialog: false,
      multipleSelection: [],
      newsSelection: [],
      newsSelection1: [],
      newsSelection2: [],

      newsData: [],
      informationData: [],

      multipleSelection: [],
      multipleSelection1: [],
      multipleSelection2: [],

      newsType: '1', // 1官网新闻  2资讯频道
      columnData: [], // 资讯频道
      columnId: '',
    };
  },

  watch: {
    columnId(val) {
      this.columnId = val;
      this.loadNewList();
    },
  },

  mounted() {
    // let el = document.querySelectorAll(
    //   '.news-list-table > .el-table__body-wrapper > table > tbody',
    // )[0]
    // if (el) {
    //   sortable.create(el, {
    //     onEnd: evt => {
    //       //监听拖动结束事件
    //       console.log(evt.oldIndex) //当前行的被拖拽前的顺序
    //       console.log(evt.newIndex) //当前行的被拖拽后的顺序
    //       const currRow = this.newsSelection.splice(evt.oldIndex, 1)[0]
    //       this.newsSelection.splice(evt.newIndex, 0, currRow)
    //       this.newsSelection.map((func, index) => {
    //         this.newsSelection[index].catSort = parseInt(index + 1)
    //       })
    //       // this.$emit('changeClassifySort', this.newsSelection)
    //     },
    //   })
    // }
  },

  created() {
    this.loadNewList();
    this.loadInformationColumn();

    this.newsSelection1 = this.websiteNews;
    this.newsSelection2 = this.websiteInformations;
    this.multipleSelection1 = this.websiteNews;
    this.multipleSelection2 = this.websiteInformations;
    this.newsSelection = [...this.multipleSelection1, ...this.multipleSelection2];
  },

  methods: {
    // 选择新闻
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
    },

    // 选择资讯
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },

    // 处理表格选中状态
    addMenuClick() {
      this.isShowNewMenuDialog = true;

      let checkList1 = [];
      let checkList2 = [];
      this.newsSelection1.forEach(case_id => {
        this.newsData.forEach((item, index) => {
          if (item.id == case_id.id) {
            checkList1.push(item);
          }
        });
      });
      this.newsSelection2.forEach(case_id => {
        this.informationData.forEach((item, index) => {
          if (item.id == case_id.id) {
            checkList2.push(item);
          }
        });
      });
      setTimeout(() => {
        if (this.$refs.multipleTable1) {
          this.$refs.multipleTable1.clearSelection();
          if (checkList1.length > 0) {
            checkList1.forEach(row => {
              this.$refs.multipleTable1.toggleRowSelection(row);
            });
          }
        }
        if (this.$refs.multipleTable2) {
          this.$refs.multipleTable2.clearSelection();
          if (checkList2.length > 0) {
            checkList2.forEach(row => {
              this.$refs.multipleTable2.toggleRowSelection(row);
            });
          }
        }
      }, 100);
    },

    // 加载表格数据
    loadNewList() {
      newsApi
        .listPage({
          pageNum: 1,
          pageSize: 99,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.newsData = res.resObject.list || [];
          }
        });
      informationListPage({
        pageNum: 1,
        pageSize: 99,
        columnId: this.columnId,
      }).then(res => {
        if (res.resCode == 200) {
          this.informationData = res.resObject.list || [];
        }
      });
    },

    // 加载资讯频道
    loadInformationColumn() {
      this.$ajax
        .get(`platformsetting/column/getColumnByChannelTypeUnitId?channelType=${channelData.information.channelType}`)
        .then(res => {
          if (res.resCode == 200) {
            this.columnData = res.resObject;
          }
        });
    },

    // 删除选中
    deleteMenuClick(row) {
      this.newsSelection = this.newsSelection.filter(menu => menu.id != row.id);
      this.newsSelection1 = this.newsSelection1.filter(menu => menu.id != row.id);
      this.newsSelection2 = this.newsSelection2.filter(menu => menu.id != row.id);

      this.$emit('getNewsList', this.newsSelection1);
      this.$emit('getInfromationsList', this.newsSelection2);
    },

    // 保存选中
    saveNewMenuDataClick() {
      this.isShowNewMenuDialog = false;
      this.newsSelection1 = this.multipleSelection1;
      this.newsSelection2 = this.multipleSelection2;
      this.newsSelection = [...this.multipleSelection1, ...this.multipleSelection2];

      this.$emit('getNewsList', this.newsSelection1);
      this.$emit('getInfromationsList', this.newsSelection2);
    },

    getRowKeys(row) {
      return row.id + '2';
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
