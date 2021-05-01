'use strict';
var codes = require('./statusCodes')

module.exports = {
    baseResponse: function (codeRes, statusRes, resultRes, cb) {
        if(statusRes) {
            cb({
                code: codeRes,
                message: codes[codeRes],
                status: statusRes,
                result: resultRes
            });
        } else {
            cb({
                code: codeRes,
                message: codes[codeRes],
                status: statusRes,
                error: resultRes
            })
        }
    }
}