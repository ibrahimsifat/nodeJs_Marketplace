const Product = require("../models/product.model");
const { createProductService } = require("../services/product.services");
const cloudinary = require("../utilities/cloudinary");
const create = async (req, res, next) => {
  try {
    const newProduct = await createProductService(req, res);
    res.status(200).json(newProduct);
  } catch (err) {
    next(err);
  }
};

const listByShop = async (req, res, next) => {
  try {
    let products = await Product.find({ shop: req.shop._id })
      .populate("shop", "_id name")
      .select("-image");
    res.json(products);
  } catch (err) {
    next(err);
  }
};
const listLatest = async (req, res) => {
  try {
    let products = await Product.find({})
      .sort("-createdAt")
      .limit(5)
      .populate("shop", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id)
      .populate("shop", "_id name")
      .exec();
    if (!product)
      return res.status("400").json({
        error: "Product not found",
      });
    req.product = product;
    next();
  } catch (err) {
    next(err);
  }
};

const listRelated = async (req, res, next) => {
  try {
    let products = await Product.find({
      _id: { $ne: req.product },
      category: req.product.category,
    })
      .limit(5)
      .populate("shop", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    next(err);
  }
};
const read = (req, res) => {
  req.product.image = undefined;
  return res.json(req.product);
};
const listCategories = async (req, res) => {
  try {
    let products = await Product.distinct("category", {});
    res.json(products);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res, next) => {
  const query = {};
  if (req.query.search)
    query.name = { $regex: req.query.search, $options: "i" };
  if (req.query.category && req.query.category != "All")
    query.category = req.query.category;
  try {
    let products = await Product.find(query)
      .populate("shop", "_id name")
      .select("-image")
      .exec();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, description, image, quantity, price, category } = req.body;
    const product = req.product;
    await cloudinary.uploader.destroy(product.cloudinary_id);
    await cloudinary.uploader.destroy(product.image);
    const result = await cloudinary.uploader.upload(req.file.path);
    if (product) {
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.quantity = quantity ?? product.quantity;
      product.price = price ?? product.price;
      product.category = category ?? product.category;
      product.cloudinary_id = result.public_id ?? product.cloudinary_id;
      product.image = result.secure_url ?? product.image;
      await product.save();
      res.status(200).json({ product });
    } else {
      next("not found product");
    }
  } catch (err) {
    next(err);
  }
};
const remove = async (req, res, next) => {
  try {
    let product = req.product;
    // console.log(product);
    await cloudinary.uploader.destroy(product.cloudinary_id);
    product.remove();
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  listByShop,
  listLatest,
  productByID,
  listRelated,
  read,
  listCategories,
  list,
  update,
  remove,
};
