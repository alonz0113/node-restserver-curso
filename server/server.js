require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
console.log(__dirname, path.resolve(__dirname, '../public'));

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true, autoIndex: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});