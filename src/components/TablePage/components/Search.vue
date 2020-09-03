<template>
    <el-input v-bind="item" placeholder="输入关键字" style="width:154px;" v-model="model" v-on="item.on" @keyup.enter.native="searchClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="searchClick"></i>
    </el-input>
</template>
<script>
import model from '../mixins/model'
export default {
    name: 't-search',
    props: {
        item: {
            type: Object,
            default() {
                return {
                    placeholder: '输入关键字'
                }
            }
        }
    },
    mixins: [model],
    methods: {
        searchClick() {
            if (this.item.on && this.item.on.search) {
                this.item.on.search();
            }
        }
    }
}
</script>
<style lang="scss" scoped>

</style>

