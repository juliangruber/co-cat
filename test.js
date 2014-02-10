var cat = require('./');
var co = require('co');
var assert = require('assert');
var equal = assert.equal;

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
  it('should end', function(done){
    co(function*(){
      var ended = 0;
      
      function twice(str){
        var i = 0;
        return function*(end){
          if (end) {
            ended++;
            return;
          }
          if (++i <3) return str;
        }
      }
      
      var read = cat(twice('foo'), twice('bar'), twice('baz'));
      equal('foo', yield read());
      assert(!(yield read(true)));
      equal(ended, 3);
    })(done);
  });
  it('should catch errors', function(done){
    co(function*(){
      var ended = 0;
      
      function twice(str){
        var i = 0;
        return function*(end){
          if (end) {
            ended++;
            return;
          }
          throw new Error('oops');
        }
      }
      
      var read = cat(twice('foo'), twice('bar'), twice('baz'));
      var data;
      var err;
      
      try {
        data = yield read();
      } catch (_err) {
        err = _err;
      }
      
      assert(!data);
      assert(err);
      equal(ended, 3);
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
