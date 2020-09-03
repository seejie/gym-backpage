<template>
  <div class="photoEdit">
    <div class="topList">
      <div class="title">编辑数据</div>
      <div class="from-wrap">
        <formList :formList="topFormList"></formList>
      </div>
    </div>
    <div class="topList">
      <div class="title">照片</div>
      <div class="photo">
        <div class="left item">
          <div class="formTitle">左脚</div>
          <div class="photoList" v-if="!!leftPhotoList[0]">
            <img
              class="photoImg"
              v-for="(item, index) in leftPhotoList"
              :key="index"
              :src="item"
              alt
            />
          </div>
          <div class="photoList" v-else>无数据</div>
        </div>
        <div class="right item">
          <div class="formTitle">右脚</div>
          <div class="photoList" v-if="!!rightPhotoList[0]">
            <img
              class="photoImg"
              v-for="(item, index) in rightPhotoList"
              :key="index"
              :src="item"
              alt
            />
          </div>
          <div class="photoList" v-else>无数据</div>
        </div>
      </div>
    </div>
    <div class="centerList">
      <div class="title">分析数据</div>
      <div class="result">
        <div class="left item" v-if="!!leftPhotoList[0]">
          <div class="formTitle">左脚 (单位:mm)</div>
          <formList :formList="leftForm"></formList>
        </div>
        <div class="left item" v-else>
          <div class="formTitle">左脚 (单位:mm)</div>无数据
        </div>
        <div class="right item" v-if="!!rightPhotoList[0]">
          <div class="formTitle">右脚 (单位:mm)</div>
          <formList :formList="rightForm"></formList>
        </div>
        <div class="right item" v-else>
          <div class="formTitle">右脚 (单位:mm)</div>无数据
        </div>
      </div>
    </div>
    <div class="bottomList">
      <div class="title">脚型结论</div>
      <div class="result">
        <div class="left item" v-if="!!leftPhotoList[0]">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="左脚">
              <el-checkbox-group v-model="form.leftType">
                <el-checkbox label="正常" :disabled="!isEdit" name="正常">正常</el-checkbox>
                <el-checkbox label="平足" :disabled="!isEdit" name="平足">平足</el-checkbox>
                <el-checkbox label="高足弓" :disabled="!isEdit" name="高足弓">高足弓</el-checkbox>
                <el-checkbox label="大拇指外翻" :disabled="!isEdit" name="大拇指外翻">大拇指外翻</el-checkbox>
                <el-checkbox label="大拇指内翻" :disabled="!isEdit" name="大拇指内翻">大拇指内翻</el-checkbox>
                <el-checkbox label="脚步受过伤" :disabled="!isEdit" name="脚步受过伤">脚步受过伤</el-checkbox>
                <el-checkbox label="脚步局部后病变" :disabled="!isEdit" name="脚步局部后病变">脚步局部后病变</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="left item" v-else>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="左脚">无数据</el-form-item>
          </el-form>
        </div>
        <div class="right item" v-if="!!rightPhotoList[0]">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="右脚">
              <el-checkbox-group v-model="form.rightType">
                <el-checkbox label="正常" :disabled="!isEdit" name="正常">正常</el-checkbox>
                <el-checkbox label="平足" :disabled="!isEdit" name="平足">平足</el-checkbox>
                <el-checkbox label="高足弓" :disabled="!isEdit" name="高足弓">高足弓</el-checkbox>
                <el-checkbox label="大拇指外翻" :disabled="!isEdit" name="大拇指外翻">大拇指外翻</el-checkbox>
                <el-checkbox label="大拇指内翻" :disabled="!isEdit" name="大拇指内翻">大拇指内翻</el-checkbox>
                <el-checkbox label="脚步受过伤" :disabled="!isEdit" name="脚步受过伤">脚步受过伤</el-checkbox>
                <el-checkbox label="脚步局部后病变" :disabled="!isEdit" name="脚步局部后病变">脚步局部后病变</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="right item" v-else>无数据</div>
      </div>
    </div>
    <div class="bottonBtn-wrap">
      <!-- <el-button type="primary" :disabled="status == '0' || status == '1'" v-if="isEdit" @click="pass"
        >审核通过</el-button
      >
      <el-button type="primary" :disabled="status == '-1' || status == '1'" v-if="isEdit" @click="refuse"
        >审核驳回</el-button
      >-->
      <!-- <el-button type="primary"
                 @click="reset"
      v-if="isEdit">重置</el-button>-->
      <el-button type="primary" @click="save" v-if="isEdit">保存</el-button>
      <el-button type="primary" @click="goback">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: 0,
      isEdit: false,
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
            type: 'text',
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
            props: 'zjZggd',
            placeholder: '足弓高度',
            label: '足弓高度',
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
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'zjSuggestSize',
            placeholder: '尺码',
            label: '尺码'
          },
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
            type: 'text',
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
            props: 'yjZggd',
            placeholder: '足弓高度',
            label: '足弓高度',
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
          {
            type: 'text',
            disabled: !this.isEdit,
            model: '',
            props: 'yjSuggestSize',
            placeholder: '尺码',
            label: '尺码'
          },
        ],
        type: {
          bottomBtnStyle: 'float:right',
          inline: false,
          labelWidth: '150px',
        },
      },
      leftPhotoList: [],
      rightPhotoList: [],
    };
  },
  mounted() {
    //根据id获取详细信息
    console.log(this.$route.query.id);
    this.isEdit = this.$route.query.type;
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
    getDetaiInfoByid() {
      this.$ajax.get(`/pzcz/photo/detail?id=${this.$route.query.id}`).then(res => {
        let data = res.resObject;
        this.setFormModel(this.topFormList.queryItem, data);
        this.setFormModel(this.leftForm.queryItem, data);
        this.setFormModel(this.rightForm.queryItem, data);
        this.form.leftType = data.zjResult === null ? [] : data.zjResult.split(',');
        this.form.rightType = data.yjResult === null ? [] : data.yjResult.split(',');
        this.leftPhotoList = [data.zjPic1, data.zjPic2, data.zjPic3];
        this.rightPhotoList = [data.yjPic1, data.yjPic2, data.yjPic3];
        this.unitId = data.unitId;
        this.status = data.status;
      });
    },
    // pass(item) {
    //   this.$ajax
    //     .post('/pzcz-photo/change-status/' + this.$route.query.id, {
    //       status: 0,
    //     })
    //     .then(res => {
    //       this.$message.success('操作成功');
    //       this.getDetaiInfoByid();
    //     });
    // },
    // refuse(item) {
    //   this.$ajax
    //     .post('/pzcz-photo/change-status/' + this.$route.query.id, {
    //       status: '-1',
    //     })
    //     .then(res => {
    //       this.$message.success('操作成功');
    //       this.getDetaiInfoByid();
    //     });
    // },
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
    //获取表单值
    getLeftFormModel(val) {
      let modelData = this.leftForm.queryItem.filter(item => {
        return item.props === val;
      });
      return modelData[0].model;
    },
    //获取表单值
    getRightFormModel(val) {
      let modelData = this.rightForm.queryItem.filter(item => {
        return item.props === val;
      });
      return modelData[0].model;
    },
    //重置
    reset() {
      this.topFormList.queryItem.forEach(item => {
        item.model = '';
      });
      this.leftForm.queryItem.forEach(item => {
        item.model = '';
      });
      this.rightForm.queryItem.forEach(item => {
        item.model = '';
      });
    },
    save() {
      let params = JSON.stringify({
        id: this.$route.query.id,
        zjJiaochang: this.getLeftFormModel('zjJiaochang'),
        zjJiaoxing: this.getLeftFormModel('zjJiaoxing'),
        zjJiaokuan: this.getLeftFormModel('zjJiaokuan'),
        zjBpzzwcc: this.getLeftFormModel('zjBpzzwcc'),
        zjDyzzgjgd: this.getLeftFormModel('zjDyzzgjgd'),
        zjFggd: this.getLeftFormModel('zjFggd'),
        zjZggd: this.getLeftFormModel('zjZggd'),
        zjQfgwc: this.getLeftFormModel('zjQfgwc'),
        zjDgwc: this.getLeftFormModel('zjDgwc'),
        zjHgtdgd: this.getLeftFormModel('zjHgtdgd'),
        zjMzgd: this.getLeftFormModel('zjMzgd'),
        zjWhgxydgd: this.getLeftFormModel('zjWhgxydgd'),
        zjSuggestSize: this.getLeftFormModel('zjSuggestSize'),
        yjJiaochang: this.getRightFormModel('yjJiaochang'),
        yjJiaoxing: this.getRightFormModel('yjJiaoxing'),
        yjJiaokuan: this.getRightFormModel('yjJiaokuan'),
        yjBpzzwcc: this.getRightFormModel('yjBpzzwcc'),
        yjDyzzgjgd: this.getRightFormModel('yjDyzzgjgd'),
        yjFggd: this.getRightFormModel('yjFggd'),
        yjZggd: this.getRightFormModel('yjZggd'),
        yjQfgwc: this.getRightFormModel('yjQfgwc'),
        yjDgwc: this.getRightFormModel('yjDgwc'),
        yjHgtdgd: this.getRightFormModel('yjHgtdgd'),
        yjMzgd: this.getRightFormModel('yjMzgd'),
        yjWhgxydgd: this.getRightFormModel('yjWhgxydgd'),
        yjSuggestSize: this.getRightFormModel('yjSuggestSize'),
        unitId: this.unitId,
        zjResult: this.form.leftType.join(','),
        yjResult: this.form.rightType.join(','),
        status: this.status,
      });
      this.$ajax.post('/pzcz/photo/update', JSON.parse(params)).then(res => {
        if (res.resCode === 200) {
          this.$message.success('信息保存成功');
          this.$router.push({
            name: 'photoManage',
          });
        }
      });
    },
    goback() {
      this.$router.go(-1);
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
  }
}
</style>
