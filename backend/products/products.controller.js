const express = require('express');
const router = express.Router();
const productservice = require('./products.service');

router.get('/search/:query', search);

function search(req, res, next) {
    console.log(req.params.query)
    productservice.search(req.params.query)
        .then(items => res.json(items))
        .catch(next);
}

module.exports = router;
