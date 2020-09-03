import request from '@/utils/request'
import { isFunction, isArray } from '@/utils/validate'
import { Header } from 'element-ui'
import qs from 'qs'

export const PAGE_SIZE = 5

export function getStartTime(_this, date) {
  return _this.$moment(date).format('YYYY-MM-DD HH:mm:SS')
}

export function getEndTime(_this, date) {
  return _this.$moment(date).format('YYYY-MM-DD') + ' 23:59:59'
}

function responseCallback(data, callback) {
  console.log(data)
  if (data && data.resCode == 200 && data.resObject) {
    if (isFunction) {
      callback(data.resObject)
    }
  }
}

export function saveChannel(data) {
  return request({
    url: '/platformsetting/channel/add',
    method: 'POST',
    data,
  })
}

export function saveShopChannel(data) {
  return request({
    url: '/shop/channel',
    method: 'POST',
    data,
  })
}

export function saveHuigouChannel(data) {
  return request({
    url: '/huigou/channel/updateHuigouChannelinfo',
    method: 'POST',
    data,
  })
}

// 新增圈子模块的页面设置信息, 供圈子管理-主页配置使用
export function addCirclePageSetting(data) {
  return request({
    url: '/circle/pagesetting/addPageSetting',
    method: 'POST',
    data,
  })
}

// 修改圈子模块的页面设置信息, 供资讯管理-主页配置使用
export function modifyCirclePageSetting(data) {
  return request({
    url: '/circle/pagesetting/modifyPageSetting',
    method: 'POST',
    data,
  })
}

// 新增社区模块的页面设置信息, 供社区管理-主页配置使用
export function addShequPageSetting(data) {
  return request({
    url: '/shequ/pagesetting/addPageSetting',
    method: 'POST',
    data,
  })
}

// 修改社区模块的页面设置信息, 供社区管理-主页配置使用
export function modifyShequPageSetting(data) {
  return request({
    url: '/shequ/pagesetting/modifyPageSetting',
    method: 'POST',
    data,
  })
}

// 管理员针对某个单位和频道新增栏目, channelType代表频道， unitId代表单位
export function addColumnForChannelType(data) {
  return request({
    url: '/platformsetting/column/addColumnForChannelType',
    method: 'POST',
    data,
  })
}

// 管理员针对某个单位和频道修改栏目, channelType代表频道， unitId代表单位
export function modifyColumnForChannelType(data) {
  return request({
    url: '/platformsetting/column/modifyColumnForChannelType',
    method: 'POST',
    data,
  })
}

// 管理员针对某个单位和频道删除栏目, channelType代表频道， unitId代表单位
export function deleteColumnById(data) {
  return request({
    url: `/platformsetting/column/deleteColumnById?id=${data.id}`,
    method: 'GET',
    data,
  })
}

// 单位用户修改频道栏目设置信息，包括排序, 例如：资讯管理-主页配置，专题设置修改提交
export function setColumnByUnitId(data) {
  return request({
    url: '/platformsetting/column/setColumnByUnitId',
    method: 'POST',
    data,
  })
}

// 修改个人设置
export function modifyPersionSetting(data) {
  return request({
    url: '/platformsetting/personalcenter/modifyPersionSetting',
    method: 'POST',
    data,
  })
}

