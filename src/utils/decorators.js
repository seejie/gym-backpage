/**
 * @auther 可乐
 * 解决了每次请求接口时的两个痛点：
 * 1. 每次请求还要再判断 res.resCode === 200
 * 2. 每次请求还需要从 res 里再次获取 resObject
 *
 * 此函数返回 Promise，若 res.resCode !== 200 则 reject
 */
export function httpInterceptors(target, name, descriptor) {
  const ajaxFuc = descriptor.value
  descriptor.value = (...arg) => new Promise((resolve, reject) => {
    if (arg.length && arg.length >= 2) {
      // 处理 config 参数里的逻辑
      const [param, config] = arg
      // 空字符串的参数转为 null
      if (config.isDeleteEmpty) {
        Object.keys(param).forEach(key => {
          if (param[key] ==== '') {
            param[key] = null
          }
        })
        arg[0] = param
      }
    }
    ajaxFuc.apply(target, arg).then(res => {
      if (res.resCode === 200) {
        resolve(res.resObject)
      } else {
        reject(res)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 装饰器使用例子
import Http from '@/utils/request'

export default class MemberSearchAPI {
  @httpInterceptors
  getMemberlist(params) {
    return Http.get('/member/getMemberlist', {
      params
    })
  }
}

const memberSearchAPI = new MemberSearchAPI()

const config = {
  isDeleteEmpty: true, // 是否把空字符串的参数转为 null，默认为 false
}
memberSearchAPI.getMemberlist({
  pageSize: 1
}, config)
*/
