<template>
  <div>
    <el-container style="height: 500px;">
      <el-aside width="194px" class="aside">
        <el-menu
          style="width: 100%;"
          @select="groupChange"
          :default-active="activeGroup + ''"
          text-color="#353535"
          active-text-color="#353535"
          class="xqn"
        >
          <el-menu-item class="menu-item" :index="''"> 全部分组[{{ allCount }}] </el-menu-item>

          <el-menu-item v-for="g in group" :key="g.id" :index="g.id + ''" class="menu-item">
            {{ g.name }}[{{ g.count || '0' }}]
          </el-menu-item>
        </el-menu>
        <div class="addgroup menu-item" @click="addGroup">+新建分组</div>
      </el-aside>
      <el-main class="main">
        <table-control :right="controlRight" :left="[]" v-model="form" style="background: #fff;"></table-control>
        <div class="imgct">
          <m-image
            v-for="img in images"
            :key="img.id"
            :img="img.path"
            :active="img.id == selectedImg.id"
            :name="img.title"
            class="imgs"
            @click.native="imgClick(img)"
          ></m-image>
        </div>
        <el-pagination
          @size-change="sizeChange"
          @current-change="curChange"
          :current-page="curPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          style="text-align: right;"
        ></el-pagination>
      </el-main>
    </el-container>
    <pop-layer v-model="createVisible" @added="added" :activeGroup="activeGroup"></pop-layer>
  </div>
</template>

<script>
import TableControl from '@/components/TablePage/Control';
import TPage from '@/components/TablePage/Pagination';
import MImage from './Image';
import PopLayer from './PopLayer';
import { getImageList, getImageGroupList, addImageGroup } from '@/api/material';
import { mapState, mapMutations } from 'vuex'

import { MessageBox } from 'element-ui';
const pageSize = 8;
export default {
  props: {
    selectedImg: {
      type: Object,
    },
    dialogVisible: {},
  },
  model: {
    prop: 'selectedImg',
    event: 'change',
  },

  watch: {
    dialogVisible() {
      if (this.images.length) {
        this.imgClick(this.images[0]);
      }
    },
  },

  components: {
    TableControl,
    MImage,
    TPage,
    PopLayer,
  },
  created() {
    this.getGroup();
  },
  data() {
    return {
      createVisible: false,
      curPage: 1,
      pageSize: pageSize,
      totalCount: -1,
      allCount: '',
      tatalImgCount: -1,
      images: [],
      group: [],
      activeGroup: 0,
      controlRight: [
        {
          _is: 't-search',
          placeholder: 'sss',
          prop: 'name',
          on: {
            search: this.onSearch,
          },
        },
        {
          _is: 't-button',
          type: 'primary',
          label: '本地上传',
          on: {
            click: this.upload,
          },
        },
      ],
      form: {
        name: '',
      },
    };
  },

  computed: {
    ...mapState('app', ['imageGroup'])
  },
  methods: {
    ...mapMutations('app', ['SET_IMAGE_GROUP']),
    getGroup() {
      getImageGroupList({}).then(res => {
        this.group = res.resObject;
        this.tatalImgCount = res.resObject.length;
        this.activeGroup = this.imageGroup ? this.imageGroup : res.resObject[0].id;
        this.clearPage();
        this.getImageList();
      });
    },
    clearPage() {
      this.curPage = 1;
      this.pageSize = pageSize;
      this.totalCount = -1;
    },
    getImageList() {
      getImageList({
        imageGroupId: this.activeGroup,
        title: this.form.name,
        pageNum: this.curPage,
        pageSize: this.pageSize,
      }).then(res => {
        if (res && res.resObject && res.resObject.list) {
          this.totalCount = res.resObject.totalCount;
          this.allCount = res.resObject.allCount;
          this.images = res.resObject.list;
          if (this.images.length) {
            this.imgClick(this.images[0]);
          }
        }
      });
    },

    groupChange(id) {
      if (id == this.activeGroup && id != '') {
        return;
      }

      this.$emit('change', {});
      this.activeGroup = id;
      this.SET_IMAGE_GROUP(id)
      this.clearPage();
      this.getImageList();
    },
    imgClick(img) {
      this.$emit('change', img);
    },
    onSearch() {
      this.clearPage();
      this.getImageList();
    },
    sizeChange(s) {
      this.pageSize = s;
      this.getImageList();
    },
    curChange(c) {
      this.curPage = c;
      this.getImageList();
    },
    upload() {
      //this.$emit('upload')
      this.createVisible = true;
    },
    addGroup() {
      this.$prompt('请输入分组名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        addImageGroup({
          name: value,
        }).then(res => {
          this.getGroup();
        });
        // this.$message({
        //     type: 'success',
        //     message: '你的邮箱是: ' + value
        // });
      });
    },
    // 本地上传组件后，选中其分组，并刷新图片列表
    added(form) {
      this.createVisible = false;
      this.activeGroup = form.imageGroupId;
      this.getGroup();
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: 0;
}

.aside {
  padding: 0;
  background-color: #fff;
  border-right: 1px solid $conentBorder;
}

.menu-item {
  height: 42px;
  line-height: 42px;
}

.imgct {
  padding-left: 66px;
  padding-top: 42px;
}

.imgs {
  display: inline-block;
  margin-right: 38px;
  margin-bottom: 38px;
}

.xqn.el-menu {
  border-right: none;

  /deep/ .el-menu-item.is-active {
    background-color: $toolsBg;
  }
}

.addgroup {
  cursor: pointer;
  padding-left: 20px;
}
</style>
