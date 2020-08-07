(function () {
  document.querySelector('.index-guns').addEventListener('click', function (e) {
    var target = e.target;
    if (target.className.indexOf('index-wait-pay') !== -1) {
      var payDialog = new IDialog({
        width: '80rem',
        contentUrl: 'pay.html?order=1234'
      });
      payDialog.open().then(function (result) {
        alert(result);
        location.reload();
      }).catch(function (result) {
        alert(result);
      }).finally(function () {
        payDialog.close()
      });
    }
  }, false);
})();