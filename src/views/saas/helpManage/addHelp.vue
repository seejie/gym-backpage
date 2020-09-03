<template>
  <div class="addHelp">
    <el-card class="box-card" shadow="never">
      <div style="padding-right:20px;">
        <el-form :rules="rules" ref="addData" :model="addData" label-width="100px">
          <h3 class="addAnnouncement_header">基本信息</h3>
          <el-form-item label="图文标题" prop="title">
            <el-input type="text" placeholder="请输入名称，30字以内" v-model="addData.title"></el-input>
          </el-form-item>
          <el-form-item label="图文摘要">
            <el-input
              type="textarea"
              maxlength="150"
              show-word-limit
              v-model="addData.abstract_info"
              placeholder="请输入介绍，150字以"
            ></el-input>
          </el-form-item>
          <el-form-item label="正文详情">
            <myEditor v-model="addData.content"></myEditor>
          </el-form-item>
          <!--图片 上传组件 -->
          <el-form-item label="图文封面" prop="image_path1">
            <img-include v-model="imgs" :max="3" :cropper="cropper"></img-include>
          </el-form-item>
          <!-- 标签类型 多选框 -->
          <el-form-item label="类型" prop="LabelTyle">
            <el-select placeholder="请选择类型" v-model="addData.category_id">
              <el-option
                v-for="item in multipleSelection"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <br />
            <el-button style="margin-top: 20px;" @click="outerVisible = true">类型管理</el-button>
            <el-dialog title="标签管理" :visible.sync="outerVisible" width="40%">
              <el-button type="primary" @click="innerVisible = true">添加</el-button>
              <el-table
                :data="categoryData"
                tooltip-effect="dark"
                style="width: 100%"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column property="name" label="类型"></el-table-column>
                <el-table-column label="操作" width="150px">
                  <template slot-scope="scope">
                    <el-button
                      type="info"
                      style="color: #333"
                      icon="el-icon-edit"
                      @click="editbtn(scope.row)"
                    ></el-button>
                    <el-button
                      type="info"
                      style="color: #333"
                      icon="el-icon-delete"
                      @click="delbtn(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div slot="footer" class="dialog-footer">
                <el-button @click="save_category(false)">关 闭</el-button>
                <el-button @click="save_category(true)">保 存</el-button>
              </div>

              <el-dialog
                width="40%"
                title="添加类型"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :visible.sync="innerVisible"
                @close="handDialogClose()"
                append-to-body
              >
                <el-form :model="form_category">
                  <el-form-item label="类型名称">
                    <el-input v-model="form_category.name" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="submit__category">确 定</el-button>
                  <el-button @click="innerVisible = false">取 消</el-button>
                </div>
              </el-dialog>
            </el-dialog>
          </el-form-item>
          <el-form-item label="三方链接">
            <el-input placeholder="请输入第三方地址" v-model="addData.source_url"></el-input>
          </el-form-item>
          <h3 class="addAnnouncement_header">发布设置</h3>
          <el-form-item label="发布位置" prop="position">
            <el-select placeholder="请选择" v-model="addData.position">
              <el-option label="置顶" value="1"></el-option>
              <el-option label="默认" value="99"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" prop="publish_status">
            <el-radio-group v-model="addData.publish_status">
              <el-radio style="line-height:2.8;" label="1">立即发布</el-radio> <br />
              <el-radio style="line-height:2.8;" label="0">草稿， 暂不发布</el-radio> <br />
              <el-radio style="line-height:2.8;" label="2">定时发布</el-radio> <br />
            </el-radio-group>
            <br />
            <el-date-picker
              style="margin-top: 10px;"
              v-model="addData.publish_time"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-right: 10px" type="primary" @click="saveBtn()">提交</el-button>
            <router-link :to="{ name: 'saas/helpManage' }">
              <el-button>取消</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import settings from '@/settings';
import ImgInclude from '@/components/CropImgInclue';

