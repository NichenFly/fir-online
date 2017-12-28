var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const path = require('path')
let constants = require('./src/constants')
let utils = require('./src/utils')
let emitActions = require('./src/emit-actions')

app.use('/static', express.static('static'))

app.get('/', function (req, res) {
    let clientIp = utils.getClientIp(req)
    console.log(`${clientIp} 访问系统主页`)
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/hall', function (req, res) {
    let clientIp = utils.getClientIp(req)
    console.log(`${clientIp} 访问系统大厅`)
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/room/:id', function (req, res) {
    let clientIp = utils.getClientIp(req)
    console.log(`${clientIp} 进入房间`)
    res.sendFile(path.join(__dirname, '/index.html'))
})

let roomObjs = {}

let roomArrays = []

let SocketUserMap = {}

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

io.on('connection', function (socket) {
    console.log(`a user(socketId:${socket.id}) connected`)

    // 发送信息到该socket
    // emitRoomsInfo(socket)
    socket.on('get-rooms-info', function () {
        emitActions.emitRoomsInfo(socket, roomArrays)
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
        roomObj.chessers.push({
            id: user.id,
            userName: user.userName,
            avatar: user.avatar,
            chessColor: constants.CHESS_COLOR_BLACK,
            state: constants.roomState.NOT_START
        })
        roomObjs[room.id] = roomObj
        roomArrays.push(roomObj)
        socket.join(room.id)
        SocketUserMap[socket.id] = user.id
        socket.emit('roomCreated', room.id)
        emitActions.emitRoomInfoChanged(io, roomObj)
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
                    // 用户已在房间
                    socket.emit('chessRole', constants.chessRole.chesser)
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
            SocketUserMap[socket.id] = user.id
            emitActions.emitRoomInfoChanged(io, roomObjs[room.id])
            console.log(`user(${user.userName}) join room(${room.name})`)
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
                        roomObj.state = constants.roomState.READY
                    }
                }
                io.sockets.in(roomObj.id).emit('roomStateChanged', roomObj)
            } else {
                // 不在该房间
                socket.emit('roomInfo', null)
            }
        }
    })

    socket.on('room-state-changed', function (roomId, state) {
        let roomObj = roomObjs[roomId]
        if (roomObj && roomObj.state !== state) {
            roomObj.state = state
            io.sockets.in(roomObj.id).emit('roomStateChanged', roomObj)
        }
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
                    roomObj.state = constants.roomState.DESTROYED
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
        emitActions.emitRoomInfoChanged(io, roomObj)
        console.log(`user(${user.userName}) leave room(${room.name})`)
    })
    socket.on('disconnect', function () {
        let userId = SocketUserMap[socket.id]
        for (let roomId in roomObjs) {
            let roomObj = roomObjs[roomId]
            if (roomObj) {
                let chessers = roomObj.chessers
                let chessser = chessers.find((chesser) => chesser.id === userId)
                if (chessser) {
                    roomObj.chessers = chessers.filter((chesser) => chesser.id !== userId)
                    // 房间里没人下棋, 销毁房间
                    if (roomObj.chessers.length === 0) {
                        roomObj.state = constants.roomState.DESTROYED
                        delete roomObjs[roomId]
                        roomArrays = roomArrays.filter((roomTmp) => roomTmp.id === roomObj.id)
                    }
                } else {
                    let watchers = roomObj.watchers
                    let watcher = watchers.find((watcher) => watcher.id === userId)
                    if (watcher) {
                        roomObj.watchers = watchers.filter((watcher) => watcher.id !== userId)
                    }
                }
            }
            socket.leave(roomId)
            emitActions.emitRoomInfoChanged(io, roomObj)
        }
        console.log(`a user(Id:${userId}) disconnected`)
    })
})

http.listen(3000, function () {
    console.log('listening on *:3000')
})