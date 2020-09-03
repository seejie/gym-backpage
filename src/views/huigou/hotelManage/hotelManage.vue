<template>
  <div class="managePage">
    <!-- 表单 -->
    <div class="from-wrap">
      <topForm :formData='formData'
               @search='search'
               @reset='reset'
               @handleChange='handleChange'
               :formItems='formItems'></topForm>
    </div>
    <!-- 表格 -->
    <div class="table-wrap">
      <myTable hasSelection
               hasTopButton
               :data="list"
               :operate="operateData"
               :columns='listColums'
               :topBtnList="btnList"
               @commitSelection="commitSelection"
               @moreData="moreData"
               @allDown="allDown"
               @checkSet="checkSet"
               @allUp="allUp"
               @goLine="goLine"
               @forbid="forbid"
               @change='changeComment'
               @goTop="goTop"
               @editForm="editForm"
               @deleltRow="deleteRow">
      </myTable>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     background
                     :page-sizes="[5, 10, 15]"
                     :page-size="currentPageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount">>
      </el-pagination>
    </div>
    <!-- 删除弹框 -->
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="30%">
      <span>确定删除当前数据？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="commit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核弹框 -->
    <el-dialog title="审核设置"
               :visible.sync="reViewShow"
               width="30%">
      <el-form label-width="120px"
               label-position="left">
        <el-form-item label="是否启用">
          <el-radio-group v-model="reView">
            <el-radio label="开启"></el-radio>
            <el-radio label="关闭"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="reViewShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="commit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as http from '@/api/huigou/hotel/brand.js'
