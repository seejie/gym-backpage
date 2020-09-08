<!--品类设置-->
<template>
  <div class="ticketClassify typeSet">
    <el-card>
      <div class="item-wrap">
        <!-- 左侧一级菜单 -->
        <div class="item">
          <div class="top-search">
            <el-input placeholder="请输入关键词内容" v-model="oneFilter" class="input-with-select">
              <el-button slot="append" @click="filterSearh(oneFilter)" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="content">
            <el-collapse v-model="leftMenuOpen">
              <el-collapse-item title="一级菜单" name="1">
                <div
                   v-for="(i, index) in oneMenus"
                   :class="i && i.id == parentId ? 'menu-item active' : 'menu-item'"
                   @click="searchSecondMenu(i.id)"
                   :key="index"
                >
                  {{ i.categoryName }}
                  <i class="el-icon-edit-outline icon-edit" @click="showOneMenu(i, index, true)"></i>
                  <i class="el-icon-delete icon-delete" @click="deleteMenu(i)"></i>
                </div>
                <el-button @click="showOneMenu" style="width:100%;height:45px;" type="primary">添加</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <!-- 右侧二级菜单 -->
        <div class="item">
          <div class="top-search">
            <el-input placeholder="请输入关键词内容" v-model="twoFilter" class="input-with-select">
              <el-button slot="append" @click="filterSearh(twoFilter, true)" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="content">
            <el-collapse v-model="rightMenuOpen">
              <el-collapse-item title="二级菜单" name="2">
                <div v-for="(i, index) in twoMenus" :key="index" class="menu-item active">
                  {{ i.categoryName }}
                  <i @click="editColumn(i)" class="el-icon-edit-outline icon-edit"></i>
                  <i @click="deleteMenu(i)" class="el-icon-delete icon-delete"></i>
                </div>
                <el-button :disabled="!this.parentId" @click="showTwoMenu" style="width:100%;height:45px;" type="primary">添加</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </el-card>
    <div class="mask-box" v-show="showAdd">
      <div class="wrap-mask">
        <div class="mask-title">
          {{ boxObj.id ? '编辑品类' : '创建品类' }}
          <i class="el-icon-close" @click="showAddBox(false)"></i>
        </div>
        <div style="padding: 16px">
          <div style="padding: 8px 0">品类名称</div>
          <el-input v-model="boxObj.categoryName" clearable></el-input>
          <div style="padding: 8px 0">品类说明</div>
          <el-input v-model="boxObj.categoryDesc" clearable></el-input>
        </div>
        <div class="footer">
          <el-button size="small" @click="showAddBox(false)">取消</el-button>
          <el-button size="small" type="success" @click="addData" :disabled="!boxObj.categoryName">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assign from 'object-assign';
import { addCourseCategory, deleteCourseCategory, searchCourseCategoryList, filterCourseCategoryList, findCourseCategoryId, updateCourseCategory } from '../sever'

