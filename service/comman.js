// server.get("/", (req, res) => {
//     res.status(200).send("sucess");
//   });
const passport = require('passport');

  exports.isAuth=(req, res, done)=>{

    
    return passport.authenticate('jwt')

  }
  exports.sanitizeUser= (user)=>{
    return{ id:user.id,role:user.role}
  }

  exports.cookieExtractor = function(req){
    let token =null;
    if(req &&req.cookies){
      
      token = req.cookies['jwt']
    }
    // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTU1ZjhkMTU5ZGM3YWRkMjg4Y2ViNyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwOTUzMTc0NH0.YhBFL22bSFPiQZgOOaJJ232sQpN8yRQbLf54W2XCiuQ"
    return  token
  }
