var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const path = require('path')
var constants = {
    CHESS_COLOR_BLACK: true,
    CHESS_COLOR_WHITE: false
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
roomObjs.default = {
    id: 'default',
    name: '默认',
    users: [],
    data: []
}

io.on('connection', function (socket) {
    socket.on('join-room', function (roomId) {
        socket.join(roomId)
        roomObjs.default.users.push(socket.id)
        let roomUsers = roomObjs.default.users
        if (roomUsers.length === 1) {
            socket.emit('thisTimeChess', { role: 'chessing', chessColor: constants.CHESS_COLOR_BLACK, turnMe: true })
        } else if (roomUsers.length === 2) {
            socket.emit('thisTimeChess', { role: 'chessing', chessColor: constants.CHESS_COLOR_WHITE })
        } else {
            socket.emit('thisTimeChess', { role: 'watching' })
        }
    })

    socket.on('down-chess', function (msg) {
        console.log('pos: ' + msg.x + ',' + msg.y, msg.chessColor)
        socket.broadcast.to(roomObjs.default.id).emit('downChess', msg)
    })
    socket.on('disconnect', function () {
        socket.leave(roomObjs.default.id)
        console.log(roomObjs.default.id, 'disconnected')
    })
})

http.listen(3000, function () {
    console.log('listening on *:3000')
})