<template>
  <div>
    <el-row :gutter="0">
      <!--左边-->
      <el-col :span="24">
        <div class="managePage">
          <!-- 表单 -->
          <div class="from-wrap">
            <div class="title">
              全部课程
              <span>（{{ totalCount }}）</span>
            </div>
            <el-form :inline="true" ref="formInline" :model="searchData" class="demo-form-inline">
              <el-form-item prop="title" label="搜索标题">
                <el-input v-model="searchData.courseTitle" placeholder="课程标题"></el-input>
              </el-form-item>
              <el-form-item prop="company" label="发布单位">
                <el-input v-model="searchData.unitName" placeholder="发布单位"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getNewsList()">
                  搜索
                </el-button>
                <el-button @click="initSearchData()">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 图片 -->
          <el-card shadow="never" class="card">
            <!--全选、添加等操作按钮-->
            <div slot="header">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                全选
              </el-checkbox>
              <el-button type="primary" style="margin-left: 10px">
                <router-link to="/coursesubjectmanager/add-course">
                  添加课程
                </router-link>
              </el-button>
            </div>
            <!--移动分组-->
            <div v-loading="loading">
              <!--图片-->
              <div class="img-box">
                <div class="img-item" v-for="(item, index) in getNewsData" :key="index">
                  <el-image
                     style="width: 118px; height: 118px;background-color: #f6f6f6"
                     :src="item.courseCover"
                     fit="cover"
                  ></el-image>
                  <div style="margin: 10px 0 10px 8px;overflow: hidden">
                    <el-checkbox-group v-model="ids" @change="handleCheckedCitiesChange">
                      <el-checkbox v-if="!getId" :label="item">
                        {{ item.courseTitle }}
                      </el-checkbox>
                      <el-checkbox v-if="getId" :label="item.id">
                        {{ item.courseTitle }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="img-btn">
                    <!--查看-->
                    <el-popover placement="bottom" width="200" trigger="hover">
                      <img style="background-color: #0a76a4;width: 100%;height: 200px" />
                      <div>{{ item.courseTitle }}</div>
                      <i class="el-icon-view" slot="reference"></i>
                    </el-popover>
                    <!--编辑-->
                    <router-link
                       :to="{
                        name: 'material/imagetextAdd',
                        params: { id: item.id },
                      }"
                    >
                      <i class="el-icon-edit"></i>
                    </router-link>
                    <!--删除-->
                    <el-popover placement="bottom" width="250" trigger="manual" v-model="delModal[index]">
                      <p>确定删除此课程吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button type="primary" size="mini" @click="delNews(item, index)">
                          确定
                        </el-button>
                        <el-button size="mini" @click="openCloseDelVoiceModal(index)">
                          取消
                        </el-button>
                      </div>
                      <i class="el-icon-delete" slot="reference" @click="openCloseDelVoiceModal(index)"></i>
                    </el-popover>
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <div style="text-align: right;">
                <Pagination
                   v-if="getNewsData.length != 0"
                   :pageSize="pageSize"
                   :pageSizes="pageSizes"
                   :total="totalCount"
                   @currentChange="currentChange"
                   @sizeChange="sizeChange"
                ></Pagination>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '../../../../components/Pagination';
import { Message } from 'element-ui';
import deleteEmptyParams from '@/utils/deleteEmptyParams';
import { courseList } from '../../sever';

export default {
  props: {
    // 弹窗组件是否显示遮罩层
    modal: {
      type: Boolean,
      default: true,
    },
    getId: {
      type: Boolean,
      default: true,
    },
  },
  components: { Pagination },
  data() {
    return {
      loading: false,
      delFenzu: false,
      editFenzu: false,
      addFenzu: false,
      // 分页
      totalCount: 0,
      curPage: 1,
      pageSizes: [10, 20, 30],
      pageSize: 0,
      getNewsData: [],
      // 查询
      searchData: {
        courseTitle: '',
        unitName: null,
      },
      // 移动
      ids: [],
      allIds: [],
      checkAll: false,
      isIndeterminate: false,
      //
      delModal: [],
    };
  },
  created() {
    this.pageSize = this.pageSizes[2];
    this.getNewsList();
  },
  methods: {
    // 全选
    handleCheckAllChange(val) {
      this.ids = val ? this.allIds : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.$emit('handleCheckedCitiesChange', value);
      if (this.getId) {
        this.ids = value;
        this.isIndeterminate = this.ids.length > 0;
      }
    },
    // 重置查询数据
    initSearchData() {
      this.searchData = {
        courseTitle: '',
        unitName: '',
      };
    },
    // 分页
    currentChange(val) {
      this.curPage = val;
      this.getNewsList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getNewsList();
    },
    // 查询图文
    getNewsList() {
      const payload = {
        courseTitle: this.searchData.courseTitle,
        courseStatus: 1,
        unitName: this.searchData.unitName,
        pageNum: this.curPage,
        pageSize: this.pageSize,
      };
      courseList(deleteEmptyParams(payload)).then(res => {
        if (res.resCode == 200) {
          this.totalCount = res.resObject.totalCount;
          this.getNewsData = res.resObject.list;
          for (const n in this.getNewsData) {
            this.allIds.push(this.getNewsData[n].id);
            this.delModal.push(false);
            this.getNewsData[n].indexPic = this.getNewsData[n].indexPic.split(',')[0];
            console.log(this.getNewsData[n].indexPic);
          }
        }
      })
        .catch(err => console.log(err));
    },
    // 错误、成功提示
    message(message, type) {
      Message({
        message: message,
        type: type,
        duration: 5 * 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }

  .managePage {
    /*//@extend %fill;*/
    overflow: auto;
    padding: 20px;
    padding-bottom: 0;
    height: calc(100vh - 100px);

    .el-checkbox {
      font-weight: normal;
    }
    .el-card {
      overflow: auto;
      height: calc(100vh - 187px);
    }

    .from-wrap {
      width: 100%;
      min-height: 64px;
      background: #f5f7fa;
      border: 1px solid #e5e9ef;
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 10px 15px 20px;
      /deep/ .el-form-item {
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
    .img-box {
      display: flex;
      flex-wrap: wrap;
      /*justify-content: space-between;*/
      .img-item {
        margin-bottom: 20px;
        margin-right: 0.5%;
        margin-left: 0.5%;
        width: 120px;
        border: 1px solid #e5e9ef;
        display: flex;
        flex-flow: column;
      }
      img {
        height: 124px;
        background-color: #29bc4f;
      }
      .img-btn {
        color: #abb2c4;
        padding: 0 10px;
        background-color: #f5f7fa;
        border-top: 1px solid #e5e9ef;
        display: flex;
        justify-content: space-between;
        i {
          padding: 8px 0;
          cursor: pointer;
          :hover {
            color: #29bc4f;
          }
        }
      }
    }
    .text-item {
      color: #666666;
      font-size: 14px;
      line-height: 36px;
      padding-bottom: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        cursor: pointer;
      }

      .active {
        color: #29bc4f;
      }
    }
  }
</style>
