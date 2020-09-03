<template>
  <el-card class="card">
    <div class="button-wrap"
         v-if="hasTopButton">
      <el-button v-for="(item,index) in topBtnList"
                 :type="item.type?item.type:''"
                 :key="index"
                 @click="handleTopBtn(item)">{{item.btnText}}</el-button>
    </div>
    <el-table :data="data"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <!--选择-->
      <el-table-column v-if="hasSelection && data.length!==0"
                       type="selection"
                       width="55"></el-table-column>
      <!--序号-->
      <el-table-column v-if="hasIndex && data.length!==0"
                       type="index"
                       width="55"></el-table-column>
      <!--数据源-->
      <template v-for="(column, index) in columns">
        <!-- 标题 -->
        <el-table-column :key="index"
                         :width="column.width?column.width:'300px'"
                         v-if="column.type=='title'"
                         :label="column.label">
          <template slot-scope="scope">
            <div class="title">
              <div class="img-wrap">
                <img :src="scope.row.title.imgUrl"
                     alt="">
              </div>
              <div class="text-wrap">
                <p class="oneTitle">{{scope.row.title.oneTitle}}</p>
                <p class="twoTitle">{{scope.row.title.twoTitle}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :key="index"
                         v-else-if="column.label==='发布状态'"
                         :label="column.label">
          <template slot-scope="scope">
            <div v-html="getStatus(scope.row.publishStatus)"></div>
          </template>
        </el-table-column>
        <!-- 订单状态 -->
        <el-table-column :key="index"
                         v-else-if="column.label==='订单状态'"
                         :label="column.label">
          <template slot-scope="scope">
            <div v-html="getOrderStatus(scope.row.orderStatus)"></div>
          </template>
        </el-table-column>
        <!-- 审核状态 -->
        <el-table-column :key="index"
                         v-else-if="column.label==='审核状态'"
                         :label="column.label">
          <template slot-scope="scope">
            <div v-html="getReviewStatus(scope.row[column.prop])"></div>
          </template>
        </el-table-column>
        <!-- 关联状态 -->
        <el-table-column :key="index"
                         v-else-if="column.label==='关联状态'"
                         :label="column.label">
          <template slot-scope="scope">
            <div v-html="getLinkStatus(scope.row[column.prop])"></div>
          </template>
        </el-table-column>
        <!-- 图片 -->
        <el-table-column :key="index"
                         v-else-if="column.label==='头像'"
                         width="80px"
                         :label="column.label">
          <template slot-scope="scope">
            <div class="avatar">
              <img :src="scope.row[column.prop]"
                   alt="">
            </div>
          </template>
        </el-table-column>
        <!-- 开关 -->
        <el-table-column :key="index"
                         v-else-if="column.type==='switch'"
                         :label="column.label">
          <template slot-scope="scope">
            <div class="switch">
              <!--  -->
              <el-switch v-model="scope.row.isEffect"
                         active-color="#13ce66"
                         :active-value="1"
                         :inactive-value="0"
                         :disabled="scope.row.disbaled"
                         @change="change(scope.row)"
                         inactive-color="#ff4949">
              </el-switch>

            </div>
          </template>
        </el-table-column>
        <el-table-column :key="index"
                         v-else-if="column.type==='switchs'"
                         :label="column.label">
          <template slot-scope="scope">
            <div class="switch">
              <el-switch v-model="scope.row[column.prop]"
                         active-color="#13ce66"
                         :active-value="1"
                         :inactive-value="0"
                         :disabled="column.disabled"
                         @change="change(scope.row)"
                         inactive-color="#ff4949">
              </el-switch>

            </div>
          </template>
        </el-table-column>
        <!--操作-->
        <el-table-column :label="column.label"
                         :key="index"
                         width="150"
                         v-else-if="column.label==='操作'">
          <template slot-scope="scope">
            <div class="operat">
              <el-link type="success"
                       :underline=false
                       v-for="(item,indexs) in column.operateData"
                       :key="indexs"
                       :disabled="isDisabled(item,scope.row)"
                       :style="isDisabled(item,scope.row)?'color:#ccc;cursor:not-allowed':'color:#409EFF;'"
                       @click="handleOperation(scope.row,item)">{{item.btn}}</el-link>
              <el-dropdown v-if='column.isMoreShow'>
                <el-link type="success"
                         :underline=false
                         style="color:#409EFF;">更多 <i class="el-icon-arrow-down"></i></el-link>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item @click.native="goLine(scope.row)">{{scope.row.publishStatus ==3?'下线':'上线'}}</el-dropdown-item>
                  <el-dropdown-item @click.native="forbid(scope.row)">{{scope.row.isComment==0?'禁言':'取消禁言'}}</el-dropdown-item>
                  <el-dropdown-item @click.native="goTop(scope.row)">{{scope.row.isTopping==0?'置顶':'取消置顶'}}</el-dropdown-item>
                  <el-dropdown-item @click.native="del(scope.row)">删除</el-dropdown-item> -->
                  <el-dropdown-item :disabled="item.disabled"
                                    :style="item.disabled?'color:#ccc;cursor:not-allowed':'color:#409EFF;'"
                                    v-for="(item,index) in column.moreData"
                                    :key="index"
                                    @click.native="handelMoreData(item,scope.row)">{{item.btn}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
        <!-- 正常文本 -->
        <el-table-column header-align="left"
                         :key="index"
                         v-else
                         :sortable="column.hasSort"
                         :prop="column.prop"
                         :label="column.label">
        </el-table-column>
      </template>
      <!--体验活动页面单独的操作列表-->
      <el-table-column label="操作"
                       v-if="operate.length!==0"
                       width="150">
        <template slot-scope="scope">
          <el-link type="success"
                   :underline=false
                   style="color:#409EFF;margin-right:5px"
                   @click="showData(scope.row)">数据</el-link>
          <el-link type="success"
                   :underline=false
                   style="color:#409EFF;margin-right:5px"
                   @click="edit(scope.row)">编辑</el-link>
          <el-dropdown>
            <el-link type="success"
                     :underline=false
                     style="color:#409EFF;">更多 <i class="el-icon-arrow-down"></i></el-link>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="goLine(scope.row)">{{scope.row.publishStatus ==3?'下线':'上线'}}</el-dropdown-item> -->
              <el-dropdown-item @click.native="forbid(scope.row)">{{scope.row.isComment==0?'禁言':'取消禁言'}}</el-dropdown-item>
              <el-dropdown-item @click.native="goTop(scope.row)">{{scope.row.isTopping==0?'置顶':'取消置顶'}}</el-dropdown-item>
              <el-dropdown-item @click.native="del(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <!-- <slot name="handleColumn"></slot> -->
    </el-table>
  </el-card>
</template>
<script>

export default {
  name: 'myTable',
  props: {
    //是否可以选择
    hasSelection: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    //是否有序列项
    hasIndex: {
      type: Boolean,
      default: function () {
        return false
      },
    },
    //这是数据源  
    data: {
      type: Array,
      default: () => []
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: () => [
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'title',   //<String>  对应属性名
          label: '标题',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'status',   //<String>  对应属性名
          label: '发布状态',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'classify',   //<String>  对应属性名
          label: '活动分类',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'company',   //<String>  对应属性名
          label: '发布单位',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'time',   //<String>  对应属性名
          label: '发布时间',  //<String>   表头标签
        },
        {
          hasSort: false,  //<Boolean> 是否排序
          prop: 'readTime',   //<String>  对应属性名
          label: '阅读数',  //<String>   表头标签
        }
      ]
    },
    //表格擦做数据
    operate: {
      type: Array,
      default: () => []
    },
    hasTopButton: {
      type: Boolean,
      default: false
    },
    topBtnList: {
      type: Array,
      default: () => []
    },

  },
  computed: {
    getStatus () {
      return function (val) {
        if (val == '1') {
          return "<span >待审核</span>"
        } else if (val == '2') {
          return "<span style='color:red'>已下线</span>"
        } else {
          return "<span style='color:#29bc4f'>已发布</span>"
        }
      }
    },
    //订单状态
    getOrderStatus () {
      return function (val) {
        if (val == '1') {
          return "<span style='color:#909399'>待核销</span>"
        } else if (val == '2') {
          return "<span style='color:#E6A23C'>待评价</span>"
        } else if (val == '3') {
          return "<span style='color:#F56C6C'>已退款</span>"
        } else {
          return "<span style='color:#67C23A'>已完成</span>"
        }
      }
    },
    //审核状态
    getReviewStatus (val) {
      return function (val) {
        if (val == '0') {
          return "<span style='color:#67C23A'>已上线</span>"
        } else if (val == '3') {
          return "<span style='color:#E6A23C'>待审核</span>"
        } else if (val == '2') {
          return "<span style='color:#F56C6C'>未通过</span>"
        }
      }
    },
    //关联状态
    getLinkStatus (val) {
      return function (val) {
        if (val == '0') {
          return "<span style='color:#67C23A'>已关联</span>"
        } else if (val == '2') {
          return "<span style='color:#F56C6C'>未关联</span>"
        }
      }
    },
    isDisabled (row, val) {
      return function (row, val) {
        if (val.btn == '核销') {
          if (row.orderStatus == 1) {
            return true
          } else {
            return false
          }
        } else if (val.btn == '退款') {
          if (row.orderStatus != 4) {
            return true
          } else {
            return false
          }
        }
      }
    },
    //更多下拉点击
    handelMoreData (item, row) {
      item.cb(row)
    }
  },

  methods: {
    //将选中的行发送到父组件
    handleSelectionChange (val) {
      const selectionArr = [];
      val.forEach(function (el) {
        selectionArr.push(el);
      });
      this.$emit('commitSelection', selectionArr);
    },
    //删除事件
    del (val) {
      this.$emit("deleltRow", val)
    },
    //数据点击
    showData (val) {
      this.$emit("moreData", val)
    },
    //操作点击方法
    handleOperation (row, item) {
      item.cb(row, item)
    },
    //编辑按钮
    edit (val) {
      this.$emit('editForm', val)
    },
    //更多按钮点击触发
    handleCommand (command) {
      console.log(command)

    },
    //上线
    goLine (val) {
      this.$emit('goLine', val)
    },
    //禁言
    forbid (val) {
      this.$emit('forbid', val)
    },
    //置顶按钮
    goTop (val) {
      this.$emit('goTop', val)
    },
    //添加按钮
    addActive () {
      this.$router.push({
        name: 'addActivePage'
      })
    },
    change (row) {
      this.$emit('change', row)
    },
    handelUpdate (val) {
      this.$emit('change', val)
    },
    handleTopBtn (item) {
      item.cb('')
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  .button-wrap {
    height: 60px;
    margin-top: -20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  /deep/ .title {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;

    .img-wrap {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .text-wrap {
      overflow: hidden;
      .oneTitle {
        font-weight: 650;
        font-size: 18px;
      }
      .twoTitle {
        font-size: 14px;
        color: #999;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  /deep/ .avatar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    padding-left: 5px;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  /deep/ .operat {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
