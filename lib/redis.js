if (process.env.REDISTOGO_URL) {
  // redis to go / heroku
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
  global.redis = redis;
  module.exports = redis;
} else {
  // local
  module.exports = require("redis").createClient();
  global.redis = module.exports;
}