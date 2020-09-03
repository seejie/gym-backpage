<template>
  <section>
    <div class="netPositon">
      <div style="textAlign: right">
        <el-button type="primary" @click="changeNetShow">导入位置</el-button>
      </div>
      <div>
        <el-dialog title="导入网点" :visible.sync="netShow" width="800px">
          <el-form
            :model="addFrom"
            ref="addFrom"
            style="display:flex;justify-content: space-between;marginBottom:15px;"
          >
            <el-form-item label="" label-width="100" prop="provinceCity" v-if="netShow">
              <area-select v-model="addFrom.provinceCity" :data="pcaa" :level="1"></area-select>
            </el-form-item>
            <el-form-item label="" label-width="100" prop="type">
              <el-select v-model="addFrom.category" placeholder="请选择" style="width:150px;">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="100" prop="name">
              <el-input v-model="addFrom.name" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-button type="primary" @click="submit('addFrom')">搜 索</el-button>
          </el-form>
          <div class="">
            <el-table :data="tableData" border="" @selection-change="handleSelectionChange" height="320px">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column type="index" label="序号" width="50"></el-table-column>
              <el-table-column prop="banner" label="封面" width="80">
                <template slot-scope="scope">
                  <div class="title">
                    <div class="img-wrap" v-if="scope.row.coverImage[0]">
                      <img :src="scope.row.coverImage[0].url" alt="" width="60" />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="120"></el-table-column>
              <el-table-column prop="address" label="地址" width="150"></el-table-column>
              <el-table-column prop="mobile" label="电话" width="110"></el-table-column>
              <el-table-column prop="categoryName" label="类型"></el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="current"
              :page-sizes="[5, 10, 15, 20, 25, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="marginTop:20px;"
            ></el-pagination>
          </div>
          <div slot="footer" class="dialog-footer" style="textAlign:center;">
            <el-button @click="onCancel('addFrom')">取 消</el-button>
            <el-button type="primary" @click="getIds">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </section>
</template>
<script type="text/ecmascript-6">
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";
import deleteEmptyParams from "@/utils/deleteEmptyParams";
export default {
  components: {},
  props: [],
  data () {
    return {
      netShow: false,
      addFrom: {
        provinceCity: [],
        category: "",
        name: ""
      },
      pca: pca,
      pcaa: pcaa,
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 5,
      multipleSelection: [],
      types: [],
    };
  },

  methods: {
    changeNetShow () {
      this.netShow = true;
    },
    async getList (params = {}) {
      // 获取网点列表
      this.$ajax
        .get('/storemanager/store/list', {
          params: deleteEmptyParams({
            ...params,
            unitType: '32',
            pageNum: this.current,
            pageSize: this.pageSize
          }),
        })
        .then(res => {
          if (res.resCode === 200) {
            this.tableData = res.resObject.list;
            this.total = res.resObject.totalCount;
            this.current = res.resObject.pageNum;
            this.pageSize = res.resObject.pageSize;
          }
        });
    },
    async getNetType () {
      // 获取网点列表
      this.$ajax
        .get('/storemanager/store-category/list', {
          params: {unitType: '32'},
        })
        .then(res => {
          if (res.resCode === 200) {
            this.types = res.resObject.list
          }
        });
    },
    //搜索
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            category: this[formName].category,
            name: this[formName].name,
            provinceId: this[formName].provinceCity.length && this[formName].provinceCity[0] || '', // 省-id
            cityId: this[formName].provinceCity.length && this[formName].provinceCity[1] || '', // 城市-id
          };
          this.getList(params);
        } else {
          return false;
        }
      });
    },
    onCancel (formName) {
      this.netShow = false;
      this.multipleSelection = [];
      this.$refs[formName].resetFields();
      this.addFrom = {
        provinceCity: [],
        type: "",
        name: ""
      };
    },
    //获取id
    getIds () {
      const item = this.multipleSelection[0];
      if (this.multipleSelection.length > 1) {
        this.$message("只能选择一个网点")
        return true
      }
      this.$emit("getIds", item);
      this.onCancel("addFrom");
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.current = val;
      this.getList();
    }
  },

  watch: {
    netShow: function (val) {
      if (val) {
        this.getList();
        this.getNetType()
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>

<style lang="scss">
.netPositon {
  z-index: 999999999;
  text-align: left;
  .area-select.large {
    width: 100%;
    line-height: 20px;
  }
  .el-dialog__header {
    text-align: left;
  }
  .area-select.medium {
    width: 85px;
  }
  .area-select {
    line-height: 16px;
  }
}
</style>
