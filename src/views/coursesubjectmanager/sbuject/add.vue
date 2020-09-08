<template>
  <div class="course-package-wrap">
    <el-row>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <el-form
            ref="form"
            label-width="95px"
            style="padding-top: 16px; background-color: #ffffff"
          >
            <el-form-item label="专题标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入名称，30字以内"></el-input>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input type="textarea" v-model="form.summary" placeholder="请输入介绍，150字以内"></el-input>
            </el-form-item>
            <el-form-item label="介绍详情">
              <div style="width: 100%;overflow: scroll">
                <div style="min-width: 700px">
                  <myEditor refs="name1" v-model="form.content"></myEditor>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="选择分类" required>
              <el-select
                clearable
                v-model="form.firstCategoryId"
                placeholder="请选择一级分类"
                style="width: 160px;"
                @change="searchSecondMenu"
              >
                <el-option
                  v-for="item in oneMenus"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                clearable
                v-model="form.secondCategoryId"
                placeholder="请选择二级分类"
                style="width: 160px;"
              >
                <el-option
                  v-for="item in twoMenus"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="访问等级">
              <el-select clearable v-model="form.accessLevel" placeholder="请选择用户最低访问等级">
                <el-option
                  v-for="obj in levelList"
                  :key="obj.id"
                  :label="obj.levelName"
                  :value="obj.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!--图片 上传组件 -->
            <el-form-item label="图文封面" style="overflow: scroll">
              <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span>发布设置</span>
          </div>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="95px"
            style="padding-top: 16px; background-color: #ffffff"
          >
            <el-form-item label="发布位置">
              <el-select clearable v-model="form.columnId" placeholder="栏目">
                <el-option
                  v-for="item in columnList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="form.columnSort" placeholder="排序位置">
                <el-option label="默认" :value="7"></el-option>
                <el-option label="置顶" :value="1"></el-option>
                <el-option label="banner1" :value="2"></el-option>
                <el-option label="banner2" :value="3"></el-option>
                <el-option label="banner3" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-radio-group v-model="form.releaseType">
                <el-radio :label="1">立即发布</el-radio>
                <el-radio :label="2">草稿，暂不发布</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button @click="onCancel()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card select-course" style="margin-left: 20px">
          <div slot="header" class="clearfix">
            <span>选择课程</span>
          </div>
          <div style="height:156px; width: 100%;position: relative; background-color: #eee;">
            <img
              v-if="!!imgs['ratio1.89'][0]"
              style="width: 100%;height: 100%;display: block;margin: 0;"
              :src="imgs['ratio1.89'][0]"
            />
            <!-- <h3 class="picTitle">{{form.title}}</h3> -->

            <!-- <p> -->
            <!-- {{ addData.content === '' ? '专题介绍，仅150字以内哦' : addData.content }} -->
            <!-- </p> -->
          </div>
          <p style="margin-bottom: 10px">{{ form.title === '' ? '专题标题' : form.title }}</p>
          <div style="font-size: 14px;padding: 8px 0">{{form.summary}}</div>
          <div v-for="(obj, i) in courseList" :key="obj.id" class="courseOperate">
            <div class="courseInfo">
              <img :src="obj.indexPic" />
              <div>{{obj.courseTitle}}</div>
            </div>
            <div class="dealIcon">
              <i class="el-icon-edit" @click="editCourseList(obj, i)"></i>
              <i class="el-icon-error" @click="delCourseList(i)"></i>
              <i class="el-icon-upload2" @click="changeSort(i, 1)"></i>
              <i class="el-icon-download" @click="changeSort(i, 2)"></i>
            </div>
          </div>
          <el-button style="width: 100%;margin-top: 8px" type="primary" @click="changeImgText">添加课程</el-button>
        </el-card>
      </el-col>
    </el-row>
    <!--图文modal-->
    <el-dialog
      custom-class="imagetextadd"
      title="选择课程"
      :visible.sync="showImgText"
      width="94%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <bind-course
        :getId="false"
        :modal="showModal"
        @handleCheckedCitiesChange="handleCheckedCitiesChange"
      ></bind-course>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData">确 定</el-button>
        <!--<el-button @click="getMediaId">关 闭</el-button>-->
      </div>
    </el-dialog>
    <!--图文modal-->
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue';
import bindCourse from './vue/bind-course';
import assign from 'object-assign';
import {
  addCoursePackage,
  editCoursePackage,
  memberLevel,
  bindCourseData,
  coursePackageDetail,
  columnList,
  searchCategoryList,
  findCategoryId,
} from '../sever';

