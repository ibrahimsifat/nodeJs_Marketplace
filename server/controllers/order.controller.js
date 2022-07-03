const create = async (req, res) => {
  try {
    req.body.order.user = req.profile;
    let order = new Order(req.body.order);
    let result = await order.save();
    res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const listByShop = async (req, res) => {
  try {
    let orders = await Order.find({ "products.shop": req.shop._id })
      .populate({ path: "products.product", select: "_id name price" })
      .sort("-created")
      .exec();
    res.json(orders);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path("status").enumValues);
};
const update = async (req, res) => {
  try {
    let order = await Order.updateOne(
      { "products._id": req.body.cartItemId },
      {
        "products.$.status": req.body.status,
      }
    );
    res.json(order);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id)
      .populate("products.product", "name price")
      .populate("products.shop", "name")
      .exec();
    if (!order)
      return res.status("400").json({
        error: "Order not found",
      });
    req.order = order;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
module.exports = { create, listByShop, getStatusValues, update, orderByID };
