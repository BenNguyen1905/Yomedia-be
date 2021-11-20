const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        message: 'hello'
    });
});

const port = process.env.PORT || 3000;

//hardcoded products
let products = [
    {
        id: 1,
        sku: "abc1234567",
        name: "candies",
        price: 500
    },
    {
        id: 2,
        sku: "xyz1234567",
        name: "cookies",
        price: 700
    },
    {
        id: 3,
        sku: "qwe1234567",
        name: "chips",
        price: 900
    }
]

app.post('/api/product', (req, res) => {
    let lastIndexOfProductsArray = products.length;
    req.body.id = lastIndexOfProductsArray + 1;
    res.json({
        id: req.body.id
    });
    products = [...products, req.body];


})

app.get('/api/product', (req, res) => {
    res.send(products);
});

app.get('/api/product/:id', (req, res) => {
    let id = req.params.id
    let product = products.filter(product => product.id == id);
    res.send(product[0]);
});

app.put('/api/product/:id', (req, res) => {
    let data = req.body;
    let id = req.params.id;
    let index = products.findIndex(product => product.id == id);
    products[index] = data;
    res.send(products[index]);

})

app.delete('/api/product/:id', (req, res) => {
    let id = req.params.id;
    let index = products.findIndex(product => product.id == id);
    if (index > -1) {
        products.splice(index, 1);
    }
    res.send(products);
})

app.post('/api/login', (req, res) => {
    //hardcoded user
    const user = {
        id: 1,
        username: 'admin',
        password: '123456'
    }
    const data = req.body;
    if (data.username === user.username && data.password === user.password) {
        jwt.sign({ user }, 'SECRET_KEY', { expiresIn: '1h' }, (err, token) => {
            res.json({
                token
            });
        });
    } else {
        res.json('Wrong information');
    }

});

// //Verify Token
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// }

app.listen(port, () => console.log(`Server started on ${port}`));