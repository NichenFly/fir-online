import * as types from './mutation-types'

export const addChessToCurrentRoom = function ({commit, state}, chess) {
    let chesses = state.currentRoom.chesses.slice()
    if (chesses) {
        let length = chesses.length
        if (length > 0) {
            let justChess = Object.assign({}, chesses[length - 1])
            justChess.isJust = false
            chesses[length - 1] = justChess
        }
        chesses.push(chess)
    }
    commit(types.SET_CURRENT_ROOM_CHESSES, chesses)
}