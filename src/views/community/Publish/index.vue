<template>
  <div class="strategyPublish">
    <el-card class="box-card" shadow="never">
      <!--查询表单-->
      <div class="from-wrap">
        <el-form :inline="true" :model="formInline" label-width="80px" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="搜索内容">
                <el-input v-model="formInline.content" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布状态">
                <el-select v-model="formInline.publish" placeholder="请选择">
                  <el-option label="待审核" :value="1"></el-option>
                  <el-option label="已上线" :value="2"></el-option>
                  <el-option label="已发布" :value="3"></el-option>
                  <el-option label="已下线" :value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布位置">
                <el-select v-model="formInline.place" placeholder="请选择">
                  <el-option label="置顶" value="2"></el-option>
                  <el-option label="默认" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发布栏目">
                <el-select v-model="formInline.place" placeholder="请选择">
                  <el-option label="置顶" value="2"></el-option>
                  <el-option label="默认" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="搜索用户">
                <el-input v-model="formInline.memberId" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="formInline.time"
                  type="daterange"
                  range-separator="~"
                  value-format="yyyy-MM-dd HH:MM:SS"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item style="float:right">
              <el-button type="primary" @click="gonglueList">搜索</el-button>
              <el-button @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <dy-table :type="17" :searchFrom="formInline" ref="DYTABLE"></dy-table>
    </el-card>
  </div>
</template>

<script>
import DyTable from '@/components/Dynamic';
export default {
  name: 'strategyPublish',
  components: {
    DyTable,
  },
  data() {
    return {
      formInline: {
        content: '',
        publish: '',
        place: '',
        user: '',
        time: [],
        is_comment: '',
      },
    };
  },
  methods: {
    // 重置表单搜索
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    gonglueList() {
      this.$refs.DYTABLE.gonglueList();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../scss/main.scss';
.strategyPublish {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 90px);
  overflow: auto;
}
</style>
