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
                            <Tooltip :content="room.chessers[0].name" placement="top" :delay="500" v-if="room.chessers[0]">
                                <div class="left">
                                    <img src="../assets/imgs/index.png">
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
                            <Tooltip :content="room.chessers[1].name" placement="top" :delay="500" v-if="room.chessers[1]">
                                <div class="right">
                                    <img src="../assets/imgs/index.png">
                                </div>
                            </Tooltip>
                        </div>
                        <div><h3>0 人围观</h3></div>
                    </Card>
                </div>
            </Col>
        </Row>
        <Modal
            v-model="loginModal"
            title="请输入您的名字">
            <Form ref="formLogin" :model="formLogin" :rules="ruleLogin" :label-width="80">
                <FormItem label="名字" prop="userName">
                    <Input type="text" v-model="formLogin.userName" placeholder="请输入您的名字"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formLogin')">确定</Button>
                <Button type="ghost" @click="handleReset('formLogin')" style="margin-left: 8px">重置</Button>
            </div>
        </Modal>
        <Modal
            v-model="roomModal"
            title="创建房间">
            <Form ref="formRoom" :model="formRoom" :rules="ruleRoom" :label-width="80">
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
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import md5 from 'js-md5'

export default {
    data() {
        return {
            loginModal: false,
            formLogin: {
                userName: ''
            },
            ruleLogin: {
                userName: [
                    { required: true, message: '名字不允许为空', trigger: 'blur' }
                ]
            },
            roomModal: false,
            formRoom: {
                roomName: '',
                roomPassowrd: ''
            },
            ruleRoom: {
                roomName: [
                    { required: true, message: '房间名字不允许为空', trigger: 'blur' }
                ]
            }
        }
    },
    sockets: {
        connect: function(socket) {
            console.log('socket connected')
        },
        roomCreated: function(roomId) {
            this.roomModal = false
            this.$router.push(`/room/${roomId}`)
        },
        // 接收房间信息
        changedRoomInfo: function(changedRoom) {
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
    mounted() {
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
                this.loginModal = true
            }
        },
        joinRoom(roomId) {
            // 如果设置了用户
            if (this.user.userName) {
                this.$router.push(`/room/${roomId}`)
            } else {
                this.loginModal = true
            }
        },
        _createRoom() {
            if (this.user.userName) {
                let roomId = md5(`${this.$socket.id}_${new Date().getTime()}`)
                let room = {
                    id: `_${roomId}`,
                    name: this.formRoom.roomName,
                    password: this.formRoom.roomPassowrd
                }
                let user = {
                    id: this.user.userName.replace(/\d|-/g, ''),
                    name: this.user.userName,
                    avatar: `${parseInt(Math.random() * 10) % 5}.jpg`
                }
                this.$socket.emit('create-room', room, user)
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    return
                }
                if (name === 'formLogin') {
                    let userName = this.formLogin.userName
                    if (userName) {
                        this.setUser({
                            id: userName,
                            userName,
                            avatar: `${parseInt(Math.random() * 10) % 5}.jpg`
                        })
                        this.loginModal = false
                    }
                } else if (name === 'formRoom') {
                    this._createRoom()
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
            'setChangedRoom': 'SET_CHANGED_ROOM'
        })
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
