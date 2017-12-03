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
            this.$router.push('/room/1')
        }
    },
    components: {
    }
}
</script>
<style lang="scss" scoped>
$room-user-width-height: 70px;
$room-user-head-width-height: 60px;
$room-center-chess-preview-width: 120px;
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
        width: $room-user-width-height;
        height: $room-user-width-height;
        & > img {
            width: $room-user-head-width-height;
            height: $room-user-head-width-height;
            border-radius: 50%;
        }
    }
    & > .center {
        width: $room-center-chess-preview-width;
        & > img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
