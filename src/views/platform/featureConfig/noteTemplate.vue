<template>
  <!-- 短信模版 -->
  <div class="noteTemplate">
    <div class="note-open">
      <span style="margin-right: 10px"> 短信功能开启</span>
      <el-switch
          v-model="opendNote"
          @change="handleStatus"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
    </div>
    <h2>服务商绑定</h2>
    <el-table :data="bindTableData" style="width: 900px">
      <el-table-column label="服务商" prop="name"></el-table-column>
      <el-table-column label="说明" prop="explain"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p>{{scope.row.smsAccessKeyId ? '已绑定' : '未绑定'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <p @click="noteDialog = true" class="edit-bind">
            <i class="el-icon-edit"></i>
          </p>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加模版 -->
    <el-button type="primary" @click="edit()" class="addtemplate-btn">添加模版</el-button>

    <el-table
      ref="multipleTable"
      :data="templateData"
      tooltip-effect="dark"
      style="width: 100%"
      v-if="templateData.length > 0"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="模版名称" width="120" prop="templateName"></el-table-column>
      <el-table-column label="服务商" width="120">
        <template slot-scope="scope">
          <p>阿里云</p>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p>{{scope.row.isSmsOpen == 0 ? '关闭' : '开启'}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="测试">
        <template slot-scope="scope">
          <p>发送</p>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="right">
        <template slot-scope="scope">
          <p>
            <i class="el-icon-edit" @click="edit(scope.row)"></i>
            <i class="el-icon-delete" @click="deleteTemplate(scope.row)"></i>
          </p>
        </template>
      </el-table-column>
    </el-table>

    <div class="note">
      <h4>模版说明</h4>
      <p>
        模板名称：自定义填写，便于后台搜索查询选择。
        <br />模板ID：聚合数据、阿里大于需在服务商申请短信模板并审核，模板ID处填写服务商申请的模板ID。
        <br />短信签名: 阿里大于需在服务商申请短信签名并审核，短信签名处填写服务商申请的短信签名，亿美软通则可自定义填写。
        <br />数据值：聚合数据、阿里大于需在数据值中填写服务商模板变量对应的商城的变量(可在右侧选择商城变量)。
        <br />短信内容：亿美软通可直接自定义填写短信内容(可在右侧选择商城变量)。
        <br />状态：商城短信模板状态，关闭后将不能选择此模板，关闭后仍可在模板列表发送测试短信。
        <br />注意：阿里大于同一手机号60秒内只能发送一次，请根据需求选择适当接口。
      </p>
    </div>

    <el-dialog
      title="添加短信模版"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editTemplate">
        <el-form-item label="模版名称" :label-width="formLabelWidth">
          <el-input v-model="editTemplate.templateName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模版ID" :label-width="formLabelWidth">
          <el-input v-model="editTemplate.templateId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="短信签名" :label-width="formLabelWidth">
          <el-input v-model="editTemplate.signName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据值" :label-width="formLabelWidth">
          <ul class="data-num-ul">
            <li v-for="(item, index) in dataNumber" :key="index">
              <div class="data-num">
                <p>
                  <span>短信模版变量</span>
                  <el-input v-model="item.sms_template_val" autocomplete="off"></el-input>
                </p>
                <p>
                  <span>商城变量</span>
                  <el-input v-model="item.shop_val" autocomplete="off"></el-input>
                </p>
                <i class="el-icon-error" @click="deleteDataNum(index)"></i>
              </div>
            </li>
            <div class="data-num">
              <span>变量替换模板变量，例如：模版变量=ordensn 商城变量=[订单编号]，仅填英文变量即可</span>
              <i class="el-icon-circle-plus-outline" @click="addDataNumber"></i>
            </div>
          </ul>
        </el-form-item>
        <el-form-item label="状态值" :label-width="formLabelWidth">
          <el-radio-group v-model="editTemplate.isSmsOpen">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p>关闭后将不能调用</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="短信接口"
      :visible.sync="noteDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="bindTableData[0]">
        <el-form-item label="Access Key ID" :label-width="formLabelWidth">
          <el-input
            v-model="bindTableData[0].smsAccessKeyId"
            autocomplete="off"
            placeholder="请填写绑定的短信Access Key ID"
          ></el-input>
          <p>支持阿里等主流短信平台</p>
        </el-form-item>
        <el-form-item label="Access Key Secret" :label-width="formLabelWidth">
          <el-input
            v-model="bindTableData[0].smsAccessKeySecret"
            autocomplete="off"
            placeholder="请填写绑定的短信Access Key Secret"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noteDialog = false">取 消</el-button>
        <el-button type="primary" @click="bindSevices">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["noteTemplateData",'childTemplateData'],
  data() {
    return {
      bindTableData: [
        {
          ...this.noteTemplateData,
          name: "阿里大于",
          explain: "阿里巴巴旗下短信接口服务"
        }
      ],
      noteDialog: false,
      templateData: this.childTemplateData,
      dialogFormVisible: false,
      formLabelWidth: "150px",
      editTemplate: {
        id: "",
        templateName: "",
        templateId: "",
        signName: "",
        isSmsOpen: 1,
        data: ""
      },
      dataNumber: [
        {
          sms_template_val: "",
          shop_val: ""
        }
      ],
      isEdit:false,
      opendNote: 0
    };
  },
  created() {
    // this.getList();
    this.getStatus();
  },
  methods: {
    getList(){
      this.$ajax
          .get("platformsetting/sms/searchSmsTemplateList")
          .then(res => {
            if (res.resObject) {
              this.templateData = res.resObject || [];
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    getStatus(){
      this.$ajax
          .get("platformsetting/functionsetting/smsbinding/querySmsOpenStatus")
          .then(res => {
            if (res.resObject) {
              this.opendNote = res.resObject
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    addDataNumber() {
      this.dataNumber.push({
        sms_template_val: "",
        shop_val: ""
      });
    },
    deleteDataNum(index) {
      this.dataNumber.splice(index, 1);
    },
    edit(val) {
      this.dialogFormVisible = true;
      if (!val) {
        Object.assign(this.$data.editTemplate, this.$options.data());
        Object.assign(this.$data.dataNumber, this.$options.data());
        this.isEdit = false;
      } else {
        this.editTemplate = {
          ...val
        };
        this.isEdit = true;
        this.dataNumber = JSON.parse(this.editTemplate.data);
      }
    },
    bindSevices() {
      this.$ajax
        .post("/platformsetting/functionsetting/smsbinding/bindSmsTemplate", {
          id:this.bindTableData[0]['id'],
          unitId:this.bindTableData[0]['unitId'],
          smsAccessKeyId:this.bindTableData[0]['smsAccessKeyId'],
          smsAccessKeySecret:this.bindTableData[0]['smsAccessKeySecret']
        })
        .then(res => {
          this.$message.success("保存成功");
          this.noteDialog = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    commit() {
      this.editTemplate.data = JSON.stringify(this.dataNumber);
      if(this.isEdit){
        this.$ajax
        .post(`platformsetting/sms/updateSmsTemplate/${this.editTemplate.id}`, {
          ...this.editTemplate
        })
        .then(res => {
          this.$message.success("添加成功");
          this.dialogFormVisible = false;
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
      }else{
        this.$ajax
        .post("platformsetting/sms/createSmsTemplate", {
          ...this.editTemplate
        })
        .then(res => {
          this.$message.success("添加成功");
          this.dialogFormVisible = false;
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
      }

    },
    deleteTemplate(val) {
      let ids  = [];
      ids.push(val.id);
      this.$ajax
        .post("/platformsetting/sms/deleteSmsTemplate", {
          ids: ids
        })
        .then(res => {
          this.$message.success("删除成功");
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleStatus(val){
      this.$ajax
          .post("/platformsetting/functionsetting/smsbinding/changeSmsOpenStatus",{
            status: val
          })
          .then(res => {
            this.$message.success(val===1?'开启成功':"关闭成功");
          })
          .catch(err => {
            console.log(err);
          });
    }
  }
};
</script>
<style lang="scss">
.noteTemplate {
  h2 {
    font-size: 18px;
  }
  .note-open{
    padding: 20px 0;
    font-size: 14px;
    color: #666;
  }

  .data-num-ul {
    list-style: none;

    .data-num {
      display: flex;
      justify-content: space-between;
      align-items: center;

      i {
        font-size: 30px;
        cursor: pointer;
      }
    }

    li {
      list-style: none;
    }

    .el-input {
      width: 160px;
    }
  }

  .addtemplate-btn {
    margin-top: 30px;
  }

  .edit-bind {
    cursor: pointer;
    background: #666;
    color: #fff;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .note {
    margin-top: 30px;

    p {
      color: #666;
      font-size: 12px;
      line-height: 30px;
    }
  }
}
</style>
