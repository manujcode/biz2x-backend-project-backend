const express = require('express')
const user = require('../controllers/User.js')
const router = express.Router()
router
    //   .get("/",user.fetchUserById)
      .get("/own",user.fetchUserById)
    //   .post("/", user.createUser)
      .patch("/:id",user.updateUser)



exports.router =router;