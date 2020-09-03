<template>
  <div class="activeManage">
    <el-card class="box-card">
      <div style="padding: 20px 0">权限模块</div>
      <el-table
        :data="tableData"
        style="width: 300px"
      >
        <el-table-column
          label="素材模块"
          width="180"
          prop="moduleName"
        >
        </el-table-column>
        <el-table-column label="是否开放">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 300px; text-align:center; padding: 20px 0;">
        <el-button
          type="success"
          @click="submit"
          style="width: 100px"
        >提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created(){
    this.getPagesetting();
  },
  methods: {
    getPagesetting(){
      this.$ajax
        .get('/material/pageSetting/getDefaultSetting', {})
        .then(res => {
          if (res.resCode == 200) {
            this.tableData = res.resObject;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    submit() {
      this.$ajax
        .post('/material/pageSetting/saveOrUpdate', this.tableData)
        .then(res => {
          console.log('res: ', res);
          if (res.resCode == 200) {
            this.$message.success('成功');
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => console.log(err));
    },
  },
};
</script>

<style>
.activeManage {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
}
.activeManage .box-card {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.box-card {
  display: flex;
  flex-direction: column;
}
</style>
