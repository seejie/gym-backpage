<template>
  <div class="course-package-wrap">
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
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称，30字以内"></el-input>
        </el-form-item>
        <el-form-item label="活动摘要">
          <el-input type="textarea" v-model="form.summary" placeholder="请输入介绍，150字以内"></el-input>
        </el-form-item>
        <el-form-item label="活动介绍">
          <myEditor refs="name1" v-model="form.introduce"></myEditor>
        </el-form-item>
        <el-form-item required label="活动封面" style="overflow: scroll">
          <img-include v-model="imgs" :max="1" :cropper="cropper"></img-include>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>*关键词设置</span>
      </div>
      <el-form label-width="95px" style="padding-top: 16px; background-color: #ffffff">
        <el-form-item
          prop="title"
          v-for="(item, index) in courseQuestionaireItemList"
          :label="'关键词' + (index + 1)"
          :key="index"
        >
          <el-row>
            <el-col :span="14" style="padding-right: 8px">
              <el-input v-model="item.title" placeholder="请输入名称，30字以内"></el-input>
            </el-col>
            <el-col :span="10">
              <el-select v-model="item.type" placeholder="请选择" @change="selectType($event,index)">
                <el-option :value="1" label="文本"></el-option>
                <el-option :value="2" label="单选"></el-option>
                <el-option :value="3" label="多选"></el-option>
                <el-option :value="4" label="日期"></el-option>
                <el-option :value="5" label="手机号"></el-option>
                <el-option :value="6" label="附件"></el-option>
                <el-option :value="7" label="图片"></el-option>
              </el-select>
              <span class="radios">
                <span class="click" @click="changeCheck(index)"></span>
                <el-radio style="margin: 0 8px" v-model="item.isNeed" :label="1">必填</el-radio>
                <el-radio v-show="false" style="margin: 0 8px" :value="item.isNeed" :label="0">必填</el-radio>
              </span>
              <span class="radios" v-if="item.showListDisplay">
                <span class="click" @click="changelistDisplay(index)"></span>
                <el-radio style="margin: 0 8px" v-model="item.listDisplay" :label="1">列表提示</el-radio>
              </span>
              <span class="icon-style">
                <i class="el-icon-delete-solid" @click="delKey(index)"></i>
              </span>
              <span class="icon-style">
                <i class="el-icon-plus" style="margin-right: 0" @click="addKey"></i>
              </span>
            </el-col>
          </el-row>
          <el-row
            v-if="[2, 3].includes(item.type)"
            v-for="(obj, index2) in item.courseQuestionaireItemOptionsList"
            :key="index2"
            :gutter="16"
            style="margin-top: 8px"
          >
            <el-col :span="2">
              <span>选项1</span>
            </el-col>
            <el-col :span="10">
              <el-input v-model="obj.optionValue" placeholder="请输入名称，30字以内"></el-input>
            </el-col>
            <el-col :span="4">
              <span class="icon-style2">
                <i class="el-icon-delete-solid" @click="delOptions(index, index2)"></i>
              </span>
              <span class="icon-style2">
                <i class="el-icon-plus" style="margin-right: 0" @click="addOptions(index, index2)"></i>
              </span>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>参与条件设置</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="95px"
        style="padding-top: 16px; background-color: #ffffff"
      >
        <el-form-item label="有效期至" prop="expireDate">
          <el-date-picker v-model="form.expireDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="人数限制">
          <el-input type="number" v-model="form.limitNum" placeholder="请输入限制人数，不填则无限"></el-input>
        </el-form-item>
        <el-form-item label="每人限次">
          <el-input type="number" v-model="form.memberJoinNum" placeholder="请输入单人限制次数，不填则无限"></el-input>
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
        <el-form-item label="发布位置" required>
          <el-select clearable v-model="form.columnId" placeholder="栏目">
            <el-option
              v-for="item in columnList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="form.releasePostion" placeholder="排序位置">
            <el-option label="置顶" :value="1"></el-option>
            <el-option label="默认" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" required>
          <el-radio-group v-model="form.releaseType">
            <el-radio :label="1">立即发布</el-radio>
            <el-radio :label="2">草稿，暂不发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSubmit">提交</el-button>
          <el-button @click="onCancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue';
import moment from 'moment';
import assign from 'object-assign';
import { addQuestion, editQuest, questDetail, questionColumnList } from '../sever';

