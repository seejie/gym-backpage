<template>
  <div class="photoDataManage">
    <!-- 表单 -->
    <el-card class="card">
      <div class="from-wrap">
        <formList :formList="formList"></formList>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <myTable hasIndex
                 :data="list"
                 hasTopButton
                 :topBtnList="btnList"
                 :columns='listColums'>
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
    </el-card>
    <!--添加编辑弹框 -->
    <el-dialog :title="title"
               :visible.sync="isShow">
      <formList :formList="dialogFormList"></formList>
      <span slot="footer">
        <el-button @click=" isShow= false">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'photoDataManage',
  data () {
    return {
      //表单数据
      formList: {
        queryItem: [
          {
            type: 'select',
            disabled: false,
            model: '',
            props: 'status',
            placeholder: '统计方式',
            label: '统计方式',
            option: [
              {
                label: '未处理',
                value: 0
              },
              {
                label: '已处理',
                value: 1
              }
            ],
          },
          {
            type: 'datetimerange',
            disabled: false,
            model: [],
            props: 'createTime',
            label: '拍照日期',
          }
        ],
        rules: {

        },
        type: {
          bottomBtnStyle: 'float:right',
          inline: true
        },
        btn: [
          {
            text: '搜索',
            type: 'primary',
            cb: this.search
          },
          {
            text: '重置',
            type: '',
            cb: this.resetForm
          }
        ]
      },
      //表格数据
      listColums: [
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'statusLabel',   //<String>  对应属性名
          label: '年龄段',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'statusLabel',   //<String>  对应属性名
          label: '人数',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'statusLabel',   //<String>  对应属性名
          label: '占比',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'statusLabel',   //<String>  对应属性名
          label: '排名',  //<String>   表头标签
        },
      ],
      list: [

      ],
      btnList: [
        {
          btnText: '导出统计结果',
          type: 'primary',
          cb: this.addCard
        }
      ],
      currentPage: 1,
      totalCount: 1,
      currentPageSize: 10,
      isShow: false,
      title: '新建账号'
    }
  },
  mounted () {
    this.getPhotoList()
  },
  methods: {
    search () {
      console.log('查询')
      this.getPhotoList()
    },
    resetForm (formName) {
      this.formList.queryItem.forEach((item) => {
        item.model = ''
      })
    },
    //详情
    detail (item) {
      console.log(item)
      this.detailShow = true
    },
    //批量核销
    deleteRow () {
      console.log('批量核销')
    },
    //批量退款
    allDown () {
      console.log('批量下线')
    },
    //导出
    allUp () {
      console.log("批量上线")
    },
    handleSizeChange (val) {
      console.log(val)
      this.currentPageSize = val
      this.getPhotoList()
    },
    handleCurrentChange (val) {
      console.log(val)
      this.currentPage = val
      this.getPhotoList()
    },
    //创建优惠券
    addCard () {
      this.isShow = true
    },
    //查询列表数据
    getPhotoList () {
      this.$ajax.get('/pzcz-photo/photo-list', {
        params: {
          page: this.currentPage,
          limit: this.currentPageSize,
          bh: this.getFormModel('bh'),
          mobile: this.getFormModel('mobile'),
          nickname: this.getFormModel('username'),
          username: this.getFormModel('nickname'),
          status: this.getFormModel('status'),
          createTimeBegin: this.getFormModel('createTime')[0],
          createTimeEnd: this.getFormModel('createTime')[1],
          updateTimeBegin: this.getFormModel('updateTime')[0],
          updateTimeEnd: this.getFormModel('updateTime')[1],
        }
      }).then((res) => {
        console.log('1111')
        console.log(res)
        this.list = res.page.index.map((item) => {
          return {
            ...item,
            createTime: this.$moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
            updateTime: this.$moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss"),
            statusLabel: item.status == 0 ? '未处理' : '已处理'
          }
        })
      })
    },
    //弹框确认按钮
    confirm () {
      this.isShow = false
    },
    //编辑取值
    setFormModel (val) {
      // console.log([val['province_id'] + '', val['city_id'] + '', val['area_id'] + ''])
      this.formList.queryItem.forEach((item) => {
        Object.keys(val).map((keyName) => {
          if (item.props == keyName) {
            if (item.props == 'index_logo') {
              item.model = { 'ratio1': val['index_logo'] === null ? [] : [val['index_logo']] }
            } else if (item.props == 'qr_code_img') {
              item.model = { 'ratio1': val['qr_code_img'] === null ? [] : [val['qr_code_img']] }
            } else if (item.props == 'area_name') {
              item.model = [val['province_id'] + '', val['city_id'] + '', val['area_id'] + '']
            } else {
              item.model = val[keyName]
            }
          }
        })
      })
      console.log(this.formList.queryItem)
    },
    //获取表单值
    getFormModel (val) {
      let modelData = this.formList.queryItem.filter((item) => {
        return item.props === val
      })
      return modelData[0].model
    }
  }
}
</script>
<style lang="scss" scoped>
.photoDataManage {
  @extend %fill;
  overflow: auto;
  padding: 20px;
  .card {
    height: 100%;
  }
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
      margin-bottom: 40px;
    }
  }
  .table-wrap {
    overflow: auto;
  }
  .content {
    width: 100%;
    height: auto;
    padding: 20px;
    &-top {
      height: auto;
      width: 100%;
      display: flex;
      .img-wrap {
        width: 110px;
      }
      .detail-info {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        font-size: 16px;
        justify-content: space-between;
        div {
          height: 1em;
          height: 1em;
          margin-bottom: 1.5em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .left {
          width: 35%;
        }
        .right {
          width: 20%;
        }
        .center {
          width: 45%;
        }
      }
    }
    &-bottom {
      width: 100%;
      .rote {
        height: 80px;
        line-height: 80px;
        display: flex;
        align-items: center;
        span {
          font-size: 16px;
          font-weight: 500;
          margin-right: 20px;
        }
      }
      .suggest {
        width: 100%;
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
</style>

