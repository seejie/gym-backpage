<template>
  <div class="application_merchant">
    <el-form
      class="form"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="商铺名称：" prop="name">
        <el-input v-model.trim="form.name" class="max_width" placeholder="请填写商铺标题，1-24字" />
      </el-form-item>
      <el-form-item label="商户LOGO：" prop="logo">
        <template>
          <div class="logo_form_itme">
            <y-p-img-upload
              class="logo_url"
              :imagePath.sync="form.logo_url"
              :imgSize="1"
            />
          </div>
        </template>
      </el-form-item>
      <el-form-item label="授权函：" prop="protocol">
        <template>
          <div class="logo_form_itme">
            <el-upload class="logo_uploader" action="https://jsonplaceholder.typicode.com/posts/">
              <div class="el_upload">
                <i class="el-icon-plus" />
              </div>
            </el-upload>
            <p class="text max_width">
              授权函请在 (《第三方代制模式指引文档》)
              [https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1459357007&version=1&lang=zh_CN&platform=2]内下载，
              手填并加盖鲜章后，上传彩色扫描件或彩照。授权函必须加盖企业公章，或个体户店铺章、发票专用章、财务章、合同章等具备法律效力的盖章，不可使用个人私章。
            </p>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="授权函ID：" prop="protocolId">
        <el-input
          v-model.trim="form.authorizationID"
          class="max_width"
          placeholder="上传授权函后自动获取"
          disabled
        />
      </el-form-item>
      <el-form-item label="授权函有效期：" prop="end_time">
        <el-date-picker
          v-model="form.expirationDate"
          type="date"
          placeholder="选择日期"
          disabled
        />
      </el-form-item>
      <el-form-item label="类目：" prop="category">
        <el-cascader v-model="category" :options="categoryList" @change="handleChange" />
      </el-form-item>
      <el-form-item>
        <el-button class="button">取消</el-button>
        <el-button class="button" type="primary" @click="submitForm">提交审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import YPImgUpload from '@/components/NoCropperInclude'
import MemberWechatAPI from '../../model'

const memberWechatAPI = new MemberWechatAPI()

export default {
  components: {
    YPImgUpload,
  },

  data() {
    return {
      form: {
        name: '',
        logo_url: '',
        authorizationID: '',
        expirationDate: '',
        firstClass: '',
        secondClass: '',
        primary_category_id: null,
        secondary_category_id: null,
      },
      rules: {
        name: [
          { required: true, message: '请输入名称！', trigger: 'blur' },
          { max: 24, message: '不能超过24个字', trigger: 'blur' },
        ],
        logo: [{ required: true, message: '请上传图片！', trigger: 'blur' }],
        protocol: [{ required: true, message: '请上传授权函！', trigger: 'blur' }],
        protocolId: [{ required: true, message: '未能获取授权函ID！', trigger: 'blur' }],
        end_time: [{ required: true, message: '未能获取授权函有效期！', trigger: 'blur' }],
        category: [{ required: true, message: '请选择类目！', trigger: 'blur' }],
      },
      categoryList: [],
      category: [],
    }
  },

  mounted() {
    this.getBrandCategory()
  },

  methods: {
    /**
     * @description: 二级类目选择的数据，存到form变量中
     * @param {Array} val 二级类目选择的数据
     * @return:
     */
    handleChange(val) {
      this.form.primary_category_id = val[0]
      this.form.secondary_category_id = val[1]
    },

    // 查询会员卡开放类目API
    getBrandCategory() {
      memberWechatAPI.getBrandCategory().then(res => {
        this.setCategory(res.category)
      })
    },

    /**
     * @description: 重构开放类目列表数据结构
     * @param {Array} category: 查询会员卡开放类目API的返回数据
     * @return:
     */
    setCategory(category) {
      this.categoryList = category.map(item => {
        const children = item.secondary_category.map(childrenItem => {
          return {
            label: childrenItem.category_name,
            value: childrenItem.secondary_category_id,
          }
        })
        return {
          label: item.category_name,
          value: item.primary_category_id,
          children,
        }
      })
    },

    // 提交表单
    submitForm() {
      this.$emit('next')
    },
  },
}
</script>

<style lang="scss" scoped>
.application_merchant {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .form {
    .max_width {
      width: 400px;
    }
    .logo_form_itme {
      display: flex;
      .el_upload {
        width: 40px;
        height: 40px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          border-color: #409eff;
        }
      }
      .text {
        margin-left: 10px;
        line-height: 15px;
        font-size: 10px;
        color: #999999;
      }
    }
    .button {
      margin-top: 20px;
      width: 200px;
    }
  }
}
</style>
