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
$WIDTH: 560px;
$HEIGHT: 560px;
$BACKGROUND_COLOR: #ede5c1;
$BACKGROUND_IMG: url(../assets/imgs/bg-img.png);
$BACKGROUND_FIRE_IMG: url(../assets/imgs/fire.gif);
$CHESS_WIDTH: 30px;
.chess-area {
    display: inline-flex;
    background-image: $BACKGROUND_IMG;
    background-repeat: repeat;
    padding: 20px;
    width: 600px;
    height: 600px;
    position: relative;
    &:hover {
        cursor: pointer;
    }
}
.chess-lines {
    width: $WIDTH;
    height: $HEIGHT;
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
    width: $WIDTH;
    height: $HEIGHT;
    position: absolute;
    top: 0;
    left: 0;
    .chess {
        width: $CHESS_WIDTH;
        height: $CHESS_WIDTH;
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
        background-image: $BACKGROUND_FIRE_IMG;
        background-size: 60px 60px;
        position: absolute;
        top: -15px;
        left: -15px;
    }
}

</style>
