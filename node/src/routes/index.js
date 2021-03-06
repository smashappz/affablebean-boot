const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const categoryController = require("../controllers/categoryController");
const contactController = require("../controllers/contactController");
const orderController = require("../controllers/orderController");
const subjectController = require("../controllers/subjectController");

router.post("/addToCart/:id", cartController.addToCart);

router.get("/clearCart", cartController.clearCart);

router.post("/updateCart/:id/qty/:qty", cartController.updateCart);

router.get("/categories", categoryController.categoriesList);

router.get("/category/:id", categoryController.categoryProducts);

router.post("/contact", contactController.contact);

router.post("/purchase", orderController.purchaseOrder);

router.get("/subjects", subjectController.subjectsList);

module.exports = router;
