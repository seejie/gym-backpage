<template>
    <div>
      <el-form class="el-row">
        <el-form-item>
          <el-row type="flex" >
            <el-col :span="7" style="display: flex">
              <el-input placeholder="请输入关键字" style="width: 150px" v-model="tandata.key"></el-input>
              <el-button type="primary" style="margin-left: 10px" @click="showloaddata()">搜索</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="img-box el-row--flex" style="flex-wrap: wrap">
        <div class="img-item" v-for="(item, index) in tandata.list" :key="index">
          <el-image
            style="width: 118px; height: 118px;background-color: #f6f6f6"
            :src="item.banner"
            fit="cover"
          ></el-image>
          <div style="margin: 10px 0 10px 8px;overflow: hidden">
            <el-checkbox-group v-model="tandata.link" @change="handleCheckedCitiesChange(item)">
              <el-checkbox  :label="item">
                {{ type==1?item.title:item.trainingTitle }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div style="text-align: right;margin-top: 20px">
        <Pagination v-if="tandata.length!=0" :pageSize="tandata.pageSize"
                    :pageSizes="tandata.pageSizes" :total="tandata.totalCount"
                    @currentChange="currentdataChange" @sizeChange="sizedataChange"></Pagination>
      </div>

      <div slot="footer"
           class="dialog-footer" style="text-align: center;margin-top: 10px">
        <el-button @click="commit(0)">取 消</el-button>
        <el-button type="primary"
                   @click="commit(1)">确 定</el-button>
      </div>
    </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {  CourseQuestionaire, training } from '@/api/customCourse/customCourse'
  import { Message } from 'element-ui'
    export default {
      name: "odialog",
      props: {
        trainingType: {
          type: Number,
          default: 1
        },
        type: {
          type: Number,
          default: 1
        },
      },
      components: {
        Pagination
      },
      data() {
        return {
          tandata: {
            isshow: false,
            key: '',
            pageSize: 20,
            curPage: 1,
            totalCount: 0,
            pageSizes: [20, 30, 50],
            list: [],
            link: [],
            type: 1,
            curlink: ''
          }
        }
      },
      mounted() {
        this.tandata.type = this.type;
        this.tandata.link = [];
        this.tandata.curlink = '';
        this.showloaddata();
      },
      methods: {
        showloaddata() {
          var params = {
            title: this.tandata.key,
            pageNum: this.tandata.curPage,
            pageSize: this.tandata.pageSize,
            status:1
          };
          if (this.tandata.type > 1) {
            params = {
              trainingTitle: this.tandata.key,
              trainingType: this.trainingType,
              status:1
            };
          }
          this.tandata.list = [];
          var url = this.tandata.type == 1 ? CourseQuestionaire.load(params) : training.load(params);
          url.then(res => {
            if (res.resCode == 200) {
              this.tandata.totalCount = res.resObject.totalCount;
              this.tandata.list = res.resObject.list != null ? res.resObject.list : []
            } else {
              this.message(res.message, 'error');
            }
          }).catch(err => console.log(err))
        },

        currentdataChange(val) {
          this.tandata.curPage = val;
          this.showloaddata();
        },
        sizedataChange(val) {
          this.tandata.pageSize = val;
        },
        handleCheckedCitiesChange(val) {
          this.tandata.link = [];
          this.tandata.link.push(val);
          this.tandata.curlink = val.linkUrl;

        },
        commit(type) {

          if (type == 0) {
            this.$emit('commit');
          }
          else {
            if (this.tandata.link.length == 0) {
              this.message("请选择数据", 'info')
              return false;
            }
            this.$emit('commit', this.tandata.curlink, this.tandata.link[0].id);
          }
        },
        message(message, type) {
          Message({
            message: message,
            type: type
          })
        }
      },
      watch: {
        type: {
          handler(newval, oldValue) {
            this.tandata = {
              isshow: false,
                key: '',
                pageSize: 20,
                curPage: 1,
                totalCount: 0,
                pageSizes: [20, 30, 50],
                list: [],
                link: [],
                type: 1,
                curlink: ''
            };
            this.tandata.type = newval;
            this.showloaddata();
          },
          immediate:true,
          deep: true
        }
      }
    }
</script>

<style scoped>
  .img-item {
    margin-bottom: 20px;
    margin-right: 0.5%;
    margin-left: 0.5%;
    width: 120px;
    border: 1px solid #e5e9ef;
    display: flex;
    flex-flow: column;
  }
</style>
