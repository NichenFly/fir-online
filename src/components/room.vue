<template>
    <div>
        <div class="chess-container">
            <div class="chess-one" v-if="currentRoom.chessers && currentRoom.chessers[0]">
                <div class="user-state">
                    <div class="turned" v-if="currentRoom.state === 2 && justChessColor !== currentRoom.chessers[0].chessColor">
                        <Icon type="ios-color-wand"></Icon>
                    </div>
                    <span class=""  v-if="currentRoom.state !== 2">{{ currentRoom.chessers[0].state }}</span>
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
                    <Icon type="play"></Icon>
                </div>
                <div v-if="currentRoom.state === 1">
                    <count-down :num="3" @count-down="countDown"></count-down>
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
                                    v-for="(chessKey, index) in currentRoom.chesses"
                                    :key="index"></div>
                </div>
            </div>
            <div class="chess-another" v-if="currentRoom.chessers && currentRoom.chessers[1]">
                <div class="user-state">
                    <div class="turned" v-if="currentRoom.state === 2 && justChessColor !== currentRoom.chessers[1].chessColor">
                        <Icon type="ios-color-wand"></Icon>
                    </div>
                    <span class="" v-if="currentRoom.state !== 2">{{ currentRoom.chessers[1].state }}</span>
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
            <img src="../assets/imgs/fire2.png" alt="预加载的图片">
            <audio src="../assets/sounds/down.wav" ref="chessKeyDownVoice">
                哎呀, 您的浏览器不支持本音乐播放~~~
            </audio>
        </div>
    </div>
</template>
<script>
import { CHESS_WIDTH, CHESS_COLOR_BLACK, CHESS_COLOR_WHITE, CHESS_ROLE, roomState } from 'constants/constants'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import CountDown from 'components/count-down'

