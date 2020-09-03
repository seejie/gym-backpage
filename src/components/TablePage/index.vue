<template>
<div class="tablepage">
    <table-control :left="controls.left" :right="controls.right" v-model="form"></table-control>
    <custom-table :columns="columns" :list="list">
    </custom-table>
    <custom-page @current-change="currentChange" @size-change="sizeChange" :currentPage="currentPage" :pageSize="pageSize" :totalCount="totalCount"></custom-page>
</div>
</template>

<script>
import TableControl from './Control'
import CustomTable from './Table'
import CustomPage from './Pagination'
export default {
    components: {
        TableControl,
        CustomTable,
        CustomPage
    },
    props: {
        request: {
            type: Object
        },
        columns: {
            type: Array
        },
        controls: {
            type: Object
        },

    },
    created() {
        this.load();
    },
    data() {
        return {
            form: {
                ...this.request.query
            },
            list: [],
            currentPage: 1,
            pageSize: 10,
            totalCount: -1
        }
    },
    watch: {
        form: {
            handler() {
                this.load();
            },
            deep: true
        }
    },
    methods: {
        load() {
            const {
                form,
                currentPage,
                pageSize
            } = this;
            const query = {
                ...form,
                curPage: currentPage,
                pageSize
            }
            this.request.api(query).then(res => {
                this.list = res.resultList.mapList;
                this.totalCount = res.resultList.totalCount;
            })
        },
        currentChange(c) {
            debugger;
            this.currentPage = c;
            this.load();
        },
        sizeChange(size) {
            this.pageSize = size;
            this.load();
        }
    }
}
</script>

<style lang="scss" scoped>
.tablepage {
    padding: 0 10px;
}
</style>
