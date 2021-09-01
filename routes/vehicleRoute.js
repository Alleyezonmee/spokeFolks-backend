const router = require('express').Router();
const Vehicle = require('../models/Vehicle');
const commonFunction = require('../helpers/utils');
const constants = require('../helpers/constants');
const authenticated = require('../helpers/JWT-Auth');

router.get('/', authenticated, async (req, res) => {
    const vehicles = await Vehicle.find({userId: req.userId});
    return commonFunction.baseResponse(200, true, vehicles, function(response) {
        res.json(response);
    });
});

// Function to fetch vehicles of a user
router.get('/:vehicleId?', authenticated, async (req, res) => {
    let vehicleId = req.params.vehicleId
    console.log(vehicleId)
    if (vehicleId) {
        const vehicle = await Vehicle.findOne({ userId: req.userId, _id: vehicleId });
        if (vehicle) return commonFunction.baseResponse(200, true, vehicle, function (response) {
            res.json(response);
        });

        return commonFunction.baseResponse(404, false, "Vehicle Not Found", function (response) {
            res.json(response);
        });
    } else {
        const vehicles = await Vehicle.find({ userId: req.userId });
        return commonFunction.baseResponse(200, true, vehicles, function (response) {
            res.json(response);
        });
    }
});

// Function to add new vehicle
router.post('/addVehicle', authenticated, (req, res) => {
    try {
        var newVehicle = new Vehicle({
            userId: req.userId,
            name: req.body.name,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            distanceCovered: req.body.distanceCovered
        });

        newVehicle.save(function (err, result) {
            if (err) return commonFunction.baseResponse(400, false, err, function (response) {
                res.json(response);
            });
            return commonFunction.baseResponse(200, true, result, function (response) {
                res.json(response);
            });
        });
    } catch (err) {
        commonFunction.baseResponse(500, false, err, function (response) {
            res.json(response);
        })
    }
});

// Function to update vehicle details 
router.put('/updateVehicle/:vehicleId', authenticated, (req, res) => {
    try {
        var updatedVehicle = new Vehicle({
            userId: req.userId,
            name: req.body.name,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            distanceCovered: req.body.distanceCovered
        });

        Vehicle.updateVehicleDetails(req.userId, req.params.vehicleId, updatedVehicle, function (err, updatedDoc) {
            if (err) throw (err);
            commonFunction.baseResponse(204, true, updatedDoc, function (response) {
                res.json(response);
            });
        });
    } catch (err) {
        commonFunction.baseResponse(500, false, 'Unable to update vehicle details', function (response) {
            res.json(response);
        });
    }
});

// Function to delete vehicle
router.delete('/deleteVehicle', (req, res) => {

});
module.exports = router