export default {
  name: '',
  data() {
    return {
      oneMenus: [],
      twoMenus: [],
      oneFilter: '',
      twoFilter: '',
      showAdd: false,
      boxObj: { categoryDesc: '', categoryName: '' },
      parentId: '',
      leftMenuOpen: '1', // 左侧默认展开
      rightMenuOpen: '2', // 右侧默认展开,
    };
  },
  mounted() {
    this.searchFirstMenu();
  },
  methods: {
    searchFirstMenu(num) { // 获取一级菜单
      const that = this;
      searchCourseCategoryList({ pageSize: 0 }).then(res => {
        if (res.resCode == 200) {
          const arr = (res.resObject.list || []).filter(v => !v.catParentId);
          if (arr.length <= 0) return false;
          this.oneMenus = arr;
          this.parentId = num || arr[0].id;
          this.twoMenus = res.resObject.list.filter(v => v.catParentId === arr[0].id);
        } else {
          that.$message.error(res.message);
        }
      })
    },
    searchSecondMenu(id) { // 获取二级菜单
      const that = this;
      findCourseCategoryId(
        { unitParentId: id }).then(res => {
        if (res.resCode == 200) {
          that.parentId = id;
          that.twoMenus = res.resObject.list || [];
        } else {
          that.$message.error(res.message);
        }
      })
    },
    filterSearh(name, type) { // 根据条件查询一二级菜单
      if (type && !this.parentId) return;
      const that = this;
      let param = { categoryName: name };
      if (type) param = assign(param, { catParentId: this.parentId });
      filterCourseCategoryList(param).then(res => {
        if (res.resCode == 200) {
          if (!type) {
            this.oneMenus = res.resObject.list || []
            this.twoMenus = [];
            this.parentId = '';
          } else {
            this.twoMenus = res.resObject.list || []
          }
        } else {
          that.$message.error(res.message);
        }
      })
    },
    addData() {
      if (this.boxObj.id) this.editMenu();
      if (!this.boxObj.id) this.addMenu();
    },
    addMenu() {
      const param = this.boxObj;
      const that = this;
      addCourseCategory(param).then(res => {
        if (res.resCode == 200) {
          that.$message.success('操作成功');
          if (param.catParentId) that.twoMenus = [...that.twoMenus, res.resObject];
          if (!param.catParentId && that.oneMenus.length > 0) {
            that.oneMenus = [...that.oneMenus, res.resObject];
          } else if (!param.catParentId && that.oneMenus.length <= 0) {
            that.oneMenus = [...that.oneMenus, res.resObject];
            that.parentId = res.resObject.id;
          }
          that.showAdd = false;
        } else {
          that.$message.error(res.message);
        }
      })
    },
    editMenu() {
      const param = this.boxObj;
      const that = this;
      updateCourseCategory(param).then(res => {
        if (res.resCode == 200) {
          that.$message.success('编辑成功');
          if (param.catParentId) that.twoMenus[param.i] = param;
          if (!param.catParentId) that.oneMenus[param.i] = param;
          that.showAdd = false;
        } else {
          that.$message.error(res.message);
        }
      })
    },
    deleteMenu(obj) { // 删除菜单
      const that = this;
      deleteCourseCategory({ ids: [obj.id] }).then(res => {
        if (res.resCode == 200) {
          that.$message.success('删除成功');
          if (obj.catParentId) {
            that.twoMenus = that.twoMenus.filter(v => v.id !== obj.id);
          } else {
            const arr = that.oneMenus.filter(v => v.id !== obj.id);
            that.oneMenus = arr;
            if (arr.length === 0) {
              that.parentId = '';
              that.twoMenus = [];
            } else if (obj.id === that.parentId) {
              that.twoMenus = [];
              that.parentId = arr[0].id;
              that.searchSecondMenu(arr[0].id);
            }
          }
        } else {
          that.$message.error(res.message);
        }
      })
    },
    showAddBox(val) {
      if (!val) this.boxObj = { name: '' };
      this.showAdd = val;
    },
    editColumn(val) {
      this.boxObj = val;
      this.showAdd = true;
    },
    showOneMenu(obj, i, flag) {
      this.showAdd = true;
      if (flag) this.boxObj = assign({}, obj, { i });
      if (!flag) this.boxObj = { categoryDesc: '', categoryName: '' };
    },
    showTwoMenu(obj, i, flag) {
      this.showAdd = true;
      if (flag) this.boxObj = assign({}, obj, { i, catParentId: this.parentId });
      if (!flag) this.boxObj = { categoryDesc: '', categoryName: '', catParentId: this.parentId };
    }

  }
}
</script>

<style lang="scss" scoped>
  .ticketClassify {
    .leftBorder {
      padding: 10px;
      border: 1px solid #ccc;
      height: 500px;
      margin-right: 10px;
    }
    .activeBg {
      background: #e65d6e21;
    }
  }
  .mask-box{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
    left: 0;
    background-color: rgba(55,55,55,.6);

  }
  .wrap-mask{
    width: 400px;
    margin: 0 auto;
    position: relative;
    outline: 0;
    top: 100px;
    background-color: #ffffff;
  }
  .wrap-mask .mask-title{
    display: flex;
    align-items: center;
    padding: 8px;
    justify-content: space-between;
    background-color: #333333;
    color: #ffffff;
  }
  .footer{
    text-align: right;
    padding: 8px;
    border-top: 1px solid #cccccc;
  }
</style>
<style lang="scss" scoped>
  .typeSet {
    @extend %fill;
    .el-card {
      @extend %fill;
      /deep/ .el-card__body {
        width: 100%;
        height: auto;
        .item-wrap {
          @extend %fill;
          display: flex;
          justify-content: center;
          .item {
            width: 33%;
            height: auto;
            min-height: 480px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
            margin-right: 10px;
            padding: 20px;
            .top-search {
              height: auto;
              width: 100%;
              margin-bottom: 20px;
            }
            .content {
              width: 100%;
              height: auto;
              .menu-item {
                width: 100%;
                height: 45px;
                cursor: pointer;
                line-height: 45px;
                border: 1px solid #ccc;
                border-radius: 5px;
                overflow: hidden;
                white-space: normal;
                text-overflow: ellipsis;
                margin-bottom: 10px;
                padding: 0 10px;
                position: relative;
                text-align: center;
                &:last-child {
                  margin-bottom: 0;
                }
                %font {
                  position: absolute;
                  top: 10px;
                  font-size: 20px;
                  cursor: pointer;
                }
                .icon-edit {
                  @extend %font;
                  right: 40px;
                }
                .icon-delete {
                  @extend %font;
                  right: 10px;
                }
              }
              .active {
                background: #eee;
              }
            }
          }
        }
      }
    }
  }
</style>
