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
               :visible.sync="true"
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
          <el-select v-model="addFrom.type"
                     placeholder="请选择类型"
                     style="width:150px;">
            <el-option v-for="item in addFrom.types"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
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
          <el-table-column prop="contactPhone"
                           label="电话"></el-table-column>
          <el-table-column prop="typeName"
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
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";
export default {
  name: 'addActivePage',
  data () {
    return {
      fromList: {
        mainTitle: '',//主标题
        subTitle: '',//副标题
        otherLink: '',//三方链接
        LabelTyle: [],//标签
        sponsor: '',//主办方
        organizer: "",//承办方
        endTime: '',//报名截止至
        activeTime: [],//活动日期
        activeFee: '',//活动费用
        maxPeople: '',//最大人数
        status: 3,//发布状态
        checkOut: 1,//报名审核
        activeLevel: {
          one: '',//一级分类
          two: '',//二级分类
        },
        url: { 'ratio1.45': [], 'ratio2': [] },//活动封面
        address: '',//场地溯源
        remark: '',//活动详情
        otherDialog: '',//其他提示
        activeDetail: '',//活动详情
        lastLink: '',//底部的三方链接
        enlistInfoList: [
          {
            type: '1',//类型
            isCheck: true,//是否必填
            textInfo: '姓名',//输入文本
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
                keyword: '',//选项
              }
            ]
          },
          {
            type: '1',//类型
            isCheck: true,//是否必填
            textInfo: '手机号',//输入文本
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
                keyword: '',//选项
              }
            ]
          }
        ],

      },
      labelList: [],//标签数据
      type: '',//操作类型
      btnType: '',//按钮文案
      pcaa: pcaa,//区域数据
      currentPage: 1,//当前页数
      tableData: [],//表格数据
      total: 0,//总数
      addFrom: {
        provinceCity: [],//区域数据
        types: [],//类型
      },//表单数据
      pageSize: 5,
      keyWard: '',
      netShow: false,//表格弹框
      chooseItem: [],//选择的数据
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(to)
    if (to.query.hasOwnProperty('id')) {
      //此时应该是编辑活动
      to.meta.title = '编辑活动'
    } else {
      // 添加活动
      to.meta.title = '添加活动'
    }
    next()
  },
  mounted () {
    this.getLabelList()
    this.getTypes()
    if (this.$route.query.hasOwnProperty('id')) {
      //此时应该是编辑活动
      console.log(this.$route.query.id)
      this.getFormListByid(this.$route.query.id)
      this.type = 'edit'
      this.btnType = '编辑保存'
    } else {
      this.type = 'add'
      this.btnType = "立即创建"
    }
  },
  methods: {
    submit (val) {
      // console.log(val.url)
      console.log(val.activeDetail)
      if (this.type == 'add') {
        this.$ajax.post('/huigou/active/createTiYanActive', {
          title: val.mainTitle,
          childTitle: val.subTitle,
          otherUrl: val.otherLink,
          labelId: val.LabelTyle ? val.LabelTyle.join(",") : '',
          sponsor: val.sponsor,
          contractor: val.organizer,
          activeDeadline: val.endTime,
          activeBegintime: val.activeTime[0],
          activeEndtime: val.activeTime[1],
          signupMoney: val.activeFee ? val.activeFee : 0,
          maxNumber: val.maxPeople,
          publishStatus: val.status,
          applyReview: val.checkOut,
          channelId: val.activeLevel.one,
          columnId: val.activeLevel.two,
          position: val.address,
          detail: val.activeDetail,//富文本编辑
          content: val.remark,
          tiyanSignUpModels: this.tranKeyValue(val.enlistInfoList),
          hint: val.otherDialog,
          threeUrl: val.lastLink,
          activePic: this.getSubmitUrl(val.url)
        }).then((res) => {
          this.$message.success("创建活动成功")
          this.$router.push('/activeManage')
        }).catch((err) => {
          console.log(err)
        })
      } else {
        console.log(val.enlistInfoList)
        this.$ajax.post('/huigou/active/updateTiYanActive', {
          id: Number(this.$route.query.id),
          title: val.mainTitle,
          childTitle: val.subTitle,
          otherUrl: val.otherLink,
          labelId: val.LabelTyle ? val.LabelTyle.join(",") : '',
          sponsor: val.sponsor,
          contractor: val.organizer,
          activeDeadline: val.endTime,
          activeBegintime: val.activeTime[0],
          activeEndtime: val.activeTime[1],
          signupMoney: val.activeFee ? val.activeFee : 0,
          maxNumber: val.maxPeople,
          publishStatus: val.status,
          applyReview: val.checkOut,
          channelId: val.activeLevel.one,
          columnId: val.activeLevel.two,
          position: val.address,
          detail: val.activeDetail,//富文本编辑
          content: val.remark,
          tiyanSignUpModels: this.tranKeyValue(val.enlistInfoList),
          hint: val.otherDialog,
          threeUrl: val.lastLink,
          activePic: this.getSubmitUrl(val.url),
          publishTime: val.publishTime
        }).then((res) => {
          this.$message.success("修改成功")
          this.$router.push('/activeManage')
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    //处理图片数据
    getUrl (val) {
      if (val !== '') {
        let urlList = val.split(',')
        if (urlList.length > 1) {
          return {
            'ratio1.45': [urlList[0]],
            'ratio2': urlList.filter((item, index) => index !== 0)
          }
        } else {
          return {
            'ratio1.45': [urlList[0]],
            'ratio2': []
          }
        }
      } else {
        return {
          'ratio1.45': [],
          'ratio2': []
        }
      }
    },
    //上传保存时候转换图片数据
    getSubmitUrl (val) {
      return val['ratio1.45'].join(',')
    },
    //根据id获取详情
    getFormListByid (id) {
      this.$ajax.get('/huigou/active/selectTiYanActiveDetail', {
        params: {
          id: id
        }
      }).then((res) => {
        this.fromList = Object.assign({}, {
          mainTitle: res.data.title,
          subTitle: res.data.childTitle,
          LabelTyle: res.data.labelId === '' ? [] : res.data.labelId.split(',').map((item) => +item),
          otherLink: res.data.otherUrl,
          sponsor: res.data.sponsor,
          organizer: res.data.contractor,
          endTime: res.data.activeDeadline,
          activeTime: [res.data.activeBegintime, res.data.activeEndtime],
          activeFee: res.data.signupMoney,
          maxPeople: res.data.maxNumber,
          status: res.data.publishStatus,
          checkOut: res.data.applyReview,
          activeLevel: {
            one: res.data.channelId,
            two: res.data.columnId
          },
          publishTime: res.data.publishTime,
          // url: res.data.activePic ? res.data.activePic.split() : [],
          url: this.getUrl(res.data.activePic),
          address: res.data.position,
          remark: res.data.content,
          activeDetail: res.data.detail,
          otherDialog: res.data.hint,
          lastLink: res.data.threeUrl,
          enlistInfoList: res.data.tiyanSignUpModels.map((item) => {
            return {
              type: item.type,//类型
              isCheck: item.isNeed === 0 ? true : false,//是否必填
              textInfo: item.title,//输入文本
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
              keyWordList: item.option === '' ? [{
                keyword: '',//选项
              }] : item.option.split(',').map((item) => {
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
    //转换关键字数据
    tranKeyValue (val) {
      console.log('-------')
      console.log(val)
      let result;
      if (this.type == 'add') {
        //新增数据
        result = val.map((item, index) => {
          return {
            option: [].concat(item.keyWordList.map((items, indexs) => {
              return items.keyword
            })).join(','),
            title: item.textInfo,
            type: item.type,
            isNeed: item.isCheck ? 0 : 1
          }
        })
      } else {
        //编辑数据
        result = val.map((item, index) => {
          return {
            option: [].concat(item.keyWordList.map((items, indexs) => {
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
    //添加报名信息关键字
    addKeyWord () {
      this.fromList.enlistInfoList.push({
        type: '1',//类型
        isCheck: true,//是否必填
        textInfo: '',//输入文本
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
            keyword: '',//选项
          }
        ]
      })
    },
    //删除报名信息关键字
    delKeyWord (index, item) {
      console.log(index, item)
      if (item.textInfo === "姓名" || item.textInfo === "手机号") {
        this.$message.error("基础数据无法删除")
      } else {
        if (this.type === 'edit') {
          // 编辑的时候去调用删除接口
          this.$confirm('是否确认删除数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delKeyWordData(item.id, index)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.fromList.enlistInfoList.splice(index, 1)
        }
      }


    },
    //删除关键字接口
    delKeyWordData (id, index) {
      this.$ajax.post('/huigou/active/deletebyId', {
        id: id
      }).then((res) => {
        if (res.resultCode === '200') {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.fromList.enlistInfoList.splice(index, 1)
        }
      })
    },
    //获取标签列表
    getLabelList () {
      this.$ajax.get('/huigou/active/tag/queryall', {
        params: {
          tagName: '',

        }
      }).then((res) => {
        this.labelList = res.data.filter((item) => {
          return item.isEffect === 1
        })
        console.log(this.labelList)
      }).catch((err) => {
        console.log(err)
      })
    },
    //获取关键字对应类型文本
    getShowText (val) {
      switch (val) {
        case "1":
          return '文本'
          break
        case "2":
          return '单选'
          break
        case "3":
          return '多选'
          break
        case "4":
          return '时间选择'
          break

        case "6":
          return '图片'
          break
        case "7":
          return '附件'
          break
      }
    },
    //导入位置数据获取
    getPosition () {
      this.$ajax.post("/back/venue/getVenuelist",
        {
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
          keyWard: this.keyWard,
          provinceId: typeof (this.addFrom.provinceCity[0]) === 'undefined' ? '' : this.addFrom.provinceCity[0],
          cityId: typeof (this.addFrom.provinceCity[1]) === 'undefined' ? '' : this.addFrom.provinceCity[1],
          type: '',
        },
      ).then((res) => {
        this.tableData = res.resObject.index
        this.total = res.resObject.totalCount
        console.log(res)
        this.netShow = true
      })
    },
    //获取数据类型
    getTypes () {
      // this.$ajax.post(
      //   "/back/venue/getVenueTypelist",
      //   {
      //     page: 1,
      //     limit: 999999,
      //     typeName: '',
      //   },
      // ).then((res) => {
      //   this.addFrom.types = res.resObject.list
      // })
    },
    //表格确认下按钮
    confirm () {
      console.log("确认按钮")
      if (this.chooseItem.length > 1) {
        this.$message.error("一次只能导入一个地区")
      } else if (this.chooseItem.length == 0) {
        this.$message.error("未选择数据")
      } else {
        this.fromList.address = this.chooseItem[0].address
        this.netShow = false

      }
    },
    //页展示条数切换
    handleSizeChange (val) {
      console.log(val)
    },
    //当前页数改变
    handleCurrentChange (val) {
      console.log(val)
    },
    handleSelectionChange (val) {
      this.chooseItem = val
      // this.
      console.log(this.chooseItem)
    },
    //搜索
    goSubmit () {
      console.log(this.addFrom)
      this.getPosition()
    }
  },
  components: {
    formListAdd
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
