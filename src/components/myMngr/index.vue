<template>
  <div class="mngr-wrapper">
    <el-card class="box-card" shadow="never">
      <div v-if="title" slot="header">
        <span>{{title}}</span>
      </div>
      <div class="m-w-form">
        <slot name="head"></slot>
        <el-form :model="mngrForm" ref="mngrFormRef" :rules="rules" label-width="100px">
          <template v-for="(pcol,pkey,pindex) in formColumns">
            <div class :key="pindex">
              <!-- 文本 begin -->
              <template v-if="pcol.type=='text'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <el-input
                      type="text"
                      :disabled="pcol.disabled?true:false"
                      :maxlength="pcol.maxlength ||30"
                      v-model="mngrForm[pkey]"
                      :placeholder="pcol.placeholder||('请输入'+pcol.label)"
                    ></el-input>
                  </el-col>
                </el-form-item>
                <!-- 文本 end -->
              </template>
              <template v-if="pcol.type=='preViewUrl'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <el-input
                      class="no-bor-input"
                      type="text"
                      :disabled="pcol.disabled?true:false"
                      :maxlength="pcol.maxlength ||30"
                      v-model="mngrForm[pkey]"
                      :placeholder="pcol.placeholder||('请输入'+pcol.label)"
                    ></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-button
                      type="text"
                      v-clipboard:copy="mngrForm[pkey]"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                      size="small"
                    >复制</el-button>
                  </el-col>
                </el-form-item>
              </template>
              <template v-else-if="pcol.type=='password'">
                <!-- 文本密码 begin -->
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <el-input
                      type="password"
                      :disabled="pcol.disabled?true:false"
                      :maxlength="pcol.maxlength ||30"
                      v-model="mngrForm[pkey]"
                      :placeholder="pcol.placeholder||('请输入'+pcol.label)"
                      autocomplete="off"
                      show-password
                    ></el-input>
                  </el-col>
                </el-form-item>
                <!-- 文本密码 end -->
              </template>
              <template v-else-if="pcol.type=='textarea'">
                <!-- textarea输入 begin -->
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <el-input
                      type="textarea"
                      :autosize="false"
                      :maxlength="pcol.maxlength ||30"
                      v-model="mngrForm[pkey]"
                      :placeholder="'请输入'+pcol.label"
                    ></el-input>
                  </el-col>
                </el-form-item>
                <!-- textarea输入 end -->
              </template>
              <template v-else-if="pcol.type=='yearmonth'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <el-date-picker
                      v-model="mngrForm[pkey]"
                      type="month"
                      format="yyyy 年 MM 月 "
                      value-format="yyyyMM"
                      :placeholder="pcol.placeholder"
                    ></el-date-picker>
                  </el-col>
                </el-form-item>
              </template>
              <template v-else-if="pcol.type=='editor'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="18">
                    <myEditor v-model="mngrForm[pkey]"></myEditor>
                  </el-col>
                </el-form-item>
              </template>
              <template v-else-if="pcol.type=='selects'">
                <el-row class="selects-row">
                  <template v-for="(ccol,ckey,cindex) in pcol.selects">
                    <el-col :key="cindex" :span="(parseInt(14/(Object.keys(pcol.selects).length)))">
                      <el-form-item :label="pcol.label" :prop="ccol.rule?ccol.rule:''">
                        <el-select
                          :placeholder="ccol.placeholder"
                          filterable
                          clearable
                          v-model="mngrForm[ckey]"
                          @change="(val)=>{bindChangeSelects(val,ccol,ckey)}"
                        >
                          <el-option
                            v-for="ocol in ccol.list"
                            :key="ocol.value"
                            :label="ocol.label"
                            :value="ocol.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </template>
              <template v-else-if="pcol.type=='radios'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-radio-group v-model="mngrForm[pkey]">
                    <template v-for="(ccol,cindex) in pcol.radios">
                      <el-row :key="cindex">
                        <el-radio style="line-height: 2.8" :label="ccol.value">{{ccol.label}}</el-radio>
                      </el-row>
                    </template>
                  </el-radio-group>
                </el-form-item>
              </template>
              <template v-else-if="pcol.type=='address'">
                <!-- textarea输入 begin -->
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-row>
                    <el-col :span="12">
                      <area-cascader
                        separator="-"
                        style="line-height: 16px"
                        :level="pcol.level||1"
                        :placeholder="'请输入'+pcol.label"
                        v-model="mngrForm.areaArr"
                        :data="pcaa"
                        clearable
                      ></area-cascader>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-input
                        type="text"
                        :maxlength="pcol.maxlength ||30"
                        v-model="mngrForm[pkey]"
                        :placeholder="'请输入'+pcol.label"
                      ></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <!-- textarea输入 end -->
              </template>
              <template v-else-if="pcol.type=='headimg'">
                <!-- 头像 begin -->
                <el-form-item
                  :label="pcol.label"
                  :prop="pcol.rule?pcol.rule:''"
                  class="form-item--img"
                >
                  <el-col :span="12">
                    <img-include
                      v-model="mngrForm[pkey]"
                      :max="pcol.max||1"
                      :cropper="cropper.headImg"
                    ></img-include>
                  </el-col>
                </el-form-item>
                <!-- 头像 end -->
              </template>
              <template v-else-if="pcol.type=='image'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <img-include
                      v-model="mngrForm[pkey]"
                      :max="pcol.max||1"
                      :cropper="cropper.image"
                    ></img-include>
                  </el-col>
                </el-form-item>
              </template>
              <template v-else-if="pcol.type=='images'">
                <el-form-item :label="pcol.label" :prop="pcol.rule?pcol.rule:''">
                  <el-col :span="12">
                    <img-include
                      v-model="mngrForm[pkey]"
                      :max="pcol.max||1"
                      :cropper="cropper.image"
                    ></img-include>
                  </el-col>
                </el-form-item>
              </template>

              <template v-else-if="pcol.type=='qrcode'">
                <!-- 二维码 begin -->
                <el-form-item
                  :label="pcol.label"
                  :prop="pcol.rule?pcol.rule:''"
                  class="form-item--img form-item--qrcode"
                >
                  <el-col :span="12">
                    <img-include
                      class="qrcode"
                      v-model="mngrForm[pkey]"
                      :max="pcol.max||1"
                      :cropper="cropper.qrcode"
                    ></img-include>
                  </el-col>
                </el-form-item>
                <!-- 二维码 end -->
              </template>
            </div>
          </template>
          <slot name="body"></slot>
          <el-form-item>
            <el-button type="primary" @click="bindClickSubmit()">保存</el-button>
            <el-button @click="bindClickCancle()">取消</el-button>
            <!-- <el-button @click="preview()">预览</el-button> -->
            <slot name="ft-btn"></slot>
          </el-form-item>
          <slot name="footer"></slot>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import ImgInclude from '@/components/CropImgInclue';
