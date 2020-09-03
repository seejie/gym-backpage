<template>
  <div>
    <el-tag class="group_item" :type="id === currentTag ? '' : 'info'" @click="current(id)">
      <div class="text">
        <span>{{ name }}</span>
        <span class="num">{{ `[ ${memberNum} ]` }}</span>
      </div>
      <div class="icon" v-if="currentTag === id">
        <i class="button el-icon-edit" @click="edit(id, name)"/>
        <el-popconfirm title="确定删除吗？" @onConfirm="deleteGroup(id)">
          <i class="button el-icon-delete" slot="reference"/>
        </el-popconfirm>
      </div>
    </el-tag>
  </div>
</template>

<script>
export default {
  props: {
    id: Number, // 分组ID
    name: String, // 分组名称
    memberNum: Number, // 分组人数
    currentTag: Number // 当前选择的分组ID
  },


  methods: {
    /**
     * @description: 向父组件传递选中事件
     * @param {Int} id 当前选择分组的ID
     * @return:
     */
    current(id) {
      this.$emit('update:currentTag', id)
    },

    /**
     * @description: 向父组件传递编辑事件
     * @param {Int} id  当前选择分组的ID
     * @param {String} name 当前分组名称
     * @return:
     */
    edit(id, name) {
      this.$emit('edit', id, name)
    },

    /**
     * @description: 向父组件传递删除事件
     * @param {Int} id 当前选择分组的ID
     * @return:
     */
    deleteGroup(id) {
      this.$emit('deleteGroup', id)
    },
  }
}
</script>

<style lang="scss" scoped>
.group_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  .text {
    .num {
      margin-left: 5px;
    }
  }
  .icon {
    .button {
      padding: 2px;
      cursor: pointer;
    }
  }
}
</style>