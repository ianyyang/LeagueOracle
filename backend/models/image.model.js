const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var imageSchema = new Schema({
    originalName: String,
    modifiedName: String,
    type: String,
    size: String,
    data: Buffer
}, {
    timestamps: true,
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;