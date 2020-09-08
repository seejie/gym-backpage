<template>
  <div class="commentPage">
    <!-- 表单 -->
    <el-card class="card-wrap">
      <div class="from-wrap">
        <topForm :formData='formData'
                 @search='search'
                 @reset='reset'
                 :formItems='formItems'></topForm>
      </div>
      <!-- 表格 -->
      <el-card class="table-wrap">
        <div class="list-top">
          <span class="commentNum">共168条评论</span>
          <el-button type="primary"
                     @click="allUp">批量上线</el-button>
          <el-button type="default"
                     @click="allDown">批量下线</el-button>
          <el-button type="danger"
                     @click="deleteRow">删除</el-button>
          <span :class="isSortTime?'sortTime sort active':'sortTime sort'"
                @click="sortTime">按时间排序 <i class="el-icon-sort"></i></span>
          <span :class="isSortNum?'sortNum sort active':'sortNum sort'"
                @click="sortNum">按点赞数排序 <i class="el-icon-sort"></i></span>
        </div>
        <div class="comment-wrap"
             v-for="(item,index) in 3"
             :key="index">
          <div class="comment-item">
            <div class="avatar">
              <img src="@/assets/layout/logo.png"
                   alt=""
                   srcset="">
            </div>
            <div class="info">
              <div class="basic">
                <div class="basic-info">
                  <span>石瑞</span>
                  <span style="margin:0 20px">一周前</span>
                  <el-rate v-model="value1"
                           disabled></el-rate>
                </div>
                <div class="basic-btn">
                  <span style="color:#67c23a">∙ 已上线</span>
                  <div class="close-top">取消置顶</div>
                  <span class="el-icon-edit"
                        @click="replayShow = !replayShow"></span>
                  <span class="el-icon-delete"></span>
                  <span class="el-icon-thumb"></span>
                </div>
              </div>
              <div class="content-wrap">
                <div class="content">
                  这个评论插件叫AntSay，简单三步即可在自己的网站里嵌入，超轻。 1. 获取APP I 2. 一行代码引入组件 3. 配置几个参数 赶紧使用吧，地址：http://say.alipay.net/
                </div>
              </div>
              <!-- 回复列表 -->
              <div v-for="(item,index) in 3"
                   :key="index"
                   class="replay-wrap">
                <div class="replay-left">
                  <img src="@/assets/layout/logo.png"
                       alt="">
                </div>
                <div class="replay-right">
                  <div class="replay-info">
                    <div>
                      <span>石瑞 <span style="color:#909399">回复</span> 楼主</span>
                      <span style="margin:0 20px">一周前</span>
                    </div>
                    <div>
                      <span class="el-icon-thumb"
                            style="cursor: pointer;"></span>
                    </div>
                  </div>
                  <div class="replay-content">
                    <div class="replay">
                      这个评论插件叫AntSay，简单三步即可在自己的网站里嵌入，超轻。 1. 获取APP I 2. 一行代码引入组件 3. 配置几个参数 赶紧使用吧，地址：http://say.alipay.net/
                    </div>
                  </div>
                </div>
              </div>
              <div class="replay-input"
                   v-if='replayShow'>
                <el-input type="textarea"
                          :rows="3"
                          placeholder="请输入内容"
                          v-model="textarea">
                </el-input>
                <el-button type="info"
                           style="margin: 10px 0;">发布评论</el-button>
              </div>
            </div>

          </div>
        </div>

      </el-card>
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
    </el-card>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        comment: '', // 搜索标题
        publishStatus: '', // 发布状态
        position: '', // 发布位置
        user: '', // 主办方
        // columnId: '',//活动类型
        time: [], // 活动时间

      },
      replayShow: false,
      formItems: [
        { label: '搜索评论', model: 'comment', placeholder: '请输入标题', type: 'text' },
        { label: '发布状态', model: 'publishStatus', placeholder: '请输入标题', type: 'select', options: [{ label: '下架', value: 0 }, { label: '上架', value: 1 }] },
        { label: '发布位置', model: 'position', placeholder: '请选择', type: 'select', options: [] },
        { label: '搜索用户', model: 'user', placeholder: '请输入用户名', type: 'text' },
        { label: '发布时间', model: 'time', placeholder: '请选择', type: 'datetimerange' },
      ],
      chooseItem: [], // 选中的行数
      currentPage: 1, // 当前页数
      chooseIdArr: [], // 选择的id
      dialogVisible: false, // 删除弹框
      columns: [
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'headerUrl', // <String>  对应属性名
          label: '头像', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'userName', // <String>  对应属性名
          label: '昵称', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'phoneNumber', // <String>  对应属性名
          label: '联系方式', // <String>   表头标签
        },
        {
          hasSort: false, // <Boolean> 是否排序
          prop: 'hasPz', // <String>  对应属性名
          type: 'switchs',
          disabled: false,
          isEffect: 0,
          label: '审核', // <String>   表头标签
        },
      ], // 传给表格组件的数据
      tableData: [

      ], // 传给表格组件的数据
      currentPageSize: 10, // 每页条数
      totalCount: 0, // 请求到的总数
      chooseActiveId: '', // 点击数据选中的id
      isSortTime: false,
      isSortNum: false
    }
  },
  created () {
    // this.getNextMent()
    // this.getReviewStatus()
  },
  mounted () {
    this.getActiveList()
  },
  methods: {
    // 搜索按钮
    search () {
      this.getActiveList()
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
        // columnId: '',//活动类型
        time: []// 活动时间
      }
      this.getActiveList()
    },
    // 通过接口获取数据
    getActiveList () {
      console.log(this.formData)
      this.$ajax.get('/huigou/tiyan/product/findProductPageList', {
        params: {
          title: this.formData.title,
          publishStatus: this.formData.publishStatus,
          commentRole: this.formData.isComment,
          payType: this.formData.payType,
          sponsor: this.formData.sponsor,
          // columnId: this.formData.columnId,
          startPublishTime: this.formData.time && this.formData.time.length !== 0 ? this.formData.time[0] : null,
          endPublishTime: this.formData.time && this.formData.time.length !== 0 ? this.formData.time[1] : null,
          pageNum: this.currentPage,
          pageSize: this.currentPageSize
        }
      }).then((res) => {
        this.list = []
        this.totalCount = res.resObject.total
        res.resObject.list.map((item) => {
          this.list.push({
            ...item,
            title: {
              oneTitle: item.title,
              twoTitle: item.subTitle,
              // imgUrl: item.banner.split(',')[0]
              imgUrl: item.indexPic
            },
            // columnLabel: item.columnId ? this.getTypeLabel(item.columnId) : '未设置',
            publishTime: item.createTime == null ? '' : this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getActiveList()
    },
    handleSizeChange (val) {
      this.currentPageSize = val
      this.getActiveList()
    },
    // 添加按钮
    addActive () {
      this.$router.push({
        name: 'addActivePage'
      })
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
      this.$ajax.get('/huigou/tiyan/product/deleteProduct', {
        params: {
          idsArr: this.chooseItem.length > 1 ? this.chooseItem.map((item) => item.id).join(',') : this.chooseItem[0].id
        }
      }).then((res) => {
        this.$message.success('删除成功')
        this.dialogVisible = false
        this.getActiveList()
      }).catch(() => {
        this.chooseItem = []
        this.dialogVisible = false
      })
    },
    searchList () {
      console.log('搜索')
      this.getSinuplists()
    },
    // 表格更多--上线
    goLine (item) {
      if (item.publishStatus == 3) {
        this.$confirm('确认下线？')
          .then(_ => {
            this.$ajax.get('/huigou/active/downPublishStatus', {
              params: {
                idArray: String(item.id)
              }
            }).then((res) => {
              this.$message.success('下架成功')
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
              this.$message.success('上线成功')
              this.getActiveList()
            })
          })
          .catch(_ => { });
      }
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
        .catch(_ => { });
    },
    // 置顶确认
    isGoTop (id) {
      this.$ajax.post('/huigou/tiyan/product/updateProduct', {
        id: id,
        stick: 1
      }).then((res) => {
        this.$message.success('置顶成功')
        this.getActiveList()
      })
    },
    // 取消置顶
    isGoDown (id) {
      this.$ajax.post('/huigou/tiyan/product/updateProduct', {
        id: id,
        stick: 0
      }).then((res) => {
        this.$message.success('取消置顶')
        this.getActiveList()
      })
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
            this.$ajax.get('/huigou/tiyan/product/updatePublishStatus', {
              params: {
                idsArr: id.join(),
                publishStatus: 1
              }
            }).then((res) => {
              this.$message.success('上线成功')
              this.getActiveList()
            })
          })
          .catch(_ => { });
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
            this.$ajax.get('/huigou/tiyan/product/updatePublishStatus', {
              params: {
                idsArr: id.join(),
                publishStatus: 0
              }
            }).then((res) => {
              this.$message.success('批量下架成功')
              this.getActiveList()
            })
          })
          .catch(_ => { });
      }
    },
    // 按时间排序
    sortTime () {
      this.isSortTime = !this.isSortTime
    },
    // 按点赞数排序
    sortNum () {
      this.isSortNum = !this.isSortNum
    }
  },
  components: {

  }
}
</script>
<style lang="scss" scoped>
.commentPage {
  @extend %fill;
  overflow: auto;
  .card-wrap {
    width: 100%;
    height: 100%;

    /deep/ .el-card__body {
      width: 100%;
      height: 100%;
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
        padding: 20px;
        // height: 100%;
        overflow: auto;
        .list-top {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          padding-left: 20px;
          padding-right: 30%;
          display: flex;
          justify-content: space-between;
          .commentNum {
            color: #c0c4cc;
          }
          .sort {
            cursor: pointer;
          }
          .active {
            color: #67c23a;
          }
        }
        .comment-wrap {
          height: auto;
          padding-left: 20px;
          .comment-item {
            display: flex;
            justify-content: space-between;
            padding-right: 30%;
            .avatar {
              width: 40px;
              height: 100%;
              border-radius: 50%;
              margin-right: 20px;
              img {
                width: 100%;
                height: 40px;
                margin-top: 15px;
              }
            }
            .info {
              width: 100%;
              .basic {
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .basic-info {
                  height: 40px;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  font-size: 14px;
                  color: #909399;
                }
                .basic-btn {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 40px;
                  font-size: 14px;
                  width: 240px;
                  .close-top {
                    background: #409eff;
                    padding: 4px 10px;
                    border-radius: 20px;
                    color: white;
                    cursor: pointer;
                  }
                  span {
                    cursor: pointer;
                  }
                }
              }
              .content-wrap {
                width: 100%;
                color: #606266;
                .content {
                  word-wrap: break-word;
                  width: 100%;
                  padding: 10px;
                  padding-right: 200px;
                  font-size: 14px;
                }
              }
              .replay-wrap {
                display: flex;
                justify-content: space-between;
                .replay-left {
                  width: 30px;
                  margin-right: 20px;
                  img {
                    width: 30px;
                    height: 30px;
                  }
                }
                .replay-right {
                  width: calc(100% - 50px);
                  line-height: 30px;
                  color: #909399;
                  font-size: 14px;
                  .replay-info {
                    display: flex;
                    justify-content: space-between;
                  }
                  .replay-content {
                    word-wrap: break-word;
                    width: 100%;
                    padding: 10px;
                    padding-right: 200px;
                    font-size: 14px;
                    width: 100%;
                    color: #606266;
                  }
                }
              }
              .replay-input {
                width: 100%;
              }
            }
          }
        }
      }
      .pagination-wrap {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
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
