<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" class="mainC"/>
      </keep-alive>
    </transition>
    <copyright class="app-copyright"></copyright>
  </section>
</template>

<script>
import Copyright from './Copyright'
export default {
  name: 'AppMain',
  components: {Copyright},
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: $copyrightHeight; // copyright height 50px;
  background: $mainBg;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.app-copyright {
  position: absolute;
  bottom: 0;
  height: $copyrightHeight;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
.mainC {
  height: calc(100vh - 100px) !important;
  overflow: auto !important;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
