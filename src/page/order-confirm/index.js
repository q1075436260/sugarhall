'use strict';
require('./index.css');
require('../common/nav/index.js');
require('../common/header/index.js');
var _mm             = require('util/mm.js');
var _order          = require('service/order-service.js');
var _address        = require('service/address-service.js');
var templateAddress = require('./address-list.string');
var templateProduct = require('./product-list.string');
var addressModal    = require('./address-modal.js');

var page = {
  // 存放数据 用来存放选择了那些地址 最开始是没有选中的所以 为  null
  data : {
    selectedAddressId : null
  },
  init : function() {
    this.onload();
    this.bindEvent();
  },
  onload : function() {
    //加载地址列表  + 加载商品清单
    this.loadAddressList();
    this.loadProductList();
  },
  bindEvent : function() {
    var _this = this;
    // 确认地址
    $(document).on('click', '.address-item', function() {
      $(this).addClass('active')
      .siblings('.address-item').removeClass('active');
      _this.data.selectedAddressId = $(this).data('id');
    });
    //进入支付模块   通过是否确认了地址来判断
    $(document).on('click', '.order-submit', function() {
      var shippingId = _this.data.selectedAddressId;
      if (shippingId) {
        _order.createOrder({
          shippingId : shippingId
        }, function(res) {
          window.location.href = './payment.html?orderNumber=' + res.orderNo;
        }, function(errMsg) {
          _mm.errorTips(errMsg)
        })
      }
    });
    // 地址添加
    $(document).on('click', '.address-add', function() {
      addressModal.show({
        // 确保这个不是更新地址
        isUpdate    : false,
        //放一个回调 重新加载返回的地址列表
        onSuccess   : function() {
          _this.loadAddressList();
        }
      });
    });
    // 编辑地址
    $(document).on('click', '.address-update', function(e) {
      e.stopPropagation();
      var shippingId = $(this).parents('.address-item').data('id');
      _address.getAddress(shippingId, function(res) {
        addressModal.show({
          isUpdate    : true,
          data        : res,
          onSuccess   : function() {
            _this.loadAddressList();
        }})
      }, function(errMsg) {
        _mm.errorTips(errMsg);
      });
    });
    // 删除地址
    $(document).on('click', '.address-delete', function(e) {
      e.stopPropagation();
      var id = $(this).parents('.address-item').data('id');
      if (window.confirm('确认删除该地址?')) {
        _address.deleteAddress(id, function(res) {
          _this.loadAddressList();
        }, function(errMsg) {
        _mm.errorTips(errMsg);
        })
      }
    })
  },
  // 加载地址
  loadAddressList : function() {
    var _this = this;
    $('.address-con').html('<div class="loading"></div>');
    // 获取地址列表
    _address.getAddressList(function(res) {
      _this.addressFilter(res);
      var AddressListHtml = _mm.renderHtml(templateAddress,res);
      $('.address-con').html(AddressListHtml);
    }, function(errMsg) {
      $('.address-con').html('<p class="err-tip">地址加载失败,请刷新后重试</p>');
    })
  },
  // 处理地址列表张选中状态
  addressFilter : function(data) {
    // 先判断有没有地址是选中状态
    if (this.data.selectedAddressId) {
      // 标记位   可能有 但是循环时已经删掉了
      var selectedAddressFlag = false;
      for (var i = 0, length = data.list.length; i < length; i++) {
        if (data.list[i].id === this.data.selectedAddressId) {
          data.list[i].isActive =true;
          selectedAddressFlag = true;
        }
      };
      // 如果以前选中的地址不在列表里 将其删除
      if (!selectedAddressFlag) {
        this.data.selectedAddressId = null;
      }
    }
  },
  // 加载商品清单
  loadProductList : function() {
    var _this = this;
    $('.address-con').html('<div class="loading"></div>');
    _order.getProductList(function(res) {
      var ProductListHtml =_mm.renderHtml(templateProduct,res);
      $('.product-con').html(ProductListHtml);
    }, function(errMsg) {
      $('.product-con').html('<p class="err-tip">商品信息加载失败,请刷新后重试</p>');
    })
  },
}


$(function() {
  page.init();
})