import { pcaa } from 'area-data';
import request from '@/utils/request';
import clipboards from 'vue-clipboard2';
import Vue from 'vue';

Vue.use(clipboards);
export default {
  name: 'myMngrForm',
  components: {
    ImgInclude,
  },
  props: {
    id: {
      type: [String, Number],
      default: 0,
    },
    params: {
      type: Object,
      default: () => {},
    },
    title: {
      type: [String, Boolean],
      default: false,
    },
    columns: {
      type: Object,
      default: () => {},
    },
    crules: {
      type: Object,
      default: () => {},
    },
    requestUrl4Get: String,
    requestUrl4Save: String,
    requestUrl4Update: String,
  },
  watch: {
    cloumns: {
      handler(val) {
        this.formColumns = val;
        this.buildMngrForm();
      },
      deep: true,
    },
    params: {
      handler(val) {
        if (val && this.requestUrl4Get) {
          this.getDetailFormData();
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      rules: {
        loginName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      }, // 规则
      cropper: {
        // 头像裁剪配置
        headImg: [
          {
            name: 'headImg',
            ratio_x: 66,
            ratio_y: 66,
            ratio: 1,
            desc: 'headImg',
          },
        ],
        qrcode: [
          {
            name: 'qrcode',
            ratio_x: 100,
            ratio_y: 100,
            ratio: 1,
            desc: 'qrcode',
          },
        ],
        image: [
          {
            name: 'img',
            ratio_x: 1,
            ratio_y: 1,
            ratio: 1,
            desc: 'img',
          },
        ],
      },
      pcaa, // 城市联动选择数据源
      mngrForm: {
        areaArr: [],
      },
      formColumns: {},
    };
  },
  created() {
    this.rules = Object.assign(this.rules, this.crules, {});
  },
  mounted() {
    if (this.columns) {
      this.formColumns = this.columns;
      this.buildMngrForm();
    }
    if (this.requestUrl4Get) {
      this.getDetailFormData();
    }
  },
  methods: {
    onCopy() {
      this.$message.info('复制链接成功');
    },
    onError(e) {
      console.log(e);
    },
    bindChangeSelects(val, citem, ckey) {
      citem.change && citem.change(val, citem, ckey, this);
    },
    buildMngrForm() {
      for (let keys in this.formColumns) {
        if (this.formColumns[keys].hasOwnProperty('default')) {
          if (!this.mngrForm[keys] && this.mngrForm[keys] !== 0 && this.mngrForm[keys] !== '0') {
            this.mngrForm[keys] = this.formColumns[keys].default;
          }
        }
      }
    },
    initFormData(res) {
      this.mngrForm = {};
      for (let keys in this.formColumns) {
        if (this.formColumns[keys].type == 'headimg') {
          // 图片类型
          const ratio1 = [];
          ratio1.push(res[keys] || '');
          res[keys] = {
            ratio1,
          };
        } else if (this.formColumns[keys].type == 'yearmonth') {
          if (res[keys]) {
            if (typeof res[keys] !== 'string') {
              res[keys] = '' + res[keys];
            }
          } else {
            res[keys] = '';
          }
        } else if (this.formColumns[keys].type == 'selects') {
          for (let ckeys in this.formColumns[keys].selects) {
            debugger;
            if (
              this.formColumns[keys].selects[ckeys] &&
              typeof this.formColumns[keys].selects[ckeys].change === 'function'
            ) {
              this.formColumns[keys].selects[ckeys].change(res[ckeys], res, ckeys, this, true);
            }
          }
        } else if (this.formColumns[keys].type == 'image') {
          const ratio1 = [];
          ratio1.push(res[keys] || '');
          res[keys] = {
            ratio1,
          };
        } else if (this.formColumns[keys].type == 'images') {
          const ratio1 = [];
          ratio1.push(res[keys] || '');
          res[keys] = {
            ratio1,
          };
        } else if (this.formColumns[keys].type == 'address') {
          res.areaArr = this.formColumns[keys].initFormater(res);
        }
      }
      // res.areaArr = [];
      this.mngrForm = res;
    },
    getDetailFormData() {
      // 获取详情数据
      request({
        url: this.requestUrl4Get,
        method: 'GET',
        params: { ...this.params },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          console.log(res);
          if (res.resCode === 200 && res.resObject) {
            this.initFormData(res.resObject);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    buildReuqestFormData() {
      let tempMngrForm = { ...this.mngrForm };
      for (let keys in this.formColumns) {
        if (this.formColumns[keys].type == 'headimg') {
          tempMngrForm[keys] = this.mngrForm[keys].ratio1[0] || '';
        } else if (this.formColumns[keys].type == 'image') {
          tempMngrForm[keys] = this.mngrForm[keys].ratio1[0] || '';
        } else if (this.formColumns[keys].type == 'images') {
          tempMngrForm[keys] = {
            desc: '',
            url: this.mngrForm[keys].ratio1[0] || '',
          };
        } else if (this.formColumns[keys].type == 'address') {
          const areaArr = this.formColumns[keys].submitFormater(tempMngrForm);
          delete tempMngrForm.areaArr;
          tempMngrForm = Object.assign(tempMngrForm, areaArr, {});
          // tempMngrForm[keys] = this.mngrForm[keys].ratio1[0] || '';
        }
      }
      // tempMngrForm.coverImage = 'http://uploadceshi.njlime.com/file_1587648644247';
      return tempMngrForm;
    },
    doUpdateFormData(params) {
      request({
        url: this.requestUrl4Update,
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res.resCode === 200) {
          this.$message(res.message || '修改成功～');
          // this.$router.back();
          // this.getDetailFormData();
        }
      });
    },
    doSaveFormData(params) {
      request({
        url: this.requestUrl4Save,
        method: 'POST',
        data: params,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        console.log(res);
        if (res.resCode === 200) {
          this.$message(res.message || '成功～');
          this.$router.back();
          // this.getDetailFormData();
        }
      });
    },
    bindClickSubmit() {
      this.$refs.mngrFormRef.validate(valid => {
        if (valid) {
          if (this.mngrForm.id) {
            // 更新
            this.doUpdateFormData(this.buildReuqestFormData());
          } else {
            // 新增
            this.doSaveFormData(this.buildReuqestFormData());
          }
        }
      });
    },
    bindClickCancle() {},
  },
};
</script>
<style lang="scss">
.mngr-wrapper {
  .m-w-form {
    .el-form {
      .el-form-item {
        .no-bor-input {
          input {
            border: none;
            background: #fff;
          }
        }
        &.form-item--img {
          .include {
            text-align: left;
            > .item {
              width: 66px !important;
              height: 66px !important;
              margin: 0 20px 0 0;
              .el-image {
                width: 100% !important;
                height: 100% !important;
              }
              .mask {
                width: 100% !important;
                height: 100% !important;
              }
              .center {
                margin-top: 0px;
                top: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                .circle {
                  width: 30px;
                  height: 30px;
                  margin: 9px auto 2px;
                  .svg-icon {
                    vertical-align: 0.5rem;
                  }
                }
                .text {
                  font-size: 12px;
                  line-height: 20px;
                }
              }
            }
          }
          &.form-item--qrcode {
            .item {
              width: 100px !important;
              height: 100px !important;
            }
          }
        }
        .area-select-wrap {
          width: 100%;
          display: flex;
          margin-bottom: 12px;
          .area-select {
            width: 100%;
            line-height: 16px;
            &:nth-of-type(1) {
              margin-left: 0;
            }
          }
        }
        .el-form-item__content {
          textarea {
            height: 100px;
            resize: none;
          }
          .el-select {
            width: 98%;
          }
        }
      }
      .selects-row {
        .el-col {
          .el-form-item {
            .el-form-item__label {
              // display: none;
            }
          }
          &:nth-of-type(n + 2) {
            .el-form-item {
              .el-form-item__label {
                display: none;
              }
              .el-form-item__content {
                margin-left: 0 !important;
                margin-right: 100px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
