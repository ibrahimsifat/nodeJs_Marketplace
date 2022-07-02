const Shop = require("../models/Shop.model");
const { createShopService } = require("../services/shop.services");
const cloudinary = require("../utilities/cloudinary");

const create = async (req, res, next) => {
  try {
    const newShop = await createShopService(req, res);
    res.status(201).json(newShop);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    let shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    next(err);
  }
};
const listByOwner = async (req, res) => {
  try {
    let shops = await Shop.find({ owner: req.profile.userId }).populate(
      "owner",
      "_id username"
    );
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const shopByID = async (req, res, next, id) => {
  try {
    let shop = await Shop.findById(id).populate("owner", "_id username").exec();
    if (!shop)
      return res.status("400").json({
        error: "Shop not found",
      });
    req.shop = shop;
    next();
  } catch (err) {
    next(err);
  }
};
const read = (req, res) => {
  req.shop.image = undefined;
  return res.json(req.shop);
};
const isOwner = (req, res, next) => {
  const isOwner =
    req.shop && req.profile && req.shop.owner._id == req.profile.userId;
  if (!isOwner) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

const update = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const shop = req.shop;
    await cloudinary.uploader.destroy(shop.cloudinary_id);
    await cloudinary.uploader.destroy(shop.image);
    const result = await cloudinary.uploader.upload(req.file.path);

    if (shop) {
      shop.name = name ?? shop.name;
      shop.description = description ?? shop.description;
      shop.cloudinary_id = result.public_id ?? shop.cloudinary_id;
      shop.image = result.secure_url ?? shop.image;
      await shop.save();
      res.status(200).json({ shop });
    } else {
      next("not found shop");
    }
  } catch (err) {
    next(err);
  }
};
const remove = async (req, res, next) => {
  try {
    let shop = req.shop;
    console.log(shop);
    await cloudinary.uploader.destroy(user.cloudinary_id);
    shop.remove();
    await shop.save();
    res.json(shop);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  list,
  listByOwner,
  shopByID,
  read,
  isOwner,
  remove,
  update,
};