export function getChannelData(callback) {
  request({
    url: '/platformsetting/channel/listByUnitIdAndChannelType',
    method: 'GET',
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function getAllChannelByUnitId(payload, callback) {
  request({
    url: `/platformsetting/channel/getAllChannelByUnitId`,
    method: 'GET',
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function getChannelCommonData(channelData) {
  return {
    id: channelData.id,
    channel_type: channelData.channel_type,
    channel_name: channelData.channel_name,
    channel_sort: channelData.channel_sort,
    channel_title_image: channelData.channel_title_image,
    channel_img_url: channelData.channel_img_url,
    uncheck_channel_img_url: channelData.uncheck_channel_img_url,
    share_title: channelData.share_title,
    share_desc: channelData.share_desc || '',
  }
}

export function getChannelSortList(callback) {
  request({
    url: '/platformsetting/channel/queryChannelSort',
    method: 'GET',
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function setChannelSort(channelDataList, callback) {
  request({
    url: '/platformsetting/channel/setChannelsByUnitId',
    method: 'POST',
    data: channelDataList,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(data => {
    if (isFunction(callback)) {
      callback(data)
    }
  })
}

export function getImageList(params, callback) {
  request({
    url: '/material/getImageList',
    method: 'GET',
    params,
  }).then(data => {
    console.log(data)
    if (isFunction(callback)) {
      callback(data.resObject)
    }
  })
}

export function getImageInfo(id, callback) {
  request({
    url: '/material/getImage',
    method: 'POST',
    data: {
      id: id,
    },
  }).then(data => responseCallback(data, callback))
}

export function getNewsGroupList(callback) {
  request({
    url: '/material/getNewsGroupList',
    method: 'GET',
  }).then(data => {
    if (isFunction(callback)) {
      if (data.resObject && isArray(data.resObject.index)) {
        callback(data.resObject)
      }
    }
  })
}

export function getNewsList(params, callback) {
  request({
    url: '/material/getNewsListByGroupId',
    method: 'GET',
    params,
  }).then(data => {
    console.log(data)
    if (isFunction(callback)) {
      callback(data.resObject)
    }
  })
}

export function getNewsInfo(id, callback) {
  request({
    url: '/material/getNews',
    method: 'POST',
    data: {
      id: id,
    },
  }).then(data => responseCallback(data, callback))
}

export function getVoiceGroupList(callback) {
  request({
    url: '/material/getVoiceGroupList',
    method: 'GET',
  }).then(data => {
    if (isFunction(callback)) {
      if (data.resObject && isArray(data.resObject.index)) {
        console.log(data.resObject)
        callback(data.resObject)
      }
    }
  })
}

export function getVoiceList(params, callback) {
  request({
    url: '/material/getVoiceList',
    method: 'GET',
    params,
  }).then(data => {
    console.log(data)
    if (isFunction(callback)) {
      callback(data.resObject)
    }
  })
}

export function getVoiceInfo(id, callback) {
  request({
    url: '/material/getVoice',
    method: 'POST',
    data: {
      id: id,
    },
  }).then(data => responseCallback(data, callback))
}

export function getVideoGroupList(callback) {
  request({
    url: '/material/getVideoGroupList',
    method: 'GET',
  }).then(data => {
    if (isFunction(callback)) {
      if (data.resObject && isArray(data.resObject.index)) {
        console.log(data.resObject)
        callback(data.resObject)
      }
    }
  })
}

export function getVideoList(params, callback) {
  request({
    url: '/material/getVideoList',
    method: 'GET',
    params,
  }).then(data => {
    console.log(data)
    if (isFunction(callback)) {
      callback(data.resObject)
    }
  })
}

export function getVideoInfo(id, callback) {
  request({
    url: '/material/getVideo',
    method: 'POST',
    data: {
      id: id,
    },
  }).then(data => responseCallback(data, callback))
}

export function getMaterialGroupList(groupType, callback) {
  switch (groupType) {
    case 'news':
      getNewsGroupList(callback)
      break
    case 'image':
      getImageGroupList(callback)
      break
    case 'voice':
      getVoiceGroupList(callback)
      break
    case 'video':
      getVideoGroupList(callback)
      break
    default:
      break
  }
}

export function getMaterialDataList(ekey, params, callback) {
  switch (ekey) {
    case 'news':
      getNewsList(params, callback)
      break
    case 'image':
      getImageList(params, callback)
      break
    case 'voice':
      getVoiceList(params, callback)
      break
    case 'video':
      getVideoList(params, callback)
      break
    default:
      break
  }
}

export function getMenuList(callback) {
  request({
    url: '/platformsetting/wxMenu/menuList',
    method: 'GET',
  }).then(data => {
    console.log(data)
    if (isArray(data.resObject) && isFunction(callback)) {
      callback(data.resObject)
    }
  })
}

export function getMenuInfo(params, callback) {
  request({
    url: '/platformsetting/wxMenu/getMenu',
    method: 'GET',
    params,
  }).then(data => responseCallback(data, callback))
}

export function saveWxMenu(params, callback) {
  request({
    url: '/platformsetting/wxMenu/saveWxMenu',
    method: 'POST',
    data: params,
  }).then(data => responseCallback(data, callback))
}

// 地图
export function getVenueTypelist(callback) {
  // request({
  //   url: '/back/venue/getVenueTypelist',
  //   method: 'POST',
  //   data: {
  //     typeName: '',
  //     pageIndex: 1,
  //     pageSize: 10000
  //   }
  // }).then(data => {
  //   responseCallback(data, callback);
  // })
}

export function addVenue(params, callback) {
  request({
    url: '/back/venue/addVenue',
    method: 'POST',
    data: params,
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function modVenue(params, callback) {
  request({
    url: '/back/venue/modVenue',
    method: 'POST',
    data: params,
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function delVenue(ids, callback) {
  request({
    url: '/back/venue/delVenue',
    method: 'POST',
    data: {
      ids: ids,
    },
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function getVenueList(params, callback) {
  request({
    url: '/back/venue/getVenuelist',
    method: 'POST',
    data: params,
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function getVenueLabelList(callback) {
  request({
    url: '/back/venue/getVenueLabelList',
    method: 'POST',
    data: {
      labelName: '',
      pageIndex: 1,
      pageSize: 10000,
    },
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function onOffVenue(params, callback) {
  request({
    url: '/back/venue/onOffVenue',
    method: 'POST',
    data: params,
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function commentVenue(params, callback) {
  request({
    url: '/back/venue/commentVenue',
    method: 'POST',
    data: params,
  }).then(data => {
    responseCallback(data, callback)
  })
}

export function getShoplist(params, callback) {
  request({
    url: '/back/venue/getShoplist',
    method: 'POST',
    data: params,
  }).then(data => responseCallback(data, callback))
}

export function getLogisticsListByunit(params, callback) {
  request({
    url: `/platformsetting/logistics/logisticsList?${qs.stringify(params)}`,
    method: 'POST',
  }).then(data => {
    responseCallback(data, callback)
  })
}

