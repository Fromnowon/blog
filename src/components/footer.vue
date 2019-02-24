<template>
    <div class="footer">
        <div class="content">
            <p style="font-size: 14px">Designed by <a style="color: #3a8ee6;text-decoration: none" href="https://github.com/Fromnowon">Fromnowon</a></p>
            <img src="../../static/images/upyun_logo.png" style="height: 36px;cursor: pointer" alt="upyun"
                 @click="upyun">
        </div>
    </div>
</template>

<script>
    export default {
        name: "blog_footer",
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
