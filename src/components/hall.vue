<template>
    <div>
        <Row>
            <Col span="6">
                <div @click="createRoom">
                    <Card>
                        <div class="create-room">
                            <Icon type="plus-round"></Icon>
                        </div>
                    </Card>
                </div>
            </Col>
            <Col span="6" v-for="(room, index) in rooms" :key="index">
                <div @click="joinRoom(room.id)">
                    <Card>
                        <p slot="title">{{ room.name }}</p>
                        <div class="room-container">
                            <Tooltip :content="room.chessers[0].userName" placement="top" :delay="500" v-if="room.chessers[0]">
                                <div class="left">
                                    <img :src="room.chessers[0].avatar">
                                </div>
                            </Tooltip>
                            <div class="center">
                                <img src="../assets/imgs/index.png">
                            </div>
                            <Tooltip content="暂无" placement="top" :delay="500" v-if="!room.chessers[1]">
                                <div class="right">
                                    <img src="../assets/imgs/index.png">
                                </div>
                            </Tooltip>
                            <Tooltip :content="room.chessers[1].userName" placement="top" :delay="500" v-if="room.chessers[1]">
                                <div class="right">
                                    <img :src="room.chessers[1].avatar">
                                </div>
                            </Tooltip>
                        </div>
                        <div><h3>0 人围观</h3></div>
                    </Card>
                </div>
            </Col>
        </Row>
        <Modal
            v-model="roomModal"
            title="创建房间">
            <Form ref="formRoom" 
                :model="formRoom" 
                :rules="formRules" 
                :label-width="80">
                <FormItem label="房间名字" prop="roomName">
                    <Input type="text" v-model="formRoom.roomName" placeholder="请输入房间名字"></Input>
                </FormItem>
                <FormItem label="密码" prop="roomPassword">
                    <Input type="text" v-model="formRoom.roomPassowrd" placeholder="设置房间密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formRoom')">确定</Button>
                <Button type="ghost" @click="handleReset('formRoom')" style="margin-left: 8px">重置</Button>
            </div>
        </Modal>
        <Modal
            v-model="passwordModal"
            title="请输入您的密码">
            <Form ref="formPassword" 
                :model="formPassword"
                :rules="formRules"
                :label-width="80">
                <FormItem label="密码" prop="password">
                    <Input type="text" v-model="formPassword.password" placeholder="请输入您的密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formPassword')">确定</Button>
                <Button type="ghost" @click="handleReset('formPassword')" style="margin-left: 8px">重置</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import md5 from 'js-md5'

export default {
    data() {
        const validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                let password = this.formPassword.password
                let willJoinedRoom = this.willJoinedRoom
                if (willJoinedRoom.password === md5(`${willJoinedRoom.id}_${password}`)) {
                    this.setCurrentRoomPassword(willJoinedRoom.password)
                    callback()
                } else {
                    callback(new Error('密码不正确'))
                }
            }
        }
        return {
            roomModal: false,
            formRoom: {
                roomName: '',
                roomPassowrd: ''
            },
            formRules: {
                roomName: [
                    { required: true, message: '房间名字不允许为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '房间密码不允许为空' },
                    { validator: validatePassword, trigger: 'blur' }
                ]
            },
            passwordModal: false,
            formPassword: {
                password: ''
            }
        }
    },
    sockets: {
        connect: function(socket) {
            console.log('socket connected')
            this.$socket.emit('get-rooms-info')
            this.setTitle('大厅')
        },
        roomCreated: function(roomId) {
            this.roomModal = false
            this.$router.push(`/room/${roomId}`)
        },
        // 接收房间信息
        roomInfoChanged: function(changedRoom) {
            this.setChangedRoom(changedRoom)
        },
        roomsInfo: function(rooms) {
            this.setRooms(rooms)
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'rooms'
        ])
    },
    activated() {
        this.willJoinedRoom = {}
        console.log('active connect')
        this.$socket.emit('get-rooms-info')
        this.setTitle('大厅')
    },
    methods: {
        createRoom() {
            // 创建房间
            if (this.user.userName) {
                this.roomModal = true
            } else {
                this.$Modal.warning({
                    title: '警告',
                    content: '请先记个名字'
                })
            }
        },
        joinRoom(roomId) {
            // 如果设置了用户
            if (this.user.userName) {
                let room = this.rooms.find(r => r.id === roomId)
                if (room) {
                    if (!room.password || (room.password && room.password === this.setCurrentRoomPassword)) {
                        this.$router.push(`/room/${roomId}`)
                    } else {
                        this.willJoinedRoom = room
                        this.formPassword.password = ''
                        this.passwordModal = true
                    }
                }
            } else {
                this.$Modal.warning({
                    title: '警告',
                    content: '请先记个名字'
                })
            }
        },
        _createRoom() {
            if (this.user.userName) {
                let roomId = md5(`${this.$socket.id}_${new Date().getTime()}`).substring(10)
                let password = this.formRoom.roomPassowrd
                let room = {
                    id: `_room_${roomId}`,
                    name: this.formRoom.roomName,
                    password: password ? md5(`_room_${roomId}_${password}`) : password
                }
                /* let user = {
                    id: `_user_${this.user.userName}`,
                    name: this.user.userName,
                    avatar: `/static/imgs/avatar/${parseInt(Math.random() * 10) % 5}.jpg`
                } */
                this.setCurrentRoomPassword(room.password)
                this.$socket.emit('create-room', room, this.user)
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    return
                }
                switch (name) {
                case 'formLogin':
                    let userName = this.formLogin.userName
                    if (userName) {
                        this.setUser({
                            id: userName,
                            userName,
                            avatar: `/static/imgs/avatar/${parseInt(Math.random() * 10) % 5}.jpg`
                        })
                    }
                    break
                case 'formRoom':
                    this._createRoom()
                    break
                case 'formPassword':
                    /* let password = this.formPassword.password
                    let willJoinedRoom = this.willJoinedRoom
                    if (willJoinedRoom.password === md5(`${willJoinedRoom.id}_${password}`)) {
                        this.setCurrentRoomPassword(willJoinedRoom.password)
                        this.willJoinedRoom = {}
                        this.passwordModal = false
                    } */
                    this.passwordModal = false
                    this.$router.push(`/room/${this.willJoinedRoom.id}`)
                    this.willJoinedRoom = {}
                    break
                default:
                    break
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        ...mapMutations({
            'setTitle': 'SET_TITLE',
            'setUser': 'SET_USER',
            'setUserName': 'SET_USER_NAME',
            'setRooms': 'SET_ROOMS',
            'setCurrentRoomPassword': 'SET_CURRENT_ROOM_PASSWORD'
        }),
        ...mapActions([
            'setChangedRoom'
        ])
    },
    components: {
    }
}
</script>
<style lang="scss" scoped>
$room-user-width-height: 70px; // 用户头像占据的宽高
$room-user-head-width-height: 60px; // 用户头像显示的宽高
$room-center-chess-preview-width: 120px; // 中间局势的大小
.create-room {
    height: 202px;
    line-height: 202px;
    font-size: 150px;
}
.ivu-col {
    padding: 5px;
}
.ivu-card {
    &:hover {
        cursor: pointer;
    }
}
.room-container {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    & .left, & .right {
        width: $room-user-width-height;
        height: $room-user-width-height;
        & > img {
            width: $room-user-head-width-height;
            height: $room-user-head-width-height;
            border-radius: 50%;
        }
    }
    & > .center {
        width: $room-center-chess-preview-width;
        & > img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
