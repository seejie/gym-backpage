<template>
  <div class="photoEdit">
    <div class="topList">
      <div class="title">拍照详情</div>
      <div class="from-wrap">
        <formList :formList="topFormList"></formList>
      </div>
    </div>
    <div class="topList">
      <div class="title">照片</div>
      <div class="photo">
        <div class="left item">
          <div class="formTitle">左脚</div>
          <div class="photoList" v-if="!!leftPhotoList.length">
            <img
              class="photoImg"
              v-for="(item, index) in leftPhotoList"
              :key="index"
              :src="item"
              alt
            />
          </div>
          <div v-else>无数据</div>
        </div>
        <div class="right item">
          <div class="formTitle">右脚</div>
          <div class="photoList" v-if="!!rightPhotoList.length">
            <img
              class="photoImg"
              v-for="(item, index) in rightPhotoList"
              :key="index"
              :src="item"
              alt
            />
          </div>
          <div v-else>无数据</div>
        </div>
      </div>
      <div class="photo" v-if="isVerify">
        <div class="verify-status" v-if="!!leftPhotoList.length">
          <div class="photo-verify">
            <div v-html="getStatus(leftStatusStr,leftStatus,'left')"></div>
          </div>
          <div class="photo-btn" v-if="leftStatus != '2'">
            <el-button type="danger" v-if="leftStatus != '-2' && leftStatus != '3'" @click="refuse('left')">审核驳回</el-button>
            <el-button
              type="primary"
              v-if="leftStatus != '0' && leftStatus != '1'"
              @click="pass('left')"
            >审核通过</el-button>
          </div>
        </div>
        <div class="verify-status" v-else></div>
        <div class="verify-status" v-if="!!rightPhotoList.length">
          <div class="photo-verify">
            <div v-html="getStatus(rightStatusStr,rightStatus,'right')"></div>
          </div>
          <div class="photo-btn" v-if="rightStatus != '2'">
            <el-button type="danger" v-if="rightStatus != '-2' && rightStatus != '3' " @click="refuse('right')">审核驳回</el-button>
            <el-button
              type="primary"
              v-if="rightStatus != '0' && rightStatus != '1'"
              @click="pass('right')"
            >审核通过</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="title">&nbsp;</div>
    <div class="buttom-btn">
      <el-button @click="handleGoBack">返回</el-button>
    </div>
    <el-dialog title :visible.sync="reasonDialog" width="30%">
      <div style="color: red" class="reason-radio">*请选择驳回原因</div>
      <el-checkbox-group v-model="selectReason.reasonValue">
        <div v-for="(item,index) in options" :key="index">
          <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
        </div>
        <div class="other-reason">
          <el-checkbox label="flag">其他原因</el-checkbox>
          <el-input
            type="textarea"
            v-if="selectReason.reasonValue.some(v => v == 'flag')"
            placeholder="请手动输入驳回原因"
            v-model="selectReason.otherValue"
          ></el-input>
        </div>
      </el-checkbox-group>
      <!-- <div style="color: red" class="reason-radio">其他原因</div> -->

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="reasonDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleCloseDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: 0,
      isEdit: false,
      isVerify: true,
      leftStatus: 0,
      leftStatusStr: "",
      rightStatus: 0,
      rightStatusStr: "",
      reasonDialog: false,
      isLeft: true,
      selectReason: {
        reasonValue: [],
        otherValue: '',
      },
      topFormList: {
        queryItem: [
          {
            type: 'text',
            disabled: true,
            model: '',
            props: 'bh',
            placeholder: '拍照编号',
            label: '拍照编号',
          },
          {
            type: 'text',
            disabled: true,
            model: '',
            props: 'mobile',
            placeholder: '手机号码',
            label: '手机号码',
          },
          {
            type: 'text',
            disabled: true,
            model: '',
            props: 'nickName',
            placeholder: '用户姓名',
            label: '用户姓名',
          },
          {
            type: 'text',
            disabled: true,
            model: '',
            props: 'sex',
            placeholder: '性别',
            label: '性别',
          },
          {
            type: 'text',
            disabled: true,
            model: '',
            props: 'age',
            placeholder: '年龄',
            label: '年龄',
          },
          {
            type: 'text',
            disabled: true,
            model: '',
            props: 'statusStr',
            placeholder: '处理状态',
            label: '处理状态',
          },
        ],
        type: {
          bottomBtnStyle: 'float:right',
          inline: true,
        },
      },
      form: {
        rightType: [],
        leftType: [],
      },
      leftForm: {
        queryItem: [
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjJiaochang',
            placeholder: '脚长',
            label: '脚长',
          },
          {
            type: 'select',
            disabled: !this.isEdit,
            model: '',
            props: 'zjJiaoxing',
            placeholder: '脚型',
            label: '脚型',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjJiaokuan',
            placeholder: '脚宽',
            label: '脚宽',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjBpzzwcc',
            placeholder: '表皮跖趾围尺寸',
            label: '表皮跖趾围尺寸',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjDyzzgjgd',
            placeholder: '第一跖趾关节高度',
            label: '第一跖趾关节高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjFggd',
            placeholder: '跗骨高度',
            label: '跗骨高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjQfgwc',
            placeholder: '前跗骨围长',
            label: '前跗骨围长',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjDgwc',
            placeholder: '兜跟围长',
            label: '兜跟围长',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjHgtdgd',
            placeholder: '后跟凸点高度',
            label: '后跟凸点高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjMzgd',
            placeholder: '拇指高度',
            label: '拇指高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjWhgxydgd',
            placeholder: '外踝骨下缘点高度',
            label: '外踝骨下缘点高度',
          },
          // {
          //   type: 'text',
          //   disabled: !this.isEdit,
          //   model: '',
          //   props: 'username',
          //   placeholder: '足弓高度',
          //   label: '足弓高度'
          // },
        ],
        type: {
          bottomBtnStyle: 'float:right',
          inline: false,
          labelWidth: '150px',
        },
        unitId: '',
      },
      rightForm: {
        queryItem: [
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjJiaochang',
            placeholder: '脚长',
            label: '脚长',
          },
          {
            type: 'select',
            disabled: !this.isEdit,
            model: '',
            props: 'yjJiaoxing',
            placeholder: '脚型',
            label: '脚型',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjJiaokuan',
            placeholder: '脚宽',
            label: '脚宽',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjBpzzwcc',
            placeholder: '表皮跖趾围尺寸',
            label: '表皮跖趾围尺寸',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjDyzzgjgd',
            placeholder: '第一跖趾关节高度',
            label: '第一跖趾关节高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjFggd',
            placeholder: '跗骨高度',
            label: '跗骨高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjQfgwc',
            placeholder: '前跗骨围长',
            label: '前跗骨围长',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjDgwc',
            placeholder: '兜跟围长',
            label: '兜跟围长',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjHgtdgd',
            placeholder: '后跟凸点高度',
            label: '后跟凸点高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjMzgd',
            placeholder: '拇指高度',
            label: '拇指高度',
          },
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjWhgxydgd',
            placeholder: '外踝骨下缘点高度',
            label: '外踝骨下缘点高度',
          },
          // {
          //   type: 'text',
          //   disabled: !this.isEdit,
          //   model: '',
          //   props: 'username',
          //   placeholder: '足弓高度',
          //   label: '足弓高度'
          // },
        ],
        type: {
          bottomBtnStyle: 'float:right',
          inline: false,
          labelWidth: '150px',
        },
      },
      leftPhotoList: [],
      rightPhotoList: [],
      options: [
        {
          value: 'A4纸要放平，不能有脚翘起来，且纸张4个脚要拍进来',
          label: 'A4纸要放平，不能有脚翘起来，且纸张4个脚要拍进来',
        },
        {
          value: '拍侧面的时候，请将手机贴近地面拍摄',
          label: '拍侧面的时候，请将手机贴近地面拍摄',
        },
        {
          value: '请站立拍照，脚部要受力',
          label: '请站立拍照，脚部要受力',
        },
        {
          value: '光线不足',
          label: '光线不足',
        },
        {
          value: '请把袜子脱掉，把裤子撸上来',
          label: '请把袜子脱掉，把裤子撸上来',
        },
      ],
    };
  },
  mounted() {
    //根据id获取详细信息
    this.isEdit = this.$route.query.type;
    // this.isVerify = this.$router.query.verify;
    if (this.isEdit) {
      this.leftForm.queryItem.forEach(item => {
        item.disabled = false;
      });
      this.rightForm.queryItem.forEach(item => {
        item.disabled = false;
      });
    } else {
      this.leftForm.queryItem.forEach(item => {
        item.disabled = true;
        item.placeholder = '';
      });
      this.rightForm.queryItem.forEach(item => {
        item.disabled = true;
        item.placeholder = '';
      });
    }
    this.getDetaiInfoByid();
  },
  methods: {
    handleCloseDialog() {
      let reason = '';
      let reasonReplace = '';
      let i = 0;
      for (let res of this.selectReason.reasonValue) {
        reason += ++i + ':' + res + '。';
      }
      if (reason.indexOf('flag') >=0) {
        if (!this.selectReason.otherValue) {
          this.$message.warning('请手动填写其他驳回原因');
          return;
        }
        reason = reason.replace(/flag/g, this.selectReason.otherValue);
      }
      if (!reason) {
        this.$message.warning('请选择驳回原因');
        return;
      }

      this.reasonDialog = false;
      this.$ajax
        .put(`/pzcz/photo/rejectAudit?id=${this.$route.query.id}&isLeft=${this.isLeft}&reason=${reason}`)
        .then(res => {
          this.$message.success('操作成功');
          this.getDetaiInfoByid();
        });
    },
    getDetaiInfoByid() {
      this.$ajax.get(`/pzcz/photo/detail?id=${this.$route.query.id}`).then(res => {
        let data = res.resObject;
        this.setFormModel(this.topFormList.queryItem, data);
        this.setFormModel(this.leftForm.queryItem, data);
        this.setFormModel(this.rightForm.queryItem, data);
        this.form.leftType = data.zjResult === null ? [] : data.zjResult.split(',');
        this.form.rightType = data.yjResult === null ? [] : data.yjResult.split(',');
        this.leftPhotoList = data.zjPic1 ? [data.zjPic1, data.zjPic2, data.zjPic3] : [];
        this.rightPhotoList = data.yjPic1 ? [data.yjPic1, data.yjPic2, data.yjPic3] : [];
        this.leftStatus = data.leftStatus;
        this.leftStatusStr = data.leftStatusStr;
        this.rightStatusStr = data.rightStatusStr;
        this.rightStatus = data.rightStatus;
        this.unitId = data.unitId;
        this.status = data.status;
      });
    },
    pass(item) {
      this.$ajax.put(`/pzcz/photo/passAudit?id=${this.$route.query.id}&isLeft=${item == 'left'}`).then(res => {
        this.$message.success('操作成功');
        this.getDetaiInfoByid();
      });
    },
    refuse(item) {
      this.reasonDialog = true;
      this.isLeft = item == 'left';
    },
    //编辑取值
    setFormModel(list, val) {
      list.forEach(item => {
        Object.keys(val).map(keyName => {
          if (item.props == keyName) {
            if (item.props == 'index_logo') {
              item.model = { ratio1: val['index_logo'] === null ? [] : [val['index_logo']] };
            } else if (item.props == 'qr_code_img') {
              item.model = { ratio1: val['qr_code_img'] === null ? [] : [val['qr_code_img']] };
            } else if (item.props == 'area_name') {
              item.model = [val['province_id'] + '', val['city_id'] + '', val['area_id'] + ''];
            } else {
              item.model = val[keyName];
            }
          }
        });
      });
    },
    handleGoBack() {
      this.$router.go(-1);
    },
    getStatus(name,val,flag) {
     if (Number(val) == -1) {
        return `<span style="color: blue">${name || "待审核"}</span>`;
      } else if (Number(val) == 3) {
        return `<span style="color: red">${name || "驳回,图片不清晰"}</span>`;
      } else if (Number(val) == 0) {
        return `<span style="color: green">${name || "审核通过待测量"}</span>`;
      } else if (Number(val) == 1) {
        return `<span style="color: red">${name || "测量失败"}</span>`;
      } else if (Number(val) == 2) {
        return `<span style="color: #29bc4f">${name || (flag == 'left'?"左脚测量成功":"右脚测量成功")}</span>`;
      } else if(Number(val) == -2) {
        return `<span style="color: gray">${name || "未拍照"}</span>`;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.photoEdit {
  width: 100%;
  height: 100%;
  padding: 10px;
  .title {
    height: 40px;
    line-height: 40px;
    background: #dcdfe6;
    color: #303133;
    padding-left: 1em;
  }
  .from-wrap {
    padding-top: 20px;
    width: 100%;
    background: white;
  }
  .result {
    width: 100%;
    display: flex;
    background: white;
    .item {
      flex: 1;
      // padding-top: 20px;
      padding: 20px;
      .formTitle {
        height: 40px;
        line-height: 40px;
      }
    }
  }
  .bottonBtn-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: white;
  }
  .photo {
    width: 100%;
    display: flex;
    background: white;
    .item {
      flex: 1;
      // padding-top: 20px;
      padding: 20px;
      display: flex;
      .formTitle {
        flex-basis: 100px;
      }
      .photoList {
        display: flex;

        .photoImg {
          width: 120px;
          height: 120px;
          margin-right: 20px;
        }
      }
    }
    .verify-status {
      width: 50%;
    }
    .photo-verify {
      width: 50%;
      padding-left: 150px;
    }
    .photo-btn {
      padding: 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.buttom-btn {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
}
/deep/ .el-dialog {
  .el-dialog__headerbtn {
    top: 7px;
  }
  .el-radio {
    line-height: 28px;
  }
  .el-dialog__body {
    padding: 15px 20px;
  }
  .el-dialog__footer {
    padding: 10px;
  }
  .reason-radio {
    line-height: 28px;
  }
  .other-reason {
    display: flex;
  }
  .el-checkbox-group {
    width: 100%;
  }
}
</style>
