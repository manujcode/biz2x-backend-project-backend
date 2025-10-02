
const {Category} = require("../model/Category.js");

exports.fetchCategory = async (req, res) => {
    try {
        // const product = new Product(req.body);
       const response = await Category.find({}).exec();
        // console.log(response);
        res.send(response);
        // console.log(res)
      } catch (error) {
        res.status(500).send(error);
      }
};

exports.createCategory = async (req, res) => {
  try {
      const category = new Category(req.body);
     const response = await category.save();
      // console.log(response);
      res.send(response);
      // console.log(res)
    } catch (error) {
      res.status(500).send(error);
    }
};