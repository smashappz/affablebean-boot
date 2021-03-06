const { body, validationResult } = require("express-validator");
const debug = require("debug")("customer");
const Cart = require("../session/shoppingCart");
const Customer = require("../models/customer");
const CustomerOrder = require("../models/customerOrder");
const OrderedProduct = require("../models/orderedProduct");
const Product = require("../models/product");

const ShoppingCart = Cart.ShoppingCart;
const surcharge = 3;

exports.purchaseOrder = [
  body("name")
    .escape()
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage("Name must be specified.")
    .matches(/^[\w\s]+$/i)
    .withMessage("Name has non-alphanumeric characters."),
  body("email")
    .escape()
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage("Email must be specified.")
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("phone")
    .escape()
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage("Phone must be specified."),
  body("address")
    .escape()
    .trim()
    .isLength({ min: 8, max: 256 })
    .withMessage("Address must be specified."),
  body("creditCard")
    .escape()
    .trim()
    .isLength({ min: 16, max: 19 })
    .withMessage("Cc number must be specified.")
    .isNumeric()
    .withMessage("CC number has non-numeric characters."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.errors,
        success: false
      });
      return;
    }

    if (!req.session.cart) {
      return next(err);
    }

    const { name, email, phone, address, creditCard } = req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      creditCard
    });

    customer.save(err => {
      if (err) {
        debug("customer save:" + err);
        return next(err);
      }

      const cart = new ShoppingCart();
      cart.load(req.session.cart);

      const customerOrder = new CustomerOrder({
        amount: (cart.subtotal + surcharge).toFixed(2),
        customer: customer._id
      });

      customerOrder.save(err => {
        if (err) {
          debug("customerOrder save:" + err);
          return next(err);
        }

        const orderedProducts = [];
        const products = [];

        cart.items.forEach(item => {
          Product.findById(item.product._id).exec((err, product) => {
            if (err) {
              debug("product find:" + err);
              return next(err);
            }

            products.push(product);

            const orderedProduct = new OrderedProduct({
              quantity: item.quantity,
              customerOrder,
              product: product._id
            });

            orderedProduct.save(err => {
              if (err) {
                debug("orderedProduct save:" + err);
                return next(err);
              }

              orderedProducts.push(orderedProduct);
            });
          });
        });

        cart.clear();
        req.session.cart = null;

        // console.log(products);
        // console.log(orderedProducts);

        res.json({
          success: true,
          order: {
            customer,
            orderedProducts,
            orderRecord: customerOrder,
            products
          }
        });
      });
    });
  }
];
