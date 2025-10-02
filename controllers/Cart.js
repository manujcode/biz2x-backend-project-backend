const {Cart} = require("../model/Cart.js");

exports.addToCart = async (req, res) => {
    try {
      const {id}= req.user
        const cart = new Cart({...req.body,user:id});

       const response = await cart.save()
        // console.log(response);
   
        const result = await response.populate('product')
        
        res.status(200).json(result);
        
        // console.log(res)
      } catch (error) {
        res.status(501).json(error);
        
      }
};
exports.fetchCartByUserId = async (req, res) => {
  try {
    //   const product = new Brand(req.body);
     const {id} =req.user
    
       const cart = await Cart.find({user:id}).populate('user').populate('product')

      console.log(cart);
      res.status(200).json(cart);
      // console.log(res)
    } catch (error) {
      res.status(500).json(error);
      console.log(error)
    }
};
exports.deleteFromCart = async (req, res) => {
  try {
   
    const {id} = req.params
     const result = await Cart.findByIdAndDelete(id);
      console.log(result)
      
      res.status(200).json(result);
      
    } catch (error) {
      res.status(501).json(error);
      
    }
};
exports.updateCart=async(req,res)=>{
  const {id} = req.params
  try{
//   const product = new Product(req.body);
  const cart = await Cart.findByIdAndUpdate(id,req.body,{new:true}).populate('product')
 res.status(200).send(cart)   
  }
  catch(err){
    res.status(400).send(err)
  }
 
 
 }