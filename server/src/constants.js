let constants = {
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
module.exports = constants