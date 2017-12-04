'use strict';
var _mm = require('util/mm.js');

var _address = {
  getAddressList  : function(resolve,reject) {
    _mm.request({
      url        : _mm.getServerUrl('/shipping/list.do'),
      data       : {
        //限制地址的数量--最多取出50个地址
          pageSize : 50
      },
      success    : resolve,
      error      : reject
    });
  },
  // 添加地址
  save : function(receiverInfo, resolve, reject) {
    _mm.request({
      url        : _mm.getServerUrl('/shipping/add.do'),
      data       : receiverInfo,
      success    : resolve,
      error      : reject
    })
  },
  // 获取单条收件人信息
  getAddress : function(shippingId, resolve, reject) {
    _mm.request({
      url        : _mm.getServerUrl('/shipping/select.do'),
      data       : {
        shippingId : shippingId
      },
      success    : resolve,
      error      : reject
    })
  },
  // 修改地址
  update     : function(receiverInfo, resolve, reject) {
    _mm.request({
      url        : _mm.getServerUrl('/shipping/update.do'),
      data       : receiverInfo,
      success    : resolve,
      error      : reject
    })
  },
  // 删除地址
  deleteAddress : function(shippingId,resolve, reject) {
    _mm.request({
      url       : _mm.getServerUrl('/shipping/del.do'),
      data      : {
        shippingId : shippingId
      },
      success   : resolve,
      error     : reject
    })
  }
}


module.exports = _address;
