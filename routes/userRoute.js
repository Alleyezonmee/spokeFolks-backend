const router = require('express').Router();
const User = require('../models/User');
const Profile = require('../models/UserProfile');
const commonFunction = require('../helpers/utils');
const jwt = require('jsonwebtoken');
const constants = require('../helpers/constants');
const authenticated = require('../helpers/JWT-Auth');

router.get('/', authenticated, async (req, res) => {
    const user = await User.findOne({ _id: req.userId }, { password: 0 });
    if (!user) return commonFunction.baseResponse(404, false, 'User Not found', function (response) {
        res.json(response);
    });

    return commonFunction.baseResponse(200, true, JSON.parse(JSON.stringify(user)), function (response) {
        res.json(response);
    });
});

router.post('/register', async (req, res) => {
    // checking if user is already exist
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return commonFunction.baseResponse(400, false, 'Email already exists', function (response) {
        res.json(response);
    });

    try {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(function (err, result) {
            if (err) return commonFunction.baseResponse(400, false, err, function (response) {
                res.json(response);
            });
            return commonFunction.baseResponse(201, true, result, function (response) {
                const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET);
                res.header(constants.AUTH_TOKEN, token).json(response);
            });
        });
    } catch (err) {
        commonFunction.baseResponse(500, false, null, function (response) {
            res.json(response);
        })
    }
});

router.post('/login', (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password

        User.authenticate(email, password, function (err, user, match) {
            if (err) throw err;

            if (user) {
                if (match) {
                    commonFunction.baseResponse(200, true, 'Login Successful', function (response) {
                        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
                        res.header(constants.AUTH_TOKEN, token).json(response);
                    });
                } else {
                    commonFunction.baseResponse(400, false, 'Invalid Password', function (response) {
                        res.json(response);
                    });
                }
            } else {
                commonFunction.baseResponse(404, false, 'User not found', function (response) {
                    res.json(response);
                });
            }
        });
    } catch (err) {
        commonFunction.baseResponse(500, false, 'Unable to Login', function (response) {
            res.json(response);
        });
    }
});

router.post('/checkUserName', authenticated, async (req, res) => {
    const userNameExists = await User.findOne({ profile: { userName: req.body.userName } });
    if (userNameExists) return commonFunction.baseResponse(400, false, 'UserName already taken', function (response) {
        res.json(response);
    })
    return commonFunction.baseResponse(200, true, 'UserName available', function (response) {
        res.json(response);
    });
});

router.put('/updateProfile', authenticated, async (req, res) => {
    try {
        var profile = new Profile({
            name: req.body.name,
            userName: req.body.userName,
            bio: req.body.bio,
            vehicles: req.body.vehicles
        });

        User.updateProfile(req.userId, profile, function (err, updatedDoc) {
            if (err) throw (err);
            commonFunction.baseResponse(204, true, 'Updated successfully', function (response) {
                res.json(response);
            })
        });

    } catch (err) {
        commonFunction.baseResponse(500, false, 'Unable to update profile', function (response) {
            res.json(response);
        })
    }
});

module.exports = router;
