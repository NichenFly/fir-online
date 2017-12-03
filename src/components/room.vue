<template>
    <div>
        <div class="chess-area">
            <div class="chess-lines">
                <div class="line-horizontal">
                    <div class="line" style="top: 0px;"></div>
                    <div class="line" style="top: 40px;"></div>
                    <div class="line" style="top: 80px;"></div>
                    <div class="line" style="top: 120px;"></div>
                    <div class="line" style="top: 160px;"></div>
                    <div class="line" style="top: 200px;"></div>
                    <div class="line" style="top: 240px;"></div>
                    <div class="line" style="top: 280px;"></div>
                    <div class="line" style="top: 320px;"></div>
                    <div class="line" style="top: 360px;"></div>
                    <div class="line" style="top: 400px;"></div>
                    <div class="line" style="top: 440px;"></div>
                    <div class="line" style="top: 480px;"></div>
                    <div class="line" style="top: 520px;"></div>
                    <div class="line" style="top: 560px;"></div>
                </div>
                <div class="line-vertical">
                    <div class="line" style="left: 0px;"></div>
                    <div class="line" style="left: 40px;"></div>
                    <div class="line" style="left: 80px;"></div>
                    <div class="line" style="left: 120px;"></div>
                    <div class="line" style="left: 160px;"></div>
                    <div class="line" style="left: 200px;"></div>
                    <div class="line" style="left: 240px;"></div>
                    <div class="line" style="left: 280px;"></div>
                    <div class="line" style="left: 320px;"></div>
                    <div class="line" style="left: 360px;"></div>
                    <div class="line" style="left: 400px;"></div>
                    <div class="line" style="left: 440px;"></div>
                    <div class="line" style="left: 480px;"></div>
                    <div class="line" style="left: 520px;"></div>
                    <div class="line" style="left: 560px;"></div>
                </div>
            </div>
            <div class="chess-keys">
                <div class="chess black-chess just" style="top: 45px; left: 5px;"></div>
                <div class="chess black-chess just" style="top: 85px; left: 5px;"></div>
                <div class="chess black-chess just" style="top: 125px; left: 5px;"></div>
                <div class="chess black-chess just" style="top: 165px; left: 5px;"></div>
                <div class="chess black-chess just" style="top: 205px; left: 5px;"></div>
                <div class="chess white-chess" style="top: 5px; left: 5px"></div>
                <div class="chess white-chess" style="top: 45px; left: 45px"></div>
                <div class="chess white-chess" style="top: 85px; left: 85px"></div>
                <div class="chess white-chess" style="top: 125px; left: 125px"></div>
                <div class="chess white-chess" style="top: 125px; left: 165px"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            visible: false
        }
    },
    methods: {
        show() {
            this.visible = true
        }
    }
}
</script>
<style lang="scss" scoped>
$chess-width-height: 560px; // 棋盘宽度,高度
$background-img: url(../assets/imgs/bg-img.png); // 棋盘背景图片
$background-fir-img: url(../assets/imgs/fire.gif); // fired状态的背景图
$chess-key-width: 30px; // 棋子的直径
$chess-area-width-height: 600px; // 棋盘宽高
$chess-area-padding: 20px; // 棋盘内边距
$chess-area-redius: 10px; // 棋盘区域的圆角
.chess-area {
    display: inline-flex;
    position: relative;
    background-image: $background-img;
    background-repeat: repeat;
    padding: $chess-area-padding;
    width: $chess-area-width-height;
    height: $chess-area-width-height;
    border-radius: $chess-area-redius;
    &:hover {
        cursor: pointer;
    }
}
.chess-lines {
    width: $chess-width-height;
    height: $chess-width-height;
    position: relative;
    & > .line-horizontal {
        & .line {
            position: absolute;
            height: 2px;
            width: 100%;
            background-color: #000;
            box-shadow: 0px 1px 1px #333, 0px -1px 1px #333
        }
    }
    & > .line-vertical {
        & .line {
            position: absolute;
            height: 100%;
            width: 2px;
            background-color: #000;
            box-shadow: 1px 0px 1px #333, -1px 0px 1px #333
        }
    }
}
.chess-keys {
    width: $chess-width-height;
    height: $chess-width-height;
    position: absolute;
    top: 0;
    left: 0;
    .chess {
        width: $chess-key-width;
        height: $chess-key-width;
        border-radius: 50%;
        z-index: 100;
    }
    .black-chess {
        position: absolute;
        background-color: #aaa;
        box-shadow: 4px -2px 20px 7px #000 inset, 1px 2px 5px #000;
    }
    .white-chess {
        position: absolute;
        background-color: #F7FBBA;
        box-shadow: 4px -1px 20px 7px #ddd inset, 1px 2px 5px #000;
    }
    .just::before {
        content: "";
        width: 60px;
        height: 60px;
        background-image: $background-fir-img;
        background-size: 60px 60px;
        position: absolute;
        top: -15px;
        left: -15px;
    }
}

</style>
