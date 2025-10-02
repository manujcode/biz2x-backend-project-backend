const express = require('express')
const auth = require('../controllers/Auth.js')
const passport = require('passport')
const router = express.Router()
router
      .post("/signUp",auth.createUser)
      .post("/login", passport.authenticate('local'), auth.loginUser)
      .get("/check",passport.authenticate('jwt'),auth.checkAuth)
exports.router =router; 
