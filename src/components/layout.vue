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
                            <img src="src/assets/fir.png" height="60">
                        </router-link>
                    </MenuItem>
                    <div class="info">Kitty 正在与 大王对战</div>
                    <Dropdown>
                        <span href="javascript:void(0)">
                            Kitty
                            <Icon type="arrow-down-b"></Icon>
                        </span>
                        <DropdownMenu slot="list">
                            <DropdownItem>个人信息</DropdownItem>
                            <DropdownItem>退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Menu>
            <div class="layout-content">
                <div class="layout-content-main">
                    <router-view/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
}
</script>
<style lang="scss" scoped>
    .ivu-menu-item {
        position: absolute;
        padding: 0;
        height: 60px;
        line-height: 60px;
    }
    .info {
        color: #fff;
        font-weight: 600;
    }
    .layout-nav > .ivu-dropdown{
        width: 100px;
        float: right;
        position: absolute;
        right: 0;
        top: 0;
        color: #fff;
        &:hover{
            cursor: pointer;
        }
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
</style>
