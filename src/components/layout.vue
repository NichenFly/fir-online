<template>
    <div>
        <div class="layout">
            <Menu mode="horizontal" theme="dark" active-name="1">
                <!-- <div class="layout-logo">
                    <router-link to="/">FIR</router-link>
                </div> -->
                <div class="layout-nav">
                    <MenuItem name="1">
                        <!-- <Icon type="ios-navigate"></Icon> -->
                        <router-link to="/">
                            <img src="../assets/fir.png" height="60">
                        </router-link>
                    </MenuItem>
                    <div class="info">{{title}}</div>
                    <Dropdown>
                        <span href="javascript:void(0)">
                            {{ userName }}
                            <Icon type="arrow-down-b"></Icon>
                        </span>
                        <DropdownMenu slot="list" v-if="user.userName">
                            <DropdownItem>
                                <div>个人信息</div>
                            </DropdownItem>
                            <DropdownItem>
                                <div @click="logout">退出登录</div>
                            </DropdownItem>
                        </DropdownMenu>
                        <DropdownMenu slot="list" v-if="!user.userName">
                            <DropdownItem>
                                <div @click="login">记个名字吧</div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Menu>
            <div class="layout-content">
                <div class="layout-content-main">
                    <keep-alive>
                        <router-view/>
                    </keep-alive>
                </div>
            </div>
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
        </div>
        <div class="hidden">
            <!-- <audio src="../assets/sounds/bg-music.aac" autoplay="autoplay" loop="loop"></audio> -->
        </div>
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
    computed: {
        userName() {
            return this.user.userName || '游客'
        },
        ...mapGetters([
            'title',
            'user'
        ])
    },
    methods: {
        login() {
            this.loginModal = true
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
                            avatar: `/static/imgs/avatar/${parseInt(Math.random() * 10) % 5}.jpg`
                        })
                        this.loginModal = false
                    }
                }
            })
        },
        logout() {
            console.log('remove')
            this.removeUser()
            if (this.$route.path !== '/hall') {
                this.$route.push('/hall')
            }
        },
        ...mapMutations({
            'setUser': 'SET_USER',
            'removeUser': 'REMOVE_USER'
        })
    }
}
</script>
<style lang="scss" scoped>
$layout-menu-height: 60px; // 导航菜单高度
$layout-background-color: #f5f7f9; // 布局内容的背景色
$layout-color: #fff; // 导航文本颜色
$layout-dropdown-width: 100px; // 大排行下拉菜单宽度
.layout{
    background: $layout-background-color;
    .ivu-menu-item {
        position: absolute;
        padding: 0;
        height: $layout-menu-height;
        line-height: $layout-menu-height;
    }
    .info {
        color: $layout-color;
        font-weight: 600;
    }
    .layout-nav > .ivu-dropdown{
        width: $layout-dropdown-width;
        float: right;
        position: absolute;
        right: 0;
        top: 0;
        color: $layout-color;
        &:hover{
            cursor: pointer;
        }
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: $layout-color;
        border-radius: 4px;
        .layout-content-main{
            padding: 10px;
        }
    }
}
</style>
