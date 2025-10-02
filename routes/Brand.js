const express = require('express')
const brands = require('../controllers/Brand.js')
const router = express.Router()
router

  .get("/",brands.fetchBrands)
  .post("/",brands.createBrand)

  
exports.router =router;