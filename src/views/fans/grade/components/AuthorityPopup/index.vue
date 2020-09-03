<template>
  <div class="group_popup">
    <el-dialog
      class="popup"
      title="权限设置"
      :visible="authorityShow"
      @close="closePopup"
    >
      <div class="content">
        <el-form
          class="form"
          ref="form"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="用户等级">
            <el-input v-model.trim="currentData.levelName" disabled />
          </el-form-item>
          <el-form-item label="权限设置">
            <div class="authority">
              <el-form-item
                v-for="item in channelList"
                :key="item.id"
                :label="`${item.channelName}频道`"
                label-width="130px"
              >
                <el-checkbox v-model="item.isBrowse" :true-label="1" :false-label="0">浏览</el-checkbox>
                <el-checkbox v-model="item.isOperate" :true-label="1" :false-label="0">操作</el-checkbox>
              </el-form-item>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="foot">
        <div class="button_box">
          <el-button class="button" size="small" @click="closePopup">取消</el-button>
          <el-button
            class="button"
            type="primary"
            size="small"
            :loading="loading"
            @click="submitPopup"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MemberGradeAPI from '../../model'

const memberGradeAPI = new MemberGradeAPI()

export default {
  props: {
    authorityShow: Boolean,
    currentData: Object,
    channelList: Array
  },

  data() {
    return {
      form: {
        information: [],
        map: 'browse',
        raiders: 'browse',
        shopping: 'browse',
      },
      loading: false
    }
  },

  methods: {
    /**
     * @description: 设置等级权限API
     * @param {Array} data: 会员等级权限列表
     * @return:
     */
    setLevelRule(data) {
      this.loading = true
      memberGradeAPI.setLevelRule(data).then(res => {
        this.loading = false
        this.closePopup()
      }).catch(() => {
        this.loading = false
      })
    },

    // 提交表单
    submitPopup() {
      const list = this.channelList.map(item => ({
        channelId: item.id,
        isBrowse: item.isBrowse,
        isOperate: item.isOperate,
        levelId: this.currentData.id,
        unitId: this.currentData.unitId
      }))
      this.setLevelRule(list)
    },

    // 关闭弹框
    closePopup() {
      this.$emit('update:authorityShow', false)
    }
  },
}
</script>

<style lang="scss" scoped>
.group_popup {
  .popup {
    .content {
      display: flex;
      justify-content: center;
      .form {
        width: 400px;
        .authority {
          height: 400px;
          overflow-y: auto;
        }
      }
    }

    .foot {
      .button_box {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>