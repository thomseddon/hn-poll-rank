

(function(){
  var el = document.getElementById('post'),
    form = document.getElementById('form');
  if (el && form) {
    form.onsubmit = function () { console.log('here')
      if (el.value.match(/id=/)) {
        el.value = el.value.split('id=')[1];
      }
      console.log(el.value);
      return true;
    };
  }

})();