export default {
    data() {
        return {
            dropLevel: false,
            chessColor: CHESS_COLOR_BLACK,
            justChessColor: null,
            role: CHESS_ROLE.watcher,
            turnMe: false
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
                this.setTitle(room.name)
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
            if (role === CHESS_ROLE.chesser && this.currentRoom.state === roomState.NOT_START) {
                this.dropLevel = true
            }
        },
        roomStateChanged: function(changedRoom) {
            if (changedRoom.state === roomState.END) {
                return
            }
            this.setCurrentRoom(changedRoom)
            if (changedRoom.state === roomState.RUNNING && this.chessColor === CHESS_COLOR_BLACK && this.role === CHESS_ROLE.chesser) {
                this.turnMe = true
            }
        },
        roomInfoChanged: function(changedRoom) {
            if (this.currentRoom.id === changedRoom.id) {
                this.setCurrentRoom(changedRoom)
            }
        },
        downChess: function(chessInfo) {
            if (this.currentRoom.state === roomState.RUNNING) {
                let roomId = chessInfo.roomId
                let chess = chessInfo.chess
                if (roomId === this.currentRoom.id) {
                    this.justChessColor = chess.chessColor
                    this._addChessKey(chess.x, chess.y, chess.chessColor)
                    if (this.role === CHESS_ROLE.chesser) {
                        this.turnMe = true
                    }
                }
            }
        }
    },
    activated() {
        // 根据 id 获取 room 信息
        if (this.user.userName) {
            let roomId = this.$route.params.id
            this.downedChess = {}
            this.$socket.emit('get-room-info', roomId)
            this.setTitle('房间')
            this.voice = this.$refs.chessKeyDownVoice
        } else {
            this.$router.push('/hall')
        }
        // console.log(this.$route.params.id)
    },
    deactivated() {
        this.$socket.emit('leave-room', this.currentRoom, this.user)
    },
    beforeDestroy() {
        this.$socket.emit('leave-room', this.currentRoom, this.user)
    },
    methods: {
        ready() {
            this.dropLevel = false
            this.$socket.emit('chess-state', this.currentRoom, this.user)
        },
        countDown() {
            this.$socket.emit('room-state-changed', this.currentRoom.id, roomState.RUNNING)
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
                this.turnMe = false
            }
        },
        _couldDown(x, y) {
            if (this.currentRoom.state !== roomState.RUNNING) {
                return false
            }
            return this.role === CHESS_ROLE.chesser && this.turnMe && !this.downedChess['_' + x + '_' + y]
        },
        _addChessKey(x, y, chessColor) {
            this.addChessToCurrentRoom({
                x,
                y,
                isBlack: chessColor,
                isJust: true
            })
            this.downedChess['_' + x + '_' + y] = true
            this._playDownVoice()
            this.judge()
        },
        _playDownVoice() {
            let voice = this.voice
            voice.currentTime = 0
            voice.play()
        },
        judge() {
            let blackJudge = this._judgChess(CHESS_COLOR_BLACK)
            if (blackJudge.win) {
                console.log('黑子赢了')
                this._fireWinChess(blackJudge.lineChess)
                if (this.chessColor === CHESS_COLOR_BLACK) {
                    console.log('本局赢了')
                    this.$Modal.success({
                        title: '结果',
                        content: '赢了'
                    })
                } else {
                    console.log('本局输了')
                    this.$Modal.error({
                        title: '结果',
                        content: '输了'
                    })
                }
                this.setCurrentRoomState(roomState.END)
                this.$socket.emit('room-state-changed', this.currentRoom.id, roomState.END)
                return false
            }

            let whiteJudge = this._judgChess(CHESS_COLOR_WHITE)
            if (whiteJudge.win) {
                console.log('白子赢了')
                this._fireWinChess(whiteJudge.lineChess)
                if (this.chessColor === CHESS_COLOR_WHITE) {
                    console.log('本局赢了')
                    this.$Modal.success({
                        title: '结果',
                        content: '赢了'
                    })
                } else {
                    console.log('本局输了')
                    this.$Modal.error({
                        title: '结果',
                        content: '输了'
                    })
                }
                this.setCurrentRoomState(roomState.END)
                this.$socket.emit('room-state-changed', this.currentRoom.id, roomState.END)
                return false
            }
        },
        _fireWinChess(chesses) {
            let winChessObj = {}
            chesses.forEach((c) => {
                winChessObj[`_${c.x * 40 - 15}_${c.y * 40 - 15}`] = true
            })
            let thisChesses = this.currentRoom.chesses
            let firedChesses = thisChesses.map((c) => {
                let firedChess = Object.assign({}, c)
                if (winChessObj[`_${c.x}_${c.y}`]) {
                    firedChess.isJust = true
                }
                return firedChess
            })
            this.setCurrentRoomChesses(firedChesses)
        },
        _judgChess(chessColor) {
            let result = {
                win: null,
                lineChess: []
            }
            let lineChess = result.lineChess
            let chess = this.currentRoom.chesses
            // 初始化棋盘
            let coordinate = []
            for (let i = 0; i < 15; i++) {
                coordinate[i] = []
                for (let j = 0; j < 15; j++) {
                    coordinate[i][j] = false
                }
            }

            // 挑选出所有的黑子或者白子
            let chesses = chess.filter((c) => {
                return c.isBlack === chessColor
            })

            if (chesses.length < 5) {
                return result
            }

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
                lineChess.length = 0
                for (let j = 0; j < 15; j++) {
                    if (coordinate[i][j]) {
                        lineChess.push({x: i, y: j})
                    } else {
                        lineChess.length = 0
                    }
                    if (lineChess.length === 5) {
                        result.win = true
                        return result
                    }
                }

                // 遍历列
                lineChess.length = 0
                for (let j = 0; j < 15; j++) {
                    if (coordinate[j][i]) {
                        lineChess.push({x: j, y: i})
                    } else {
                        lineChess.length = 0
                    }
                    if (lineChess.length === 5) {
                        result.win = true
                        return result
                    }
                }
            }

            // 顺时针45度角
            lineChess.length = 0
            for (let start = 4; start < 15; start++) {
                for (let i = 0, j = start - i; i <= start; i++, j = start - i) {
                    if (coordinate[i][j]) {
                        lineChess.push({x: i, y: j})
                    } else {
                        lineChess.length = 0
                    }
                    if (lineChess.length === 5) {
                        result.win = true
                        return result
                    }
                }
            }
            lineChess.length = 0
            for (let start = 1; start <= 10; start++) {
                for (let i = start, j = 15 - i; i < 15; i++, j = 15 - i) {
                    if (coordinate[i][j]) {
                        lineChess.push({x: i, y: j})
                    } else {
                        lineChess.length = 0
                    }
                    if (lineChess.length === 5) {
                        result.win = true
                        return result
                    }
                }
            }

            lineChess.length = 0
            for (let start = 0; start <= 10; start++) {
                for (let i = start, j = i - start; i <= 10; i++, j = i - start) {
                    if (coordinate[i][j]) {
                        lineChess.push({x: i, y: j})
                    } else {
                        lineChess.length = 0
                    }
                    if (lineChess.length === 5) {
                        result.win = true
                        return result
                    }
                }
            }
            lineChess.length = 0
            for (let start = 0; start <= 10; start++) {
                for (let i = 0, j = i + start; i <= 10; i++, j = i + start) {
                    if (coordinate[i][j]) {
                        lineChess.push({x: i, y: j})
                    } else {
                        lineChess.length = 0
                    }
                    if (lineChess.length === 5) {
                        result.win = true
                        return result
                    }
                }
            }
            // 未定胜负
            lineChess.length = 0
            return result
        },
        ...mapMutations({
            'setTitle': 'SET_TITLE',
            'setCurrentRoom': 'SET_CURRENT_ROOM',
            'setCurrentRoomState': 'SET_CURRENT_ROOM_STATE',
            'setCurrentRoomChesses': 'SET_CURRENT_ROOM_CHESSES'
        }),
        ...mapActions([
            'addChessToCurrentRoom'
        ])
    },
    components: {
        CountDown
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
        & .turned {
            font-size: 30px;
            font-weight: 400;
            color: blueviolet;
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
    width: 100%;
    height: 100%;
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
.hidden {
    display: none;
}
</style>
