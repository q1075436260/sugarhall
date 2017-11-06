'use strict';

require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('../../util/mm.js');

console.log(_mm.getUrlParam('test'));

var html = '<div>{{data}}</div>';
var data = {
  data : '我爱你'
}
console.log(_mm.renderHtml(html,data));

navSide.init({
  name : 'pass-update'
  });
