const { User } = require("../model/User.js");
const crypto = require("crypto");
const { sanitizeUser } = require("../service/comman.js");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000,
  sameSite: isProd ? 'None' : 'Lax',
  secure: isProd,
};
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({
          ...req.body,
          password: hashedPassword,
          salt: salt,
        });
        const response = await user.save();

        req.login(sanitizeUser(response), (error) => {
          if (error) {
            res.status(400).json(error);
          } else {
            const token = jwt.sign(sanitizeUser(response), SECRET_KEY);
            res
              .cookie("jwt", token, cookieOptions)
              .status(200)
              .json(token);
          }
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.loginUser = async (req, res) => {
  const user = req.user
  console.log(req.body,"XXXX",req.user)
  res
    .cookie("jwt", req.user.token, cookieOptions)
    .status(200)
    .json({ id: user.id, role: user.role });
};
exports.checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user);
  } 
  else{
    res.sendStatus(401)
  }


};

exports.logoutUser = async (req, res) => {  
  console.log("logout====>", req.cookies);
  res.clearCookie("jwt", {
    sameSite: isProd ? 'None' : 'Lax',
    secure: isProd,
  }).sendStatus(200);
}

  