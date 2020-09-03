<template>
  <el-form-item label="审核模式" prop="audit_model">
    <el-radio-group v-model="channelData.audit_model">
      <el-radio :label="1">先发后审</el-radio>
      <el-radio :label="2">先审后发</el-radio>
    </el-radio-group>
    <div class="channel-text-desc">默认先发后审，先审后发是指户发布完需后台审核通过方能显示</div>
  </el-form-item>
</template>
<script>
  export default {
    props: ['channelData']
  }
</script>
