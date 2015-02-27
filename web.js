// simple express app
var express = require('express')
  , http    = require('http')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  , view_routes = require('./routes/view_routes')
  , api_routes = require('./routes/api_routes')
  , auth_routes = require('./routes/auth_routes')
  , redis = require('./lib/redis')
  , RedisStore = require('connect-redis')(session)
  
var app = express();

app.set('port', process.env.PORT || 3456);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/bower_components'));


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'xhruao92oa978s',
  store: new RedisStore({
    client: redis
  }),
}));

// forward to https in heroku if SSL
if (process.env.HOSTNAME.indexOf('https://') == 0)
  if (process.env.PORT) {
    app.get('*',function(req,res,next){
      if(req.headers['x-forwarded-proto']!='https')
        res.redirect(['https://', req.get('Host'), req.url].join(''));
      else
        next()
    })
  }

app.use('/', view_routes.getRouter(express, redis));
app.use('/api', api_routes.getRouter(express, redis));
app.use('/auth', auth_routes.getRouter(express, redis));

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});