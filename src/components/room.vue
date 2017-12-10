<template>
    <div>
        <div class="chess-container">
            <div class="chess-one">
                <div class="user-state">
                    <span class=""></span>
                </div>
                <div class="user-head">
                    <img src="../assets/imgs/avatar/4.jpg">
                </div>
                <div class="user-name">
                    大王
                </div>
            </div>
            <div class="chess-area" @click="down">
                <div class="drop-level" v-if="dropLevel" @click="ready">
                    <Icon type="arrow-right-b"></Icon>
                </div>
                <div class="chess-lines">
                    <div class="line-horizontal">
                        <div class="line" style="top: 0px;"></div>
                        <div class="line" style="top: 40px;"></div>
                        <div class="line" style="top: 80px;"></div>
                        <div class="line" style="top: 120px;"></div>
                        <div class="line" style="top: 160px;"></div>
                        <div class="line" style="top: 200px;"></div>
                        <div class="line" style="top: 240px;"></div>
                        <div class="line" style="top: 280px;"></div>
                        <div class="line" style="top: 320px;"></div>
                        <div class="line" style="top: 360px;"></div>
                        <div class="line" style="top: 400px;"></div>
                        <div class="line" style="top: 440px;"></div>
                        <div class="line" style="top: 480px;"></div>
                        <div class="line" style="top: 520px;"></div>
                        <div class="line" style="top: 560px;"></div>
                    </div>
                    <div class="line-vertical">
                        <div class="line" style="left: 0px;"></div>
                        <div class="line" style="left: 40px;"></div>
                        <div class="line" style="left: 80px;"></div>
                        <div class="line" style="left: 120px;"></div>
                        <div class="line" style="left: 160px;"></div>
                        <div class="line" style="left: 200px;"></div>
                        <div class="line" style="left: 240px;"></div>
                        <div class="line" style="left: 280px;"></div>
                        <div class="line" style="left: 320px;"></div>
                        <div class="line" style="left: 360px;"></div>
                        <div class="line" style="left: 400px;"></div>
                        <div class="line" style="left: 440px;"></div>
                        <div class="line" style="left: 480px;"></div>
                        <div class="line" style="left: 520px;"></div>
                        <div class="line" style="left: 560px;"></div>
                    </div>
                </div>
                <div class="chess-keys" ref="chess">
                    <div class="chess" :class="[chessKey.isBlack ? 'black-chess' : 'white-chess', {'just': chessKey.isJust}]" 
                                    :style="{top: chessKey.y + 'px', left: chessKey.x + 'px'}" 
                                    v-for="(chessKey, index) in chess"
                                    :key="index"></div>
                    <!-- <div>
                        <div class="chess black-chess just" style="top: -15px; left: -15px;"></div>
                    </div>
                    <div>
                        <div class="chess black-chess just" style="top: 65px; left: 65px;"></div>
                    </div>
                    <div>
                        <div class="chess white-chess" style="top: 105px; left: 105px"></div>
                    </div>
                    <div>
                        <div class="chess white-chess" style="top: 105px; left: 145px"></div>
                    </div> -->
                </div>
            </div>
            <div class="chess-another">
                <div class="user-state">
                    <span class=""></span>
                </div>
                <div class="user-head">
                    <img src="../assets/imgs/avatar/0.jpg">
                </div>
                <div class="user-name">
                    Kitty
                </div>
            </div>
        </div>
        <div class="hidden">
            <audio src="../assets/sounds/down.wav" ref="chessKeyDownVoice">
                哎呀, 您的浏览器不支持本音乐播放~~~
            </audio>
        </div>
    </div>
