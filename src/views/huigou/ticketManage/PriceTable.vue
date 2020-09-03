<template>
  <section>
    <div class="priceTable">
      <el-table :data="tableData"
                border=""
                style="width: 100%">
        <el-table-column prop="endTime"
                         label="有效期"
                         min-width="150">
          <template slot-scope="scope">
            <span>
              <el-date-picker v-model="scope.row.endTime"
                              type="date"
                              placeholder="选择日期"
                              style="width:135px"></el-date-picker>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="attributeIcon"
                         label="图片"
                         width="75">
          <template slot-scope="scope">
            <span>
              <img-include v-model="scope.row.attributeIcon"
                           :max="1"
                           :cropper="cropper"
                           :width="55" />
            </span>
            <!-- <el-image v-else
                      :src="scope.row.attributeIcon"
                      alt=""
                      :style="{ width: '55px', height: '55px' }" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="value"
                         label="规格名"
                         min-width="80">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.value"
                        placeholder="1-6字"
                        :maxlength="6"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="currentPrice"
                         label="现价"
                         min-width="50">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.currentPrice"
                        placeholder="单位元"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="originalPrice"
                         label="原价"
                         min-width="50">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.originalPrice"
                        placeholder="单位元"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="num"
                         label="总量"
                         min-width="50">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.num"
                        placeholder="单位元"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="dayNum"
                         label="每日限购"
                         min-width="70">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.dayNum"
                        placeholder="不填则无"></el-input>
            </span>

          </template>
        </el-table-column>
        <el-table-column prop="oneLimit"
                         label="每人限购"
                         min-width="70">
          <template slot-scope="scope">
            <span>
              <el-input v-model="scope.row.oneLimit"
                        placeholder="不填则无"></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="coder"
                         label="码商编码">
          <template slot-scope="scope">
            <span>
              <el-select v-model="scope.row.coder"
                         placeholder="请选择">
                <el-option v-for="item in coderOptions"
                           :key="item.codeId"
                           :label="item.codeName"
                           :value="item.codeId"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         min-width="65">
          <template slot-scope="scope">
            <i class="el-icon-error"
               style="font-size:20px;color:#F56C6C;margin-right:10px"
               @click="onDelete(scope.$index)"></i>
            <i class="el-icon-circle-plus-outline"
               style="font-size:20px;color:#409EFF;"
               @click="onAdd"></i>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script type='text/ecmascript-6'>
import ImgInclude from '@/components/CropImgInclue'
import settings from '@/settings'
// import SingleImage from '@/components/Upload/SingleImage'
import { ticket } from '@/api/mall/ticket'
export default {
  components: { ImgInclude },
  props: ['coderOptions', 'addEdit', 'id', 'editTableData'],
  data () {
    return {
      emptyObj: {
        attributeIcon: {},
        value: '',
        currentPrice: 0,
        originalPrice: 0,
        num: 0,
        dayNum: 0,
        oneLimit: 0,
        endTime: '',
        coder: '',
      },
      rowForm: {
        attributeIcon: {},
        value: '',
        currentPrice: 0,
        originalPrice: 0,
        num: 0,
        dayNum: 0,
        oneLimit: 0,
        endTime: '',
        coder: ''
      },
      tableData: [],
      cropper: [
        {
          name: '图片规格',
          ratio_x: 55,
          ratio_y: 55,
          ratio: 1,
          desc: '图片规格'
        },
      ],
    }
  },
  mounted () {
    if (this.addEdit === 'add') {
      this.tableData.unshift(this.emptyObj) // 第一次进入
    }
  },
  methods: {
    onAdd () {
      this.tableData.push({
        attributeIcon: {

        },
        value: '',
        currentPrice: 0,
        originalPrice: 0,
        num: 0,
        dayNum: 0,
        oneLimit: 0,
        endTime: '',
        coder: '',
      })
    },
    onDelete (index) {
      if (this.tableData.length === 1) {
        // 表示仅剩最后一条
        this.tableData = [{
          attributeIcon: {},
          value: '',
          currentPrice: 0,
          originalPrice: 0,
          num: 0,
          dayNum: 0,
          oneLimit: 0,
          endTime: '',
          coder: '',
        }]
      } else {
        this.tableData.splice(index, 1)
      }
    },
  },
  computed: {
  },
  watch: {
    editTableData: {
      handler (val) {
        if (val.length === 0) {
          this.tableData.unshift(this.emptyObj)
        } else {
          val.forEach((res) => {
            res.attributeIcon = {
              ratio1: [res.attributeIcon]
            }
          })
          console.log(val)
          this.tableData = JSON.parse(JSON.stringify(val))
        }
      }
    },
    tableData: {
      handler (newValue, oldValue) {
        this.$emit('getPriceTable', newValue)
      },
      deep: true
    }
  }
}
</script>

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
  .el-table .cell {
    padding: 0 5px !important;
    text-align: center;
  }
  .el-date-editor .el-input .el-input--medium .el-input--prefix .el-input--suffix .el-date-editor--date {
    width: 135px;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 10px;
  }
  .el-input__inner {
    padding: 0;
    text-align: center;
  }
  .avatar-uploader {
    border: 1px dashed #ccc;
    // width: 30px;
    height: 30px;
    line-height: 30px;
  }
}
</style>
