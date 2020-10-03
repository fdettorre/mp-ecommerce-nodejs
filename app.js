var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require("mercadopago");

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/detail', function(req, res) {
    res.render('detail', req.query);
});

const at = 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398';

app.get('/add-preferencia', function(req, res) {
    console.log('Request', req.query);
    res.status(200);

    //PRODUCTO
    const title = req.query.title || '';
    const img = req.query.img || '';
    const price = Number(req.query.price) || 0;
    const unit = Number(req.query.unit) || 1;
    const id = '1234';
    const description = 'Dispositivo movil de tienda e-commerce';
    const external_reference = 'fdettorre@gmail.com';
    //PAGADOR
    const name = "Lalo Landa";
    const email = "test_user_63274575@testuser.com";
    const area_code = "11";
    const number = 22223333;
    //Direccion
    const street_name = "Calle False";
    const street_number = 123;
    const zip_code = "1111";
    //BACK URLS
    const approved = 'http://localhost:3000/approved';
    const pending = 'http://localhost:3000/pending';
    const rejected = 'http://localhost:3000/rejected';
    //EXCLUIR PAGOS ('atm','amex')
    const preferencia = {
        items: [{
            id,
            title,
            description,
            picture_url: img,
            unit_price: price,
            quantity: unit,
        }],
        payment_methods: {
            excluded_payment_types: [{
                    id: "amex",
                },
                {
                    id: "atm",
                },
            ],
            intallments: 6
        },
        payer: {
            name,
            email,
            phone: {
                area_code,
                number
            },
            address: {
                zip_code,
                street_name,
                street_number
            }
        },
        external_reference,
        back_urls: {
            success: approved,
            pending,
            failure: rejected
        },
        auto_return: "approved",
    };

    mercadopago.configure({
        access_token: at,
        integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
    });

    mercadopago.preferences
        .create(preferencia)
        .then(function(response) {
            console.log(response);
            res.json({
                ok: response,
            });
        })
        .catch(function(error) {
            console.log(error);
        });
});


app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(3000);