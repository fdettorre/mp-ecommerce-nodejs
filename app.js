var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require("mercadopago");

var app = express();

var bodyParser = require('body-parser')

const port = process.env.PORT || 3000;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

    // DATOS DEL PRODUCTO
    const title = 'https://fdettorre-mp-commerce-nodejs.herokuapp.com/' + req.query.title || '';
    const img = 'https://fdettorre-mp-commerce-nodejs.herokuapp.com/' + req.query.img || '';
    const price = Number(req.query.price) || 0;
    const unit = Number(req.query.unit) || 1;
    const id = '1234';
    const description = 'Dispositivo móvil de tienda e-commerce';
    const external_reference = 'fdettorre@gmail.com';

    //DATOS DEL PAGADOR

    const name = "Lalo";
    const surname = "Landa";
    const email = "test_user_63274575@testuser.com";
    const area_code = "11";
    const number = 22223333;

    //DIRECCION DEL PAGADOR

    const street_name = "False";
    const street_number = 123;
    const zip_code = "1111";

    //RETORNOS - BACK URLS

    const approved = 'https://fdettorre-mp-commerce-nodejs.herokuapp.com/approved';
    const pending = 'https://fdettorre-mp-commerce-nodejs.herokuapp.com/pending';
    const rejected = 'https://fdettorre-mp-commerce-nodejs.herokuapp.com/rejected';


    //CREACION DE PREFERENCIA CON EXCLUSION DE TIPOS DE PAGO

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
            excluded_payment_methods: [{
                id: amex,
            }],
            excluded_payment_types: [{
                id: atm,
            }, ],
            installments: 6,
        },
        payer: {
            name,
            surname,
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
        notification_url: "https://fdettorre-mp-commerce-nodejs.herokuapp.com/notifications?source_news=webhooks"
    };

    mercadopago.configure({
        access_token: at,
        integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
    });


    mercadopago.preferences
        .create(preferencia)
        .then(function(response) {
            console.log(response);
            res.redirect(response.body.init_point);
        })
        .catch(function(error) {
            console.log(error);
        });
});

app.get('/approved', function(req, res) {
    res.render('approved', req.query);
});

app.get('/pending', function(req, res) {
    res.render('pending', req.query);
});

app.get('/rejected', function(req, res) {
    res.render('rejected', req.query);
});

app.post('/notifications', function(req, res) {
    try {
        console.log("Notificacion Pago", req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }

});


app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port);