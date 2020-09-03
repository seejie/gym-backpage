<template>
  <div class="typeSet">
    <el-card>
      <div class="item-wrap">
        <!-- 左侧一级菜单 -->
        <div class="item">
          <div class="top-search">
            <!-- <el-input placeholder="请输入关键词内容"
                      v-model="levelOneMenu.input"
                      class="input-with-select">
              <el-button slot="append"
                         @click="leftSearch"
                         icon="el-icon-search"></el-button>
            </el-input> -->
          </div>
          <div class="content">
            <el-collapse v-model="leftMenuOpen">
              <el-collapse-item title="一级菜单" name="1">
                <div
                  :class="currenIndex == index ? 'menu-item active' : 'menu-item'"
                  v-for="(item, index) in menulist"
                  @click="chooseItem(item, index)"
                  :key="index"
                >
                  {{ item.catName }}<i class="el-icon-edit-outline icon-edit" @click="edit(item)"></i>
                  <i class="el-icon-delete icon-delete" @click="del(item)"></i>
                </div>
                <el-button @click="addMenu(1)" style="width:100%;height:45px;" type="primary">添加</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <!-- 右侧二级菜单 -->
        <div class="item">
          <div class="top-search">
            <!-- <el-input placeholder="请输入关键词内容"
                      v-model="levelTwoMenu.input"
                      class="input-with-select">
              <el-button slot="append"
                         @click="rightSearch"
                         icon="el-icon-search"></el-button>
            </el-input> -->
          </div>
          <div class="content">
            <el-collapse v-model="rightMenuOpen">
              <el-collapse-item title="二级菜单" name="2">
                <div
                  v-for="(item, index) in nextMenuList"
                  :key="index"
                  @click="chooseNextItem(item, index)"
                  class="menu-item active"
                >
                  {{ item.catName }}<i @click="edit(item)" class="el-icon-edit-outline icon-edit"></i>
                  <i @click="del(item)" class="el-icon-delete icon-delete"></i>
                </div>
                <el-button @click="addMenu(2)" style="width:100%;height:45px;" type="primary">添加</el-button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 添加框 -->
    <el-dialog title="创建品类" :visible.sync="addShow">
      <el-form :model="addFrom">
        <el-form-item label="品类名称" label-width="100">
          <el-input v-model="addFrom.name" placeholder="请输入品类名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品类图标" label-width="100" prop="catImg">
          <img-include v-model="addFrom.catImg" :max="1" :cropper="cropper" :style="{ clear: 'both' }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog title="编辑品类" :visible.sync="editShow">
      <el-form :model="addFrom">
        <el-form-item label="品类名称" label-width="100">
          <el-input v-model="editFrom.name" placeholder="请输入品类名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品类图标" label-width="100" prop="catImg">
          <img-include v-model="editFrom.catImg" :max="1" :cropper="cropper" :style="{ clear: 'both' }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ImgInclude from '@/components/CropImgInclue';
