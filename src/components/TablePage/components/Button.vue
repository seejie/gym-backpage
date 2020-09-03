<template>
    <el-button v-model="model" type="primary" v-bind="item" v-on="item.on">{{item.label}}</el-button>
</template>
<script>
import model from '../mixins/model'
export default {
    name: 't-button',
    props: {
        item: {
            type: Object
        }
    },
    watch: {
        item() {
            console.log(item)
        }
    },
    mixins: [model]
}
</script>
<style lang="scss" scoped>

</style>
