<template>
  <div class="points_rule">
    <el-table
      class="table"
      ref="table"
      :data="tableData"
      stripe
    >
      <el-table-column type="selection" align="center" />
      <el-table-column prop="ruleName" label="规则名称" align="center" />
      <el-table-column
        prop="jifenType"
        :formatter="typeFilter"
        label="类型"
        align="center"
      />
      <el-table-column prop="ruleExplain" label="规则说明" align="center" />
      <el-table-column prop="jifenLimit" label="积分额度" align="center" />
      <el-table-column label="生效" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEffect"
            :active-value="1"
            :inactive-value="0"
            @change="updateJifenRule({ id: scope.row.id, isEffect: scope.row.isEffect })"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="edit(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <add-rule-popup :addRule.sync="addRule" :currentData="currentData" @findJifenRuleList='findJifenRuleList' />
  </div>
</template>

<script>
import AddRulePopup from '../AddRulePopup'
import MemberRuleAPI from '../../model'

const memberRuleAPI = new MemberRuleAPI()

export default {
  components: {
    AddRulePopup
  },

  data() {
    return {
      tableData: [],
      currentData: {},
      addRule: false
    }
  },

  mounted() {
    this.findJifenRuleList()
  },

  methods: {
    // 查询积分规则列表API
    findJifenRuleList() {
      memberRuleAPI.findJifenRuleList().then(res => {
        this.tableData = res
      })
    },

    /**
     * @description: 编辑积分规则API
     * @param {Int} id 主键id
     * @param {Int} isEffect 是否生效 0:无效; 1:有效
     */
    updateJifenRule({ id, isEffect }) {
      memberRuleAPI.updateJifenRule({ id, isEffect })
    },

    // 类型过滤器
    typeFilter(row, column, cellValue) {
      switch (cellValue) {
        case 0:
          return '积分消耗'
        case 1:
          return '积分获取'
      }
    },

    /**
     * @description: 编辑数据
     * @param {Object} data: 某一行规则的数据
     * @return:
     */
    edit(data) {
      this.currentData = data
      this.addRule = true
    },
  }
}
</script>
