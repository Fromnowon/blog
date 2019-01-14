<template>
    <div class="nav_bar">
        <el-menu :default-active="currentPath" class="el-menu-demo" mode="horizontal" v-on:select="selectItem"
                 menu-trigger="hover"
                 background-color="#394149"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :unique-opened="true"
                 router>
            <el-menu-item index="/index">首页</el-menu-item>
            <el-submenu index="2" disabled>
                <template slot="title">分类</template>
                <el-menu-item index="2-1">编程</el-menu-item>
                <el-menu-item index="2-2">杂谈</el-menu-item>
                <el-menu-item index="2-3">其他</el-menu-item>
                <el-submenu index="2-4">
                    <template slot="title">测试</template>
                    <el-menu-item index="2-4-1">选项1</el-menu-item>
                    <el-menu-item index="2-4-2">选项2</el-menu-item>
                    <el-menu-item index="2-4-3">选项3</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="/index/about">关于我</el-menu-item>
            <el-menu-item index="/index/chat">小玩意儿</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
  name: "nav-bar",
  data() {
    return {
      currentPath: '',
    }
  },
  methods: {
    selectItem(key, keyPath) {
      return false;
    },
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
        padding: 0 20px;
        border: 0 !important;
        background: #394149;
    }
</style>