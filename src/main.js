// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import Util from "../static/js/util";
import Axios from 'axios'

import Vuex from 'vuex'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(ElementUI);
Vue.use(Vuex);


Vue.config.productionTip = false;
Vue.prototype.$util = Util;
Vue.prototype.$axios = Axios;
Vue.prototype.$nprogress = NProgress;
Vue.prototype.CHAT = '/chat';
//Vue.prototype.API = '.';
Vue.prototype.API = '/api';

NProgress.inc(0.2);
NProgress.configure({easing: 'ease', speed: 500, showSpinner: false});

const store = new Vuex.Store({
  //待添加
  state: {
    win_size: null,
  },
  mutations: {
    loadingControl(state, param) {
      if (param) Vue.prototype.$nprogress.start();
      else Vue.prototype.$nprogress.done();
    },
    setSize(state, param) {
      state.win_size = param;
    },
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>',
});
