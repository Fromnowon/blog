import Vue from 'vue'
import Router from 'vue-router'
import mainBody from '../components/main-body'
import indexList from '../components/index-list'
import About from '../components/about-me'
import Admin from '../Admin'
import Edit from '../components/admin/edit-topic'
import adminIndex from '../components/admin/admin-index'
import Chat from '../components/chat/main-chat'
import View from '../components/view-topic'

Vue.use(Router);

const router = new Router({
  //mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/index'
    },//重定向至首页路由
    /////////////////////
    {
      path: '/index',
      component: mainBody,
      children: [
        {
          path: '',
          component: indexList,
        },
        {
          path: 'about',
          component: About
        },
        {
          path: 'chat',
          component: Chat
        },
      ]
    },
    //////////////////////
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '',
          component: adminIndex
        },
        {
          path: 'edit',
          component: Edit
        },
      ]
    },
    //////////////////////
    {
      path: '/view',
      component: View,
    }
  ]
});

router.beforeEach((to, from, next) => {
  Vue.prototype.$nprogress.start();
  next();
});

router.afterEach(() => {
  Vue.prototype.$nprogress.done();
});

export default router;
