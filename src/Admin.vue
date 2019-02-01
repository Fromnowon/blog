<template>
    <div class="admin_div">
        <el-menu
                class="left_menu"
                :default-active="currentPath"
                :collapse="isCollapse"
                v-on:select="handleSelect"
                :collapse-transition="true"
                router>
            <div v-show="isCollapse" v-on:click="isCollapse=!isCollapse" class="left_menu_control">
                <i class="fa fa-navicon"></i>
            </div>
            <div v-show="!isCollapse" v-on:click="isCollapse=!isCollapse" class="left_menu_control">
                <i class="fa fa-close"></i>
            </div>

            <el-menu-item index="/admin">
                <i class="fa fa-info-circle"></i>
                <span slot="title">后台主页</span>
            </el-menu-item>
            <el-menu-item index="/">
                <i class="fa fa-location-arrow"></i>
                <span slot="title">返回前台</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <i class="fa fa-gear"></i>
                    <span>管理</span>
                </template>
                <el-menu-item-group>
                    <template slot="title">内容管理</template>
                    <el-menu-item index="/admin/verify">评论审核</el-menu-item>
                    <el-menu-item index="1-2">屏蔽字</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <template slot="title">文章</template>
                    <el-menu-item index="/admin/topic_manage">文章管理</el-menu-item>
                    <el-menu-item index="1-1">编辑公告</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/admin/new">
                <i class="fa fa-edit"></i>
                <span slot="title">新文章</span>
            </el-menu-item>
            <el-menu-item index="/admin/config">
                <i class="fa fa-wrench"></i>
                <span slot="title">设置</span>
            </el-menu-item>
        </el-menu>
        <div style="width: 100%;height: 100%">
            <div class="right">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: "Admin",
  data() {
    return {
      isCollapse: true,
      currentPath: '',
    }
  },
  methods: {
    handleSelect(key, keyPath) {

    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  watch: {
    isCollapse() {
      if (!this.isCollapse) {
        //展开了菜单
        this.$util.getDomByClass('right')[0].style.marginLeft = '200px';
      } else {
        this.$util.getDomByClass('right')[0].style.marginLeft = '65px';

      }
    }
  },
  activated() {
    if (this.$store.state.loginInfo === null) {
      //重定向到登录页
      console.log(this.$store.state.loginInfo);
      this.$router.push('/login');
    }
    let vm = this;
    //刷新后重新激活导航
    vm.currentPath = this.$route.path;
  },
}
</script>

<style scoped>
    .el-menu {
        border: 0;
        box-shadow: 1px 0 1px lightgrey;
        z-index: 999;
    }

    .admin_div {
        overflow: hidden;
    }

    .left_menu_control {
        display: flex;
        width: 100%;
        height: 56px;
        justify-content: center;
        cursor: pointer;
    }

    .left_menu_control > i {
        font-size: 20px;
        align-self: center;
    }

    .left_menu {
        position: fixed;
        user-select: none;
        height: 100%;
    }

    .left_menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .right {
        transition: margin-left 0.5s;
        margin-left: 65px;
    }

    .fa {
        font-size: 18px;
        margin: 0 5px;
    }

</style>
