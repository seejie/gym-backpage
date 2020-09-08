<template>
  <div class="addActive">
    <formListAdd :fromList="fromList"
                 :formItems='formItems'
                 :formRules='formRules'
                 :addEdit='type'
                 :btnType="btnType"
                 :tabelData='productAttributeList'
                 @getPriceTable='getPriceTable'
                 @getTypeName='getTypeName'
                 @getPosition="getPosition"
                 @submit="submit"></formListAdd>
    <el-dialog title="导入网点"
               :visible.sync="netShow"
               width="800px">
      <el-form :model="addFrom"
               ref="addFrom"
               style="display:flex;justify-content: space-between;marginBottom:15px;">
        <el-form-item label=""
                      label-width="100"
                      prop="provinceCity"
                      v-if="netShow">
          <area-select v-model="addFrom.provinceCity"
                       type="code"
                       :data="pcaa"
                       :level="1"></area-select>
        </el-form-item>
        <el-form-item label=""
                      label-width="100"
                      prop="type">
          <el-select v-model="addFrom.typeId"
                     placeholder="请选择类型"
                     style="width:150px;">
            <el-option v-for="item in addFrom.types"
                       :key="item.value"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100"
                      prop="name">
          <el-input v-model="addFrom.keyWard"
                    placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-button type="primary"
                   style="height:40px;"
                   @click="goSubmit('addFrom')">搜 索</el-button>
      </el-form>
      <div class="">
        <el-table :data="tableData"
                  border
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index"
                           label="序号"></el-table-column>
          <el-table-column prop="banner"
                           label="详情页banner">
            <template slot-scope="scope">
              <div class="title">
                <div class="img-wrap">
                  <img :src="scope.row.venuePic"
                       alt=""
                       width="60">
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="名称"></el-table-column>
          <el-table-column prop="address"
                           label="地址"></el-table-column>
          <el-table-column prop="mobile"
                           label="电话"></el-table-column>
          <el-table-column prop="categoryName"
                           label="类型"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[5, 10]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"
                       style="marginTop:20px;"></el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="textAlign:center;">
        <el-button @click="netShow=false">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formListAdd from '@/components/FormComponent/common.vue'
