var cat = require('./');
var co = require('co');

co(function*(){
  var read = cat(twice('foo'), twice('bar'), twice('baz'));
  var data;
  while (data = yield read()) console.log(data);
})();

function twice(str){
  var i = 0;
  return function*(end){
    if (end) return;
    if (++i <3) return str;
  }
}