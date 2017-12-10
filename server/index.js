var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const path = require('path')
var constants = {
    CHESS_COLOR_BLACK: true,
    CHESS_COLOR_WHITE: false,
    roomState: {
        NOT_START: 0,
        READY: 1,
        RUNNING: 2,
        SUSPEND: 3,
        DESTROYED: 4
    }
}

app.use('/static', express.static('static'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/hall', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/room/1', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

var roomObjs = {}

var roomArrays = []

let originRoom = {
    id: '',
    name: '',
    password: '',
    chessers: [],
    watchers: [],
    state: constants.roomState.NOT_START,
    chesses: [],
    chessesIds: {}
}

// 定义房间对象
// let roomObj = {
//     id: '',
//     name: '',
//     password: '',
//     chessers: [{
//         id: 'xxx',
//         name: 'xxx',
//         avatar: '',
//         chessColor: constants.CHESS_COLOR_BLACK,
//         state: constants.roomState.NOT_START
//     }, {
//         id: 'yyy',
//         name: 'yyy',
//         avatar: '',
//         chessColor: constants.CHESS_COLOR_WHITE,
//         constants.roomState.NOT_START
//     }],
//     watchers: [{
//         id: '',
//         name: '',
//         avatar: ''
//     }],
//     state: constants.roomState.NOT_START
//     chesses: [{
//         x: 1,
//         y: 1,
//         chessColor: constants.CHESS_COLOR_BLACK
//     }]
// }

io.on('connection', function (socket) {
    console.log('a user connected')

    socket.on('join-room', function (room, user) {
        console.log(`用户: ${user.name} 创建 room: ${room.id}`)
        // 房间存在
        if (!room || !room.id || !user || !user.id) {
            return
        }
        if (roomObjs[room.id]) {
            let roomObj = roomObjs[room.id]

            // if (roomObj.password !== msg.room.password) { return }

            switch (roomObj.chessers.length) {
                case 2:
                    // 已经有人下棋
                    roomObj.watchers.push(user)
                    break
                case 1:
                    // 有一个人就位了
                    if (roomObj.watchers.length > 0) {
                        roomObj.watchers.push(user)
                    } else {
                        let chessers = roomObj.chessers
                        if (chessers[0].chessColor === constants.CHESS_COLOR_BLACK) {
                            user.chessColor = constants.CHESS_COLOR_WHITE
                        } else {
                            user.chessColor = constants.CHESS_COLOR_BLACK
                        }
                        roomObj.chessers.push(user)
                    }
                    break
            }
        } else {
            // 房间不存在
            if (!user) {
                return
            }
            let roomObj = JSON.parse(JSON.stringify(originRoom))
            roomObj.id = room.id
            roomObj.name = room.name
            roomObj.password = room.password
            user.chessColor = user.chessColor === undefined ? constants.CHESS_COLOR_BLACK : constants.CHESS_COLOR_WHITE
            roomObj.chessers.push(user)
            roomObjs[room.id] = roomObj
            roomArrays.push(roomObj)
        }
        socket.join(room.id)
        console.log('roomObjs', roomObjs)
        /*roomObjs.default.users.push(socket.id)
        let roomUsers = roomObjs.default.users
        if (roomUsers.length === 1) {
            socket.emit('thisTimeChess', { role: 'chessing', chessColor: constants.CHESS_COLOR_BLACK, turnMe: true })
        } else if (roomUsers.length === 2) {
            socket.emit('thisTimeChess', { role: 'chessing', chessColor: constants.CHESS_COLOR_WHITE })
        } else {
            socket.emit('thisTimeChess', { role: 'watching' })
        }*/
    })

    socket.on('chess-state', function (room, user) {
        // 判断是不是chessers
        // 判断 发送过来的状态-room.state
        // 判断是不是另一位也准备好了, 两个都是READY, 则状态置为RUNNING, 并发送广播
        if (!room || !room.id || !user || !user.id) {
            return
        }
        if (roomObjs[room.id]) {
            let room = roomObjs[room.id]
            let chessers = room.chessers
            let chesser = chessers.find((chesser) => chesser.id === user.id)
            if (chesser) {
                chesser.state = constants.roomState.READY
                let anotherChesser = chessers.find((chesser) => chesser.id !== user.id)
                if (anotherChesser) {
                    if (anotherChesser.state === constants.roomState.READY) {
                        io.in(room.id).emit('allReady', 'Chessers are ready.')
                    }
                }
            }
        }
    })

    /**
     * 接收到下棋, 然后发送棋子信息到room的其他人
     * @param  {[type]} msg: {room: {id, name, password}, x, y, chessColor}
     */
    socket.on('down-chess', function (msg) {
        console.log('down-chess', msg)
        let roomObj = roomObjs[msg.room.id]
        if (roomObj) {
            // if (roomObj.password !== msg.room.password) { return }
            let chessKey = `_${msg.x}_${msg.y}`
            if (roomObj.chessesIds[chessKey]) {
                return
            }
            roomObj.chessesIds[chessKey] = true
            roomObj.chesses.push({
                x: msg.x,
                y: msg.y,
                chessColor: msg.chessColor
            })
            socket.broadcast.to(roomObj.id).emit('downChess', msg)
        }
    })

    /**
     * 离开房间
     */
    socket.on('leave-room', function (room, user) {
        let roomObj = roomObjs[room.id]
        if (roomObj) {
            let chessers = roomObj.chessers
            let chessser = chessers.find((chesser) => chesser.id === user.id)
            if (chessser) {
                roomObj.chessers = chessers.filter((chesser) => chesser.id !== user.id)

                // 房间里没人下棋, 销毁房间
                if (roomObj.chessers.length === 0) {
                    delete roomObjs[room.id]
                    roomArrays = roomArrays.filter((roomTmp) => roomTmp.id === roomObj.id)
                }
            } else {
                let watchers = roomObjs.watchers
                let watcher = watchers.find((watcher) => watcher.id === user.id)
                if (watcher) {
                    roomObj.watchers = watchers.filter((watcher) => watcher.id !== user.id)
                }
            }
        }
        socket.leave(room.id)
    })
    socket.on('disconnect', function (room, user) {
        let roomObj = roomObjs[room.id]
        if (roomObj) {
            let chessers = roomObj.chessers
            let chessser = chessers.find((chesser) => chesser.id === user.id)
            if (chessser) {
                roomObj.chessers = chessers.filter((chesser) => chesser.id !== user.id)

                // 房间里没人下棋, 销毁房间
                if (roomObj.chessers.length === 0) {
                    delete roomObjs[room.id]
                    roomArrays = roomArrays.filter((roomTmp) => roomTmp.id === roomObj.id)
                }
            } else {
                let watchers = roomObjs.watchers
                let watcher = watchers.find((watcher) => watcher.id === user.id)
                if (watcher) {
                    roomObj.watchers = watchers.filter((watcher) => watcher.id !== user.id)
                }
            }
        }
        socket.leave(room.id)
        console.log('a user disconnected')
    })
})

http.listen(3000, function () {
    console.log('listening on *:3000')
})