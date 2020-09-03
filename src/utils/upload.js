
import {getToken} from '@/api/qiniu';
import QiNiuYunUpload from '@/utils/qiniuyun'
function upload(file, fileSuffix) {
  return new Promise((resolve, reject) => {
    getToken()
      .then(res => {
        QiNiuYunUpload(file, res.resObject.token, fileSuffix)
          .then(result => {
            if (result && result.key) {
              resolve(res.resObject.qiNiuYunUrl + "/" + result.key);
            }
            reject(result);
          })
          .catch(err => {
            console.error("上传文件异常: ", err);
            reject(err);
          });
      })
      .catch(tokenErr => {
        console.error("获取token异常: ", tokenErr);
        reject(tokenErr);
      });
  });
}

export default upload;
