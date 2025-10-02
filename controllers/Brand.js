
const {Brand} = require("../model/Brand.js");

exports.fetchBrands = async (req, res) => {
    try {
        // const product = new Product(req.body);
       const response = await Brand.find({}).exec();
        // console.log(response);
        res.send(response);
        // console.log(res)
      } catch (error) {
        res.status(500).send(error);
      }
};
exports.createBrand = async (req, res) => {
  try {
      const brand = new Brand(req.body);
     const response = await brand.save();
      console.log(response);
      res.send(response);
      // console.log(res)
    } catch (error) {
      res.status(500).send(error);
    }
};