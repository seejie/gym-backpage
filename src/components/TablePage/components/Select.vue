<template>
<el-select v-model="model" v-bind="item" v-on="item.on">
    <el-option v-for="(option, index) in item.options" :key="index+'option'" v-bind="option"></el-option>
</el-select>
</template>

<script>
import model from '../mixins/model'
export default {
    props: {
        item: {
            type: Object
        }
    }
    ,mixins: [model]
}
</script>

<style lang="scss" scoped>

</style>
