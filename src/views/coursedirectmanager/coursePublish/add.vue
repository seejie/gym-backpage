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
            :model="form"
            :rules="rules"
            label-width="95px"
            style="padding-top: 16px; background-color: #ffffff"
          >
            <el-form-item label="课程标题" prop="courseTitle">
              <el-input v-model="form.courseTitle" placeholder="请输入名称，30字以内"></el-input>
            </el-form-item>
            <el-form-item label="课程摘要">
              <el-input type="textarea" placeholder="请输入介绍，150字以内" v-model="form.courseSummary"></el-input>
            </el-form-item>
            <el-form-item label="正文详情">
              <div style="width: 100%;overflow: scroll">
                <div style="min-width: 700px">
                  <myEditor refs="name1" v-model="form.courseContent"></myEditor>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="选择分类" required>
              <el-select
                clearable
                v-model="form.firstCategoryId"
                placeholder="请选择一级分类"
                style="width: 240px; margin-right: 5px"
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
                style="width: 240px;"
              >
                <el-option
                  v-for="item in twoMenus"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用设定">
              <el-input
                type="number"
                style="width: 240px; margin-right: 5px"
                v-model="form.currentPrice"
                placeholder="请输入现价，不填则前台不显示"
              ></el-input>
              <el-input
                type="number"
                style="width: 240px"
                v-model="form.orginalPrice"
                placeholder="请输入原价，不填则前台不显示"
              ></el-input>
            </el-form-item>
            <el-form-item label="访问等级">
              <el-select style="width: 240px" clearable v-model="form.accessLevel" placeholder="请选择用户最低访问等级">
                <el-option
                  v-for="obj in levelList"
                  :key="obj.id"
                  :label="obj.levelName"
                  :value="obj.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计时长">
              <el-input
                type="number"
                v-model="form.courseDuration"
                placeholder="预计完成本课程需要时间，单位小时，填数字"
              ></el-input>
            </el-form-item>
            <el-form-item label="图文封面" style="overflow: scroll">
              <img-include v-model="form.courseCover" :max="1" :cropper="cropper"></img-include>
            </el-form-item>
            <el-form-item label="讲师嘉宾" style="overflow: scroll">
              <div
                style="display: flex"
                v-for="(obj, index) in courseLecturerList"
                :key="index"
                class="teacher"
              >
                <img-include :width="200" v-model="obj.avatarUrl" :max="1" :cropper="croppers"></img-include>
                <div style="flex: 1; margin: 0 8px">
                  <el-input style="margin-bottom: 8px" v-model="obj.name" placeholder="请输入讲师名字"></el-input>
                  <el-input v-model="obj.introduce" placeholder="一句话介绍讲师"></el-input>
                </div>
                <div>
                  <i
                    style="font-size: 20px"
                    @click="addTeacher"
                    class="el-icon-circle-plus-outline"
                  ></i>
                  <i
                    style="font-size: 20px"
                    @click="delTeacher(index)"
                    class="el-icon-remove-outline"
                  ></i>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="默认学生数">
              <el-input type="number" v-model="form.defaultAmount" placeholder="请输入默认学生数，0-999"></el-input>
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
              <el-select style="width: 240px; margin-right: 5px" clearable v-model="form.columnId" placeholder="栏目">
                <el-option
                  v-for="item in columnList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select style="width: 240px;" v-model="form.columnSort" placeholder="排序位置">
                <el-option label="默认" :value="7"></el-option>
                <el-option label="置顶" :value="1"></el-option>
                <el-option label="banner1" :value="2"></el-option>
                <el-option label="banner2" :value="3"></el-option>
                <el-option label="banner3" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-radio-group v-model="form.courseReleaseType">
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
            <span>选择素材</span>
          </div>
          <div :style="{backgroundImage: 'url(' + form.courseCover['ratio1.89'][0] + ')', backgroundSize:'100%'}" style="background-color: rgb(215, 215, 215); text-align: center;padding: 20px 0;height:137px;">
            <div v-if="!form.courseCover['ratio1.89'][0]">课程封面图</div>
            <div style="background-color: rgba(215, 215, 215,0.5)">{{form.courseTitle?form.courseTitle:'课程标题'}}</div>
          </div>
          <div style="font-size: 14px;padding: 8px 0">{{form.courseSummary?form.courseSummary:'课程介绍，仅150字以内哦'}}</div>
          <div v-for="(obj, i) in materialList" :key="obj.id" class="courseOperate">
            <div class="courseInfo" v-if="obj.materialsType !== 0">
              <img :src="obj.materialsCoverUrl | filterMaterialsCoverUrl" />
              <div>{{obj.materialsTitle}}</div>
            </div>
            <div class="courseInfo" v-if="obj.materialsType === 0">
              <h3 style="margin: 0">{{obj.chapterTitle}}</h3>
            </div>
            <div class="dealIcon">
              <i class="el-icon-edit" @click="editCourseList(obj, i,obj.materialsType)"></i>
              <i class="el-icon-error" @click="delCourseList(i)"></i>
              <i class="el-icon-upload2" @click="changeSort(i, 1)"></i>
              <i class="el-icon-download" @click="changeSort(i, 2)"></i>
            </div>
          </div>
          <div class="sucaiBtn">
            <el-button style="margin-top: 8px" @click="operateMaterial(1)">从素材库添加图文素材</el-button>
            <el-button @click="operateMaterial(2)">从素材库添加视频素材</el-button>
            <el-button @click="operateMaterial(3)">从素材库添加音频素材</el-button>
            <el-button @click="operateMaterial(4)">从素材库添加文档素材</el-button>
            <el-button @click="operateMaterial(0)">添加章节名</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--图文modal-->
    <el-dialog
      custom-class="imagetextadd"
      title="选择图文素材"
      :visible="showImgText"
      width="94%"
      top="0"
      @close="closeImgText"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <image-text
        :getId="false"
        :modal="showModal"
        @handleCheckedCitiesChange="handleCheckedCitiesChange"
      ></image-text>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData(1)">确 定</el-button>
        <!--<el-button @click="getMediaId">关 闭</el-button>-->
      </div>
    </el-dialog>
    <!--图文modal-->
    <!--视频modal-->
    <el-dialog
      custom-class="imagetextadd"
      title="选择视频素材"
      :visible.sync="showVideo"
      width="94%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <videoMaterial
        :getItem="true"
        :modal="showModal"
        @handleCheckedCitiesChange="handleCheckedCitiesChange"
      ></videoMaterial>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData(2)">确 定</el-button>
        <!--<el-button @click="getMediaId">关 闭</el-button>-->
      </div>
    </el-dialog>
    <!--视频modal-->
    <!--视频modal-->
    <el-dialog
      custom-class="imagetextadd"
      title="选择音频素材"
      :visible.sync="showVoice"
      width="94%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <voiceMaterial
        :getId="false"
        :modal="showModal"
        @handleCheckedCitiesChange="handleCheckedCitiesChange"
      ></voiceMaterial>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData(3)">确 定</el-button>
        <!--<el-button @click="getMediaId">关 闭</el-button>-->
      </div>
    </el-dialog>
    <!--视频modal-->
    <!--文档modal-->
    <el-dialog
      custom-class="imagetextadd"
      title="选择文档素材"
      :visible.sync="showDocument"
      width="94%"
      top="0"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <documentMaterial
        :getItem="true"
        :modal="showModal"
        @handleCheckedCitiesChange="handleCheckedCitiesChange"
      ></documentMaterial>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData(4)">确 定</el-button>
        <!--<el-button @click="getMediaId">关 闭</el-button>-->
      </div>
    </el-dialog>
    <!--文档modal-->
    <!--章节modal-->
    <el-dialog title="创建章节名" custom-class="chapterStyle" :visible.sync="chapterAble" width="30%">
      <el-form>
        <el-form-item label="章节名称">
          <el-input v-model="chapterName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setData(0)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ImgInclude from '@/components/CropImgInclue/index.vue';
