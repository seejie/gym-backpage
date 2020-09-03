<template>
  <!-- 协议管理 -->
  <div class="protocol">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          订单QA
          <el-button @click="showEditDialog(1)">修改</el-button>
        </template>

        <div v-html="val_order"></div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          关于
          <el-button @click="showEditDialog(2)">修改</el-button>
        </template>

        <div v-html="val_about"></div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          平台协议
          <el-button @click="showEditDialog(3)">修改</el-button>
        </template>

        <div v-html="val_protocol"></div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label>
          <myEditor v-model="form.val_"></myEditor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
export default {
  data() {
    return {
      activeNames: ['1'],
      val_protocol: '',
      val_order: '',
      val_order_id: '',
      dialogFormVisible: false,
      type: '',
      val_about: '',
      val_about_id: '',
      val_order_id: '',
      title: '',
      form: {
        content: '',
        val_: '',
      },
    };
  },

  methods: {
    // 编辑
    showEditDialog(val) {
      this.title = '';
      this.type = val;
      if (val == 1) {
        this.title = '订单QA';
        this.form.val_ = this.val_order;
      } else if (val == 2) {
        this.title = '关于我们';
        this.form.val_ = this.val_about;
      } else if (val == 3) {
        this.title = '平台协议';
        this.form.val_ = this.val_protocol;
      }
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    // 提交
    submit() {
      let datas = {
        content: this.form.val_,
      };

      let url;
      let id;
      if (this.type == 3) {
        url = '/platformsetting/agreement/savePlatformAgree';
        id = this.val_protocol_id;
      }
      if (this.type == 2) {
        url = '/platformsetting/agreement/saveAboutAgree';
        id = this.val_about_id;
      }
      if (this.type == 1) {
        url = '/platformsetting/agreement/saveOrderQAAgree';
        id = this.val_order_id;
      }
      datas.name = this.title;
      datas.id = id;
      this.$ajax.post(url, datas).then(res => {
        if (res.resCode == 200) {
          this.dialogFormVisible = false;
          this.handlerclose();
          this.getList();
          this.$message.success('成功');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 关闭
    handlerclose(val) {
      this.dialogFormVisible = false;
    },
    // 列表
    getList() {
      this.$ajax
        .get('/platformsetting/agreement/agreementList')
        .then(res => {
          if (res.resCode == 200) {
            if (res.resObject.length) {
              this.val_order = res.resObject.find(v => v.type == 3) ? res.resObject.find(v => v.type == 3).content : '';
              this.val_order_id = res.resObject.find(v => v.type == 3) ? res.resObject.find(v => v.type == 3).id : '';
              this.val_about = res.resObject.find(v => v.type == 2) ? res.resObject.find(v => v.type == 2).content : '';
              this.val_about_id = res.resObject.find(v => v.type == 2) ? res.resObject.find(v => v.type == 2).id : '';
              this.val_protocol = res.resObject.find(v => v.type == 1)
                ? res.resObject.find(v => v.type == 1).content
                : '';
              this.val_protocol_id = res.resObject.find(v => v.type ==1 )
                ? res.resObject.find(v => v.type == 1).id
                : '';
            } else {
              this.val_order = '';
              this.val_order_id = '';
              this.val_about = '';
              this.val_about_id = '';
              this.val_protocol = '';
              this.val_protocol_id = '';
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => error);
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss">
.protocol {
  padding: 30px;
  background-color: #fff;
  .el-collapse {
    padding: 30px;
    .el-collapse-item {
      position: relative;
    }
    .el-button {
      position: absolute;
      right: 50%;
      top: 5px;
    }
  }
}
</style>


