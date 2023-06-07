/**
 * Define Global Variables Here
 * global._ = require("lodash")
 */

global.paginationLimit = 10

global.checkForAuthorization = function (req, res, next) {
    console.log(req.headers["access-token"])
    if (req.headers && req.headers["access-token"]) {
        next()
    } else {
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}
