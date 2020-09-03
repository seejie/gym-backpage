<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="sysLogo" :src="sysLogo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ sysName }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <el-image v-if="sysLogo" :src="sysLogo" fit="contain" style="width: 180px; height: 50px"/>
        <h1 class="sidebar-title">{{ sysName }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      sysName: '',
      sysLogo: '',
    };
  },

  created() {
    this.loadLoginInfo();
  },

  methods: {
    ...mapMutations('user', ['SET_LOGIN_INFO']),

    loadLoginInfo() {
      this.$ajax
        .get(`/denglu/loginInfo`, {})
        .then(res => {
          this.sysLogo = res.sysLogo;
          this.sysName = res.sysName || '';

          this.SET_LOGIN_INFO(res || {})

          if(res.shareIcon) {
            let link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = res.shareIcon;
            document.getElementsByTagName('head')[0].appendChild(link);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
