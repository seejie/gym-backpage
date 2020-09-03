<template>
  <div class="managePage">
    <!-- 表单 -->
    <div class="from-wrap">
      <el-form :inline="true"
               ref="formInline"
               :model="formInline"
               class="demo-form-inline">
        <el-form-item prop="title">
          <el-input v-model="formInline.title"
                    suffix-icon="el-icon-search"
                    placeholder="搜索标题"></el-input>
        </el-form-item>
        <el-form-item prop="publishStatus">
          <el-select v-model="formInline.publishStatus"
                     placeholder="发布状态">
            <el-option label="已发布"
                       value="3"></el-option>
            <el-option label="已下线"
                       value="2"></el-option>
            <el-option label="待审核"
                       value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="publishStatus">
          <el-select v-model="formInline.position"
                     placeholder="发布位置">
            <el-option label="置顶"
                       value="1"></el-option>
            <el-option label="默认"
                       value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="isComment">
          <el-select v-model="formInline.isComment"
                     placeholder="评论权限">
            <el-option label="开"
                       value="1"></el-option>
            <el-option label="关"
                       value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="payType">
          <el-select v-model="formInline.payType"
                     placeholder="付费类型">
            <el-option label="免费"
                       value="0"></el-option>
            <el-option label="收费"
                       value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sponsor">
          <el-input v-model="formInline.sponsor"
                    placeholder="主办方单位"></el-input>
        </el-form-item>
        <el-form-item prop="columnId">
          <el-select v-model="formInline.columnId"
                     placeholder="活动类型">
            <el-option v-for="(item,index) in nextMenulist"
                       :key="index"
                       :label="item.catName"
                       :value="item.catId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time">
          <el-date-picker v-model="formInline.time"
                          type="datetimerange"
                          range-separator="至"
                          unlink-panels
                          value-format="timestamp"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary"
                     @click="search">搜索</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
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
    <!-- 数据弹框 -->
    <el-dialog title="报名数据"
               width="50%"
               :visible.sync="moreDataShow">
      <div class="content">
        <el-form :inline="true"
                 :model="dialogFrom"
                 class="demo-form-inline">
          <el-form-item>
            <el-input placeholder="请输入关键词内容"
                      v-model="dialogFrom.input"
                      class="input-with-select">
              <el-select v-model="dialogFrom.selectType"
                         slot="prepend"
                         placeholder="请选择">
                <el-option label="昵称"
                           value="1"></el-option>
                <el-option label="联系方式"
                           value="2"></el-option>
              </el-select>
              <el-button slot="append"
                         @click="searchList"
                         icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-dropdown split-button
                         type="primary">
              状态
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>审核</el-dropdown-item>
                <el-dropdown-item>未审核</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item> -->
          <!-- <el-form-item style="float:right">
            <el-button>审核通过</el-button>
            <el-button type="primary">导出</el-button>
          </el-form-item> -->
        </el-form>
        <myTable hasSelection
                 hasIndex
                 @change="change"
                 :columns="columns"
                 :operate="dialogData"
                 :data="sinuplists">
        </myTable>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <!-- 分页 -->
        <div class="pagination-wrap"
             style="justify-content: center;">
          <el-pagination @size-change="signHandleSizeChange"
                         @current-change="signHandleCurrentChange"
                         :current-page="signCurrentPage"
                         background
                         :page-sizes="[5, 10, 15]"
                         :page-size="signCurrentPageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="signTotalCount">>
          </el-pagination>
        </div>
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
export default {
  data () {
    return {
      formInline: {
        title: '',//搜索标题
        publishStatus: '',//发布状态
        position: '',//发布位置
        isComment: '',//评论全权限
        payType: '',//付费类型
        sponsor: '',//主办方
        columnId: '',//活动类型
        time: [],//活动时间

      },
      dialogFrom: {
        input: '',
        selectType: "1"
      },
      chooseItem: [],//选中的行数
      currentPage: 1,//当前页数
      chooseIdArr: [],//选择的id
      dialogVisible: false,//删除弹框
      moreDataShow: false,
      columns: [
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'headerUrl',   //<String>  对应属性名
          label: '头像',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'userName',   //<String>  对应属性名
          label: '昵称',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'phoneNumber',   //<String>  对应属性名
          label: '联系方式',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'hasPz',   //<String>  对应属性名
          type: 'switchs',
          disabled: false,
          isEffect: 0,
          label: '审核',  //<String>   表头标签
        },
      ],// 传给表格组件的数据
      tableData: [

      ],//传给表格组件的数据
      operateData: [1],//表格操作数据
      dialogData: [],
      currentPageSize: 10,//每页条数
      totalCount: 0,//请求到的总数
      list: [
      ],//表格数据
      listColums: [
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'title',   //<String>  对应属性名
          type: 'title',
          width: '300px',
          label: '标题',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'publishStatus',   //<String>  对应属性名
          label: '发布状态',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'columnLabel',   //<String>  对应属性名
          label: '活动分类',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'sponsor',   //<String>  对应属性名
          label: '发布单位',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'publishTime',   //<String>  对应属性名
          label: '发布时间',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'reads',   //<String>  对应属性名
          label: '阅读数',  //<String>   表头标签
        }
      ],
      nextMenulist: [],//活动类型下拉框
      reView: '',
      reViewShow: false,
      btnList: [
        {
          btnText: '创建活动',
          type: 'primary',
          cb: this.addActive
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
          btnText: '删除活动',
          type: 'danger',
          cb: this.deleteRow
        }
      ],
      chooseActiveId: '',//点击数据选中的id
      sinuplists: [],//报名列表
      signTotalCount: 0,//报名总数
      signCurrentPageSize: 5,
      signCurrentPage: 1
    }
  },
  created () {
    this.getNextMent()
    // this.getReviewStatus()
  },
  mounted () {


  },
  methods: {
    // 搜索按钮
    search () {
      console.log(this.getParams())
      this.getActiveList()
    },
    //通过接口获取数据
    getActiveList () {
      console.log(this.getParams())
      this.$ajax.post('/tiyan/active/sys/selectTiYanActiveList', {
        title: this.formInline.title,
        publishStatus: this.formInline.publishStatus,
        // position: this.formInline.position,
        isComment: this.formInline.isComment,
        payType: this.formInline.payType,
        sponsor: this.formInline.sponsor,
        columnId: this.formInline.columnId,
        activeBegintimeStr: typeof (this.formInline.time[0]) == "undefined" ? '' : this.formInline.time[0],
        activeEndtimeStr: typeof (this.formInline.time[1]) == "undefined" ? '' : this.formInline.time[1],
        pageNum: this.currentPage,
        pageSize: this.currentPageSize
      }).then((res) => {
        this.list = []
        this.totalCount = res.resultList.total
        res.resultList.index.map((item) => {
          this.list.push({
            ...item,
            title: {
              oneTitle: item.title,
              twoTitle: item.childTitle,
              imgUrl: item.activePic.split(',')[0],
            },
            reads: item.reading == null ? 0 : item.reading,
            columnLabel: item.columnId ? this.getTypeLabel(item.columnId) : '未设置',
            publishTime: item.publishTime == null ? '' : this.$moment(item.publishTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
        console.log("---")
        console.log(this.list)
      })
    },
    //接口参数
    getParams () {
      let newObj = Object.assign({}, this.formInline, {
        activeBegintime: typeof (this.formInline.time[0]) == "undefined" ? '' : this.formInline.time[0],
        activeEndtime: typeof (this.formInline.time[1]) == "undefined" ? '' : this.formInline.time[1],
        pageNum: this.currentPage,
        pageSize: this.currentPageSize,
      })
      delete newObj.time
      return newObj
    },
    // 重置表单搜索
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    //查询审核状态
    getReviewStatus () {
      this.$ajax.get('/huigou/active/selectReview', {

      }).then((res) => {
        console.log(res)
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getActiveList()
    },
    signHandleCurrentChange (val) {
      this.signCurrentPage = val
      this.getSinuplists()
    },
    handleSizeChange (val) {
      this.currentPageSize = val
    },
    signHandleSizeChange (val) {
      this.signCurrentPageSize = val
      this.getSinuplists()
    },
    //添加按钮
    addActive () {
      this.$router.push({
        name: 'addActivePage'
      })
    },
    editForm (val) {
      console.log(val.id)
      this.$router.push({
        name: 'addActivePage',
        query: {
          id: val.id
        }
      })
    },
    handleDelete (val) {

    },
    //表格选择
    commitSelection (val) {
      this.chooseItem = val
    },
    //删除事件
    deleteRow (row) {
      console.log(row)
      if (row !== '') {
        //删除单行
        this.chooseItem = []
        this.dialogVisible = true
        this.chooseItem.push(row)
      } else {
        if (this.chooseItem.length === 0) {
          this.$message.error("请选择要删除的数据")
        } else {
          this.chooseIdArr = this.chooseItem.map((item) => {
            return item.status
          })
          this.dialogVisible = true
        }
      }

    },
    //弹框确定事件
    commit (val) {
      this.$ajax.post('/huigou/active/deleteTiYanActive', {
        idArray: this.chooseItem.length > 1 ? this.chooseItem.map((item) => item.id).join(',') : this.chooseItem[0].id
      }).then((res) => {
        this.$message.success("删除成功")
        this.dialogVisible = false
        this.getActiveList()
      })
    },
    //更多数据
    moreData (val) {
      console.log(val)
      this.chooseActiveId = val.id
      this.moreDataShow = true
      //获取报名列表数据
      this.columns.forEach((item) => {
        if (item.type === 'switchs') {
          item.disabled = val.applyReview === 0
        }
      })
      this.getSinuplists()
    },
    change (val) {
      console.log(val)
      this.$ajax.post('/huigou/active/verifySignUpInfo', {
        activeId: this.chooseActiveId,
        id: val.id,
        status: val.hasPz
      }).then((res) => {
        if (res.resultCode === '200') {
          this.$message.success(val.hasPz === 1 ? '审核成功' : '审核关闭成功')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getSinuplists () {
      this.$ajax.post('/huigou/active/sinuplists', {
        pageNum: this.signCurrentPage,
        pageSize: this.signCurrentPageSize,
        activeId: this.chooseActiveId,
        userName: this.dialogFrom.selectType === '1' ? this.dialogFrom.input : '',
        phoneNumber: this.dialogFrom.selectType === '2' ? this.dialogFrom.input : ''
      }).then((res) => {
        if (res.resultCode === 200) {
          this.sinuplists = res.resultList.index
          this.signTotalCount = Number(res.resultList.total)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    searchList () {
      console.log('搜索')
      this.getSinuplists()
    },
    //表格更多--上线
    goLine (item) {
      if (item.publishStatus == 3) {
        this.$confirm('确认下线？')
          .then(_ => {
            this.$ajax.get('/huigou/active/downPublishStatus', {
              params: {
                idArray: String(item.id)
              }
            }).then((res) => {
              this.$message.success("下架成功")
              this.getActiveList()
            })
          })
          .catch(_ => { });
      } else {
        this.$confirm('确认上线？')
          .then(_ => {
            this.$ajax.get('/huigou/active/upPublishStatus', {
              params: {
                idArray: String(item.id)
              }
            }).then((res) => {
              this.$message.success("上线成功")
              this.getActiveList()
            })
          })
          .catch(_ => { });
      }

    },
    //表格更多--禁言
    forbid (item) {
      console.log(item.isComment)
      let message = item.isComment == 1 ? '确认取消禁言？' : '确认禁言？'
      this.$confirm(message)
        .then(_ => {
          this.$ajax.get('/huigou/active/updateis_comment', {
            params: {
              isComment: item.isComment == 1 ? 0 : 1,
              activeId: item.id
            }
          }).then((res) => {
            item.isComment == 1 ? this.$message.success("取消禁言成功") : this.$message.success("禁言成功")
            this.getActiveList()
          })
        })
        .catch(_ => { });
    },
    //置顶
    goTop (item) {
      let message = item.isTopping == 0 ? '确认置顶？' : '确认取消置顶'
      this.$confirm(message)
        .then(_ => {
          if (item.isTopping == 0) {
            //
            this.isGoTop(item.id)
          } else {
            //取消置顶
            this.isGoDown(item.id)
          }

        })
        .catch(_ => { });
    },
    //置顶确认
    isGoTop (id) {
      this.$ajax.get('/huigou/active/updateIsTop', {
        params: {
          id: id
        }
      }).then((res) => {
        this.$message.success("置顶成功")
        this.getActiveList()
      })
    },
    //取消置顶
    isGoDown (id) {
      this.$ajax.get('/huigou/active/cancleIsTop', {
        params: {
          id: id
        }
      }).then((res) => {
        this.$message.success("取消置顶")
        this.getActiveList()
      })
    },
    checkSet () {
      console.log('审核设置')
      this.reViewShow = true

    },
    allUp () {
      console.log("批量上线")
      if (this.chooseItem.length == 0) {
        this.$message.error("请选择数据")
      } else {
        let id = this.chooseItem.map((item) => {
          return item.id
        })
        console.log(id)
        this.$confirm('确认上线？')
          .then(_ => {
            this.$ajax.get('/huigou/active/upPublishStatus', {
              params: {
                idArray: id.join()
              }
            }).then((res) => {
              this.$message.success("上线成功")
              this.getActiveList()
            })
          })
          .catch(_ => { });
      }
    },
    allDown () {
      console.log("批量下线")
      if (this.chooseItem.length == 0) {
        this.$message.error("请选择数据")
      } else {
        let id = this.chooseItem.map((item) => {
          return item.id
        })
        console.log(id)
        this.$confirm('确认下线？')
          .then(_ => {
            this.$ajax.get('/huigou/active/downPublishStatus', {
              params: {
                idArray: id.join()
              }
            }).then((res) => {
              this.$message.success("批量下架成功")
              this.getActiveList()
            })
          })
          .catch(_ => { });
      }
    },
    //获取二级菜单
    getNextMent (id) {
      this.$ajax.get('/shop/active/category/queryAll', {
        params: {
          catGrade: 2
        }
      }).then((res) => {
        this.nextMenulist = res.index
        this.getActiveList()
      }).catch((err) => {
        console.log(err)
      })
    },
    //根绝id获取表格数据
    getTypeLabel (val) {
      console.log('-------')
      console.log(this.nextMenulist)
      let label = this.nextMenulist.filter((item) => {
        console.log(item)

        return item.catId == val
      })
      if (label.length != 0) {
        return label[0].catName
      } else {
        return '未设置'
      }
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

