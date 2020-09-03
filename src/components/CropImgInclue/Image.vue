<template>
  <div class="imginclude-img">
    <el-image class="img" :src="img" fit="cover"></el-image>
    <div class="text">{{ name }}</div>
    <div class="mask" v-show="active">
      <img :src="xuan" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    img: {
      type: String,
    },
    name: {
      type: String,
    },
    active: {
      type: Boolean,
    },
  },
  data() {
    return {
      xuan: require('@/assets/common/imgselected.png'),
    };
  },
};
</script>
<style lang="scss" scoped>
$imgh: 104px;
$h: 36px;
.imginclude-img {
  position: relative;
  height: $imgh + $h;
  border: 1px solid $conentBorder;
  box-sizing: border-box;
}
.img {
  display: block;
  width: 104px;
  height: 104px;
}
.text {
  @extend %ellipsis;
  display: block;
  line-height: $h;
  font-size: 14px;
  width: 104px;
  height: $h;
  color: $font-2;
  text-align: center;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 104px;
  height: 104px;
  line-height: 104px;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  img {
    width: 42px;
    height: 42px;
    vertical-align: middle;
  }
}
</style>
