<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import configSetting from '../configsetting';
export default {
  name: 'App',

  created() {
    // let link = document.createElement('link');
    // link.type = 'image/x-icon';
    // link.rel = 'shortcut icon';
    // link.href = configSetting.ico;
    // document.getElementsByTagName('head')[0].appendChild(link);
  },
};
</script>
