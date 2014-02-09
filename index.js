
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
    if (end) return streams[idx](end);
    var data;
    while (!data && streams[idx]) {
      try {
        // read
        data = yield streams[idx]();
      } catch (err) {
        // clean up
        yield streams.slice(idx).map(function(stream){
          return stream(true);
        });
        throw err;
      }
      if (!data) idx++;
    }
    return data;
  };
};
