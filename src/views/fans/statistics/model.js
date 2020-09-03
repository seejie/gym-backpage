import Http from '@/utils/request'
import {
  httpInterceptors
} from '@/utils/decorators'

export default class MemberStatisticsAPI {
  // 删除积分规则(单个/批量)
  @httpInterceptors
  memberStatistics(params) {
    return Http.get('/sys/member/memberStatistics', {
      params
    })
  }
}
