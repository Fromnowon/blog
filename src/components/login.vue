<template>
  <div class="login">
    <div style="align-self: center;margin-bottom: 20%">
      <div>
        <h3 style="text-align: center;">登录</h3>
      </div>
      <el-form label-position="left" label-width="80px" v-bind:model="loginInfo" ref="login_form">
        <el-form-item label="用户名" prop="username"
                      v-bind:rules="login_rules">
          <el-input ref="username_input" v-model="loginInfo.username"
                    v-on:keyup.enter.native="switch_to" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"
                      v-bind:rules="login_rules">
          <el-input ref="password_input" type="password"
                    v-model="loginInfo.password"
                    v-on:keyup.enter.native="login" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="goIndex" type="danger">返 回</el-button>
          <el-button type="primary" @click="login" @loading="loggingIn">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'

  export default {
    name: "login",
    data() {
      return {
        login_rules: [{required: true, message: '不能为空！'}],
        loginInfo: {
          username: '',
          password: '',
        },
        loggingIn: false,
      }
    },
    methods: {
      goIndex() {
        this.$router.push('/index');
      },
      set_focus() {
        this.$refs['username_input'].focus();
      },
      login() {
        let vm = this;
        vm.$refs['login_form'].validate((valid) => {
          if (valid) {
            vm.loggingIn = true;
            let params = {
              username: this.loginInfo.username,
              password: md5(this.loginInfo.password),
            };
            vm.$axios(this.API + '/backend.php?action=login', {
              params: params
            })
              .then(data => {
                if (data.data == 'PASS') {
                  //登录成功
                  vm.loggingIn = false;
                  vm.$store.commit('setLoginInfo', {
                    username: this.loginInfo.username,
                    password: md5(this.loginInfo.password)
                  });
                  vm.$router.push('/admin');
                } else {
                  //登录失败
                  vm.loggingIn = false;
                  vm.$message.error('用户名或密码错误！');
                  setTimeout(function () {
                    vm.$refs['username_input'].focus();
                  }, 500);
                }
              })
              .catch(error => {
                vm.loggingIn = false;
                alert('无法连接到服务器');
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
      //应取数据向服务器验证
      if (this.$store.state.loginInfo !== null) {
        //重定向到登录页
        this.$router.push('/admin');
      } else {
        console.log('登录信息为空');
      }
    },
    mounted() {

    },
  }
</script>

<style>
  body, html {
    height: 100%;
  }

  #app {
    height: 100%;
  }

  .login {
    height: 100%;
    display: flex;
    justify-content: center;
  }

  .hidden {
    display: none;
  }
</style>
