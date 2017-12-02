<template>
    <div>
        <div class="layout">
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="layout-logo">
                    <router-link to="/">FIR</router-link>
                </div>
                <div class="layout-nav">
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
    .layout{
        // border: 1px solid #d7dde4;
        background: #f5f7f9;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        // background: #5b6270;
        color: #fff;
        border-radius: 3px;
        float: left;
        // position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        width: 100px;
        float: right;
        color: #fff;
        &:hover{
            cursor: pointer;
        }
    }
    .layout-assistant{
        width: 300px;
        margin: 0 auto;
        height: inherit;
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
