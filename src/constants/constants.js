// 棋格的宽度
export const CHESS_WIDTH = 40

export const CHESS_COLOR_BLACK = true

export const CHESS_COLOR_WHITE = false

export const CHESS_ROLE = {
    chesser: 'chesser',
    watcher: 'watcher'
}
// 对弈者的显示状态
export const chesserStates = ['未就绪', '已准备']

export const roomState = {
    NOT_START: 0,
    READY: 1,
    RUNNING: 2,
    END: 3,
    DESTROYED: 4
}