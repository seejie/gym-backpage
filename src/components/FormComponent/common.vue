<template>
  <div class="fromList">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>基本信息</span>
      </div>
      <div style="padding-right:20px;">
        <el-form :model="fromList"
                 :rules="formRules"
                 ref="ruleForm"
                 label-width="100px"
                 class="demo-ruleForm">
          <el-form-item v-for="(item,index) in formItems"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label">
            <el-input v-model="fromList[item.prop]"
                      v-if="item.type === 'text'"
                      :maxlength="item.max"
                      :placeholder="item.placeholder"></el-input>
            <myUpload type="1:1"
                      v-else-if="item.type==='img'"
                      :cropper="item.cropper"
                      :max='item.max'
                      v-model="fromList[item.prop]"></myUpload>
            <el-checkbox-group v-model="fromList[item.prop]"
                               v-else-if="item.type === 'checkbox'">
              <el-checkbox v-for="(items,index) in item.options"
                           :key="index"
                           :label="items.value">{{items.label}}</el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="fromList[item.prop]"
                            v-else-if="item.type === 'radio'">
              <el-radio v-for="(items,index) in item.options"
                        :key="index"
                        :label="items.value">{{items.label}}</el-radio>
            </el-radio-group>
            <el-input type="textarea"
                      v-else-if="item.type === 'textArea'"
                      :maxlength="item.max"
                      show-word-limit
                      :placeholder="item.placeholder"
                      v-model="fromList[item.prop]"></el-input>
            <el-select v-model="fromList[item.prop]"
                       v-else-if="item.type === 'select'"
                       clearable
                       :placeholder="item.placeholder">
              <el-option v-for="(items,index) in item.options"
                         :key="index"
                         :label="items.label"
                         :value="items.value"></el-option>
            </el-select>
            <el-date-picker v-else-if="item.type === 'date'"
                            v-model="fromList[item.prop]"
                            type="date"
                            value-format="timestamp"
                            :placeholder="item.placeholder">
            </el-date-picker>
            <el-cascader v-model="fromList[item.prop]"
                         v-else-if="item.type === 'link'"
                         :options="item.options"
                         ref="cascaderAddr"
                         @change="changeLink"
                         clearable></el-cascader>
            <div class="origin-wrap"
                 v-else-if="item.type==='address'">
              <el-input v-model="fromList[item.prop]"
                        disabled
                        :placeholder="item.placeholder"></el-input>
              <el-button @click="getPos"
                         type="primary">导入位置</el-button>
            </div>
            <myEditor v-else-if="item.type==='detail'"
                      :refs='item.prop'
                      v-model="fromList[item.prop]"></myEditor>
            <div style="display:flex;align-items:center"
                 v-else-if="item.type === 'checkAndInput'">
              <el-radio-group v-model="fromList[item.prop]">
                <el-radio :label="1">提前1天以上</el-radio>
              </el-radio-group>
              <el-input v-model="fromList.advanceDays"
                        placeholder="数字"
                        :disabled='fromList.isAdvance === 0'
                        style="margin:0 20px;width:200px"></el-input>
              <el-radio-group v-model="fromList[item.prop]">
                <el-radio :label="0">支持当天购买,不晚于</el-radio>
              </el-radio-group>
              <el-time-select v-model="fromList.beforeTime"
                              placeholder="选择时间"
                              :disabled='fromList.isAdvance === 1'
                              style="marginLeft:20px;"></el-time-select>
            </div>
            <div class='upload-container'
                 v-else-if="item.type==='priceDetail'">
              <el-input v-model="fromList[item.prop]"
                        type="hidden"></el-input>
              <div class="upload-icon-logo-text">
                图片规格1:1<br>建议尺寸<br>55*55
              </div>
              <PriceTable :coderOptions="coderOptions"
                          @getPriceTable="getPriceTable"
                          :addEdit="addEdit"
                          :editTableData='tabelData'
                          :id="id" />
            </div>
            <div class='upload-container'
                 v-else-if="item.type==='hotelDetail'">
              <el-input v-model="fromList[item.prop]"
                        type="hidden"></el-input>
              <div class="upload-icon-logo-text">
                图片规格1:1<br>建议尺寸<br>55*55
              </div>
              <HotelTable :coderOptions="coderOptions"
                          @getPriceTable="getPriceTable"
                          :addEdit="addEdit"
                          :editTableData='tabelData'
                          :id="id" />
            </div>
          </el-form-item>
          <!--  <el-form-item label="标签"
                        prop="LabelTyle">
            
          </el-form-item>
          <el-form-item label="主办方"
                        prop="sponsor">
            <el-input v-model="fromList.sponsor"
                      placeholder="请填写主办方名称，1-24字"></el-input>
          </el-form-item>
          <el-form-item label="承办方"
                        prop="organizer">
            <el-input v-model="fromList.organizer"
                      placeholder="请填写承办方名称，1-24字"></el-input>
          </el-form-item>
          <el-form-item label="报名截止至"
                        prop="endTime">
           
          </el-form-item>
          <el-form-item label="活动日期">
            <el-form-item prop="activeTime">
              <el-date-picker v-model="fromList.activeTime"
                              value-format="timestamp"
                              type="datetimerange"
                              align="right"
                              unlink-panels
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :picker-options="ruleForm.pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="活动费用"
                        prop="activeFee">
            <el-input v-model="fromList.activeFee"
                      placeholder="单位:元,不填则为0"></el-input>
          </el-form-item>
          <el-form-item label="最大人数"
                        prop="maxPeople">
            <el-input v-model="fromList.maxPeople"
                      placeholder="单位:人,不填则不限制"></el-input>
          </el-form-item>
          <el-form-item label="发布状态"
                        prop="status">
            <el-radio-group v-model="fromList.status">
              <el-radio :label=1>立即发布</el-radio>
              <el-radio :label=0>下线</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报名审核"
                        prop="checkOut">
            <el-radio-group v-model="fromList.checkOut">
              <el-radio :label=0>开启(报名后需后台审核)</el-radio>
              <el-radio :label=1>关闭(有名额即报名成功)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动类型"
                        prop="activeLevel">
            <div class="select-wrap">
              <el-select v-model="fromList.activeLevel.one"
                         @change="menuChange"
                         placeholder="一级分类">
                <el-option v-for="(item,index) in menulist"
                           :key="index"
                           :label="item.catName"
                           :value="item.catId"></el-option>
              </el-select>
              <el-select v-model="fromList.activeLevel.two"
                         placeholder="二级分类">
                <el-option v-for="(item,index) in nextMenulists"
                           :key="index"
                           :label="item.catName"
                           :value="item.catId"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="场地溯源"
                        prop="address">
            <div class="origin-wrap">
              <el-input v-model="fromList.address"
                        placeholder="可直接关联，若无可填写详细信息"></el-input>
              <el-button @click="getPos"
                         type="primary">导入位置</el-button>
            </div>
          </el-form-item>
          <el-form-item label="活动详情"
                        prop="activeDetail">
            <myEditor v-model="fromList.activeDetail"></myEditor>
          </el-form-item>
          <el-form-item label="活动摘要"
                        prop="remark">
            <el-input type="textarea"
                      maxlength="150"
                      style="height:100px;"
                      show-word-limit
                      placeholder="150字以"
                      v-model="fromList.remark"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('ruleForm')">{{btnType}}</el-button>
            <el-button @click="goback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as http from '@/api/huigou/active/typeSet.js'
