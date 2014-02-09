
# co-cat

  Concatenate [co generator streams](https://github.com/juliangruber/co-stream).

  [![build status](https://secure.travis-ci.org/juliangruber/co-cat.png)](http://travis-ci.org/juliangruber/co-cat)

## Example

```js
var cat = require('co-cat');
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
```

  Outputs:

```bash
$ node --harmony example
foo
foo
bar
bar
baz
baz
```

## Installation

```bash
$ npm install co-cat
```

## API

### cat(stream, ..)
### cat(streams)

  Concatenate an array of streams of each arg stream and return a stream.

## License

  MIT