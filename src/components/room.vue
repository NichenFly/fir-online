<template>
    <div>
        <Row>
            <Col span="6">
                <div @click="joinRoom(1)">
                    <Card>
                        <p slot="title">Funny room</p>
                        <div class="room-container">
                            <Tooltip content="Kitty" placement="top" :delay="500">
                                <div class="left">
                                    <img src="src/assets/imgs/index.png">
                                </div>
                            </Tooltip>
                            <div class="center">
                                <img src="src/assets/imgs/index.png">
                            </div>
                            <Tooltip content="大王" placement="top" :delay="500">
                                <div class="right">
                                    <img src="src/assets/imgs/index.png">
                                </div>
                            </Tooltip>
                        </div>
                        <div><h3>0 人围观</h3></div>
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    methods: {
        joinRoom(roomId) {
            this.$router.push('chess')
        }
    },
    components: {
    }
}
</script>
<style lang="scss" scoped>
.ivu-col {
    padding: 5px;
}
.ivu-card {
    &:hover {
        cursor: pointer;
    }
}
.room-container {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    & .left, & .right {
        width: 70px;
        height: 70px;
        & > img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
    }
    & > .center {
        width: 120px;
        & > img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
