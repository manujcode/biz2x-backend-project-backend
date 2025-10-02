const express = require('express')
const category = require('../controllers/Category.js')
const router = express.Router()
router

  .get("/",category.fetchCategory)
  .post("/",category.createCategory)

  
exports.router =router;