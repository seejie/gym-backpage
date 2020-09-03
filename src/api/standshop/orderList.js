import request from '@/utils/request';
import qs from 'qs';

// 标准电商订单列表
export function shopOrderPage(params) {
  return request({
    url: '/shop/order/findPageList',
    method: 'GET',
    params,
  });
}

// 标准电商商品订单退款 订单核销
export function shopOrderUpdateStatus(params) {
  return request({
    url: `/shop/shopOrder/updateStatus?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
    method: 'POST',
  });
}

// 标准电商商品订单详情
export function shopOrderInfo(params) {
  return request({
    url: `/shop/order/orderDetail`,
    method: 'GET',
    params,
  });
}

// 标准电商商品订单发货
export function shopSendGoods(params) {
  return request({
    url: `/shop/order/sendGoods`,
    method: 'PUT',
    params,
  });
}

// 导出标准电商商品订单
export function exportOrders(params) {
  return request({
    url: `/shop/order/exportOrders`,
    method: 'GET',
    params,
  });
}

// 审核退款
export function auditRefund(params) {
  return request({
    url: `/shop/order/auditRefund`,
    method: 'GET',
    params,
  });
}

// 审核退货
export function auditReturnGoods(params) {
  return request({
    url: `/shop/order/auditReturnGoods`,
    method: 'GET',
    params,
  });
}

// 确认退款，调用微信支付退款
export function weChatRefund(data) {
  return request({
    url: `/shop/order/weChatRefund`,
    method: 'POST',
    data,
  });
}
