const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// const router = require('express').Router();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
 
// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);


app.listen(3000);

module.exports = app;
