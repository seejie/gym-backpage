<template>
  <section>
    <div class="ticketClassify typeSet">
      <el-card>
        <div class="item-wrap">
          <!-- 左侧一级菜单 -->
          <div class="item">
            <div class="top-search">
              <el-input placeholder="请输入关键词内容" v-model="leftValue" class="input-with-select">
                <el-button slot="append" @click="leftSearch" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div class="content">
              <el-collapse v-model="leftMenuOpen">
                <el-collapse-item title="一级菜单" name="1">
                  <div
                    :class="i && i.catId == activeParentId ? 'menu-item active' : 'menu-item'"
                    v-for="(i, index) in leftData"
                    @click="clickLeft(i.catId)"
                    :key="index"
                  >
                    {{ i.catName }}
                    <i class="el-icon-edit-outline icon-edit" @click="onEdit(i, 'left')"></i>
                    <i class="el-icon-delete icon-delete" @click="onDelete(i, 'left')"></i>
                  </div>
                  <el-button @click="onAdd('left')" style="width:100%;height:45px;" type="primary">添加</el-button>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <!-- 右侧二级菜单 -->
          <div class="item">
            <div class="top-search">
              <el-input placeholder="请输入关键词内容" v-model="rightValue" class="input-with-select">
                <el-button slot="append" @click="rightSearch" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div class="content">
              <el-collapse v-model="rightMenuOpen">
                <el-collapse-item title="二级菜单" name="2">
                  <div v-for="(i, index) in rightData" :key="index" class="menu-item active">
                    {{ i.catName }}
                    <i @click="onEdit(i, 'right')" class="el-icon-edit-outline icon-edit"></i>
                    <i @click="onDelete(i, 'right')" class="el-icon-delete icon-delete"></i>
                  </div>
                  <el-button @click="onAdd('right')" style="width:100%;height:45px;" type="primary">添加</el-button>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </el-card>
      <!-- 添加框 -->
      <el-dialog title="创建品类" :visible.sync="addShow" :before-close="closeDialog" :close-on-click-modal="false">
        <el-form :model="addFrom" ref="addFrom" :rules="rules">
          <el-form-item label="品类名称" label-width="100" prop="catName">
            <el-input v-model="addFrom.catName" placeholder="亲子"></el-input>
          </el-form-item>
          <el-form-item label="品类图标" label-width="100" prop="catImg">
            <img-include v-model="addFrom.catImg" :max="1" :cropper="cropper" :style="{ clear: 'both' }" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" v-if="addOrEdit == 'add'" @click="saveTag('addFrom')">确 定</el-button>
          <el-button type="primary" v-else @click="editTag('addFrom')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>
<script type="text/ecmascript-6">
import ImgInclude from "@/components/CropImgInclue";

import {
  shopCategorySaveOrUpdate,
  shopCategoryQueryAll,
  shopCategoryDeleteByIds
 } from "@/api/standshop/goodsManage";

