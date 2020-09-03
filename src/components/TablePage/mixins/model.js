export default {
    props: {
        value: {

        }
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    data() {
        return {
            model: this.value
        }
    },
    watch: {
        model() {
            this.$emit("input", this.model)
        }
    }
}