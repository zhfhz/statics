(function () {
  var urlParams = new URLSearchParams(location.search);
  var orderId = urlParams.get('order');
  var dialogId = urlParams.get('dialogId');
  var removeKeyboardEventListener = null;
  var cancelFunc = function () {
    removeKeyboardEventListener();
    window.parent.IDialog[dialogId].cancel('取消');
  };
  var okFunc = function () {
    removeKeyboardEventListener();
    window.parent.IDialog[dialogId].close('结账');
  };

  var keyboardEventListener = function (e) {
    if (e.key.toLowerCase() === 'escape') {
      cancelFunc();
    } else if (e.key.toLowerCase() === 'enter') {
      okFunc();
    }
  };

  document.body.addEventListener('keyup' ,keyboardEventListener);
  removeKeyboardEventListener = function () {
    document.body.removeEventListener('keyup' ,keyboardEventListener);
  };
  document.getElementsByClassName('pay-cancel-btn')[0].onclick = cancelFunc;
  document.getElementsByClassName('pay-ok-btn')[0].onclick = okFunc;
})();