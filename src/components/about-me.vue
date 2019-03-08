<template>
    <div class="about_me">
        <div style="margin: 20px 0;font-size: 14px">
            <el-row>
                <el-col :md="16">
                    <div style="margin-bottom: 50px">
                        <p>本博客成分：</p>
                        <p>框架：<a target="_blank" href="https://vuejs.org/">Vue</a></p>
                        <p>UI库：<a target="_blank" href="https://element.eleme.io">Element</a></p>
                        <p>服务端：Nginx+PHP+MySQL</p>
                    </div>
                    <p>捣鼓web前端、php、python、c/c++等</p>
                    <iframe src="https://ghbtns.com/github-btn.html?user=Fromnowon&type=follow&count=true&size=large"
                            frameborder="0"
                            scrolling="0" width="220px" height="30px">
                    </iframe>
                    <br><br>
                </el-col>
                <el-col :md="8">
                    <div id="weather-view-he"></div>
                </el-col>
            </el-row>

        </div>
    </div>
</template>

<script>
    export default {
        name: "about-me",
        data() {
            return {}
        },
        mounted() {
            //天气
            const s1 = document.createElement('script');
            s1.type = 'text/javascript';
            s1.innerText = "WIDGET = {ID: 'tQsd2H7syq'}";
            document.body.appendChild(s1);
            const s2 = document.createElement('script');
            s2.type = 'text/javascript';
            s2.src = 'https://apip.weatherdt.com/view/static/js/r.js?v=1111';
            document.body.appendChild(s2);
        }
    }
</script>

<style scoped>
    .about_me {
        min-height: 300px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .about_me img {
        margin-right: 5px;
        height: 200px;
        width: 140px;
        box-shadow: 3px 3px 10px lightgrey;
    }
</style>