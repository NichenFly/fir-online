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
        END: 3,
        DESTROYED: 4
    },
    chessRole: {
        chesser: 'chesser',
        watcher: 'watcher'
    }
}

app.use('/static', express.static('static'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/hall', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/room/:id', function (req, res) {
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
    state: 0,
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

function emitChangedRoomsInfo(io, room) {
    if (room) {
        io.emit('roomInfoChanged', {
            id: room.id,
            name: room.name,
            chessers: room.chessers,
            watchers: room.watchers,
            state: room.state
        })
    }
}
function emitRoomsInfo(socket) {
    let rooms = []
    roomArrays.forEach((room) => {
        rooms.push({
            id: room.id,
            name: room.name,
            chessers: room.chessers,
            watchers: room.watchers,
            state: room.state
        })
    })
    socket.emit('roomsInfo', rooms)
}

io.on('connection', function (socket) {
    console.log('a user connected')

    // 发送信息到该socket
    // emitRoomsInfo(socket)
    socket.on('get-rooms-info', function () {
        emitRoomsInfo(socket)
    })

    socket.on('create-room', function (room, user) {
        if (!room || !room.id || !user || !user.id) {
            return
        }
        if (roomObjs[room.id]) {
            console.log(`房间 ${room.name} 已存在`)
            return
        }
        let roomObj = JSON.parse(JSON.stringify(originRoom))
        roomObj.id = room.id
        roomObj.name = room.name
        roomObj.password = room.password
        roomObjs[room.id] = roomObj
        roomArrays.push(roomObj)
        socket.emit('roomCreated', room.id)
    })

    socket.on('join-room', function (room, user) {
        console.log(`用户: ${user.userName} 进入 room: ${room.id}`)
        // 房间存在
        if (!room || !room.id || !user || !user.id) {
            return
        }
        if (roomObjs[room.id]) {
            let roomObj = roomObjs[room.id]
            let chessers = roomObj.chessers

            // if (roomObj.password !== msg.room.password) { return }
            if (roomObj.state !== constants.roomState.NOT_START || chessers.length === 2) {
                roomObj.watchers.push(user)
                socket.emit('chessRole', constants.chessRole.watcher)
            } else {
                if (chessers.find((c) => c.id === user.id)) {
                    // 用户已在房间或者下棋者已满
                    return
                }

                user.state = constants.roomState.NOT_START

                if (chessers.length === 0) {
                    user.chessColor = constants.CHESS_COLOR_BLACK
                } else {
                    if (chessers[0].chessColor === constants.CHESS_COLOR_BLACK) {
                        user.chessColor = constants.CHESS_COLOR_WHITE
                    } else {
                        user.chessColor = constants.CHESS_COLOR_BLACK
                    }
                }
                roomObj.chessers.push(user)
                socket.emit('chessColor', user.chessColor)
                socket.emit('chessRole', constants.chessRole.chesser)
            }
            socket.join(room.id)
            emitChangedRoomsInfo(io, roomObjs[room.id])
        }
    })

    socket.on('get-room-info', function (roomId) {
        let room = roomObjs[roomId]
        socket.emit('roomInfo', room)
    })

    socket.on('chess-state', function (room, user) {
        // 判断是不是chessers
        // 判断 发送过来的状态-room.state
        // 判断是不是另一位也准备好了, 两个都是READY, 则状态置为RUNNING, 并发送广播
        if (!room || !room.id || !user || !user.id) {
            return
        }
        if (roomObjs[room.id]) {
            let roomObj = roomObjs[room.id]
            let chessers = roomObj.chessers
            let chesser = chessers.find((c) => c.id === user.id)
            if (chesser) {
                chesser.state = constants.roomState.READY
                let anotherChesser = chessers.find((c) => c.id !== user.id)
                if (anotherChesser) {
                    if (anotherChesser.state === constants.roomState.READY) {
                        roomObj.state = constants.roomState.RUNNING
                    }
                }
                io.in(roomObj.id).emit('roomStateChanged', roomObj)
            } else {
                // 不在该房间
                socket.emit('roomInfo', null)
                return
            }
        }
    })

    socket.on('room-state-changed', function (roomId, state) {
        roomObjs[roomId].state = state
    })

    /**
     * 接收到下棋, 然后发送棋子信息到room的其他人
     * @param  {[type]} msg: {room: {id, name, password}, x, y, chessColor}
     */
    socket.on('down-chess', function (roomId, chess) {
        console.log('down-chess', chess)
        let roomObj = roomObjs[roomId]
        if (roomObj) {
            // if (roomObj.password !== msg.room.password) { return }
            let chessKey = `_${chess.x}_${chess.y}`
            if (roomObj.chessesIds[chessKey]) {
                return
            }
            roomObj.chessesIds[chessKey] = true
            roomObj.chesses.push({
                x: chess.x,
                y: chess.y,
                chessColor: chess.chessColor
            })
            socket.broadcast.to(roomId).emit('downChess', { roomId, chess })
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
                    roomArrays = roomArrays.filter((roomTmp) => roomTmp.id !== roomObj.id)
                }
            } else {
                let watchers = roomObj.watchers
                let watcher = watchers.find((watcher) => watcher.id === user.id)
                if (watcher) {
                    roomObj.watchers = watchers.filter((watcher) => watcher.id !== user.id)
                }
            }
        }
        socket.leave(room.id)
        emitChangedRoomsInfo(io, roomObj)
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
        emitChangedRoomsInfo(io, roomObj)
        console.log('a user disconnected')
    })
})

http.listen(3000, function () {
    console.log('listening on *:3000')
})