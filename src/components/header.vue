<template>
    <div class="header">
        <div class="header_text">
            <div class="user_info">
                <el-button v-if="!isLoggedIn.state" v-on:click="loginDialogVisible = true"
                           size="small">登录
                </el-button>
                <div v-else>
                    <el-dropdown>
                        <span class="el-dropdown-link" style="font-size: 16px;cursor: pointer;color: white">
                            <i class="fa fa-user"></i>&nbsp;{{ isLoggedIn.username }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link to="/admin" style="text-decoration: none;color: black">后台管理
                                </router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a v-on:click="logout" href="javascript:void(0)"
                                   style="color: red;font-weight: bold;text-decoration: none">退出登录</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div style="position: relative;z-index: 999">
                <div>
                    <h1 class="header_title primary">{{ header_title }}</h1>
                    <p class="header_title secondary">{{ header_title_extra }}</p>
                </div>
            </div>
            <canvas id="canvas"></canvas>
            <canvas id="canvasbg" style="background: black"></canvas>
        </div>
        <navBar></navBar>
        <el-dialog
                title="后台登录"
                :visible.sync="loginDialogVisible"
                :lock-scroll="false"
                v-on:opened="set_focus"
                :width="dialogWidth"
                :modal-append-to-body="true"
                :append-to-body="true">
            <el-form label-position="left" label-width="80px" v-bind:model="loginInfo" ref="login_form">
                <el-form-item label="用户名" prop="username"
                              v-bind:rules="login_rules">
                    <el-input ref="username_input" v-model="loginInfo.username"
                              v-on:keyup.enter.native="switch_to" clearable v-bind:disabled="loggingIn"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password"
                              v-bind:rules="login_rules">
                    <el-input ref="password_input" type="password"
                              v-model="loginInfo.password"
                              v-on:keyup.enter.native="login" clearable v-bind:disabled="loggingIn"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-on:click="loginDialogVisible = false">取 消</el-button>
                <el-button type="primary" v-on:click="login" v-bind:loading="loggingIn">登  录</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
import navBar from './nav-bar'
import Qs from 'qs'

export default {
  name: "blog_header",
  data() {
    return {
      header_title: 'Hello',
      header_title_extra: 'World',
      login_rules: [{required: true, message: '不能为空！'}],
      loginInfo: {
        username: '',
        password: '',
      },
      loginDialogVisible: false,
      loggingIn: false,
      isLoggedIn: {
        state: 0,
        username: ''
      },
      dialogWidth: '50%',
      headerBGCtrl1: '',
      headerBGCtrl2: '',
    }
  },
  methods: {
    headerBGInit() {
      let vm = this;
      var WIDTH = document.querySelector('.header_text').clientWidth;
      var HEIGHT = document.querySelector('.header_text').clientHeight;

      // min and max radius, radius threshold and percentage of filled circles
      var radMin = 5,
        radMax = 125,
        filledCircle = 60, //percentage of filled circles
        concentricCircle = 30, //percentage of concentric circles
        radThreshold = 25; //IFF special, over this radius concentric, otherwise filled

//min and max speed to move
      var speedMin = 0.3,
        speedMax = 2.5;

//max reachable opacity for every circle and blur effect
      var maxOpacity = 0.6;

//default palette choice
      var colors = ['52,168,83', '117,95,147', '199,108,23', '194,62,55', '0,172,212', '120,120,120'],
        bgColors = ['52,168,83', '117,95,147', '199,108,23', '194,62,55', '0,172,212', '120,120,120'],
        circleBorder = 10,
        backgroundLine = bgColors[0];
      var backgroundMlt = 0.85;

//min distance for links
      var linkDist = Math.min(WIDTH, HEIGHT) / 2.4,
        lineBorder = 2.5;

//most importantly: number of overall circles and arrays containing them
      var maxCircles = 12,
        points = [],
        pointsBack = [];

//populating the screen
      for (var i = 0; i < maxCircles * 2; i++) points.push(new Circle());
      for (var i = 0; i < maxCircles; i++) pointsBack.push(new Circle(true));

//experimental vars
      var circleExp = 1,
        circleExpMax = 1.003,
        circleExpMin = 0.997,
        circleExpSp = 0.00004,
        circlePulse = false;

//circle class
      function Circle(background) {
        //if background, it has different rules
        this.background = (background || false);
        this.x = randRange(-WIDTH / 2, WIDTH / 2);
        this.y = randRange(-HEIGHT / 2, HEIGHT / 2);
        this.radius = background ? hyperRange(radMin, radMax) * backgroundMlt : hyperRange(radMin, radMax);
        this.filled = this.radius < radThreshold ? (randint(0, 100) > filledCircle ? false : 'full') : (randint(0, 100) > concentricCircle ? false : 'concentric');
        this.color = background ? bgColors[randint(0, bgColors.length - 1)] : colors[randint(0, colors.length - 1)];
        this.borderColor = background ? bgColors[randint(0, bgColors.length - 1)] : colors[randint(0, colors.length - 1)];
        this.opacity = 0.05;
        this.speed = (background ? randRange(speedMin, speedMax) / backgroundMlt : randRange(speedMin, speedMax)); // * (radMin / this.radius);
        this.speedAngle = Math.random() * 2 * Math.PI;
        this.speedx = Math.cos(this.speedAngle) * this.speed;
        this.speedy = Math.sin(this.speedAngle) * this.speed;
        var spacex = Math.abs((this.x - (this.speedx < 0 ? -1 : 1) * (WIDTH / 2 + this.radius)) / this.speedx),
          spacey = Math.abs((this.y - (this.speedy < 0 ? -1 : 1) * (HEIGHT / 2 + this.radius)) / this.speedy);
        this.ttl = Math.min(spacex, spacey);
      };

      Circle.prototype.init = function () {
        Circle.call(this, this.background);
      }

//support functions
//generate random int a<=x<=b
      function randint(a, b) {
        return Math.floor(Math.random() * (b - a + 1) + a);
      }

      //generate random float
      function randRange(a, b) {
        return Math.random() * (b - a) + a;
      }

      //generate random float more likely to be close to a
      function hyperRange(a, b) {
        return Math.random() * Math.random() * Math.random() * (b - a) + a;
      }

//rendering function
      function drawCircle(ctx, circle) {
        //circle.radius *= circleExp;
        var radius = circle.background ? circle.radius *= circleExp : circle.radius /= circleExp;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, radius * circleExp, 0, 2 * Math.PI, false);
        ctx.lineWidth = Math.max(1, circleBorder * (radMin - circle.radius) / (radMin - radMax));
        ctx.strokeStyle = ['rgba(', circle.borderColor, ',', circle.opacity, ')'].join('');
        if (circle.filled == 'full') {
          ctx.fillStyle = ['rgba(', circle.borderColor, ',', circle.background ? circle.opacity * 0.8 : circle.opacity, ')'].join('');
          ctx.fill();
          ctx.lineWidth = 0;
          ctx.strokeStyle = ['rgba(', circle.borderColor, ',', 0, ')'].join('');
        }
        ctx.stroke();
        if (circle.filled == 'concentric') {
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, radius / 2, 0, 2 * Math.PI, false);
          ctx.lineWidth = Math.max(1, circleBorder * (radMin - circle.radius) / (radMin - radMax));
          ctx.strokeStyle = ['rgba(', circle.color, ',', circle.opacity, ')'].join('');
          ctx.stroke();
        }
        circle.x += circle.speedx;
        circle.y += circle.speedy;
        if (circle.opacity < (circle.background ? maxOpacity : 1)) circle.opacity += 0.01;
        circle.ttl--;
      }

//initializing function
      function init() {
        vm.headerBGCtrl1 = window.requestAnimationFrame(draw);
      }

//rendering function
      function draw() {

        if (circlePulse) {
          if (circleExp < circleExpMin || circleExp > circleExpMax) circleExpSp *= -1;
          circleExp += circleExpSp;
        }
        var ctxfr = document.getElementById('canvas').getContext('2d');
        var ctxbg = document.getElementById('canvasbg').getContext('2d');

        document.getElementById('canvas').width = WIDTH;
        document.getElementById('canvas').height = HEIGHT;
        document.getElementById('canvasbg').width = WIDTH;
        document.getElementById('canvasbg').height = HEIGHT;


        ctxfr.globalCompositeOperation = 'destination-over';
        ctxfr.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
        ctxbg.globalCompositeOperation = 'destination-over';
        ctxbg.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas

        ctxfr.save();
        ctxfr.translate(WIDTH / 2, HEIGHT / 2);
        ctxbg.save();
        ctxbg.translate(WIDTH / 2, HEIGHT / 2);

        //function to render each single circle, its connections and to manage its out of boundaries replacement
        function renderPoints(ctx, arr) {
          for (var i = 0; i < arr.length; i++) {
            var circle = arr[i];
            //checking if out of boundaries
            if (circle.ttl < 0) {
            }
            var xEscape = WIDTH / 2 + circle.radius,
              yEscape = HEIGHT / 2 + circle.radius;
            if (circle.ttl < -20) arr[i].init(arr[i].background);
            //if (Math.abs(circle.y) > yEscape || Math.abs(circle.x) > xEscape) arr[i].init(arr[i].background);
            drawCircle(ctx, circle);
          }
          for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
              var deltax = arr[i].x - arr[j].x;
              var deltay = arr[i].y - arr[j].y;
              var dist = Math.pow(Math.pow(deltax, 2) + Math.pow(deltay, 2), 0.5);
              //if the circles are overlapping, no laser connecting them
              if (dist <= arr[i].radius + arr[j].radius) continue;
              //otherwise we connect them only if the dist is < linkDist
              if (dist < linkDist) {
                var xi = (arr[i].x < arr[j].x ? 1 : -1) * Math.abs(arr[i].radius * deltax / dist);
                var yi = (arr[i].y < arr[j].y ? 1 : -1) * Math.abs(arr[i].radius * deltay / dist);
                var xj = (arr[i].x < arr[j].x ? -1 : 1) * Math.abs(arr[j].radius * deltax / dist);
                var yj = (arr[i].y < arr[j].y ? -1 : 1) * Math.abs(arr[j].radius * deltay / dist);
                ctx.beginPath();
                ctx.moveTo(arr[i].x + xi, arr[i].y + yi);
                ctx.lineTo(arr[j].x + xj, arr[j].y + yj);
                var samecolor = arr[i].color == arr[j].color;
                ctx.strokeStyle = ["rgba(", arr[i].borderColor, ",", Math.min(arr[i].opacity, arr[j].opacity) * ((linkDist - dist) / linkDist), ")"].join("");
                ctx.lineWidth = (arr[i].background ? lineBorder * backgroundMlt : lineBorder) * ((linkDist - dist) / linkDist); //*((linkDist-dist)/linkDist);
                ctx.stroke();
              }
            }
          }
        }

        var startTime = Date.now();
        renderPoints(ctxfr, points);
        renderPoints(ctxbg, pointsBack);
        var deltaT = Date.now() - startTime;

        ctxfr.restore();
        ctxbg.restore();

        vm.headerBGCtrl2 = window.requestAnimationFrame(draw);
      }

      init();
      //////////
    },
    set_focus() {
      this.$refs['username_input'].focus();
    },
    logout() {
      this.isLoggedIn.state = 0;
      this.isLoggedIn.username = '';
      sessionStorage.removeItem('LoggedIn');
    },
    login() {
      let vm = this;
      vm.$refs['login_form'].validate((valid) => {
        if (valid) {
          vm.loggingIn = true;
          let params = {
            username: this.loginInfo.username,
            password: this.loginInfo.password,
          };
          vm.$axios(this.API + '/backend.php?action=login', {
            params: params
          })
            .then(data => {
              if (data.data == 'PASS') {
                //登录成功
                sessionStorage.setItem('LoggedIn', vm.loginInfo.username);
                vm.isLoggedIn.state = 1;
                vm.isLoggedIn.username = vm.loginInfo.username;
                vm.loginDialogVisible = false;
              } else {
                //登录失败
                vm.$message.error('用户名或密码错误！');
                vm.loggingIn = false;
                setTimeout(function () {
                  vm.$refs['username_input'].focus();
                }, 500);
              }
            })
            .catch(error => {
              alert('无法连接到服务器');
              vm.loggingIn = false;
              console.log(error);
            })
        } else {
          return false;
        }
      })
    },
    switch_to() {
      this.$refs['password_input'].focus();
    }
  },
  activated() {
    //头部背景
    this.headerBGInit();
  },
  deactivated() {
    //暂停绘制头部
    [this.headerBGCtrl1, this.headerBGCtrl2].forEach(function (value, index) {
      window.cancelAnimationFrame(value);
    })

  },
  mounted() {
    if (sessionStorage.getItem('LoggedIn') != null) {
      //已经登录
      this.isLoggedIn.state = 1;
      this.isLoggedIn.username = sessionStorage.getItem('LoggedIn');
    }
  },
  components: {
    navBar,
  }
}
</script>

<style scoped>
    .header {
        position: relative;
    }

    .header_text {
        color: white;
        position: relative;
        padding: 30px 20px;
    }

    .user_info {
        position: absolute;
        right: 20px;
        top: 20px;
        z-index: 999;
    }

    #canvas {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
    }

    #canvasbg {
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
    }

    .hidden {
        display: none;
    }
</style>