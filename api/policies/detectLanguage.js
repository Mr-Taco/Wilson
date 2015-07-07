/**
 * Created by wildlife009 on 1/20/15.
 */
module.exports = function(req, res, next) {

  var lang = req.param('lang');

  if(lang !== undefined)
    req.setLocale(lang);
  else
    lang = req.getLocale();




  res.locals.locale = req.getLocale();
  next();
};
