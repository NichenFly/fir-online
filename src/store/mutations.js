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
    [types.SET_CHANGED_ROOM](state, changedRoom) {
        let tmpRooms = state.rooms
        let roomIndex = tmpRooms.findIndex((room) => room.id === changedRoom.id)
        if (~roomIndex) {
            state.rooms[roomIndex] = changedRoom
        } else {
            state.rooms.push(changedRoom)
        }
    },
    [types.SET_CURRENT_ROOM](state, room) {
        let chessers = room.chessers
        if (chessers) {
            chessers.forEach((chesser) => {
                chesser.state = chesserStates[chesser.state]
            })
        }
        state.currentRoom = room
    }
}

export default mutations