import PriceTable from "@/views/huigou/ticketManage/PriceTable.vue";
import HotelTable from "@/views/huigou/hotelManage/PriceTable.vue";
export default {
  name: 'formList',
  props: {
    fromList: {
      type: Object,
      default: function () {
        return {
          LabelTyle: [],//标签
          activeLevel: {
            one: '',//一级分类
            two: '',//二级分类
          },
        }
      }
    },
    tabelData: {
      type: Array,
      default: () => []
    },
    formItems: {
      type: Array,
      default: () => []
    },
    formRules: {
      type: Object,
      default: () => { }
    },
    labelList: {
      type: Array,
      default: () => []
    },
    btnType: {
      default: '立即创建'
    },
    addEdit: {
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,//上传点击图片预览
      editor: '',//富文本字符串

      coderOptions: [],
      id: ''
    };
  },
  components: {
    PriceTable,
    HotelTable
  },
  mounted () {
    console.log(this.tabelData)
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.fromList)
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    getPos () {
      this.$emit('getPosition')
    },
    goback () {
      this.$router.go(-1)
    },
    //添加关键字
    addKeyWord () {
      this.$emit('addKeyWord')
    },
    del (item, index) {
      this.$emit('delKeyWord', index, item)
    },
    //删除当前关键字
    delItem (item, index, rowIndex) {
      if (this.fromList.enlistInfoList[index].keyWordList.length <= 1) {
        this.$message.error("至少保留一个选项")
      } else {
        this.fromList.enlistInfoList[index].keyWordList.splice(rowIndex, 1)
      }
    },
    // 品类选择器
    changeLink (e, form, code) {
      if (e.length !== 0) {
        this.$emit('getTypeName', this.$refs.cascaderAddr[0].getCheckedNodes()[0].pathLabels)
      }
    },
    //添加方法
    addItem (item, index, rowIndex) {
      // console.log(rowIndex)
      // this.fromList.enlistInfoList[index].keyWordList.push({
      //   name: ''s
      // })
      this.fromList.enlistInfoList[index].keyWordList.splice(rowIndex + 1, 0, {
        name: ''
      })
    },
    getPriceTable (val) {
      this.$emit('getPriceTable', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.fromList {
  @extend %fill;
  /deep/ .el-form-item {
    /deep/ .el-form-item__content {
      .el-select,
      .el-cascader {
        width: 100%;
      }
    }
  }
  .origin-wrap {
    display: flex;
    width: 100%;
    .el-input {
      margin-right: 15px;
    }
  }
  .enlist-info {
    // display: flex;
    width: 100%;
    // padding: 40px 20px 0 20px;
    padding-bottom: 20px;
    .chooseLine {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: rp(20);
      .keyword {
        min-width: 50px;
        text-align: center;
        margin-right: 15px;
      }
      .el-input {
        margin-right: 15px;
      }
    }
    .chooseItem {
      display: flex;
      width: 90%;
      align-items: center;
      padding: 0 5em;
      margin-top: 20px;

      .keyword {
        min-width: 50px;
        text-align: center;
        margin-right: 15px;
      }
      i {
        font-size: 20px;
        margin-left: 15px;
        cursor: pointer;
      }
    }
    /deep/ .el-dropdown {
      margin-right: 15px;
    }
  }
  .upload-container {
    position: relative;

    .upload-icon-logo-text {
      font-size: 14px;
      color: #ccc;
      line-height: 16px;
      width: 80px;
      position: absolute;
      left: -83px;
      top: 40px;
    }
  }
  #editor {
    min-height: 200px;
    width: 100%;
  }
  .btn-wrap {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .el-range-separator {
    width: 20px;
  }
  /deep/ .el-textarea {
    min-height: 70px;
    /deep/ .el-textarea__inner {
      min-height: 70px !important;
      padding-right: 50px;
    }
  }
  /deep/ .el-collapse-item__wrap {
    border: none;
  }
  /deep/ .el-collapse-item__header {
    color: #ccc;
  }
  /deep/ .el-checkbox {
    margin-right: 15px;
  }
  /deep/ .el-textarea__inner {
    height: 100%;
  }
}
</style>

