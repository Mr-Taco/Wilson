/**
 * Created by wildlife009 on 2/12/15.
 */
module.exports = function(req, res, next) {

    var url = req.url;
    var targets = ["/burn/1315", "/burn/1621", "/burn/unk"];
    var _i, _len;
    res.locals.noIndex = false;


    for (_i = 0, _len = targets.length; _i < _len; _i++) {
        if (url === targets[_i]) {
            res.locals.noIndex = true;
        }
    }


    next();
};