export default {
  data () {
    return {
      formData: {
        title: '', // 搜索标题
        publishStatus: '', // 发布状态
        position: '', // 发布位置
        isComment: '', // 评论全权限
        payType: '', // 付费类型
        sponsor: '', // 主办方
        // columnId: '',//活动类型
        brandName: '',
        labelIdOne: '',
        productCategoryId: [],
        time: [], // 活动时间

      },
      formItems: [
        { label: '搜索名称', model: 'title', placeholder: '请输入名称', type: 'text' },
        { label: '发布状态', model: 'publishStatus', placeholder: '请输入标题', type: 'select', options: [{ label: '下架', value: 0 }, { label: '上架', value: 1 }] },
        { label: '发布位置', model: 'position', placeholder: '请选择地址', type: 'text' },
        // { label: '评论权限', model: 'isComment', placeholder: '请选择', type: 'select', options: [{ label: '关闭', value: 1 }, { label: '开启', value: 0 }] },
        { label: '发布单位', model: 'sponsor', placeholder: '请输入发布单位', type: 'text' },
        { label: '发布时间', model: 'time', placeholder: '请选择', type: 'datetimerange' },
        { label: '品类筛选', model: 'productCategoryId', placeholder: '请选择', type: 'link', options: [] },
        { label: '品牌名称', model: 'brandName', placeholder: '请选择品牌', type: 'select', options: [] },
      ],
      dialogFrom: {
        input: '',
        selectType: '1'
      },
      chooseItem: [], // 选中的行数
      currentPage: 1, // 当前页数
      chooseIdArr: [], // 选择的id
      dialogVisible: false, // 删除弹框
      tableData: [

      ], // 传给表格组件的数据
      operateData: [], // 表格操作数据
      dialogData: [],
      currentPageSize: 10, // 每页条数
      totalCount: 0, // 请求到的总数
      list: [
      ], // 表格数据
      listColums: [
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'title', // <String>  对应属性名
          type: 'title',
          width: '300px',
          label: '标题', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'publishStatus', // <String>  对应属性名
          label: '发布状态', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'isEffect', // <String>  对应属性名
          label: '评论权限', // <String>   表头标签
          type: 'switch',
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'productCategoryName', // <String>  对应属性名
          label: '活动分类', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'unit', // <String>  对应属性名
          label: '发布单位', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'publishTime', // <String>  对应属性名
          label: '发布时间', // <String>   表头标签
        },
        {
          hasSort: false,
          prop: 'pinglunNum',
          label: '评论数'
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'pinglunNum', // <String>  对应属性名
          label: '访问量', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'operat', // <String>  对应属性名
          label: '操作', // <String>   表头标签
          isMoreShow: true,
          operateData: [
            {
              btn: '编辑',
              cb: this.editForm
            },
            // {
            //   btn: '删除',
            //   cb: this.del
            // },
          ]
        },

      ],
      nextMenulist: [], // 房间类型下拉框
      reView: '',
      reViewShow: false,

      btnList: [
        {
          btnText: '创建房间',
          type: 'primary',
          cb: this.addHotel
        },
        // {
        //   btnText: '审核设置',
        //   cb: this.checkSet
        // },
        {
          btnText: '批量上线',
          cb: this.allUp
        },
        {
          btnText: '批量下线',
          cb: this.allDown
        },
        {
          btnText: '批量删除',
          type: 'danger',
          cb: this.deleteRow
        }
      ],
      chooseActiveId: '', // 点击数据选中的id
      sinuplists: [], // 报名列表
      signTotalCount: 0, // 报名总数
      signCurrentPageSize: 5,
      signCurrentPage: 1
    }
  },
  created () {
    this.getLabelData()// 获取分类数据
    this.getBrandList() // 获取品牌列表
    // this.getReviewStatus()
  },
  mounted () {
    this.getHotelList()
  },
  methods: {
    // 搜索按钮
    search () {
      this.getHotelList()
    },
    // 重置
    reset () {
      this.formData = {
        title: '', // 搜索标题
        publishStatus: '', // 发布状态
        position: '', // 发布位置
        isComment: '', // 评论全权限
        payType: '', // 付费类型
        sponsor: '', // 主办方
        productCategoryId: [],
        // columnId: '',//活动类型
        time: []// 活动时间
      }
      this.getHotelList()
    },
    // 通过接口获取数据
    getHotelList () {
      console.log(this.formData)
      this.$ajax.get('/sys/THuigouHotelProduct/findList', {
        params: {
          name: this.formData.title,
          publishStatus: this.formData.publishStatus,
          unit: this.formData.sponsor,
          address: this.formData.position,
          productCategoryId: this.formData.productCategoryId[1],
          brandName: this.formData.brandName,
          deleteStatus: 0, // 查询未删除状态的数据
          publishStartTime: this.formData.time && this.formData.time.length !== 0 ? this.formData.time[0] : null,
          publishEndTime: this.formData.time && this.formData.time.length !== 0 ? this.formData.time[1] : null,
          pageNum: this.currentPage,
          pageSize: this.currentPageSize,
          sortStr: 'stick desc'
        }
      }).then((res) => {
        this.list = []
        this.totalCount = res.resObject.total
        res.resObject.list.map((item) => {
          this.list.push({
            ...item.product,
            title: {
              oneTitle: item.product.name,
              twoTitle: item.product.subTitle,
              // imgUrl: item.attributeIcon.split(',')[0]
              imgUrl: item.product.indexPic
            },
            pinglunNum: item.pinglunNum,
            isEffect: item.product.forbidStatus == 1 ? 0 : 1,
            // // columnLabel: item.columnId ? this.getTypeLabel(item.columnId) : '未设置',
            publishTime: item.product.createTime == null ? '' : this.$moment(item.product.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
      })
    },
    // 获取品牌数据
    getBrandList () {
      http.getTabelList().then((res) => {
        this.formItems[6].options = res.resObject.map((list) => {
          return {
            label: list.brandName,
            value: list.brandName
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    // 查询审核状态
    getReviewStatus () {
      this.$ajax.get('/huigou/active/selectReview', {

      }).then((res) => {
        console.log(res)
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getHotelList()
    },
    signHandleCurrentChange (val) {
      this.signCurrentPage = val
      this.getSinuplists()
    },
    handleSizeChange (val) {
      this.currentPageSize = val
      this.getHotelList()
    },
    signHandleSizeChange (val) {
      this.signCurrentPageSize = val
      this.getSinuplists()
    },
    // 添加按钮
    addHotel () {
      this.$router.push({
        name: 'addHotel'
      })
    },
    editForm (val) {
      console.log(val.id)
      this.$router.push({
        name: 'addHotel',
        query: {
          id: val.id
        }
      })
    },
    handleDelete (val) {

    },
    // 表格选择
    commitSelection (val) {
      this.chooseItem = val
    },
    // 删除事件
    deleteRow (row) {
      console.log(row)
      if (row !== '') {
        // 删除单行
        this.chooseItem = []
        this.dialogVisible = true
        this.chooseItem.push(row)
      } else {
        if (this.chooseItem.length === 0) {
          this.$message.error('请选择要删除的数据')
        } else {
          this.chooseIdArr = this.chooseItem.map((item) => {
            return item.status
          })
          this.dialogVisible = true
        }
      }
    },
    // 弹框确定事件
    commit (val) {
      this.$ajax.get('/sys/THuigouHotelProduct/updateDeletes', {
        params: {
          idsArr: this.chooseItem.length > 1 ? this.chooseItem.map((item) => item.id).join(',') : this.chooseItem[0].id,
          delStatus: 1
        }
      }).then((res) => {
        this.$message.success('删除成功')
        this.dialogVisible = false
        this.getHotelList()
      }).catch(() => {
        this.chooseItem = []
        this.dialogVisible = false
      })
    },
    // 评论开关
    changeComment (val) {
      console.log(val)
      this.$ajax.post('/sys/THuigouHotelProduct/update', {
        product: {
          id: val.id,
          forbidStatus: val.forbidStatus == 1 ? 0 : 1,
        }
      }).then((res) => {
        val.forbidStatus == 1 ? this.$message.success('开启评论') : this.$message.success('关闭评论')
        this.getHotelList()
      })
      // this.$confirm(message)
      //   .then(_ => {
      //     console.log(1111)
      //     console.log(val.id)

      //   })
      //   .catch(_ => { });
    },
    // 更多数据
    moreData (val) {
      console.log(val)
      this.chooseActiveId = val.id
      // 获取报名列表数据
      this.columns.forEach((item) => {
        if (item.type === 'switchs') {
          item.disabled = val.applyReview === 0
        }
      })
      this.getSinuplists()
    },
    // 表格更多--上线
    goLine (item) {
      if (item.publishStatus == 1) {
        this.$confirm('确认下线？')
          .then(_ => {
            this.$ajax.get('/sys/THuigouHotelProduct/updatePublish', {
              params: {
                idsArr: String(item.id),
                publishStatus: 0
              }
            }).then((res) => {
              this.$message.success('下架成功')
              this.getHotelList()
            })
          })
          .catch(_ => { })
      } else {
        this.$confirm('确认上线？')
          .then(_ => {
            this.$ajax.get('/sys/THuigouHotelProduct/updatePublish', {
              params: {
                idsArr: String(item.id),
                publishStatus: 1
              }
            }).then((res) => {
              this.$message.success('上线成功')
              this.getHotelList()
            })
          })
          .catch(_ => { })
      }
    },
    // 表格更多--禁言
    forbid (item) {
      console.log(item.isComment)
      const message = item.isComment == 1 ? '确认取消禁言？' : '确认禁言？'
      this.$confirm(message)
        .then(_ => {
          this.$ajax.post('/sys/THuigouHotelProduct/update', {
            commentRole: item.commentRole == 1 ? 0 : 1,
            id: item.id
          }).then((res) => {
            item.commentRole == 1 ? this.$message.success('取消禁言成功') : this.$message.success('禁言成功')
            this.getHotelList()
          })
        })
        .catch(_ => { })
    },
    // 置顶
    goTop (item) {
      const message = item.stick == 0 ? '确认置顶？' : '确认取消置顶'
      this.$confirm(message)
        .then(_ => {
          if (item.stick == 0) {
            //
            this.isGoTop(item.id)
          } else {
            // 取消置顶
            this.isGoDown(item.id)
          }
        })
        .catch(_ => { })
    },
    // 置顶确认
    isGoTop (id) {
      this.$ajax.post('/sys/THuigouHotelProduct/update', {
        product: {
          id: id,
          stick: 1
        }
      }).then((res) => {
        this.$message.success('置顶成功')
        this.getHotelList()
      })
    },
    // 取消置顶
    isGoDown (id) {
      this.$ajax.post('/sys/THuigouHotelProduct/update', {
        product: {
          id: id,
          stick: 0
        }
      }).then((res) => {
        this.$message.success('取消置顶')
        this.getHotelList()
      })
    },
    checkSet () {
      console.log('审核设置')
      this.reViewShow = true
    },
    allUp () {
      if (this.chooseItem.length == 0) {
        this.$message.error('请选择数据')
      } else {
        const id = this.chooseItem.map((item) => {
          return item.id
        })
        console.log(id)
        this.$confirm('确认上线？')
          .then(_ => {
            this.$ajax.get('/sys/THuigouHotelProduct/updatePublish', {
              params: {
                idsArr: id.join(),
                publishStatus: 1
              }
            }).then((res) => {
              this.$message.success('上线成功')
              this.getHotelList()
            })
          })
          .catch(_ => { })
      }
    },
    allDown () {
      console.log('批量下线')
      if (this.chooseItem.length == 0) {
        this.$message.error('请选择数据')
      } else {
        const id = this.chooseItem.map((item) => {
          return item.id
        })
        console.log(id)
        this.$confirm('确认下线？')
          .then(_ => {
            this.$ajax.get('/sys/THuigouHotelProduct/updatePublish', {
              params: {
                idsArr: id.join(),
                publishStatus: 0
              }
            }).then((res) => {
              this.$message.success('批量下架成功')
              this.getHotelList()
            })
          })
          .catch(_ => { })
      }
    },
    handleChange (val) {
      console.log(val)
      this.getChildLabel(val[0])
    },
    // 获取品类下拉数据
    async getLabelData (id) {
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
        this.formItems[5].options = arr
        // console.log(this.formItems[5])
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

  }
}
</script>
<style lang="scss" scoped>
.managePage {
  @extend %fill;
  overflow: auto;
  .from-wrap {
    width: 100%;
    // height: 60px;
    background: #f5f7fa;
    border: 1px solid #e5e9ef;
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 20px;
    padding-bottom: 0;
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
  .table-wrap {
    overflow: auto;
  }
  .pagination-wrap {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .content {
    height: auto;
    max-height: 600px;
    overflow: auto;
    /deep/ .el-select {
      width: 100px;
    }
  }
}
</style>
