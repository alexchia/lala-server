exports.getRouter = function(express, redis, passport) {
  var router = express.Router();
  
  router.get('/',  function(req, res) {
    res.render('index', {});
  });

  return router;
}