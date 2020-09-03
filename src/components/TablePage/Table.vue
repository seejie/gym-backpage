<template>
<el-table v-bind="table" :data="list">
    <el-table-column type="selection" width="55" v-if="checkbox">
    </el-table-column>
    <el-table-column type="index">
    </el-table-column>
    <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        <template slot-scope="scope"> 
            <span class="span">{{ scope.row[item.prop] }}</span>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
export default {
    props: {
        table: {
            type: Object,
            default() {
                return {}
            }
        },
        columns: {
            type: Array
        },
        checkbox: {
            type: Boolean
        },
        list: {
            type: Array
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
