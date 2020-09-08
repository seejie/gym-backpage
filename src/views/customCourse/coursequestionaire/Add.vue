<template>
  <div class="basicregistration">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="elfrom">
        <el-form-item label="活动标题" prop="title">
          <el-col :span="8"><el-input placeholder="请输入标题，30字以内" v-model="form.title" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="活动摘要">
          <el-col :span="8"><el-input type="textarea" placeholder="请输入摘要，150字以内" :row="5" v-model="form.summary"></el-input></el-col>
        </el-form-item>
        <el-form-item label="活动介绍" >
          <el-col :span="18"><myEditor refs='name1' v-model="form.introduce"></myEditor></el-col>
        </el-form-item>
        <el-form-item label="活动封面" prop="banner">
          <img-include v-model="form.imgs" :max="1" :cropper="cropper"></img-include>
        </el-form-item>
        <el-form-item label="*关键词设置" label-width="130px" prop="">
          <el-row>
            <el-col :span="8">(列表提示可选最多2个字段，图片和附件类型不可设提示) <el-button type="primary" @click="addkey">添加关键字</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="30px">
          <el-row  v-for="(item,index) in form.keys" :key="index" >
            <el-row  type="flex" >
              <el-col :span="1">关键字{{index+1}}</el-col>
              <el-col :span="6"><el-input  placeholder="请输入，30字以内" v-model="item.title" style="width: 90%"></el-input></el-col>
              <el-col :span="6">
                <el-select    v-model="item.type" style="width: 90%">
                  <el-option v-for="(item1,index2) in txttype" :key="index2" :label="item1.name" :value="item1.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6"><el-radio v-model="item.is_need" @click.native.prevent="item.is_need=item.is_need==1?0:1"  :label="1">必填</el-radio><el-radio v-if="item.type!='6'&&item.type!='7'" @click.native.prevent="item.listDisplay=item.listDisplay==1?0:1" v-model="item.listDisplay"  :label="1">列表显示</el-radio><i @click="removekey(index)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style=";margin-left: 20px;font-size: 18px" class="el-icon-circle-plus-outline" @click="addkey"></i></el-col>
            </el-row>
            <el-row v-if="item.type=='2'||item.type=='3'" v-for="(item1,index1) in item.options" :key="index1" type="flex" style="margin-left: 30px">
              <el-col :span="1">选项{{index1+1}}</el-col>
              <el-col :span="6"><el-input  placeholder="请输入，30字以内" v-model="item1.title"  style="width: 90%"></el-input></el-col>
              <el-col :span="6"><i @click="removekeyone(index,index1)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style="margin-left: 20px;font-size: 18px;" class="el-icon-circle-plus-outline" @click="addkeyone(index)"></i></el-col>
            </el-row>
          </el-row>

        </el-form-item>
        <el-form-item label="参与条件设置" label-width="115px"></el-form-item>
        <el-form-item label="有效期至" prop="expireDate">
          <el-col :span="4">
            <el-date-picker placeholder="选择日期时间"  format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"  v-model="form.expireDate"  type="datetime"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="人数限制" >
          <el-col :span="8"><el-input placeholder="请输入限制人数，不填则无限" v-model="form.limitNum" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="每人限次" >
          <el-col :span="8"><el-input placeholder="请输入单人限制次数，不填则无限" v-model="form.memberJoinNum" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="发布设置"></el-form-item>
        <el-form-item  label="发布位置">
          <el-select placeholder="请选择" v-model="form.releasePostion">
            <el-option label="置顶" :value="1"></el-option>
            <el-option label="默认" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="发布时间">
          <el-row>
            <el-radio v-model="form.status" :label="1">发布</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="form.status" :label="2">草稿，暂不发布</el-radio>
          </el-row>
          <el-row>
            <el-col><el-radio v-model="form.status"  :label="3">定时发布</el-radio></el-col>
            <el-col>
              <el-date-picker placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"   v-model="form.releaseTime"  type="datetime"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue/index.vue'
