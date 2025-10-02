const express = require('express')
const product = require('../controllers/Product.js')
const router = express.Router()
router
      .get("/",product.fetchAllProductsFilter)
      .get("/:id",product.fetchAllProductById)
      .post("/", product.createProduct)
      .patch("/:id",product.updateProduct)
//   .get("/:id", product.getProductsId)
//   .get("/", product.getProducts)
//   .post("/:id", product.productUpdate)
//   .patch("/:id", product.productPatch)
//   .delete("/:id", product.productDelete)
exports.router =router;




