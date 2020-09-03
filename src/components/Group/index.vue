<template>
  <div class="group">
    <div class="header">
      <span>全部分组</span>
      <span>[{{ total }}]</span>
      <i class="button el-icon-circle-plus-outline" @click="add"/>
    </div>
    <div class="content">
      <v-tag
        v-for="item in list"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :memberNum="item.memberNum"
        :currentTag.sync="currentTag"
        @edit="edit"
        @deleteGroup="deleteGroup"
      />
    </div>
  </div>
</template>

<script>
import Tag from './tag'

/**
 * @description: 事件
 * @param findGroupList: 查询分组列表
 * @param deleteGroup: 删除分组
 */
export default {
  props: {
    list: Array, // 分组列表
    createGroup: Function, // 创建会员分组API
    updateGroup: Function, // 编辑会员分组API
  },

  components: {
    'v-tag': Tag
  },

  data() {
    return {
      currentTag: null,
    }
  },

  computed: {
    // 计算分组总人数
    total() {
      if (this.list && this.list.length > 0) {
        return this.list.reduce((prev, cur) => prev + cur.memberNum, 0)
      }
    }
  },

  methods: {
    // 添加分组
    add() {
      this.$prompt('添加分组', '添加分组', {
        inputPlaceholder: '请填写分组名称，5个字内',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: '',
        inputValidator: val => val.length <= 5,
        inputErrorMessage: '不能超过5个字！',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (instance.inputValue) {
              instance.confirmButtonLoading = true
              this.createGroup(instance.inputValue).then(() => {
                instance.confirmButtonLoading = false
                done()
                this.$emit('findGroupList')
              })
            } else {
              this.$message({
                type: 'warning',
                message: '内容不能为空！'
              })
            }
          } else {
            done()
          }
        }
      }).catch(() => {})
    },

    /**
     * @description: 编辑数组
     * @param {Int} id: 会员分组ID
     * @param {String} name: 分组名称
     * @return:
     */
    edit(id, name) {
      this.$prompt('分组名称', '编辑数组', {
        inputPlaceholder: '请填写分组名称，5个字内',
        inputValue: name,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: val => val.length <= 5,
        inputErrorMessage: '不能超过5个字！',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (instance.inputValue) {
              instance.confirmButtonLoading = true
              this.updateGroup(id, instance.inputValue).then(() => {
                instance.confirmButtonLoading = false
                done()
                this.$emit('findGroupList')
              })
            } else {
              this.$message({
                type: 'warning',
                message: '内容不能为空！'
              })
            }
          } else {
            done()
          }
        }
      }).catch(() => {})
    },

    /**
     * @description: 删除数组
     * @param {Int} id 会员分组ID
     * @return:
     */
    deleteGroup(id) {
      this.$emit('deleteGroup', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.group {
  position: absolute;
  right: 0;
  padding: 10px;
  width: 140px;
  height: 100%;
  border: 1px solid rgb(215, 215, 215);
  background: #fff;
  overflow-y: auto;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .button {
      padding: 2px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
}
</style>
