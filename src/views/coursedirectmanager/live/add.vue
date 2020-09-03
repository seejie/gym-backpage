<template>
  <div class="course-package-wrap">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="padding-top: 16px; background-color: #ffffff"
    >
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>基本信息</span>
        </div>

        <el-form-item
          label="直播标题"
          prop="courseTitle"
        >
          <el-input
            v-model="form.courseTitle"
            placeholder="请输入名称，30字以内"
          ></el-input>
        </el-form-item>
        <el-form-item label="直播摘要">
          <el-input
            type="textarea"
            placeholder="请输入介绍，150字以内"
            v-model="form.courseSummary"
          ></el-input>
        </el-form-item>
        <el-form-item label="直播时间">
          <el-date-picker
            v-model="form.courseBeginTime"
            type="datetime"
            style="margin-right: 16px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始日期"
          ></el-date-picker>
          <el-date-picker
            v-model="form.courseEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="文字主播"
        >
          <el-input
            v-model="form.courseAnchor"
            placeholder="请输入主播手机号,多个主播请用分号 ; 隔开"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="讲师嘉宾"
          style="overflow: scroll"
        >
          <div
            style="display: flex; margin-bottom: 8px"
            v-for="(item, index) in list"
            :key="index"
          >
            <img-include
              :width="80"
              v-model="item.avatarUrl"
              :max="1"
              :cropper="croppers"
            ></img-include>
            <div style="flex: 1; margin: 0 8px">
              <el-input
                style="margin-bottom: 8px"
                v-model="item.name"
                placeholder="请输入讲师名字"
              ></el-input>
              <el-input
                v-model="item.introduce"
                placeholder="一句话介绍讲师"
              ></el-input>
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
        <el-form-item label="回看地址">
          <el-input
            v-model="form.courseUrl"
            placeholder="请输入主播手机号,多个主播请用分号 ; 隔开"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图文封面"
          style="overflow: scroll"
          required
        >
          <img-include
            v-model="imgs"
            :max="1"
            :cropper="cropper"
          ></img-include>
        </el-form-item>
        <el-form-item label="跳转三方链接" prop="linkUrl">
          <div>
            <el-input
            style="width: 400px;margin-right: 10px;"
            v-model="form.linkUrl"
            placeholder="请输入三方链接地址"
          ></el-input>
          <el-switch
                v-model="form.linkSwitch"
                :active-value="1"
                :inactive-value="0"
                active-text="开"
                inactive-text="关"
                :disabled="linkSwitchDisabled"
              ></el-switch>
          </div>
          <div style="color;#999; font-size:12px">输入三方链接后方可选择生效状态，生效后用户前台访问将直接跳转至三方链接</div>

        </el-form-item>
      </el-card>
      <el-card
        class="box-card"
        style="margin-top: 20px"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>发布设置</span>
        </div>
        <el-form-item label="发布位置" prop="columnSort">
          <el-select
            clearable
            v-model="form.columnSort"
            placeholder="排序位置"
          >
            <el-option
              label="置顶"
              :value="1"
            ></el-option>
            <el-option
              label="默认"
              :value="0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="courseReleaseType">
          <el-radio-group v-model="form.courseReleaseType">
            <el-radio :label="1">立即发布</el-radio>
            <el-radio :label="2">草稿，暂不发布</el-radio>
            <el-radio :label="3">定时发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label
          v-if="form.courseReleaseType == 3"
        >
          <el-date-picker
            v-model="form.releaseTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit()"
          >提交</el-button>
          <el-button @click="onCancel()">取消</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue';
import assign from 'object-assign';
import { createLive, editLiveCourse, liveDetail } from '../sever';

