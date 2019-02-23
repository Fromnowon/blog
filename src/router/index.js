import Vue from 'vue'
import Router from 'vue-router'
import mainBody from '../components/main-body'
import indexList from '../components/index-list'
import About from '../components/about-me'
import Admin from '../Admin'
import New from '../components/admin/edit-topic'
import Edit from '../components/admin/edit-topic'
import adminIndex from '../components/admin/admin-index'
import View from '../components/view-topic'
import Page404 from '../components/other/404'
import Login from '../components/login'
import Verify from '../components/admin/comments-verify'
import TopicManage from '../components/admin/topics-manage'
import Category from '../components/category-page'
import Search from '../components/search-page'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/index'
    },//重定向至首页路由
    {
      path: '/404',
      component: Page404,
    },
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
          path: 'category',
          component: Category,
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
          path: 'new',
          component: New
        },
        {
          path: 'edit',
          component: Edit
        },
        {
          path: 'verify',
          component: Verify
        },
        {
          path: 'topic_manage',
          component: TopicManage
        },
      ]
    },
    //////////////////////
    {
      path: '/view',
      component: View,
    },
    {
      path: "*",
      redirect: "/404"
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/search',
      component: Search,
    },
  ]
});

router.beforeEach((to, from, next) => {
  Vue.prototype.$nprogress.start();
  next();
});

router.afterEach((to, from) => {
  Vue.prototype.$nprogress.done();
});

export default router;
