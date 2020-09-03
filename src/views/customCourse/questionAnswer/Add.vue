<template>
  <el-card class="card">
    <el-form ref="form" :model="form" :rules="rules" label-width="95px" style="width: 80%;padding-top: 16px">
      <el-form-item label="图文标题" prop="qaTitle">
        <el-input v-model="form.qaTitle"></el-input>
      </el-form-item>
      <el-form-item label="图文摘要">
        <el-input type="textarea" v-model="form.qaSummary"></el-input>
      </el-form-item>
      <el-form-item label="正文详情">
        <myEditor refs='name1' v-model="form.qaContent"></myEditor>
      </el-form-item>
      <el-form-item label="图文封面" prop="coverUrl">
        <img-include v-model="imgs"  :cropper="cropper"></img-include>
      </el-form-item>
      <el-form-item label="类型" prop="categoryId">
        <el-row>
          <el-select v-model="form.categoryId" placeholder="请选择类型">
            <el-option :label="item.categoryName" v-for="(item,index) in dialog.categoryData" :key="index" :value="item.id"></el-option>
          </el-select>
        </el-row>
       <el-row>
         <el-button style="margin-top: 20px;" @click="dialog.outerVisible = true">类型管理</el-button>
       </el-row>

      </el-form-item>
      <el-form-item label="三方链接">
        <el-input v-model="form.linkUrl"></el-input>
      </el-form-item>

      <div class="foot">发布设置</div>
      <el-form-item  label="发布位置" prop="courseSort">
        <el-select placeholder="请选择" v-model="form.courseSort">
          <el-option label="置顶" :value="1"></el-option>
          <el-option label="默认" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="发布时间" prop="releaseType">
        <el-row>
          <el-radio v-model="form.releaseType" :label="1">立即发布</el-radio>
        </el-row>
        <el-row>
          <el-radio v-model="form.releaseType" :label="2">草稿，暂不发布</el-radio>
        </el-row>
        <el-row>
          <el-col><el-radio v-model="form.releaseType"  :label="3">定时发布</el-radio></el-col>
          <el-col>
            <el-date-picker placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss"   v-model="form.releaseTime"  type="datetime"></el-date-picker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="栏目类型管理" :visible.sync="dialog.outerVisible" width="40%">
      <el-button type="primary" @click="dialog.innerVisible = true">添加</el-button>
      <el-table :data="dialog.categoryData" tooltip-effect="dark"
                style="width: 100%"
                ref="multipleTable"
                >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column property="categoryName" label="类型"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="info" style="color: #333" icon="el-icon-edit" @click="editbtn(scope.row)"></el-button>
            <el-button type="info" style="color: #333" icon="el-icon-delete" @click="delbtn(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save_category(false)">关 闭</el-button>
        <el-button @click="save_category(true)">保 存</el-button>
      </div>

      <el-dialog width="40%" title="添加类型" :close-on-click-modal="false" :close-on-press-escape="false"
                 :visible.sync="dialog.innerVisible" @close="handDialogClose()" append-to-body>
        <el-form :model="dialog.form_category">
          <el-form-item label="类型名称" >
            <el-input v-model="dialog.form_category.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click=submit__category>确 定</el-button>
          <el-button @click="dialog.innerVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import ImgInclude from '@/components/CropImgInclue/index.vue'
import { QACategory, QA } from '@/api/customCourse/customCourse'

