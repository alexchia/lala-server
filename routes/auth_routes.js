var request = require("request");
var async = require("async");

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

          var getProfileInfo = function(access_token) {
            return function(callback) {
              // get profile info
              request.get("https://kapi.kakao.com/v1/api/talk/profile", {headers:{
                "Authorization": "Bearer " + access_token
              }}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  //console.log(body);
                  var profilejson = JSON.parse(body);
                  callback(null, profilejson);
                } else {
                  console.log(error);
                  console.log(response.statusCode);
                  var errorjson = JSON.parse(body);
                  callback(errorjson);
                }
              });
            }
          };

          async.parallel({
            profile: getProfileInfo(access_token),
            //connections: getConnections(access_token)
          }, function(err, results) {
            if (err) {
              console.log(err);
              res.json({err:err});
            } else {
              /*var profilejson = results.profile;
              var connectionsjson = results.connections;
              var lead_data = {
                lead_id: entreportal_code,
                stage_data: {
                  profile: profilejson,
                  token: access_token,
                  connections: JSON.stringify(connectionsjson)
                }
              };
              LeadLib.updateLinkedIn(lead_data, function(err) {
                if (err) {
                  // TODO send a proper error in a window that closes
                  res.status(401).send(err);
                } else
                  res.render('connectedLinkedIn');
              });*/
              res.json(results);
            }
          })
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