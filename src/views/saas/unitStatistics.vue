<template>
  <div class="unitStatistics">
    <!-- 单位统计 -->
    <div class="from-wrap">
      <el-form :inline="true" ref="formInline" label-width="80px" label-position="left" :model="searchData">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="title" label="单位名称">
              <el-input v-model="searchData.unit_name" placeholder="搜索名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="company" label="所在地区">
               <area-cascader  type="all" style="line-height: 16px" :level="1" v-model="areaselected" :data="pcaa"></area-cascader>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
          <el-col :span="24">
            <el-form-item prop="company" label="查询时间">
              <el-date-picker
              style="width: 400px"
                v-model="searchData.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <el-card shadow="never" class="card">
      <!--全选、添加等操作按钮-->
      <div slot="header" class="clearfix">
        <el-button type="primary" @click="export_table()">导出</el-button>
        <el-button @click="batchTopicPublish('user_num',order['user_num'])">按用户量排序<i class="el-icon-sort el-icon--right"></i></el-button>
        <el-button @click="batchTopicPublish('order_amt',order['order_amt'])">按订单收入排序<i class="el-icon-sort el-icon--right"></i></el-button>
      </div>
      <!--表格-->
      <el-table :data="tableList" style="width: 100%" @selection-change="selectionchange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="unitName" label="单位名称" min-width="340px">
        </el-table-column>
        <el-table-column label="注册时间" width="180px">
          <template slot-scope="scope">{{$moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column label="最近发布时间" width="180px">
          <template slot-scope="scope">{{$moment(scope.row.publish_time).format('YYYY-MM-DD HH:mm:ss')}}</template>
        </el-table-column>
        <el-table-column prop="publish_num" label="发布量"></el-table-column>
        <el-table-column prop="user_num" label="用户数" width="180px"></el-table-column>
        <el-table-column prop="order_amt" label="订单收入" width="180px">
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <div style="text-align: right;margin-top: 20px">
        <Pagination :pageSize="pageSize"
                    :pageSizes="pageSizes" :total="totalCount"
                    @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {Message} from "element-ui";
  import Pagination from "../../components/Pagination";
  import { AreaCascader } from "vue-area-linkage";
  import { pca, pcaa } from "area-data";
  export default {
    name: "residentUnit",
    components: {
      Pagination,
    },
    data() {
      return {
        searchData: {
          unit_name: '',
          city_id: '',
          province_id: ''
        },
        tableList: [],
        areaselected: null,
        //分页
        totalCount: 0,
        curPage: 1,
        pageSizes: [10, 20, 30],
        pageSize: 0,
        pcaa:pcaa,
        //全选
        ids: [],
        order: {'user_num':'ASC','order_amt':'ASC'}
      }
    },
    watch: {
      searchData: {
        handler () {
          this.getList()
        },
        deep: true
      },
      areaselected: {
        handler () {
          console.log(this.areaselected)
          this.searchData.province_id = parseInt(Object.keys(this.areaselected[0])[0]);
          this.searchData.city_id = Object.keys(this.areaselected[1])[0];

        },
        deep: true
      }
    },
    created() {
      this.pageSize = this.pageSizes[0];
      this.getList();
    },
    methods: {
      //分页
      currentChange(val) {
        this.curPage = val;
        this.getList();
      },
      sizeChange(val) {
        this.pageSize = val;
        this.getList();
      },
      //全选
      selectionchange(val) {
        this.ids = [];
        for (var i = 0; i < val.length; i++) {
          this.ids.push(val[i].id);
        }
      },

      //导出
      export_table(){
        this.$ajax.get('/sys/unit/listUnit', {
          params: {
            curPage: this.curPage,
            pageSize: this.pageSize,
            ...this.searchData
          },
        })
        .then( res => {
          console.log(res);
          if (res.resCode == 200 ) {
          if(!res.resObject.index.length || res.resObject.index.length == 0) return
          //要导出的json数据

          //列标题，逗号隔开，每一个逗号就是隔开一个单元格
          let str = `单位名称,注册时间,最近发布时间,发布量,用户数,订单收入\n`;
          let data = res.resObject.index.map(v=> {
            return {
              unit_name: v.unit_name,
              create_time: v.create_time,
              publish_time: v.publish_time,
              publish_num: v.publish_num,
              user_num: v.user_num,
              order_amt: v.order_amt
            }
          })
          //增加\t为了不让表格显示科学计数法或者其他格式
          for(let i = 0 ; i < data.length ; i++ ){
          for(let item in data[i]){
          str+=`${data[i][item] + '\t'},`;
          }
          str+='\n';
          }
          //encodeURIComponent解决中文乱码
          let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
          //通过创建a标签实现
          var link = document.createElement("a");
          link.href = uri;
          //对下载的文件命名
          link.download =`单位统计表${+new Date()}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          }

        }).catch( err => {
          console.log(err);
        })
      },

      //获取表格数据
      getList(sortval,sorttype) {
        let sort = sortval ? {
          order_by: sortval,
          order_flag: sorttype
        } : {};
        this.$ajax.get('/sys/unit/listUnit', {
          params: {
            pageNum: this.curPage,
            pageSize: this.pageSize,
            ...this.searchData,
            ...sort
          }
        })
          .then(res => {
            if (res.resCode == 200) {
              this.totalCount = res.resObject.totalCount;
              this.tableList = res.resObject.index;
            }
          })
          .catch(err => console.log(err))
      },

      batchTopicPublish(sortval,sorttype){
        this.order[sortval] = sorttype == 'ASC' ? 'DESC' : 'ASC';
        this.getList(sortval,this.order[sortval]);
      },

      //错误、成功提示
      message(message, type) {
        Message({
          message: message,
          type: type,
          duration: 5 * 1000
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .unitStatistics {
    /*//@extend %fill;*/
    overflow: auto;
    /*padding: 20px;*/
    padding-bottom: 0;
    /*height: calc(100vh - 100px);*/

    .el-row {
      margin-bottom: 20px;
    }

    .el-form {
      width: 100%;
    }

    .el-range-editor--medium.el-input__inner {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }

    /deep/ .el-card__header {
      padding-bottom: 0;
      border: none;
    }

    .el-dropdown {
      margin-left: 15px;
    }

    /deep/ .el-table .cell {
      display: flex;
      align-items: center;
    }

    .from-wrap {
      width: 100%;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 10px 0 20px;
      .el-form-item {
         margin-bottom: 0;
      }
      .title {
        cursor: pointer;
        font-size: 16px;
        color: #353535;

        span {
          color: #666666;
        }
      }
    }
  }
</style>
