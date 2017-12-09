<template>
    <div>
        <Row>
            <Col span="6">
                <div @click="joinRoom(1)">
                    <Card>
                        <p slot="title">Funny room</p>
                        <div class="room-container">
                            <Tooltip content="Kitty" placement="top" :delay="500">
                                <div class="left">
                                    <img src="../assets/imgs/index.png">
                                </div>
                            </Tooltip>
                            <div class="center">
                                <img src="../assets/imgs/index.png">
                            </div>
                            <Tooltip content="大王" placement="top" :delay="500">
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
                    <Input type="text" v-model="formLogin.userName"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formLogin')">确定</Button>
                <Button type="ghost" @click="handleReset('formLogin')" style="margin-left: 8px">重置</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

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
            }
        }
    },
    sockets: {
        connect: function(socket) {
            console.log('socket connected')
        },
        roomInfos: function(rooms) {
            console.log(rooms)
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'userName'
        ])
    },
    actived() {
        setInterval(() => {
            this.$socket.emit('getRoomInfos')
        }, 3000)
    },
    methods: {
        joinRoom(roomId) {
            // 如果设置了用户
            console.log(this.user)
            if (this.user.userName) {
                this.$router.push('/room/1')
            } else {
                this.loginModal = true
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    return
                }
                let userName = this.formLogin.userName
                if (userName) {
                    this.setUserName(userName)
                    this.$router.push('/room/1')
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        ...mapMutations({
            'setUserName': 'SET_USER_NAME'
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
