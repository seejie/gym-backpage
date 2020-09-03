<template>
  <div class="group_popup">
    <el-dialog
      class="popup"
      title="移动分组"
      :visible="group"
      @close="closePopup"
    >
      <div class="content">
        <el-form
          class="form"
          ref="form"
          :model="form"
          label-width="80px"
        >
          <el-form-item class="form_item" label="选择分组:">
            <el-select
              v-model="form.groupId"
              class="input"
              size="medium"
              placeholder="请选择"
            >
              <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
            @click="confirm"
          >
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MemberGroupAPI } from '../../model'

const memberGroupAPI = new MemberGroupAPI()

export default {
  props: {
    group: Boolean,
    ids: String
  },

  data() {
    return {
      form: {
        groupId: '',
      },
      list: [],
      loading: false
    }
  },

  watch: {
    group(val) {
      if (val) {
        this.findGroupList()
      }
    }
  },

  methods: {
    // 查询会员分组列表API
    findGroupList() {
      memberGroupAPI.findGroupList().then(res => {
        this.list = res
      })
    },

    // 批量修改会员分组API
    /**
     * @description:
     * @param {String} ids: 会员id
     * @param {Int} groupId: 组id
     * @return:
     */
    modifyMemberGroup({ ids, groupId }) {
      this.loading = true
      memberGroupAPI.modifyMemberGroup({ ids, groupId }).then(res => {
        this.loading = false
        this.$emit('clearSelection')
        this.$emit('findGroupList')
        this.closePopup()
      }).catch(() => {
        this.loading = false
      })
    },

    // 关闭弹框
    closePopup() {
      this.form.groupId = ''
      this.$emit('update:group', false)
    },

    // 提交表单
    confirm() {
      if (!this.form.groupId) {
        this.$message({
          message: '请选择分组！',
          type: 'warning'
        })
      } else {
        this.modifyMemberGroup({ ids: this.ids, groupId: this.form.groupId })
      }
    },
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