export default {
  data() {
    return {
      form: {
        id: this.$route.params.id,
        qaContent: '',
        coverUrl: '',
        linkUrl: '',
        createTime: '',
        categoryId: '',
        releaseType: 1,
        qaSummary: '',
        qaTitle: '',
        courseSort: 0,
        status: 0,
        releaseTime: '',
        readCount: '0'
      },
      imgs: {},
      dialog: { outerVisible: false, innerVisible: false, categoryData: [], form_category: { name: '', id: '' } },
      rules: {
        qaTitle: [
          { required: true, message: '图文标题', trigger: 'blur' },
        ],
        coverUrl: [
          { required: true, message: '请选择封面', trigger: 'blur' },
        ],
        categoryId: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        courseSort: [
          { required: true, message: '请选择发布位置', trigger: 'blur' },
        ],
        releaseType: [
          { required: true, message: '请选择发布时间', trigger: 'blur' },
        ],
      },
      cropper: [{
        name: '封面',
        ratio_x: 280,
        ratio_y: 148,
        ratio: 1.89,
        desc: ''
      }],
    }
  },
  components: {
    ImgInclude
  },
  mounted() {
    this.load()
    this.loadcategory()
  },
  methods: {
    load() {
      if (this.form.id > 0) {
        QA.getone({ id: this.form.id }).then(res => {
          if (res.resCode == 200) {
            var data = res.resObject
            this.form.qaContent = data.content
            this.imgs = { 'ratio1.89': [data.coverUrl] }
            this.form.coverUrl = this.imgs['ratio1.89'][0]
            this.form.linkUrl = data.linkUrl
            this.form.categoryId = data.categoryId
            this.form.releaseType = data.releaseType
            this.form.qaSummary = data.qaSummary
            this.form.qaTitle = data.qaTitle
            this.form.courseSort = data.courseSort
            this.form.status = data.status
            this.form.releaseTime = data.releaseTime
            this.form.readCount = data.readCount
          }
        })
      }
    },
    loadcategory() {
      QACategory.load({ pageSize: 100 }).then(res => {
        if (res.resCode == 200) {
          this.dialog.categoryData = res.resObject.list!=null?res.resObject.list.filter(f=>f.status==1):[]
        }
      })
    },
    onSubmit() {
      this.form.coverUrl = this.imgs != null && this.imgs['ratio1.89'] != null ? this.imgs['ratio1.89'][0] : ''
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        var url = this.form.id > 0 ? QA.update(this.form) : QA.add(this.form)
        url.then(res => {
          if (res.resCode == 200) {
            this.message('提交成功')
            this.$router.push('/customcourse/questionAnswer')
          }
        })
      })
    },
    setCover(url) {
      console.log(url)
    },
    handleAvatarSuccess(res, file) {
      this.form.courseCover = URL.createObjectURL(file.raw)
    },

    save_category(val) {
      if (!val) {
        this.catelist = []
        this.$refs.multipleTable.clearSelection()
      }
      this.dialog.outerVisible = false
    },
    // 关闭对话框触发
    handDialogClose() {
      this.dialog.form_category = {
        name: '',
        id: ''
      }
    },
    // 添加分类
    submit__category() {
      const url = this.dialog.form_category.id ? QACategory.update({ id: this.dialog.form_category.id, categoryName: this.dialog.form_category.name }) : QACategory.add({ id: 0, categoryName: this.dialog.form_category.name })
      if (!this.dialog.form_category.name) {
        return
      }

      url.then(res => {
        if (res.resCode == 200) {
          this.dialog.innerVisible = false
          this.loadcategory()
          this.message('成功', 'success')
        } else {
          this.message(res.message, 'error')
        }
      })
        .catch(err => console.log(err))
    },
    // 编辑分类
    editbtn(val) {
      this.dialog.form_category.id = val.id
      this.dialog.form_category.name = val.categoryName
      this.dialog.innerVisible = true
    },
    // 删除分类
    delbtn(val) {
      var ids = []
      ids.push(val.id)
      this.$confirm('确认删除分类？')
        .then(_ => {
          QACategory.delete({ ids: ids }).then(res => {
            if (res.resCode == 200) {
              this.loadcategory()
              this.message('成功', 'success')
            } else {
              this.message(res.message, 'error')
            }
          })
            .catch(err => console.log(err))
        })
        .catch(_ => {
          this.message('已取消删除', 'info')
        })
    },
    message(message, type) {
      Message({
        message: message,
        type: type
      })
    }
  },

}
</script>

<style scoped>
  .card{margin: 10px}

  .foot{
    padding: 10px 0 20px 0;
  }
</style>
