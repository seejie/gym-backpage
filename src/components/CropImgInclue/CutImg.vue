<template>
  <div class="cut-ct">
    <div>
      <div class="title">图片裁剪</div>
      <div class="imgct">
        <div
          class="imgct1"
          :class="{ show: active === index }"
          v-for="(cut, index) in cropper"
          :key="'img' + index"
        >
          <img :src="img" :ref="'img' + cut.ratio" class="img" />
        </div>
        <!-- <div class="imgct075" :class="{show:active===0.75}">
                <img :src="img" ref="img075" class="img" />
            </div> -->
      </div>

      <div class="btns">
        <a
          href="javascript:;"
          class="btn"
          :class="{ active: active === index }"
          @click="active = index"
          v-for="(cut, index) in cropper"
          :key="'btn' + index"
        >
          <div class="btn-text">{{ cut.name }}</div>
          <div class="btn-text">{{ cut.ratio_x }}:{{ cut.ratio_y }}</div>
        </a>
        <!-- <a href="javascript:;" class="btn" :class="{active: active === 0.75}" @click="active=0.75">
                <div>列表封面</div>
                <div>0.75:1</div>
            </a> -->
      </div>
    </div>
    <div>
      <div class="title">预览效果</div>
      <div
        class="ct clearfix"
        v-for="(cut, index) in cropper"
        :key="'preview' + index"
        :style="{ height: 133 / +(cut.ratio_x / cut.ratio_y) + 'px' }"
      >
        <div
          class="img-preview "
          :ref="'preview' + cut.ratio"
          :style="{ height: 133 / +(cut.ratio_x / cut.ratio_y) + 'px' }"
        ></div>
        <div class="describe">
          <div class="name">
            {{ cut.name }}（{{ cut.ratio_x }}：{{ cut.ratio_y }}）
          </div>
          <div class="text">{{ cut.desc }}</div>
        </div>
      </div>
      <!-- <div class="ct2 clearfix">
            <div class="img-preview preview1" ref="preview1"></div>
            <div class="describe">
                <div class="name">详情封面（1：1）</div>
                <div class="text">你的用户将在门票详情页各类别票种、惠购查看更多景点门票列表，看到此封面</div>
            </div>
        </div> -->
        <div>
          <el-button type="success" @click="btnMaxWidth()">最大宽度</el-button>
          <el-button @click="btnDefWidth()">重置</el-button>
        </div>
    </div>

  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
export default {
  props: {
    img: {
      type: String,
    },
    // value: {
    //     type: Object
    // },
    cropper: {
      type: Array,
      validator(v) {
        if (!Array.isArray(v)) {
          return false
        }
        if (v.length === 0) {
          return false
        }
        return true
      },
    },
  },
  model: {
    prop: 'cropper',
    event: 'input',
  },
  data() {
    return {
      //img: 'http://uppzcz.jsqiaotuo.com/FsTSSQdafzRSoMgJbjMKtZxAFc4l',
      active: 0,
      model: this.cropper,
      cropperIns: []
    }
  },
  watch: {
    model: {
      handler() {
        this.$emit('input', this.model)
      },
      deep: true,
    },
    cropper: {
      handler() {
        this.model = this.cropper
      },
      deep: true,
    },
  },
  mounted() {
    this.draw()
    console.log('78945616515135')
  },
  methods: {
    draw() {
      var me = this
      this.cropper.map((cut, index) => {
        var ins = new Cropper(this.$refs['img' + cut.ratio][0], {
          aspectRatio: +cut.ratio_x / cut.ratio_y,
          preview: this.$refs['preview' + cut.ratio],
          scalable: false,
          zoomable: false,
          rotatable: false,
          crop(event) {
            //me.model[index].cut = event.detail;
            //console.log(ins.getCroppedCanvas(),5)
            me.model[index].cut = ins.getCroppedCanvas()
          },
        })
        this.cropperIns.push(ins)
      })

      // this.cropper075 = new Cropper(this.$refs.img075, {
      //     aspectRatio: 0.75,
      //     preview: this.$refs.preview075,
      //     scalable: false,
      //     zoomable: false,
      //     rotatable: false,
      //     crop(event) {
      //         me.model.type075 = event.detail;
      //     },
      // })
    },
    btnMaxWidth(){
      this.cropperIns.map(item=>{
        const imgData = item.getImageData()
        const cropBoxData = item.getCropBoxData();
        const canvasData = item.getCanvasData();
        const cropBoxAspectRatio = cropBoxData.width/cropBoxData.height
        let width ,height ,left ,top ;
        if(imgData.height*cropBoxAspectRatio>imgData.width){
          width = imgData.width;
          left =canvasData.left;
          height = imgData.width/cropBoxAspectRatio;
          top = (imgData.height-height)/2
        }else if(imgData.height*cropBoxAspectRatio==imgData.width){
          width = imgData.width;
          left = canvasData.left ;
          height = imgData.height;
          top = canvasData.top;
        }else{
          width = imgData.height*cropBoxAspectRatio;
          left = (imgData.width-width)/2;
          height = imgData.height;
          top = canvasData.top
        }


        item.setCropBoxData({
          left: left,
          top: top,
          width: width,
          height: height
        })
      })
    },
    btnDefWidth(){
      this.cropperIns.map(item=>{
        item.reset();
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.cut-ct {
  display: flex;
  padding: 30px 30px 15px 30px;
}

.cut-ct > div {
  flex: 1;
}

.imgct {
  width: 350px;
  height: 350px;
  position: relative;
}

.imgct1,
.imgct075 {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  visibility: hidden;
}

.imgct1.show,
.imgct075.show {
  visibility: visible;
}

.img {
  max-width: 100%;
  visibility: hidden;
}

.btns {
  @include flexCenter;
  width: 217px;
  height: 42px;
  border: 1px solid $conentBorder;
  border-radius: 5px;
  margin: 0 auto;
  margin-top: 25px;
}

.btn {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: $font-6;
  height: 100%;
  padding-top: 3px;

  .btn-text {
    font-size: 16px;
    line-height: 1.2;
  }
}

.btn.active {
  background: $xqn_green;
  color: #fff;
}

.title {
  font-size: 16px;
  line-height: 1;
  margin-bottom: 10px;
}

.img-preview {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  width: 133px;
}

// .preview075 {
//     width: 133px;
//     height: 177px;
// }

// .preview1 {
//     width: 133px;
//     height: 133px;
// }

.ct {
  position: relative;
  margin-bottom: 40px;
}

// .ct1,
// .ct2 {
//     position: relative;
// }

// .ct1 {
//     height: 177px;
// }

// .ct2 {
//     margin-top: 40px;
//     height: 133px;
// }

.describe {
  font-size: 14px;
  color: $font-2;
  margin-left: 175px;
  line-height: 1.2;
}
</style>
