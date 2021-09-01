var mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    userId: { type: String },
    name: { type: String },
    brand: { type: String },
    model: { type: String },
    year: { type: Number },
    distanceCovered: { type: Number, default: 0 }
});

vehicleSchema.statics.updateVehicleDetail = function (userId, vehicleId, updatedDetails, cb) {
    this.findOneAndUpdate({ _id: vehicleId, userId: userId }, updatedDetails, { upsert: true }, function (err, updatedDoc) {
        if (err) return cb(err, null);
        return cb(null, updatedDoc);
    });
}

module.exports = mongoose.model('Vehicle', vehicleSchema);