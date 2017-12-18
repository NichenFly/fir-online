import * as types from './mutation-types'
import { roomState } from '../constants/constants'

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

export const setChangedRoom = function({commit, state}, changedRoom) {
    let tmpRooms = state.rooms.slice()
    let roomIndex = tmpRooms.findIndex((room) => room.id === changedRoom.id)
    if (~roomIndex) {
        if (changedRoom.state === roomState.DESTROYED) {
            tmpRooms.splice(roomIndex, 1)
        } else {
            tmpRooms[roomIndex] = changedRoom
        }
    } else {
        tmpRooms.unshift(changedRoom)
    }
    commit(types.SET_ROOMS, tmpRooms)
}