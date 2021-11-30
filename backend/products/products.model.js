const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: String,
    code: String,
    name: String,
    description: String,
    image: String,
    price: Number,
    category: String,
    quantity: Number,
    inventoryStatus: String,
    rating: Number,
    inwishlist: String,
    incart: String
});

module.exports = mongoose.model('Products', schema);