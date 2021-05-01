const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: false,
    name: {type: String},
    userName: {type: String},
    totalDistance: {type: Number, default:0},
    tripsCount: {type: Number, default:0},
    bio: {type: String},
    vehicles: [{type: mongoose.Schema.Types.Mixed, ref: 'Vehicle'}]
})

module.exports = mongoose.model('UserProfile', profileSchema);