<template>
  <el-dialog title="预览" :center="true" :visible.sync="showPreviewDialog" custom-class="preview-dialog">
    <div class="preview-content">
      <canvas class="qrcode"></canvas>
      <!-- <img :src="qrcodeUrl" alt=""> -->
      <!-- <el-image
        fit="cover"
        src="qrcodeUrl"></el-image> -->
        <p>{{qrcodeUrl}}</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveQRCodeClick">下载二维码</el-button>
      <el-button v-clipboard:copy="preview_url" v-clipboard:success="onCopy" v-clipboard:error="onError">复制链接
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import clipboards from 'vue-clipboard2'
  import Vue from 'vue'
  import {
    info
  } from '../../../utils/ddHelper'
  import QRCode from 'qrcode'

  Vue.use(clipboards)
  export default {
    name: 'preview_dialog',
    props: ['isShowPreviewDialog', 'preview_url'],
    data() {
      return {
        showPreviewDialog: this.isShowPreviewDialog,
        qrcodeUrl: ''
      }
    },
    watch: {
      isShowPreviewDialog(val) {
        this.showPreviewDialog = val;
        setTimeout(() => {
          var canvas = document.querySelector("canvas");
          QRCode.toCanvas(canvas, this.preview_url);
          // this.qrcodeUrl= `${document.URL.substring(0,document.URL.indexOf('#')-1)}/qrcode?url=${this.preview_url}`;
          this.qrcodeUrl = this.preview_url;
        }, 1000)
      },

      showPreviewDialog(val) {
        this.$emit('change-show', val)
      }
    },
    mounted() {
      //  var canvas = document.querySelector("canvas");
      //   QRCode.toCanvas(canvas, this.preview_url);
      //   // this.qrcodeUrl= `${document.URL.substring(0,document.URL.indexOf('#')-1)}/qrcode?url=${this.preview_url}`;
      //   this.qrcodeUrl = this.preview_url;
    },
    methods: {
      onCopy() {
        info(this, '复制链接成功');
      },
      onError(e) {
        console.log(e);
      },
      saveQRCodeClick() {
        this.convertCanvasToImage(document.querySelector("canvas"));
      },
      convertCanvasToImage(canvas) {
        //新Image对象，可以理解为DOM
        var image = new Image();
        // 指定格式PNG
        var dataurl = canvas.toDataURL("image/png");
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var theBlob = new Blob([u8arr], {
          type: mime
        });
        theBlob.lastModifiedDate = new Date()
        theBlob.name = '二维码';
        setTimeout(() => {
          var a = document.createElement("a");
          a.download = name;
          a.href = URL.createObjectURL(theBlob);
          a.click();
        }, 1000)
      }
    }
  }

</script>
<style lang="scss" scoped>
  .preview-dialog {
    .preview-content {
      text-align: center;
    }
  }

</style>
