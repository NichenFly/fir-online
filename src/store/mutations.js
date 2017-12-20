import * as types from './mutation-types'
import { chesserStates } from 'constants/constants'

const mutations = {
    [types.SET_TITLE](state, title) {
        state.title = title
    },
    [types.SET_USER](state, user) {
        localStorage.setItem('user', JSON.stringify(user))
        state.user = user
    },
    [types.REMOVE_USER](state) {
        localStorage.removeItem('user')
        state.user = { userName: '' }
    },
    [types.SET_USER_NAME](state, userName) {
        localStorage.setItem('userName', userName)
        state.user.userName = userName
    },
    [types.SET_ROOMS](state, rooms) {
        state.rooms = rooms
    },
    [types.SET_CURRENT_ROOM](state, room) {
        let chessers = room.chessers
        if (chessers) {
            chessers.forEach((chesser) => {
                chesser.state = chesserStates[chesser.state]
            })
        }
        state.currentRoom = room
    },
    [types.SET_CURRENT_ROOM_STATE](state, roomState) {
        state.currentRoom.state = roomState
    },
    [types.SET_CURRENT_ROOM_CHESSES](state, chesses) {
        state.currentRoom.chesses = chesses
    },
    [types.SET_CURRENT_ROOM_PASSWORD](state, password) {
        state.currentRoomPassword = password
    }
}

export default mutations