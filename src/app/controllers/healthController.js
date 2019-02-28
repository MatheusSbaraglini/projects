const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('API Activate');
});

module.exports = app => app.use('/health', router);