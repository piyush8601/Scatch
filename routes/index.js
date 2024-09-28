const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');


router.get('/', function(req, res) {
    let error = req.flash("error");
    res.render("index", {error});
});

router.get("/shop", isLoggedIn, async function(req, res) {
    let products = await productModel.find();
    res.render("shop", {products});
    // res.send("Hey its working");
});

module.exports = router;