const stream = require('stream');
const { resourceLimits } = require('worker_threads');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.size = 0;
  }

  checkSize(chunk) {
    const left = this.limit - this.size;
    if(left >= chunk.length) {
      this.size += chunk.length;
      return true;
    } else {
      return false;
    }
  }

  _transform(chunk, encoding, callback) {
    try {
      if (this.checkSize(chunk)) {
        callback(null, chunk);
      } else {
        // callback(new LimitExceededError());
        throw new LimitExceededError();
      }
    } catch(err) {
      callback(err);
    }
    // try{
    //   console.log(chunk);
    //   callback(null, chunk);
    // } catch(err) {
    //   callback(err);
    // }


  }
}

module.exports = LimitSizeStream;
