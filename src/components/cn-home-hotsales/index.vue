<template>
    <view class="cn-home-hotsales">
        <r-section title="热销商品" type="circle" typeColor="red">
            <template #rightIcon>
                <text>更多</text>
                <uni-icons type="right" />
            </template>
            <view class="hotsales-box">
                <view class="item">
                    <swiper class="swiper" :style="{ '--pdbom': pdbom, '--height': height }" circular autoplay>
                        <swiper-item v-for="(item, index) in lists" :key="index" @click="change(item)" class="swiper-item">
                            <cn-img class="cn-img" :src="item.url" :large="large" width="100%" height="100%"
                                mode="aspectFill" radius="10rpx"></cn-img>
                            <view v-if="item.title" class="title title-box">
                                <view class="title-text">{{ item.title }}</view>
                                <view>
                                    <span style="color: rgb(255, 59, 59);font-size: 28rpx;font-weight: bold;"><span
                                            style="font-size: 20rpx;">¥</span>100</span>
                                    <span style="font-size: 24rpx;margin-left: 20rpx;">已售2030件</span>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
                <view class="item-box">
                    <view v-for="item in 2" :key="item" class="item">
                        <cn-img class="cn-img"
                            src="https://img2.baidu.com/it/u=3956539909,3360437590&fm=253&fmt=auto&app=120&f=JPEG?w=1140&h=641"
                            :large="large" width="100%" height="100%" mode="aspectFill" radius="10rpx"></cn-img>
                        <view class="title title-box">
                            <span class="title-text">五香辣椒面，好吃不贵</span>
                            <view>
                                <span style="color: rgb(255, 59, 59);font-size: 28rpx;font-weight: bold;"><span
                                        style="font-size: 20rpx;">¥</span>100</span>
                                <span style="font-size: 24rpx;margin-left: 20rpx;">已售2030件</span>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </r-section>
    </view>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    list: {
        type: Array,
        default: [
            { url: "https://img2.baidu.com/it/u=3956539909,3360437590&fm=253&fmt=auto&app=120&f=JPEG?w=1140&h=641", title: "毕节青辣椒" },
            { url: "https://m.cnr.cn/news/20160712/W020160712301714448271.jpg", title: "毕节青辣椒" },
            { url: "https://img2.baidu.com/it/u=2525180953,799649069&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500", title: "毕节青辣椒" }
        ],
    },
    pdbom: {
        type: String,
        default: "0rpx",
    },
    large: {
        type: Boolean,
    },
    title: {
        type: Boolean,

    },
    height: {
        type: String,
        default: "100%",
    },
});
const lists: any = computed(() => {
    return props.list || [];
});
function change(item: any) { }
</script>
<style lang="scss" scoped>
.cn-home-hotsales {
    width: calc(100% - 40rpx);
    margin: 20rpx auto;
}

.hotsales-box {
    height: 380rpx;
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-template-rows: auto;
    gap: 16rpx;
    padding: 20rpx;
    background-color: #ffffff;
    border-radius: 0 0 10rpx 10rpx;

    .item {
        background-color: #8f8f8f17;
        border: 2rpx #ffffff solid;
        border-radius: 10rpx;
        position: relative;
    }

    .item-box {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: repeat(2, auto);
        gap: 16rpx;
    }
}

.swiper {
    width: 100%;
    height: var(--height);
    padding-bottom: var(--pdbom);
    background: #ffffff;
}

.swiper-item {
    width: 100%;
    height: 100%;
}

.title {
    width: calc(100% - 16rpx);
    padding: 8rpx;
    // border-top: 20rpx #030f2700 solid;
    // border-bottom: 20rpx #030f2700 solid;
    position: absolute;
    z-index: 5;
    bottom: 0;
    background: #030f2769;
    border-bottom-right-radius: 10rpx;
    border-bottom-left-radius: 10rpx;
    color: #fff;
    letter-spacing: 4rpx;
    font-size: 28rpx;
    font-family: 仿宋;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 1; //行数
    line-clamp: 1;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
    .title-text {
        width:inherit;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden; //溢出内容隐藏
        text-overflow: ellipsis; //文本溢出部分用省略号表示
        display: -webkit-box; //特别显示模式
        -webkit-line-clamp: 1; //行数
        line-clamp: 1;
        -webkit-box-orient: vertical; //盒子中内容竖直排列
    }
}

.title-box {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
</style>