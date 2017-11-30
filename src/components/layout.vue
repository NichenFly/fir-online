<template>
    <div>
        <p>哎呀, 默宸</p>
        <Button @click="show">Click me!</Button>
        <Modal v-model="visible" title="Welcome">Welcome to iView</Modal>
    </div>
</template>
<script>
import { Button, Modal } from 'iview'
export default {
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = true
        }
    },
    components: {
        Button, Modal
    }
}
</script>
<style lang="sass" scoped>

</style>
