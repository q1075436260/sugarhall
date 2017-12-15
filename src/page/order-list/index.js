'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide       = require('page/common/nav-side/index.js');
var _mm           = require('util/mm.js');
var _order        = require('service/order-service.js');
var Pagination    = require('util/pagination/index.js');
var templateIndex = require('./index.string');
var page = {
  data : {
    listParam : {
      // 第几页
      pageNum   : 1,
      // 多少页分隔
      pageSize  : 5
    }
  },
  init : function() {
    this.onLoad();
  },
  onLoad : function() {
    this.loadOrderList();
    //初始化左侧菜单
    navSide.init({
      name : 'order-list'
    });
  },
  // 加载订单列表
  loadOrderList : function() {
    // 缓存分页参数
    var _this           = this,
        orderListHtml   = '',
        $listCon        = $('.order-list-con');
    $listCon.html('<div class="loading"></div>');
    _order.getOrderList(_this.data.listParam,function(res) {
      // 请求回来是一个列表  需要做个filter
      // 渲染 html
      orderListHtml = _mm.renderHtml(templateIndex,res);
      $listCon.html(orderListHtml);
      _this.loadPagination({
        hasPreviousPage : res.hasPreviousPage,
        prePage         : res.prePage,
        hasNextPage     : res.hasNextPage,
        nextPage        : res.nextPage,
        pageNum         : res.pageNum,
        pages           : res.pages,
      });
    }, function(errMsg) {
       $listCon.html('<p class="err-tip">加载订单失败,请刷新后重试</p>');
    });
  },
  loadPagination : function(pageInfo) {
    var _this = this;
    // 查看有无分页  有分页不做处理 无分页执行一个新的 Pagination 对象
    this.pagination ? '' : (this.pagination = new Pagination());
    this.pagination.render($.extend({}, pageInfo,{
      container : $('.pagination'),
      onSelectPage : function(pageNum) {
        // 修改页数信息
        _this.data.listParam.pageNum = pageNum;
        _this.loadOrderList();
      },
    }));
  },
};

$(function() {
  page.init();
});
