<template>
<el-pagination @size-change="$emit('size-change',$event)" @current-change="$emit('current-change',$event)" :current-page="currentPage" 
:page-sizes="[100, 200, 300, 400]" :page-size="pageSize" 
layout="total, sizes, prev, pager, next, jumper" 
:total="totalCount" style="text-align:right;">
</el-pagination>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number
        },
        pageSize: {
            type: Number
        },
        totalCount: {
            type: Number
        }
    },
    data() {
        return {
            
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>

</style>
