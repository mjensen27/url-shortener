var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    long: String,
    short: String
}, {timestamps: true});

var url = mongoose.model('url', urlSchema);

module.exports = url;