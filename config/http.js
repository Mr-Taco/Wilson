/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */
var MobileDetect = require('mobile-detect');
var iePattern = /(Trident)/gi;
var ffPattern = /(Firefox)/gi;
var safariPattern = /(AppleWebKit)/gi;
var chromePattern = /(Chrome)/gi;

var checkChrome = function (ua) {
  var uaGroups = ua.match(chromePattern);
  var chrome = "";

  if(uaGroups !== null) {
    chrome = "chrome ";
  }

  return chrome;
};

var checkSafari = function (ua) {
  var uaGroups = ua.match(safariPattern);
  var safari = "";

  if(uaGroups !== null) {
    safari = "safari "
  }


  return safari;
};

var checkFF = function (ua) {
  var uaGroups = ua.match(ffPattern);
  var FF = "";

  if(uaGroups !== null) {
    FF = "firefox "
  }


  return FF;
};

var checkIE = function(ua) {
  var uaGroups = ua.match(iePattern);
  var isIE = "";
  if(uaGroups !== null) {
    isIE = "ie ";
  }

  return isIE;

};


module.exports.http = {

  /****************************************************************************
   *                                                                           *
   * Express middleware to use for every Sails request. To add custom          *
   * middleware to the mix, add a function to the middleware config object and *
   * add its key to the "order" array. The $custom key is reserved for         *
   * backwards-compatibility with Sails v0.9.x apps that use the               *
   * `customMiddleware` config option.                                         *
   *                                                                           *
   ****************************************************************************/
  middleware: {

    initMobileDetect: function (req, res, next) {



      var md = new MobileDetect(req.headers['user-agent']);
      var ua = md.ua;



      var deviceInfo = "";

      if(md.is('ios'))
        deviceInfo += "ios ";
      if(md.is('androidos'))
        deviceInfo += "android ";
      if(md.tablet())
        deviceInfo += "tablet ";
      if(md.phone())
        deviceInfo += "phone ";

      deviceInfo += checkIE(ua);
      deviceInfo += checkFF(ua);
      deviceInfo += checkSafari(ua);
      if(checkChrome(ua) === "chrome " && deviceInfo.indexOf("safari") !== -1) {
        deviceInfo = deviceInfo.split("safari").join("chrome");
      }

      res.locals.deviceInfo = deviceInfo;
      next();
    },

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/
   /* www: function () {

    },*/
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'initMobileDetect',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ]

    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     ***************************************************************************/

    // bodyParser: require('skipper')

  }

  /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

  // cache: 31557600000
};
