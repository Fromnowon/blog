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
                                <router-link to="/admin" style="text-decoration: none;color: black">后台管理</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a v-on:click="logout" href="javascript:void(0)"
                                   style="color: red;font-weight: bold;text-decoration: none">退出登录</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div>
                <h1 class="header_title primary">{{ header_title }}</h1>
                <p class="header_title secondary">{{ header_title_extra }}</p>
            </div>
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
      header_title:'Hello',
      header_title_extra:'World',
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
        background: url("../../static/images/bg/header_bg.jpg") no-repeat;
    }

    .user_info {
        position: absolute;
        right: 20px;
        top: 20px;
    }
</style>