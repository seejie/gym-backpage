<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @select="selectMenu"
      >
        <template v-for="(item, index) in permission_routes">
          <el-menu-item :index="item.url + ',' + item.id" v-if="!item.children.length" :key="index">
            <img :src="item.iconChoose" class="submenu_icon" v-if="activeMenu == item.url + ',' + item.id" />
            <img :src="item.icon" class="submenu_icon" v-else />
            <span>{{ item.name }}</span>
          </el-menu-item>

          <el-submenu :index="item.url + ',' + item.id" v-else :key="index">
            <template slot="title">
              <img :src="item.icon" class="submenu_icon" />
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              class="menu_item"
              v-for="(child_item, child_index) in item.children"
              :index="child_item.url + ',' + child_item.id"
              :key="child_index"
            >
              <div class="menu_name">{{ child_item.name }}</div>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import variables from '@/styles/variables.scss';
export default {
  components: { Logo },
  data() {
    return {
      permission_routes: [],

      activeMenu: '',
    };
  },
  computed: {
    ...mapGetters(['sidebar']),

    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },

  created() {
    this.loadMenu();
  },

  methods: {
    loadMenu() {
      this.$ajax
        .get('/sys/menu/menuListByUser', {})
        .then(res => {
          if (res.resObject) {
            let list = res.resObject.map((item, index) => {
              if (!item.children) {
                item.children = [];
              } else {
                item.children.map(child => {
                  child.children = [];
                  return child;
                });
              }
              return item;
            });

            this.permission_routes = list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    selectMenu(e) {
      this.activeMenu = e;

      if (e.split(',')[0] && e.split(',') != 'null') {
        this.$router.push({
          path: e.split(',')[0],
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.submenu_icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}

.menu_item {
  padding: 0 !important;
  &:hover {
    .menu_name {
      background-color: #2b3033;
      color: #a3d028;
    }
  }
}

.menu_name {
  padding-left: 53px;
  width: 100%;
  height: 100%;
}

/deep/ .el-menu--collapse .el-submenu__title {
  text-align: center;
}

/deep/ .el-menu--collapse .el-submenu__title img {
  margin-left: 14px;
}
</style>
