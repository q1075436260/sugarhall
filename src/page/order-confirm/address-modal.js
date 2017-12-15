'use strict';
var _mm                   = require('util/mm.js');
var _cities               = require('util/cities/index.js');
var _address              = require('service/address-service.js');
var templateAddressModal  = require('./address-modal.string');


var addressModal = {
  // 这里有一个函数属性方面的问题需要理解
  show : function(option) {
    this.option      = option;
    this.option.data = option.data;
    this.$modalWrap = $('.modal-wrap');
    this.loadModal();
    this.bindEvent();
  },
  hide : function() {
  this.$modalWrap.empty();
  },
  bindEvent : function() {
    var _this = this;
    // 做 change 绑定  如果change的话 加载city
    // 省市二级联动
    this.$modalWrap.find('#receiver-province').change(function() {
      var selectedProvince = $(this).val();
      _this.loadCities(selectedProvince);
    });
    // 点击叉号或者模板区域, 关闭弹窗
    this.$modalWrap.find('.close').click(function() {
      _this.hide();
    });
    this.$modalWrap.find('.modal-container').click(function(e) {
     e.stopPropagation();
    });
    // 提交收货地址
    this.$modalWrap.find('.address-btn').click(function() {
      var receiverInfo = _this.getReceiverInfo(),
          /* 用传入的show()  里面有isUpdate 和 isUpdate 属性
          因为在顶部被定义在了option里面
          所以调用都是通过this.option调用的 */
          isUpdate     = _this.option.isUpdate;
      // 添加新地址
      if (!isUpdate && receiverInfo.status) {
        _address.save(receiverInfo.data, function(res) {
          _mm.successTips('地址添加成功');
          _this.hide();
          typeof _this.option.onSuccess === 'function'
          && _this.option.onSuccess(res);
        }, function(errMsg) {
          _mm.errorTips(errMsg);
        })
      }
      // 编辑地址
      else if (isUpdate && receiverInfo.status) {
      _address.update(receiverInfo.data, function(res) {
        _mm.successTips('地址编辑成功');
        _this.hide();
        typeof _this.option.onSuccess === 'function'
        && _this.option.onSuccess(res);
      }, function(errMsg) {
        _mm.errorTips(errMsg);
      })
      }
      else {
        _mm.errorTips(receiverInfo.errMsg);
      }
    })
  },
  loadModal : function() {
  var addressModalHtml = _mm.renderHtml(templateAddressModal,{
    isUpdate : this.option.isUpdate,
    data     : this.option.data
  });
  this.$modalWrap.html(addressModalHtml);
  this.loadProvince();
  },
  getSelectOption : function(optionArray) {
    // 这里是一个空选项
    var html = '<option value="">请选择</option>';
    // 循环 optionArray  一次缓存即可
    for (var i = 0, length = optionArray.length; i < length; i++) {
      // 用 + arrayOption[i] + 的方法转化一下 取它的第i个元素
      html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>';
    }
    return html;
  },
  loadProvince : function() {
  var provinces          = _cities.getProvinces() || [],
      $provinceSelect    = this.$modalWrap.find('#receiver-province');
  $provinceSelect.html(this.getSelectOption(provinces));
  // 如果是更新地址，并且有省份信息，做省份的回填
         if(this.option.isUpdate && this.option.data.receiverProvince){
             $provinceSelect.val(this.option.data.receiverProvince);
             this.loadCities(this.option.data.receiverProvince);
         }
  },
  // 获取 select 的选项  输入: array 输出 HTML  这个方法在获取城市的时候也会用到
  // 加载城市信息  先加载完省份后在加载城市
  loadCities : function(provinceName) {
    var cities       = _cities.getCities(provinceName) || [],
        $citySelect  = this.$modalWrap.find('#receiver-city');
    $citySelect.html(this.getSelectOption(cities));
    // 如果是编辑地址 并且有省份信息  做城市的回填
        if(this.option.isUpdate && this.option.data.receiverCity){
            $citySelect.val(this.option.data.receiverCity);
        }
  },
  getReceiverInfo : function() {
    // 这里 receiverInfo 仅用于数据调用以及表单的验证
    var receiverInfo = {},
        result       = {
          status : false
        };
    // 获取名字等信息 这些信息的名字都是和后端协商过的名字 要非空执行
    receiverInfo.receiverName     = $.trim(this.$modalWrap.find('#receiver-name').val());
    receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
    receiverInfo.receiverCity     = this.$modalWrap.find('#receiver-city').val();
    receiverInfo.receiverPhone    = $.trim(this.$modalWrap.find('#receiver-phone').val());
    receiverInfo.receiverAddress  = $.trim(this.$modalWrap.find('#receiver-address').val());
    receiverInfo.receiverZip      = $.trim(this.$modalWrap.find('#receiver-zip').val());
    if (this.option.isUpdate) {
      receiverInfo.id = $.trim(this.$modalWrap.find('#receiver-id').val())
    }
    // 表单验证
    if (!receiverInfo.receiverName) {
      result.errMsg = '请输入收件人姓名';
    }
    else if (!receiverInfo.receiverProvince) {
      result.errMsg = '请选择收件人所在省份';
    }
    else if (!receiverInfo.receiverCity) {
      result.errMsg = '请选择收件人所在城市';
    }
    else if (!receiverInfo.receiverAddress) {
      result.errMsg = '请输入收件人地址';
    }
    else if (!receiverInfo.receiverPhone) {
      result.errMsg =  '请输入收件人手机号';
    }
    // 所有验证都通过
    else {
      result.status  = true;
      result.data = receiverInfo;
    }
    return result;
  },
}


module.exports = addressModal;
