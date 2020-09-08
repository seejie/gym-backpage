<template>
  <div class="marketWorkerManage">
    <!-- 表单 -->
    <el-card class="card" style="overflow:auto">
      <div class="from-wrap">
        <formList :formList="formList"></formList>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <myTable hasIndex :data="list" :columns="listColums"></myTable>
      </div>
      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-sizes="[5, 10, 15]"
          :page-size="currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'marketWorkerManage',
  data() {
    return {
      //表单数据
      formList: {
        queryItem: [
          {
            type: 'text',
            disabled: false,
            model: '',
            props: 'bh',
            placeholder: '拍照编号',
            label: '拍照编号',
          },
          {
            type: 'text',
            disabled: false,
            model: '',
            props: 'mobile',
            placeholder: '手机号码',
            label: '手机号码',
          },
          {
            type: 'text',
            disabled: false,
            model: '',
            props: 'username',
            placeholder: '微信昵称',
            label: '微信昵称',
          },
          {
            type: 'text',
            disabled: false,
            model: '',
            props: 'nickName',
            placeholder: '用户姓名',
            label: '用户姓名',
          },
          {
            type: 'select',
            disabled: false,
            model: '',
            props: 'status',
            placeholder: '处理状态',
            label: '处理状态',
            option: [
              {
                label: '未处理',
                value: 0,
              },
              {
                label: '已处理',
                value: 1,
              },
            ],
          },
          {
            type: 'datetimerange',
            disabled: false,
            model: [],
            props: 'createTime',
            label: '拍照日期',
          },
          {
            type: 'datetimerange',
            disabled: false,
            model: [],
            props: 'updateTime',
            label: '数据更新日期',
          },
        ],
        rules: {},
        type: {
          bottomBtnStyle: 'float:right',
          inline: true,
        },
        btn: [
          {
            text: '搜索',
            type: 'primary',
            cb: this.search,
          },
          {
            text: '重置',
            type: '',
            cb: this.resetForm,
          },
        ],
      },
      //表格数据
      listColums: [
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'bh', //<String>  对应属性名
          label: '拍照编号', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'mobile', //<String>  对应属性名
          label: '手机号码', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'username', //<String>  对应属性名
          label: '微信昵称', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'nickName', //<String>  对应属性名
          label: '姓名', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'createTime', //<String>  对应属性名
          label: '拍照日期', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'updateTime', //<String>  对应属性名
          label: '数据更新日期', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'leftStatusStr', //<String>  对应属性名
          cellStyle: true,
          label: '左脚状态', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: 'rightStatusStr', //<String>  对应属性名
          cellStyle: true,
          label: '右脚状态', //<String>   表头标签
        },
        {
          hasSort: false, //<Boolean> 是否排序
          prop: '', //<String>  对应属性名
          label: '操作', //<String>   表头标签
          operateData: [
            {
              btn: '编辑',
              cb: this.edit,
              disabled: false,
            },
            {
              btn: '详情',
              cb: this.detail,
              disabled: false,
            },
            // {
            //   btn: '下载',
            //   cb: this.detail,
            //   disabled: false
            // },
            {
              btn: '审核',
              cb: this.goToVerify,
              disabled: false,
            },
          ],
        },
      ],
      list: [],
      currentPage: 1,
      totalCount: 1,
      currentPageSize: 10,
      isShow: false,
    };
  },
  mounted() {
    this.getPhotoList();
  },
  methods: {
    search() {
      console.log('查询');
      this.getPhotoList();
    },
    getStatus(name,val) {
      if (Number(val) == -1) {
        return `<span style="color: blue">${name || ""}</span>`;
      } else if (Number(val) == 3) {
        return `<span style="color: red">${name || ""}</span>`;
      } else if (Number(val) == 0) {
        return `<span style="color: green">${name || ""}</span>`;
      } else if (Number(val) == 1) {
        return `<span style="color: red">${name || ""}</span>`;
      } else if (Number(val) == 2) {
        return `<span style="color: #29bc4f">${name || ""}</span>`;
      } else if(Number(val) == -2) {
        return `<span style="color: gray">${name || ""}</span>`;
      }
    },
    goToVerify(item) {
      this.$router.push({
        name: 'photoVerify',
        query: {
          id: item.id,
          type: false,
          verify: true,
        },
      });
    },
    // pass (item) {
    //   this.$ajax.post('/pzcz-photo/change-status/' + item.id, {
    //     status: 0
    //   }).then((res) => {
    //     this.$message.success("操作成功")
    //     this.getPhotoList()
    //   })
    // },
    // refuse (item) {
    //   this.$ajax.post('/pzcz-photo/change-status/' + item.id, {
    //     status: '-1'
    //   }).then((res) => {
    //     this.$message.success("操作成功")
    //     this.getPhotoList()
    //   })
    // },
    resetForm(formName) {
      this.formList.queryItem.forEach(item => {
        item.model = '';
      });
    },
    //详情
    detail(item) {
      console.log(item);
      this.$router.push({
        name: 'photoEdit',
        query: {
          id: item.id,
          type: false,
          verify: false,
        },
      });
    },
    //编辑
    edit(item) {
      console.log(item);
      this.$router.push({
        name: 'photoEdit',
        query: {
          id: item.id,
          type: true,
          verify: false,
        },
      });
    },
    //批量核销
    deleteRow() {
      console.log('批量核销');
    },
    //批量退款
    allDown() {
      console.log('批量下线');
    },
    //导出
    allUp() {
      console.log('批量上线');
    },
    handleSizeChange(val) {
      console.log(val);
      this.currentPageSize = val;
      this.getPhotoList();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getPhotoList();
    },
    //创建优惠券
    addCard() {
      this.isShow = true;
    },
    //查询列表数据
    getPhotoList() {
      this.$ajax
        .post('/pzcz/photo/search', {
          pageNum: this.currentPage,
          pageSize: this.currentPageSize,
          bh: this.getFormModel('bh') ? this.getFormModel('bh') : undefined,
          mobile: this.getFormModel('mobile') ? this.getFormModel('mobile') : undefined,
          nickName: this.getFormModel('nickName') ? this.getFormModel('nickName') : undefined,
          username: this.getFormModel('username') ? this.getFormModel('username') : undefined,
          status: this.getFormModel('status') ? this.getFormModel('status') : undefined,
          createTimeBegin: this.getFormModel('createTime')[0] ? this.getFormModel('createTime')[0] : undefined,
          createTimeEnd: this.getFormModel('createTime')[1] ? this.getFormModel('createTime')[1] : undefined,
          updateTimeBegin: this.getFormModel('updateTime')[0] ? this.getFormModel('updateTime')[0] : undefined,
          updateTimeEnd: this.getFormModel('updateTime')[1] ? this.getFormModel('updateTime')[1] : undefined,
        })
        .then(res => {
          this.totalCount = res.resObject.totalCount;
          this.list = res.resObject.list.map(item => {
            item.leftStatusStr = this.getStatus(item.leftStatusStr,item.leftStatus);
            item.rightStatusStr = this.getStatus(item.rightStatusStr,item.rightStatus);
            return {
              ...item,
              createTime: this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
              updateTime: this.$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
            };
          });
        });
    },
    //弹框确认按钮
    confirm() {
      this.isShow = false;
    },
    //编辑取值
    setFormModel(val) {
      // console.log([val['province_id'] + '', val['city_id'] + '', val['area_id'] + ''])
      this.formList.queryItem.forEach(item => {
        Object.keys(val).map(keyName => {
          if (item.props == keyName) {
            if (item.props == 'index_logo') {
              item.model = { ratio1: val['index_logo'] === null ? [] : [val['index_logo']] };
            } else if (item.props == 'qr_code_img') {
              item.model = { ratio1: val['qr_code_img'] === null ? [] : [val['qr_code_img']] };
            } else if (item.props == 'area_name') {
              item.model = [val['province_id'] + '', val['city_id'] + '', val['area_id'] + ''];
            } else {
              item.model = val[keyName];
            }
          }
        });
      });
      console.log(this.formList.queryItem);
    },
    //获取表单值
    getFormModel(val) {
      let modelData = this.formList.queryItem.filter(item => {
        return item.props === val;
      });
      return modelData[0].model;
    },
  },
};
</script>
<style lang="scss" scoped>
.marketWorkerManage {
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

