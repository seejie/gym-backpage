<template>
  <div class="networkadd">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form" label-width="80px" ref="createWayForm">
            <div class="create-way-title">基础信息</div>
            <el-form-item label="*套餐标题" style="margin-top: 20px">
              <el-input placeholder="请输入名称，30字以内" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="摘要" >
              <el-input type="textarea" placeholder="请输入介绍，150字以内" v-model="form.summary"></el-input>
            </el-form-item>
            <el-form-item label="*图文封面">
              <img-include v-model="form.pic" :max="1" :cropper="cropper"></img-include>
            </el-form-item>
            <el-form-item label="特色标签" style="margin-top: 20px">
              <el-input placeholder="请输入标签" v-model="form.tags"></el-input>
            </el-form-item>
            <div class="create-way-title">发布设置</div>
            <el-form-item label="*发布位置" style="margin-top: 20px">
              <el-select v-model="form.columnSort" placeholder="排序位置">
                <el-option label="置顶" :value="1"></el-option>
                <el-option label="默认" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="*发布时间">
              <el-radio-group v-model="form.releaseType">
                <div style="margin-top:10px;">
                  <el-radio :label="1">立即发布</el-radio>
                </div>
                <div style="margin-top:10px;">
                  <el-radio :label="2">草稿，暂不发布</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit()">提交</el-button>
              <el-button @click="$router.push({name:'customCourse'});">取消</el-button>
            </el-form-item>


          </el-form>
        </el-col>
        <!--添加网点-->

        <el-col :span="12">
          <div class="branch">
            <div class="branch-title">
              选择课程
            </div>
            <div class="branch-content">
              <div class="surface-img-wrap">
                <div v-if="form.customCourse.courselist.length>0">
                  <img :src="form.customCourse.courselist[0].banner" alt="" width="324px">
                  <div>{{form.customCourse.courselist[0].title}}</div>
                </div>

              </div>
              <div class="branch-item" v-for="(item,index) in form.customCourse.courselist">
                <div class="branch-item-box">
                  <div class="surface-img-item">
                    <img :src="item.banner" alt="" width="70" height="60">
                  </div>
                  <div style="height: 60px;width: 200px">
                    <div style="height: 50px">{{item.title}}</div>
                    <div style="display: flex;justify-content: space-between;font-size: 13px"><span>课程</span><span>{{item.createTime}}</span></div>
                  </div>
                </div>
                <div class="branch-handle-box">
                  <i class="el-icon-error" @click="opratemap(0,index)"></i>
                  <i class="el-icon-upload2" @click="opratemap(1,index)"></i>
                  <i class="el-icon-download" @click="opratemap(2,index)"></i>
                </div>
              </div>
              <el-button @click="addBranch" style="width: 100%">添加课程</el-button>
              <el-dialog :visible.sync="form.customCourse.isshow" title="选择课程">
                <el-form class="el-row">
                  <el-form-item >
                    <el-col :span="8" style="display: flex">
                      <el-input placeholder="输入关键字" style="width: 150px" v-model="form.customCourse.title"></el-input> <el-button type="primary" @click="addBranch">搜索</el-button>
                    </el-col>
                  </el-form-item>
                </el-form>
                <div class="img-box">
                  <div class="img-item" v-for="(item, index) in form.customCourse.list" :key="index">
                    <el-image
                      style="width: 118px; height: 118px; background-color: #f6f6f6;"
                      :src="item.banner"></el-image>
                    <div style="margin: 10px 0 10px 8px; overflow: hidden; line-height: initial;">
                      <el-checkbox-group v-model="form.customCourse.ids" @change="handleCheckedCitiesChange">
                        <el-checkbox :label="item">
                          {{ item.title }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
                <div style="text-align: right;margin-top: 20px">
                  <Pagination v-if="form.customCourse.length!=0" :pageSize="form.customCourse.pageSize"
                              :pageSizes="form.customCourse.pageSizes" :total="form.customCourse.totalCount"
                              @currentChange="currentChange" @sizeChange="sizeChange"></Pagination>
                </div>
                <div style="text-align: center">
                  <el-button type="primary" @click="toggleSelection(1)">确认</el-button>
                  <el-button @click="toggleSelection(2)">取消</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
  import {Message} from "element-ui";
  import ImgInclude from '@/components/CropImgInclue/index.vue'
  import { customCourseList,packages } from '@/api/customCourse/customCourse'
  import Pagination from "@/components/Pagination";
  export default {
    components: {
      ImgInclude,
      Pagination
    },
    data() {
      return {
        id: this.$route.params.id,
        cropper: [{
          name: 'banner图',
          ratio_x: 1.89,
          ratio_y: 1,
          ratio: 1.89,
          desc: '你的用户将在圈子频道顶部互动滑动区域，看到此封面。'
        },{
          name: '普通封面',
          ratio_x: 1.53,
          ratio_y: 1,
          ratio: 1.53,
          desc: '你的用户将在资讯列表里，看到此封面。'
        }],
        form: {
          title: '',
          summary:'',
          pic: {},
          tags:'',
          columnSort:0,
          releaseTime:'',
          releaseType:0,
          customCourse:{isshow:false, courselist:[],courselistid:[],ids:[],title:'',curPage:1,pageSize:10,pageSizes: [5, 10, 20],totalCount:0,list:[],title:''}
        },

      }
    },
    mounted() {
    },
    created() {
      this.$route.meta.title = this.id > 0 ? "套餐编辑" : "添加套餐";
      this.load();
    },
    methods: {
      onSubmit() {
        if(this.form.title.length==0)
        {
          this.message("套餐标题不能为空","info");
        }
        else if(this.form.title.length>30)
        {
          this.message("套餐标题字数不能超过30字","info");
        }
        else  if(this.form.pic == null || this.form.pic['ratio1.89']==null)
        {
          this.message("请添加图片", "error");
        }
        else if(this.form.customCourse.courselist==null)
        {
          this.message("请添加课程", "error");
        }
        else  if(this.form.releaseType=='')
        {
          this.message("请选择发布状态","info");
        }
        else {
          this.form.banner = this.form.pic != null && this.form.pic['ratio1.89'] != null ? this.form.pic['ratio1.89'][0] : '';
          this.form.indexPic = this.form.pic != null && this.form.pic['ratio1.53'] != null ? this.form.pic['ratio1.53'][0] : '';
          var params=this.form;
          params.id=this.id;
          params.customCourseList=this.form.customCourse.courselist;
          var url=this.id==0?packages.createPackage(params):packages.updatePackage(params);
          url.then(res => {
              if (res.resCode == 200) {
                this.message("保存成功", 'success');
                this.$router.push({name:'customCourse'});
              } else {
                this.message(res.message, 'error');
              }
            })
            .catch(err => console.log(err))
        }
      },
      load(){
        if(this.id>0) {
          packages.findCustomCoursePackageById({id:this.id}).then(res => {
            if (res.resCode == 200) {
              var data=res.resObject;
              this.form.title=data.title;
              this.form.summary=data.summary;
              this.form.pic = { 'ratio1.89': [data.banner] , 'ratio1.53': [data.indexPic] }
              this.form.banner = this.form.pic['ratio1.89'][0];
              this.form.indexPic=this.form.pic['ratio1.53'][0];
              this.form.tags=data.tags;
              this.form.columnSort=data.columnSort;
              this.form.releaseTime=data.releaseTime;
              this.form.releaseType=data.releaseType;
              this.form.customCourse.courselist=data.customCourseList==null?[]:data.customCourseList;
            }
          }).catch(err => console.log(err))
        }
      },
      addBranch() {
        //添加网点
        this.form.customCourse.isshow = true;
        var params = {
          title: this.form.customCourse.title,
          pageNum: this.form.customCourse.curPage,
          pageSize: this.form.customCourse.pageSize,
        }
        this.form.customCourse.ids=[];
        customCourseList.load(params).then(res => {
          if (res.resCode == 200) {
            this.form.customCourse.totalCount = res.resObject.totalCount
            this.form.customCourse.list = res.resObject.list;
          } else {
            this.message(res.message, 'error')
          }
        })
      },
      toggleSelection(type){//确认网点
        this.form.customCourse.isshow =false;
        if(type==2)
        {
          this.form.customCourse={isshow:false, courselist:[],courselistid:[],ids:[],title:'',curPage:1,pageSize:10,pageSizes: [5, 10, 20],totalCount:0,list:[],title:''}
        }
        else
        {
          if(this.form.customCourse.ids.length==0)
          {
            this.message("请选择课程","info")
          }
          else {
            this.form.customCourse.ids.forEach(f => {
              this.form.customCourse.courselist.push(f);
            });
          }
        }
      },
      opratemap(type,index) {
        switch (type) {
          case 0://删除
            this.form.customCourse.courselist.splice(index, 1);
            this.form.customCourse.courselistid.splice(index, 1);
            break;
          case 1://向上
            if (index != 0) {
              this.form.customCourse.courselist[index] = this.form.customCourse.courselist.splice(index - 1, 1, this.form.customCourse.courselist[index])[0];
              this.form.customCourse.courselistid[index] = this.form.customCourse.courselistid.splice(index - 1, 1, this.form.customCourse.courselistid[index])[0];
            }
            else {
              this.form.customCourse.courselist.push(this.form.customCourse.courselist.shift());
              this.form.customCourse.courselistid.push(this.form.customCourse.courselistid.shift());
            }
            break;
          case 2://向下
            if (index != this.form.customCourse.courselist.length - 1) {
              this.form.customCourse.courselist[index] = this.form.customCourse.courselist.splice(index + 1, 1, this.form.customCourse.courselist[index])[0];
              this.form.customCourse.courselistid[index] = this.form.customCourse.courselistid.splice(index + 1, 1, this.form.customCourse.courselistid[index])[0];
            }
            else {
              this.form.customCourse.courselist.unshift(this.form.customCourse.courselist.splice(index, 1)[0]);
              this.form.customCourse.courselistid.unshift(this.form.customCourse.courselistid.splice(index, 1)[0]);
            }
            break;

        }
      },
      //分页
      currentChange(val) {
        this.form.customCourse.curPage = val;
        this.addBranch();
      },
      sizeChange(val) {
        this.form.customCourse.pageSize = val;
        this.addBranch();
      },
      //全选
      handleSelectionChange(val) {
        for (var i = 0; i < val.length; i++) {
          var s = {
            id: val[i].id,
            pic: val[i].banner,
            time: this.$moment(val[i].createTime).format('YYYY-MM-DD HH:mm:ss'),
            title: val[i].title
          };
          var ids={id:val[i].id};
          if (JSON.stringify(this.form.customCourse.courselist).indexOf(JSON.stringify(s)) == -1)
            this.form.customCourse.courselist.push(s);
          if(JSON.stringify(this.form.customCourse.courselistid).indexOf(JSON.stringify(ids))==-1)
          {
            this.form.customCourse.courselistid.push(ids);
          }
        }
      },
      handleCheckedCitiesChange(value) {

        this.form.customCourse.ids = value;

      },
      message(message, type) {//消息通知
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
  .networkadd {
    padding: 20px;

    .create-way-title {
      padding: 18px 20px;
      border-bottom: 1px solid #e6ebf5;
      color: #303133;;
    }

    .branch {
      width: 324px;
      text-align: left;
      .branch-title {
        padding: 18px 20px;
        border-bottom: 1px solid #e6ebf5;
        color: #303133;;
        font-size: 18px;
        font-weight: bold;
      }

      .branch-content {
        width: 324px;
        border: 1px solid #e3e3e3;
      }

      .surface-img-wrap {
        width: 100%;
        height: 132px;
        background: #ddd;
        overflow: hidden;
      }

      .surface-img-item {
        width: 70px;
        height: 60px;
        background: #ddd;
      }

      .branch-item {
        position: relative;
        margin-top: 20px;
      }

      .branch-item-box {
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;
      }

      .branch-handle-box {
        align-items: center;
        align-content: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(255, 255, 255, .6);
        display: none;
      }

      .branch-handle-box i {
        cursor: pointer;
        font-size: 25px;
        margin-left: 5px;
      }

      .branch-item:hover .branch-handle-box {
        display: flex;
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

      .copy_text {
        word-break: break-all;
        color: #666;
        font-size: 12px;
        padding: 0 5px;
        height: 40px;
        line-height: 20px;
        overflow: hidden;
        position: relative;
      }

      .copy_btn {
        position: absolute;
        background: #fff;
        line-height: 20px;
        right: 5px;
        padding-left: 4px;
        bottom: 0;
        cursor: pointer;
        color: #29bc4f;
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
  }



</style>
