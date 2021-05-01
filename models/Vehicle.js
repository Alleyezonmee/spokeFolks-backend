var mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    _id: true,
    name: {type: String},
    brand: {type: String},
    model: {type: String},
    year: {type: Number},
    distanceCovered: {type: Number, default:0}
})

module.exports = mongoose.model('Vehicle', vehicleSchema);