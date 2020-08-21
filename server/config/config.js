//=========================================
// Puerto
//=========================================


process.env.PORT = process.env.PORT || 3000;

//=========================================
//Entorno
//=========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================================================================
//Vencimiento del token, segun lo que esta abajo el token de login dura 30 dias
//=============================================================================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//==================================================================
//SEED (semilla) de autenticacion, palabra clave seguridad la que esta de rojo
//==================================================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=========================================
//Base de datos
//=========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

//===================================================================================================
//Google Client ID - esta es como una llave que genera google para usar los token de la api de google
//===================================================================================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '223793985240-p9v7lngs2b1h3jd2bioog72tbm01r9hi.apps.googleusercontent.com'