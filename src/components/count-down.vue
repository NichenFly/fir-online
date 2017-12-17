<template>
    <div>
        <div class="count-down-container">
            <transition name="fade">
                <div class="count-down">{{ countDownInfo }}</div>
            </transition>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        num: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            countDownInfo: 0
        }
    },
    activated() {
        this.countDownInfo = this.num
        let countDown = window.setInterval(() => {
            this.countDownInfo--
            if (this.countDownInfo < 1) {
                this.countDownInfo = '开始'
                this.$emit('count-down')
                window.clearInterval(countDown)
            }
        }, 1000)
    }
}
</script>
<style lang="scss" scoped>
.count-down-container {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    & .count-down {
        width: 200px;
        height: 200px;
        line-height: 200px;
        font-size: 80px;
        font-weight: 600;
        border-radius: 50%;
        color: tomato;
        background-color: cornflowerblue;
        z-index: 10;
    }
}
.count-down-enter-active {
    // transition: transform 1s;
    // transform: scale(0, 0);
}
.count-down-leave-active {
    transition: transform 1s;
    transform: scale(0, 0);
    opacity: 0;
}
</style>
