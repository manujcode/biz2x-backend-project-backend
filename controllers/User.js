
const {User} = require("../model/User.js");
const { sanitizeUser } = require("../service/comman.js");

exports.fetchUserById = async (req, res) => {
    const {id} = req.user
    try {
       const user = await User.findById(id,"name email id addresses orders role").exec();
        
          res.send({id:user.id,addresses:user.addresses,email:user.email,orders:user.orders,role:user.role});
      } catch (error) {
        res.status(500).send(error);
      }
};

exports.updateUser = async (req, res) => {
    const {id}=req.params

    try {
       const response = await User.findByIdAndUpdate(id,req.body,{new:true});
      //   console.log(response);
        res.send(response);
        // console.log(res)
      } catch (error) {
        res.status(500).send(error);
      }
  };