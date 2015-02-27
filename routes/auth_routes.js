exports.getRouter = function(express, redis, passport) {
  var router = express.Router();
  
  router.get('/kakao/login', function(req, res) {
    res.redirect('https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=' + process.env.KAKAO_APIKEY + '&redirect_uri=' + process.env.HOSTNAME + '/auth/kakao/callback&state=abc');
  });

  router.get('/kakao/callback', function(req, res) {
    var code = req.query.code;
    res.json({code:code});
  });

  return router;
}