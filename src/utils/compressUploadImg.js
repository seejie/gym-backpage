import settings from '@/settings';

/**
 * 压缩图片
 * @param {*} file 图片file对象
 */
function fileTodata(file) {
  // 压缩图片需要的一些元素和对象
  var reader = new FileReader();
  reader.readAsDataURL(file);
  // 缩放图片需要的canvas
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  return new Promise(function (resolve) {
    // base64地址图片加载完毕后
    reader.onload = function (e) {
      let img = new Image();

      img.src = e.target.result;

      img.onload = function () {
        // 图片原始尺寸
        var originWidth = this.width;
        var originHeight = this.height;

        console.log(settings)

        // 最大尺寸限制
        var maxWidth = settings.zipPicMaxWith,
          maxHeight = settings.zipPicMaxHeight;
        // 目标尺寸
        var targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过最大尺寸限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }

        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        // canvas转为base64
        resolve(canvas.toDataURL(file.type));
      };
    };
  });
}

/**
 *
 * @param {*} file 入参为文件对象
 * @param {*} baseData 入参为文件basedata
 */
export default function dataURLtoFile(file, baseData = null) {
  return new Promise(function (resolve) {
    if(baseData) {
      let arr = baseData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      resolve(new File([u8arr], 'image', { type: mime }));

    } else {
      fileTodata(file).then(dataurl => {
        let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        resolve(new File([u8arr], file.name, { type: mime }));
      });
    }
  });
}
