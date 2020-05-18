const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var teamsSchema = new Schema({
    imgName: String,
    userTeam: {},
    oppTeam: {}
}, {
    timestamps: true,
});

const Teams = mongoose.model('Teams', teamsSchema);

module.exports = Teams;