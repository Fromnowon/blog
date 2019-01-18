<template>
    <div class="about_me">
        <div style="margin: 20px 0;font-size: 14px">
            <div style="margin-bottom: 50px">
                <p>本博客成分：</p>
                <p>框架：<a target="_blank" href="https://vuejs.org/">Vue</a></p>
                <p>UI库：<a target="_blank" href="https://element.eleme.io">Element</a></p>
                <p>服务端：Nginx+PHP+MySQL</p>
            </div>
            <p>喜欢前端、php、python、C++等编程语言但都不熟练的伪程序猿</p>
            <iframe src="https://ghbtns.com/github-btn.html?user=Fromnowon&type=follow&count=true&size=large"
                    frameborder="0"
                    scrolling="0" width="220px" height="30px"></iframe>
        </div>
    </div>
</template>

<script>
export default {
  name: "about-me",
  data() {
    return {
    }
  }
}
</script>

<style scoped>
    .about_me {
        min-height: 300px;
    }

    .about_me img {
        margin-right: 5px;
        height: 200px;
        width: 140px;
        box-shadow: 3px 3px 10px lightgrey;
    }
</style>