<template>
    <div class="admin_div">
        <el-menu
                class="left_menu"
                :default-active="currentPath"
                :collapse="isCollapse"
                v-on:select="handleSelect"
                :collapse-transition="false"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                router>
            <div v-show="isCollapse" v-on:click="isCollapse=!isCollapse" class="left_menu_control">
                <i class="fa fa-angle-double-right"></i>
            </div>
            <div v-show="!isCollapse" v-on:click="isCollapse=!isCollapse" class="left_menu_control">
                <i class="fa fa-angle-double-left"></i>
            </div>

            <el-menu-item index="/">
                <i class="el-icon-menu"></i>
                <span slot="title">返回站点</span>
            </el-menu-item>

            <el-menu-item index="/admin">
                <i class="el-icon-info"></i>
                <span slot="title">后台主页</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>管理</span>
                </template>
                <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="/admin/edit">
                <i class="el-icon-edit-outline"></i>
                <span slot="title">新文章</span>
            </el-menu-item>
            <el-menu-item index="/admin/config">
                <i class="el-icon-setting"></i>
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
  mounted() {
    if (this.$store.state.loginInfo === null) {
      //重定向到登录页
      this.$router.push('/login');
    }
    let vm = this;
    //刷新后重新激活导航
    vm.currentPath = this.$route.path;
  },
}
</script>

<style scoped>
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
        color: #409EFF;
        align-self: center;
    }

    .left_menu_control:hover {
        background: rgb(67, 74, 80);
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
        margin-left: 65px;
    }

</style>