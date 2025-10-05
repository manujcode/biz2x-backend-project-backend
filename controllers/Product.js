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
// exports.myTest = async (req, res) => {
//    res.send("hello from product");
// }
exports.fetchAllProductsFilter = async (req, res) => {
    let query

       query = await Product.find()
      //  query.map((product)=>{
      //     return {'title':product.title}
      //    })

         let n = await Product.find().count()
         let query1 = []
         for(let i=0;i<n;i++){
            if(query[i].brand)
            query1.push({'brand':query[i].brand})
         }

         console.log(query1)
   if(req.query.admin){
      query =  Product.find();
   }
   else{
      query =  Product.find({delete:{$ne:true}});
   } 
      //   console.log("========>>>>>",req.query,query)
        let totalCount =  Product.find({delete:{$ne:true}});
     if( req.query.category){
         let category = req.query.category.split(",")
         // for(let i=0;i<category.length;i++){
         //    category[i]=category[i].trim()

         // }
        query=query.find({category:category})
        totalCount=totalCount.find({category:req.query.category})
     }
     if( req.query.brand){
        let brand = req.query.brand.split(",")
      //   let qu 
      //   for(let i=0;i<brand.length;i++){
      //        brand[i]=brand[i].trim()
      //        qu+=
      //   }
        query=query.find({brand:brand})

        totalCount=totalCount.find({brand:brand})
     }
     if( req.query.title){
      let title = req.query.title.split(",")
    //   let qu 
    //   for(let i=0;i<brand.length;i++){
    //        brand[i]=brand[i].trim()
    //        qu+=
    //   }
      query=query.find({title:title})

      totalCount=totalCount.find({title:title})
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
   // console.log("deleted product is XXX+>",id)
   try{
      const product = {...req.body};
      // console.log("new product is XXX+>>>",product)
      delete product._id;
      const response = await Product.findByIdAndUpdate(id,product,{new:true})
      // console.log("new product is XXX+>>>>>>>",response)
  res.status(200).send(response)
   }
   catch(err){
      console.log("error in updating product",err)
     res.status(400).send(err)
   }
  
  
  }