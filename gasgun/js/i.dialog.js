(function () {

  /**
   *  弹窗, 处理独立的支付
   */

  var container = null;
  var stack = [];
  var maskDom = null;

  var IDialog = function (config) {
    var html = '';
    var scrollbox = '';
    var id = null;
    if (this === window) {
      throw Error('use new operator to create instance.');
    }

    function IDialog() {
      if (!container) {
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.height = '0px';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.zIndex = '999';
        container.innerHTML = '<div class="i-dialog-mask"></div>';
        document.body.appendChild(container);
        maskDom = document.getElementsByClassName('i-dialog-mask')[0];
      }
      scrollbox =
          '<div class="scroller-container" style="height: 100%;">' +
          ' <div class="scroller">' +
            (config.contentUrl ? '<iframe src ="[[contentUrl]]&dialogId=[[id]]" onload="window.IDialog[[[id]]].setIframeHeight(this)" style="width: 100%;border: 0 none;" scrolling="no"></iframe>' : '[[contentHtml]]') +
          ' </div>' +
          '</div>';
      html =
        ' <div class="i-dialog [[className]]" style="z-index: [[level]];width: [[width]]; display: none;">' +
        '   <div class="i-dialog-head" style="display: [[showHead]]">' +
        '     <div class="scale-text">' +
        '      <span class="text">[[title]]</span>' +
        '     </div>' +
        '     <i class="i-dialog-close" style="display: [[showClose]]">X</i>' +
        '   </div>' +
        '   <div class="i-dialog-content" style="height: [[height]];">' +
              scrollbox +
        '   </div>' +
        '   <div class="i-dialog-foot" style="display: [[showFoot]];">' +
        '     [[footHtml]]' +
        '   </div>' +
        ' </div>';
    }
    var renderDialog = function () {
      config.width = config.width || '40rem';
      config.height = config.height || config.width.replace(/^\d+/, function(str) {
        return str / 2;
      });
      window.IDialog[id] = {
        setIframeHeight: function (iframe) {
          iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
        }
      };
      var model = {
        id: id,
        contentUrl: config.contentUrl,
        width: config.width || '40rem',
        height:config.height,
        className: config.className || '',
        showClose: config.showClose ? 'block' : 'none',
        title: config.title,
        level: stack.length + 10,
        showHead: config.showClose || config.title ? 'block' : 'none',
        footHtml: config.footHtml || '',
        showFoot: config.footHtml ? 'block' : 'none',
        contentHtml: config.contentHtml || '',
      }
      var frag = document.createElement('div');
      frag.innerHTML = html.replace(/\[\[\w+\]\]/gm, function ($0) {
        var key = $0.substr(2, $0.length - 4);
        return model[key];
      })
      stack.push(frag.children[0]);
      container.appendChild(frag.firstElementChild);
    }
    var destroyDialog = function () {
      var dialog = stack[id];
      dialog.style.display = 'none';
      dialog.parentElement.removeChild(dialog);
      html = null;
      id = null;
      stack[id] = null
    }
    IDialog.prototype.getId = function () {
      return id;
    }
    IDialog.prototype.open = function () {
      id = stack.length;
      renderDialog();
      var dialog = stack[id];
      if (!config.mask) {
        maskDom.style.pointerEvents = 'all';
        maskDom.style.opacity = '0.4';
      }
      dialog.style.display = 'block';
      var promise = new Promise(function (resolve, reject) {
        window.IDialog[id].close = function (){
          resolve.apply(window, arguments);
        }
        window.IDialog[id].cancel = function (){
          reject.apply(window, arguments);
        }
      });
      return promise;
    }
    IDialog.prototype.close = function () {
      maskDom.style.pointerEvents = 'none';
      maskDom.style.opacity = '0';
      destroyDialog();
    }
    return new IDialog();
  }

  window.IDialog = IDialog;
})();