export default {
  data() {
    return {
      showImgText: false,
      showModal: false,
      form: {
        accessLevel: '',
        columnId: '',
        columnSort: '',
        content: '',
        createTime: '',
        releaseTime: '',
        releaseType: 1,
        unitParentId: '',
        secondCategoryId: '',
        firstCategoryId: '',
        status: '0',
        summary: '',
        title: '',
        unitId: '',
      },
      imgs: {
        'ratio1.53': [],
        'ratio1.89': [],
      },
      cropper: [
        {
          name: '普通封面',
          ratio_x: 106,
          ratio_y: 137,
          ratio: 1.53,
          desc: '你的用户将在课程频道首页列表缩略图，看到此封面。',
        },
        {
          name: 'Banner封面',
          ratio_x: 332.5,
          ratio_y: 168.9,
          ratio: 1.89,
          desc: '你的用户将在banner和详情页中看到到此封面。',
        },
      ],
      rules: {
        title: [{ required: true, message: '课程专题标题', trigger: 'blur' }],
        firstCategoryId: [{ required: true, message: '一级分类', trigger: 'blur' }],
        secondCategoryId: [{ required: true, message: '二级分类', trigger: 'blur' }],
        cover: [{ required: true, message: '图文封面', trigger: 'blur' }],
        columnId: [{ required: true, message: '发布位置', trigger: 'blur' }],
        columnSort: [{ required: true, message: '发布时间', trigger: 'blur' }],
      },
      concatCouse: {
        isEdit: false,
        index: 0,
        selectCache: [],
      },
      courseList: [],
      columnList: [],
      oneMenus: [],
      twoMenus: [],
      levelList: [],
    };
  },
  components: {
    ImgInclude,
    bindCourse,
  },
  mounted() {
    if (this.$route.params.id) {
      this.init(this.$route.params.id);
    }
    this.getColumnList();
    this.getLevel();
    this.searchFirstMenu();
  },
  methods: {
    init(id) {
      const that = this;
      coursePackageDetail({ id }).then(res => {
        if (res.resCode == 200) {
          const { resObject } = res;
          this.form = resObject || {};
          if (resObject.firstCategoryId) this.searchSecondMenu(resObject.firstCategoryId);
          // this.form.cover = resObject.cover ?  { 'ratio1.53' : [res.resObject.cover] } : { 'ratio1.53': [] };
          this.imgs['ratio1.53'] = [res.resObject.indexPic.split(',')[0]];
          this.imgs['ratio1.89'] = [res.resObject.banner.split(',')[0]];
          this.courseList = resObject.courseList || [];
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    searchFirstMenu(num) {
      // 获取一级菜单
      const that = this;
      searchCategoryList({ pageSize: 0 }).then(res => {
        if (res.resCode == 200) {
          const arr = (res.resObject.list || []).filter(v => !v.catParentId);
          that.oneMenus = arr;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    searchSecondMenu(id) {
      // 获取二级菜单
      this.twoMenus = [];
      this.form.secondCategoryId = '';
      const that = this;
      findCategoryId({ unitParentId: id }).then(res => {
        if (res.resCode == 200) {
          that.twoMenus = res.resObject || [];
        } else {
          that.$message.error(res.message);
        }
      });
    },
    getColumnList() {
      columnList({ isActive: 1, type: 0 }).then(res => {
        if (res.resCode == 200) {
          this.columnList = res.resObject.list || [];
        }
      });
    },
    getLevel() {
      memberLevel().then(res => {
        if (res.resCode == 200) {
          this.levelList = res.resObject || [];
        }
      });
    },
    onSubmit() {
      if (this.form.id) {
        this.editCourse();
      } else {
        this.addCourse();
      }
    },
    addCourse() {
      const that = this;
      const param = assign({}, this.form, {
        indexPic: `${this.imgs['ratio1.53'][0]}`,
        banner: `${this.imgs['ratio1.89'][0]}`,
      });
      addCoursePackage(param).then(res => {
        if (res.resCode == 200) {
          this.$message.success('新增成功');
          const packageId = res.resObject;
          that.bindCourse(packageId);
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    bindCourse(packageId) {
      if (!this.courseList.length) {
        this.$router.push('/coursesubjectmanager/sbuject');
        return false;
      }
      bindCourseData({ packageId, courseIdList: this.courseList.map(v => v.id) }).then(res => {
        if (res.resCode == 200) {
          // this.$message.success('课程专题添加课程成功');
        } else {
          that.$message(res.message, 'error');
        }
        this.$router.push('/coursesubjectmanager/sbuject');
      });
    },
    editCourse() {
      const that = this;
      const param = assign({}, this.form, {
        indexPic: `${this.imgs['ratio1.53'][0]}`,
        banner: `${this.imgs['ratio1.89'][0]}`,
      });
      editCoursePackage(param).then(res => {
        if (res.resCode == 200) {
          this.$message.success('编辑成功');
          that.bindCourse(param.id);
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    getPicUrl(obj) {
      return Object.keys(obj).reduce((p, c) => obj[c][0] || '', '');
    },
    handleCheckedCitiesChange(val) {
      this.concatCouse.selectCache = val;
    },
    setData() {
      const { courseList, concatCouse } = this;
      if (!concatCouse.selectCache || !concatCouse.selectCache.length) return false;
      if (this.concatCouse.isEdit) {
        this.courseList = [
          ...courseList.slice(0, concatCouse.index),
          ...concatCouse.selectCache,
          ...courseList.slice(concatCouse.index + 1),
        ];
      } else {
        this.courseList = [...courseList, ...concatCouse.selectCache];
      }
      this.showImgText = false;
    },
    editCourseList(obj, i) {
      this.showImgText = true;
      this.concatCouse = { isEdit: true, index: i, selectCache: [] };
    },
    delCourseList(i) {
      const { courseList } = this;
      this.courseList = [...courseList.slice(0, i), ...courseList.slice(i + 1)];
    },
    // 改变课程顺序 1上移动，2 下移动
    changeSort(i, num) {
      const len = this.courseList.length - 1;
      if (len <= 0) return;
      if (num === 1 && i === 0) return;
      if (num === 2 && i === len) return;
      if (num === 1) {
        const arr = [...this.courseList.slice(0, i), ...this.courseList.slice(i + 1)];
        arr.splice(i - 1, 0, this.courseList[i]);
        this.courseList = [...arr];
      }
      if (num === 2) {
        const arr = [...this.courseList.slice(0, i), ...this.courseList.slice(i + 1)];
        arr.splice(i + 1, 0, this.courseList[i]);
        this.courseList = [...arr];
      }
    },
    changeImgText() {
      this.showImgText = true;
      this.concatCouse = {
        isEdit: false,
        index: 0,
        selectCache: [],
      };
    },
    changeValue(key, val) {
      this[key] = val;
    },
    onCancel() {
      this.$router.back(-1)
    }
  },
};
</script>

<style lang="scss" scoped>
.course-package-wrap {
  padding: 10px 10%;
  .courseOperate {
    position: relative;
    margin-top: 8px;
    width: 100%;
    .courseInfo {
      display: flex;
      width: 100%;
      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
      }
      div {
        flex: 1;
      }
    }
    .dealIcon {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.8);
      text-align: center;
      line-height: 100%;
      i {
        margin-right: 18px;
        font-size: 25px;
        margin-top: 6px;
        cursor: pointer;
      }
    }
  }
}
.select-course >>> div {
  padding: 0;
}
/deep/ .el-form-item .el-form-item {
  margin-bottom: 22px;
}

/deep/ .el-dialog.imagetextadd > .el-dialog__body {
  padding: 0;
}
</style>
<style>
.courseOperate:hover > div:nth-child(2) {
  display: block !important;
}
.picTitle {
  position: absolute;
  top: 20px;
  text-align: center;
  width: 100%;
  color: #fff;
}
</style>
