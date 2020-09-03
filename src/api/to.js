export default function to(promise) {
  
  return promise.then((res) => {
    if (!res.data) {
      res.data = {};
    }
    return res;
  }).catch(error => {
    console.log(`=============异常->:${error}=============`);
    return error;
  });
}
// errorCaptured
