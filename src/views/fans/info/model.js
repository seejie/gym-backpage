import Http from '@/utils/request'
import { httpInterceptors } from '@/utils/decorators'

export default class MemberInfolAPI {
  // 查询会员信息设置列表
  @httpInterceptors
  findColumnList(params) {
    return Http.get('/sys/member/TMemberColumn/searchMemberColumnList', {
      params
    })
  }

  // 查询可以设置的会员信息
  @httpInterceptors
  findMemberColumn(params) {
    return Http.get('/sys/member/TMemberColumn/findMemberColumn', {
      params
    })
  }

  // 保存会员信息设置
  @httpInterceptors
  saveMemberColumn(params) {
    return Http.post('/sys/member/TMemberColumn/saveMemberColumn', params)
  }
}