export default {
  name: 'imagetextAdd',
  components: {
    ImgInclude,
  },
  watch: {
    imgs(n, o) {
      // console.log(n)
      // console.log(o)
    },
  },
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      form_category: {
        name: '',
        type: 2,
      },
      checkboxs: '',
      multipleSelection: [],
      //图片上传
      imgs: {},
      cropper: [
        {
          name: 'Banner封面',
          ratio_x: 280,
          ratio_y: 148,
          ratio: 1.89,
          desc: '你的用户将在资讯频道顶部banner，看到此封面。',
        },
        {
          name: '普通封面',
          ratio_x: 280,
          ratio_y: 183,
          ratio: 1.53,
          desc: '你的用户将在资讯列表里，看到此封面。',
        },
      ],
      //子组件的遮罩层显示
      showModal: false,
      //增加
      addData: {
        title: '',
        abstract_info: '',
        content: '',
        category_id: '',
        image_path1: '',
        image_path2: '',
        image_path3: '',
        position: '',
        publish_time: '',
        publish_status: '',
        source_url: '',
      },
      mediaId: [],
      routerId: null,
      //分组
      categoryData: [],
      showVoicePage: false,
      rules: {
        // title: [
        //   { required: true, message: '请输入标题', trigger: 'blur' },
        // ],
        // image_path1: [
        //   { required: true, message: '请选择图片', trigger: 'change' }
        // ],
        // publish_status: [
        //   { required: true, message: '请选择发布时间', trigger: 'blur' }
        // ],
        // position: [
        //   { required: true, message: '请选择发布位置', trigger: 'blur' }
        // ],
      },
    };
  },
  mounted() {},
  created() {
    // this.getNewsGroupList();
    this.getcategoryList();
    this.routerId = this.$route.params.id;
    if (this.routerId) {
      this.getinfo(this.routerId);
    }
  },
  methods: {
    // 选中类型
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //判断图片
    imgData() {
      if (this.imgs['ratio1.89'] != undefined) {
        let i = this.imgs['ratio1.89'].length;
        if (i == 1) {
          this.addData.image_path1 = this.imgs['ratio1.89'][0] + ',' + this.imgs['ratio1.53'][0];
        }
        if (i == 2) {
          this.addData.image_path1 = this.imgs['ratio1.89'][0] + ',' + this.imgs['ratio1.53'][0];
          this.addData.image_path2 = this.imgs['ratio1.89'][1] + ',' + this.imgs['ratio1.53'][1];
        }
        if (i == 3) {
          this.addData.image_path1 = this.imgs['ratio1.89'][0] + ',' + this.imgs['ratio1.53'][0];
          this.addData.image_path2 = this.imgs['ratio1.89'][1] + ',' + this.imgs['ratio1.53'][1];
          this.addData.image_path3 = this.imgs['ratio1.89'][2] + ',' + this.imgs['ratio1.53'][2];
        }
      }
    },
    saveBtn() {
      this.imgData();
      if (!this.routerId) {
        this.addBtn('/setting/helpAdd');
      } else {
        this.addData.id = this.routerId;
        this.addBtn('/setting/helpEdit');
      }
    },
    addBtn(url) {
      this.$refs['addData'].validate(valid => {
        console.log(this.addData);
        let data = {};
        for (const key in this.addData) {
          if (this.addData[key]) {
            data[key] = this.addData[key];
          }
        }
        this.addData;
        if (valid) {
          this.$ajax
            .post(url, data)
            .then(res => {
              console.log(res);
              if (res.resCode == 200) {
                this.$router.push({ name: 'saas/helpManage' });
                this.message('成功', 'success');
              } else {
                this.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err));
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //获取详情
    getinfo(id) {
      this.$ajax
        .get('/setting/getAnnounce', {
          params: { id: id },
        })
        .then(res => {
          console.log(res);
          if (res.resCode == 200) {
            console.log(res);

            this.addData = {
              id: res.resObject.id,
              title: res.resObject.title,
              abstract_info: res.resObject.title,
              content: res.resObject.content,
              category_id: res.resObject.category_id,
              image_path1: res.resObject.image_path1,
              image_path2: res.resObject.image_path2,
              image_path3: res.resObject.image_path3,
              position: res.resObject.position,
              publish_time: res.resObject.publish_time,
              publish_status: res.resObject.publish_status,
              source_url: res.resObject.source_url,
            };
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },

    //查询分类列表
    getcategoryList() {
      this.$ajax
        .get('/setting/categoryList', {
          params: {
            type: 2,
          },
        })
        .then(res => {
          if (res.resCode == 200) {
            this.categoryData = res.resObject.index;
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    // 添加分类
    submit__category() {
      let url = this.form_category.id ? '/setting/categoryEdit' : '/setting/categoryAdd';
      if (!this.form_category.name) {
        return;
      }
      this.$ajax
        .post(url, this.form_category)
        .then(res => {
          if (res.resCode == 200) {
            this.innerVisible = false;
            this.getcategoryList();
            this.message('成功', 'success');
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    // 编辑分类
    editbtn(val) {
      this.form_category.id = val.id;
      this.form_category.name = val.name;
      this.form_category.type = val.type;
      this.innerVisible = true;
    },
    // 删除分类
    delbtn(val) {
      this.$confirm('确认删除分类？')
        .then(_ => {
          this.$ajax
            .post('/setting/ categoryDel', { id: val.id })
            .then(res => {
              if (res.resCode == 200) {
                this.getcategoryList();
                this.message('成功', 'success');
              } else {
                this.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err));
        })
        .catch(_ => {
          this.message('已取消删除', 'info');
        });
    },
    // 保存选中分类
    save_category(val) {
      console.log(this.multipleSelection);
      if (!val) {
        (this.multipleSelection = []), this.$refs.multipleTable.clearSelection();
      }
      this.outerVisible = false;
    },
    // 关闭对话框触发
    handDialogClose() {
      this.form_category = {
        name: '',
        type: 2,
      };
    },
    //设置imgs
    setImgs(obj) {
      if (obj.image_path1) {
        this.imgs = {
          'ratio1.89': [obj.image_path1.split(',')[0]],
          'ratio1.53': [obj.image_path1.split(',')[1]],
        };
      }
      if (obj.image_path2) {
        this.imgs = {
          'ratio1.89': [obj.image_path1.split(',')[0], obj.image_path2.split(',')[0]],
          'ratio1.53': [obj.image_path1.split(',')[1], obj.image_path2.split(',')[1]],
        };
      }
      if (obj.image_path3) {
        this.imgs = {
          'ratio1.89': [obj.image_path1.split(',')[0], obj.image_path2.split(',')[0], obj.image_path3.split(',')[0]],
          'ratio1.53': [obj.image_path1.split(',')[1], obj.image_path2.split(',')[1], obj.image_path3.split(',')[1]],
        };
      }
    },
    //错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type,
        duration: 5 * 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.addHelp {
  @extend %fill;
  padding: 10px 15%;
}

/deep/ .el-form-item .el-form-item {
  margin-bottom: 22px;
}

/deep/ .el-dialog.imagetextadd > .el-dialog__body {
  padding: 0;
}
.addAnnouncement_header {
  margin-left: 30px;
}
.avatar-uploader {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}

.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
