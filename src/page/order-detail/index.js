'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide       = require('page/common/nav-side/index.js');
var _mm           = require('util/mm.js');
var _order        = require('service/order-service.js');
var templateIndex = require('./index.string');
var page = {
  data : {
    // 通过 get参数取得
    orderNumber : _mm.getUrlParam('orderNumber')
  },
  init : function() {
    this.onLoad();
    this.bindEvent();
  },
  onLoad : function() {
    this.loadDetail();
    //初始化左侧菜单
    navSide.init({
      name : 'order-list'
    });
  },
  bindEvent : function() {
    var _this = this;
    $(document).on('click', '.order-cancel', function(){
        if(window.confirm('确认取消该订单?')){
            _order.cancelOrder(_this.data.orderNumber, function(res){
                _mm.successTips('该订单取消成功');
                _this.loadDetail();
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        }
    });
  },
  // 加载订单列表
  loadDetail : function() {
    // 缓存分页参数
    var _this           = this,
        orderDetailHtml = '',
        $content        = $('.content');
    $content.html('<div class="loading"></div>');
    _order.getOrderDetail(_this.data.orderNumber,function(res) {
      // 需要做个filter
      _this.dataFilter(res);
      // 渲染 html
      orderDetailHtml = _mm.renderHtml(templateIndex,res);
      $content.html(orderDetailHtml);
    }, function(errMsg) {
       $content.html('<p class="err-tip">' + errMsg + '</p>');
    });
  },
  // 数据适配
  dataFilter : function(data) {
    // 这是一个状态 表示提交了订单且在支付以前
    data.needPay      = data.status == 10;
    data.isCancelable = data.status == 10;
  }
};

$(function() {
  page.init();
});