export default {
  data() {
    return {
      levelOneMenu: {
        input: '', //一级菜单输入框
      },
      levelTwoMenu: {
        input: '', //一级菜单输入框
      },
      addFrom: {
        name: '', //添加品类名称
        catImg: '',
      },
      cropper: [
        {
          name: '品类图标',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          // desc: "你的用户将在门票详情页各类别票种、惠购查看更多景点门票列表，看到此封面"
        },
      ],
      leftMenuOpen: '1', //左侧默认展开
      rightMenuOpen: '2', //右侧默认展开
      addShow: false,
      dialogImageUrl: '', //上传图片预览
      dialogVisible: false, //是否预览图片
      menulist: [], //一级菜单数据
      nextMenuList: [], //二级菜单数据
      currenIndex: 0, //当前选中的一级菜单
      currenParentId: '', //当前选中的父级菜单id
      currenId: '', //当前选中的id
      addMenuType: 1, //添加的菜单层级
      editShow: false, //编辑弹框
      editFrom: {
        name: '', //编辑品类名称
        catImg: '',
      },
    };
  },
  components: { ImgInclude },
  mounted() {
    this.queryAllType();
    // this.queryNextType()
  },
  methods: {
    //
    leftSearch() {
      console.log('左侧搜索');
      this.queryAllType();
    },
    rightSearch() {
      console.log('右侧搜索');
    },
    //上传logo删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 上传logo预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //编辑品类
    edit(item) {
      console.log(item);
      this.currenId = item.catId;
      this.editShow = true;
      this.editFrom.name = item.catName;
      this.editFrom.catImg = item.catImg ? { ratio1: item.catImg.split(',') } : {};
    },
    //删除品类
    del(item) {
      console.log(item);
      let delId = [].concat(item.catId);
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.delRow(item, delId);
        })
        .catch(action => {
          console.log('取消');
        });
    },
    delRow(item, id) {
      this.$ajax
        .delete('/shop/active/category/deleteByIds', {
          data: id,
        })
        .then(res => {
          // this.nextMenuList = res.list
          this.$message.success('删除成功');
          item.catParentId == 0 ? this.queryAllType() : this.getNextMenuList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询所有二级分类
    getNextMenuList(id = this.currenParentId) {
      this.$ajax
        .get('/shop/active/category/queryAll', {
          params: {
            catParentId: id,
          },
        })
        .then(res => {
          this.nextMenuList = res.index;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //查询所有一级菜单
    queryAllType() {
      this.$ajax
        .get('/shop/active/category/queryAll', {
          params: {
            catParentId: 0,
            catName: this.levelOneMenu.input,
          },
        })
        .then(res => {
          this.menulist = res.index;
          try {
            this.currenIndex = 0;
            if (res.index.length > 0) {
              this.currenParentId = res.index[0].catId;
            } else {
              //没有查到数据
              this.nextMenuList = [];
            }
          } catch (err) {
            console.log(err);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击左侧菜单
    chooseItem(item, index) {
      this.currenIndex = index;
      this.currenParentId = item.catId;
      this.currenId = item.catId;
      this.addMenuType = 1;
      console.log(item);
    },
    //点击右侧菜单
    chooseNextItem(item) {
      this.currenId = item.catId;
      this.addMenuType = 2;
    },
    //菜单添加
    addMenu(type) {
      this.addShow = true;
      this.addMenuType = type;
      this.addFrom.name = '';
    },
    //添加数据到接口
    confirmAdd() {
      if (this.addMenuType == 1) {
        //添加一级菜单catParentId传入0
        this.$ajax
          .post(' /shop/active/category/saveOrUpdate', {
            catName: this.addFrom.name,
            catGrade: 1,
            catImg: this.addFrom.catImg['ratio1'],
          })
          .then(res => {
            //重新获取一级菜单
            if (res.code == 200) {
              this.$message.success('保存成功');
              this.addShow = false;
              this.queryAllType();
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        //添加二级菜单
        this.$ajax
          .post(' /shop/active/category/saveOrUpdate', {
            catName: this.addFrom.name,
            catParentId: this.currenParentId,
            catGrade: 2,
          })
          .then(res => {
            if (res.code == 200) {
              this.$message.success('保存成功');
              this.addShow = false;
              this.getNextMenuList();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //编辑数据到接口
    confirmEdit() {
      console.log(this.dialogImageUrl);
      // if (this.addMenuType == 1) {
      //   //编辑一级菜单catParentId传入0
      //   this.$ajax.post(' /shop/active/category/saveOrUpdate', {
      //     catName: this.editFrom.name,
      //     catGrade: 1,
      //     catId: this.currenId
      //   }).then((res) => {
      //     //重新获取一级菜单
      //     if (res.code == 200) {
      //       this.$message.success("保存成功")
      //       this.editShow = false
      //       this.queryAllType()
      //     }
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // } else {
      //   //编辑二级菜单
      //   this.$ajax.post(' /shop/active/category/saveOrUpdate', {
      //     catName: this.editFrom.name,
      //     catParentId: this.currenParentId,
      //     catGrade: 2,
      //     catId: this.currenId
      //   }).then((res) => {
      //     if (res.code == 200) {
      //       this.$message.success("保存成功")
      //       this.editShow = false
      //       this.getNextMenuList()
      //     }
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // }
    },
  },
  watch: {
    currenParentId(val) {
      this.getNextMenuList(val);
    },
  },
};
</script>
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
