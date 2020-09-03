<template>
  <el-card class="card">
    <el-form ref="form" :model="form" :rules="rules" label-width="95px" style="width: 80%;padding-top: 16px">
      <el-form-item label="图文标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="正文详情">
        <myEditor refs='name1' v-model="form.instructions"></myEditor>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import { customCourseList } from '@/api/customCourse/customCourse'
  import { Message } from 'element-ui'
  export default {
    name: "TeacherInstructions",
    data() {
      return {
        form:{
          title:'',
          instructions:''
        },
        rules: {
          title: [
            { required: true, message: '图文标题', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return false
          }
        });
        customCourseList.createUpdateCourseInstructions(this.form).then(res=>{
          if(res.resCode==200)
          {
            this.message("提交成功");
          }
          else {
            this.message("提交失败");
          }
        })
      },
      // 错误、成功提示
      message(message, type) {
        Message({
          message: message,
          type: type
        })
      }
    }
  }
</script>

<style scoped>

</style>
