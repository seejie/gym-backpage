<template>
  <section>
    <div class="priceTable">
      <el-table :data="tableData" border="" style="width: 100%">
        <el-table-column prop="attributeIcon" label="图片">
          <template slot-scope="scope">
            <template v-if="scope.row.attributeIcon">
              <img :src="scope.row.attributeIcon" style="width: 55px" />
              <div @click="clickImage(scope.$index)" class="upload-include">
                <img-include
                  :width="55"
                  v-model="scope.row.pic"
                  @input="handleImgChange(scope.$index)"
                  :max="1"
                  :cropper="cropper"
                />
              </div>
            </template>
            <template v-else>
              <div @click="clickImage(scope.$index)">
                <img-include
                  :width="55"
                  v-model="scope.row.pic"
                  @input="handleImgChange(scope.$index)"
                  :max="1"
                  :cropper="cropper"
                />
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="种类">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" placeholder="1-6字" :maxlength="6"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="模式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.saleMode">
              <el-option :value="1" label="标准"></el-option>
              <el-option :value="0" label="积分购"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="currentPrice" label="现价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.currentPrice" placeholder="单位元"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="jifenPrice" label="积分兑换">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jifenPrice" placeholder="积分数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="originalPrice" label="原价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.originalPrice" placeholder="单位元"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="costPrice" label="成本价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.costPrice" placeholder="单位元"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="重量(g)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.qty" placeholder="单位g"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="总量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" placeholder="不填则无限"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="dayNum" label="日限额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dayNum" placeholder="不填则无限"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="oneLimit" label="每人限购">
          <template slot-scope="scope">
            <el-input v-model="scope.row.oneLimit" placeholder="不填则无限"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <i
              class="el-icon-error"
              style="font-size:24px;margin-right:10px;color:#f40"
              @click="onDelete(scope.$index)"
            ></i>
            <i class="el-icon-circle-plus-outline" style="font-size:24px;color:#409EFF" @click="onAdd"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script type="text/ecmascript-6">
import settings from "@/settings";
import ImgInclude from "@/components/CropImgInclue";
import _ from 'lodash'
export default {
  components: { ImgInclude },
  props: ["addEdit", "id", "attributeValueList"],
  data () {
    return {
      emptyObj: {
        attributeIcon: "",
        value: "",
        currentPrice: '',
        originalPrice: '',
        costPrice: '',
        qty: '',
        num: '',
        dayNum: '',
        saleMode: '',
        oneLimit: '',
        isEdit: true
      },
      rowForm: {
        attributeIcon: "",
        value: "",
        currentPrice: '',
        originalPrice: '',
        costPrice: '',
        qty: '',
        num: '',
        saleMode: '',
        dayNum: '',
        oneLimit: ''
      },
      tableData: [],
      data: {
        token: ""
      },

      cropper: [
        {
          name: "图片规格",
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          desc: "图片规格"
        }
      ],

      attributeIcon: {
        ratio1: []
      },

      row_index: ''
    };
  },

  watch: {
    attributeValueList: {
      handler(value) {
        this.tableData = _.cloneDeep(value)
        this.tableData.forEach(v => {
          v.pic = { ratio1: [ v.attributeIcon ] }
        })
        this.$emit("getPriceTable", this.tableData);
      },
      deep: true,
      immediate: true,
    },
  },

  mounted () {
    if (this.addEdit == "add") {
      this.tableData.unshift(Object.assign({}, this.emptyObj)); //第一次进入
    }
  },

  methods: {
    handleImgChange(index) {
      this.tableData[index].attributeIcon = this.tableData[index].pic.ratio1[0]
      this.$emit("getPriceTable", this.tableData);
    },
    clickImage (index) {
      this.row_index = index
    },

    onAdd () {
      this.attributeIcon = { ratio1: [] }
      this.tableData.push(Object.assign({}, this.tableData[this.tableData.length -1]));

      this.$emit("getPriceTable", this.tableData);
    },

    onDelete (index) {
      if (this.tableData.length === 1) {
        //表示仅剩最后一条
        this.tableData.splice(index, 1);
        this.tableData.unshift(Object.assign({}, this.emptyObj));
        this.$emit("getPriceTable", []);
      } else {
        this.tableData.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="scss" scpoed>
.upload-include {
  opacity: 0;
  width: 62px;
  position: absolute;
  left: 10px;
  top: 0;
}
</style>
<style lang="scss">
.priceTable {
  .el-upload--picture-card {
    height: 50px;
    width: 50px;
    line-height: 50px;
  }
  .el-input-number--medium {
    width: 120px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 150px;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    // padding-left: 0;
  }
  .el-input__inner {
    padding: 0;
    text-align: center;
  }
  .avatar-uploader {
    // border: 1px dashed #ccc;
    // width: 30px;
    height: 50px;
    line-height: 50px;
  }
}
</style>