export default {
  data() {
    return {
      loading: false,
      form: {
        createTime: '',
        expireDate: '',
        introduce: '',
        limitNum: '',
        memberJoinNum: '',
        questions: '',
        releasePostion: '',
        releaseTime: '',
        releaseType: 1,
        summary: '',
        title: '',
        type: 1,
      },
      columnList: [],
      cover: {},
      courseQuestionaireItemList: [
        { title: '', type: '', isNeed: 0, options: '', listDisplay: 0, showListDisplay: true },
      ],
      imgs: {
        'ratio1.53': [],
        'ratio1.89': [],
      },
      cropper: [
        {
          name: 'Banner封面',
          ratio_x: 1.89,
          ratio_y: 1,
          ratio: 1.89,
          desc: '你的用户将在问答频道顶部互动滑动区域，看到此封面。',
        },
        {
          name: '普通封面',
          ratio_x: 1.53,
          ratio_y: 1,
          ratio: 1.53,
          desc: '你的用户将在问答列表里，看到此封面。',
        },
      ],
      rules: {
        title: [{ required: true, message: '活动标题必填', trigger: 'blur' }],
        expireDate: [{ required: true, message: '有效时间必填', trigger: 'blur' }],
        releasePostion: [{ required: true, message: '发布位置必填', trigger: 'blur' }],
        releaseTime: [{ required: true, message: '发布时间必填', trigger: 'blur' }],
      },
    };
  },
  components: {
    ImgInclude,
  },
  mounted() {
    const data = this.$route.params;
    this.getColumnList();
    if (data && data.id) {
      this.getDetail(data.id);
    }
  },
  methods: {
    onSubmit() {
      const time = this.form.expireDate;
      const obj = this.cover;
      const param = assign({}, this.form, {
        courseQuestionaireItemList: this.courseQuestionaireItemList,
        indexPic: `${this.imgs['ratio1.53'][0]}`,
        banner: `${this.imgs['ratio1.89'][0]}`,
        expireDate: time ? moment(time).format('YYYY-MM-DD HH:ss:mm') : '',
      });
      if (this.form.id) {
        this.editCommit(param);
      } else {
        this.addCommit(param);
      }
    },
    addCommit(param) {
      const that = this;
      that.loading = true;
      addQuestion(param).then(res => {
        that.loading = true;
        if (res.resCode == 200) {
          that.$message.success('新增成功');
          that.$router.push('/coursesubjectmanager/questionsanswer');
        } else {
          that.$message.error(res.message);
        }
      });
    },
    editCommit(param) {
      const that = this;
      that.loading = true;
      editQuest(param).then(res => {
        that.loading = true;
        if (res.resCode == 200) {
          that.$message.success('编辑成功');
          that.$router.push('/coursesubjectmanager/questionsanswer');
        } else {
          that.$message.error(res.message);
        }
      });
    },
    getDetail(id) {
      const that = this;
      questDetail({ id }).then(res => {
        if (res.resCode == 200) {
          this.form = res.resObject || {};
          this.courseQuestionaireItemList = res.resObject.courseQuestionaireItemList || [];
          this.courseQuestionaireItemList.forEach(v => {
            if (v.type !== 6 && v.type !== 7) {
              v.showListDisplay = true;
            } else {
              v.showListDisplay = false;
            }
          });
          this.imgs['ratio1.53'] = [res.resObject.indexPic.split(',')[0]];
          this.imgs['ratio1.89'] = [res.resObject.banner.split(',')[0]];
        } else {
          that.$message.error(res.message);
        }
      });
    },
    delKey(i) {
      if (this.courseQuestionaireItemList.length > 1) {
        this.courseQuestionaireItemList = [
          ...this.courseQuestionaireItemList.slice(0, i),
          ...this.courseQuestionaireItemList.slice(i + 1),
        ];
      }
    },
    addKey() {
      this.courseQuestionaireItemList = [
        ...this.courseQuestionaireItemList,
        {
          title: '',
          type: '',
          isNeed: 0,
          listDisplay: 0,
          showListDisplay: true,
          courseQuestionaireItemOptionsList: [],
        },
      ];
    },
    selectType(val, i) {
      if (val == 2 || val == 3) {
        this.$set(
          this.courseQuestionaireItemList[i],
          'courseQuestionaireItemOptionsList',
          this.courseQuestionaireItemList[i].courseQuestionaireItemOptionsList.length
            ? this.courseQuestionaireItemList[i].courseQuestionaireItemOptionsList
            : [{ optionValue: '' }]
        );
      } else {
        this.$set(this.courseQuestionaireItemList[i], 'courseQuestionaireItemOptionsList', []);
      }
      let flag = true;
      if (val == 6 || val == 7) {
        flag = false;
      }
      this.$set(this.courseQuestionaireItemList[i], 'showListDisplay', flag);
    },
    changeCheck(i) {
      this.courseQuestionaireItemList[i].isNeed = this.courseQuestionaireItemList[i].isNeed ? 0 : 1;
    },
    changelistDisplay(i) {
      this.courseQuestionaireItemList[i].listDisplay = this.courseQuestionaireItemList[i].listDisplay ? 0 : 1;
    },
    delOptions(i, i2) {
      const obj = this.courseQuestionaireItemList[i];
      const info = assign(obj, {
        courseQuestionaireItemOptionsList: [
          ...obj.courseQuestionaireItemOptionsList.slice(0, i2),
          ...obj.courseQuestionaireItemOptionsList.slice(i2 + 1),
        ],
      });
      this.courseQuestionaireItemList[i] = info;
    },
    addOptions(i, i2) {
      const obj = this.courseQuestionaireItemList[i];
      obj.courseQuestionaireItemOptionsList = [...obj.courseQuestionaireItemOptionsList, { optionValue: '' }];
    },
    onCancel() {
      this.$router.back(-1);
    },
    getColumnList() {
      questionColumnList().then(res => {
        if (res.resCode == 200) {
          this.columnList = res.resObject.list || [];
        }
      });
    },
  },
};
</script>

<style scoped>
.course-package-wrap {
  padding: 10px 10%;
}
.icon-style {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin-right: 10px;
  background-color: #7f7f7f;
}
.icon-style2 {
  display: inline-block;
  vertical-align: middle;
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  margin: 0 10px;
  background-color: #7f7f7f;
}
.icon-style2 i {
  font-size: 16px;
  color: #ffffff;
}
.icon-style i {
  font-size: 16px;
  color: #ffffff;
}
.radios {
  position: relative;
}
.radios .click {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
</style>
