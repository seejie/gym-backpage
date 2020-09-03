<template>
  <el-menu :default-active="activeIndex" mode="horizontal" class="wei-xin-menu">
    <template v-for="item in menus">
      <!-- 多级菜单外壳 -->
      <el-submenu v-if="item.children.length !== 0" :index="item.key" :key="item.key">
        <!-- 一级菜单包裹层 -->
        <template slot="title">
          <span slot="title">{{item.name}}</span>
        </template>

        <!-- 二级菜单选项 -->
        <el-menu-item v-for="child in item.children" :index="child.key" :key="child.key">
          <span slot="title">{{child.name}}</span>
        </el-menu-item>
      </el-submenu>
      <!-- 单级菜单 -->
      <el-menu-item v-else :index="item.key" :key="item.key">
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
  export default {
    name: 'subMenu',
    data() {
      return {
        activeIndex: 1,
        menus: [{
          name: '1级别',
          key: '1',
          children: [{
            name: '1-1级别',
            key: '1-1'
          }, {
            name: '1-2级别',
            key: '1-2'
          }]
        }, {
          name: '2级别',
          key: '2',
          children: []
        }, {
          name: '3级别',
          key: '3',
          children: []
        }]
      }
    }
  }
</script>
<style lang="scss">
  .wei-xin-menu {
    li.el-menu-item.is-active {
      border-bottom-color: transparent !important;
    }

    i.el-icon-arrow-down:before {
      display: none;
    }

    .el-submenu, .el-menu-item {
      width: 108px !important;
    }

    .el-submenu__title, .el-menu-item {
      text-align: center;
      color: #000 !important;
      height: 50px !important;
      line-height: 50px !important;
    }

    .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
      border-bottom-color: #999 !important;
    }

    .el-menu .el-menu--popup .el-menu--popup-bottom-start {
      bottom: 0px !important;
    }
  }
</style>
