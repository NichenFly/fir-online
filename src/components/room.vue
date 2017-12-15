<template>
    <div>
        <div class="chess-container">
            <div class="chess-one" v-if="currentRoom.chessers && currentRoom.chessers[0]">
                <div class="user-state">
                    <span class="">{{ currentRoom.chessers[0].state }}</span>
                </div>
                <div class="user-head">
                    <img :src="currentRoom.chessers[0].avatar">
                </div>
                <div class="user-name">
                    {{ currentRoom.chessers[0].userName }}
                </div>
            </div>
            <div class="chess-one" v-if="!currentRoom.chessers || !currentRoom.chessers[0]">
                <div class="user-state">
                    <span class=""></span>
                </div>
                <div class="user-head">
                    <img src="../assets/imgs/index.png">
                </div>
                <div class="user-name">
                    暂无对弈者
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
            <div class="chess-another" v-if="currentRoom.chessers && currentRoom.chessers[1]">
                <div class="user-state">
                    <span class="">{{ currentRoom.chessers[1].state }}</span>
                </div>
                <div class="user-head">
                    <img :src="currentRoom.chessers[1].avatar">
                </div>
                <div class="user-name">
                    {{ currentRoom.chessers[1].userName }}
                </div>
            </div>
            <div class="chess-another" v-if="!currentRoom.chessers || !currentRoom.chessers[1]">
                <div class="user-state">
                    <span class=""></span>
                </div>
                <div class="user-head">
                    <img src="../assets/imgs/index.png">
                </div>
                <div class="user-name">
                    暂无对弈者
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
import { CHESS_WIDTH, CHESS_COLOR_BLACK, CHESS_COLOR_WHITE, CHESS_ROLE } from 'constants/constants'
import { mapGetters, mapMutations } from 'vuex'

