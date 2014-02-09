var cat = require('./');
var co = require('co');
var equal = require('assert').equal;

describe('cat(stream, ..)', function(){
  it('should concatenate', function(done){
    co(function*(){
      var read = cat(twice('foo'), twice('bar'), twice('baz'));
      equal('foo', yield read());
      equal('foo', yield read());
      equal('bar', yield read());
      equal('bar', yield read());
      equal('baz', yield read());
      equal('baz', yield read());
    })(done);
  });
});

describe('cat(streams)', function(){
  it('should concatenate', function(done){
    co(function*(){
      var read = cat([twice('foo'), twice('bar'), twice('baz')]);
      equal('foo', yield read());
      equal('foo', yield read());
      equal('bar', yield read());
      equal('bar', yield read());
      equal('baz', yield read());
      equal('baz', yield read());
    })(done);
  });
});

describe('cat(string)', function(){
  it('should concatenate', function(done){
    co(function*(){
      var read = cat(twice('foo'), 'bar', twice('baz'));
      equal('foo', yield read());
      equal('foo', yield read());
      equal('bar', yield read());
      equal('baz', yield read());
      equal('baz', yield read());
    })(done);
  });
  
  it('should ignore empty strings', function(done){
    co(function*(){
      var read = cat(twice('foo'), '', 'bar', twice('baz'));
      equal('foo', yield read());
      equal('foo', yield read());
      equal('bar', yield read());
      equal('baz', yield read());
      equal('baz', yield read());
    })(done);
  });
});

function twice(str){
  var i = 0;
  return function*(end){
    if (end) return;
    if (++i <3) return str;
  }
}
