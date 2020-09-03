<template>
  <div class="formList">
    <!-- <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>基本信息</span>
      </div>
      <div style="padding-right:20px;">

      </div>
    </el-card> -->
    <el-form
      :model="formList"
      :inline="formList.type.inline"
      :rules="formList.rules"
      ref="ruleForm"
      :label-width="formList.type.labelWidth ? formList.type.labelWidth : '120px'"
      :class="formList.type.inline ? 'form-wrap' : ''"
    >
      <template v-for="(item, index) in formList.queryItem">
        <el-form-item v-if="item.type === 'text'" :label="item.label" :prop="item.props" :key="index">
          <el-input v-model="item.model" :disabled="item.disabled" :placeholder="item.placeholder"></el-input>
        </el-form-item>
        <el-form-item v-if="item.type === 'password'" :label="item.label" :prop="item.props" :key="index">
          <el-input
            v-model="item.model"
            type="password"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          ></el-input>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'text-btn'" :label="item.label" :prop="item.props" :key="index">
          <div class="password">
            <el-input
              v-model="item.model"
              type="password"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
            ></el-input>
            <el-button type="text" @click="item.cb(item)">修改</el-button>
          </div>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'button'" :label="item.label" :key="index">
          <el-button @click="chooseGoods" type="primary">{{ item.btnText }}</el-button>
        </el-form-item>
        <!-- 地址选择组件联动 -->
        <el-form-item v-else-if="item.type === 'address'" :key="index" :label="item.label" :prop="item.props">
          <area-select v-model="item.model" type="code" :data="pcaa" :level="item.level"></area-select>
        </el-form-item>
        <!-- 上传组件 -->
        <el-form-item v-else-if="item.type === 'upload'" :key="index" :label="item.label" :prop="item.props">
          <myUpload type="1:1" :cropper="cropper" :max="1" v-model="item.model"></myUpload>
        </el-form-item>
        <!-- 带表格数据 -->
        <el-form-item v-else-if="item.type === 'tabel'" :key="index" :label="item.label" :prop="item.props">
          <!-- <myTable hasIndex
                   :data="item.list"
                   :columns='item.listColums'>
          </myTable> -->
          <el-table :data="item.index" border stripe>
            <el-table-column prop="date" label="分类"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.attributeIcon" style="width:50px;height:50px" alt="" />
              </template>
            </el-table-column>
            <el-table-column prop="date" label="规格"> </el-table-column>
            <el-table-column prop="id" label="编号"> </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'radio'" :label="item.label" :prop="item.props" :key="index">
          <el-radio-group v-model="item.model" @change="change">
            <el-radio v-for="(items, indexs) in item.option" :label="items.value" :key="indexs">{{
              items.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'date'" :label="item.label" :prop="item.props" :key="index">
          <el-date-picker
            v-model="item.model"
            type="datetime"
            :disabled="item.disabled"
            value-format="timestamp"
            :placeholder="item.placeholder"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'datetimerange'" :label="item.label" :prop="item.props" :key="index">
          <el-date-picker
            v-model="item.model"
            type="datetimerange"
            range-separator="至"
            :disabled="item.disabled"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'select'" :label="item.label" :prop="item.props" :key="index">
          <el-select v-model="item.model" :disabled="item.disabled" :placeholder="item.placeholder">
            <el-option
              v-for="(items, indexs) in item.option"
              :label="items.label"
              :value="items.value"
              :key="indexs"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'textarea'" :label="item.label" :prop="item.props" :key="index">
          <el-input
            type="textarea"
            maxlength="150"
            style="height:100px;"
            show-word-limit
            placeholder="150字以"
            v-model="item.model"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item :style="formList.type.bottomBtnStyle" style="text-align:right">
        <el-button v-for="(item, index) in formList.btn" :type="item.type" @click="item.cb" :key="index">{{
          item.text
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
export default {
  props: {
    formList: {
      default: () => [],
    },
    btnType: {
      default: '立即创建',
    },
  },
  data() {
    return {
      rules: {},
      pcaa: pcaa,
      cropper: [
        {
          name: '头像上传',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: '将以此作为用户头像',
        },
      ],
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formList);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$emit('resetForm', this.formList);
    },
    chooseGoods() {
      this.$emit('chooseGoods');
    },
    change(val) {
      this.$emit('changeRadio', val);
    },
    handleDeleteClick(row) {
      this.$emit('handleDeleteClick', row);
    },
  },
};
</script>
<style lang="scss" scoped>
.formList {
  @extend %fill;
  .btn-wrap {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .password {
    width: 100%;
    display: flex;
    .el-button {
      margin-left: 40px;
    }
  }
  .form-wrap {
    /deep/ .el-form-item {
      width: 32%;
      /deep/ .el-form-item__content {
        width: calc(100% - 120px);
      }
    }
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
  /deep/ .el-date-editor {
    width: 100%;
  }
  /deep/ .el-collapse-item__wrap {
    border: none;
  }
  /deep/ .el-select {
    width: 100%;
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
  /deep/ .area-select {
    line-height: 36px;
    height: 36px;
    .area-selected-trigger {
      padding: 0 10px;
    }
  }
}
</style>
