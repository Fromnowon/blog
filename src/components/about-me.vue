<template>
    <div class="about_me">
        <div>
            <img v-for="src in qcode" :src="src" alt="qcode">
        </div>
        <div style="margin: 20px 0">
            喜欢前端、php、python、C++等编程语言但都不熟练的伪程序猿
            <br><br>
            <iframe src="https://ghbtns.com/github-btn.html?user=Fromnowon&type=follow&count=true&size=large" frameborder="0"
                    scrolling="0" width="220px" height="30px"></iframe>
        </div>
    </div>
</template>

<script>
export default {
  name: "about-me",
  data() {
    return {
      qcode: ['./static/images/qcode1.JPG', './static/images/qcode2.JPG'],
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