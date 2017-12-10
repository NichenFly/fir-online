import * as types from './mutation-types'

const mutations = {
    [types.SET_USER](state, user) {
        state.user = user
    },
    [types.SET_USER_NAME](state, userName) {
        state.user.userName = userName
    },
    [types.SET_ROOMS](state, rooms) {
        state.rooms = rooms
    },
    [types.SET_CURRENT_ROOM](state, room) {
        state.currentRoom = room
    }
}

export default mutations