const User = require("../models/User.model");
const errorHandler = require("./error.controller");
const { createUserService } = require("../services/user.services");
const config = require("../config/config");
const stripe = require("stripe");
const myStripe = stripe(config.stripe_test_secret_key);

// Creating a new Stripe Customer
const stripeCustomer = (req, res, next) => {
  if (req.profile.stripe_customer) {
    //update stripe customer
    myStripe.customers.update(
      req.profile.stripe_customer,
      {
        source: req.body.token,
      },
      (err, customer) => {
        if (err) {
          return res.status(400).send({
            error: "Could not update charge details",
          });
        }
        req.body.order.payment_id = customer.id;
        next();
      }
    );
  } else {
    myStripe.customers
      .create({
        email: req.profile.email,
        source: req.body.token,
      })
      .then((customer) => {
        User.update(
          { _id: req.profile._id },
          { $set: { stripe_customer: customer.id } },
          (err, order) => {
            if (err) {
              return res.status(400).send({
                error: errorHandler.getErrorMessage(err),
              });
            }
            req.body.order.payment_id = customer.id;
            next();
          }
        );
      });
  }
};

const createCharge = (req, res, next) => {
  if (!req.profile.stripe_seller) {
    return res.status("400").json({
      error: "Please connect your Stripe account",
    });
  }
  myStripe.tokens
    .create(
      {
        customer: req.order.payment_id,
      },
      {
        stripeAccount: req.profile.stripe_seller.stripe_user_id,
      }
    )
    .then((token) => {
      myStripe.charges
        .create(
          {
            amount: req.body.amount * 100, //amount in cents
            currency: "usd",
            source: token.id,
          },
          {
            stripeAccount: req.profile.stripe_seller.stripe_user_id,
          }
        )
        .then((charge) => {
          next();
        });
    });
};

// CRUD
const create = async (req, res, next) => {
  try {
    const newUser = await createUserService(req, res);
    res.status(200).json({
      message: "Successfully signed up!",
      newUser,
    });
  } catch (err) {
    next(err);
  }
};
const list = async (req, res) => {
  try {
    let users = await User.find().select(
      "username email updated createdAt avatar"
    );
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.requestedUser = user;
    next();
  } catch (err) {
    next(err);
  }
};
const read = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    const filter = { _id: req.params.userId };
    const { username, email } = req.body;
    if (email.match(/.+\@.+\..+/))
      return res.status(400).json({ error: "need verify email" });
    const update = {
      username,
      email,
    };
    const option = { new: true };
    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};
const remove = async (req, res, next) => {
  try {
    let userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(203).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

const isSeller = (req, res, next) => {
  const isSeller = req.profile && req.profile.seller;
  if (!isSeller) {
    return res.status("403").json({
      error: "User is not a seller",
    });
  }
  next();
};
const stripe_auth = (req, res, next) => {
  request(
    {
      url: "https://connect.stripe.com/oauth/token",
      method: "POST",
      json: true,
      body: {
        client_secret: config.stripe_test_secret_key,
        code: req.body.stripe,
        grant_type: "authorization_code",
      },
    },
    (error, response, body) => {
      if (body.error) {
        return res.status("400").json({
          error: body.error_description,
        });
      }
      req.body.stripe_seller = body;
      next();
    }
  );
};
module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  isSeller,
  createCharge,
  stripeCustomer,
  stripe_auth,
};
