<template>
<el-form class="control clearfix" :model="form" @submit.native.prevent>
    <div class="left fl">
        <template v-for="item in left">
            <component :key="item.prop" :is="item._is" :item="item" v-model="form[item.prop]" class="item"></component>
        </template>
    </div>
    <div class="right fr">
        <component v-for="item in right" :key="item.prop" :is="item._is" :item="item" v-model="form[item.prop]" class="item"></component>
    </div>
</el-form>
</template>

<script>
import TSelect from './components/Select'
import TSearch from './components/Search'
import TButton from './components/Button'
export default {
    components: {
        TSelect,
        TSearch,
        TButton
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: Object
        },
        left: {
            type: Array
        },
        right: {
            type: Array
        }
    },
    data() {
        return {
            form: this.value
        }

    },
    watch: {
        form: {
            handler() {
                this.$emit('input', this.form)
            },
            deep: true
        }
    },
    methods: {
        // onInput(prop, v) {
        //     this.value[prop] = v;
        // }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
$h: 60px;

.item {
    display: inline-block;
    vertical-align: middle;
}

.right>.item {
    margin-right: 15px;
}

.left>.item {
    margin-left: 15px;
}

.control {
    height: $h;
    background: $controlBg;
}

// .control {
//     display: flex;
// }

.left,
.right {
    height: 100%;
    line-height: $h;
}
</style>