import * as http from '@/api/huigou/hotel/facilitysetting.js'
import * as tagHttp from '@/api/huigou/hotel/label.js'
import { AreaCascader } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
export default {
  name: 'addHotel',
  data () {
    return {
      fromList: {
        name: '', // 主标题
        subTitle: '', // 副标题
        banner: { ratio1: [] }, // 景点封面
        indexPic: { ratio1: [] }, // 缩略图
        thirdUrl: '', // 三方链接
        serviceIds: [], // 标签
        facIds: [], // 设施
        refundRulesType: 1, // 退款类型
        refundRules: '', // 退款说明
        publishStatus: 1, // 发布状态
        brandId: '', // 酒店品牌
        note: '', // 入住须知
        productCategoryId: [], // 分类ID
        isAdvance: 1, // 是否需要提前购买
        address: '', // 详细地址
        decorateTime: '', // 装修时间
        forbidStatus: 0, // 是否禁言（否）
        description: '', // 酒店详情
        productCategoryName: '', // 品类名称
        productAttributeListCode: '',
        productAttributeList: [], // 酒店价格集合
        factoryPlace: '', // 店铺名称
        factoryId: ''// 店铺id
      },
      productAttributeList: [],
      formItems: [
        { label: '酒店标题', placeholder: '请填写酒店标题，1-30字', type: 'text', prop: 'name', max: 30 },
        { label: '酒店副标题', placeholder: '请填写酒店副标题，1-30字', type: 'text', prop: 'subTitle', max: 30 },
        {
          label: '景点封面',
          placeholder: '请填写酒店副标题，1-30字',
          type: 'img',
          prop: 'banner',
          max: 9,
          cropper: [{
            name: '景点封面',
            ratio_x: 1,
            ratio_y: 1,
            ratio: 1,
            desc: '你的用户将在酒店详情页各类别票种、惠购查看更多酒店列表，看到此封面'
          }]
        },
        {
          label: '缩略图',
          placeholder: '请填写酒店副标题，1-30字',
          type: 'img',
          prop: 'indexPic',
          max: 9,
          cropper: [{
            name: '缩略图',
            ratio_x: 1,
            ratio_y: 1,
            ratio: 1,
            desc: '你的用户将在酒店详情页各类别票种、惠购查看更多酒店列表，看到此封面'
          }]
        },
        { label: '三方链接', placeholder: '请填写三方链接，前台访问直接跳转', type: 'text', prop: 'thirdUrl' },
        { label: '商品标签', placeholder: '', type: 'checkbox', prop: 'serviceIds', options: [] },
        { label: '设施', placeholder: '', type: 'checkbox', prop: 'facIds', options: [] },
        // { label: '使用须知', placeholder: '请填写使用须知,1-200字', type: 'textArea', prop: 'note', max: 200 },
        { label: '装修时间', placeholder: '', type: 'date', prop: 'decorateTime' },
        {
          label: '退款规则',
          placeholder: '',
          type: 'radio',
          prop: 'refundRulesType',
          options: [{ label: '支持退款', value: 1 },
            { label: '不支持退款', value: 2 }]
        },
        { label: '', placeholder: '请填写退款规则', type: 'textArea', prop: 'refundRules' },
        { label: '商品状态', placeholder: '', type: 'radio', prop: 'publishStatus', options: [{ label: '下架', value: 0 }, { label: '立即发布', value: 1 }] },
        { label: '酒店品牌', placeholder: '请选择码商', type: 'select', prop: 'brandId', options: [] },
        { label: '类型选择', prop: 'productCategoryId', placeholder: '请选择', type: 'link', options: [], cb: this.changeLink },
        { label: '房型规格', placeholder: '', type: 'hotelDetail', prop: 'productAttributeListCode' },
        { label: '产地溯源', placeholder: '可直接关联，若无可填详细信息', type: 'address', prop: 'address' },
        { label: '酒店详情', placeholder: '填写酒店详情信息', type: 'detail', prop: 'description' },
        { label: '入住须知', placeholder: '填写入住须知', type: 'detail', prop: 'note' },
      ],
      formRules: {
        name: [
          { required: true, message: '请填写酒店标题', trigger: 'blur' },
        ],
      },
      labelList: [], // 标签数据
      type: '', // 操作类型
      btnType: '', // 按钮文案
      pcaa: pcaa, // 区域数据
      currentPage: 1, // 当前页数
      tableData: [], // 表格数据
      total: 0, // 总数
      addFrom: {
        provinceCity: [], // 区域数据
        types: [], // 类型
        keyWard: '',
        typeId: '',
      }, // 表单数据
      pageSize: 5,
      keyWard: '',
      netShow: false, // 表格弹框
      chooseItem: [], // 选择的数据
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.query.hasOwnProperty('id')) {
      // 此时应该是编辑酒店
      to.meta.title = '编辑酒店'
    } else {
      // 添加酒店
      to.meta.title = '添加酒店'
    }
    next()
  },
  created () {
    this.getLabelData()
    this.getFacIdsList()
    this.getBrandData()
    this.getLabelList()
    this.getNetType()
    // this.getTypes()
    if (this.$route.query.hasOwnProperty('id')) {
      // 此时应该是编辑酒店
      this.id = this.$route.query.hasOwnProperty('id')
      this.getFormListByid(this.$route.query.id)
      this.type = 'edit'
      this.btnType = '编辑保存'
    } else {
      this.type = 'add'
      this.btnType = '立即创建'
    }
  },
  methods: {
    submit (val) {
      if (this.type === 'add') {
        this.$ajax.post('/sys/THuigouHotelProduct/create', {
          product: {
            name: val.name, // 主标题
            subTitle: val.subTitle, // 副标题
            banner: this.getSubmitPic(val.banner), // 景点封面
            indexPic: this.getSubmitUrl(val.indexPic), // 景点封面
            thirdUrl: val.thirdUrl, // 三方链接
            serviceIds: val.serviceIds.join(','), // 商品标签id
            facIds: val.facIds.join(','), // 设施id
            decorateTime: val.decorateTime, // 装修时间
            refundRulesType: val.refundRulesType, // 退款类型
            refundRules: val.refundRules, // 退款说明
            publishStatus: val.publishStatus, // 发布状态
            deleteStatus: 0, // 0不删除
            brandName: val.brandId, // 酒店品牌
            productCategoryId: val.productCategoryId ? val.productCategoryId.join(',') : '',
            address: val.address, // 详细地址
            description: val.description, // 酒店详情
            productCategoryName: val.productCategoryName, // 类型名称
            forbidStatus: 0, // 是否禁言默认不禁言
            factoryPlace: val.factoryPlace,
            factoryId: val.factoryId,
            note: val.note, // 使用须知
          },
          productAttributeList: val.productAttributeList, // 酒店价格
        }).then((res) => {
          this.$message.success('创建酒店成功')
          this.$router.go(-1)
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$ajax.post('/sys/THuigouHotelProduct/update', {
          product: {
            id: Number(this.$route.query.id),
            name: val.name, // 主标题
            subTitle: val.subTitle, // 副标题
            banner: this.getSubmitPic(val.banner), // 景点封面
            indexPic: this.getSubmitUrl(val.indexPic), // 景点封面
            thirdUrl: val.thirdUrl, // 三方链接
            serviceIds: val.serviceIds.join(','), // 商品标签id
            facIds: val.facIds.join(','), // 设施id
            decorateTime: val.decorateTime, // 装修时间
            refundRulesType: val.refundRulesType, // 退款类型
            refundRules: val.refundRules, // 退款说明
            publishStatus: val.publishStatus, // 发布状态
            deleteStatus: 0, // 0不删除
            brandName: val.brandId, // 酒店品牌
            factoryPlace: val.factoryPlace,
            factoryId: val.factoryId,
            productCategoryId: val.productCategoryId ? val.productCategoryId.join(',') : '',
            address: val.address, // 详细地址
            description: val.description, // 酒店详情
            productCategoryName: val.productCategoryName, // 类型名称
            forbidStatus: 0, // 是否禁言默认不禁言
            note: val.note, // 使用须知

          },
          productAttributeList: val.productAttributeList, // 酒店价格
        }).then((res) => {
          this.$message.success('修改成功')
          this.$router.go(-1)
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    getTypeName (val) {
      this.fromList.productCategoryName = val.join('-')
    },
    getPriceTable (val) {
      this.fromList.productAttributeList = val.map((res) => {
        return {
          ...res,
          attributeIcon: res.attributeIcon && res.attributeIcon.ratio1 ? res.attributeIcon.ratio1[0] : ''
        }
      })
    },
    changeLink (val) {
      console.log(val)
    },
    // 获取设施列表
    getFacIdsList () {
      http.getLabelList().then((res) => {
        this.formItems.forEach((list) => {
          if (list.prop === 'facIds') {
            list.options = res.resObject.map((item) => {
              return {
                label: item.name,
                value: item.id
              }
            })
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // 处理首页图片数据
    getUrl (val) {
      if (val) {
        const urlList = val.split(',')
        if (urlList.length > 1) {
          return {
            ratio1: urlList,
          }
        } else {
          return {
            ratio1: [urlList[0]],
          }
        }
      } else {
        return {
          ratio1: [],
        }
      }
    },
    // 处理缩略图数据
    getPic (val) {
      if (val !=== '') {
        const urlList = val.split(',')
        if (urlList.length > 1) {
          return {
            ratio1: urlList,
          }
        } else {
          return {
            ratio1: [urlList[0]],
          }
        }
      } else {
        return {
          ratio1: [],
        }
      }
    },
    // 上传保存时候转换图片数据
    getSubmitUrl (val) {
      return val.ratio1.join(',')
    },
    // 缩略图
    getSubmitPic (val) {
      return val.ratio1.join(',')
    },
    // 根据id获取详情
    getFormListByid (id) {
      this.$ajax.get(`/sys/THuigouHotelProduct/findProductById/${id}`, {
        id: id
      }).then((res) => {
        console.log(res.resObject.product.note)
        this.fromList = {
          name: res.resObject.product.name, // 主标题
          subTitle: res.resObject.product.subTitle, // 副标题
          banner: this.getUrl(res.resObject.product.banner), // 景点封面
          indexPic: this.getUrl(res.resObject.product.indexPic), // 景点封面
          thirdUrl: res.resObject.product.thirdUrl, // 三方链接
          serviceIds: res.resObject.product.serviceIds.split(',').map(res => Number(res)), // 商品标签id
          refundRulesType: Number(res.resObject.product.refundRulesType), // 退款类型
          publishStatus: Number(res.resObject.product.publishStatus), // 发布状态
          refundRules: res.resObject.product.refundRules, // 退款说明
          productCategoryId: res.resObject.product.productCategoryId ? res.resObject.product.productCategoryId.split(',').map(res => Number(res)) : '',
          address: res.resObject.product.address, // 详细地址
          decorateTime: res.resObject.product.decorateTime, // 装修时间
          description: res.resObject.product.description, // 酒店详情
          facIds: res.resObject.product.facIds.split(',').map(res => Number(res)), // 商品标签id
          // productAttributeList: res.resObject.productAttributeList,
          brandId: res.resObject.product.brandName, // 品牌名称
          factoryPlace: res.resObject.product.factoryPlace,
          factoryId: res.resObject.product.factoryId,
          forbidStatus: Number(res.resObject.product.forbidStatus), // 是否禁言默认不禁言
          note: res.resObject.product.note, // 使用须知
        }
        this.productAttributeList = JSON.parse(JSON.stringify(res.resObject.productAttributeList))
        // console.log(res.resObject.product.facIds.split(',').map(res => Number(res)))
      })
    },
    // 获取品牌数据
    getBrandData () {
      this.$ajax.get('/sys/THuigouHotelBrand/findAll').then((res) => {
        this.formItems.forEach((list) => {
          if (list.prop === 'brandId') {
            list.options = res.resObject.map((item) => {
              return {
                label: item.brandName,
                value: item.brandId
              }
            })
          }
        })
      })
    },
    // 获取标签列表
    getLabelList () {
      tagHttp.getLabelList().then((res) => {
        const arr = res.resObject.filter((item) => {
          return item.isValid === 1
        })
        this.formItems.forEach((item) => {
          if (item.prop === 'serviceIds') {
            item.options = arr.map((item) => {
              return {
                label: item.name,
                value: item.id
              }
            })
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    getNetType () {
      // 获取网点列表
      this.$ajax
        .get('/storemanager/store-category/list', {
          params: { unitType: '32' },
        })
        .then(res => {
          if (res.resCode === 200) {
            this.addFrom.types = res.resObject.list
          }
        })
    },
    // 导入位置数据获取
    getPosition () {
      this.$ajax.get('/storemanager/store/list',
        {
          params: {
            unitType: '32',
            category: this.addFrom.typeId,
            provinceId: typeof (this.addFrom.provinceCity[0]) === 'undefined' ? '' : this.addFrom.provinceCity[0],
            cityId: typeof (this.addFrom.provinceCity[1]) === 'undefined' ? '' : this.addFrom.provinceCity[1],
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.addFrom.keyWard
          }
        },
      ).then((res) => {
        this.tableData = res.resObject.list.map((res) => {
          return {
            ...res,
            venuePic: res.storeImage[0] ? res.storeImage[0].url : ''
          }
        })
        this.total = res.resObject.totalCount
        console.log(res)
        this.netShow = true
      })
    },
    // 表格确认下按钮
    confirm () {
      console.log('确认按钮')
      if (this.chooseItem.length > 1) {
        this.$message.error('一次只能导入一个地区')
      } else if (this.chooseItem.length == 0) {
        this.$message.error('未选择数据')
      } else {
        this.fromList.address = this.chooseItem[0].address
        this.fromList.factoryId = this.chooseItem[0].id
        this.fromList.factoryPlace = this.chooseItem[0].name
        this.netShow = false
      }
    },
    // 页展示条数切换
    handleSizeChange (val) {
      console.log(val)
      this.pageSize = val
      this.getPosition()
    },
    // 当前页数改变
    handleCurrentChange (val) {
      console.log(val)
      this.currentPage = val
      this.getPosition()
    },
    handleSelectionChange (val) {
      this.chooseItem = val
    },
    // 搜索
    goSubmit () {
      this.getPosition()
    },
    // 获取品类下拉数据
    async getLabelData () {
      const arr = []
      this.$ajax.get('/sys/THuigouHotelCategory/findAll', {
        params: {
          catGrade: 1
        }
      }).then((res) => {
        res.resObject.map(async (list) => {
          const data = {
            label: list.catName,
            value: list.catId,
            children: await this.getChildLabel(list.catId)
          }
          arr.push(data)
        })
        this.formItems[12].options = arr
        console.log(this.formItems[12].options)
      }).catch((err) => {
        console.log(err)
      })
    },
    async getChildLabel (id) {
      return new Promise(async resolve => {
        resolve(await this.getChildData(id))
      })
    },
    getChildData (id) {
      let childrenArr = []
      return new Promise((resolve) => {
        this.$ajax.get('/sys/THuigouHotelCategory/findAll', {
          params: {
            catGrade: 2,
            catParentId: id
          }
        }).then((res) => {
          childrenArr = res.resObject.map((list) => {
            return {
              label: list.catName,
              value: list.catId
            }
          })
          resolve(childrenArr)
        })
      })
    }
  },
  components: {
    formListAdd,
  },
  watch: {
    netShow: {
      handler (val) {
        if (val === false) {
          this.addFrom.typeId = ''
          this.addFrom.keyWard = ''
          this.addFrom.provinceCity = []
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.addActive {
  @extend %fill;
  padding: 10px 15%;
  /deep/ .area-select {
    line-height: 40px;
    height: 40px;
    .area-selected-trigger {
      padding: 0 0 0 12px;
    }
  }
  /deep/ .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
}
</style>
