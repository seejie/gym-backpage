<template>
  <el-card class="card">
    <el-form ref="form" :model="form" :rules="rules" label-width="95px" style="width: 80%;padding-top: 16px">
      <el-form-item label="教师姓名" prop="teacherName">
        <el-input v-model="form.teacherName"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="form.gender" :label="1">男</el-radio> <el-radio v-model="form.gender" :label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="出生日期" >
        <el-col :span="4">
          <el-date-picker placeholder="选择日期时间"  format="yyyy-MM-dd"  value-format="yyyy-MM-dd"  v-model="form.birthday"  type="date"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="身份证号" >
        <el-input v-model="form.idNo"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone" >
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item  prop="area" class="selectclass" label="联系地址">
        <el-row>
          <el-cascader
            v-model="form.proCity"
            style="width: 160px;"
            :options="options"
            placeholder="请选择省市"
            @change="handleCity"></el-cascader>
          <el-select v-model="form.addressDistrict" placeholder="请选择县区" style="width: 160px;">
            <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-row>
       <el-row style="margin-top: 10px">
         <el-input v-model="form.address" placeholder="请输入具体详细位置"></el-input>
       </el-row>
      </el-form-item>
      <el-form-item label="教练图片" prop="coverUrl">
        <img-include v-model="imgs"  :cropper="cropper" :max="1"></img-include>
      </el-form-item>
      <el-form-item label="推荐介绍">
        <el-input type="textarea" v-model="form.introduce"></el-input>
      </el-form-item>
      <el-form-item label="履历说明">
        <myEditor refs='name1' v-model="form.resume"></myEditor>
      </el-form-item>
      <el-form-item label="分类" prop="firstCategoryId">
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
      <div class="foot">发布设置</div>
      <el-form-item  label="发布时间" prop="status">
        <el-row>
          <el-radio v-model="form.status" :label="1">立即发布</el-radio>
        </el-row>
        <el-row>
          <el-radio v-model="form.status" :label="0">草稿，暂不发布</el-radio>
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
import { teacherCategory, teacher } from '@/api/customCourse/customCourse'
import cityList from '@/utils/citys'
import assign from 'object-assign'
export default {
  data() {
    return {
      form: {
        id: this.$route.params.id,
        teacherName: '',
        gender: '',
        birthday: '',
        idNo: '',
        phone: '',
        proCity: [],
        addressCity: '',
        addressDistrict: '',
        addressProvince: '',
        address: '',
        photos: '',
        introduce: '',
        resume: '',
        firstCategoryId: '',
        secondCategoryId: '',
        status: 1,
        currentPrice: ''
      },
      imgs: {},
      cateData: { first: [], sencond: [] },
      dialog: { outerVisible: false, innerVisible: false, categoryData: [], form_category: { name: '', id: '' } },
      rules: {
        teacherName: [
          { required: true, message: '教师姓名', trigger: 'blur' },
        ],
        phone: [{ required: true, message: '联系电话', trigger: 'blur' },],
        status: [
          { required: true, message: '请选择发布时间', trigger: 'blur' },
        ],
      },
      cropper: [{
        name: 'banner图',
        ratio_x: 1.89,
        ratio_y: 1,
        ratio: 1.89,
        desc: '你的用户将在圈子频道顶部互动滑动区域，看到此封面。'
      }],
      areaList: [],
      options: cityList.map(v => assign({
        value: v.code,
        label: v.name,
        children: v.city.map(v => ({
          value: v.code,
          label: v.name
        }))
      })),
    }
  },
  components: {
    ImgInclude,
    cityList,
  },
  mounted() {
    this.load()
    this.loadcate(0)
  },
  methods: {
    load() {
      if (this.form.id > 0) {
        teacher.getone({ id: this.form.id }).then(res => {
          if (res.resCode == 200) {
            var data = res.resObject
            this.form.teacherName = data.teacherName
            this.imgs = { 'ratio1.89': [data.photos] }
            this.form.photos = this.imgs['ratio1.89'][0]
            this.form.birthday = data.birthday
            this.form.secondCategoryId = data.secondCategoryId
            this.form.firstCategoryId = data.firstCategoryId
            this.form.status = data.status
            this.form.idNo = data.idNo
            this.form.gender = data.gender
            this.form.phone = data.phone
            this.form.address = data.address
            this.form.introduce = data.introduce
            this.form.resume = data.resume
            this.form.addressCity = data.addressCity
            this.form.addressDistrict = data.addressDistrict
            this.form.addressProvince = data.addressProvince
            this.form.proCity.push(data.addressProvince)
            this.form.proCity.push(data.addressCity)
            this.form.currentPrice = data.currentPrice
            const obj = cityList.find(v => v.code === data.addressProvince).city.find(v => v.code === data.addressCity)
            this.areaList = obj.area.map(v => ({ value: v.code, label: v.name }))
            this.options = cityList.map(v => assign({
              value: v.code,
              label: v.name,
              children: v.city.map(v => ({
                value: v.code,
                label: v.name
              }))
            }))
            this.loadcate(this.form.firstCategoryId)
          }
        })
      }
    },
    loadcate(catParentId) {
      teacherCategory.load({ catParentId: catParentId, PageSize: 100 }).then(res => {
        if (res.resCode == 200) {
          if (catParentId > 0) { this.cateData.sencond = res.resObject.list } else { this.cateData.first = res.resObject.list }
        }
      })
    },
    changeCate(id) {
      this.loadcate(id)
    },
    onSubmit() {
      this.form.photos = this.imgs != null && this.imgs['ratio1.89'] != null ? this.imgs['ratio1.89'][0] : ''
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.form.proCity.length > 1) {
          this.form.addressProvince = this.form.proCity[0]
          this.form.addressCity = this.form.proCity[1]
        }
        var url = this.form.id > 0 ? teacher.update(this.form) : teacher.add(this.form)
        url.then(res => {
          if (res.resCode == 200) {
            this.message('提交成功')
            this.$router.push('/customcourse/teacher')
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

    handleCity(val) {
      this.form.proCity = val
      const obj = cityList.find(v => v.code === val[0]).city.find(v => v.code === val[1])
      this.areaList = obj.area.map(v => ({ value: v.code, label: v.name }))
      this.form.addressDistrict = ''
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
