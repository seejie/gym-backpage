import Http from '@/utils/request'
import {
  httpInterceptors
} from '@/utils/decorators'

export default class MemberWechatAPI {
  // 查询会员卡开放类目
  @httpInterceptors
  getBrandCategory(params) {
    return Http.get('/member/card/getBrandCategory', {
      params
    })
  }
}
