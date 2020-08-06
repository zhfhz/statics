(function () {
  /**
   * 兼容 < IE10
   */
  var _addEventListener = window.addEventListener || window.attachEvent;
  window.addEventListener = function () {
    if (document.all) {
      _addEventListener.call(this, 'on' + arguments[0], arguments[1]);
    } else {
      _addEventListener.apply(this, [].slice.call(arguments, 0));
    }
  }

  /**
   * 页面加载1:1 缩放
   */
  var responsiveFunc = function () {
    var width = window.screen.width;
    var remRate = 10/1366; // 按设计稿1366x768还原，1rem = 10px;
    var rootFontSizeShouldBe = width * remRate;
    document.getElementsByTagName('html')[0].style.fontSize = rootFontSizeShouldBe + 'px';
    /**
     * 适配小于12px的字号
     * 'font-size-9, font-size-10, font-size-11'
     */
    var styleStr = '[class*=font-size-] {display: inline-block;transform-origin: left center;pointer-events: none;}[class*=font-size-] input {pointer-events: all;}[class*=font-size-].l {transform-origin: left center;}[class*=font-size-].c {transform-origin: center;}[class*=font-size-].r {transform-origin: right center;}[class*=font-size-] * {font-size: inherit;}';

    if (rootFontSizeShouldBe * 0.9 < 12) {
      styleStr += '.font-size-9:not(:empty), .font-size-9:empty:after, .font-size-9:empty:before { transform: scale(' + (rootFontSizeShouldBe * 0.9 / 12) + ');font-size: 0.9rem}'
    }
    if (rootFontSizeShouldBe < 12) {
      styleStr += '.font-size-10:not(:empty), .font-size-10:empty:after, .font-size-10:empty:before { transform: scale(' + (rootFontSizeShouldBe / 12) + '); font-size: 1rem}'
    }
    if (rootFontSizeShouldBe * 1.1 < 12) {
      styleStr += '.font-size-11:not(:empty), .font-size-11:empty:after, .font-size-11:empty:before { transform: scale(' + (rootFontSizeShouldBe * 1.1 / 12) + '); font-size: 1.1rem}'
    };

    var styleDom = document.createElement('style');
    styleDom.innerText = styleStr;
    document.head.appendChild(styleDom);
  }
  window.addEventListener('DOMContentLoaded', responsiveFunc);

  /**
   * Promise
   */
  window.Promise = window.Promise || function (executor) {
    var self = this;
    var resolveCallbacks = [];
    var rejectCallbacks = [];
    var finallyCallbacks = [];
    var always = function () {
      for (var i = 0, len = finallyCallbacks.length; i < len; i++) {
        finallyCallbacks[i].apply(window, arguments);
      }
    }
    var resolve = function () {
      for (var i = 0, len = resolveCallbacks.length; i < len; i++) {
        resolveCallbacks[i].apply(window, arguments);
      }
      always();
    }
    var reject = function () {
      for (var i = 0, len = rejectCallbacks.length; i < len; i++) {
        rejectCallbacks[i].apply(window, arguments);
      }
      always();
    }
    this.then = function (callback) {
      if (typeof callback !== 'function') {
        return
      }
      resolveCallbacks.push(callback);
      return self;
    }
    this.catch = function (callback) {
      if (typeof callback !== 'function') {
        return self
      }
      rejectCallbacks.push(callback);
      return self;
    }
    this.finally = function (callback) {
      if (typeof callback !== 'function') {
        return self;
      }
      finallyCallbacks.push(callback);
      return self;
    }
    setTimeout(function () {
      executor(resolve, reject);
    }, 0);
  }

  /**
   * 解析URL参数
   */
  window.URLSearchParams = window.URLSearchParams || function (searchStr) {
    var arr = (searchStr || '').replace('?', '').split(/&+/);
    var params = {};
    for (var i = 0, len = arr.length; i< len; i++) {
      if (arr[i]) {
        var key_val = arr[i].split('=');
        params[key_val[0]] = params[key_val[0]] || [];
        params[key_val[0]].push(key_val[1]);
      }
    }
    this.get = function (key) {
      return params[key][0];
    }
    this.getAll = function (key) {
      return params[key];
    }
    this.append = function (key, value) {
      if (params[key]) {
        params[key].push(value);
        return;
      }
      params[key]=[value];
    }
    this.toString = function () {
      var search = '';
      for (var key in params) {
        search += key + '=' + params[key].join(',') + '&';
      }
      if (search.charAt(search.length - 1) === '&') {
        search = search.substr(0,search.length -1)
      }
      return search;
    }
  }



})();