<template>
  <div class="networkadd">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="13" style="padding-right:110px">
          <el-form :model="form" label-width="80px" ref="createWayForm">
            <div class="create-way-title">基础信息</div>
            <el-form-item label="*线路标题" style="margin-top: 20px">
              <el-input placeholder="请输入名称，30字以内" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="副标题">
              <el-input placeholder="请输入名称，45字以内" v-model="form.subTitle"></el-input>
            </el-form-item>
            <el-form-item label="线路介绍">
              <el-input type="textarea" placeholder="请输入介绍，150字以内" v-model="form.introduction"></el-input>
            </el-form-item>
            <el-form-item label="*线路封面">
              <img-include v-model="form.cover" :max="1" :cropper="cropper"></img-include>
            </el-form-item>
            <div class="create-way-title">发布设置</div>
            <el-form-item label="*发布位置" style="margin-top: 20px">
              <el-select v-model="form.releaseLoc" placeholder="排序位置">
                <el-option label="置顶" :value="2"></el-option>
                <el-option label="默认" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签类型">
              <el-select v-model="form.tag" placeholder="请选择标签">
                <el-option
                  v-for="item in tagTypelist"
                  :label="item.name"
                  :key="item.id"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div style="padding-bottom: 10px">
                <el-button size="mini" @click="TagAdd.tagManageInfo = true">标签管理</el-button>
              </div>
              <el-dialog
                :visible.sync="TagAdd.tagManageInfo"
                title="标签管理"
                class="tag-dialog"
                width="430px"
              >
                <div>
                  <el-button size="mini" @click="TagAdd.addTagDialog = true">添加标签</el-button>
                </div>
                <el-dialog
                  class="tag-dialog-inner"
                  :visible.sync="TagAdd.addTagDialog"
                  title="添加标签"
                  width="380px"
                  append-to-body
                >
                  <el-input placeholder="请输入内容" v-model="TagAdd.tagIn">
                    <template slot="prepend">添加标签</template>
                  </el-input>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="TagAdd.addTagDialog = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="handleAddTag" size="mini">确定</el-button>
                  </div>
                </el-dialog>
                <el-table :data="tagTypelist" style="width: 95%;margin:auto" max-height="200">
                  <el-table-column type="index" label="序号" width="60"></el-table-column>
                  <el-table-column label="标签" prop="name"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)"
                        icon="el-icon-edit"
                      ></el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.$index, scope.row)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="TagAdd.tagManageInfo = false" size="mini">取 消</el-button>
                  <el-button type="primary" @click="TagAdd.tagManageInfo = false" size="mini">确定</el-button>
                </div>
              </el-dialog>
            </el-form-item>
            <el-form-item label="*发布时间">
              <el-radio-group v-model="form.status">
                <div style="margin-top:10px;">
                  <el-radio :label="3">立即发布</el-radio>
                </div>
                <div style="margin-top:10px;">
                  <el-radio :label="2">草稿，暂不发布</el-radio>
                </div>
                <div style="margin-top:10px;">
                  <el-radio :label="4">定时发布</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item label>
              <el-col :span="11">
                <el-date-picker
                  type="datetime"
                  placeholder="选择日期时间"
                  v-model="form.createTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit()">提交</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!--添加网点-->

        <el-col :span="11" style="padding-left:80px;border-left: 1px solid #DCDFE6">
          <div class="branch">
            <div class="branch-title">途径网点</div>
            <div class="branch-content">
              <div class="surface-img-wrap">
                <div v-if="form.map.materialList.length > 0">
                  <img :src="form.map.materialList[0].pic" alt width="324px" />
                  <div>{{ form.map.materialList[0].title }}</div>
                </div>
              </div>
              <div class="branch-item" v-for="(item, index) in form.map.materialList" :key="index">
                <div class="branch-item-box">
                  <div class="surface-img-item">
                    <img :src="item.pic" alt width="70" height="60" />
                  </div>
                  <div style="height: 60px;width: 200px">
                    <div style="height: 50px">{{ item.title }}</div>
                    <div style="display: flex;justify-content: space-between;font-size: 13px">
                      <span>标签</span>
                      <span>{{ item.time }}</span>
                    </div>
                  </div>
                </div>
                <div class="branch-handle-box">
                  <i class="el-icon-error" @click="opratemap(0, index)"></i>
                  <i class="el-icon-upload2" @click="opratemap(1, index)"></i>
                  <i class="el-icon-download" @click="opratemap(2, index)"></i>
                </div>
              </div>
              <el-button @click="addBranch" style="width: 100%">添加网点</el-button>
              <el-dialog :visible.sync="form.map.ismapshow" title="选择网点">
                <el-form class="el-row">
                  <el-form-item>
                    <el-col :span="8">
                      <area-cascader
                        style="line-height: 16px"
                        :level="0"
                        v-model="form.map.areaselected"
                        :data="pcaa"
                      ></area-cascader>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label-width="55px" label="类型">
                        <el-select v-model="form.map.type" placeholder="请选择网点类型" style="width:100%">
                          <el-option label="大师" :value="31"></el-option>
                          <el-option label="店铺场馆" :value="32"></el-option>
                          <el-option label="艺术场馆" :value="33"></el-option>
                          <el-option label="艺术大师" :value="34"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" style="display: flex">
                      <el-input placeholder="输入关键字" style="width: 150px" v-model="form.map.title"></el-input>
                      <el-button type="primary" @click="addBranch">搜索</el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
                <el-table
                  ref="materialList"
                  :data="materialList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column label="序号" type="index" width="120">
                    <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
                  </el-table-column>
                  <el-table-column prop="venuePic" label="封面" width="120">
                    <template slot-scope="scope">
                      <el-avatar
                        class="headimg"
                        shape="square"
                        size="medium"
                        :src="scope.row.coverImage && scope.row.coverImage.length?scope.row.coverImage[0].url:''"
                      ></el-avatar>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="address" label="地址" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.address }}</template>
                  </el-table-column>
                  <el-table-column prop="contactPhone" label="电话" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="typeName" label="类型" show-overflow-tooltip></el-table-column>
                </el-table>
                <div style="text-align: right;margin-top: 20px">
                  <Pagination
                    v-if="materialList.length != 0"
                    :pageSize="form.map.pageSize"
                    :pageSizes="form.map.pageSizes"
                    :total="form.map.totalCount"
                    @currentChange="currentChange"
                    @sizeChange="sizeChange"
                  ></Pagination>
                </div>
                <div style="text-align: center">
                  <el-button type="primary" @click="toggleSelection(1)">确认</el-button>
                  <el-button @click="toggleSelection(2)">取消</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ImgInclude from '@/components/CropImgInclue';
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
import Pagination from '@/components/Pagination';
export default {
  components: {
    ImgInclude,
    Pagination,
  },
  data() {
    return {
      id: this.$route.params.id,
      pca: pca,
      pcaa: pcaa,
      cropper: [
        {
          name: '途径网点封面',
          ratio: 1,
          desc: '',
        },
      ],
      TagAdd: {
        tagManageInfo: false,
        addTagDialog: false,
        tagIn: '',
        id: undefined,
        unitId: undefined,
        sort: undefined,
      },
      form: {
        tag: '',
        title: '',
        subTitle: '',
        releaseLoc: '',
        createTime: '',
        status: '',
        introduction: '',
        cover: {},
        map: {
          ismapshow: false,
          materialList: [],
          materialid: [],
          totalCount: 0,
          curPage: 1,
          pageSize: 5,
          pageSizes: [5, 10, 15],
          title: '',
          provinceId: '',
          cityId: '',
          areaId: '',
          type: 33,
          areaselected: [],
        },
      },
      tagTypelist: [],
      materialList: [], // 网点数据
    };
  },
  mounted() {},
  created() {
    this.$route.meta.title = this.id > 0 ? '路线编辑' : '添加路线';
    this.load();
    this.labellist();
  },
  methods: {
    onSubmit() {
      console.log(this.form.map.materialList);
      if (this.form.title.length == 0) {
        this.message('线路标题不能为空', 'info');
      } else if (this.form.title.length > 30) {
        this.message('线路标题字数不能超过30字', 'info');
      } else if (this.form.subTitle.length > 45) {
        this.message('副标题字数不能超过45字', 'info');
      } else if (this.form.introduction.length > 150) {
        this.message('线路介绍不能超过150字', 'info');
      } else if (this.form.cover.ratio1[0] == null) {
        this.message('请添加图片', 'error');
      } else if (this.form.releaseLoc == '') {
        this.message('请选择发布位置', 'info');
      } else if (this.form.status == '') {
        this.message('请选择发布状态', 'info');
      } else if (this.form.map.materialList.length == 0) {
        this.message('请添加网点', 'info');
      } else {
        this.$ajax
          .post('/gonglue/saveLx', {
            id: this.id == 'null' ? undefined : this.id,
            title: this.form.title,
            subTitle: this.form.subTitle,
            introduction: this.form.introduction,
            cover: this.form.cover.ratio1[0],
            tag: this.form.tag,
            releaseLoc: this.form.releaseLoc,
            status: this.form.status,
            tuJingList: this.form.map.materialList,
          })
          .then(res => {
            if (res.resCode == 200) {
              this.message('保存成功', 'success');
              this.$router.push({
                name: 'luxian',
              });
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err));
      }
    },
    load() {
      if (this.id != 'null') {
        this.$ajax
          .get('/app/gonglue/detailLx', {
            params: {
              id: this.id,
            },
          })
          .then(res => {
            if (res.resCode == 200) {
              var data = res.resObject;
              this.form.tag = data.tag;
              this.form.title = data.title;
              this.form.subTitle = data.subTitle;
              this.form.introduction = data.introduction;
              this.form.releaseLoc = data.releaseLoc;
              this.form.cover = { ratio1: [data.cover] };
              this.form.createTime = data.createTime;
              this.form.status = data.status;
              data.tuJingList.forEach(v => {
                v.pic = v.store.coverImage[0].url;
                v.title = v.store.name;
              });

              this.form.map.materialList = data.tuJingList;
            }
          })
          .catch(err => console.log(err));
      }
    },

    labellist() {
      this.$ajax
        .get('/gonglue/listLxTag', {})
        .then(res => {
          if (res.resCode == 200) {
            this.tagTypelist = res.resObject;
          }
        })
        .catch(err => console.log(err));
    },
    addBranch() {
      this.form.map.ismapshow = true;
      if (this.form.map.areaselected.length > 1) {
        this.form.map.provinceId = this.form.map.areaselected[0];
        this.form.map.cityId = this.form.map.areaselected[1];
        this.form.map.areaId = this.form.map.areaselected[2] == null ? '' : this.form.map.areaselected[2];
      }
      const params = {
        name: this.form.map.title,
        pageNum: this.form.map.curPage,
        pageSize: this.form.map.pageSize,
        provinceId: this.form.map.provinceId,
        cityId: this.form.map.cityId,
        areaId: this.form.map.areaId,
        unitType: this.form.map.type,
      };
      this.$ajax
        .get('/storemanager/store/list', { params })
        .then(res => {
          if (res.resCode === 200) {
            this.form.map.totalCount = res.resObject.totalCount;
            this.materialList = res.resObject.list;
          } else {
            this.message(res.message, 'error');
          }
        })
        .catch(err => console.log(err));
    },
    toggleSelection(type) {
      // 确认网点
      if (type == 2) {
        this.form.map = {
          ismapshow: false,
          materialList: [],
          totalCount: 0,
          curPage: 1,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          title: '',
          provinceId: '',
          cityId: '',
          areaId: '',
          type: 33,
          areaselected: [],
        };
      } else {
        if (this.form.map.materialList.length == 0) {
          this.message('请选择网点', 'info');
        } else {
          console.log(this.form.map.materialList.length == 0);
          this.form.map.ismapshow = false;
        }
      }
    },
    opratemap(type, index) {
      switch (type) {
        case 0: // 删除
          this.form.map.materialList.splice(index, 1);
          this.form.map.materialid.splice(index, 1);
          break;
        case 1: // 向上
          if (index != 0) {
            this.form.map.materialList[index] = this.form.map.materialList.splice(
              index - 1,
              1,
              this.form.map.materialList[index]
            )[0];
            this.form.map.materialid[index] = this.form.map.materialid.splice(
              index - 1,
              1,
              this.form.map.materialid[index]
            )[0];
          } else {
            this.form.map.materialList.push(this.form.map.materialList.shift());
            this.form.map.materialid.push(this.form.map.materialid.shift());
          }
          break;
        case 2: // 向下
          if (index != this.form.map.materialList.length - 1) {
            this.form.map.materialList[index] = this.form.map.materialList.splice(
              index + 1,
              1,
              this.form.map.materialList[index]
            )[0];
            this.form.map.materialid[index] = this.form.map.materialid.splice(
              index + 1,
              1,
              this.form.map.materialid[index]
            )[0];
          } else {
            this.form.map.materialList.unshift(this.form.map.materialList.splice(index, 1)[0]);
            this.form.map.materialid.unshift(this.form.map.materialid.splice(index, 1)[0]);
          }
          break;
      }
    },
    // 分页
    currentChange(val) {
      this.form.map.curPage = val;
      this.addBranch();
    },
    sizeChange(val) {
      this.form.map.pageSize = val;
      this.addBranch();
    },
    // 全选
    handleSelectionChange(val) {
      for (const i of val) {
        var s = {
          id: this.id == 'null' ? undefined : i.id,
          pic: i.coverImage && i.coverImage.length ? i.coverImage[0].url : '#',
          time: this.$moment(i.createTime).format('YYYY-MM-DD HH:mm:ss'),
          title: i.name,
          storeId: i.id,
          store: i,
        };

        var ids = { id: i.id };
        if (JSON.stringify(this.form.map.materialList).indexOf(JSON.stringify(s)) == -1) { this.form.map.materialList.push(s); }
        if (JSON.stringify(this.form.map.materialid).indexOf(JSON.stringify(ids)) == -1) {
          this.form.map.materialid.push(ids);
        }
      }
    },
    handleAddTag() {
      this.$ajax
        .post('/gonglue/saveLxTag', {
          name: this.TagAdd.tagIn,
          unitId: this.TagAdd.unitId || 0,
          id: this.TagAdd.id,
          sort: this.TagAdd.sort,
        })
        .then(res => {
          if (res.resCode == 200) {
            this.message('保存成功', 'success');
            this.TagAdd.addTagDialog = false;
            this.labellist();
          }
        })
        .catch(error => {});
    },
    handleEdit(index, row) {
      this.TagAdd.addTagDialog = true;
      this.TagAdd.tagIn = row.name;
      this.TagAdd.id = row.id;
      this.TagAdd.unitId = row.unitId;
      this.TagAdd.sort = row.sort;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$ajax
          .post('/gonglue/deleteLxTag', row)
          .then(res => {
            if (res.resCode == 200) {
              this.message('删除成功', 'success');
              this.labellist();
            }
          })
          .catch(error => {});
      });
    },
    saveImport() {
      // 确定导入
    },

    onCancel() {},
    saveImport() {},
    message(message, type) {
      // 消息通知
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
.networkadd {
  padding: 10px 5%;

  .create-way-title {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    color: #303133;
  }

  .branch {
    width: 324px;
    text-align: left;
    .branch-title {
      padding: 18px 20px;
      border-bottom: 1px solid #e6ebf5;
      color: #303133;
      font-size: 18px;
      font-weight: bold;
    }

    .branch-content {
      width: 324px;
      border: 1px solid #e3e3e3;
    }

    .surface-img-wrap {
      width: 100%;
      height: 132px;
      background: #ddd;
      overflow: hidden;
      & > div {
        @extend .surface-img-wrap;
        position: relative;
        div {
          width: 100%;
          height: 100%;
          position: absolute;
          color: #fff;
          left: 0px;
          top: 0px;
          font-size: 30px;
          text-align: center;
          line-height: 132px;
        }
      }
    }

    .surface-img-item {
      width: 70px;
      height: 60px;
      background: #ddd;
    }

    .branch-item {
      position: relative;
      margin-top: 20px;
    }

    .branch-item-box {
      display: flex;
      justify-content: space-around;
      margin-bottom: 15px;
    }

    .branch-handle-box {
      align-items: center;
      align-content: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.6);
      display: none;
    }

    .branch-handle-box i {
      cursor: pointer;
      font-size: 25px;
      margin-left: 5px;
    }

    .branch-item:hover .branch-handle-box {
      display: flex;
    }
  }
}
/deep/.tag-dialog {
  .el-dialog__header {
    padding: 5px 20px;
    line-height: 30px;
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__footer {
    padding: 10px;
    background-color: #f5f8fb;
  }
}
</style>
