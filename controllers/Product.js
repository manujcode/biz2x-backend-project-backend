const fs = require("fs");

const mongoose = require("mongoose");

const {Product} = require("../model/Product.js");

// const Product = model.Product;

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
       const response = await product.save();
      //   console.log(response);
        res.send(response);
        // console.log(res)
      } catch (error) {
        res.status(500).send(error);  
      }
};
exports.fetchAllProductsFilter = async (req, res) => {
    let query
   if(req.query.admin){
      query =  Product.find();
   }
   else{
      query =  Product.find({delete:{$ne:true}});
   } 
        
        let totalCount =  Product.find({delete:{$ne:true}});
     if( req.query.category){
        query=query.find({category:req.query.category})
        totalCount=totalCount.find({category:req.query.category})
     }
     if( req.query.brand){
        query=query.find({brand:req.query.brand})    
        totalCount=totalCount.find({brand:req.query.brand})
     }
     if( req.query._sort&&req.query._order){
        query=query.sort({[req.query._sort]:req.query._order})
        totalCount=totalCount.sort({[req.query._sort]:req.query._order})
     }
     if( req.query._page&&req.query._limit){
        const page =req.query._page
        const pageSize=req.query._limit
        query=query.skip(pageSize*(page-1)).limit(pageSize)
        totalCount=totalCount
     }
    
     try {
        // console.log(query)
       const docs = await query.exec();
       const total = await totalCount.count().exec();
      //  console.log({total})
        res.set('X-Total-Count',total)
        // console.log(response);
        res.status(200).json(docs);
        // console.log(res)
      } catch (error) {
        res.status(500).send(error);
      }
};
exports.fetchAllProductById=async(req,res)=>{
 const {id} = req.params
 console.log("hvjhvjhv")
 try{
const product = await Product.findById(id)
res.status(200).send(product)
console.log("hvjhvjhv")
 }
 catch(err){
   res.status(400).send(err)
 }


}
exports.updateProduct=async(req,res)=>{
   const {id} = req.params
   console.log("deleted product is XXX+>",id)
   try{
      const product = new Product(req.body);
   const response = await Product.findByIdAndUpdate(id,product,{new:true})
  res.status(200).send(response)
   }
   catch(err){
     res.status(400).send(err)
   }
  
  
  }