<template>
  <div class="notice">
    <el-row style="margin: 0">
      <el-col :span="18" :offset="3">
        <el-card shadow="never">
          <div slot="header" class="notice-title">
            <span v-for="item in fenleiData" :class="{'active':selectId==item.id}" @click="getinfo(item.id)">{{item.name}}</span>
          </div>
          <div class="notice-box">
            <div class="notice-item" v-if="announceData.length!=0" v-for="item in announceData">
              <span class="item-time">{{$moment(item.publish_time).format('YYYY-MM-DD')}}</span>
              <span class="item-txt">
                【{{item.category_name}}】{{item.title}}
              </span>
            </div>
            <div class="notice-item" v-if="announceData.length==0">
              <span class="item-time"></span>
              <span class="item-txt">
                暂无数据
              </span>
            </div>
          </div>
          <!-- 分页 -->
          <div style="text-align: right;margin-top: 40px" v-if="announceData.length!=0">
            <Pagination :pageSize="10"
                        :pageSizes="[10]" :total="totalCount"></Pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Pagination from "../../components/Pagination";
  import {Message} from "element-ui";

  export default {
    name: "assist",
    components: {
      Pagination
    },
    data() {
      return {
        fenleiData: [],
        announceData: [],
        //
        totalCount: 0,
        curPage: 1,
        //
        selectId: -1
      }
    },
    created() {
      this.categoryList();
      this.helpList();
    },
    methods: {
      getinfo(id) {
        this.selectId = id;
        this.helpList();
      },
      //获取帮助列表
      helpList() {
        let params = {
          publish_status: 1
        };
        if (this.selectId == -1) {
          delete params.category_id;
        } else {
          params.category_id = this.selectId;
        }
        this.$ajax.get('/setting/helpList', {params})
          .then(res => {
            if (res.resCode == 200) {
              this.announceData = res.resObject.index;
              this.totalCount = res.resObject.totalCount;
              this.curPage = res.resObject.curPage;
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err))
      },
      //获取帮助分类
      categoryList() {
        this.$ajax.get('/setting/categoryList?type=2')
          .then(res => {
            if (res.resCode == 200) {
              this.fenleiData = res.resObject.index;
              this.fenleiData.unshift({id: -1, name: '全部'});
            } else {
              this.message(res.message, 'error');
            }
          })
          .catch(err => console.log(err))
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
  .notice {
    overflow: auto;
    padding-top: 20px;
    height: calc(100vh - 100px);

    .el-card {
      overflow: auto;
      height: inherit;
    }

    /deep/ .el-card__body {
      padding-top: 0;
    }

    .notice-title {
      .active {
        color: #000000;
      }

      span {
        cursor: pointer;
        color: #6d7795;
        display: inline-block;
        margin-right: 50px;
      }
    }

    .notice-box {
      .notice-item {
        height: 68px;
        color: #888888;
        border-bottom: 1px dashed #ecf1f2;
        display: flex;
        align-items: center;

        span {
          cursor: pointer;
        }

        .item-time {
          margin-right: 20px;
        }
      }
    }

  }
</style>
