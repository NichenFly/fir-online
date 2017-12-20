export const title = state => state.title
export const user = (state) => {
    let user = state.user
    if (!user.userName) {
        let userStr = localStorage.getItem('user')
        if (userStr) {
            user = JSON.parse(userStr)
        }
    }
    return user
}
export const userName = (state) => {
    let userName = state.user.userName
    if (!userName) {
        userName = localStorage.getItem('userName')
    }
    return userName
}
export const currentRoom = state => state.currentRoom
export const rooms = state => state.rooms
export const currentRoomPassword = state => state.currentRoomPassword