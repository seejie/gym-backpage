
<template>
  <div class="ticket-brand">

    <el-card>
      <!-- 表单 -->
      <div class="form-wrap">
        <el-form :inline="true"
                 :model="lableFrom"
                 class="demo-form-inline">
          <el-form-item>
            <el-input placeholder="请输入品牌"
                      v-model="lableFrom.input"
                      class="input-with-select">
              <el-button slot="append"
                         @click="search"
                         icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button type="primary"
                       @click="add">添加</el-button>
            <el-button type="danger"
                       @click="delRows">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div class="table-wrap">
        <myTable hasSelection
                 hasIndex
                 :data="tableData"
                 :columns="columns"
                 @changeSort='changeSort'
                 @commitSelection="commitSelection">
        </myTable>

      </div>
    </el-card>
    <!-- 编辑框 -->
    <el-dialog title="编辑码商"
               :visible.sync="editShow">
      <el-form :model="editForm"
               ref="editForm"
               :rules="rules">
        <el-form-item label="品牌名称"
                      label-width="100"
                      prop="brandName">
          <el-input v-model="editForm.brandName"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌别名"
                      label-width="100"
                      prop="brandNickname">
          <el-input v-model="editForm.brandNickname"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO"
                      label-width="100"
                      prop="brandLogo">
          <!-- <el-input v-model="addForm.brandLogo" placeholder="请输入" autocomplete="off"></el-input> -->
          <!-- <myUpload type="1:1" v-model="addForm.brandLogo" :max= 1></myUpload> -->
          <img-include v-model="editForm.brandLogo"
                       :max="1"
                       :cropper="cropper"></img-include>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加框 -->
    <el-dialog title="添加标签"
               :visible.sync="addShow">
      <el-form :model="addForm"
               ref="addForm"
               :rules="rules">
        <el-form-item label="品牌名称"
                      label-width="100"
                      prop="brandName">
          <el-input v-model="addForm.brandName"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌别名"
                      label-width="100"
                      prop="brandNickname">
          <el-input v-model="addForm.brandNickname"
                    placeholder="请输入"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO"
                      label-width="100"
                      prop="brandLogo">
          <!-- <el-input v-model="addForm.brandLogo" placeholder="请输入" autocomplete="off"></el-input> -->
          <!-- <myUpload type="1:1" v-model="addForm.brandLogo" :max= 1></myUpload> -->
          <img-include v-model="addForm.brandLogo"
                       :max="1"
                       :cropper="cropper"></img-include>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmAdd('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ImgInclude from '@/components/CropImgInclue'
import Qs from 'qs'
import * as http from '@/api/huigou/hotel/brand.js'
export default {
  data () {
    return {
      tableData: [

      ],
      columns: [
        {
          label: '品牌LOGO',
          prop: 'brandLogo',
          type: 'img'
        },
        {
          label: '品牌名称',
          prop: 'brandName',
        },
        {
          label: '品牌别名',
          prop: 'brandNickname',
        },
        {
          label: '品牌排序',
          prop: 'brandSort',
          type: 'sort'
        },
        {
          label: '操作',
          operateData: [
            {
              btn: '编辑',
              cb: this.edit
            },
            {
              btn: '删除',
              cb: this.del
            },
          ]
        },
      ],
      lableFrom: {
        input: ''// 搜索条件
      },
      editForm: {
        brandLogo: {}, // 品牌logo
        brandName: '', // 品牌名称
        brandNickname: '', // 品牌别名
        brandId: '',
      },
      rules: {
        // supplyCompany: [
        //   { required: true, message: '请输入品牌', trigger: 'blur' },

        // ],
        // codeName: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ],
        // account: [
        //   { required: true, message: '请输入账号', trigger: 'blur' }
        // ],
        // companyCode: [
        //   { required: true, message: '请输入企业码', trigger: 'blur' }
        // ],
      },
      cropper: [
        {
          name: '品类图标',
          ratio_x: 1,
          ratio_y: 1,
          ratio: 1,
          // desc: "你的用户将在门票详情页各类别票种、惠购查看更多景点门票列表，看到此封面"
        },
      ],
      addForm: {
        brandLogo: {}, // 品牌logo
        brandName: '', // 品牌名称
        brandNickname: '', // 品牌别名
      },
      addShow: false, // 添加标签
      editShow: false, // 编辑标签
      chooseItem: []
    }
  },
  components: { ImgInclude },
  mounted () {
    this.getTabelList()
  },
  methods: {
    commitSelection (val) {
      this.chooseItem = val
    },
    // 排序输入
    changeSort (num, row) {
      http.editLabel({
        brandSort: num,
        brandId: row.brandId,
      }).then((res) => {
        if (res.resCode === 200) {
          this.$message.success('修改成功')
          this.editShow = false
          this.getTabelList()
        } else {
          this.$message.error('修改失败')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    edit (row) {
      // console.log(row)
      this.editForm = Object.assign({}, {
        brandName: row.brandName,
        brandNickname: row.brandNickname,
        brandLogo: row.brandLogo && { ratio1: row.brandLogo.split(',') },
        brandId: row.brandId
      })
      this.editShow = true
    },
    // 添加数据
    add () {
      this.addForm = {
        brandLogo: { ratio1: [] }, // 品牌logo
        brandName: '', // 品牌名称
        brandNickname: '', // 品牌别名
      }
      this.addShow = true
    },
    // 添加确定
    confirmAdd () {
      console.log(this.addForm)
      http.addBrand({

        brandName: this.addForm.brandName,
        brandNickname: this.addForm.brandNickname,
        brandLogo: this.addForm.brandLogo.ratio1 === undefined ? '' : this.addForm.brandLogo.ratio1.join(','),

      }).then((res) => {
        if (res.resCode === 200) {
          this.addShow = false
          this.$message.success('添加成功')
          this.getTabelList()
        } else {
          this.$message.error(res.resultDesc)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('添加失败')
      })
    },
    // 编辑确定
    confirmEdit () {
      this.editRow(this.editForm)
    },
    // 单行删除数据
    del (row) {
      this.$confirm('确定删除该数据？', '删除信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.delRow(row.brandId)
      }).catch(action => {
        console.log('取消')
      })
    },
    // 单行删除数据 走后台接口
    delRow (id) {
      http.deletLabel({
        idsArr: id
      }).then((res) => {
        if (res.resCode === 200) {
          this.$message.success('删除成功')
          this.getTabelList()
        } else {
          this.$message.error('删除失败')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 多选删除
    delRows () {
      if (this.chooseItem.length === 0) {
        this.$message.error('请选择要删除的数据')
      } else {
        this.$confirm('确定删除该数据？', '删除信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          http.deletLabel({
            idsArr: this.chooseItem.map(item => item.brandId).join(',')
          }).then((res) => {
            if (res.resCode === 200) {
              this.$message.success('删除成功')
              this.getTabelList()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(action => {
          console.log('取消')
        })
      }
    },
    getTabelList (keyWord = this.lableFrom.input) {
      http.getTabelList({
        brandName: this.lableFrom.input === '' ? null : this.lableFrom.input,
        sortStr: 'brand_sort asc'
      }).then((res) => {
        this.tableData = res.resObject
      }).catch((err) => {
        console.log(err)
      })
    },
    // 搜索
    search () {
      this.getTabelList()
    },
    // 编辑标签
    editRow (data) {
      // this.$ajax.post('/huigou/active/tag/updatetag', data)
      http.editLabel({
        brandName: this.editForm.brandName,
        brandNickname: this.editForm.brandNickname,
        brandId: this.editForm.brandId,
        brandLogo: this.editForm.brandLogo.ratio1 === undefined ? '' : this.editForm.brandLogo.ratio1.join(','),
      }).then((res) => {
        if (res.resCode === 200) {
          this.$message.success('修改成功')
          this.editShow = false
          this.getTabelList()
        } else {
          this.$message.error('修改失败')
        }
      }).catch((err) => {
        console.log(err)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.ticket-brand {
  height: auto;
  width: 100%;
  .from-wrap {
    width: 100%;
    // height: 60px;
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 20px;
    padding-bottom: 0;
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>