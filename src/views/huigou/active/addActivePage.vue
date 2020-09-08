<template>
  <div class="addActive">
    <formListAdd :fromList="fromList"
                 @addKeyWord="addKeyWord"
                 @delKeyWord="delKeyWord"
                 :labelList="labelList"
                 :btnType="btnType"
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
import formListAdd from '@/components/FormComponent/index'
import { AreaCascader } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import * as http from '@/api/huigou/active/index'
export default {
  name: 'addActive',
  data () {
    return {
      fromList: {
        mainTitle: '', // 主标题
        subTitle: '', // 副标题
        otherLink: '', // 三方链接
        LabelTyle: [], // 标签
        sponsor: '', // 主办方
        organizer: '', // 承办方
        endTime: '', // 报名截止至
        activeTime: [], // 活动日期
        activeFee: '', // 活动费用
        maxPeople: '', // 最大人数
        status: 1, // 发布状态
        checkOut: 0, // 报名审核
        activeLevel: {
          one: '', // 一级分类
          two: '', // 二级分类
        },
        url: { ratio1: [] }, // 活动封面
        indexPic: { 'ratio1.45': [] }, // 缩略图
        address: '', // 场地溯源
        remark: '', // 活动详情
        otherDialog: '', // 其他提示
        activeDetail: '', // 活动详情
        // lastLink: '',//底部的三方链接
        enlistInfoList: [
          {
            type: '1', // 类型
            isCheck: true, // 是否必填
            textInfo: '姓名', // 输入文本
            showText: '文本',
            labelType: [
              {
                label: '文本',
                type: 1
              },
              {
                label: '单选',
                type: 2
              },
              {
                label: '多选',
                type: 3
              },
              {
                label: '时间选择',
                type: 4
              },
              {
                label: '手机号码',
                type: 5
              },
              {
                label: '图片',
                type: 6
              },
              {
                label: '附件',
                type: 7
              }
            ],
            keyWordList: [
              {
                keyword: '', // 选项
              }
            ]
          },
          {
            type: '1', // 类型
            isCheck: true, // 是否必填
            textInfo: '手机号', // 输入文本
            showText: '文本',
            labelType: [
              {
                label: '文本',
                type: 1
              },
              {
                label: '单选',
                type: 2
              },
              {
                label: '多选',
                type: 3
              },
              {
                label: '时间选择',
                type: 4
              },

              {
                label: '图片',
                type: 6
              },
              {
                label: '附件',
                type: 7
              }
            ],
            keyWordList: [
              {
                keyword: '', // 选项
              }
            ]
          }
        ],
        factoryPlace: '', // 店铺名称
        factoryId: ''// 店铺id
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

      netShow: false, // 表格弹框
      chooseItem: [], // 选择的数据
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(to)
    if (to.query.hasOwnProperty('id')) {
      // 此时应该是编辑活动
      to.meta.title = '编辑活动'
    } else {
      // 添加活动
      to.meta.title = '添加活动'
    }
    next()
  },
  mounted () {
    this.getLabelList()
    this.getNetType()
    if (this.$route.query.hasOwnProperty('id')) {
      // 此时应该是编辑活动
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
      // console.log(val.url)
      console.log(this.tranKeyValue(val.enlistInfoList))
      if (this.type === 'add') {
        this.$ajax.post('/sys/THuigouTiyanProduct/create', {
          product: {
            title: val.mainTitle, // 主标题
            subTitle: val.subTitle, // 副标题
            // otherUrl: val.otherLink,
            serviceIds: val.LabelTyle ? val.LabelTyle.join(',') : '', // 标签ID
            sponsor: val.sponsor, // 主办方
            contractor: val.organizer, // 承办方
            signupEndTime: val.endTime, // 报名截止
            startTime: val.activeTime[0], // 活动开始日期
            endTime: val.activeTime[1], // 活动结束日期
            currentPrice: val.activeFee ? val.activeFee : 0, // 活动费用
            promotionPerLimit: val.maxPeople, // 最大人数
            publishStatus: val.status, // 发布状态
            auditStatus: val.checkOut, // 审核状态
            // channelId: val.activeLevel.one,
            // columnId: val.activeLevel.two,
            productCategoryId: [val.activeLevel.one, val.activeLevel.two].join(','), // 活动分类标签
            address: val.address, // 活动地址
            description: val.activeDetail, // 富文本编辑活动详情
            remark: val.remark, // 活动摘要
            factoryPlace: val.factoryPlace,
            factoryId: val.factoryId,
            // tiyanSignUpModels: this.tranKeyValue(val.enlistInfoList),
            // hint: val.otherDialog,
            thirdUrl: val.otherLink, // 三方链接
            banner: this.getSubmitUrl(val.url), // 活动封面
            indexPic: this.getSubmitPic(val.indexPic)// 缩略图
          },
          signupModelList: this.tranKeyValue(val.enlistInfoList),
        }).then((res) => {
          this.$message.success('创建活动成功')
          this.$router.go(-1)
        }).catch((err) => {
          console.log(err)
        })
      } else {
        console.log(val.enlistInfoList)
        this.$ajax.post('/sys/THuigouTiyanProduct/update', {
          product: {
            id: Number(this.$route.query.id),
            title: val.mainTitle, // 主标题
            subTitle: val.subTitle, // 副标题
            // otherUrl: val.otherLink,
            serviceIds: val.LabelTyle ? val.LabelTyle.join(',') : '', // 标签ID
            sponsor: val.sponsor, // 主办方
            contractor: val.organizer, // 承办方
            signupEndTime: val.endTime, // 报名截止
            startTime: val.activeTime[0], // 活动开始日期
            endTime: val.activeTime[1], // 活动结束日期
            currentPrice: val.activeFee ? val.activeFee : 0, // 活动费用
            promotionPerLimit: val.maxPeople, // 最大人数
            publishStatus: val.status, // 发布状态
            auditStatus: val.checkOut, // 审核状态
            // channelId: val.activeLevel.one,
            // columnId: val.activeLevel.two,
            productCategoryId: [val.activeLevel.one, val.activeLevel.two].join(','), // 活动分类标签
            address: val.address, // 活动地址
            description: val.activeDetail, // 富文本编辑活动详情
            remark: val.remark, // 活动摘要
            // tiyanSignUpModels: this.tranKeyValue(val.enlistInfoList),
            // hint: val.otherDialog,
            factoryPlace: val.factoryPlace,
            factoryId: val.factoryId,
            thirdUrl: val.otherLink, // 三方链接
            banner: this.getSubmitUrl(val.url), // 活动封面
            indexPic: this.getSubmitPic(val.indexPic)// 缩略图
          },
          signupModelList: this.tranKeyValue(val.enlistInfoList),
        }).then((res) => {
          this.$message.success('修改成功')
          this.$router.go(-1)
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 处理首页图片数据
    getUrl (val) {
      if (val !== '') {
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
      if (val !== '') {
        const urlList = val.split(',')
        if (urlList.length > 1) {
          return {
            'ratio1.45': urlList,
          }
        } else {
          return {
            'ratio1.45': [urlList[0]],
          }
        }
      } else {
        return {
          'ratio1.45': [],
        }
      }
    },
    // 上传保存时候转换图片数据
    getSubmitUrl (val) {
      return val.ratio1.join(',')
    },
    // 缩略图
    getSubmitPic (val) {
      return val['ratio1.45'].join(',')
    },
    // 根据id获取详情
    getFormListByid (id) {
      this.$ajax.get(`/sys/THuigouTiyanProduct/findProductById/${id}`, {
        id: id
      }).then((res) => {
        this.fromList = Object.assign({}, {
          mainTitle: res.resObject.product.title,
          subTitle: res.resObject.product.subTitle,
          LabelTyle: res.resObject.product.serviceIds ==== '' ? [] : res.resObject.product.serviceIds.split(',').map((item) => +item),
          otherLink: res.resObject.product.thirdUrl,
          sponsor: res.resObject.product.sponsor,
          organizer: res.resObject.product.contractor,
          endTime: res.resObject.product.signupEndTime,
          activeTime: [res.resObject.product.startTime, res.resObject.product.endTime],
          activeFee: res.resObject.product.currentPrice,
          maxPeople: res.resObject.product.promotionPerLimit,
          status: res.resObject.product.publishStatus,
          checkOut: res.resObject.product.auditStatus,
          activeLevel: {
            one: res.resObject.product.productCategoryId ? Number(res.resObject.product.productCategoryId.split(',')[0]) : '',
            two: res.resObject.product.productCategoryId ? Number(res.resObject.product.productCategoryId.split(',')[1]) : ''
          },
          // publishTime: res.resObject.product.publishTime,
          // url: res.resObject.product.activePic ? res.resObject.product.activePic.split() : [],
          url: this.getUrl(res.resObject.product.indexPic),
          indexPic: this.getPic(res.resObject.product.indexPic),
          address: res.resObject.product.address,
          factoryPlace: res.resObject.factoryPlace,
          factoryId: res.resObject.factoryId,
          remark: res.resObject.product.remark,
          activeDetail: res.resObject.product.description,
          enlistInfoList: res.resObject.signupModelList.map((item) => {
            return {
              type: item.type, // 类型
              isCheck: item.isNeed === 0, // 是否必填
              textInfo: item.title, // 输入文本
              showText: this.getShowText(item.type),
              labelType: [
                {
                  label: '文本',
                  type: 1
                },
                {
                  label: '单选',
                  type: 2
                },
                {
                  label: '多选',
                  type: 3
                },
                {
                  label: '时间选择',
                  type: 4
                },

                {
                  label: '图片',
                  type: 6
                },
                {
                  label: '附件',
                  type: 7
                }
              ],
              keyWordList: item.option1 ==== '' || item.option1 === null ? [{
                keyword: '', // 选项
              }] : item.option1.split(',').map((item) => {
                return {
                  keyword: item
                }
              }),
              id: item.id,
              activeId: item.activeId,
            }
          })
        })
        console.log(this.fromList)
      })
    },
    // 转换关键字数据
    tranKeyValue (val) {
      console.log('-------')
      console.log(val)
      let result
      if (this.type == 'add') {
        // 新增数据
        result = val.map((item, index) => {
          return {
            option1: [].concat(item.keyWordList.map((items, indexs) => {
              return items.keyword
            })).join(','),
            title: item.textInfo,
            type: item.type,
            isNeed: item.isCheck ? 0 : 1
          }
        })
      } else {
        // 编辑数据
        result = val.map((item, index) => {
          return {
            option1: [].concat(item.keyWordList.map((items, indexs) => {
              return items.keyword
            })).join(','),
            title: item.textInfo,
            type: item.type,
            id: item.id,
            isNeed: item.isCheck ? 0 : 1,
            activeId: item.activeId ? item.activeId : Number(this.$route.query.id)
          }
        })
      }
      return result
    },
    // 添加报名信息关键字
    addKeyWord () {
      this.fromList.enlistInfoList.push({
        type: '1', // 类型
        isCheck: true, // 是否必填
        textInfo: '', // 输入文本
        showText: '文本',
        labelType: [
          {
            label: '文本',
            type: 1
          },
          {
            label: '单选',
            type: 2
          },
          {
            label: '多选',
            type: 3
          },
          {
            label: '日期',
            type: 4
          },
          {
            label: '附件',
            type: 6
          }
        ],
        keyWordList: [
          {
            keyword: '', // 选项
          }
        ]
      })
    },
    // 删除报名信息关键字
    delKeyWord (index, item) {
      console.log(index, item)
      if (item.textInfo === '姓名' || item.textInfo === '手机号') {
        this.$message.error('基础数据无法删除')
      } else {
        if (this.type === 'edit') {
          // 编辑的时候去调用删除接口
          this.$confirm('是否确认删除数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.fromList.enlistInfoList.splice(index, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.fromList.enlistInfoList.splice(index, 1)
        }
      }
    },
    // 删除关键字接口
    delKeyWordData (id, index) {
      this.$ajax.post('/huigou/active/deletebyId', {
        id: id
      }).then((res) => {
        if (res.resultCode === '200') {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.fromList.enlistInfoList.splice(index, 1)
        }
      })
    },
    // 获取标签列表
    getLabelList () {
      http.getLabelList({
        tagName: ''
      }).then((res) => {
        this.labelList = res.resObject.filter((item) => {
          return item.isEffect === 0
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取关键字对应类型文本
    getShowText (val) {
      switch (String(val)) {
        case '1':
          return '文本'
          break
        case '2':
          return '单选'
          break
        case '3':
          return '多选'
          break
        case '4':
          return '时间选择'
          break

        case '6':
          return '图片'
          break
        case '7':
          return '附件'
          break
      }
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
    }
  },
  components: {
    formListAdd
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