import assign from 'object-assign';
import ImageText from '../../material/imagetext';
import videoMaterial from '../../material/video';
import voiceMaterial from '../../material/voice';
import documentMaterial from '../../material/document'
import {
  courseDetail,
  findCourseCategoryId,
  searchCourseCategoryList,
  editCourse,
  addCourse,
  addMeterials,
  addChapter,
  memberLevel,
  deleteMeterials,
  columnList,
} from '../sever';

// 章节 搞得这么复杂 完全是后端和产品要求的
export default {
  name: '',
  data() {
    return {
      // showImgText: false,
      showVideo: false,
      showVoice: false,
      showDocument: false,
      // 子组件的遮罩层显示
      showModal: false,
      chapterAble: false,

      form: {
        courseTitle: '',
        columnId: '',
        firstCategoryId: '',
        secondCategoryId: '',
        courseSummary: '',
        courseContent: '',
        currentPrice: '',
        orginalPrice: '',
        accessLevel: '',
        courseDuration: '',
        courseCover: {
          'ratio1.53': [],
          'ratio1.89': [],
        },
        columnSort: '',
        defaultAmount: '',
        courseReleaseType: 1,
        courseStatus: 0,
        courseMaterialsList: []
      },
      imgs: {
        'ratio1.53': [],
        'ratio1.89': [],
      },
      cropper: [
        {
          name: '列表封面',
          ratio_x: 106,
          ratio_y: 137,
          ratio: 1.53,
          desc: '你的用户将在课程频道首页列表缩略图，看到此封面。',
        },
        {
          name: '详情封面',
          ratio_x: 332.5,
          ratio_y: 168.9,
          ratio: 1.89,
          desc: '你的用户将在banner和详情页中看到到此封面',
        },
      ],
      croppers: [
        {
          name: '嘉宾封面',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1.33,
          desc: '你的用户将在课程模块，看到此封面。',
        },
      ],
      courseLecturerList: [{ avatarUrl: {}, introduce: '', name: '' }], // 嘉宾列表
      concatCouse: {
        // 素材缓存
        isEdit: false,
        index: 0,
        selectCache: [],
      },
      materialList: [], // 素材列表
      oldMaterialList: [],
      oneMenus: [],
      twoMenus: [],
      columnList: [],
      levelList: [],
      rules: {
        courseTitle: [{ required: true, message: '课程标题必填', trigger: 'blur' }],
        firstCategoryId: [{ required: true, message: '一级分类必填', trigger: 'blur' }],
        secondCategoryId: [{ required: true, message: '二级分类必填', trigger: 'blur' }],
      },
      chapterName: '',
    };
  },
  components: {
    ImgInclude,
    videoMaterial,
    voiceMaterial,
    ImageText,
    documentMaterial
  },
  computed: {
    ...mapState({
      showImgText: state => state.imageText.formAddStatus.showImgText
    })
  },
  mounted() {
    if (this.$route.params.id) {
      this.init(this.$route.params.id);
    }
    this.getLevel();
    this.getColumnList();
    this.searchFirstMenu();
  },
  filters: {
    filterMaterialsCoverUrl: function(val) {
      return val ? val.split(',')[0] : ''
    }
  },
  watch: {
    'form.firstCategoryId': function(val) {
      if (val) {
        this.searchSecondMenu(val, 'init')
      }
    },
  },
  methods: {
    ...mapMutations('imageText', ['setAddImageTextStatus']),

    init(id) {
      const that = this;
      courseDetail({ id }).then(res => {
        if (res.resCode == 200) {
          const { resObject } = res;
          this.form = resObject || {};
          this.form.courseCover = {
            'ratio1.53': [],
            'ratio1.89': [],
          };
          this.form.courseCover['ratio1.53'] = [resObject.indexPic.split(',')[0]];
          this.form.courseCover['ratio1.89'] = [resObject.banner.split(',')[0]];
          this.materialList = resObject.courseMaterialsList || [];
          if (this.materialList.length) {
            this.materialList = this.materialList.sort(function (prev, next) {
              return prev.orderIndex - next.orderIndex
            })
          }
          this.oldMaterialList = [...(resObject.courseMaterialsList || [])];
          if ((resObject.courseLecturerList || []).length > 0) {
            that.courseLecturerList = (resObject.courseLecturerList || []).map(v =>
              assign(v, { avatarUrl: { pic: [v.avatarUrl] } })
            );
          }
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    searchFirstMenu(num) {
      // 获取一级菜单
      const that = this;
      searchCourseCategoryList({ pageSize: 0 }).then(res => {
        if (res.resCode == 200) {
          const arr = (res.resObject.list || []).filter(v => !v.catParentId);
          that.oneMenus = arr;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    searchSecondMenu(id, type) {
      // 获取二级菜单
      this.twoMenus = [];
      // 编辑进来的时候，要初始化一下二级select数据
      if (!type) {
        this.form.secondCategoryId = '';
      }
      const that = this;
      findCourseCategoryId({ unitParentId: id }).then(res => {
        if (res.resCode == 200) {
          that.twoMenus = res.resObject.list || [];
        } else {
          that.$message.error(res.message);
        }
      });
    },
    getLevel() {
      memberLevel().then(res => {
        if (res.resCode == 200) {
          this.levelList = res.resObject || [];
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    addTeacher() {
      // 新增讲师
      const arr = this.courseLecturerList;
      this.courseLecturerList = [...arr, { avatarUrl: {}, introduce: '', name: '' }];
    },
    delTeacher(i) {
      // 删除讲师
      if (this.courseLecturerList.length <= 1) return false;
      const arr = this.courseLecturerList;
      this.courseLecturerList = [...arr.slice(0, i), ...arr.slice(i + 1)];
    },
    onSubmit() {
      if (this.form.id) {
        this.editCourseInfo();
      } else {
        this.addCourseInfo();
      }
    },
    addCourseInfo() {
      const that = this;
      const courseLecturerList = this.courseLecturerList.map(v =>
        assign({}, v, {
          avatarUrl: that.getPicUrl(v.avatarUrl) || ' ',
        })
      );
      this.form.courseMaterialsList = this.materialList.map((item, index) => {
        item.orderIndex = index;
        return item
      });
      const param = assign({}, this.form, {
        courseLecturerList,
        indexPic: `${this.form.courseCover['ratio1.53'][0]}`,
        banner: `${this.form.courseCover['ratio1.89'][0]}`,
      });
      addCourse(param).then(res => {
        if (res.resCode == 200) {
          this.$message.success('新增成功');
          const packageId = res.resObject;
          // that.bindCourse(packageId);
          this.$router.push({
            name: 'directsellcourse',
          });
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    async bindCourse(courseId) {
      if (!this.materialList.length) {
        this.$router.push({
          name: 'directsellcourse',
        });
        return false;
      }
      const arr = this.materialList
        .map((v, i) => assign(v, { orderIndex: i }))
        // .filter(v => !this.oldMaterialList.find(o => o.id === v.id));
      const chaptList = arr.filter(v => v.materialsType === 0);
      const otherArr = arr
        .filter(v => v.materialsType !== 0)
        .map(v => ({
          materialsId: v.id,
          materialsType: v.materialsType,
          orderIndex: v.orderIndex,
        }));
      if (otherArr.length) {
        const res = await addMeterials({ courseId, courseMaterialsRowDataList: otherArr });
        if (res.resCode == 200) {
          // this.$message.success('添加素材成功');
        } else {
          this.$message(res.message, 'error');
        }
      }
      if (chaptList.length) {
        const res2 = await addChapter({ courseId, chapterDataList: chaptList });
        if (res2.resCode === 200) {
          // this.$message.success('添加章节成功');
        } else {
          this.$message(res2.message, 'error');
        }
      }
      this.$router.push({
        name: 'directsellcourse',
      });
    },
    editCourseInfo() {
      const that = this;
      const courseLecturerList = this.courseLecturerList.map(v =>
        assign({}, v, {
          avatarUrl: that.getPicUrl(v.avatarUrl),
        })
      );
      this.form.courseMaterialsList = this.materialList.map((item, index) => {
        item.orderIndex = index;
        return item
      });
      const param = assign({}, this.form, {
        courseLecturerList,
        indexPic: `${this.form.courseCover['ratio1.53'][0]}`,
        banner: `${this.form.courseCover['ratio1.89'][0]}`,
      });
      editCourse(param).then(res => {
        if (res.resCode == 200) {
          this.$message.success('编辑成功');
          // that.bindCourse(param.id);
          this.$router.push({
            name: 'directsellcourse',
          });
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    getPicUrl(obj) {
      return Object.keys(obj).reduce((p, c) => obj[c][0] || '', '');
    },
    // 设置素材
    setData(key) {
      const { materialList, concatCouse } = this;
      if (key == 3) {
        if (this.concatCouse.selectCache.length == 0) {
          this.$message.warning('未选中音频素材');
          return
        }

        if (this.concatCouse.selectCache.length > 1) {
          this.$message.warning('只能选中一个素材');
          return
        }
      }
      // this.showImgText = false;
      this.setAddImageTextStatus({
        showImgText: false,
        formRouter: '',
        fromSelectMaterial: false
      })
      this.showVideo = false;
      this.showVoice = false;
      this.showDocument = false;
      this.chapterAble = false;
      if (key === 0 && concatCouse.isEdit) {
        // 添加章节时
        this.materialList[concatCouse.index].chapterTitle = this.chapterName;
        this.materialList[concatCouse.index].materialsType = 0;
        return false;
      } else if (key === 0) {
        this.materialList = [...materialList, { chapterTitle: this.chapterName, materialsType: key }];
        return false;
      }
      if (!concatCouse.selectCache || !concatCouse.selectCache.length) return false;
      const arr = concatCouse.selectCache.map(v => assign(v, { materialsType: concatCouse.type }));
      // console.log('arr: ', arr);

      arr.map(item => {
        item.materialsCoverUrl = item.indexPic || item.imagePath;
        item.materialsTitle = item.title;
        item.courseId = this.form.id;
        item.materialsId = item.id;

        return item;
      })
      if (this.concatCouse.isEdit) {
        this.materialList = [
          ...materialList.slice(0, concatCouse.index),
          ...arr,
          ...materialList.slice(concatCouse.index + 1),
        ];
      } else {
        this.materialList = [...materialList, ...arr];
      }
    },
    editCourseList(obj, i, key) {
      if (key === 0) this.chapterAble = true;
      if (key === 1) {
        this.setAddImageTextStatus({
          showImgText: true,
          formRouter: this.$route,
          fromSelectMaterial: true
        })
      }
      // this.showImgText = true;
      if (key === 2) this.showVideo = true;
      if (key === 3) this.showVoice = true;
      this.concatCouse = { isEdit: true, index: i, type: key, selectCache: [] };
    },
    delCourseList(i) {
      const { materialList } = this;
      const obj = materialList[i];
      this.materialList = [...materialList.slice(0, i), ...materialList.slice(i + 1)];
      if (obj.id && !!this.oldMaterialList.find(o => o.id === obj.id)) {
        deleteMeterials(obj).then(res => {
          if (res.resCode == 200) {
            this.$message.success('删除成功');
          } else {
            that.$message(res.message, 'error');
          }
        });
      }
    },
    // 改变课程顺序 1上移动，2 下移动
    changeSort(i, num) {
      const len = this.materialList.length - 1;
      if (len <= 0) return;
      if (num === 1 && i === 0) return;
      if (num === 2 && i === len) return;
      if (num === 1) {
        const arr = [...this.materialList.slice(0, i), ...this.materialList.slice(i + 1)];
        arr.splice(i - 1, 0, this.materialList[i]);
        this.materialList = [...arr];
      }
      if (num === 2) {
        const arr = [...this.materialList.slice(0, i), ...this.materialList.slice(i + 1)];
        arr.splice(i + 1, 0, this.materialList[i]);
        this.materialList = [...arr];
      }
    },

    // 子组件方法 选中的素材
    handleCheckedCitiesChange(val) {
      console.log('val: ', val);
      this.concatCouse.selectCache = val.filter(v => typeof v !== 'number');
    },
    operateMaterial(key) {
      // 添加素材
      if (key === 0) {
        this.chapterAble = true;
      }

      if (key === 1) {
        // this.showImgText = true;
        // console.log('this.$route.name,: ', this.$route,);
        this.setAddImageTextStatus({
          showImgText: true,
          formRouter: this.$route,
          fromSelectMaterial: true
        })
      }

      if (key === 2) this.showVideo = true;
      if (key === 3) this.showVoice = true;
      if (key === 4) this.showDocument = true;
      this.concatCouse = {
        isEdit: false,
        index: 0,
        type: key,
        selectCache: [],
      };
      this.chapterName = '';
    },
    getColumnList() {
      columnList({ isActive: 1, type: 0 }).then(res => {
        if (res.resCode == 200) {
          this.columnList = res.resObject.list || [];
        }
      });
    },
    onCancel() {
      this.$router.back(-1);
    },
    closeImgText() {
      this.setAddImageTextStatus({
        showImgText: false,
        formRouter: '',
        fromSelectMaterial: false
      })
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
.sucaiBtn button {
  width: 100%;
  margin-left: 0;
  margin-bottom: 8px;
}
/deep/ .chapterStyle .el-dialog__body {
  padding: 0 20px;
}
/deep/ .teacher .el-image {
  width: 80px !important;
  height: 80px !important;
}
</style>
<style>
.select-course > div {
  padding-bottom: 30px;
}
.courseOperate:hover > div:nth-child(2) {
  display: block !important;
}
</style>