</template>
<script>
import { CHESS_WIDTH, CHESS_COLOR_BLACK } from 'constants/constants'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            dropLevel: true,
            chessColor: CHESS_COLOR_BLACK,
            role: 'chessing',
            turnMe: false,
            chess: []
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'currentRoom'
        ])
    },
    sockets: {
        connect: function(socket) {
            console.log('socket connected')
        },
        allReady: function(msg) {
            console.log(msg)
            // this.role = chess.role
            // this.turnMe = chess.turnMe
            // this.chessColor = chess.chessColor
        },
        downChess: function(msg) {
            console.log(msg)
            this._addChessKey(msg.x, msg.y, msg.chessColor)
            this.turnMe = true
        }
    },
    mounted() {
        // 根据 id 获取 room 信息
        // let roomId = this.$route.params.id
        this.downedChess = {}
        // console.log(this.$route.params.id)
    },
    // mounted() {
    //     // 在这里触发connect事件
    //     this.$socket.emit('connect', 'x')
    // },
    methods: {
        ready() {
            this.dropLevel = false
        },
        down(event) {
            if (event.target.className !== 'chess-keys') {
                return
            }
            let x = event.layerX
            let y = event.layerY
            x = parseInt((x + CHESS_WIDTH / 2) / CHESS_WIDTH) * CHESS_WIDTH - 15
            y = parseInt((y + CHESS_WIDTH / 2) / CHESS_WIDTH) * CHESS_WIDTH - 15
            if (this._couldDown(x, y)) {
                this.$socket.emit('down-chess', {x, y, chessColor: this.chessColor})
                this._addChessKey(x, y, this.chessColor)
                this._playDownVoice()
                this.turnMe = false
            }
        },
        _couldDown(x, y) {
            return this.role === 'chessing' && this.turnMe && !this.downedChess['_' + x + '_' + y]
        },
        _addChessKey(x, y, chessColor) {
            let chess = this.chess
            if (chess.length > 0) {
                chess[chess.length - 1].isJust = false
            }
            this.chess.push({
                x,
                y,
                isBlack: chessColor,
                isJust: true
            })
            this.downedChess['_' + x + '_' + y] = true
        },
        _playDownVoice() {
            let voice = this.$refs.chessKeyDownVoice
            voice.currentTime = 0
            voice.play()
        }
    }
}
</script>
<style lang="scss" scoped>
$chess-width-height: 560px; // 棋盘宽度,高度
$background-img: url(../assets/imgs/bg-img.png); // 棋盘背景图片
$background-fir-img: url(../assets/imgs/fire2.png); // fired状态的背景图
$chess-key-width: 30px; // 棋子的直径
$chess-area-width-height: 600px; // 棋盘宽高
$chess-area-padding: 20px; // 棋盘内边距
$chess-area-redius: 10px; // 棋盘区域的圆角
.chess-container {
    display: flex;
    justify-content: center;
    align-items: center;
    & > .chess-one, & > .chess-another {
        width: 300px;
        height: 300px;
        // background-color: #ccc;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        & > .user-state {
            height: 30px;
            line-height: 30px;
            text-align: center;
            // font-size: 20px;
            font-weight: 400;
            & .state-ready {
                color: green;
            }
            & .state-stop {
                color: red;
            }
            & .state-suspend {
                color: blueviolet;
            }
        }
        & > .user-head {
            height: 200px;
            // width: 200px;
            text-align: center;
            & img {
                width: 200px;
                height: 200px;
                border-radius: 50%;
            }
        }
        & > .user-name {
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 24px;
            font-weight: 600;
        }
    }
}
.chess-area {
    display: inline-flex;
    position: relative;
    background-image: $background-img;
    background-repeat: repeat;
    padding: $chess-area-padding;
    width: $chess-area-width-height;
    height: $chess-area-width-height;
    border-radius: $chess-area-redius;
    &:hover {
        cursor: pointer;
    }
}
.drop-level {
    position: absolute;
    width: $chess-width-height;
    height: $chess-width-height;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    & i {
        font-size: 200px;
    }
    & i:hover{
        cursor: pointer;
        font-size: 230px;
    }
    
}
.chess-lines {
    width: $chess-width-height;
    height: $chess-width-height;
    position: relative;
    & > .line-horizontal {
        & .line {
            position: absolute;
            height: 2px;
            width: 100%;
            background-color: #000;
            box-shadow: 0px 1px 1px #333, 0px -1px 1px #333
        }
    }
    & > .line-vertical {
        & .line {
            position: absolute;
            height: 100%;
            width: 2px;
            background-color: #000;
            box-shadow: 1px 0px 1px #333, -1px 0px 1px #333
        }
    }
}
.chess-keys {
    width: $chess-width-height;
    height: $chess-width-height;
    position: absolute;
    top: 20px;
    left: 20px;
    .chess {
        width: $chess-key-width;
        height: $chess-key-width;
        border-radius: 50%;
        z-index: 100;
    }
    .black-chess {
        position: absolute;
        background-color: #aaa;
        box-shadow: 4px -2px 20px 7px #000 inset, 1px 2px 5px #000;
    }
    .white-chess {
        position: absolute;
        background-color: #F7FBBA;
        box-shadow: 4px -1px 20px 7px #ddd inset, 1px 2px 5px #000;
    }
    .just::before {
        content: "";
        width: 50px;
        height: 50px;
        background-image: $background-fir-img;
        background-size: 50px 50px;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        top: -10px;
        left: -10px;
    }
}

</style>
