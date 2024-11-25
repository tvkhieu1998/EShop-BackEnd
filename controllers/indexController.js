'use strict'

const controller = {};
const models = require('../models');

controller.showHomePage = async (req, res) => {
    const recentProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
    });
    res.locals.recentProducts = recentProducts;
    const featuredProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        order: [['stars', 'DESC']],
        limit: 10
    });
    res.locals.featuredProducts = featuredProducts;
    const categories = await models.Category.findAll();
    //[1, 2, 3, 4] => [[1], [3, 4], [2]]
    const secondArray = categories.splice(2, 2);
    const thirdArray = categories.splice(1, 1);
    res.locals.categoryArray = [
        categories,
        secondArray,
        thirdArray
    ];
    const Brand = models.Brand;
    const brands = await Brand.findAll();
    res.render('index', { brands });
}

controller.showPage = (req, res, next) => {
    const pages = ['cart.hbs', 'checkout.hbs', 'contact.hbs','login.hbs', 'my-account.hbs', 'product-detail.hbs', 'product-list.hbs', 'wishlist.hbs']
    if(pages.includes(req.params.page))
      return res.render(req.params.page);
    next();
}

module.exports = controller;