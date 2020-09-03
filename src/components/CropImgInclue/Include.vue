<template>
  <div class="include">
    <template v-if="hasTitle">
      <el-form :model="titleFormData" class="title-img-form">
        <template v-for="(url, index) in urls">
          <div v-if="size" :key="'url' + index" @click="$emit('selected', index)">
            <el-image
              :placeholder="'+'"
              class="item--single"
              :src="url"
              :style="{ width: `${size}px`, height: `${size}px` }"
            />
            <!-- <el-input v-model="url.name"></el-input> -->
            <el-input :placeholder="placeholder" v-model="titleFormData['title' + index]"></el-input>
          </div>
          <div
            v-else
            class="item item-title"
            :style="{ ...style, 'margin-bottom': '56px' }"
            :key="'url' + index"
          >
            <el-image
              :placeholder="'+'"
              class="item"
              :style="style"
              :src="url"
              @mouseenter.native="maskShow(index, true)"
              fit="contain"
            />
            <el-input :placeholder="placeholder" v-model="titleFormData['title' + index]"></el-input>
            <div
              class="item mask add"
              :style="style"
              @click="$emit('selected', index)"
              @mouseleave="maskShow(index, false)"
              v-show="maskVisible[index]"
            >
              <div class="center">
                <div class="circle">
                  <svg-icon icon-class="imgedit"></svg-icon>
                </div>
                <div class="text">点击修改</div>
              </div>
            </div>

            <svg-icon
              class="deleteimg"
              icon-class="imgdelete"
              :key="'del' + index"
              @click.stop="$emit('delete', index)"
            />
          </div>
        </template>
      </el-form>
    </template>
    <template v-else v-for="(url, index) in urls">
      <!-- <template v-for="(url, index) in urls"> -->
      <div v-if="size" :key="'url' + index" @click="$emit('selected', index)">
        <el-image
          :placeholder="'+'"
          class="item--single"
          :src="url"
          :style="{ width: `${size}px`, height: `${size}px` }"
        />
      </div>
      <div
        v-else
        class="item"
        :style="style"
        :key="'url' + index"
        @click="$emit('selected', index)"
      >
        <el-image
          :placeholder="'+'"
          class="item"
          :style="style"
          :src="url"
          @mouseenter.native="maskShow(index, true)"
          fit="contain"
        />
        <div
          class="item mask add"
          :style="style"
          @mouseleave="maskShow(index, false)"
          v-show="maskVisible[index]"
        >
          <div :class="ratio > 3.5 ? 'center only_icon' : 'center'">
            <div class="circle">
              <svg-icon icon-class="imgedit"></svg-icon>
            </div>
            <div class="text">点击修改</div>
          </div>
        </div>

        <svg-icon
          class="deleteimg"
          icon-class="imgdelete"
          :key="'del' + index"
          @click.stop="$emit('delete', index)"
        />
      </div>
    </template>

    <div
      class="add--single"
      v-if="urls.length < max && size"
      @click="$emit('selected', urls.length)"
    >+</div>

    <div
      :class="{ 'add item': true, 'item-title': hasTitle }"
      :style="style"
      @click="$emit('selected', urls.length)"
      v-if="urls.length < max && !size"
    >
      <div :class="ratio > 3.5 ? 'center only_icon' : 'center'">
        <div class="circle">
          <svg-icon icon-class="addimg"></svg-icon>
        </div>
        <div class="text">点击上传</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: Number,
      default: 1,
    },
    urls: {
      type: Array,
    },
    size: {
      type: Number,
      default: 0,
    },
    ratio: {
      type: Number,
      default: 1,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
    titleArray: {
      type: Object,
      default: () => {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: '请输入～',
    },
  },
  data() {
    return {
      maskVisible: [],
      titleFormData: {},
    };
  },
  watch: {
    titleFormData: {
      handler() {
        this.$emit('titleChange', this.titleFormData);
      },
      deep: true,
    },
    titleArray: {
      handler() {
        this.titleFormData = this.titleArray;
      },
      deep: true,
    },
  },
  computed: {
    style() {
      const width = this.ratio >= 1 ? '243px' : `${243 * this.ratio}px`;
      const height = this.ratio >= 1 ? `${243 / this.ratio}px` : '243px';

      return { width, height };
    },
  },
  methods: {
    maskShow(index, flag) {
      this.maskVisible.splice(index, 1, flag);
    },
  },
};
</script>

<style lang="scss" scoped>
.include {
  .title-img-form {
    display: inline-block;
  }
  .item-title {
    margin-bottom: 56px;
  }
}
.item {
  display: inline-block;
  position: relative;
  width: 243px;
  height: 195px;
  border: 1px solid $conentBorder;
  background: #f9f9f9;
  vertical-align: middle;
  border-radius: 6px;
  box-sizing: border-box;
  margin-right: 18px;
  margin-bottom: 10px;

  &.add {
    .circle {
      width: 48px;
      height: 48px;
      margin: 10px auto 16px;
      border-radius: 48px;
      background: $xqn_green;
      text-align: center;
      line-height: 48px;
    }

    .text {
      font-size: 14px;
      color: $font-6;
    }
  }

  &.mask {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);

    .circle {
      background: #fff;
      text-align: center;
      line-height: 48px;
    }

    .text {
      font-size: 14px;
      color: #fff;
    }
  }

  .center {
    position: absolute;
    top: 50%;
    margin: 0 auto;
    margin-top: -55px;
    width: 100%;
    max-height: 110px;
    text-align: center;

    &.only_icon {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 0;
      top: 0;
      margin-top: 0;
      flex-direction: column;
      .text {
        display: none;
      }
    }
  }

  .deleteimg {
    position: absolute;
    top: 0;
    right: -16px;
  }
}

.item--single,
.add--single {
  width: 55px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.img_text {
  font-size: 12px;
  line-height: 18px;
  display: inline-block;
}
</style>