export default {
  data() {
    var validateLinkUrl = (rule, value, callback) => {
      let httpReg=/(http|https):\/\/([\w.]+\/?)\S*/;
      if (value !== '' && !httpReg.test(this.form.linkUrl)) {
        callback(new Error('请输入正确的格式'));
      } else {
        callback();
      }
    };
    return {
      form: {
        courseAnchor: '',
        courseBeginTime: '',
        courseEndTime: '',
        courseReleaseType: 1,
        courseStatus: '',
        courseSummary: '',
        courseTitle: '',
        courseUrl: '',
        liveCourseLecturers: [],
        releaseTime: '',
        unitId: '',
        unitParentId: '',
        linkSwitch:"",
        linkUrl:""
      },
      imgs: {
        'ratio1.53': [],
        'ratio1.89': [],
      },
      cropper: [
        {
          name: '列表封面',
          ratio_x: 197,
          ratio_y: 100,
          ratio: 1.53,
          desc: '你的用户将在课程频道首页列表缩略图，看到此封面',
        },
        {
          name: '详情封面',
          ratio_x: 190,
          ratio_y: 100,
          ratio: 1.89,
          desc: '你的用户将在课程详情页中看到到此封面',
        },
      ],
      croppers: [
        {
          name: '嘉宾封面',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 0.4,
          desc: '',
        },
      ],
      sucaiList: [],
      rules: {
        courseTitle: [{ required: true, message: '请输入直播标题', trigger: 'blur' }],
        columnSort: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        courseReleaseType: [{ required: true, message: '请选择发布位置', trigger: 'change' }],
        linkUrl:[{ validator: validateLinkUrl, trigger: 'blur' }]
      },
      timeRange: {
        start: '00:00',
        step: '00:30',
        end: '23:59',
      },
      list: [{ avatarUrl: {}, introduce: '', name: '' }],
    };
  },
  components: {
    ImgInclude,
  },
  mounted() {
    if (this.$route.params.id) {
      this.initData(this.$route.params.id);
    }
  },
  computed: {
    linkSwitchDisabled:function(){
      let httpReg=/(http|https):\/\/([\w.]+\/?)\S*/;
      return !httpReg.test(this.form.linkUrl)
    }
  },
  methods: {
    onCancel(){
      this.$router.back(-1);
    },
    initData(id) {
      const that = this;
      liveDetail({ id }).then(res => {
        if (res.resCode == 200) {
          const { liveCourse, liveCourseLecturers } = res.resObject;
          that.form = liveCourse;
          this.imgs['ratio1.53'] = [liveCourse.indexPic.split(',')[0]];
          this.imgs['ratio1.89'] = [liveCourse.banner.split(',')[0]];
          const arr = (liveCourseLecturers || []).length
            ? liveCourseLecturers
            : [{ avatarUrl: "", introduce: '', name: '' }];
          that.list = arr.map(v => assign(v, { avatarUrl: v.avatarUrl ? { pic: [v.avatarUrl] } : {} }));
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            this.editLive();
          } else {
            this.addLive();
          }
        } else {
          this.$message.error('请输入必填信息');
          return false;
        }
      });
    },
    addLive() {
      const that = this;
      const courseLecturers =[...this.list].map(v =>({
        ...v,
        avatarUrl: that.getPicUrl(v.avatarUrl),
      }))
      const param = assign({}, this.form, {
        courseLecturers,
        indexPic: `${this.imgs['ratio1.53'][0]}`,
        banner: `${this.imgs['ratio1.89'][0]}`,
      });
      if(param.indexPic=="undefined" && param.banner=="undefined"){
        this.$message.error('请上传图文封面！');
        return false
      }
      createLive(param).then(res => {
        if (res.resCode == 200) {
          this.$message.success('新增成功');
          this.$router.push('/coursedirectmanager/live');
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    editLive() {
      const that = this;
      const courseLecturers =[...this.list].map(v =>({
        ...v,
        avatarUrl: that.getPicUrl(v.avatarUrl),
      }))
      const param = assign({}, this.form, {
        courseLecturers,
        indexPic: `${this.imgs['ratio1.53'][0]}`,
        banner: `${this.imgs['ratio1.89'][0]}`,
      });
      if(param.indexPic=="undefined" && param.banner=="undefined"){
        this.$message.error('请上传图文封面！');
        return false
      }
      editLiveCourse(param).then(res => {
        if (res.resCode == 200) {
          this.$message.success('编辑成功');
          this.$router.push('/coursedirectmanager/live');
        } else {
          that.$message(res.message, 'error');
        }
      });
    },
    delTeacher(i) {
      const arr = this.list;
      this.list = [...arr.slice(0, i), ...arr.slice(i + 1)];
    },
    addTeacher() {
      const arr = this.list;
      this.list = [...arr, { avatarUrl: {}, introduce: '', name: '' }];
    },
    getPicUrl(obj) {
      return Object.keys(obj).reduce((p, c) => obj[c][0] || '', '');
    },
  },
};
</script>

<style scoped>
.course-package-wrap {
  padding: 10px 10%;
}
.sucaiBtn button {
  width: 100%;
  margin-left: 0;
  margin-bottom: 8px;
}
</style>
