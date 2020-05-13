const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var imageSchema = new Schema({
    originalName: String,
    modifiedName: String,
    type: String,
    size: Number,
    width: Number,
    height: Number,
    data: Buffer
}, {
    timestamps: true,
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;