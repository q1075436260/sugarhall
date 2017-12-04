'use strict';
require('./index.css');
require('../user-center/index.css');
require('page/common/header/index.js');
var nav = require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');
var page = {
  data : {

  },
  init : function() {
    this.onLoad();
    this.bindEvent();
  },
  onLoad : function() {
    this.loadCart();
  },
  bindEvent : function() {
    var _this = this;
    // 商品的 选择/取消选择
    $(document).on('click','.cart-select', function() {
      var $this = $(this),
          productId = $this.parents('.cart-table').data('product-id');
      //选中
      if ($this.is(':checked')) {
        _cart.selectProduct(productId,function(res) {
          _this.renderCart(res);
        }, function(errMsg) {
          _this.showCartError();
        });
      }
      // 取消选中
      else {
        _cart.unselectProduct(productId,function(res) {
          _this.renderCart(res);
        }, function(errMsg) {
          _this.showCartError();
        });
      }
    });
    // 商品的 全选 / 取消全选
    $(document).on('click', '.cart-select-all', function(){
        var $this = $(this);
        // 全选
        if($this.is(':checked')){
            _cart.selectAllProduct(function(res){
                _this.renderCart(res);
            }, function(errMsg){
                _this.showCartError();
            });
        }
        // 取消全选
        else{
          _cart.unselectAllProduct(function(res){
            _this.renderCart(res);
            }, function(errMsg){
                _this.showCartError();
            });
          }
        });
    // 商品数量变化
    $(document).on('click','.count-btn', function() {
      // 缓存 this 和 count
      var $this  = $(this),
          // 因为要找的是按钮 如果用选择器会很麻烦 所以要找相邻的input
          $pCount    = $this.siblings('.count-input'),
          currCount  = parseInt($pCount.val()),
          type       = $this.hasClass('plus') ? 'plus' : 'minus',
          productId  = $this.parents('.cart-table').data('product-id'),
          minCount   = 1,
          maxCount   = parseInt($pCount.data('max')),
          newCount   = 0;
          if (type === 'plus') {
            if (currCount >= maxCount) {
              _mm.errorTips('该商品已达到上限');
              return;
            }
            newCount = currCount + 1;
          }else if (type === 'minus') {
            if (currCount <= minCount) {
              return;
            }
            newCount = currCount - 1;
          }
          // 更新购物车商品数量
          _cart.updateProduct({
            productId : productId,
            count     : newCount
          }, function(res) {
              _this.renderCart(res);
          }, function(errMsg) {
              _this.showCartError();
          });
    });
    // 删除单个商品
  $(document).on('click','.cart-delete', function() {
    if (window.confirm('确认删除该商品?')){
      var productId = $(this).parents('.cart-table').data('product-id');
      _this.deleteCartProduct(productId);
    }
  });
    // 删除选中物品
  $(document).on('click','.delete-selected', function() {
    if (window.confirm('确认删除选中物品?')) {
    var  arrProductIds     = [],
         $selectedItem     = $('.cart-select:checked');
    // 循环查找选中的productId
    for (var i = 0,iLength = $selectedItem.length; i < iLength; i++) {
      arrProductIds.push($($selectedItem[i]).parents('.cart-table')
      .data('product-id'));
       }
    if (arrProductIds.length > 0) {
      _this.deleteCartProduct(arrProductIds.join(','));
      }
    else {
      _mm.errorTips('您还没有选中要删除的商品');
      }
    }
    });
    // 结算商品
    $(document).on('click','.btn-submit', function() {
      if (_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice) {
        window.location.href = './order-confirm.html';
      }
      else {
        _mm.errorTips('请选择商品后在提交');
      }
    })
  },

  // 加载购物车信息
  loadCart : function() {
    var _this = this;
    // 获取购物车列表
    _cart.getCartList(function(res) {
      _this.renderCart(res);
    }, function(errMsg) {
      _this.showCartError();
    });
  },
  renderCart : function(data) {
    this.filter(data);
    // 缓存数据
    this.data.cartInfo = data;
    var cartHtml = _mm.renderHtml(templateIndex,data);
    $('.page-wrap').html(cartHtml);
    nav.loadCartCount();
  },
  // 数据匹配
  filter : function(data) {
  // 非空验证
    data.notEmpty = !!data.cartProductVoList.length;
  },
  // 删除商品 支持批量 productId用逗号分隔
  deleteCartProduct : function(productIds) {
    var _this = this;
    _cart.deleteProduct(productIds,function(res) {
      _this.renderCart(res);
    }, function(errMsg) {
      _this.showCartError();
    })
  },
  // 显示错误信息
  showCartError : function() {
    $('.page-wrap').html('<p class="err-tip">页面错误,请刷新页面</p>');
  }
};
$(function() {
  page.init();
})
