const { Order } = require("../model/Orders");

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);

       const result = await order.save()
        
        res.status(200).json(result);
        
      } catch (error) {
        res.status(501).json(error);
        
      }
};
exports.fetchOrderByUser = async (req, res) => {
  try {
    //   const product = new Brand(req.body);
    //  const {user} =req.query
     const {id} = req.user

       const order = await Order.find({user:id})

      res.status(200).json(order);
      
    } catch (error) {
      res.status(500).json(error);
      console.log(error)
    }
};
exports.deleteOrder = async (req, res) => {
  try {
   
    const {id} = req.params
     const result = await Order.findByIdAndDelete(id);
      console.log(result)
      
      res.status(200).json(result);
      
    } catch (error) {
      res.status(501).json(error);
      
    }
}; 
exports.updateOrder=async(req,res)=>{
  const {id} = req.params
  try{
//   const product = new Product(req.body);
  const order = await Order.findByIdAndUpdate(id,req.body,{new:true})
 res.status(200).send(order)   
  }
  catch(err){
    res.status(400).send(err)
  }
 
 
 }
 exports.fetchAllOrders = async (req, res) => {
    
    let query =  Order.find();
    let totalCount =  Order.find();
    console.log(typeof req.query._sort);
 if(req.query._sort && req.query._order && req.query._sort!=="null" && req.query._order!=="null"){
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