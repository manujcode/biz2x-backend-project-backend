const express = require('express')
const order = require('../controllers/Order.js')
const router = express.Router()
router

  .get("/user",order.fetchOrderByUser)
  .get("/",order.fetchAllOrders)
  .post("/",order.createOrder)
  .delete("/:id",order.deleteOrder )
  .patch("/:id",order.updateOrder)
  
  
exports.router =router;