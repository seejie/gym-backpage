<template>
  <section>
    <div class="netPositon">
      <div style='textAlign: right'>
        <el-button type="primary"
                   @click="changeNetShow">导入位置</el-button>
      </div>
      <div>
        <el-dialog title="导入网点"
                   :visible.sync="netShow"
                   width="800px">
          <el-form :model="addFrom"
                   ref="addFrom"
                   style="display:flex;justify-content: space-between;marginBottom:15px;">
            <el-form-item label=""
                          label-width="100"
                          prop="provinceCity"
                          v-if="netShow">
              <area-select v-model="addFrom.provinceCity"
                           type="text"
                           :data="pcaa"
                           :level="1"></area-select>
            </el-form-item>
            <el-form-item label=""
                          label-width="100"
                          prop="type">
              <el-select v-model="addFrom.type"
                         placeholder="请选择"
                         style="width:150px;">
                <el-option v-for="item in types"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=""
                          label-width="100"
                          prop="name">
              <el-input v-model="addFrom.name"
                        placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-button type="primary"
                       @click="submit('addFrom')">搜 索</el-button>
          </el-form>
          <div class="">
            <el-table :data="tableData"
                      border=""
                      @selection-change="handleSelectionChange"
                      height="320px">
              <el-table-column type="selection"
                               width="55"></el-table-column>
              <el-table-column type="index"
                               label="序号"
                               width="50"></el-table-column>
              <el-table-column prop="pic"
                               label="封面"
                               width="80">
                <template slot-scope="scope">
                  <div class="title">
                    <div class="img-wrap">
                      <img :src="scope.row.venuePic"
                           alt=""
                           width="60">
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name"
                               label="名称"
                               width="150"></el-table-column>
              <el-table-column prop="address"
                               label="地址"
                               width="100"></el-table-column>
              <el-table-column prop="contactPhone"
                               label="电话"
                               width="100"></el-table-column>
              <el-table-column prop="typeName"
                               label="类型"></el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="current"
                           :page-sizes="[5, 10, 15, 20,25,30,40,50]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"
                           style="marginTop:20px;"></el-pagination>
          </div>
          <div slot="footer"
               class="dialog-footer"
               style="textAlign:center;">
            <el-button @click="onCancel('addFrom')">取 消</el-button>
            <el-button type="primary"
                       @click="getIds">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </section>
</template>
<script type='text/ecmascript-6'>
import { AreaCascader } from 'vue-area-linkage';
import { pca, pcaa } from 'area-data';
import { getNetType, getNetList } from './ticketManage/ticketService.js';
export default {
  components: {},
  props: [],
  data () {
    return {
      netShow: false,
      addFrom: {
        provinceCity: [],
        type: '',
        name: ''
      },
      // types: [
      //   {
      //     label: "名人故居",
      //     value: "名人故居"
      //   },
      //   {
      //     label: "自然风光",
      //     value: "自然风光",
      //   },
      //   {
      //     label: "世界遗产",
      //     value: "世界遗产",
      //   },
      //   {
      //     label: "儿童世界",
      //     value: "儿童世界",
      //   },
      //   {
      //     label: "自由行",
      //     value: "自由行",
      //   },
      //   {
      //     label: "民宿",
      //     value: "民宿",
      //   }
      // ],
      pca: pca,
      pcaa: pcaa,
      tableData: [],
      // tableData: [
      //   {
      //     name: "aaa",
      //     id:'11'
      //   },{
      //     name: "bbb",
      //     id:'22'
      //   }
      // ],
      total: 0,
      current: 1,
      pageSize: 5,
      multipleSelection: []
    };
  },
  // created() {
  //   //this.getList();
  //   this.getNetType()
  // },
  mounted () {
    // this.getList();
    // this.getNetType()
  },
  methods: {
    changeNetShow () {
      this.netShow = true;
    },
    async getList (params) {
      const result = await getNetList(params);
      this.tableData = result.index;
      this.total = result.totalCount;
      this.current = result.curPage;
      this.pageSize = result.pageSize;
    },
    async getNetType () {
      const result = await getNetType();
      return result;
    },
    // 搜索
    submit (formName) {
      this.$refs[formName].validate(valid => {
        console.log('搜索', this[formName]);
        if (valid) {
          const params = {
            ...this[formName]
          };
          // this.getList();
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
        type: '',
        name: ''
      };
    },
    // 获取id
    getIds () {
      // const item = this.multipleSelection.map(item => {
      //   return item;
      // });
      const item = this.multipleSelection[0];
      if (this.multipleSelection.length > 1) {
        this.$message('只能选择一个网点')
        return true
      }
      this.$emit('getIds', item);
      this.onCancel('addFrom');
    },
    handleSelectionChange (val) {
      console.log('表格多选', val);
      this.multipleSelection = val;
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList({
        pageIndex: this.current,
        pageSize: this.pageSize
      });
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getList({
        pageIndex: this.current,
        pageSize: this.pageSize
      });
    }
  },
  computed: {
    types: async function () {
      return this.getNetType();
    }
  },
  watch: {
    netShow: function (val) {
      if (val) {
        this.getList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

<style lang="scss" >
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
