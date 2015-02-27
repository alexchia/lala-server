exports.getRouter = function(express, redis, passport) {
  var router = express.Router();
  
  router.get('/test',  function(req, res) {
    res.json({abc:"ok"});
  });

  return router;
}