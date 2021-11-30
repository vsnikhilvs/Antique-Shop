const config = require('config.json');
const jwt = require('jsonwebtoken');
const db = require('_helpers/db');

module.exports = {
    search
};

async function search(params) {
    const items = db.Products.find({ name: { '$regex' : params, '$options' : 'i' } });
    return items;
}   