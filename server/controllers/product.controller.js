const { createProductService } = require("../services/product.services");

const create = async (req, res, next) => {
  try {
    const newProduct = await createProductService(req, res);
    res.status(200).json(newProduct);
  } catch (err) {
    next(err);
  }
};
module.exports = { create };
