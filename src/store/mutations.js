import * as types from './mutation-types'

const mutations = {
    [types.SET_USER](state, user) {
        state.user = user
    },
    [types.SET_USER_NAME](state, userName) {
        state.user.userName = userName
    }
}

export default mutations