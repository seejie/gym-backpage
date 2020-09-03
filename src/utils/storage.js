// 保存用户等级
export function setUserLevel(level) {
  window.localStorage.setItem('userLevel', level)
}

// 获取用户等级
export function getUserLevel() {
  // value: 1-A级用户，2-B级用户，3-C级用户
  return window.localStorage.getItem('userLevel')
}

// 保存token
export function setUserToken(level) {
  window.localStorage.setItem('token', level)
}

// 获取token
export function getUserToken() {
  return window.localStorage.getItem('token')
}
