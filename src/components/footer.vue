<template>
    <div class="footer">
        <div class="content">
            <p style="font-size: 14px">ZZH的个人博客</p>
            <img src="../../static/images/upyun_logo.png" style="height: 42px;cursor: pointer" alt="upyun"
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
        background: #394149;
    }

    .content {
        padding: 20px 0;
        text-align: center;
        font-size: 16px;
        color: white;
    }
</style>
