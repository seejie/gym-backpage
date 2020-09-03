<template>
  <div>
    <img-include v-model="imgs" :max="9" :cropper="cropper"></img-include>
    <div>{{ imgs }}</div>
  </div>
</template>

<script>
import ImgInclude from '@/components/CropImgInclue';
export default {
  components: {
    ImgInclude,
  },
  data() {
    return {
      imgs: {},
      cropper: [
        {
          name: '详情封面',
          ratio_x: 280,
          ratio_y: 148,
          ratio: 1.89,
          desc: '你的用户将在门票详情页各类别票种、惠购查看更多景点门票列表，看到此封面',
        },
        {
          name: '列表封面',
          ratio_x: 280,
          ratio_y: 183,
          ratio: 1.53,
          desc: '你的用户将在门票详情页各类别票种、惠购查看更多景点门票列表，看到此封面',
        },
      ],
    };
  },
  created() {
    this.asyns();
  },
  methods: {
    asyns() {
      setTimeout(() => {
        this.imgs = {
          'ratio1.89': [
            'http://uppzcz.jsqiaotuo.com/FpaHqz35tXtAfSwE5RfGmShXJqjD',
            'http://uppzcz.jsqiaotuo.com/FtCdBuOpoLvENrtQ2oRV738rlpwv',
          ],
          'ratio1.53': [
            'http://uppzcz.jsqiaotuo.com/FpaHqz35tXtAfSwE5RfGmShXJqjD',
            'http://uppzcz.jsqiaotuo.com/FtCdBuOpoLvENrtQ2oRV738rlpwv',
          ],
        };
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
