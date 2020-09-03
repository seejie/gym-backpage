<template>
  <div class="integral">
    <div class="header">
      <span>积累获得积分：{{ leijiJifen }}</span>
      <span>积累消耗积分：{{ leijiJifen - shengyuJifen }}</span>
      <div class="operating">
        <el-input
          v-model.number="num"
          class="input"
          type="number"
          size="mini"
          placeholder="输入积分"
        />
        <el-button size="mini" @click="updateMemeberJifen(num)">手动调整</el-button>
      </div>
    </div>
    <div class="table_box">
      <el-table class="table" :data="memberJifenList" border>
        <el-table-column prop="id" label="序号" align="center" />
        <el-table-column prop="ruleName" label="来源" align="center" />
        <el-table-column prop="jifenDescribe" label="项目" align="center" />
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column prop="jifenNum" label="积分变动" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { MemberSearchAPI } from '../../model'

const memberSearchAPI = new MemberSearchAPI()

export default {
  props: {
    memberJifenList: Array,
    leijiJifen: Number,
    shengyuJifen: Number,
  },

  data() {
    return {
      num: 1,
    }
  },

  methods: {
    /**
     * @description: 会员积分调整API
     * @param {Number} num 要调整的积分数量
     * @return:
     */
    updateMemeberJifen(num) {
      memberSearchAPI.updateMemeberJifen(num).then(res => {
        this.$emit('getMemberJifenlist')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.integral {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .input {
      margin-right: 10px;
      width: 100px;
    }
  }
  .table_box {
    margin-top: 6px;
    height: 300px;
    overflow-y: auto;
  }
}
</style>