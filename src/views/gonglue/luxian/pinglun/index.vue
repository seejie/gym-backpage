<template>
  <div class="strategyPublish">
    <el-card class="box-card">
      <!--查询表单-->
      <div class="from-wrap">
        <el-form :inline="true" :model="formInline" label-width="80px" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="搜索评论">
                <el-input v-model="formInline.content" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布状态">
                <el-select v-model="formInline.publish" placeholder="请选择">
                  <el-option label="草稿" :value="1"></el-option>
                  <el-option label="未发布" :value="2"></el-option>
                  <el-option label="已发布" :value="3"></el-option>
                  <el-option label="已下线" :value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布位置">
                <el-select v-model="formInline.place" placeholder="请选择">
                  <el-option label="置顶" value="1"></el-option>
                  <el-option label="默认" value="99"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="搜索用户">
                <el-input v-model="formInline.user" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="formInline.time"
                  type="datetimerange"
                  range-separator="至"
                  unlink-panels
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
      <dy-table :type="9" :bizId="id" :searchFrom="formInline" ref="DYTABLE"></dy-table>
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
      id: this.$route.params.id,
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
    // 搜索按钮
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
@import '../../scss/main.scss';
</style>
