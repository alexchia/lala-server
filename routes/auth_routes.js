var request = require("request");

exports.getRouter = function(express, redis, passport) {
  var router = express.Router();
  
  router.get('/kakao/login', function(req, res) {
    res.redirect('https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=' + process.env.KAKAO_APIKEY + '&redirect_uri=' + process.env.HOSTNAME + '/auth/kakao/callback&state=abc');
  });

  router.get('/kakao/callback', function(req, res) {
    var code = req.query.code;
        // get token
    request.post("https://kauth.kakao.com/oauth/token", {form:{
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.HOSTNAME + "/auth/kakao/callback",
      client_id: process.env.KAKAO_APIKEY
    }}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var bodyjson = JSON.parse(body);
          var access_token = bodyjson.access_token;
          res.json({access_token: access_token});
        } else {
          console.log(error);
          console.log(response.statusCode);
          var bodyjson = JSON.parse(body);
          res.json(bodyjson);
        }
    });
  });

  return router;
}