import { CourseQuestionaire } from '@/api/customCourse/customCourse'
export default {
  name: 'index',
  components: {
    ImgInclude,
  },
  data() {
    return {
      id: this.$route.params.id,
      form: { id: this.$route.params.id, title: '', summary: '', introduce: '', banner: '', indexpic: '', imgs: {}, keys: [{ id: '', title: '', type: '', is_need: 0, listDisplay: 0, options: [{ title: '', id: '' }] }], expireDate: '', limitNum: '', memberJoinNum: '', releaseTime: '', releasePostion: 0, status: 1 },
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
      txttype: [
        { name: '文本', value: '1' },
        { name: '单选', value: '2' },
        { name: '多选', value: '3' },
        { name: '时间选择 ', value: '4' },
        { name: '手机号', value: '5' },
        { name: '图片上传', value: '6' },
        { name: '附件上传', value: '7' }
      ],
      rules: {
        title: [
          { required: true, message: '活动标题', trigger: 'blur' },
        ],
        banner: [
          { required: true, message: '请选择封面', trigger: 'blur' },
        ],
        expireDate: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        releasePostion: [
          { required: true, message: '请选择发布位置', trigger: 'blur' },
        ]
      },
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      if (this.id > 0) {
        CourseQuestionaire.getone({ id: this.id }).then(res => {
          if (res.resCode == 200) {
            var data = res.resObject
            var datalist = res.resObject.courseQuestionaireItemList
            this.form.title = data.title
            this.form.summary = data.abstract_info;
            this.form.introduce = data.introduce;
            this.form.imgs = { 'ratio1.89': [data.banner], 'ratio1.53': [data.indexpic] }
            this.form.banner = this.form.imgs['ratio1.89'][0];
            this.form.indexpic = this.form.imgs['ratio1.53'][0];
            if (datalist.length > 0) {
              this.form.keys = []
              for (var i = 0; i < datalist.length; i++) {
                var d = { title: '', type: '', is_need: 0, listDisplay: 0, options: [] }
                d.title = datalist[i].title
                d.type = datalist[i].type + ''
                d.is_need = datalist[i].isNeed
                d.id = datalist[i].id;
                d.listDisplay = datalist[i].listDisplay;
                for (var j = 0; j < datalist[i].courseQuestionaireItemOptionsList.length; j++) {
                  d.options.push({ title: datalist[i].courseQuestionaireItemOptionsList[j].optionValue, id: datalist[i].courseQuestionaireItemOptionsList[j].itemId })
                }
                this.form.keys.push(d)
              }
            }
            this.form.expireDate = data.expireDate != null ? this.$moment(data.expireDate).format('YYYY-MM-DD HH:mm:ss') : ''
            this.form.limitNum = data.limitNum;
            this.form.memberJoinNum = data.memberJoinNum;
            this.form.releasePostion = data.releasePostion
            this.form.releaseTime = data.releaseTime != null ? this.$moment(data.releaseTime).format('YYYY-MM-DD HH:mm:ss') : ''
            this.form.status = data.status
          }
        }).catch(error => {

        })
      }
    },
    onSubmit() {
      this.form.banner = this.form.imgs != null && this.form.imgs['ratio1.89'] != null ? this.form.imgs['ratio1.89'][0] : '';
      this.form.indexpic = this.form.imgs != null && this.form.imgs['ratio1.53'] != null ? this.form.imgs['ratio1.53'][0] : '';
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
      })
      if (this.form.keys[0].title === '') {
        this.message('请填写关键字', 'error');
      } else {
        var singUpModel = []
        if (this.form.keys.filter(f => f.listDisplay > 0).length > 2) {
          this.message('列表提示最多可以选2个', 'error');
          return;
        }
        for (var i = 0; i < this.form.keys.length; i++) {
          var get = {
            id: this.form.keys[i].id,
            title: this.form.keys[i].title,
            type: this.form.keys[i].type,
            isNeed: this.form.keys[i].is_need,
            listDisplay: this.form.keys[i].listDisplay,
            itemIndex: i,
            trainingId: this.form.id,
            courseQuestionaireItemOptionsList: []
          }
          for (var j = 0; j < this.form.keys[i].options.length; j++) {
            get.courseQuestionaireItemOptionsList.push({ itemId: this.form.keys[i].options[j].id, optionValue: this.form.keys[i].options[j].title })
          }
          singUpModel.push(get)
        }
        this.form.courseQuestionaireItemList = singUpModel

        var url = this.id > 0 ? CourseQuestionaire.update(this.form) : CourseQuestionaire.add(this.form)
        url.then(res => {
          if (res.resCode == 200) {
            this.message('提交成功', 'success')
            this.back()
          } else {
            this.message('提交失败', 'error')
          }
        }).catch(error => {

        })
      }
    },

    addkey() { // 添加关键字
      this.form.keys.push({ id: '', title: '', type: '', is_need: 0, listDisplay: 0, options: [{ title: '', id: '' }] })
    },
    removekey(index) { // 移除某一行
      this.form.keys.splice(index, 1)
    },
    addkeyone(index) { // 添加选项
      this.form.keys[index].options.push({ title: '', id: '' })
    },
    removekeyone(index, index1) { // 移除选择
      this.form.keys[index].options.splice(index1, 1)
    },
    back() {
      this.$router.push('/customcourse/coursequestionaire')
    },
    // 错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type
      })
    }
  }
}
</script>

<style lang="scss"  scoped>
  .basicregistration {
    @extend %fill;
    padding: 10px 3%;
    .elfrom {
      margin-top: 30px;
    }
    .rate {
      display: flex;
      align-items: center;
      justify-content: left;
      height: 40px;
    }

    .el-row{
      margin-bottom: 10px;
    }

    .foot{
      font-size: 20px;
      margin:20px;
    }
  }

</style>
