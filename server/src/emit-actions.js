let emitActions = {
    emitRoomInfoChanged: function(io, room) {
        if (room) {
            io.emit('roomInfoChanged', {
                id: room.id,
                name: room.name,
                password: room.password,
                chessers: room.chessers,
                watchers: room.watchers,
                state: room.state
            })
        }
    },
    emitRoomsInfo: function(socket, roomArrays) {
        let rooms = []
        roomArrays.forEach((room) => {
            rooms.push({
                id: room.id,
                name: room.name,
                password: room.password,
                chessers: room.chessers,
                watchers: room.watchers,
                state: room.state
            })
        })
        socket.emit('roomsInfo', rooms)
    }
}

module.exports = emitActions