export default {
    data() {
        return {
            dropLevel: true,
            chessColor: CHESS_COLOR_BLACK,
            role: CHESS_ROLE.watcher,
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
        roomInfo: function(room) {
            if (room) {
                this.$socket.emit('join-room', room, this.user)
                this.setCurrentRoom(room)
            } else {
                console.log('房间不存在, 跳到首页...')
                this.$router.push('/')
            }
        },
        chessColor: function(chessColor) {
            this.chessColor = chessColor
        },
        chessRole: function(role) {
            this.role = role
        },
        changedRoomInfo: function(changedRoom) {
            if (this.currentRoom.id === changedRoom.id) {
                this.setCurrentRoom(changedRoom)
            }
        },
        allReady: function(msg) {
            if (this.chessColor === CHESS_COLOR_BLACK && this.role === CHESS_ROLE.chesser) {
                this.turnMe = true
            }
        },
        downChess: function(chessInfo) {
            let roomId = chessInfo.roomId
            let chess = chessInfo.chess
            if (roomId === this.currentRoom.id) {
                this._addChessKey(chess.x, chess.y, chess.chessColor)
                if (this.role === CHESS_ROLE.chesser) {
                    this.turnMe = true
                }
            }
        }
    },
    mounted() {
        // 根据 id 获取 room 信息
        let roomId = this.$route.params.id
        this.downedChess = {}
        this.$socket.emit('get-room-info', roomId)
        this.setTitle('房间')
        // console.log(this.$route.params.id)
    },
    // mounted() {
    //     // 在这里触发connect事件
    //     // this.$socket.emit('connect', 'x')
    // },
    beforeDestroy() {
        this.$socket.emit('leave-room', this.currentRoom, this.user)
    },
    methods: {
        ready() {
            this.dropLevel = false
            this.$socket.emit('chess-state', this.currentRoom, this.user)
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
                this.$socket.emit('down-chess', this.currentRoom.id, {x, y, chessColor: this.chessColor})
                this._addChessKey(x, y, this.chessColor)
                this._playDownVoice()
                this.turnMe = false
            }
        },
        _couldDown(x, y) {
            return this.role === CHESS_ROLE.chesser && this.turnMe && !this.downedChess['_' + x + '_' + y]
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
            this.judge()
        },
        _playDownVoice() {
            let voice = this.$refs.chessKeyDownVoice
            voice.currentTime = 0
            voice.play()
        },
        judge() {
            let blackJudge = this._judgChess(CHESS_COLOR_BLACK)
            if (blackJudge === true) {
                console.log('黑子赢了')
                if (this.chessColor === CHESS_COLOR_BLACK) {
                    console.log('本局赢了')
                } else {
                    console.log('本局输了')
                }
                return false
            }

            let whiteJudge = this._judgChess(CHESS_COLOR_WHITE)
            if (whiteJudge === true) {
                console.log('白子赢了')
                if (this.chessColor === CHESS_COLOR_WHITE) {
                    console.log('本局赢了')
                } else {
                    console.log('本局输了')
                }
                return false
            }
        },
        _judgChess(chessColor) {
            let chess = this.chess
            // 初始化棋盘
            let coordinate = []
            for (let i = 0; i < 15; i++) {
                coordinate[i] = []
                for (let j = 0; j < 15; j++) {
                    coordinate[i][j] = false
                }
            }

            // 挑选出所有的黑子
            let chesses = chess.filter((c) => {
                return c.isBlack === chessColor
            })

            // 把黑子放到棋盘上
            chesses.forEach((c) => {
                let x = (c.x + 15) / 40
                let y = (c.y + 15) / 40
                coordinate[x][y] = true
            })

            // 遍历棋盘
            // 遍历行和列
            for (let i = 0; i < 15; i++) {
                // 遍历行
                let xNums = 0
                for (let j = 0; j < 15; j++) {
                    if (coordinate[i][j]) {
                        xNums++
                    } else {
                        xNums = 0
                    }
                    if (xNums === 5) {
                        return true
                    }
                }

                // 遍历列
                let yNums = 0
                for (let j = 0; j < 15; j++) {
                    if (coordinate[j][i]) {
                        yNums++
                    } else {
                        yNums = 0
                    }
                    if (yNums === 5) {
                        return true
                    }
                }
            }

            // 顺时针45度角
            let diagonalXNums = 0
            for (let start = 4; start < 15; start++) {
                for (let i = 0, j = start - i; i <= start; i++) {
                    if (coordinate[i][j]) {
                        console.log(`${i}, ${j} --- ${diagonalXNums}`)
                        diagonalXNums++
                    } else {
                        diagonalXNums = 0
                    }
                    if (diagonalXNums === 5) {
                        return true
                    }
                }
            }
            diagonalXNums = 0
            for (let start = 1; start <= 10; start++) {
                for (let i = start, j = 15 - i; i < 15; i++) {
                    if (coordinate[i][j]) {
                        console.log(`${i}, ${j} --- ${diagonalXNums}`)
                        diagonalXNums++
                    } else {
                        diagonalXNums = 0
                    }
                    if (diagonalXNums === 5) {
                        return true
                    }
                }
            }

            let diagonalYNums = 0
            for (let start = 0; start <= 10; start++) {
                for (let i = start, j = i - start; i <= 10; i++) {
                    if (coordinate[i][j]) {
                        console.log(`${i}, ${j} --- ${diagonalYNums}`)
                        diagonalYNums++
                    } else {
                        diagonalYNums = 0
                    }
                    if (diagonalYNums === 5) {
                        return true
                    }
                }
            }
            diagonalYNums = 0
            for (let start = 0; start <= 10; start++) {
                for (let i = 0, j = i + start; i <= 10; i++) {
                    if (coordinate[i][j]) {
                        console.log(`${i}, ${j} --- ${diagonalYNums}`)
                        diagonalYNums++
                    } else {
                        diagonalYNums = 0
                    }
                    if (diagonalYNums === 5) {
                        return true
                    }
                }
            }
            // 未定胜负
            return null
        },
        ...mapMutations({
            'setTitle': 'SET_TITLE',
            'setCurrentRoom': 'SET_CURRENT_ROOM'
        })
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