export default {
  components: { ImgInclude },
  data () {
    return {
      leftData: [],
      rightData: [],
      inputValue: "",
      leftValue: "",
      rightValue: "",
      activeParentId: "", //左边active的id
      activeType: "left", //当前点击的是左边还是右边
      addOrEdit: "add",
      currenIndex: 0, //当前选中的一级菜单
      editEtraId: {
        //编辑的传递
        catId: "",
        catParentId: ""
      },
      addShow: false,
      addFrom: {
        catName: "", // 品类名称
        catImg: {}, // 品类图标
      },
      rules: {
        catName: [{ required: true, message: "请输入名称" }]
      },
      leftMenuOpen: "1", //左侧默认展开
      rightMenuOpen: "2", //右侧默认展开,
      cropper: [
        {
          name: "品类图标",
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          // desc: "你的用户将在门票详情页各类别票种、惠购查看更多景点门票列表，看到此封面"
        },
      ],
    };
  },
  created () {
    //this.topAdd();
    this.getList({ catParentId: 0 }); //一级分类固定传0
  },
  methods: {
    // catParentId: 0 所有一级， catParentId: 传具体的就带边查子级
    //初始化-查询左右
    async getList (params) {

      let payload = {
        catParentId: 0,
        ...params
      }

      if(this.leftValue) {
        payload.catName = this.leftValue
      }

      shopCategoryQueryAll(payload).then((res) => {
        if(res.resCode == 200) {
          let resultLeft = res.resObject

          this.leftData = resultLeft;
          if (resultLeft.length > 0) {
            this.activeParentId = resultLeft[0].catId;
            let payload_right = {
              catParentId: resultLeft[0].catId,
              catName: this.rightValue
            }
            if(this.rightValue) {
              payload_right.catName = this.rightValue
            }

            shopCategoryQueryAll(payload_right).then(res_right => {
              if(res_right.resCode == 200) {
                this.rightData = res_right.resObject;
              }
            })
          } else {
            this.rightData = []
          }
        }
      })
    },

    // 仅处理右边
    async getRightList (catParentId, catName = this.rightValue) {
      let payload = {
        catParentId,
        catName
      }
      shopCategoryQueryAll(payload).then(res => {
        if(res.resCode == 200) {
          this.rightData = res.resObject;
        }
      })
    },

    //点击左边
    clickLeft (catParentId) {
      this.activeParentId = catParentId;
      this.getRightList(catParentId);
    },
    //左搜
    leftSearch () {
      this.getList({ catParentId: 0, catName: this.leftValue });
    },
    //右搜
    rightSearch () {
      this.getRightList(this.activeParentId, this.rightValue);
    },
    //添加
    onAdd (type) {
      if (type == "right" && this.leftData.length == 0) {
        this.$message({
          message: "请先添加左边数据!",
          type: "warning"
        });
        return;
      }
      this.addOrEdit = "add";
      this.addShow = true;
      this.activeType = type;
    },

    //编辑
    onEdit(i, type) {
      this.addOrEdit = "edit";
      this.activeType = type;

      this.addFrom = {
        catName: i.catName,
        catImg: i.catImg ? { 'ratio1': i.catImg.split(',') } : {},
      };
      this.editEtraId = {
        catId: i.catId,
        catParentId: i.catParentId
      };

      this.addShow = true;
    },

    // 删除
    async onDelete (i, type) {

      let that = this;
      this.activeType = type;
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        shopCategoryDeleteByIds({ids: i.catId}).then(res => {
          if(res.resCode == 200) {
            if (that.activeType == "left") {
              that.getList({ catParentId: 0 });
            } else {
              that.getRightList(i.catParentId);
            }
          }
        })
      }).catch(action => {
        console.log('取消')
      });

    },
    //新建保存
    saveTag (formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            catName: this[formName].catName,
            catImg: this[formName].catImg["ratio1"] && this[formName].catImg["ratio1"][0],
          };
          if (this.activeType == "left") {
            params.catParentId = 0;
            params.catGrade = 1;
          } else {
            params.catParentId = this.activeParentId;
            params.catGrade = 2;
          }
          shopCategorySaveOrUpdate(params).then((res) => {
            if(res.resCode == 200) {
              this.$message({
                message: "操作成功!",
                type: "success"
              });
            }

            if (this.activeType == "left") {
              this.getList({ catParentId: 0 });
            } else {
              this.getRightList(this.activeParentId);
            }
            this.addShow = false;
            this.resetForm(formName);
            this.$refs["addFrom"].clearValidate()
          });
        } else {
          return false;
        }
      });
    },
    //编辑保存
    editTag (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            catName: this[formName].catName,
            catImg: this[formName].catImg["ratio1"][0],
            ...this.editEtraId
          };
          if (this.activeType == "left") {
            params.catGrade = 1;
          } else {
            params.catGrade = 2;
          }
          shopCategorySaveOrUpdate(params).then((res) => {
            if(res.resCode == 200) {
              this.$message({
                message: "操作成功!",
                type: "success"
              });
            }

            if ((this.type = "left")) {
              this.getList({ catParentId: 0 });
            } else {
              this.getRightList(this.this.editEtraId.catParentId);
            }
            this.addShow = false;
            this.resetForm(formName);
            this.$refs["addFrom"].clearValidate()
          });
        } else {
          return false;
        }
      });
    },
    resetForm (formName) {
      this.addFrom = {
        catName: ""
      };
    },
    onCancel () {
      this.addShow = false;
      this.resetForm("addFrom");
      this.$refs["addFrom"].clearValidate()
    },
    closeDialog (done) {
      this.$refs["addFrom"].clearValidate()
      done()
    }
  }
};
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
