<template>
    <div class="footer">
        <img v-show="dialogVisible" src="../../static/images/qcode1.jpg"
             style="width: 320px;position: fixed;z-index: 999;left: 0;top: 0;right: 0;bottom: 0;margin: auto;box-shadow: 0 0 5px lightgrey"
             title="点击关闭"
             alt="wx"
             @click="dialogVisible=!dialogVisible">
        <div class="content">
            <p style="font-size: 14px;">
                Copyright © 2017-2019 By Zhaozihang.net All Rights Reserved.
            </p>
            <div style="display: flex;justify-items: center;justify-content: center">
                <a href="https://github.com/Fromnowon" target="_blank">
                    <img src="../../static/images/github.png"
                         style="height: 24px;cursor: pointer;margin-top: 6px;margin-right: 16px"
                         alt="github">
                </a>
                <img src="../../static/images/weixin.png"
                     style="height: 24px;margin-top: 6px;margin-right: 16px;cursor: pointer"
                     alt="weixin" @click="dialogVisible=!dialogVisible">
                <a href="https://weibo.com/u/1877117253">
                    <img src="../../static/images/Weibo.png"
                         style="height: 24px;cursor: pointer;margin-top: 6px;margin-right: 16px"
                         alt="weibo">
                </a>
                <div style="display: inline;height: 24px;width: 1.5px;background: gray;align-self: center"></div>
                <img src="../../static/images/upyun_logo.png" style="height: 36px;cursor: pointer;margin-left: 16px"
                     alt="upyun"
                     @click="upyun">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "blog_footer",
        data() {
            return {
                dialogVisible: false
            }
        },
        methods: {
            upyun() {
                window.open('https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral');
            }
        }
    }
</script>

<style scoped>
    .footer {
        position: relative;
        z-index: 999;
        background: #394149;
    }

    .content {
        padding: 20px 0;
        text-align: center;
        font-size: 16px;
        color: white;
    }
</style>
