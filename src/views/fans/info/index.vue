<template>
  <div class="user_required">
    <el-card class="box-card">
      <div class="header">
        <span class="title">
          <span class="font_red">*</span>
          用户信息设置
        </span>
        <div class="add_btn" @click="add">
          <span class="text">添加字段</span>
        </div>
      </div>
      <div class="content">
        <el-form class="form_inline" label-width="0">
          <draggable
            class="list_group"
            :list="formInline"
            ghost-class="ghost"
            @start="dragging = true"
            @end="dragging = false"
          >
            <el-form-item v-for="(item,index) in formInline" :key="index">
              <template>
                <div class="list_group_item">
                  <el-select v-model="item.columnName" class="field_select" placeholder="请选择" :disabled="item.disabled">
                    <el-option
                      v-for="options in columnNameList"
                      :key="options"
                      :label="options"
                      :value="options"
                    />
                </el-select>
                  <el-input
                    v-model.trim="item.name"
                    class="input"
                    placeholder="请输入名称，30字以内"
                    maxlength="30"
                  />
                  <el-select v-model="item.type" class="select" placeholder="请选择" :disabled="item.disabled">
                    <el-option
                      v-for="options in optionsList"
                      :key="options.id"
                      :label="options.name"
                      :value="options.id"
                    />
                  </el-select>
                  <el-checkbox
                    v-model="item.isNotNull"
                    class="checkbox"
                    :false-label="0"
                    :true-label="1"
                  >
                    必填
                  </el-checkbox
                  >
                  <el-popconfirm title="确定删除吗？" @onConfirm="deleteItem(index)">
                    <el-button
                      class="icon"
                      type="info"
                      icon="el-icon-delete"
                      circle
                      slot="reference"
                    />
                  </el-popconfirm>
                  <el-button
                    v-if="item.type === 2 || item.type === 3"
                    class="icon"
                    type="info"
                    icon="el-icon-plus"
                    circle
                    @click="addOption(index)"
                  />
                </div>
                <el-row v-if="item.type === 2 || item.type === 3">
                  <el-row v-for="(optionItem, optionIndex) in item.option" :key="optionIndex" class="option">
                    <div>选项{{ optionIndex + 1 }}</div>
                    <el-input
                      v-model.trim="optionItem.value"
                      class="input"
                      placeholder="请输入名称，30字以内"
                      maxlength="30"
                      @input="change($event)"
                    />
                    <el-popconfirm title="确定删除吗？" @onConfirm="deleteOption(index, optionIndex)">
                    <el-button
                      class="icon"
                      type="info"
                      icon="el-icon-delete"
                      circle
                      slot="reference"
                    />
                  </el-popconfirm>
                  </el-row>
                </el-row>
              </template>
            </el-form-item>
          </draggable>
        </el-form>
      </div>
      <div class="buttons">
        <el-button type="primary" :loading="loading" @click="submit">提交</el-button>
        <el-button @click="findColumnList">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import MemberInfolAPI from './model'

const memberInfolAPI = new MemberInfolAPI()

export default {
  name: 'simple',
  display: 'Simple',
  order: 0,

  components: {
    draggable
  },

  data() {
    return {
      formInline: [],
      dragging: false,
      options: [],
      columnNameList: [],
      loading: false,
      optionsList: [{
        id: 1,
        name: '文本'
      }, {
        id: 2,
        name: '单选'
      }, {
        id: 3,
        name: '多选'
      }, {
        id: 4,
        name: '时间选择'
      }, {
        id: 5,
        name: '手机'
      }, {
        id: 6,
        name: '图片'
      }, {
        id: 7,
        name: '附件'
      }, {
        id: 8,
        name: '邮箱'
      }, {
        id: 9,
        name: '密码'
      }]
    }
  },

  mounted() {
    this.findColumnList()
    this.findMemberColumn()
  },

  methods: {
    change(e) {
      this.$forceUpdate()
    },

    addOption(index) {
      this.formInline = this.formInline.map((item, itemIndex) => {
        if (itemIndex === index) {
          item.option = item.option || []
          const index = item.option.length++ || 0
          item.option[index] = {
            key: index,
            value: ''
          }
        }
        return item
      })
    },

    deleteOption(itemIndex, optionIndex) {
      this.formInline = this.formInline.map((item, index) => {
        if (itemIndex === index) {
          item.option.splice(optionIndex, 1)
        }
        return item
      })
    },

    // 查询会员信息设置列表API
    findColumnList() {
      memberInfolAPI.findColumnList().then(res => {

      })
    },

    // 查询可以设置的会员信息API
    findMemberColumn() {
      memberInfolAPI.findMemberColumn().then(res => {
        this.formInline = res.map(item => {
          item.option = (new Function('return ' + item.option))()
          this.columnNameList.push(item.columnName)
          if (item.type) item.disabled = true
          return item
        })
      })
    },

    /**
     * @description: 保存会员信息设置
     * @param {Array} data: 会员信息设置数据
     * @return:
     */
    saveMemberColumn(data) {
      this.loading = true
      memberInfolAPI.saveMemberColumn(data).then(res => {
        this.loading = false
        this.findMemberColumn()
      }).catch(() => {
        this.loading = false
        this.findMemberColumn()
      })
    },

    // 删除字段
    deleteItem(index) {
      this.formInline.splice(index, 1)
    },

    // 添加字段
    add() {
      this.formInline.push({
        name: null,
        columnName: null,
        isNotNull: 0,
        type: null,
        disabled: false
      })
    },

    // 提交表单
    submit() {
      let isPass = true
      const list = this.formInline.map((item, index) => {
        if (item.option) {
          for (let i = 0; i < item.option.length; i++) {
            if (!item.option[i].value) {
              isPass = false
              this.$message({
                message: '请输入内容！',
                type: 'warning'
              })
              break
            }
          }
        }
        if (!item.name || !item.columnName) {
          isPass = false
          this.$message({
            message: '请输入内容！',
            type: 'warning'
          })
        }
        return {
          ...item,
          sort: index,
          option: item.option ? JSON.stringify(item.option) : '',
        }
      })
      if (!isPass) return
      this.saveMemberColumn(list)
    },
  }
}
</script>

<style lang="scss" scoped>
.user_required {
  padding: 20px;
  padding-bottom: 0;
  height: calc(100vh - 100px);
  overflow: auto;
  .header {
    display: flex;
    .title {
      margin-right: 60px;
      font-size: 18px;
      .font_red {
        color: red;
      }
    }
    .add_btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120px;
      height: 30px;
      font-size: 14px;
      color: #333;
      border: 1px solid rgb(102, 102, 102);
      border-radius: 4px;
      user-select: none;
      cursor: pointer;
      .text {
        line-height: 14px;
      }
    }
  }
  .content {
    margin-top: 20px;
    height: 520px;
    overflow-y: auto;
    .list_group {
      cursor: move;
      .ghost {
        opacity: 0.5;
        background: #c8ebfb;
      }
      .list_group_item {
        display: flex;
        align-items: center;
        .field_select {
          width: 150px;
        }
        .name {
          display: inline-block;
          width: 56px;
          font-size: 14px;
          color: #666666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .input {
          margin-left: 30px;
          width: 400px;
        }
        .select {
          margin-left: 30px;
          width: 150px;
        }
        .checkbox {
          margin-left: 30px;
        }
        .icon {
          margin-left: 30px;
        }
      }
      .option {
        display: flex;
        margin-top: 12px;
        margin-left: 182px;

        .input {
          margin-left: 20px;
          width: 344px;
        }

        .icon {
          margin-left: 30px;
        }
      }
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
  }
}
</style>
