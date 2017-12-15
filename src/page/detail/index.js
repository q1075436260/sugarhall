'use strict';
require('./index.css');
require('../user-center/index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _product        = require('service/product-service.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');
var page = {
  data : {
      productId : _mm.getUrlParam('productId') || '',
  },
  init : function() {
    this.onLoad();
    this.bindEvent();
  },
  onLoad : function() {
    this.loadDetail();
    if (!this.data.productId) {
      _mm.goHome();
    }
  },
  bindEvent : function() {
    var _this = this;
    // 图片预览
    $(document).on('mouseenter','.p-img-item', function() {
      //取出image属性
      var imageUrl = $(this).find('.p-img').attr('src');
      $('.main-img').attr('src',imageUrl);
    });
    // count 操作
    $(document).on('click','.p-count-btn', function() {
      //取出image属性
      var type      = $(this).hasClass('plus') ? 'plus' : 'minus',
          $pCount   = $('.p-count'),
          currCount = parseInt($pCount.val()),
          minCount  = 1,
          maxCount  = _this.data.detailInfo.stock || 1;
      if (type === 'plus') {
        $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
      }
      else if (type === 'minus') {
        $pCount.val(currCount > minCount ? currCount - 1 : minCount);
      }
    });
    // 加入购物车
    $(document).on('click','.cart-add', function(e) {
      e.preventDefault();
      _cart.addToCart({
        productId : _this.data.productId,
        count     : $('.p-count').val()
      }, function(res) {
        window.location.href = './result.html?type=cart-add';
      }, function(errMsg) {
        _mm.errorTips(errMsg);
      });
    });
  },
  // 加载list数据
  loadDetail : function() {
    var _this     = this,
        html      = '',
        $pageWrap = $('.page-wrap');
    // loading
    $pageWrap.html('<div class="loading"></div>');
    // 请求 detail 信息
    _product.getProductDetail(this.data.productId,function(res) {
      _this.filter(res);
      // 缓存 detail 的数据
      _this.data.detailInfo = res;
      // render
      html = _mm.renderHtml(templateIndex,res);
      $pageWrap.html(html);
    }, function(errMsg) {
      $pageWrap.html('<p class="err-tip">此商品未找到</p>');
    });
  },
  // 数据匹配
  filter : function(data) {
    data.subImages = data.subImages.split(',');
  }
};

$(function() {
  page.init();
})
