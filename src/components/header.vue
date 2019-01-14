<template>
    <div class="header">
        <div class="header_text">
            <div class="user_info">
                <el-button v-if="!isLoggedIn.state" v-on:click="loginDialogVisible = true"
                           size="small" type="primary">登录
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
            <canvas id="canvas">你的浏览器不支持canvas</canvas>
        </div>
        <navBar></navBar>
        <el-dialog
                title="站长登录"
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
    }
  },
  methods: {
    headerBGInit() {
      // 屏幕宽度
      var WINDOW_WIDTH = this.$util.getDomByClass('header_text')[0].offsetWidth;
      // 屏幕高度
      var WINDOW_HEIGHT = this.$util.getDomByClass('header_text')[0].offsetHeight;
      var canvas, context;
      // 星星数量
      var num = 100;
      // 星星数组
      var stars = [];
      // 流星索引
      var rnd;
      canvas = document.getElementById('canvas');
      canvas.width = WINDOW_WIDTH;
      canvas.height = WINDOW_HEIGHT;

      context = canvas.getContext('2d');
      // 生成星星
      addStar();
      // 渲染至画布上
      setInterval(render, 33);
      // // 增加流星
      // meteor();


      // 生成流星的索引号
      // function meteor() {
      //   var time = Math.round(Math.random() * 3000 + 33);
      //   setTimeout(function () {
      //     rnd = Math.ceil(Math.random() * stars.length);
      //     meteor();
      //   }, time);
      // }

      // 画布渲染
      function render() {
        // 画布背景色(黑色)
        context.fillStyle = '#0f1f0f';
        // 画布位置
        context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

        for (var i = 0; i < num; i++) {
          var star = stars[i];

          // 画流星
          // if (i == rnd) {
          //   star.vx = -5;
          //   star.vy = 20;
          //   context.beginPath();
          //   context.strokeStyle = 'rgba(255,255,255,' + star.alpha + ')';
          //   context.lineWidth = star.r;
          //   context.moveTo(star.x, star.y);
          //   context.lineTo(star.x + star.vx, star.y + star.vy);
          //   context.stroke();
          //   context.closePath();
          // }

          star.alpha += star.ra;


          // 透明度判断，从0到1
          if (star.alpha <= 0) {
            star.alpha = 0;
            star.ra = -star.ra;
            star.vx = Math.random() * 0.2 - 0.1;
            star.vy = Math.random() * 0.2 - 0.1;
          } else if (star.alpha > 1) {
            star.alpha = 1;
            star.ra = -star.ra
          }
          star.x += star.vx;
          // x轴坐标判断
          if (star.x >= WINDOW_WIDTH) {
            star.x = 0;
          } else if (star.x < 0) {
            star.x = WINDOW_WIDTH;
            star.vx = Math.random() * 0.2 - 0.1;
            star.vy = Math.random() * 0.2 - 0.1;
          }
          star.y += star.vy;
          // y轴坐标判断
          if (star.y >= WINDOW_HEIGHT) {
            star.y = 0;
            star.vy = Math.random() * 0.2 - 0.1;
            star.vx = Math.random() * 0.2 - 0.1;
          } else if (star.y < 0) {
            star.y = WINDOW_HEIGHT;
          }

          // 开始绘制
          context.beginPath();
          var bg = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
          bg.addColorStop(0, 'rgba(255,255,255,' + star.alpha + ')');
          bg.addColorStop(1, 'rgba(255,255,255,0)');
          context.fillStyle = bg;
          // 画圆
          context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true);
          // 实际绘制
          context.fill();
          context.closePath();

        }
      }

      // 生成星星
      function addStar() {
        for (var i = 0; i < num; i++) {
          var aStar = {
            // x轴坐标
            x: Math.round(Math.random() * WINDOW_WIDTH),
            // y轴坐标
            y: Math.round(Math.random() * WINDOW_HEIGHT),
            // 圆半径
            r: Math.random() * 3,
            ra: Math.random() * 0.05,
            // 透明度
            alpha: Math.random(),
            // 横向移动偏移量
            vx: Math.random() * 0.2 - 0.1,
            // 纵向移动偏移量
            vy: Math.random() * 0.2 - 0.1
          };
          stars.push(aStar);
        }
      }
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
          vm.$axios.post(this.API + '/backend.php?action=login', Qs.stringify(params), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
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
  mounted() {
    if (sessionStorage.getItem('LoggedIn') != null) {
      //已经登录
      this.isLoggedIn.state = 1;
      this.isLoggedIn.username = sessionStorage.getItem('LoggedIn');
    }
    //头部背景
    this.headerBGInit();
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
</style>