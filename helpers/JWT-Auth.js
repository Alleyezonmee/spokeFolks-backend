'use-strict';

const jwt = require('jsonwebtoken'),
commonFunction = require('./utils');
const constants = require('./constants')

const secret = process.env.TOKEN_SECRET;
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers[constants.AUTH_TOKEN];
    if(authHeader) {
        const token = authHeader
        jwt.verify(token, secret, (err, userId) => {
            if(err) {
                commonFunction.baseResponse(403, false, null, function(response) {
                    res.json(response);
                });
            } else {
                req.userId = userId
                next();
            }
        })
    } else {
        commonFunction.baseResponse(401, false, null, function(response) {
            res.json(response)
        });
    }
};

module.exports = authenticateJWT;