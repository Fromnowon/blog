<template>
    <div class="nav_bar">
        <el-menu :default-active="currentPath" class="el-menu-demo" v-on:select="selectItem"
                 menu-trigger="click"
                 :unique-opened="true"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 router>
            <el-menu-item index="/index"><i class="fa fa-send"></i>&nbsp;&nbsp;&nbsp;首页</el-menu-item>
            <el-submenu index="2" disabled>
                <template slot="title"><i class="fa fa-tags"></i>&nbsp;&nbsp;&nbsp;分类</template>
                <el-menu-item index="2-1">编程</el-menu-item>
                <el-menu-item index="2-2">杂谈</el-menu-item>
                <el-menu-item index="2-3">其他</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="isLogin" index="/admin"><i class="fa fa-wrench"></i>&nbsp;&nbsp;&nbsp;管理后台
            </el-menu-item>
            <el-menu-item v-else index="/admin"><i class="fa fa-lock"></i>&nbsp;&nbsp;&nbsp;登录后台</el-menu-item>
            <el-menu-item index="/index/about"><i class="fa fa-info-circle"></i>&nbsp;&nbsp;&nbsp;关于我</el-menu-item>
            <el-menu-item index="/index/chat"><i class="fa fa-flask"></i>&nbsp;&nbsp;&nbsp;小玩意儿</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
  name: "nav-bar",
  data() {
    return {
      currentPath: '',
      isLogin: false,//是否登录
    }
  },
  methods: {
    selectItem(key, keyPath) {
      this.$emit('closeMenu');
    },
  },
  mounted() {
    //是否登录
    this.isLogin = this.$store.state.loginInfo !== null ;
    //刷新后重新激活导航
    this.currentPath = this.$route.path;
  },
  activated() {
    //刷新后重新激活导航
    this.currentPath = this.$route.path;
  },
}
</script>

<style scoped>
    .nav_bar {
        user-select: none;
    }

    .el-menu {
        padding-top: 40px;
        border: 0 !important;
    }
</style>