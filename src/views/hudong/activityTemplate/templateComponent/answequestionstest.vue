<template>
  <div class="basicregistration">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" class="elfrom">
        <el-form-item label="*活动标题">
          <el-col :span="8"><el-input placeholder="请输入标题，30字以内" v-model="form.name" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="活动摘要">
          <el-col :span="8"><el-input type="textarea" placeholder="请输入摘要，150字以内" :row="5" v-model="form.summary"></el-input></el-col>
        </el-form-item>
        <el-form-item label="活动介绍" >
          <el-col :span="18"><myEditor refs='name1' v-model="form.intro"></myEditor></el-col>
        </el-form-item>
        <el-form-item label="*活动封面">
          <img-include v-model="form.imgs" :max="9" :cropper="cropper"></img-include>
        </el-form-item>
        <el-form-item label="题目设置" label-width="80px">
          <el-row>
            <el-col :span="8"><el-button type="primary" @click="addkey(1,1)">添加题目</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="30px" style="border-bottom: 1px dashed #cacaca;padding-bottom: 10px" v-for="(item,index) in form.keys" :key="index">
          <el-row>
            <el-col :span="2">标题{{index+1}}</el-col>
            <el-col :span="6"><el-input  placeholder="请输入，30字以内" v-model="item.title" style="width: 90%"></el-input></el-col>
            <el-col :span="6"><i @click="removekey(index,1)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style="margin-left: 20px;font-size: 18px;" class="el-icon-circle-plus-outline" @click="addkey(index,1)"></i></el-col>
          </el-row>
          <el-row>
            <el-col :span="2" >题目类型</el-col>
            <el-col :span="8">
              <el-radio v-model="item.type" :label="1">单选</el-radio> <el-radio v-model="item.type" :label="2">多选</el-radio> <el-button type="primary" @click="addkey(index,2)">添加选项</el-button>
            </el-col>
          </el-row>
          <el-row  v-for="(item1,index1) in item.selects" :key="index1" type="flex" >
            <el-col :span="2">选项{{index1+1}}</el-col>
            <el-col :span="6"><el-input  placeholder="请输入，30字以内" v-model="item1.title" style="width: 90%"></el-input></el-col>
            <el-col :span="6"><el-radio v-model="item1.isanswer"  :label="1">答案</el-radio><i @click="removekey(index,2,index1)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style="margin-left: 20px;font-size: 18px;" class="el-icon-circle-plus-outline" @click="addkey(index,2)"></i></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="*答案设置" label-width="80px">
          <el-row>
            <el-col :span="8"><el-button type="primary" @click="addanswer">添加得分区间</el-button></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="30px">
          <el-row  v-for="(item,index) in form.answers" :key="item.id"  type="flex">
            <div style="width: 100px">*得分区间{{index+1}}</div>
            <div style="width: 100%">
            <div style="display: flex">
            <el-col :span="6"><el-input  placeholder="请输入最低得分" v-model="item.minscore" style="width: 90%"></el-input> </el-col>
            <el-col :span="6">
              <el-input  placeholder="请输入最高得分" v-model="item.maxscore" style="width: 90%"></el-input>
            </el-col>
            <el-col :span="6"><i @click="removeanswer(index)" style="font-size: 18px;" class="el-icon-delete-solid"></i> <i style="margin-left: 20px;font-size: 18px;" class="el-icon-circle-plus-outline" @click="addanswer"></i>
            </el-col>
            </div>
            <div style="overflow: hidden;margin-top: 10px">
              <el-input  placeholder="请输入对应解答" v-model="item.ask" style="width: 47%"></el-input>
            </div>
            </div>
          </el-row>
        </el-form-item>
        <el-form-item label-width="0px">
          <h3 style="margin:0">参与条件设置</h3>
        </el-form-item>
        <el-form-item label="*有效期至">
          <el-col :span="4">
            <el-date-picker placeholder="选择日期时间"   v-model="form.onTime"  type="datetime"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="*答题限制">
          <el-col :span="8"><el-input placeholder="请输入每题限定答题 时间，单位秒" v-model="form.limit" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="*抽取提数">
          <el-col :span="8"><el-input placeholder="输入每次测试从题目库中抽取的题数" v-model="form.choutinum" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="付费设置">
          <el-col :span="8"><el-input placeholder="请输入参加所需费用" v-model="form.charge" width="80%"></el-input></el-col>
        </el-form-item>
        <el-form-item label="免费次数">
          <el-col :span="8"><el-input placeholder="请输入用户可免费参加的次数" v-model="form.mianfeinum" width="80%"></el-input></el-col>
        </el-form-item>
          <el-form-item label-width="0px">
          <h3 style="margin:0">发布设置</h3>
        </el-form-item>
        <el-form-item  label="发布位置">
          <el-select placeholder="请选择" v-model="form.position">
            <el-option label="置顶" :value="1"></el-option>
            <el-option label="默认" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="*发布时间">
          <el-row>
            <el-radio v-model="form.radio" :label="3">发布</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="form.radio" :label="2">草稿，暂不发布</el-radio>
          </el-row>
          <el-row>
            <el-col><el-radio v-model="form.radio"  :label="4">定时发布</el-radio></el-col>
            <el-col>
              <el-date-picker placeholder="选择日期时间"   v-model="form.publishTime"  type="datetime"></el-date-picker>
            </el-col>
          </el-row>


        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import ImgInclude from  "@/components/CropImgInclue"
  import Pagination from "@/components/Pagination";
  export default {
    name: "index",
    components:{
      ImgInclude,
      Pagination
    },
    data(){
      return{
        id:this.$route.params.id,
        list:[],
        form:{name:'',summary:'',intro:'',imgs:{},keys:[{id:'',title:'',type:0,selects:[{title:'',isanswer:0}]}],answers:[{minscore:'',maxscore:'',ask:''}],onTime:'',limit:'',choutinum:'',mianfeinum:'',charge:'',publishTime:'',position:0,radio:1},
        cropper: [{
          name: '详情封面',
          ratio: 1.89,
          desc: '你将在地图管理看到此页面'
        }]
      }
    },
    mounted(){
      this.load();
    },
    methods:{
      load(){
        if(this.id>0)
        {
          this.$ajax.post("/back/interaction/getAnswerInfo",{id:this.id}).then(res=>{
            if(res.resCode==200)
            {
              //{name:'',summary:'',intro:'',imgs:{},keys:[{id:'',title:'',type:0,selects:[{title:'',isanswer:0}]}],onTime:'',limit:0,choutinum:0,mianfeinum:0,charge:'',publishTime:'',position:0,radio:1},
              var data=res.resultList.info;
              var datalist=res.resultList.signUpList;
              this.form.name=data.title;
              this.form.summary=data.abstract_info;
              this.form.intro=data.content;
              this.form.imgs={'ratio1.89': [data.theme_pic] };
              if(datalist.length>0) {
                this.form.keys = [];
                var d = {id:'',title:'',type:0,selects:[{title:'',isanswer:0}]};
                for (var i = 0; i < datalist.length; i++) {
                  if (datalist[i].isdel == 0) {
                    d.title = datalist[i].title;
                    d.type = datalist[i].type;
                    d.isanswer = datalist[i].isanswer;
                    d.id = datalist[i].id;
                  }
                }
              }
              this.form.onTime=this.$moment(data.end_time).format('YYYY-MM-DD HH:mm:ss');
              this.form.limit=data.overplus_num;
              this.form.charge=data.charge;
              this.form.position=data.position;
              this.form.publishTime=this.$moment(data.start_time).format('YYYY-MM-DD HH:mm:ss');
              this.form.radio= data.publish_status;
            }
          }).catch(error=>{

          });
        }

      },
      onSubmit(){
        if(this.form.name.length==0)
        {
          this.message("活动标题不能为空", "error");
        }
        else if(this.form.name.length>30)
        {
          this.message("活动标题字数不能超过30", "error");
        }
        else if(this.form.summary!=null&&this.form.summary.length>150)
        {
          this.message("活动摘要字数不能超过150", "error");
        }
        else  if(this.form.imgs['ratio1.89']==null||this.form.imgs['ratio1.89'][0]==null)
        {
          this.message("请添加图片", "error");
        }
        else  if(this.form.keys.length>0&&this.form.keys[0].title=='')
        {
          this.message("请填写题目及选项", "error");
        }
        else  if(this.form.onTime=='')
        {
          this.message("请选择有效期", "error");
        }
        else  if(this.form.limit=='')
        {
          this.message("请填写答题限制", "error");
        }
        else  if(this.form.choutinum=='')
        {
          this.message("请填写抽取题数", "error");
        }
        else
        {
          this.$ajax.post(this.id>0?'/back/interaction/updateAnswer':"/back/interaction/saveAnswer",{id:this.id,interactionType:7,title:this.form.name,abstract_info:this.form.summary,content:this.form.intro,theme_pic:this.form.imgs['ratio1.89'][0],overplus_num:this.form.limit,organizer:this.form.zhubanname,is_charge:this.form.charge!=''?1:0,cityId:this.form.cityid,provinceId:this.form.provinceid,areaId:this.form.areaid,position:this.form.position,address:this.form.address,publish_status:this.form.radio,sponsor:this.form.chenbanname,charge:this.form.charge,singUpModel:this.form.keys}).then(res=>{
            if(res.resCode==200)
            {
              this.message("提交成功", "success");
              //this.back();
            }
            else {
              this.message("提交失败", "error");
            }
          }).catch(error=>{

          });
        }
      },

      addkey(index,type){//添加关键字
        switch (type)
        {
          case 1://添加题目
            this.form.keys.push({id:'',title:'',type:0,selects:[{title:'',isanswer:0}]});
            break;
          case 2://添加选项
            this.form.keys[index].selects.push({title:'',isanswer:0});
            break;
        }
      },
      removekey(index,type,index1){//移除某一行
        switch (type)
        {
          case 1:
            this.form.keys.splice(index,1);
            break;
          case 2:
            this.form.keys[index].selects.splice(index1,1);
            break;
        }

      },
      addanswer() {//添加关键字
        this.form.answers.push({minscore:'',maxscore:'',ask:''});
      },
      removeanswer(index) {//移除某一行
        this.form.answers.splice(index, 1);
      },
      back(){
        this.$router.go(-1);
      },
      //错误、成功提示
      message(message, type) {
        this.$message({
          message: message,
          type: type
        });
      }
    }
  }
</script>

<style lang="scss"  scoped>
  .basicregistration {
    @extend %fill;
    padding: 10px 3%;
    .elfrom {
      margin-top: 30px;
    }
    .rate {
      display: flex;
      align-items: center;
      justify-content: left;
      height: 40px;
    }

    .el-row{
      margin-bottom: 10px;
    }

    .foot{
      font-size: 20px;
      margin:20px;
    }
  }

</style>
