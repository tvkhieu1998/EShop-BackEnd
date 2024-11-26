'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');

//cau hinh public static folder
app.use(express.static(__dirname + '/public'));

//cau hinh su dung express-handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
}));

app.set('view engine', 'hbs');

//cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cau hinh su dung session
app.use(session({
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20*60*1000 // 20ph
    }
}));

//middleware khoi tao gio hang
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;
    next();
})
//routes
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));
app.use('/users', require('./routes/userRouter'));

app.use((req, res, next) => {
    res.status(404).render('error', {message: 'File Not Found!'});
})

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', {message: 'Internal Server Error!'});
})
//khoi dong web server
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
