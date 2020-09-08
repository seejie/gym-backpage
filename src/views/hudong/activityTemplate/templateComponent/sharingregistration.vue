<template>
  <div class="basicregistration">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>基础信息</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" class="elfrom">
        <el-form-item label="*活动标题">
          <el-col :span="8">
            <el-input placeholder="请输入标题，30字以内" v-model="form.title" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动摘要">
          <el-col :span="8">
            <el-input type="textarea" placeholder="请输入摘要，150字以内" :row="5" v-model="form.summary"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="活动介绍">
          <el-col :span="18">
            <myEditor refs="name1" v-model="form.detail"></myEditor>
          </el-col>
        </el-form-item>
        <el-form-item label="*活动封面">
          <img-include v-model="form.imgs" :max="9" :cropper="cropper"></img-include>
        </el-form-item>
        <el-form-item label="*活动位置">
          <el-row>
            <el-col>
              <area-cascader
                style="line-height: 16px"
                :level="1"
                v-model="areaselected"
                :data="pcaa"
              ></area-cascader>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-input placeholder="请填写详细地址" v-model="form.address"></el-input>
            </el-col>
            <!-- <el-col :span="2">
              <prov-amap>
                <el-button slot="button" icon="el-icon-location-outline"></el-button>
              </prov-amap>
            </el-col>-->
          </el-row>
        </el-form-item>
        <el-form-item label="主办方">
          <el-col :span="8">
            <el-input placeholder="请输入，30字以内" v-model="form.sponsor" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="承办方">
          <el-col :span="8">
            <el-input placeholder="请输入，30字以内" v-model="form.organizer" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="*报名关键词设置" label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-button type="primary" @click="addkey">添加关键字</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label-width="30px">
          <el-row v-for="(item,index) in topicList" :key="index">
            <el-row type="flex">
              <el-col :span="2">关键字{{index+1}}</el-col>
              <el-col :span="6">
                <el-input placeholder="请输入，30字以内" v-model="item.title" style="width: 90%"></el-input>
              </el-col>
              <el-col :span="6">
                <el-select v-model="item.type" style="width: 90%">
                  <el-option
                    v-for="(item1,index) in txttype"
                    :key="index"
                    :label="item1.name"
                    :value="item1.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-radio v-model="item.required" :label="1">必填</el-radio>
                <i @click="removekey(index)" style="font-size: 18px;" class="el-icon-delete-solid"></i>
                <i
                  style=";margin-left: 20px;font-size: 18px"
                  class="el-icon-circle-plus-outline"
                  @click="addkey"
                ></i>
              </el-col>
            </el-row>
            <el-row
              v-for="(item1,index1) in item.optionList"
              :key="index1"
              type="flex"
              style="margin-left: 30px"
            >
              <template v-if="item.type=='RADIO'||item.type=='CHECKED'">
                <el-col :span="2">选项{{index1+1}}</el-col>
                <el-col :span="6">
                  <el-input placeholder="请输入，30字以内" v-model="item1.content" style="width: 90%"></el-input>
                </el-col>
                <el-col :span="6">
                  <i
                    @click="removekeyone(index,index1)"
                    style="font-size: 18px;"
                    class="el-icon-delete-solid"
                  ></i>
                  <i
                    style="margin-left: 20px;font-size: 18px;"
                    class="el-icon-circle-plus-outline"
                    @click="addkeyone(index)"
                  ></i>
                </el-col>
              </template>
            </el-row>
          </el-row>
        </el-form-item>
        <el-form-item label-width="0px">
          <h3 style="margin:0">报名条件设置</h3>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-col :span="4">
            <el-date-picker
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              v-model="form.endTime"
              type="datetime"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="*人数限制">
          <el-col :span="8">
            <el-input placeholder="请输入限制人数，不填则无限" v-model="form.peopleLimit" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="报名费用">
          <el-col :span="8">
            <el-input placeholder="默认为不收费" v-model="form.fee" width="80%"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px">
          <h3 style="margin:0">发布设置</h3>
        </el-form-item>
        <el-form-item label="发布位置">
          <el-select placeholder="请选择" v-model="form.releaseLoc">
            <el-option label="置顶" :value="1"></el-option>
            <el-option label="默认" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*发布时间">
          <el-row>
            <el-radio v-model="form.status" :label="2">发布</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="form.status" :label="3">草稿，暂不发布</el-radio>
          </el-row>
          <el-row>
            <el-col>
              <el-radio v-model="form.status" :label="9">定时发布</el-radio>
            </el-col>
            <el-col>
              <el-date-picker
                placeholder="选择日期时间"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                v-model="form.releaseTime"
                type="datetime"
              ></el-date-picker>
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
import ImgInclude from '@/components/CropImgInclue';
import Pagination from '@/components/Pagination';
import { AreaCascader } from 'vue-area-linkage';
// import provAmap from '@/components/map'
import { pca, pcaa } from 'area-data';
export default {
  name: 'index',
  components: {
    ImgInclude,
    // provAmap,
    Pagination,
  },
  data() {
    return {
      id: this.$route.params.id,
      uid: '',
      unit_id: '',
      pca: pca,
      pcaa: pcaa,
      list: [],
      areaselected: [], // 省市区选择
      reltiveareaselected: [], // 店铺选择省市区
      form: {
        title: '',
        summary: '',
        detail: '',
        imgs: {},
        provinceId: '',
        cityId: '',
        areaId: '',
        address: '',
        sponsor: '',
        organizer: '',
        endTime: '',
        peopleLimit: '',
        charge: '',
        releaseTime: '',
        releaseLoc: '',
        status: 2,
      },
      topicList: [
        {
          activityId: this.$route.params.id,
          id: '',
          title: '',
          type: '',
          sort: 0,
          required: 0,
          optionList: [{ activityId: this.$route.params.id, content: '' }],
        },
      ],
      cropper: [
        {
          name: '详情封面',
          ratio: 1.89,
          desc: '你将在地图管理看到此页面',
        },
      ],
      txttype: [
        { name: '文本', value: 'TEXT' },
        { name: '单选', value: 'RADIO' },
        { name: '多选', value: 'CHECKED' },
        { name: '日期', value: 'DATE' },
        { name: '手机号', value: 'MOBILE' },
        { name: '图片', value: 'IMAGE' },
        { name: '附件', value: 'FILE' },
      ],
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.id > 0) {
        this.$ajax
          .get(`/huodong/detail?id=${this.id}`)
          .then(res => {
            if (res.resCode == 200) {
              var data = res.resObject;
              this.form = data;
              (this.form.fee = data.fee / 100), (this.form.imgs = { 'ratio1.89': [data.picUrl] });
              this.areaselected.push(pcaa[86][this.form.provinceId]); // res.data.addrprovinceid省对应的id
              this.areaselected.push(pcaa[this.form.provinceId][this.form.cityId]); // res.data.addrcityid省对应的id
              this.areaselected.push(pcaa[this.form.cityId][this.form.areaId]);
              if (data.topicList.length > 0) {
                this.topicList = data.topicList;
                if (this.topicList.length) {
                  this.topicList.forEach(v => {
                    if (v.optionList.length) {
                      v.optionList.sort(function(prev, next) {
                        return prev.sort - next.sort;
                      });
                    }
                  });
                  this.topicList.sort(function(prev, next) {
                    return prev.sort - next.sort;
                  });
                }
              }
            }
          })
          .catch(error => {});
      }
    },
    onSubmit() {
      if (this.form.title.length == 0) {
        this.message('活动标题不能为空', 'error');
      } else if (this.form.title.length > 30) {
        this.message('活动标题字数不能超过30', 'error');
      } else if (this.form.summary != null && this.form.summary.length > 150) {
        this.message('活动摘要字数不能超过150', 'error');
      } else if (this.form.imgs['ratio1.89'] == null || this.form.imgs['ratio1.89'][0] == null) {
        this.message('请添加图片', 'error');
      } else if (this.areaselected.length < 3) {
        this.message('请填写省市区', 'error');
      } else if (this.form.address === '') {
        this.message('请填写地址', 'error');
      } else if (this.topicList > 0 && this.topicList[0].title === '') {
        this.message('请填写关键字', 'error');
      } else if (this.form.peopleLimit === '') {
        this.message('请填写限制人数', 'error');
      } else {
        if (this.areaselected.length > 2) {
          this.form.provinceId = this.areaselected[0];
          this.form.provinceName = pcaa[86][this.form.provinceId];
          this.form.cityId = this.areaselected[1];
          this.form.cityName = pcaa[this.form.provinceId][this.form.cityId];
          this.form.areaId = this.areaselected[2];
          this.form.areaName = pcaa[this.form.cityId][this.form.areaId];
        }
        this.topicList.forEach(v => {
          if (v.type != 'RADIO' && v.type != 'CHECKED') {
            v.optionList = [];
          }
        });
        var data = {
          // uid: this.uid,
          // unitId: this.unitId,
          id: this.form.id,
          title: this.form.title,
          summary: this.form.summary,
          detail: this.form.detail,
          picUrl: this.form.imgs['ratio1.89'][0],
          peopleLimit: this.form.peopleLimit,
          sponsor: this.form.sponsor,
          provinceId: Number(this.areaselected[0]),
          provinceName: this.form.provinceName,
          cityId: Number(this.areaselected[1]),
          cityName: this.form.cityName,
          areaId: Number(this.areaselected[2]),
          areaName: this.form.areaName,
          fee: this.form.fee ? Number(this.form.fee) * 100 : 0,
          address: this.form.address,
          organizer: this.form.organizer,
          releaseTime: this.form.releaseTime,
          endTime: this.form.endTime,
          topicList: this.topicList,
          releaseLoc: this.form.releaseLoc,
          status: this.form.status,
          type: 'SHARE_REG',
        };
        // if (this.id > 0) {
        //   data.interaction_type = 1;
        //   data.id = this.id;
        // } else {
        //   data.interactionType = 1;
        // }
        this.$ajax
          .post('/huodong/save', data)
          .then(res => {
            if (res.resCode == 200) {
              this.message('提交成功', 'success');
              this.$router.push({
                name: 'activityList',
              });
              // this.back();
            } else {
              this.message('提交失败', 'error');
            }
          })
          .catch(error => {});
      }
    },

    addkey() {
      // 添加关键字
      this.topicList.push({
        activityId: this.$route.params.id,
        title: '',
        type: '',
        required: 0,
        optionList: [{ content: '' }],
      });
      this.sortIndex();
    },
    removekey(index) {
      // 移除某一行
      this.sortIndex();
    },
    sortIndex() {
      this.topicList.forEach((v, index) => {
        v.sort = index + 1;

        if (v.optionList.length) {
          v.optionList.forEach((r, index1) => {
            r.sort = index1 + 1;
          });
        }
      });
    },
    addkeyone(index) {
      // 添加选项
      this.topicList[index].optionList.push({ activityId: this.$route.params.id, content: '' });
      this.sortIndex();
    },
    removekeyone(index, index1) {
      // 移除选择
      this.topicList[index].optionList.splice(index1, 1);
      this.sortIndex();
    },
    back() {
      this.$router.go(-1);
    },
    // 错误、成功提示
    message(message, type) {
      this.$message({
        message: message,
        type: type,
      });
    },
  },
};
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

  .el-row {
    margin-bottom: 10px;
  }

  .foot {
    font-size: 20px;
    margin: 20px;
  }
}
</style>
