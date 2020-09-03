import Http from '@/utils/request'
import { httpInterceptors } from '@/utils/decorators'

export class MemberSearchAPI {
  // 批量删除会员（物理删除）
  @httpInterceptors
  deleteMember(params) {
    return Http.get('/sys/member/deleteMember', {
      params
    })
  }

  // 根据会员id查询会员详情
  @httpInterceptors
  getMemberInfo(params) {
    return Http.get('/sys/member/getMemberInfo', {
      params
    })
  }

  // 分页查询会员列表
  @httpInterceptors
  getMemberlist(params) {
    return Http.get('/sys/member/getMemberlist', { params })
  }

  // 批量修改会员禁言状态
  @httpInterceptors
  modifyGag(params) {
    return Http.get('/sys/member/modifyGag', {
      params
    })
  }

  // 批量修改会员等级
  @httpInterceptors
  modifyMemberCommLevel(params) {
    return Http.get('/sys/member/modifyMemberCommLevel', {
      params
    })
  }

  // 查询单位会员信息字段
  // 场景： 点击查看某一条用户详情信息时
  // 作用： 详情信息列表的数据是动态显示的，需要先请求此接口，显示要渲染的指定数据有哪些
  // 结构： name: 列表的中文标题
  //       columnName: 对应字段名称。
  //        用法：在‘根据会员id查询会员详情’API返回的数据中，用columnName作为键值，找到对应的数据，作为内容信息
  @httpInterceptors
  getMemberColumnInfo(params) {
    return Http.get('/sys/member/getMemberColumnInfo', {
      params
    })
  }

  // 查询用户订单信息
  @httpInterceptors
  findMemberOrderPageList(params) {
    return Http.get('/sys/member/findMemberOrderPageList', {
      params
    })
  }

  // 会员积分查询
  @httpInterceptors
  getMemberJifenlist(params) {
    return Http.get('/sys/member/getMemberJifenlist', {
      params
    })
  }

  // 修改会员状态
  @httpInterceptors
  editStatus(params) {
    return Http.post('/sys/member/modify', params)
  }

  // 会员积分调整
  @httpInterceptors
  updateMemeberJifen(params) {
    return Http.post('/sys/member/updateMemeberJifen', params, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      }
    })
  }
}

export class MemberGroupAPI {
  // 删除会员分组(单个/批量)
  @httpInterceptors
  deleteGroup(params) {
    return Http.get('/sys/member/TMemberGroup/deletes', {
      params
    })
  }

  // 查询会员分组列表
  @httpInterceptors
  findGroupList(params) {
    return Http.get('/sys/member/selectUnitGroup', {
      params
    })
  }

  // 批量修改会员分组
  @httpInterceptors
  modifyMemberGroup(params) {
    return Http.get('/sys/member/modifyMemberGroup', {
      params
    })
  }

  // 创建会员分组
  @httpInterceptors
  createGroup(params) {
    return Http.post('/sys/member/TMemberGroup/create', params)
  }

  // 编辑会员分组
  @httpInterceptors
  updateGroup(params) {
    return Http.post('/sys/member/TMemberGroup/update', params)
  }
}
