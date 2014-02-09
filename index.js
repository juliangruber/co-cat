
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Concatenate `streams`.
 *
 * @param {Streams,..|Array} streams
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function cat(streams){
  if (arguments.length > 1) streams = slice.call(arguments);
  
  var idx = 0;
  
  return function*(end){
    if (end) return yield end();
    
    var stream;
    var data;
    
    while (!data && (stream = streams[idx])) {
      if ('string' == typeof stream || Buffer.isBuffer(stream)) {
        data = stream;
        idx++;
      } else {
        try {
          data = yield stream();
        } catch (err) {
          yield end();
          throw err;
        }
        if (!data) idx++;
      }
    }
    
    return data;
  };
  
  /**
   * End all pending streams.
   */
  
  function* end(){
    yield streams
    .slice(idx)
    .filter(function(stream){
      return 'function' == typeof stream;
    })
    .map(function(stream){
      return stream(true);
    });
  }
};
