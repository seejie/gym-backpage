const QiNiuYun = require('qiniu-js');

export default function QiNiuYunUpload(file, token, fileSuffix = '') {
  let fileName = 'file_' + new Date().getTime() + fileSuffix;
  return new Promise((resolve, reject) => {
    /*
    * fname: string，文件原文件名.
    * params: object，用来放置自定义变量;
    * mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；
    * 限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
    */
    const putExtra = {
      mimeType: null,
      // mimeType: ["image/png", "image/jpeg", "image/gif"]
    };

    /*
    * config.useCdnDomain: 是否使用 cdn 加速域名，true or false，默认为 false。
    * config.disableStatisticsReport: 是否禁用日志报告，为布尔值，默认为false。
    * config.region: 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
    * config.retryCount: 上传自动重试次数（整体重试次数）；默认3次（即上传失败后最多重试两次）；
    * config.concurrentRequestLimit: 分片上传的并发请求量，number，默认为3；
    * config.checkByMD5: 是否开启 MD5 校验，在断点续传时校验分片，默认为 false，不开启。
    */
    const config = {
      region: QiNiuYun.region.z0
    }
    const observer = {
      next(res) { },
      error(err) {
        reject(err)
      },
      complete(res) {
        resolve(res);
      }
    };
    const compressOption = { // 压缩文件
      quality: 0.92,
      noCompressIfLarger: true,
      // maxWidth: 400,
      // maxHeight: 400
    }
    QiNiuYun.compressImage(file, compressOption).then(data => {
      let observable = QiNiuYun.upload(data.dist, fileName, token, putExtra, config);
      let subscription = observable.subscribe(observer) // 上传开始
    })
    //subscription.unsubscribe() // 上传取消
  }).catch(e => {
    console.log(e)
  })
}
