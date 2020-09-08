<template>
  <el-card class="card">
  <el-form ref="form" :model="form" :rules="rules" label-width="95px" style="width: 80%;padding-top: 16px">
    <el-form-item label="课程标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="课程摘要">
      <el-input type="textarea" v-model="form.summary"></el-input>
    </el-form-item>
    <el-form-item label="正文详情">
      <myEditor refs='name1' v-model="form.content"></myEditor>
    </el-form-item>
    <el-form-item label="选择分类" prop="firstCategoryId">
      <el-select v-model="form.firstCategoryId" placeholder="请选择一级分类" style="width: 160px;" @change="changeCate">
        <el-option v-if="cateData.first.length>0" :label="item.categoryName" :key="index" :value="item.id" v-for="(item,index) in cateData.first"></el-option>
      </el-select>
      <el-select v-model="form.secondCategoryId" placeholder="请选择二级分类" style="width: 160px;">
        <el-option v-if="cateData.sencond.length>0" :label="item.categoryName" :key="index" :value="item.id" v-for="(item,index) in cateData.sencond"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="费用设定">
      <el-input v-model="form.currentPrice"></el-input>
    </el-form-item>
    <el-form-item label="图文封面" prop="banner">
      <img-include v-model="imgs"  :cropper="cropper" :max="1"></img-include>
    </el-form-item>
    <div class="foot">发布设置</div>
    <el-form-item  label="发布位置" prop="courseSort">
      <el-select placeholder="请选择" v-model="form.courseSort">
        <el-option label="置顶" :value="1"></el-option>
        <el-option label="默认" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item  label="发布时间" prop="courseReleaseType">
      <el-row>
        <el-radio v-model="form.courseReleaseType" :label="1">立即发布</el-radio>
      </el-row>
      <el-row>
        <el-radio v-model="form.courseReleaseType" :label="2">草稿，暂不发布</el-radio>
      </el-row>

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import ImgInclude from '@/components/CropImgInclue/index.vue'
import { customCourseList, customCourseCategory } from '@/api/customCourse/customCourse'
export default {
  data() {
    return {

      form: {
        id: this.$route.params.id,
        content: '',
        banner: '',
        createTime: '',
        currentPrice: '',
        firstCategoryId: '',
        courseReleaseType: 1,
        secondCategoryId: '',
        summary: '',
        title: '',
        courseSort: 0,
        indexPic: ''
      },
      imgs: {},
      cateData: { first: [], sencond: [] },
      rules: {
        title: [
          { required: true, message: '课程标题', trigger: 'blur' },
        ],
        firstCategoryId: [
          { required: true, message: '选择分类', trigger: 'blur' },
        ],
        secondCategoryId: [
          { required: true, message: '选择分类二', trigger: 'blur' },
        ],
        banner: [
          { required: true, message: '请选择封面', trigger: 'blur' },
        ],
        courseSort: [
          { required: true, message: '请选择发布位置', trigger: 'blur' },
        ],
        courseReleaseType: [
          { required: true, message: '请选择发布时间', trigger: 'blur' },
        ],
      },
      cropper: [{
        name: 'banner图',
        ratio_x: 1.89,
        ratio_y: 1,
        ratio: 1.89,
        desc: '你的用户将在圈子频道顶部互动滑动区域，看到此封面。'
      }, {
        name: '普通封面',
        ratio_x: 1.53,
        ratio_y: 1,
        ratio: 1.53,
        desc: '你的用户将在资讯列表里，看到此封面。'
      }],
    }
  },
  components: {
    ImgInclude
  },
  mounted() {
    this.load()
    this.loadcate(0)
  },
  methods: {
    load() {
      if (this.form.id > 0) {
        customCourseList.getone({ id: this.form.id }).then(res => {
          if (res.resCode == 200) {
            var data = res.resObject
            this.form.content = data.content
            this.imgs = { 'ratio1.89': [data.banner], 'ratio1.53': [data.indexPic] }
            this.form.banner = this.imgs['ratio1.89'][0];
            this.form.indexPic = this.imgs['ratio1.53'][0];
            this.form.createTime = data.createTime
            this.form.currentPrice = data.currentPrice
            this.form.firstCategoryId = data.firstCategoryId
            this.form.courseReleaseType = data.courseReleaseType
            this.form.secondCategoryId = data.secondCategoryId
            this.form.summary = data.summary
            this.form.title = data.title
            this.form.courseSort = data.courseSort
            this.loadcate(this.form.firstCategoryId)
          }
        })
      }
    },
    loadcate(catParentId) {
      customCourseCategory.load({ catParentId: catParentId, PageSize: 100 }).then(res => {
        if (res.resCode == 200) {
          if (catParentId > 0) { this.cateData.sencond = res.resObject.list } else { this.cateData.first = res.resObject.list }
        }
      })
    },
    changeCate(id) {
      this.loadcate(id)
    },
    onSubmit() {
      this.form.banner = this.imgs != null && this.imgs['ratio1.89'] != null ? this.imgs['ratio1.89'][0] : '';
      this.form.indexPic = this.imgs != null && this.imgs['ratio1.53'] != null ? this.imgs['ratio1.53'][0] : '';
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        var url = this.form.id > 0 ? customCourseList.update(this.form) : customCourseList.add(this.form)
        url.then(res => {
          if (res.resCode == 200) {
            this.message('提交成功')
            this.$router.push('/customcourse/index')
          }
        })
      })
    },
    setCover(url) {
      console.log(url)
    },
    handleAvatarSuccess(res, file) {
      this.form.courseCover = URL.createObjectURL(file.raw)
    },

    message(message, type) {
      Message({
        message: message,
        type: type
      })
    }
  },

}
</script>

<style scoped>
  .card{margin: 10px}

  .foot{
    padding: 10px 0 20px 0;
  }
</style>
