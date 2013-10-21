

(function(){
  setInterval(function() {
    window.location.reload();
  }, 30000);

  var el = document.getElementById('post'),
    form = document.getElementById('form');
    console.log(el, form)
  if (el && form) {
    console.log('setup')
    form.onsubmit = function () { console.log('here')
      if (el.value.match(/id=/)) {
        el.value = el.value.split('id=')[1];
      }
      console.log(el.value);
      return true;
    };
  }

})();
