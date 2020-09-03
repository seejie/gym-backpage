<template>
  <div class="fromList">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>基本信息</span>
      </div>
      <div style="padding-right:20px;">
        <el-form :model="fromList"
                 :rules="rules"
                 ref="ruleForm"
                 label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="主标题"
                        prop="mainTitle">
            <el-input v-model="fromList.mainTitle"
                      placeholder="请填写主标题，1-24字"></el-input>
          </el-form-item>
          <el-form-item label="副标题"
                        prop="subTitle">
            <el-input v-model="fromList.subTitle"
                      placeholder="请填写副标题，1-24字"></el-input>
          </el-form-item>
          <!-- 上传组件 -->
          <el-form-item label="活动封面"
                        prop="url">
            <myUpload type="1:1"
                      :cropper="cropper"
                      :max=1
                      v-model="fromList.url"></myUpload>
          </el-form-item>
          <el-form-item label="缩略图"
                        prop="name">
            <myUpload type="1:1"
                      :cropper="cropperIndex"
                      :max=9
                      v-model="fromList.indexPic"></myUpload>
          </el-form-item>
          <el-form-item label="三方链接"
                        prop="otherLink">
            <el-input v-model="fromList.otherLink"
                      placeholder="请填写第三方链接,前台访问直接跳转"></el-input>
          </el-form-item>
          <!-- 多选框 -->
          <el-form-item label="标签"
                        prop="LabelTyle">
            <el-checkbox-group v-model="fromList.LabelTyle">
              <el-checkbox v-for="(item,index) in labelList"
                           :key="index"
                           :label="item.id">{{item.tagName}}</el-checkbox>
            </el-checkbox-group>
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
            <el-date-picker v-model="fromList.endTime"
                            type="datetime"
                            value-format="timestamp"
                            placeholder="截止日期">
            </el-date-picker>
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
              <!-- <el-radio :label=1>待审核</el-radio> -->
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
                        disabled
                        placeholder="可直接关联，若无可填写详细信息"></el-input>
              <el-button @click="getPos"
                         type="primary">导入位置</el-button>
            </div>
          </el-form-item>
          <el-form-item label="活动详情"
                        prop="activeDetail">
            <!-- <div id="editor"></div> -->
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
          </el-form-item>
          <el-form-item label="报名信息设置"
                        prop="enlistInfo">
            <el-collapse>
              <el-collapse-item title="设置报名关键字 点击展开"
                                name="1">
                <el-card>
                  <div class="enlist-info"
                       v-for="(item,index) in fromList.enlistInfoList"
                       :key="index">
                    <template>
                      <div class="chooseLine">
                        <div class="keyword">关键字{{index+1}}</div>
                        <el-input type="text"
                                  v-model="item.textInfo"></el-input>
                        <el-dropdown trigger="click"
                                     placement='bottom-end'>
                          <el-button type="primary">
                            {{item.showText}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(items,indexs) in item.labelType"
                                              :key="indexs"
                                              @click.native="chooseMenu(items,index,items.type)">{{items.label}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <el-checkbox v-model="item.isCheck">必填</el-checkbox>
                        <el-button type="danger"
                                   @click="del(item,index)"
                                   icon="el-icon-delete"
                                   circle></el-button>
                      </div>
                    </template>
                    <template v-for="(list,rowIndex) in item.keyWordList">
                      <div class="chooseItem"
                           :key="rowIndex"
                           v-if="item.type==2 || item.type == 3">
                        <div class="keyword">选项{{rowIndex+1}}</div>
                        <el-input type="text"
                                  v-model="list.keyword"></el-input>
                        <i class="el-icon-delete"
                           @click="delItem(list,index,rowIndex)"></i>
                        <i class="el-icon-circle-plus-outline"
                           @click="addItem(list,index,rowIndex)"></i>
                      </div>
                    </template>
                  </div>
                  <div class="btn-wrap">
                    <el-button @click="addKeyWord"
                               type="primary">添加关键字</el-button>
                  </div>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <!--  <el-form-item label="其他提示"
                        prop="otherLink">
            <el-input type="text"
                      placeholder="填写提示信息"
                      v-model="fromList.otherDialog"></el-input>
            <div style="height:20px"></div>
            <el-input type="text"
                      placeholder="三方链接"
                      v-model="fromList.lastLink"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('ruleForm')">{{btnType}}</el-button>
            <el-button @click="back('ruleForm')">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as http from '@/api/huigou/active/typeSet.js'
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
    labelList: {
      type: Array,
      default: () => []
    },
    btnType: {
      default: '立即创建'
    }
  },
  data () {
    return {
      ruleForm: {
        times: [],
        name: '',
        nextName: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      },
      dialogImageUrl: '',
      dialogVisible: false,//上传点击图片预览
      rules: {
        mainTitle: [
          { required: true, message: '请输入主标题', trigger: 'blur' },
          { min: 1, max: 24, message: '长度在 1 到 24个字符', trigger: 'blur' }
        ],
        activeLevel: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        checkOut: [
          { required: true, message: '请选择审核状态', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请上传活动封面', trigger: 'change' },
        ],
        remark: [
          { required: true, message: '请输入活动摘要', trigger: 'blur' }
        ]
      },
      editor: '',//富文本字符串
      menulist: [],//一级分类数据
      nextMenulists: [],//二级菜单
      cropper: [{
        name: '活动封面',
        ratio_x: 550,
        ratio_y: 408,
        ratio: 1,
        desc: '你的用户将在活动详情页各类别票种、惠购查看更多活动列表，看到此封面'
      }
      ],
      cropperIndex: [{
        name: '缩略图',
        ratio_x: 160,
        ratio_y: 110,
        ratio: 1.45,
        desc: '你的用户将在活动详情页各类别票种、惠购查看更多活动列表，看到此封面'
      }
      ],
    };
  },
  mounted () {
    this.getMainMenu()//获取一级菜单
    if (this.btnType == '立即创建') {

    } else {
      this.getMainMenu()
      this.getNextMents(this.fromList.activeLevel.one)
    }
  },
  methods: {
    submitForm (formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.fromList)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getPos () {
      console.log(1)
      this.$emit('getPosition')
    },
    back (formName) {
      this.$router.go(-1)
    },
    //报名信息下拉按钮
    chooseMenu (item, index, order) {
      console.log(item, index, order)
      console.log(this.fromList.enlistInfoList[index])
      // this.fromList.enlistInfoList[index].type = order
      // this.fromList.enlistInfoList[index].showText = item.label
      this.$set(this.fromList.enlistInfoList[index], 'type', order)
      this.$set(this.fromList.enlistInfoList[index], 'showText', item.label)
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
    //添加方法
    addItem (item, index, rowIndex) {
      console.log(rowIndex)
      // this.fromList.enlistInfoList[index].keyWordList.push({
      //   name: ''
      // })
      this.fromList.enlistInfoList[index].keyWordList.splice(rowIndex + 1, 0, {
        name: ''
      })
    },
    //查询所有二级分类
    getNextMents (id) {
      http.getType({
        catGrade: 2,
        catParentId: id
      }).then((res) => {
        this.nextMenulists = res.resObject
        console.log(this.nextMenuList)
      }).catch((err) => {
        console.log(err)
      })
    },
    //查询所有一级菜单
    getMainMenu () {
      http.getType({
        catGrade: 1,
      }).then((res) => {
        this.menulist = res.resObject
      }).catch((err) => {
        console.log(err)
      })
    },
    menuChange (val) {
      this.getNextMents(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.fromList {
  @extend %fill;
  .uploader-text {
    font-size: 14px;
    color: #ccc;
  }
  .select-wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    /deep/ .el-select {
      flex: 1;
      margin-right: 10px;
      &:last-child {
        margin: 0;
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

