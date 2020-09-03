<template>
  <store-style-wrapper v-slot="{ addGoodsStyle }">
    <component :is="`style${ addGoodsStyle }`" />
  </store-style-wrapper>
</template>

<script>
import StoreStyleWrapper from '@/components/StoreStyleWrapper';
import style1 from './style1';
import style2 from './style2';
import style3 from './style3';
import style4 from './style4';
export default {
  components: {
    StoreStyleWrapper,
    style1,
    style2,
    style3,
    style4,
  },
};
</script>

<style>
</style>