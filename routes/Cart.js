const express = require('express')
const cart = require('../controllers/Cart.js')
const router = express.Router()
router

  .get("/",cart.fetchCartByUserId)
  .post("/",cart.addToCart)
  .delete("/:id",cart.deleteFromCart )
  .patch("/:id",cart.updateCart)
  
  
exports.router =router;