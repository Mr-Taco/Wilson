(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AppModel, Burn, ViewController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AppModel = require('./models/AppModel.coffee');

ViewController = require('./controllers/ViewController.coffee');

Burn = (function() {
  function Burn() {
    this.initViews = __bind(this.initViews, this);
    this.initModels();
  }

  Burn.prototype.initModels = function() {
    var url;
    url = $("html").data('data') || "/burn/data/en.json";
    this.model = AppModel.getInstance({
      url: url
    });
    this.model.once("change:ready", this.initViews);
    return this.model.fetch();
  };

  Burn.prototype.initViews = function() {
    this.viewController = new ViewController;
    return this.viewController.checkPaths();
  };

  return Burn;

})();

module.exports = Burn;



},{"./controllers/ViewController.coffee":2,"./models/AppModel.coffee":4}],2:[function(require,module,exports){
var AppModel, ConnectView, HeaderView, HomeView, PostsModel, RacketModel, RacketView, SpecsView, TeamBurnView, ViewController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

AppModel = require('../models/AppModel.coffee');

RacketView = require('../views/racket/RacketView.coffee');

TeamBurnView = require('../views/TeamBurnView.coffee');

HomeView = require('../views/HomeView.coffee');

SpecsView = require('../views/SpecsView.coffee');

HeaderView = require('../views/HeaderView.coffee');

ConnectView = require('../views/ConnectView.coffee');

PostsModel = require('../models/PostsModel.coffee');

RacketModel = require('../models/RacketModel.coffee');

ViewController = (function() {
  function ViewController() {
    this.checkPaths = __bind(this.checkPaths, this);
    this.model = AppModel.getInstance();
    this.isPhone = $("html").hasClass("phone");
    if (!this.isPhone) {
      this.racketView = new RacketView({
        el: "#specs",
        model: new RacketModel(this.model.get("view").racket3d)
      });
    }
    this.playersView = new TeamBurnView({
      el: "#team-burn"
    });
    this.specsView = new SpecsView({
      el: "#specs"
    });
    this.headerView = new HeaderView({
      el: "header",
      model: this.model
    });
    this.connectView = new ConnectView({
      el: "#connect",
      model: new PostsModel()
    });
    this.homeView = new HomeView({
      el: "#home"
    });
    this.connectView.loadPosts();
  }

  ViewController.prototype.checkPaths = function() {
    var finalPath, pathName, paths, secondToLast, table;
    console.log('checkPaths');
    pathName = window.location.pathname;
    paths = pathName.split("/");
    finalPath = paths[paths.length - 1];
    secondToLast = paths[paths.length - 2];
    if ((finalPath === "specs") || ((finalPath === "") && (secondToLast === "specs"))) {
      if (!this.isPhone) {
        table = $("#specs-table");
        this.specsView.toggleTable('show');
        return $('html,body').delay(1500).animate({
          scrollTop: (table.offset().top - 45) - (window.innerHeight * .5 - table.height() * .5)
        });
      } else {
        table = $("#mobile-specs-gallery");
        console.log('20');
        return $('html,body').animate({
          scrollTop: (table.offset().top - 20) - (window.innerHeight * .5 - table.height() * .5)
        });
      }
    }
  };

  return ViewController;

})();

module.exports = ViewController;



},{"../models/AppModel.coffee":4,"../models/PostsModel.coffee":5,"../models/RacketModel.coffee":6,"../views/ConnectView.coffee":11,"../views/HeaderView.coffee":12,"../views/HomeView.coffee":13,"../views/SpecsView.coffee":14,"../views/TeamBurnView.coffee":15,"../views/racket/RacketView.coffee":25}],3:[function(require,module,exports){
var Burn, Share;

THREE.ImageUtils.crossOrigin = '';

Share = require('./utils/share.coffee');

window.moment = require('moment');

TweenMax.defaultOverwrite = "preexisting";


/*$.validator.setDefaults
    ignore: []

$.validator.addMethod "csv", ((value, element, limit) ->

    commas = value.split(',')

    console.log commas.length , limit

    if commas.length is parseInt limit
        true
    else
        false


), "Please select all required options."
 */

Burn = require('./Burn.coffee');

$(document).ready(function() {
  Share.fbInit();
  return new Burn();
});



},{"./Burn.coffee":1,"./utils/share.coffee":9,"moment":47}],4:[function(require,module,exports){
var App, ModelBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ModelBase = require('./abstract/ModelBase.coffee');

App = (function(_super) {
  var allowInstantiation, instance;

  __extends(App, _super);

  allowInstantiation = false;

  instance = null;

  function App(opts) {
    this.ready = __bind(this.ready, this);
    if (!allowInstantiation) {
      throw 'App is a singleton. Use App.getInstance() instead.';
    } else {
      allowInstantiation = false;
      App.__super__.constructor.call(this, opts);
    }
  }

  App.getInstance = function(opts) {
    if (instance === null) {
      allowInstantiation = true;
      instance = new App(opts);
    }
    return instance;
  };

  App.prototype.initialize = function(opts) {
    App.__super__.initialize.call(this, opts);
    this.set('ready', false);
    this.once('change', this.ready);
    return this.fetch();
  };


  /*generateSessionModel: =>
      session = new SessionModel
          csrfService: @get('services').csrf
          loginService: @get('services').login
  
  
  
  
      session.once 'change:csrf' , @ready
      session.getCSRF()
  
      @set 'session' , session
   */

  App.prototype.ready = function() {
    return this.set('ready', true);
  };

  App.prototype.processData = function() {
    return App.__super__.processData.call(this);
  };

  return App;

})(ModelBase);

module.exports = App;



},{"./abstract/ModelBase.coffee":7}],5:[function(require,module,exports){
var AppModel, PostsModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AppModel = require('./AppModel.coffee');

PostsModel = (function(_super) {
  __extends(PostsModel, _super);

  function PostsModel() {
    return PostsModel.__super__.constructor.apply(this, arguments);
  }

  PostsModel.prototype.initialize = function(opts) {
    PostsModel.__super__.initialize.call(this, opts);
    this.to = null;
    return this.limit = 20;
  };

  PostsModel.prototype.setUrl = function(url) {
    this.url = url;
    this.url += "?limit=" + this.limit;
    if (this.to != null) {
      return this.url += "&to=" + this.to;
    }
  };

  PostsModel.prototype.loadMore = function() {
    console.log("load More", this.url);
    return $.ajax({
      url: this.url,
      method: "GET",
      contentType: "application/json",
      success: (function(_this) {
        return function(data) {
          var post, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            post = data[_i];
            _this.add(new Backbone.Model(post));
          }
          return _this.trigger("modelSetAdded");
        };
      })(this)
    });
  };

  PostsModel.prototype.onMoreLoaded = function() {};

  return PostsModel;

})(Backbone.Collection);

module.exports = PostsModel;



},{"./AppModel.coffee":4}],6:[function(require,module,exports){
var RacketModel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RacketModel = (function(_super) {
  __extends(RacketModel, _super);

  function RacketModel() {
    this.onPreloadComplete = __bind(this.onPreloadComplete, this);
    this.onPreloadProgress = __bind(this.onPreloadProgress, this);
    return RacketModel.__super__.constructor.apply(this, arguments);
  }

  RacketModel.prototype.initialize = function(opts) {
    RacketModel.__super__.initialize.call(this, opts);
    this.manifest = [];
    this.preloader = new createjs.LoadQueue(true, "", true);
    this.preloader.setMaxConnections(5);
    this.preloader.addEventListener("complete", this.onPreloadComplete);
    this.preloader.addEventListener("progress", this.onPreloadProgress);
    return this.parseAssets();
  };

  RacketModel.prototype.loadAssets = function() {
    return this.preloader.loadManifest(this.manifest);
  };

  RacketModel.prototype.parseAssets = function() {
    var g, k, obj, objects, _results;
    objects = this.get('objects');
    _results = [];
    for (k in objects) {
      g = objects[k];
      _results.push((function() {
        var _i, _len, _ref, _results1;
        _ref = g.obj;
        _results1 = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          this.pushToManifest(obj.id, obj.url);
          if (obj.map != null) {
            this.pushToManifest("map-" + obj.id, obj.map);
          }
          if (obj.specularMap != null) {
            this.pushToManifest("spec-" + obj.id, obj.specularMap);
          }
          if (obj.normalMap != null) {
            this.pushToManifest("normal-" + obj.id, obj.normalMap);
          }
          if (obj.bumpMap != null) {
            _results1.push(this.pushToManifest("bump-" + obj.id, obj.bumpMap));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  RacketModel.prototype.pushToManifest = function(id, url) {
    return this.manifest.push({
      id: id,
      src: url
    });
  };

  RacketModel.prototype.onPreloadProgress = function(e) {
    return this.trigger('assetsProgress', e.loaded);
  };

  RacketModel.prototype.onPreloadComplete = function(e) {
    return this.trigger('assetsReady', this);
  };

  return RacketModel;

})(Backbone.Model);

module.exports = RacketModel;



},{}],7:[function(require,module,exports){
var ModelBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ModelBase = (function(_super) {
  __extends(ModelBase, _super);

  function ModelBase() {
    this.searchGlobalAssets = __bind(this.searchGlobalAssets, this);
    this.loadAssets = __bind(this.loadAssets, this);
    this.onPreloadComplete = __bind(this.onPreloadComplete, this);
    this.onPreloadProgress = __bind(this.onPreloadProgress, this);
    this.processData = __bind(this.processData, this);
    this.dataLoaded = __bind(this.dataLoaded, this);
    this.initialize = __bind(this.initialize, this);
    return ModelBase.__super__.constructor.apply(this, arguments);
  }

  ModelBase.prototype.preloader = null;

  ModelBase.prototype.manifest = null;

  ModelBase.prototype.initialize = function(opts) {
    this.opts = opts;
    this.url = opts.url;
    this.manifest = [];
    ModelBase.__super__.initialize.call(this);
    return this.on("change", this.dataLoaded);
  };

  ModelBase.prototype.dataLoaded = function() {
    this.off("change", this.dataLoaded);
    this.preloader = new createjs.LoadQueue(false, this.get("baseUrl"), this.get("cors"));
    this.preloader.setMaxConnections(20);
    this.preloader.addEventListener("complete", this.onPreloadComplete);
    this.preloader.addEventListener("progress", this.onPreloadProgress);
    this.processData();
    return this.trigger("dataLoaded");
  };

  ModelBase.prototype.processData = function() {};

  ModelBase.prototype.onPreloadProgress = function(e) {
    return this.trigger('assetsProgress', e.loaded);
  };

  ModelBase.prototype.onPreloadComplete = function(e) {
    return this.trigger('assetsReady', this);
  };

  ModelBase.prototype.loadAssets = function() {
    if (this.manifest.length > 0) {
      return this.preloader.loadManifest(this.manifest);
    } else {
      return this.onPreloadComplete();
    }
  };

  ModelBase.prototype.searchGlobalAssets = function(obj) {
    var asset, item, _results;
    _results = [];
    for (item in obj) {
      if (item === "assets") {
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (asset in obj[item]) {
            if (/^http(s?)/.test(obj[item][asset] === false)) {
              obj[item][asset] = this.get("baseUrl") + obj[item][asset];
            }
            _results1.push(this.manifest.push(obj[item][asset]));
          }
          return _results1;
        }).call(this));
      } else if (typeof obj[item] === "object" && item.indexOf("_") !== 0) {
        _results.push(this.searchGlobalAssets(obj[item]));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return ModelBase;

})(Backbone.Model);

module.exports = ModelBase;



},{}],8:[function(require,module,exports){
module.exports.getMaxWidth = function() {
  var maxWidth;
  maxWidth = 768;
  if (window.innerWidth >= 768 && window.innerWidth <= 1400) {
    maxWidth = window.innerWidth;
  }
  if (window.innerWidth > 1400) {
    maxWidth = 1400;
  }
  return maxWidth;
};

module.exports.degToRad = function(deg) {
  return (deg * Math.PI) / 180;
};

module.exports.radToDeg = function(rad) {
  return (Math.PI / 180) * rad;
};

module.exports.makeCubeMap = function(envUrls) {
  var cubeMap;
  cubeMap = THREE.ImageUtils.loadTextureCube(envUrls);
  cubeMap.format = THREE.RGBFormat;
  return cubeMap;
};

module.exports.matrixToArray = function(matrixStr) {
  return matrixStr.match(/(-?[0-9\.]+)/g);
};

module.exports.distance = function(x1, y1, x2, y2) {
  var d, v1, v2;
  v1 = new THREE.Vector2(x1, y1);
  v2 = new THREE.Vector2(x2, y2);
  d = v1.distanceTo(v2);
  return d;
};

module.exports.svgns = "http://www.w3.org/2000/svg";



},{}],9:[function(require,module,exports){
module.exports.fbInit = function() {
  return FB.init({
    appId: '1518453638414402',
    xfbml: true,
    cookie: true,
    status: true,
    version: "v2.2"
  });
};

module.exports.fbShare = function(title, caption, image, link, description) {
  return FB.ui({
    method: "feed",
    link: link,
    picture: image,
    caption: caption,
    name: title,
    description: description
  });
};



},{}],10:[function(require,module,exports){
var accounts, gaTrack;

accounts = ["Wilson", "Tennis", "Agency"];

gaTrack = module.exports.gaTrack = function(type, tag) {
  var account, _i, _len, _results;
  if (typeof ga !== "undefined" && ga !== null) {
    console.log("[Tracking GA]", "[ send", 'event', type, 'click', tag, "]");
    _results = [];
    for (_i = 0, _len = accounts.length; _i < _len; _i++) {
      account = accounts[_i];
      _results.push(ga("" + account + ".send", 'event', type, 'click', tag));
    }
    return _results;
  } else {
    return console.log("Tracking GA]", "[ ga variable doesn't exist ]");
  }
};

module.exports.gaTrackElement = function($el) {
  var tag, type;
  tag = $el.data("ga-tag");
  type = $el.data("ga-type");
  if ((type != null) && (tag != null)) {
    return gaTrack(type, tag);
  } else {
    return console.log("Tracking GA]", "[ data-ga-tag and data-ga-type attributes not set on element", $el, "]");
  }
};



},{}],11:[function(require,module,exports){
var AppModel, ConnectView, PostViews, Tracking, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./abstract/ViewBase.coffee');

AppModel = require('../models/AppModel.coffee');

Tracking = require('../utils/track.coffee');

PostViews = [];

PostViews['facebook'] = require('./connect/FacebookPostView.coffee');

PostViews['instagram'] = require('./connect/InstagramPostView.coffee');

PostViews['twitter'] = require('./connect/TwitterPostView.coffee');

ConnectView = (function(_super) {
  __extends(ConnectView, _super);

  function ConnectView(opts) {
    this.onLayoutComplete = __bind(this.onLayoutComplete, this);
    this.renderPost = __bind(this.renderPost, this);
    this.modelSetAdded = __bind(this.modelSetAdded, this);
    this.loadPosts = __bind(this.loadPosts, this);
    this.onScroll = __bind(this.onScroll, this);
    this.resetEvents = __bind(this.resetEvents, this);
    this.appModel = AppModel.getInstance();
    this.posts = [];
    this.page = 1;
    this.limit = 20;
    ConnectView.__super__.constructor.call(this, opts);
  }

  ConnectView.prototype.initialize = function(opts) {
    ConnectView.__super__.initialize.call(this);
    this.container = this.$el.find("#connect-masonry");
    this.container.packery({
      itemSelector: '.item',
      columnWidth: '.shuffle_sizer',
      gutter: parseInt($('.shuffle_sizer').css('margin-left')),
      isInitLayout: true
    });
    this.container.packery('on', 'layoutComplete', this.onLayoutComplete);
    this.model.on('add', this.renderPost);
    this.model.on('modelSetAdded', this.modelSetAdded);
    return this.resetEvents();
  };

  ConnectView.prototype.resetEvents = function() {
    $(window).on('scroll', this.onScroll);
    this.undelegateEvents();
    this.delegateEvents(this.generateEvents());
    if (this.isPhone) {
      return this.resizeImages();
    }
  };

  ConnectView.prototype.generateEvents = function() {
    var events;
    events = {};
    events['click #social a'] = "onSocialClick";
    if (($('html').hasClass('tablet')) || ($('html').hasClass('phone'))) {
      events['click .item .square-post'] = "simulateHover";
      events['click .item .hover-overlay'] = "goToPost";
    }
    return events;
  };

  ConnectView.prototype.simulateHover = function(e) {
    e.preventDefault();
    $('.item').removeClass('touch-hover');
    return $(e.target).parents('.item').addClass('touch-hover');
  };

  ConnectView.prototype.goToPost = function(e) {
    if (!($(e.target).parents('.item').hasClass('touch-hover'))) {
      return e.preventDefault();
    } else {
      return window.open($(e.target).parents('a').attr('href'), "_blank");
    }
  };

  ConnectView.prototype.onSocialClick = function(e) {
    var $target;
    $target = $(e.target).closest("a");
    return Tracking.gaTrackElement($target);
  };

  ConnectView.prototype.onScroll = function(e) {
    var scrollMax, scrollPosition;
    scrollPosition = Math.ceil($(window).scrollTop());
    scrollMax = Math.floor($(document).height() - $(window).height());
    if (scrollPosition === scrollMax) {
      $(window).off('scroll', this.onScroll);
      return this.loadPosts();
    }
  };

  ConnectView.prototype.loadPosts = function() {
    this.postSet = [];
    this.model.to = this.getLastItemDate();
    this.model.setUrl(this.appModel.get('services').list);
    return this.model.loadMore();
  };

  ConnectView.prototype.getLastItemDate = function() {
    var lastItem;
    lastItem = this.container.find('.item').last();
    if (lastItem.length > 0) {
      return lastItem.data('date');
    } else {
      return null;
    }
  };

  ConnectView.prototype.modelSetAdded = function() {
    var $items;
    return $items = $(this.postSet);
  };

  ConnectView.prototype.renderPost = function(post) {
    var ignore, instanceData, postView;
    ignore = false;
    if (post.get('post_type') === 'facebook') {
      if (post.get('type') === 'status') {
        ignore = true;
      }
    }
    if (!ignore) {
      instanceData = {
        el: this.container,
        model: post
      };
      postView = new PostViews[post.get('post_type')](instanceData);
      postView.render();
      this.container.append(postView.$el);
      this.container.packery('appended', postView.$el);
      this.container.packery('fit', postView.$el);
      this.undelegateEvents();
      return this.delegateEvents(this.generateEvents());
    }
  };

  ConnectView.prototype.onLayoutComplete = function(packery, items) {
    var captionSize, item, _i, _len, _results;
    if (!this.isPhone) {
      captionSize = 100;
    } else {
      captionSize = 50;
    }
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _results.push(setTimeout(function() {
        $(item.element).find(".post-body").succinct({
          size: 100
        });
        $(item.element).find(".post-body").css('display', 'inline');
        return $(item.element).find('.square-post.small .caption').succinct({
          size: captionSize
        });
      }, 400));
    }
    return _results;
  };

  ConnectView.prototype.resizeImages = function(e) {
    var img, _i, _len, _ref, _results;
    _ref = $('.square-post.large');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      img = _ref[_i];
      _results.push($(img).css({
        width: window.innerWidth
      }));
    }
    return _results;
  };

  return ConnectView;

})(ViewBase);

module.exports = ConnectView;



},{"../models/AppModel.coffee":4,"../utils/track.coffee":10,"./abstract/ViewBase.coffee":18,"./connect/FacebookPostView.coffee":19,"./connect/InstagramPostView.coffee":20,"./connect/TwitterPostView.coffee":21}],12:[function(require,module,exports){
var AppModel, HeaderView, Share, Tracking, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./abstract/ViewBase.coffee');

AppModel = require('../models/AppModel.coffee');

Share = require('../utils/share.coffee');

Tracking = require('../utils/track.coffee');

HeaderView = (function(_super) {
  __extends(HeaderView, _super);

  function HeaderView() {
    this.classicFix = __bind(this.classicFix, this);
    this.onScroll = __bind(this.onScroll, this);
    this.scrollTo = __bind(this.scrollTo, this);
    this.shareFacebook = __bind(this.shareFacebook, this);
    this.handleHeaderSharing = __bind(this.handleHeaderSharing, this);
    this.hideHeaderSharing = __bind(this.hideHeaderSharing, this);
    this.showHeaderSharing = __bind(this.showHeaderSharing, this);
    this.hideHeaderLocalization = __bind(this.hideHeaderLocalization, this);
    this.toggleHeaderLocalization = __bind(this.toggleHeaderLocalization, this);
    this.changeLangauge = __bind(this.changeLangauge, this);
    this.logoLinkout = __bind(this.logoLinkout, this);
    this.trackPreorder = __bind(this.trackPreorder, this);
    return HeaderView.__super__.constructor.apply(this, arguments);
  }

  HeaderView.prototype.initialize = function(opts) {
    HeaderView.__super__.initialize.call(this, opts);
    this.sections = $('section.section');
    $(window).scroll(this.onScroll);
    this.delegateEvents(this.generateEvents());
    return this.populateTwitterShare();
  };

  HeaderView.prototype.generateEvents = function() {
    var events;
    $('body').on('click', this.hideHeaderLocalization);
    events = {};
    events['mouseenter #nav li img.share-icon'] = "showHeaderSharing";
    events['mouseleave #nav-wrapper'] = "hideHeaderSharing";
    events['click #header-share-fb'] = "shareFacebook";
    events['click #nav li a.link'] = "scrollTo";
    events['click #nav-select'] = "toggleHeaderLocalization";
    events['click p.country'] = "changeLangauge";
    events['click img.flag'] = "changeLangauge";
    events['click img#header-logo'] = "logoLinkout";
    events['click a#nav-preorder'] = "trackPreorder";
    events['click a#mobile-nav-preorder'] = "trackPreorder";
    if (Modernizr.touch) {
      events['touchend img#mobile-nav-icon'] = "showMobileNav";
      events['touchend img#mobile-nav-close'] = "hideMobileNav";
      events['touchend #nav li img.share-icon'] = "handleHeaderSharing";
      events['touchend #header-share-fb'] = "shareFacebook";
      events['touchend #nav li a.link'] = "scrollTo";
      events['touchend #mobile-nav li a'] = "scrollTo";
      events['touchend img#scroll-to-learn'] = "scrollTo";
    }
    return events;
  };

  HeaderView.prototype.trackPreorder = function(e) {
    var id;
    id = $(e.target).attr('id');
    return Tracking.gaTrackElement($('#' + id));
  };

  HeaderView.prototype.logoLinkout = function(e) {};

  HeaderView.prototype.changeLangauge = function(e) {
    var goTo;
    goTo = $(e.target).parent().find("p.country").data('country');
    return window.location.replace('/burn/' + goTo);
  };

  HeaderView.prototype.toggleHeaderLocalization = function(e) {
    var arrow, locWrapper;
    e.preventDefault();
    e.stopPropagation();
    locWrapper = $(".localization-wrapper");
    arrow = $("#nav-select i.fa-angle-up");
    if (locWrapper.hasClass('open')) {
      TweenMax.to($(locWrapper), .5, {
        alpha: 0,
        display: 'none'
      });
      TweenMax.to($(arrow), .35, {
        rotation: 0
      });
      return locWrapper.removeClass('open');
    } else {
      TweenMax.to($(arrow), .35, {
        rotation: 180
      });
      TweenMax.to($(locWrapper), .5, {
        alpha: 1,
        display: 'block'
      });
      return locWrapper.addClass('open');
    }
  };

  HeaderView.prototype.hideHeaderLocalization = function(e) {
    var arrow, locWrapper;
    locWrapper = $(".localization-wrapper");
    arrow = $("#nav-select i.fa-angle-up");
    TweenMax.to($(locWrapper), .5, {
      alpha: 0,
      display: 'none'
    });
    TweenMax.to($(arrow), .35, {
      rotation: 0
    });
    return locWrapper.removeClass('open');
  };

  HeaderView.prototype.showMobileNav = function(e) {
    e.preventDefault();
    TweenMax.set($('#mobile-nav-close'), {
      transformOrigin: "center bottom"
    });
    return TweenMax.to($('#mobile-nav-wrapper'), .65, {
      y: 898,
      zIndex: 55,
      onComplete: (function(_this) {
        return function() {
          return TweenMax.to($('#mobile-nav-close'), .1, {
            rotationX: 0,
            ease: Linear.easeNone
          });
        };
      })(this)
    });
  };

  HeaderView.prototype.hideMobileNav = function(e) {
    if (e.preventDefault != null) {
      e.preventDefault();
    }
    return TweenMax.to($('#mobile-nav-close'), .1, {
      rotationX: 90,
      ease: Linear.easeNone,
      onComplete: (function(_this) {
        return function() {
          return TweenMax.to($('#mobile-nav-wrapper'), .65, {
            delay: .45,
            y: 0
          });
        };
      })(this)
    });
  };

  HeaderView.prototype.showHeaderSharing = function(e) {
    $('#nav-wrapper').addClass('show-share-icons');
    return $('i.fa-facebook, i.fa-twitter').addClass('visible');
  };

  HeaderView.prototype.hideHeaderSharing = function(e) {
    $('#nav-wrapper').removeClass('show-share-icons');
    return $('i.fa-facebook, i.fa-twitter').removeClass('visible');
  };

  HeaderView.prototype.handleHeaderSharing = function(e) {
    var navWrapper;
    navWrapper = $("#nav-wrapper");
    if (navWrapper.hasClass('show-share-icons')) {
      return this.hideHeaderSharing();
    } else {
      return this.showHeaderSharing();
    }
  };

  HeaderView.prototype.shareFacebook = function(e) {
    var caption, description, fbCopy, image, link, title;
    e.preventDefault();
    fbCopy = this.model.get('social').facebook;
    caption = fbCopy.caption;
    title = fbCopy.title;
    image = window.location.origin + fbCopy.image;
    link = window.location.origin;
    description = fbCopy.description;
    return Share.fbShare(title, caption, image, link, description);
  };

  HeaderView.prototype.populateTwitterShare = function() {
    var href, twitterCopy, twitterShareMessage;
    href = $("#twitter").attr('href');
    twitterCopy = this.model.get('social').twitter;
    twitterShareMessage = twitterCopy.message;
    href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(twitterShareMessage);
    return $("#twitter-share").attr('href', href);
  };

  HeaderView.prototype.scrollTo = function(e, jump) {
    var $t, duration, goToSection, section, y;
    if (e.preventDefault != null) {
      e.preventDefault();
    }
    if (e.stopPropagation != null) {
      e.stopPropagation();
    }
    $t = $(e.target);
    section = $t.data('scrollto');
    goToSection = $('#' + section);
    y = goToSection.offset().top - 60;
    duration = jump ? 1 : 1000;
    $('html, body').animate({
      scrollTop: y + 'px'
    }, duration);
    return this.hideMobileNav(e);
  };

  HeaderView.prototype.onScroll = function(e) {
    var $height, $offset, $s, scrollTop, section, _i, _len, _ref, _results;
    scrollTop = $(window).scrollTop() + 60;
    _ref = this.sections;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      section = _ref[_i];
      $height = $(section).height();
      $offset = $(section).offset().top - (window.innerHeight / 2);
      if (($offset <= scrollTop && scrollTop <= ($offset + $height))) {
        $s = $(section).attr('id');
        $('#nav li a').removeClass('active');
        _results.push($('a.link#nav-' + $s).addClass('active'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  HeaderView.prototype.classicFix = function(e) {
    console.log('test');
    return console.log('    ');
  };

  return HeaderView;

})(ViewBase);

module.exports = HeaderView;



},{"../models/AppModel.coffee":4,"../utils/share.coffee":9,"../utils/track.coffee":10,"./abstract/ViewBase.coffee":18}],13:[function(require,module,exports){
var AppModel, HomeView, Tracking, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./abstract/ViewBase.coffee');

AppModel = require('../models/AppModel.coffee');

Tracking = require('../utils/track.coffee');

HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView(opts) {
    this.clickButton = __bind(this.clickButton, this);
    this.hideHover = __bind(this.hideHover, this);
    this.showHover = __bind(this.showHover, this);
    this.onVideoPlay = __bind(this.onVideoPlay, this);
    this.onVideoPause = __bind(this.onVideoPause, this);
    this.showFallback = __bind(this.showFallback, this);
    this.playVideo = __bind(this.playVideo, this);
    this.notifyMe = __bind(this.notifyMe, this);
    this.scrollTo = __bind(this.scrollTo, this);
    this.appModel = AppModel.getInstance();
    HomeView.__super__.constructor.call(this, opts);
  }

  HomeView.prototype.initialize = function(opts) {
    HomeView.__super__.initialize.call(this);
    this.delegateEvents(this.generateEvents());
    this.initVideo();
    return this.pulsing;
  };

  HomeView.prototype.generateEvents = function() {
    var events;
    events = {};
    events['click img#scroll-to-learn'] = "scrollTo";
    if (!this.isPhone) {
      events['click #play-btn-hover'] = "playVideo";
    } else {
      events['click img#play-btn-hover'] = "showFallback";
    }
    events['click a.pre-order'] = "notifyMe";
    events['click .overlay-container button'] = 'clickButton';
    return events;
  };

  HomeView.prototype.scrollTo = function(e) {
    var $t, goToSection, section;
    e.preventDefault();
    $t = $(e.target);
    section = $t.data('scrollto');
    goToSection = $('#' + section);
    return TweenMax.to(window, 1, {
      scrollTo: {
        y: goToSection.offset().top - 60
      }
    });
  };

  HomeView.prototype.notifyMe = function(e) {
    var id;
    id = $(e.target).attr('id');
    return Tracking.gaTrackElement($('#' + id));
  };

  HomeView.prototype.initVideo = function() {
    this.video = new MediaElementPlayer("#hero-video", {
      videoWidth: "100%",
      videoHeight: "100%",
      alwaysShowvntrols: false,
      pluginPath: '/burn/swf/',
      features: ['playpause', 'current', 'progress', 'duration', 'volume'],
      success: (function(_this) {
        return function(me, el) {
          el.setAttribute('poster', '');
          me.addEventListener('pause', _this.onVideoPause);
          return me.addEventListener('play', _this.onVideoPlay);
        };
      })(this)
    });
    return this.video.pause();
  };

  HomeView.prototype.playVideo = function() {
    if (this.isPhone || this.isTablet) {
      return this.showFallback();
    }
    return this.video.play();
  };

  HomeView.prototype.showFallback = function() {
    TweenMax.to($('#hero-overlay'), .35, {
      alpha: 0,
      display: 'none'
    });
    TweenMax.to($('#mep_0'), .35, {
      alpha: 0,
      display: 'none'
    });
    return TweenMax.to($('#marquee-fallback'), .5, {
      alpha: 1,
      zIndex: 10
    });
  };

  HomeView.prototype.onVideoPause = function() {
    $('#hero-overlay').css({
      background: 'none'
    });
    $('.overlay-container, p#watch-video').css({
      display: 'none'
    });
    $('.mejs-controls-container').css({
      zIndex: 1000000
    });
    TweenMax.set($('#play-btn'), {
      opacity: 1
    });
    TweenMax.set($('#play-btn-hover'), {
      opacity: 0
    });
    TweenMax.to(this.$el.find("#hero-overlay"), 1, {
      autoAlpha: 1
    });
    this.pulsing = new TimelineMax({
      align: "start",
      stagger: 1,
      paused: true,
      repeat: -1,
      repeatDelay: .35,
      yoyo: true
    });
    this.pulsing.add(TweenMax.to($('#play-btn'), 0.85, {
      alpha: 0,
      ease: Quad.easeIn
    }), "normal", 0.1);
    this.pulsing.add(TweenMax.to($('#play-btn-hover'), 0.85, {
      alpha: 1,
      ease: Quad.easeIn
    }), "normal", 0.1);
    return this.pulsing.resume();
  };

  HomeView.prototype.onVideoPlay = function() {
    Tracking.gaTrackElement($('#play-btn-hover'));
    TweenMax.to(this.$el.find("#hero-overlay"), .5, {
      autoAlpha: 0
    });
    if (this.pulsing !== void 0) {
      return this.pulsing.kill();
    }
  };

  HomeView.prototype.showHover = function() {
    TweenMax.to($('#play-btn'), .35, {
      alpha: 0,
      zIndex: -5
    });
    return TweenMax.to($('#play-btn-hover'), .35, {
      alpha: 1,
      zIndex: 5
    });
  };

  HomeView.prototype.hideHover = function() {
    TweenMax.to($('#play-btn-hover'), .35, {
      alpha: 0,
      zIndex: -5,
      delay: .25
    });
    return TweenMax.to($('#play-btn'), .35, {
      alpha: 1,
      zIndex: 5,
      delay: .25
    });
  };

  HomeView.prototype.clickButton = function(e) {
    return e.stopPropagation();
  };

  return HomeView;

})(ViewBase);

module.exports = HomeView;



},{"../models/AppModel.coffee":4,"../utils/track.coffee":10,"./abstract/ViewBase.coffee":18}],14:[function(require,module,exports){
var AppModel, SpecsView, Tracking, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./abstract/ViewBase.coffee');

AppModel = require('../models/AppModel.coffee');

Tracking = require('../utils/track.coffee');

SpecsView = (function(_super) {
  __extends(SpecsView, _super);

  function SpecsView(opts) {
    this.checkForRacket = __bind(this.checkForRacket, this);
    this.initiateSwiperGalleries = __bind(this.initiateSwiperGalleries, this);
    this.animateTable = __bind(this.animateTable, this);
    this.toggleTable = __bind(this.toggleTable, this);
    this.trackPreorders = __bind(this.trackPreorders, this);
    this.model = AppModel.getInstance();
    SpecsView.__super__.constructor.call(this, opts);
  }

  SpecsView.prototype.initialize = function(opts) {
    SpecsView.__super__.initialize.call(this, opts);
    this.delegateEvents(this.generateEvents());
    this.isWebGL = this.isWebGL();
    return this.initiateSwiperGalleries();
  };

  SpecsView.prototype.generateEvents = function() {
    var events;
    events = {};
    $(window).on('resize', this.checkForRacket);
    $(window).on('load', this.checkForRacket);
    events['click a.orange-btn'] = 'trackPreorders';
    if (!this.isPhone) {
      events['click a#see-more-specs'] = "toggleTable";
      events['click a#close-table'] = "toggleTable";
    }
    return events;
  };

  SpecsView.prototype.trackPreorders = function(e) {
    return Tracking.gaTrackElement($(e.target));
  };

  SpecsView.prototype.toggleTable = function(e) {
    if (e.preventDefault != null) {
      e.preventDefault();
    }
    $('#see-more-specs').toggleClass('showing');
    if ($(specs).hasClass('showing-table')) {
      return this.animateTable('hide');
    } else {
      this.animateTable('show');
      TweenMax.to(window, .5, {
        scrollTo: {
          y: 2280 - (window.innerHeight - $('#specs-table').height()) / 2
        }
      });
      return Tracking.gaTrackElement($('#see-more-specs'));
    }
  };

  SpecsView.prototype.animateTable = function(opts) {
    var expandedHeight, i, row, specs, tableHeight, tableIn, tableRows, _i, _len, _ref;
    specs = $('#specs');
    tableRows = $('#specs-table').find('tr');
    tableHeight = $('#specs-table').height();
    if (window.innerWidth < 850) {
      expandedHeight = 2260;
    } else if (window.innerWidth < 1000) {
      expandedHeight = 2150;
    } else {
      expandedHeight = 2150;
    }
    tableIn = new TimelineMax({
      align: "start",
      stagger: 0,
      paused: true,
      onComplete: (function(_this) {
        return function() {};
      })(this)
    });
    TweenMax.set($(tableRows), {
      y: 20,
      alpha: 0,
      rotationX: -90,
      rotationY: -35
    });
    _ref = $(tableRows);
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      row = _ref[i];
      tableIn.add(TweenMax.staggerTo($(row), .2, {
        y: 0,
        alpha: 1,
        rotationX: 0,
        rotationY: 0,
        ease: Quad.easeInOut,
        delay: 0
      }), .25 + (.1 * i), "normal", 0);
    }
    if (opts === 'show') {
      TweenMax.fromTo($(specs), .05, {
        height: 1540
      }, {
        height: expandedHeight
      });
      tableIn.resume();
      return $(specs).addClass('showing-table');
    } else {
      tableIn.reverse(0);
      TweenMax.fromTo($(specs), .45, {
        height: expandedHeight
      }, {
        height: 1540
      });
      return $(specs).removeClass('showing-table');
    }
  };

  SpecsView.prototype.initiateSwiperGalleries = function(opts) {
    var dots, galleries, gallery, i, id, swipers, _i, _len, _ref, _results;
    galleries = $('.swiper-container');
    swipers = [];
    _ref = $(galleries);
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      gallery = _ref[i];
      id = '#' + $(gallery).attr('id');
      dots = $(gallery).next().attr('id');
      $(id + ', .swipe-for-more').css({
        display: 'block'
      });
      _results.push(swipers[i] = new Swiper(id, {
        pagination: '#' + dots + '.pagination',
        paginationClickable: true
      }));
    }
    return _results;
  };

  SpecsView.prototype.checkForRacket = function(e) {
    var windowWidth;
    windowWidth = window.innerWidth;
    if (windowWidth < 700) {
      $('#racket').css({
        visibility: 'hidden'
      });
      return $('#racket-fallback').css({
        visibility: 'visible'
      });
    } else {
      if (!this.isWebGL) {
        $('#racket').css({
          visibility: 'hidden'
        });
        return $('#racket-fallback').css({
          visibility: 'visible'
        });
      } else {
        $('#racket').css({
          visibility: 'visible'
        });
        return $('#racket-fallback').css({
          visibility: 'hidden'
        });
      }
    }
  };

  return SpecsView;

})(ViewBase);

module.exports = SpecsView;



},{"../models/AppModel.coffee":4,"../utils/track.coffee":10,"./abstract/ViewBase.coffee":18}],15:[function(require,module,exports){
var AppModel, PlayersView, TeamPlayerView, Tracking, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./abstract/ViewBase.coffee');

TeamPlayerView = require('./TeamPlayerView.coffee');

AppModel = require('../models/AppModel.coffee');

Tracking = require('../utils/track.coffee');

PlayersView = (function(_super) {
  __extends(PlayersView, _super);

  function PlayersView(opts) {
    this.updatePlayerIcons = __bind(this.updatePlayerIcons, this);
    this.model = AppModel.getInstance();
    PlayersView.__super__.constructor.call(this, opts);
  }

  PlayersView.prototype.initialize = function(opts) {
    PlayersView.__super__.initialize.call(this, opts);
    this.playerInstances = [];
    this.playerNames = [];
    this.createPlayers();
    return this.delegateEvents(this.generateEvents());
  };

  PlayersView.prototype.generateEvents = function() {
    var events;
    events = {};
    if (!this.isPhone) {
      events['mouseenter .member img.inactive'] = "hoverPlayer";
      events['mouseleave .member img.inactive'] = "leavePlayer";
      events['click #toggle-more-less'] = "toggleMoreResponses";
      events['click #toggle-more-less i.fa-th'] = "clickMoreLess";
      events['click #the-team img'] = "switchPlayers";
      events['click #prev-member'] = 'prevPlayer';
      events['click #next-member'] = 'nextPlayer';
      events['mousemove .content-wrapper'] = 'animateBackground';
      events['mousemove .player.top'] = 'animateBackground';
    } else {
      events['click .player'] = "switchPlayers";
    }
    return events;
  };

  PlayersView.prototype.createPlayers = function() {
    var i, id, p, players, teamBurnWrapper, _i, _len, _results;
    teamBurnWrapper = $('#team-burn-wrapper');
    players = teamBurnWrapper.find('.player');
    _results = [];
    for (i = _i = 0, _len = players.length; _i < _len; i = ++_i) {
      p = players[i];
      id = $(p).attr('id');
      this.playerNames.push(id);
      _results.push(this.playerInstances[id] = new TeamPlayerView({
        $el: $('#' + id)
      }));
    }
    return _results;
  };

  PlayersView.prototype.prevPlayer = function(e) {
    var height, index, length, newPs, newQuestions, p, prevName, topName, topResponses, _i, _len, _ref;
    e.preventDefault();
    topName = $('.player.top').attr('id');
    topResponses = $('.player#' + topName + ' .responses');
    index = this.playerNames.indexOf(topName);
    length = this.playerNames.length;
    prevName = '';
    if (index > 0) {
      prevName = this.playerNames[index - 1];
      $('#' + prevName + '-thumbnail img.inactive').trigger('click');
    } else {
      prevName = this.playerNames[length - 1];
      $('#' + prevName + '-thumbnail img.inactive').trigger('click');
    }
    newQuestions = $("#team-burn-wrapper").find('.player#' + prevName + ' .responses');
    newPs = $(newQuestions).find('p');
    height = 0;
    _ref = $(newPs);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      height = height + $(p).height() + 12;
    }
    return TweenMax.to([$('#team-burn-content .responses'), $(newQuestions)], .35, {
      height: height,
      delay: 2,
      onComplete: function() {
        return TweenMax.to($(topResponses), .35, {
          height: 180
        });
      }
    });
  };

  PlayersView.prototype.nextPlayer = function(e) {
    var height, index, length, newPs, newQuestions, nextName, p, topName, topResponses, _i, _len, _ref;
    e.preventDefault();
    topName = $('.player.top').attr('id');
    topResponses = $('.player#' + topName + ' .responses');
    index = this.playerNames.indexOf(topName);
    length = this.playerNames.length;
    nextName = '';
    if (index < (length - 1)) {
      nextName = this.playerNames[index + 1];
      $('#' + nextName + '-thumbnail img.inactive').trigger('click');
    } else {
      nextName = this.playerNames[0];
      $('#' + nextName + '-thumbnail img.inactive').trigger('click');
    }
    newQuestions = $("#team-burn-wrapper").find('.player#' + nextName + ' .responses');
    newPs = $(newQuestions).find('p');
    height = 0;
    _ref = $(newPs);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      height = height + $(p).height() + 12;
    }
    return TweenMax.to([$('#team-burn-content .responses'), $(newQuestions)], .35, {
      height: height,
      delay: 2,
      onComplete: function() {
        return TweenMax.to($(topResponses), .35, {
          height: 180
        });
      }
    });
  };

  PlayersView.prototype.animateBackground = function(e) {
    var bg, percentX, percentY, x, y;
    x = e.pageX;
    y = e.pageY;
    percentX = Math.round((x / window.innerWidth) * 100) / 1.75;
    percentY = Math.round(((y - $('#team-burn').position().top) / $('#team-burn').height()) * 100) / 1.75;
    return bg = $('.player.top');
  };

  PlayersView.prototype.switchPlayers = function(e) {
    var $thumb, i, name, open, p, playerName, selectedName, selectedPlayer, topID, _i, _len, _ref;
    if (!this.isPhone) {
      name = $(e.target).closest(".member").data('name');
      topID = $('.player.top').attr('id');
      if (name !== topID) {
        this.playerInstances[topID].transitionOut();
        this.playerInstances[name].transitionIn($('.player#' + name));
        this.updatePlayerIcons(e);
        this.disableSwitching();
      }
      $thumb = $(e.target).parent();
    } else {
      selectedPlayer = $(e.target).parents('.player');
      selectedName = $(selectedPlayer).attr('id');
      open = $('.responses.open').attr('id');
      if ($(e.target).find('.responses').hasClass('open')) {
        this.playerInstances[selectedName].closePlayer($('.player#' + selectedName));
        return false;
      }
      _ref = $('.player');
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        p = _ref[i];
        playerName = $(p).attr('id');
        this.playerInstances[playerName].closePlayer($('.player#' + playerName));
      }
      this.playerInstances[selectedName].openPlayer($(selectedPlayer));
      $thumb = $("#" + selectedName + "-thumbnail");
    }
    return Tracking.gaTrackElement($thumb);
  };

  PlayersView.prototype.disableSwitching = function(e) {
    $('#the-team .row, #prev-member, #next-member').css({
      pointerEvents: 'none'
    });
    return setTimeout((function() {
      return $('#the-team .row, #prev-member, #next-member').css({
        pointerEvents: 'auto'
      });
    }), 2500);
  };

  PlayersView.prototype.updatePlayerIcons = function(e) {
    var active, inactive, selected;
    inactive = $(e.target);
    active = $(inactive).next();
    selected = $('.member img.selected');
    return TweenMax.set($(selected), {
      opacity: 1,
      zIndex: 2,
      onComplete: (function(_this) {
        return function() {
          $(selected).removeClass('selected');
          TweenMax.to($(selected), .5, {
            alpha: 0,
            zIndex: -1
          });
          return $(active).addClass('selected');
        };
      })(this)
    });
  };

  PlayersView.prototype.hoverPlayer = function(e) {
    var activeImage, inavtiveImage;
    activeImage = $(e.target).parent().find('img.active');
    inavtiveImage = $(e.target).parent().find('img.inactive');
    TweenMax.to($(activeImage), .5, {
      alpha: 1
    });
    return TweenMax.to($(inavtiveImage), .5, {
      alpha: 0
    });
  };

  PlayersView.prototype.leavePlayer = function(e) {
    var activeImage, inavtiveImage;
    activeImage = $(e.target).parent().find('img.active');
    inavtiveImage = $(e.target).parent().find('img.inactive');
    TweenMax.to($(activeImage), .5, {
      alpha: 0
    });
    return TweenMax.to($(inavtiveImage), .5, {
      alpha: 1
    });
  };

  PlayersView.prototype.toggleMoreResponses = function(e) {
    var $target, Ps, container, height, p, playerHeight, playerQWrapper, responses, _i, _len, _ref;
    e.preventDefault();
    $target = $(e.target).closest('a');
    container = $target.prev();
    playerQWrapper = $("#team-burn-wrapper").find('.player.top .responses');
    responses = $("#team-burn-wrapper").find('.player .responses');
    Ps = $(playerQWrapper).find('p');
    height = 0;
    if (container.hasClass('closed')) {
      _ref = $(Ps);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        height = height + $(p).height() + 12;
      }
      TweenMax.to([$(container), $(playerQWrapper)], .35, {
        height: height
      });
      TweenMax.to($('#the-team .row'), .35, {
        autoAlpha: 0,
        y: height
      });
      $(container).removeClass('closed');
      $target.find(".expand").hide();
      $target.find(".collapse").show();
      return $('a#prev-member, a#next-member').addClass('visible');
    } else {
      playerHeight = $(playerQWrapper).data('height');
      TweenMax.to([$(container), $(playerQWrapper)], .35, {
        height: parseInt(playerHeight, 10)
      });
      TweenMax.to($('#the-team .row'), .35, {
        autoAlpha: 1,
        y: 0
      });
      $(container).addClass('closed');
      $target.find(".expand").show();
      $target.find(".collapse").hide();
      return $('a#prev-member, a#next-member').removeClass('visible');
    }
  };

  PlayersView.prototype.clickMoreLess = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return $('#toggle-more-less').trigger('click');
  };

  return PlayersView;

})(ViewBase);

module.exports = PlayersView;



},{"../models/AppModel.coffee":4,"../utils/track.coffee":10,"./TeamPlayerView.coffee":16,"./abstract/ViewBase.coffee":18}],16:[function(require,module,exports){
var AppModel, TeamPlayerView, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./abstract/ViewBase.coffee');

AppModel = require('../models/AppModel.coffee');

TeamPlayerView = (function(_super) {
  __extends(TeamPlayerView, _super);

  function TeamPlayerView(opts) {
    this.closePlayer = __bind(this.closePlayer, this);
    this.openPlayer = __bind(this.openPlayer, this);
    this.transitionOut = __bind(this.transitionOut, this);
    this.model = AppModel.getInstance();
    this.id = opts;
    TeamPlayerView.__super__.constructor.call(this, opts);
  }

  TeamPlayerView.prototype.initialize = function(opts) {
    TeamPlayerView.__super__.initialize.call(this, opts);
    return this.delegateEvents(this.generateEvents());
  };

  TeamPlayerView.prototype.generateEvents = function() {
    var events;
    events = {};
    if (!this.isTouch) {

    } else {

    }
    return events;
  };

  TeamPlayerView.prototype.transitionOut = function(e) {
    var i, p, split, splitQuestionsOut, topCard, topPlayerName, topPs, transitionOut, _i, _len;
    topCard = $('.player.top');
    topPlayerName = $(topCard).find('.player-name h1');
    topPs = $(topCard).find('.responses p');
    transitionOut = new TimelineMax({
      align: "start",
      stagger: 1,
      paused: true,
      onComplete: (function(_this) {
        return function() {
          var q, _i, _len, _results;
          transitionOut.kill();
          split.revert();
          _results = [];
          for (_i = 0, _len = splitQuestionsOut.length; _i < _len; _i++) {
            q = splitQuestionsOut[_i];
            _results.push(q.revert());
          }
          return _results;
        };
      })(this)
    });
    splitQuestionsOut = [];
    for (i = _i = 0, _len = topPs.length; _i < _len; i = ++_i) {
      p = topPs[i];
      splitQuestionsOut[i] = new SplitText($(p), {
        type: "chars,words,lines"
      });
      transitionOut.add(TweenMax.staggerTo(splitQuestionsOut[i].lines, .5, {
        x: 0,
        y: -10,
        alpha: 0,
        ease: Quad.easeInOut
      }), .05 * (i + 1), "normal", -.175);
    }
    split = new SplitText(topPlayerName, {
      type: "chars,words,lines",
      position: "absolute"
    });
    transitionOut.add(TweenMax.staggerTo(split.chars, .75, {
      x: 0,
      y: 0,
      alpha: 0,
      ease: Quad.easeInOut
    }), .5, "normal", -.05);
    transitionOut.add(TweenMax.to($(topCard), .5, {
      ease: Quad.easeOut,
      scale: 1.5,
      alpha: 0,
      zIndex: -5
    }), 1.35, "normal", .5);
    return transitionOut.resume();
  };

  TeamPlayerView.prototype.transitionIn = function(nextPlayer) {
    var i, nextPlayerName, nextPlayerPs, p, responsesHeight, splitNext, splitQuestionsIn, topCard, transitionIn, _i, _len;
    topCard = $('.player.top');
    nextPlayerName = $(nextPlayer).find('.player-name h1');
    responsesHeight = $(nextPlayer).find('.responses').data('height');
    nextPlayerPs = $(nextPlayer).find('.responses p');
    TweenMax.to($('.responses'), .35, {
      delay: 2,
      ease: Quad.easeInOut,
      height: parseInt(responsesHeight, 10)
    });
    transitionIn = new TimelineMax({
      align: "start",
      stagger: 1,
      paused: true,
      onComplete: (function(_this) {
        return function() {
          var q, _i, _len, _results;
          topCard.removeClass('top');
          $(nextPlayer).addClass('top');
          transitionIn.kill();
          splitNext.revert();
          _results = [];
          for (_i = 0, _len = splitQuestionsIn.length; _i < _len; _i++) {
            q = splitQuestionsIn[_i];
            _results.push(q.revert());
          }
          return _results;
        };
      })(this)
    });
    transitionIn.add(TweenMax.to($(nextPlayer), .5, {
      ease: Quad.easeInOut,
      scale: 1,
      alpha: 1,
      zIndex: 5
    }), 1.25, "normal", 1.25);
    splitNext = new SplitText(nextPlayerName, {
      type: "chars,words,lines",
      position: "absolute"
    });
    transitionIn.add(TweenMax.staggerFromTo(splitNext.chars, .75, {
      x: 0,
      y: 0,
      alpha: 0,
      ease: Quad.easeInOut
    }, {
      x: 0,
      y: 0,
      alpha: 1,
      ease: Quad.easeInOut
    }, 0.01), 1.5, "normal", .01);
    splitQuestionsIn = [];
    for (i = _i = 0, _len = nextPlayerPs.length; _i < _len; i = ++_i) {
      p = nextPlayerPs[i];
      splitQuestionsIn[i] = new SplitText($(p), {
        type: "chars,words,lines"
      });
      transitionIn.add(TweenMax.staggerFromTo(splitQuestionsIn[i].lines, .5, {
        x: 0,
        y: -10,
        alpha: 0,
        ease: Quad.easeInOut
      }, {
        x: 0,
        y: 0,
        alpha: 1,
        ease: Quad.easeInOut
      }, 1.25), 1.5 + (.08 * i), "normal", -1.2);
    }
    return transitionIn.resume();
  };

  TeamPlayerView.prototype.openPlayer = function(opts) {
    var Ps, angle, height, index, name, open, p, responses, y, _i, _len;
    responses = $(opts).find('.responses');
    angle = $(opts).find('img.angle-expand');
    Ps = $(responses).find('p');
    height = 0;
    name = $(opts).find('.player-name h1');
    index = $(opts).data('index');
    y = 2386 + 87 * index;
    for (_i = 0, _len = Ps.length; _i < _len; _i++) {
      p = Ps[_i];
      height = height + $(p).height() + 12;
    }
    open = new TimelineMax({
      align: "start",
      stagger: 1,
      paused: true,
      onComplete: (function(_this) {
        return function() {
          return open.kill();
        };
      })(this)
    });
    open.add(TweenMax.to($(angle), .5, {
      rotation: 180
    }, 0.25), .25, "normal", .01);
    open.add(TweenMax.to($(name), .5, {
      color: '#da1a32'
    }, 0.25), .25, "normal", .01);
    open.add(TweenMax.to($(responses), .05, {
      height: height,
      ease: Quad.easeOut
    }, 0.15), .5, "normal", .05);
    open.resume();
    $(responses).addClass('open').removeClass('closed');
    return $('html, body').animate({
      scrollTop: y + 'px'
    }, 1000);
  };

  TeamPlayerView.prototype.closePlayer = function(opts) {
    var angle, close, name, responses;
    responses = $(opts).find('.responses');
    angle = $(opts).find('img.angle-expand');
    name = $(opts).find('.player-name h1');
    close = new TimelineMax({
      align: "start",
      stagger: 1,
      paused: true,
      onComplete: (function(_this) {
        return function() {
          return close.kill();
        };
      })(this)
    });
    close.add(TweenMax.to($(responses), .05, {
      height: 0,
      ease: Quad.easeOut
    }, 0.15), .5, "normal", .05);
    close.add(TweenMax.to($(name), .5, {
      color: '#fff'
    }, 0.25), .25, "normal", .01);
    close.add(TweenMax.to($(angle), .5, {
      rotation: 0
    }, 0.25), .25, "normal", .01);
    close.resume();
    return $(responses).removeClass('open').addClass('closed');
  };

  return TeamPlayerView;

})(ViewBase);

module.exports = TeamPlayerView;



},{"../models/AppModel.coffee":4,"./abstract/ViewBase.coffee":18}],17:[function(require,module,exports){
var AppModel, PostViewBase, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./ViewBase.coffee');

AppModel = require('../../models/AppModel.coffee');

PostViewBase = (function(_super) {
  __extends(PostViewBase, _super);

  function PostViewBase(opts) {
    this.transitionIn = __bind(this.transitionIn, this);
    this.featurePost = __bind(this.featurePost, this);
    this.feature = __bind(this.feature, this);
    this.approve = __bind(this.approve, this);
    this.appModel = AppModel.getInstance();
    PostViewBase.__super__.constructor.call(this, opts);
  }

  PostViewBase.prototype.initialize = function(opts) {
    return PostViewBase.__super__.initialize.call(this, opts);
  };

  PostViewBase.prototype.render = function() {
    var post;
    post = this.template({
      data: this.model
    });
    this.$el = $(post);
    this.rendered = true;
    return this.afterRender();
  };

  PostViewBase.prototype.generateEvents = function() {
    var events;
    events = {};
    events['click .approve'] = "approve";
    events['click .feature'] = "feature";
    return events;
  };

  PostViewBase.prototype.approve = function(e) {
    var $input, $t, approveService, checked, data;
    e.preventDefault();
    $t = $(e.target).parentsUntil(".item").parent();
    $input = $t.find('.approve input');
    checked = $input.is(':checked');
    data = {
      id: $t.data('id'),
      type: $t.data('type'),
      approved: !checked,
      _csrf: this.appModel.get("session").get('csrf')
    };
    approveService = this.appModel.get("services").approve;
    return this.postData(approveService, data, $input);
  };

  PostViewBase.prototype.feature = function(e) {
    var $input, $t, checked, data, featureService;
    e.preventDefault();
    $t = $(e.target).parentsUntil(".item").parent();
    $input = $t.find('.feature input');
    checked = $input.is(':checked');
    data = {
      id: $t.data('id'),
      type: $t.data('type'),
      featured: !checked,
      _csrf: this.appModel.get("session").get('csrf')
    };
    featureService = this.appModel.get("services").feature;
    return this.postData(featureService, data, $input, this.featurePost);
  };

  PostViewBase.prototype.featurePost = function(val) {
    if (val === true) {
      this.$el.removeClass('small');
      this.$el.addClass('large');
    } else {
      this.$el.removeClass('large');
      this.$el.addClass('small');
    }
    return this.trigger('layoutChanged');
  };

  PostViewBase.prototype.postData = function(service, data, $input, callback) {
    return $.ajax({
      type: "POST",
      url: service,
      data: data,
      success: function(result) {
        console.log(result);
        $input.prop('checked', result.changed[0][$input.attr('name')]);
        if (callback != null) {
          return callback(result.changed[0][$input.attr('name')]);
        }
      }
    });
  };

  PostViewBase.prototype.transitionIn = function(callback) {
    return TweenMax.to(this.$el, .4, {
      autoAlpha: 1,
      ease: Cubic.easeOut,
      onComplete: (function(_this) {
        return function() {
          if (callback !== void 0) {
            return callback();
          }
        };
      })(this)
    });
  };

  PostViewBase.prototype.addEllipsis = function() {
    console.log(this.$el);
    return this.$el.find('.post-body').dotdotdot();
  };

  return PostViewBase;

})(ViewBase);

module.exports = PostViewBase;



},{"../../models/AppModel.coffee":4,"./ViewBase.coffee":18}],18:[function(require,module,exports){
var ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = (function(_super) {
  __extends(ViewBase, _super);

  function ViewBase(opt) {
    this.transitionOut = __bind(this.transitionOut, this);
    this.transitionIn = __bind(this.transitionIn, this);
    this.destroy = __bind(this.destroy, this);
    if (this.template == null) {
      this.template = "";
    }
    this.global = {};
    ViewBase.__super__.constructor.call(this, opt);
  }

  ViewBase.prototype.initialize = function(opt) {
    this.isTouch = Modernizr.touch;
    this.isTablet = $("html").hasClass("tablet");
    this.isPhone = $("html").hasClass("phone");
    return this.isWebGL = function() {
      var canvas;
      canvas = document.getElementById('webgl');
      if (canvas.getContext("experimental-webgl") === null || canvas.getContext("experimental-webgl") === void 0) {
        return false;
      } else {
        return true;
      }
    };
  };

  ViewBase.prototype.generateEvents = function() {
    return {};
  };

  ViewBase.prototype.render = function() {
    this.$el.html(this.template({
      data: this.model
    }));
    return this.afterRender();
  };

  ViewBase.prototype.afterRender = function() {
    return this.delegateEvents(this.generateEvents());
  };

  ViewBase.prototype.destroy = function() {
    this.$el.html("");
    return this.undelegateEvents();
  };

  ViewBase.prototype.preventDefault = function(e) {
    if (e !== void 0 && e !== null) {
      if (e.preventDefault !== void 0 && typeof e.preventDefault === "function") {
        return e.preventDefault();
      } else {
        return e.returnValue = false;
      }
    }
  };

  ViewBase.prototype.transitionIn = function(callback) {
    this.render();
    return TweenMax.to(this.$el, .4, {
      autoAlpha: 1,
      ease: Cubic.easeOut,
      onComplete: (function(_this) {
        return function() {
          if (callback !== void 0) {
            return callback();
          }
        };
      })(this)
    });
  };

  ViewBase.prototype.transitionOut = function(callback) {
    return TweenMax.to(this.$el, .4, {
      autoAlpha: 0,
      ease: Cubic.easeOut,
      onComplete: (function(_this) {
        return function() {
          _this.destroy();
          if (callback !== void 0) {
            return callback();
          }
        };
      })(this)
    });
  };

  return ViewBase;

})(Backbone.View);

module.exports = ViewBase;



},{}],19:[function(require,module,exports){
var FacebookPostView, PostViewBase,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PostViewBase = require('../abstract/PostViewBase.coffee');

FacebookPostView = (function(_super) {
  __extends(FacebookPostView, _super);

  function FacebookPostView(opts) {
    this.template = require('../../../../templates/connect/facebook-post.jade');
    FacebookPostView.__super__.constructor.call(this, opts);
  }

  return FacebookPostView;

})(PostViewBase);

module.exports = FacebookPostView;



},{"../../../../templates/connect/facebook-post.jade":40,"../abstract/PostViewBase.coffee":17}],20:[function(require,module,exports){
var InstagramPostView, PostViewBase,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PostViewBase = require('../abstract/PostViewBase.coffee');

InstagramPostView = (function(_super) {
  __extends(InstagramPostView, _super);

  function InstagramPostView(opts) {
    this.template = require('../../../../templates/connect/instagram-post.jade');
    InstagramPostView.__super__.constructor.call(this, opts);
  }

  return InstagramPostView;

})(PostViewBase);

module.exports = InstagramPostView;



},{"../../../../templates/connect/instagram-post.jade":41,"../abstract/PostViewBase.coffee":17}],21:[function(require,module,exports){
var PostViewBase, TwitterPostView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PostViewBase = require('../abstract/PostViewBase.coffee');

TwitterPostView = (function(_super) {
  __extends(TwitterPostView, _super);

  function TwitterPostView(opts) {
    this.template = require('../../../../templates/connect/twitter-post.jade');
    TwitterPostView.__super__.constructor.call(this, opts);
  }

  TwitterPostView.prototype.initialize = function(opts) {
    return TwitterPostView.__super__.initialize.call(this, opts);
  };

  TwitterPostView.prototype.parseEntities = function() {
    var text;
    text = this.model.get('text');
    text = text.split("&amp;").join("&");
    return this.model.set('text', text);
  };

  TwitterPostView.prototype.afterRender = function() {};

  return TwitterPostView;

})(PostViewBase);

module.exports = TwitterPostView;



},{"../../../../templates/connect/twitter-post.jade":42,"../abstract/PostViewBase.coffee":17}],22:[function(require,module,exports){
var RacketCamera, RacketGL, RacketRenderer, RacketScene, RotationControls,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

RacketScene = require('./scene/RacketScene.coffee');

RacketCamera = require('./scene/RacketCamera.coffee');

RacketRenderer = require('./RacketRenderer.coffee');

RotationControls = require('./control/RotationControls.coffee');

RacketGL = (function() {
  function RacketGL(opts) {
    this.moveRacket = __bind(this.moveRacket, this);
    this.resize = __bind(this.resize, this);
    this.handleObjectsLoaded = __bind(this.handleObjectsLoaded, this);
    this.handleRacketMovement = __bind(this.handleRacketMovement, this);
    this.handleControls = __bind(this.handleControls, this);
    _.extend(this, Backbone.Events);
    opts.antialias = true;
    this.$el = opts.$el;
    this.scene = window.scene = new RacketScene(window.innerWidth, this.$el.find(".gl-container").height(), opts.model, this.$el.find(".gl-container")[0]);
    this.renderer = new RacketRenderer(opts, this.scene.scene, this.scene.camera, this.scene.renderOperation);
    this.scene.renderer = this.renderer;
  }

  RacketGL.prototype.addEvents = function() {
    $(window).resize(this.resize);
    this.rotationControls = new RotationControls(this.$el[0]);
    this.rotationControls.on("pan", this.handleControls);
    this.scene.on("racketMovingStart", this.handleRacketMovement);
    this.scene.on("racketMovingUpdate", this.handleRacketMovement);
    this.scene.on("racketMovingComplete", this.handleRacketMovement);
    return this.scene.on("racketLoaded", this.handleObjectsLoaded);
  };

  RacketGL.prototype.handleControls = function(data) {
    return this.scene.controlRotation(data);
  };

  RacketGL.prototype.handleRacketMovement = function(e, user) {
    return this.trigger(e.type, this.scene.getHotspotsPositions(), user);
  };

  RacketGL.prototype.handleObjectsLoaded = function() {
    this.trigger("objectsLoaded");
    return this.resize();
  };

  RacketGL.prototype.resize = function() {
    this._height = this.$el.find('.gl-container').height();
    this._width = window.innerWidth;
    this.scene.resize(this._width, this._height);
    this.renderer.setSize(window.innerWidth, this._height);
    return this.handleRacketMovement({
      type: "racketMovingUpdate"
    });
  };

  RacketGL.prototype.initialize = function() {
    this.$el.find(".gl-container").append(this.renderer.domElement);
    this.scene.initialize();
    this.addEvents();
    return this.renderer.renderTime();
  };

  RacketGL.prototype.moveRacket = function(data) {
    return this.scene.moveRacket(data);
  };

  return RacketGL;

})();

module.exports = RacketGL;



},{"./RacketRenderer.coffee":24,"./control/RotationControls.coffee":32,"./scene/RacketCamera.coffee":38,"./scene/RacketScene.coffee":39}],23:[function(require,module,exports){
var RacketPreloaderView, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('../abstract/ViewBase.coffee');

RacketPreloaderView = (function(_super) {
  __extends(RacketPreloaderView, _super);

  function RacketPreloaderView(opts) {
    this.progress = __bind(this.progress, this);
    RacketPreloaderView.__super__.constructor.call(this, opts);
    this.template = require('../../../../templates/specs/loader/specs-loader.jade');
  }

  RacketPreloaderView.prototype.initialize = function(opts) {
    return RacketPreloaderView.__super__.initialize.call(this, opts);
  };

  RacketPreloaderView.prototype.transitionCTA = function(callback) {
    var tl;
    tl = new TimelineMax({
      onComplete: function() {
        if (callback != null) {
          return callback();
        }
      }
    });
    tl.add(TweenMax.to(this.$el.find("#specs-loader"), .5, {
      autoAlpha: 0
    }));
    return tl.add(TweenMax.to(this.$el.find("#specs-cta"), 1, {
      autoAlpha: 1
    }));
  };

  RacketPreloaderView.prototype.progress = function(loaded) {
    var percent;
    percent = Math.ceil(loaded * 100);
    this.progressText.html(percent);
    return TweenMax.to(this.progressCircle, .1, {
      drawSVG: "" + percent + "%"
    });
  };

  RacketPreloaderView.prototype.afterRender = function() {
    this.progressText = this.$el.find(".progress .amount");
    this.progressCircle = this.$el.find("g.load-meter circle");
    return TweenMax.set(this.progressCircle, {
      rotation: "-90deg",
      transformOrigin: "50% 50%"
    });
  };

  return RacketPreloaderView;

})(ViewBase);

module.exports = RacketPreloaderView;



},{"../../../../templates/specs/loader/specs-loader.jade":45,"../abstract/ViewBase.coffee":18}],24:[function(require,module,exports){
var RacketRenderer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RacketRenderer = (function(_super) {
  __extends(RacketRenderer, _super);

  function RacketRenderer(opts, scene, camera, sceneRenderOperation) {
    this.renderTime = __bind(this.renderTime, this);
    opts.devicePixelRatio = 1;
    RacketRenderer.__super__.constructor.call(this, opts);
    this.scene = scene;
    this.camera = camera;
    this.renderOperation = sceneRenderOperation;
  }

  RacketRenderer.prototype.renderTime = function() {
    if (this.renderOperation != null) {
      this.renderOperation();
    }
    this.render(this.scene, this.camera);
    return requestAnimationFrame(this.renderTime);
  };

  return RacketRenderer;

})(THREE.WebGLRenderer);

module.exports = RacketRenderer;



},{}],25:[function(require,module,exports){
var AppModel, HotspotView, RacketGL, RacketPreloaderView, RacketView, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('./../abstract/ViewBase.coffee');

RacketGL = require('./RacketGL.coffee');

HotspotView = require('./hotspots/HotspotView.coffee');

RacketPreloaderView = require('./RacketPreloaderView.coffee');

AppModel = require('../../models/AppModel.coffee');

RacketView = (function(_super) {
  __extends(RacketView, _super);

  function RacketView(opts) {
    this.transitionIn = __bind(this.transitionIn, this);
    this.removeCTA = __bind(this.removeCTA, this);
    this.initialUpdate = __bind(this.initialUpdate, this);
    this.initializeRacket = __bind(this.initializeRacket, this);
    this.appModel = AppModel.getInstance();
    RacketView.__super__.constructor.call(this, opts);
  }

  RacketView.prototype.initialize = function(opts) {
    RacketView.__super__.initialize.call(this, opts);
    return this.loadAssets();
  };

  RacketView.prototype.loadAssets = function() {
    if (!this.isPhone && this.isWebGL()) {
      this.preloader = new RacketPreloaderView({
        el: this.$el.find("#loader-container"),
        model: this.model
      });
      this.preloader.transitionIn();
      this.model.on("assetsReady", this.initializeRacket);
      this.model.on("assetsProgress", this.preloader.progress);
      return this.model.loadAssets();
    }
  };

  RacketView.prototype.initializeRacket = function() {
    this.createRacketGl();
    this.createHotspotsView();
    return this.delegateEvents(this.generateEvents());
  };

  RacketView.prototype.initialUpdate = function(e) {
    this.hotspots.updateHotspots(e);
    return setTimeout((function(_this) {
      return function() {
        _this.racketGL.once("racketMovingUpdate", _this.removeCTA);
        _this.preloader.transitionCTA();
        return _this.transitionIn();
      };
    })(this), 50);
  };

  RacketView.prototype.removeCTA = function(e) {
    this.hotspots.updateHotspots(e);
    this.preloader.transitionOut();
    return this.racketGL.on("racketMovingUpdate", this.hotspots.updateHotspots);
  };

  RacketView.prototype.generateEvents = function() {
    var events;
    this.racketGL.on("objectsLoaded", this.hotspots.initHotspots);
    this.racketGL.once("racketMovingUpdate", this.initialUpdate);
    this.racketGL.on("racketMovingComplete", this.hotspots.onRacketTransitionComplete);
    this.hotspots.on("hotspotClicked", this.racketGL.moveRacket);
    events = {};
    return events;
  };

  RacketView.prototype.createRacketGl = function() {
    this.racketGL = new RacketGL({
      $el: this.$el.find('.racket-specs-content'),
      maxLights: 20,
      alpha: true,
      model: this.model.attributes
    });
    return this.racketGL.initialize();
  };

  RacketView.prototype.createHotspotsView = function() {
    return this.hotspots = new HotspotView({
      el: this.$el.find('.racket-specs-content'),
      model: this.model.get('hotspots')
    });
  };

  RacketView.prototype.transitionIn = function(callback) {
    return TweenMax.to(this.$el.find('.racket-specs-content'), .4, {
      autoAlpha: 1,
      ease: Cubic.easeOut,
      onComplete: (function(_this) {
        return function() {
          if (callback !== void 0) {
            return callback();
          }
        };
      })(this)
    });
  };

  return RacketView;

})(ViewBase);

module.exports = RacketView;



},{"../../models/AppModel.coffee":4,"./../abstract/ViewBase.coffee":18,"./RacketGL.coffee":22,"./RacketPreloaderView.coffee":23,"./hotspots/HotspotView.coffee":33}],26:[function(require,module,exports){
var CompoundObject,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

CompoundObject = (function() {
  function CompoundObject() {
    this.groupLoaded = __bind(this.groupLoaded, this);
    this.createGroup = __bind(this.createGroup, this);
    this.objectLoaded = __bind(this.objectLoaded, this);
    this.objectLoadedProxy = __bind(this.objectLoadedProxy, this);
    this.geometryLoaded = __bind(this.geometryLoaded, this);
    this.createObjLoader = __bind(this.createObjLoader, this);
    this.createJsLoader = __bind(this.createJsLoader, this);
    this.createLoaders = __bind(this.createLoaders, this);
    _.extend(this, Backbone.Events);
    this.geometry = [];
    this.objects = {};
  }

  CompoundObject.prototype.load = function(objectData) {
    if (this.object == null) {
      this.loaders = this.parse(objectData);
      return this.loadObjects();
    } else {
      return console.error("Object Already Loaded");
    }
  };

  CompoundObject.prototype.loadObjects = function() {
    var loader, _i, _len, _ref, _results;
    _ref = this.loaders;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      loader = _ref[_i];
      if (loader._jsUrl != null) {
        _results.push(loader.load(loader._jsUrl, this.geometryLoaded));
      } else if (loader._objUrl != null) {
        _results.push(loader.load(loader._objUrl, this.objectLoadedProxy(loader)));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  CompoundObject.prototype.parse = function(data) {
    var js, k, loaders, obj, v;
    loaders = [];
    for (k in data) {
      v = data[k];
      switch (k) {
        case "obj":
          obj = v;
          break;
        case "js":
          js = v;
      }
    }
    if (js != null) {
      if ($.isArray(js)) {
        loaders = this.createLoaders(js);
      } else {
        loaders.push(this.createJsLoader(js));
      }
    } else if (obj != null) {
      if ($.isArray(obj)) {
        loaders = this.createLoaders(null, obj);
      } else {
        loaders.push(this.createObjLoader(obj));
      }
    }
    return loaders;
  };

  CompoundObject.prototype.createLoaders = function(js, obj) {
    var i, j, loaders, o, _i, _j, _len, _len1;
    loaders = [];
    if (js != null) {
      for (_i = 0, _len = js.length; _i < _len; _i++) {
        j = js[_i];
        loaders.push(this.createJsLoader(j));
      }
      return loaders;
    } else if (obj != null) {
      for (i = _j = 0, _len1 = obj.length; _j < _len1; i = ++_j) {
        o = obj[i];
        loaders.push(this.createObjLoader(o));
      }
      return loaders;
    }
  };

  CompoundObject.prototype.createJsLoader = function(js) {
    var loader;
    loader = new THREE.JSONLoader();
    loader._jsUrl = js;
    return loader;
  };

  CompoundObject.prototype.createObjLoader = function(obj) {
    var loader;
    loader = new THREE.OBJLoader();
    loader._objUrl = obj.url;
    loader._mtlData = obj;
    loader.__id = obj.id;
    return loader;
  };

  CompoundObject.prototype.geometryLoaded = function(geom, mat) {
    var object;
    object = new THREE.Mesh(geom, mat[0]);
    return this.objectLoaded(object);
  };

  CompoundObject.prototype.objectLoadedProxy = function(loader) {
    return (function(_this) {
      return function(obj) {
        obj._loaderData = loader._mtlData;
        obj.__id = loader.__id;
        return _this.objectLoaded(obj);
      };
    })(this);
  };

  CompoundObject.prototype.objectLoaded = function(obj) {
    var o;
    o = obj;
    if (obj.children.length > 0) {
      o = obj.children[obj.children.length - 1];
    }
    o._loaderData = obj._loaderData;
    o.__id = obj.__id;
    this.objects[o.__id] = o;
    if (Object.keys(this.objects).length === this.loaders.length) {
      return this.createGroup();
    }
  };

  CompoundObject.prototype.createGroup = function() {
    var k, obj, _ref;
    this.group = new THREE.Group();
    window['3d'] = {};
    _ref = this.objects;
    for (k in _ref) {
      obj = _ref[k];
      window['3d'][obj.__id] = obj;
      this.group.add(obj);
    }
    return this.groupLoaded();
  };

  CompoundObject.prototype.groupLoaded = function() {
    return this.trigger("objectLoaded", this.group);
  };

  return CompoundObject;

})();

module.exports = CompoundObject;



},{}],27:[function(require,module,exports){
var geoSet, global, resetGeometry;

global = require('./global.coffee');

geoSet = false;

resetGeometry = function(components) {
  geoSet = true;
  return global.toggleVisibility(components, false);
};

module.exports.getAnimation = function(components) {
  var alpha, plate, platePos, tl, wirePos, wireframe;
  if (!geoSet) {
    resetGeometry(components);
  }
  tl = new TimelineMax({
    onReverseComplete: function() {
      return global.toggleVisibility(components, false);
    },
    onStart: function() {
      return global.toggleVisibility(components, true);
    }
  });
  wireframe = components.wireframe;
  plate = components.plate;
  alpha = TweenMax.fromTo([wireframe.material, plate.material], .5, {
    opacity: 0,
    immediateRender: true
  }, {
    opacity: 1
  });
  wirePos = TweenMax.fromTo([wireframe.position], 1, {
    x: -.5
  }, {
    x: 0
  });
  platePos = TweenMax.fromTo([plate.position], 1, {
    x: -.2
  }, {
    x: 0
  });
  tl.add([alpha, wirePos, platePos], "-=0", "normal", .3);
  tl.paused(true);
  return tl;
};



},{"./global.coffee":28}],28:[function(require,module,exports){
var SegLength, Utils, pathAnimation;

Utils = require('../../../utils/common.coffee');

SegLength = 3;

module.exports.applyInitialStates = function(components) {
  module.exports.hotspotAnimation(components).pause().kill();
  module.exports.contentHotspotAnimation(components).pause().kill();
  return module.exports.contentAnimation(components).pause().kill();
};

module.exports.defineTimelineComponents = function($t, $path, $content, $chs) {
  return {
    hotspot: {
      yellowStroke: $t.find("g.yellow-stroke circle"),
      whiteStroke: $t.find("g.white-stroke circle"),
      plus: $t.find("g.number g"),
      orangeCircle: $t.find("g.orange-circle circle"),
      hoverStroke: $t.find("g.hover-stroke circle")
    },
    contentHotspot: {
      grayStroke: $chs.find("g.gray-stroke circle"),
      plus: $chs.find("g.plus-sign g"),
      grayCircle: $chs.find("g.gray-circle circle")
    },
    path: $path,
    content: $content
  };
};

module.exports.hotspotAnimation = function(components) {
  var circle, fadeWhiteStroke, hover, plus, strokes, tl;
  tl = new TimelineMax;
  strokes = TweenMax.staggerFromTo([components.hotspot.yellowStroke, components.hotspot.whiteStroke], 1, {
    drawSVG: "0%",
    rotation: "-360deg",
    transformOrigin: "50% 50%"
  }, {
    drawSVG: "100%",
    rotation: "0deg",
    transformOrigin: "50% 50%",
    ease: Cubic.easeInOut,
    overwrite: "preexisting"
  }, .15);
  plus = TweenMax.fromTo(components.hotspot.plus, .5, {
    rotation: "360deg",
    transformOrigin: "50% 50%",
    attr: {
      y: "0px"
    }
  }, {
    rotation: "0deg",
    transformOrigin: "50% 50%",
    overwrite: "preexisting",
    attr: {
      y: "-1px"
    }
  });
  circle = TweenMax.fromTo(components.hotspot.orangeCircle, .5, {
    fill: "#FF6C00",
    stroke: "#F4CE21",
    strokeWidth: 6,
    attr: {
      r: 12
    }
  }, {
    strokeWidth: 4,
    attr: {
      r: 10
    },
    fill: "#ffffff",
    overwrite: "preexisting"
  });
  hover = TweenMax.fromTo(components.hotspot.hoverStroke, .5, {
    opacity: 0
  }, {
    opacity: 0
  });
  fadeWhiteStroke = TweenMax.to(components.hotspot.whiteStroke, 1, {
    drawSVG: "0%",
    rotation: "-360deg",
    transformOrigin: "50% 50%",
    ease: Cubic.easeInOut
  });
  tl.add([strokes, plus, circle, hover]);
  tl.add([fadeWhiteStroke], "+=.5");
  return tl;
};

pathAnimation = function(p) {
  var d, dashArray, dashValue, distance, finalDash, path, segmentsNeeded, segmentsTotal;
  path = $(p);
  d = path.attr('d');
  if (!$('html').hasClass('ie')) {
    d = d.split("M").join("").split("L").join(",").split(",");
  } else {
    d = d.split("M ").join("").split(" L ").join(" ");
    d = d.split(" ");
  }
  distance = Math.floor(Utils.distance(d[0], d[1], d[2], d[3]));
  segmentsTotal = Math.ceil(distance / SegLength) - 4;
  segmentsNeeded = Math.ceil(segmentsTotal * this.progress());
  dashArray = [];
  while (segmentsNeeded > 0) {
    dashArray.push(SegLength);
    dashArray.push(SegLength);
    segmentsNeeded--;
  }
  finalDash = dashArray.length === 0 ? 0 : SegLength;
  dashArray.push(finalDash, distance);
  dashValue = dashArray.toString();
  return TweenMax.set(path, {
    strokeDasharray: dashValue
  });
};

module.exports.pathAnimation = function(components, index) {
  var pathAlpha, pathStroke, tl;
  tl = new TimelineMax;
  pathAlpha = TweenMax.fromTo(components.path[index], .7, {
    opacity: 0
  }, {
    opacity: 1
  });
  pathStroke = TweenMax.fromTo(components.path[index], .7, {}, {
    ease: Cubic.easeOut,
    onUpdate: function() {
      var p, _i, _len, _ref, _results;
      if (index != null) {
        return pathAnimation.call(this, components.path[index]);
      } else {
        _ref = components.path;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push(pathAnimation.call(this, p));
        }
        return _results;
      }
    }
  });
  tl.add([pathAlpha, pathStroke]);
  return tl;
};

module.exports.contentHotspotAnimation = function(components) {
  var chsCircle, chsPlus, chsStrokes, makeMinus, minusColor, tl;
  tl = new TimelineMax;
  chsStrokes = TweenMax.staggerFromTo([components.contentHotspot.grayStroke], 1, {
    drawSVG: "0% 25%",
    rotation: "-360deg",
    transformOrigin: "50% 50%",
    immediateRender: true
  }, {
    drawSVG: "100%",
    rotation: "0deg",
    transformOrigin: "50% 50%",
    ease: Cubic.easeInOut
  }, .15);
  chsPlus = TweenMax.fromTo(components.contentHotspot.plus, .5, {
    rotation: "0deg",
    transformOrigin: "50% 50%"
  }, {
    rotation: "180deg",
    transformOrigin: "50% 50%"
  });
  makeMinus = TweenMax.fromTo(components.contentHotspot.plus.find(".v"), .5, {
    opacity: 1
  }, {
    opacity: 0
  });
  minusColor = TweenMax.fromTo(components.contentHotspot.plus.find(".h"), .5, {
    fill: "#2c2c2c"
  }, {
    fill: "#f4ce21"
  });
  chsCircle = TweenMax.fromTo(components.contentHotspot.grayCircle, .5, {
    stroke: "#2c2c2c",
    opacity: 1
  }, {
    stroke: "#f4ce21",
    opacity: .5
  });
  tl.add([chsStrokes, chsPlus, makeMinus, minusColor, chsCircle]);
  return tl;
};

module.exports.contentAnimation = function(components) {
  var body, list, listItems, splitBody, title, tl;
  tl = new TimelineMax;
  title = TweenMax.fromTo(components.content.find('em'), .5, {
    color: "#262626",
    opacity: .8,
    immediateRender: true
  }, {
    color: "#ff6c00",
    opacity: 1
  });
  splitBody = new SplitText(components.content.find("p > span"), {
    type: "chars,words"
  });
  body = TweenMax.staggerFromTo(splitBody.chars, 1, {
    alpha: 0,
    immediateRender: true
  }, {
    alpha: 1
  }, .02);
  listItems = components.content.find("ul > li");
  if (listItems.length > 0) {
    list = TweenMax.staggerFromTo(listItems, .35, {
      alpha: 0,
      y: -10,
      immediateRender: true
    }, {
      y: 0,
      alpha: 1
    }, .15);
  }
  tl.add([title, body]);
  if (list) {
    tl.add(list, "-=.3");
  }
  return tl;
};

module.exports.toggleVisibility = function(components, toggle) {
  var c, k, _i, _len, _results, _results1;
  if ($.isPlainObject(components)) {
    _results = [];
    for (k in components) {
      c = components[k];
      if (c instanceof THREE.Mesh) {
        _results.push(c.visible = toggle);
      } else {
        _results.push(module.exports.toggleVisibility(c, toggle));
      }
    }
    return _results;
  } else if ($.isArray(components)) {
    _results1 = [];
    for (_i = 0, _len = components.length; _i < _len; _i++) {
      c = components[_i];
      if (c instanceof THREE.Mesh) {
        _results1.push(c.visible = toggle);
      } else {
        _results1.push(module.exports.toggleVisibility(c, toggle));
      }
    }
    return _results1;
  }
};



},{"../../../utils/common.coffee":8}],29:[function(require,module,exports){
module.exports.getAnimation = function(components) {
  var ring1Translate, ring2Translate, ringScale, ringWideRotation, ringWideScale, ringWideTranslate, tl;
  ringScale = TweenMax.staggerFromTo([components.ring0.scale, components.ring1.scale, components.ring2.scale], 1, {
    x: 0.1,
    z: 0.1,
    immediateRender: true
  }, {
    x: .7,
    z: .7,
    ease: Cubic.easeInOut
  }, .2);
  ring1Translate = TweenMax.fromTo([components.ring1.position], 1.5, {
    y: 0,
    immediateRender: true
  }, {
    y: 6,
    ease: Cubic.easeInOuteruc
  });
  ring2Translate = TweenMax.fromTo([components.ring2.position], 1.5, {
    y: 0,
    immediateRender: true
  }, {
    y: 12,
    ease: Cubic.easeInOut
  });
  ringWideScale = TweenMax.fromTo([components.ringWide.scale], 1.5, {
    x: 0.1,
    z: 0.1,
    immediateRender: true
  }, {
    x: .7,
    z: .7,
    ease: Cubic.easeInOut
  });
  ringWideTranslate = TweenMax.fromTo([components.ringWide.position], 1.5, {
    y: 15,
    immediateRender: true
  }, {
    y: 22,
    ease: Cubic.easeInOut
  });
  ringWideRotation = TweenMax.fromTo([components.ringWide.rotation], 3, {
    y: 0
  }, {
    y: THREE.Math.degToRad(360),
    repeat: -1,
    ease: Linear.easeNone
  });
  ringWideRotation.paused(true);
  tl = new TimelineMax({
    onReverseComplete: function() {
      return ringWideRotation.pause(0);
    }
  });
  tl.add([ringScale]);
  tl.add([ring1Translate, ring2Translate], 0, "normal", -0.2);
  tl.addCallback(function() {
    return ringWideRotation.play();
  });
  tl.add([ringWideScale, ringWideTranslate], "-=1.2");
  tl.paused(true);
  return tl;
};



},{}],30:[function(require,module,exports){
var geoSet, global, resetGeometry;

global = require('./global.coffee');

module.exports.applyInitialStates = function(components) {
  module.exports.hotspotAnimation(components).pause().kill();
  module.exports.secondaryHotspotAnimation(components).pause().kill();
  module.exports.secondaryContentHotspotAnimation(components).pause().kill();
  module.exports.contentHotspotAnimation(components).pause().kill();
  return global.contentAnimation(components).pause().kill();
};

module.exports.defineTimelineComponents = function($t, $path, $content, $chs) {
  return {
    hotspot: {
      whiteStroke: $t.find("g.white-stroke circle"),
      plus: $t.find("g.number g"),
      orangeCircle: $t.find("g.orange-circle circle"),
      hoverStroke: $t.find('g.hover-stroke circle')
    },
    contentHotspot: {
      grayStroke: $chs.find("g.gray-stroke circle"),
      plus: $chs.find("g.plus-sign g"),
      grayCircle: $chs.find("g.gray-circle circle")
    },
    path: $path,
    content: $content
  };
};

module.exports.secondaryHotspotAnimation = function(components) {
  var circle, hover, plus, strokesDraw, tl;
  tl = new TimelineMax;
  strokesDraw = TweenMax.staggerFromTo([components.hotspot.whiteStroke[1], components.hotspot.whiteStroke[2]], 1, {
    drawSVG: "0%",
    rotation: "-360deg",
    transformOrigin: "50% 50%",
    opacity: 0
  }, {
    drawSVG: "100%",
    rotation: "0deg",
    transformOrigin: "50% 50%",
    ease: Cubic.easeInOut,
    opacity: 1,
    overwrite: "preexisting"
  }, .15);
  plus = TweenMax.fromTo([components.hotspot.plus[1], components.hotspot.plus[2]], .5, {
    rotation: "360deg",
    transformOrigin: "50% 50%",
    opacity: 0
  }, {
    rotation: "0deg",
    transformOrigin: "50% 50%",
    opacity: 0,
    overwrite: "preexisting"
  });
  circle = TweenMax.fromTo([components.hotspot.orangeCircle[1], components.hotspot.orangeCircle[2]], .5, {
    fill: "#ffffff",
    strokeWidth: 0,
    opacity: 0,
    attr: {
      r: 10
    }
  }, {
    fill: "#ffffff",
    strokeWidth: 0,
    opacity: 1,
    attr: {
      r: 6
    },
    overwrite: "preexisting"
  });
  hover = TweenMax.fromTo([components.hotspot.hoverStroke[1], components.hotspot.hoverStroke[2]], .5, {
    opacity: 0
  }, {
    opacity: 0
  });
  tl.add([plus, circle, strokesDraw, hover]);
  return tl;
};

module.exports.hotspotAnimation = function(components) {
  var circle, hover, plus, strokesDraw, tl;
  tl = new TimelineMax;
  strokesDraw = TweenMax.staggerFromTo([components.hotspot.whiteStroke[0]], 1, {
    drawSVG: "0%",
    rotation: "-360deg",
    transformOrigin: "50% 50%"
  }, {
    drawSVG: "100%",
    rotation: "0deg",
    transformOrigin: "50% 50%",
    ease: Cubic.easeInOut,
    overwrite: "preexisting"
  }, .15);
  plus = TweenMax.fromTo(components.hotspot.plus[0], .5, {
    rotation: "360deg",
    transformOrigin: "50% 50%",
    opacity: 1
  }, {
    rotation: "0deg",
    transformOrigin: "50% 50%",
    overwrite: "preexisting",
    opacity: 0
  });
  circle = TweenMax.fromTo(components.hotspot.orangeCircle[0], .5, {
    fill: "#FF6C00",
    strokeWidth: 6,
    stroke: "#F4CE21",
    attr: {
      r: 12
    }
  }, {
    fill: "#ffffff",
    strokeWidth: 0,
    attr: {
      r: 6
    },
    overwrite: "preexisting"
  });
  hover = TweenMax.fromTo(components.hotspot.hoverStroke[0], .5, {
    opacity: 0
  }, {
    opacity: 0
  });
  tl.add([plus, circle, strokesDraw, hover]);
  return tl;
};

module.exports.secondaryContentHotspotAnimation = function(components) {
  var chsCircle, chsPlus, chsStrokes, tl;
  tl = new TimelineMax;
  chsStrokes = TweenMax.fromTo([components.contentHotspot.grayStroke[1], components.contentHotspot.grayStroke[2]], .5, {
    drawSVG: "0%",
    immediateRender: true
  }, {
    drawSVG: "0%",
    ease: Cubic.easeInOut,
    overwrite: "preexisting"
  });
  chsPlus = TweenMax.fromTo([components.contentHotspot.plus[1], components.contentHotspot.plus[2]], .5, {
    rotation: "0deg",
    transformOrigin: "50% 50%",
    opacity: 0
  }, {
    rotation: "180deg",
    transformOrigin: "50% 50%",
    opacity: 0,
    overwrite: "preexisting"
  });
  chsCircle = TweenMax.fromTo([components.contentHotspot.grayCircle[1], components.contentHotspot.grayCircle[2]], .5, {
    strokeWidth: 0,
    opacity: 0,
    fill: "#ffffff",
    attr: {
      r: 1
    },
    overwrite: "preexisting"
  }, {
    opacity: 1,
    strokeWidth: 0,
    fill: "#ffffff",
    attr: {
      r: 6
    },
    ease: Back.easeOut,
    overwrite: "preexisting"
  });
  tl.add([chsStrokes, chsPlus, chsCircle]);
  return tl;
};

module.exports.contentHotspotAnimation = function(components) {
  var chsCircle, chsPlus, chsStrokes, tl;
  tl = new TimelineMax;
  chsStrokes = TweenMax.fromTo([components.contentHotspot.grayStroke[0]], .5, {
    drawSVG: "0% 25%",
    rotation: "-360deg",
    transformOrigin: "50% 50%",
    immediateRender: true
  }, {
    drawSVG: "0%",
    rotation: "0deg",
    transformOrigin: "50% 50%",
    ease: Cubic.easeInOut,
    overwrite: "preexisting"
  });
  chsPlus = TweenMax.fromTo(components.contentHotspot.plus[0], .5, {
    rotation: "0deg",
    transformOrigin: "50% 50%",
    opacity: 1
  }, {
    rotation: "180deg",
    transformOrigin: "50% 50%",
    opacity: 0,
    overwrite: "preexisting"
  });
  chsCircle = TweenMax.fromTo(components.contentHotspot.grayCircle[0], .5, {
    strokeWidth: 4,
    fill: "transparent",
    attr: {
      r: 10
    }
  }, {
    strokeWidth: 0,
    fill: "#ffffff",
    attr: {
      r: 6
    },
    ease: Back.easeInOut,
    overwrite: "preexisting"
  });
  tl.add([chsStrokes, chsPlus, chsCircle]);
  return tl;
};

geoSet = false;

resetGeometry = function(components) {
  var ball, disc, i, line, mod, _i, _len, _ref;
  geoSet = true;
  mod = 0;
  _ref = components.discs;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    disc = _ref[i];
    disc.geometry.center();
    disc.geometry.verticesNeedUpdate = true;
    disc.position.y = 17.5;
    disc.position.z = -1 - (-.25 * mod);
    line = components.discLines[i];
    line.geometry.center();
    line.geometry.verticesNeedUpdate = true;
    line.position.y = 17.5;
    line.position.z = -1 - (-.25 * mod);
    mod++;
  }
  ball = components.ball;
  ball.geometry.center();
  ball.geometry.verticesNeedUpdate = true;
  ball.position.y = 17.5;
  ball.position.z = -11;
  ball.material.opacity = 0;
  return global.toggleVisibility(components, false);
};

module.exports.getAnimation = function(components) {
  var ball, disc, discAlpha, discScale, dropTl, i, line, lineAlpha, lineScale, percent, scales, tl, _i, _len, _ref;
  if (!geoSet) {
    resetGeometry(components);
  }
  discScale = [];
  discAlpha = [];
  lineAlpha = [];
  lineScale = [];
  scales = [.2, .6, 1];
  dropTl = new TimelineMax;
  ball = components.ball;

  /*ballDropIn = TweenMax.fromTo [ball.position , ball.material]  , 1 ,
      z:-25
      opacity:0
      immediateRender:true
  ,
      z:-4.9
      opacity:0
      ease:Expo.easeIn
  
  
  ballFloatUp = TweenMax.fromTo [ball.position, ball.material] , 1.5 ,
      z:-4.9
      opacity:1
  ,
      z:-25
      opacity:0
      ease:Expo.easeOut
  
  
  
  dropTl.add ballDropIn
  dropTl.add ballFloatUp
  
  
  
  ballSpin = TweenMax.fromTo ball.rotation , 2 ,
      x:0
  ,
      x:THREE.Math.degToRad(-360)
  
      repeat:-1
      ease:Linear.easeNone
  
  ballSpin.paused(true)
   */
  _ref = components.discs;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    disc = _ref[i];
    line = components.discLines[i];
    percent = i / 3;
    discAlpha[i] = TweenMax.fromTo([disc.material], .5, {
      opacity: 0
    }, {
      opacity: .6 * (1 - percent),
      delay: i * .2,
      overwrite: "preexisting"
    });
    lineAlpha[i] = TweenMax.fromTo([line.material], .5, {
      opacity: 0
    }, {
      opacity: .8 * (1 - percent),
      delay: i * .2,
      overwrite: "preexisting"
    });
    discScale[i] = TweenMax.fromTo([disc.scale], .5, {
      x: 0.1,
      y: 0.1
    }, {
      x: scales[i],
      y: scales[i],
      delay: i * .2,
      overwrite: "preexisting"
    });
    lineScale[i] = TweenMax.fromTo([line.scale], .5, {
      x: .1,
      y: .1
    }, {
      x: scales[i] - .025,
      y: scales[i] - .025,
      delay: i * .2,
      overwrite: "preexisting"
    });
  }
  tl = new TimelineMax({
    onReverseComplete: function() {
      return global.toggleVisibility(components, false);
    },
    onStart: function() {
      return global.toggleVisibility(components, true);
    }
  });
  tl.add([discScale, discAlpha, lineAlpha, lineScale]);
  tl.paused(true);
  return tl;
};



},{"./global.coffee":28}],31:[function(require,module,exports){
var geoSet, global, resetGeometry;

global = require('./global.coffee');

geoSet = false;

resetGeometry = function(components) {
  geoSet = true;
  components.helix.geometry.center();
  components.helix.geometry.verticesNeedUpdate = true;
  components.helix.position.set(.5, 17.9, 10);
  components.stalk.geometry.center();
  components.stalk.geometry.verticesNeedUpdate = true;
  components.stalk.position.set(.5, 17.9, 10);
  return global.toggleVisibility(components, false);
};

module.exports.getAnimation = function(components) {
  var helixMat, helixPos, helixRotation, stalkMat, stalkPos, tl;
  if (!geoSet) {
    resetGeometry(components);
  }
  return new TimelineMax();
  stalkMat = TweenMax.fromTo(components.stalk.material, .5, {
    opacity: 0
  }, {
    opacity: 1
  });
  stalkPos = TweenMax.fromTo(components.stalk.position, 1, {
    z: 5
  }, {
    z: 10,
    ease: Cubic.easeOut
  });
  helixPos = TweenMax.fromTo(components.helix.position, 1, {
    z: 5
  }, {
    z: 10,
    ease: Cubic.easeOut
  });
  helixMat = TweenMax.fromTo(components.helix.material, .5, {
    opacity: 0
  }, {
    opacity: 1
  });
  helixRotation = TweenMax.fromTo([components.helix.rotation], 2, {
    z: 0
  }, {
    z: THREE.Math.degToRad(360),
    repeat: -1,
    ease: Linear.easeNone
  });
  helixRotation.paused(true);
  tl = new TimelineMax({
    onReverseComplete: function() {
      global.toggleVisibility(components, false);
      return helixRotation.pause();
    },
    onStart: function() {
      global.toggleVisibility(components, true);
      return helixRotation.play();
    }
  });
  tl.add([stalkMat, stalkPos]);
  tl.add([helixMat, helixPos], "-=.5");
  tl.paused(true);
  return tl;
};



},{"./global.coffee":28}],32:[function(require,module,exports){
var RotationControls,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RotationControls = (function(_super) {
  __extends(RotationControls, _super);

  function RotationControls(el) {
    this.handlePan = __bind(this.handlePan, this);
    _.extend(this, Backbone.Events);
    this.el = el;
    this.addEvents();
  }

  RotationControls.prototype.addEvents = function() {
    var touchOpts;
    touchOpts = {
      threshold: 100,
      pointers: 2
    };
    this.controlPlane = new Hammer(this.el, touchOpts);
    return this.controlPlane.on('pan panstart panleft panright panup pandown panend', this.handlePan);
  };

  RotationControls.prototype.handlePan = function(e) {
    var data;
    e.srcEvent.preventDefault();
    data = {
      velX: e.velocityX,
      velY: e.velocityY,
      type: e.type
    };
    return this.trigger("pan", data);
  };

  return RotationControls;

})(Backbone.Events);

module.exports = RotationControls;



},{}],33:[function(require,module,exports){
var Animations, AppModel, HotspotView, Templates, Tracking, Utils, ViewBase,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewBase = require('../../abstract/ViewBase.coffee');

Utils = require('../../../utils/common.coffee');

Tracking = require('../../../utils/track.coffee');

Animations = require('./../imports/animations.coffee');

Templates = require('../imports/templates.coffee');

AppModel = require('../../../models/AppModel.coffee');

HotspotView = (function(_super) {
  __extends(HotspotView, _super);

  function HotspotView(opts) {
    this.updateHotspots = __bind(this.updateHotspots, this);
    this.initHotspots = __bind(this.initHotspots, this);
    this.resize = __bind(this.resize, this);
    this.handleHotspot = __bind(this.handleHotspot, this);
    this.onRacketTransitionComplete = __bind(this.onRacketTransitionComplete, this);
    this.hsTemplate = require('../../../../../templates/specs/hotspots/hotspot.svg.jade');
    this.chsTemplate = require('../../../../../templates/specs/hotspots/content.hotspot.svg.jade');
    this.hotspotData = {};
    HotspotView.__super__.constructor.call(this, opts);
  }

  HotspotView.prototype.initialize = function(opts) {
    HotspotView.__super__.initialize.call(this);
    this.appModel = AppModel.getInstance();
    this.hotspotContainerOver = this.$el.find(".svg-container-over svg");
    this.hotspotContainerUnder = this.$el.find(".svg-container-under svg");
    this.contentContainer = this.$el.find(".hotspot-content-container");
    this.headerOffset = $("#specs-content").height();
    return this.delegateEvents(this.generateEvents());
  };

  HotspotView.prototype.hotspotReset = function() {
    var data, tl, tweens;
    if (this.currentHotspot != null) {
      data = this.hotspotData[this.currentHotspot];
      tl = new TimelineMax({
        overwrite: 'preexisting'
      });
      tweens = [];
      switch (this.currentHotspot) {
        case "parallel-drilling":
          tweens = [Animations['default'].pathAnimation(data.components, 0), Animations['default'].pathAnimation(data.components, 1), Animations['default'].pathAnimation(data.components, 2), Animations[this.currentHotspot].contentHotspotAnimation(data.components), Animations[this.currentHotspot].secondaryContentHotspotAnimation(data.components), Animations['default'].contentAnimation(data.components), Animations[this.currentHotspot].secondaryHotspotAnimation(data.components), Animations[this.currentHotspot].hotspotAnimation(data.components)];
          break;
        default:
          tweens = [Animations['default'].pathAnimation(data.components, 0), Animations['default'].contentHotspotAnimation(data.components), Animations['default'].contentAnimation(data.components), Animations['default'].hotspotAnimation(data.components)];
      }
      tl.add(tweens);
      tl.timeScale(3);
      tl.progress(1);
      tl.reverse();
      return this.currentHotspot = null;
    }
  };

  HotspotView.prototype.onRacketTransitionComplete = function() {
    var data, id, tl;
    id = this.currentHotspot;
    data = this.hotspotData[id];
    switch (this.currentHotspot) {
      case "parallel-drilling":
        this.undelegateEvents();
        tl = new TimelineMax({
          onComplete: (function(_this) {
            return function() {
              return _this.delegateEvents(_this.generateEvents());
            };
          })(this)
        });
        tl.add([Animations[id].secondaryHotspotAnimation(data.components)]);
        tl.add([Animations['default'].pathAnimation(data.components, 1), Animations['default'].pathAnimation(data.components, 2)], "-=.5");
        tl.add([Animations[id].secondaryContentHotspotAnimation(data.components)], "-=.5");
        return tl.play();
    }
  };

  HotspotView.prototype.handleHotspot = function(e) {
    var $chs, $hs, $target, id;
    e.preventDefault();
    $target = $(e.target).closest("g.hotspot");
    if ($target.length < 1) {
      $target = $(e.target).closest("circle.clickable");
    }
    id = $target.data('id');
    $hs = $(".hotspot[data-id='" + id + "']").first();
    $chs = $(".content-hotspot[data-id='" + id + "']").first();
    switch (e.type) {
      case "mouseenter":
        return this.hotspotOver($hs, $chs);
      case "mouseleave":
        return this.hotspotOut($hs, $chs);
      case "click":
      case "touchend":
        this.hotspotOut($hs, $chs);
        return this.hotspotActivate($target);
    }
  };

  HotspotView.prototype.hotspotActivate = function(hs) {
    var data, id, tl;
    this.undelegateEvents();
    this.hotspotReset();
    this.currentHotspot = id = this.parseElementId(hs);
    data = this.hotspotData[id];
    tl = new TimelineMax({
      onComplete: (function(_this) {
        return function() {
          return _this.delegateEvents(_this.generateEvents());
        };
      })(this)
    });
    switch (id) {
      case "parallel-drilling":
        tl.add([Animations[id].hotspotAnimation(data.components)]);
        tl.add([Animations['default'].pathAnimation(data.components, 0)]);
        tl.add([Animations[id].contentHotspotAnimation(data.components), Animations['default'].contentAnimation(data.components)], "-=.5", "normal", .3);
        break;
      default:
        tl.add([Animations['default'].hotspotAnimation(data.components)]);
        tl.add([Animations['default'].pathAnimation(data.components, 0)]);
        tl.add([Animations['default'].contentHotspotAnimation(data.components), Animations['default'].contentAnimation(data.components)], "-=0", "normal", .3);
    }
    tl.play();
    this.scrollToContent(id);
    Tracking.gaTrack(data.tracking['ga-type'], data.tracking['ga-tag']);
    return this.trigger("hotspotClicked", this.hotspotData[id].transform);
  };

  HotspotView.prototype.scrollToContent = function(id) {
    var content, contentOffset, documentScrollTop, scrollTop, windowOffset;
    content = $(".hotspot-content[data-id='" + id + "']");
    contentOffset = content.offset().top;
    windowOffset = window.innerHeight - content.height() - 75;
    scrollTop = $(document).scrollTop();
    documentScrollTop = scrollTop + window.innerHeight;
    if (documentScrollTop - contentOffset < 175) {
      return TweenMax.to(window, 1, {
        scrollTo: {
          y: contentOffset - windowOffset
        },
        delay: .75,
        ease: Cubic.easeInOut
      });
    } else if (contentOffset < (scrollTop + 180)) {
      return TweenMax.to(window, 1, {
        scrollTo: {
          y: contentOffset - 175
        },
        delay: .75,
        ease: Cubic.easeInOut
      });
    }
  };

  HotspotView.prototype.hotspotOver = function(hs, chs) {
    var goWhite, graySpin, grayStroke, hoverStroke, orangeStroke, showHover, tlOver;
    orangeStroke = hs.find(".orange-circle circle");
    hoverStroke = hs.find(".hover-stroke circle");
    grayStroke = chs.find(".gray-stroke circle");
    goWhite = TweenMax.to([grayStroke], .4, {
      stroke: "#ffffff"
    });
    showHover = TweenMax.to(hoverStroke, .4, {
      opacity: 1
    });
    graySpin = TweenMax.to(grayStroke, 2, {
      rotation: "360deg",
      repeat: -1,
      ease: Linear.easeNone
    });
    graySpin.paused(true);
    tlOver = new TimelineMax({
      onStart: function() {
        return graySpin.play();
      }
    });
    return tlOver.add([goWhite, showHover]);
  };

  HotspotView.prototype.hotspotOut = function(hs, chs) {
    var goGray, grayStroke, hideHover, hoverStroke, orangeStroke, tlOut;
    tlOut = new TimelineMax;
    orangeStroke = hs.find(".orange-circle circle");
    hoverStroke = hs.find(".hover-stroke circle");
    grayStroke = chs.find(".gray-stroke circle");

    /*goOrange = TweenMax.to orangeStroke , .4 ,
        stroke:"#F4CE21"
     */
    hideHover = TweenMax.to(hoverStroke, .4, {
      opacity: 0
    });
    goGray = TweenMax.to([grayStroke], .4, {
      stroke: "#2c2c2c",
      rotation: "-360deg",
      overwrite: "preexisting"
    });
    tlOut = new TimelineMax;
    return tlOut.add([hideHover, goGray]);
  };

  HotspotView.prototype.generateEvents = function() {
    var events;
    events = {};
    $(window).resize(this.resize);
    events['click g.hotspot'] = "handleHotspot";
    events['click circle.clickable'] = "handleHotspot";
    if (!this.isTouch) {
      events['mouseenter g.hotspot'] = "handleHotspot";
      events['mouseleave g.hotspot'] = "handleHotspot";
      events['mouseenter circle.clickable'] = "handleHotspot";
      events['mouseleave circle.clickable'] = "handleHotspot";
    } else {
      events['touchend g.hotspot'] = "handleHotspot";
      events['touchend circle.clickable'] = "handleHotspot";
    }
    return events;
  };

  HotspotView.prototype.drawContentBox = function(box) {
    if (this.contentRect == null) {
      this.contentRect = $("<div/>");
      this.contentRect.addClass('contentRect');
      this.contentContainer.append(this.contentRect);
    }
    return TweenMax.set(this.contentRect, {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height
    });
  };

  HotspotView.prototype.setContentPositions = function() {
    var data, k, _ref, _results;
    _ref = this.hotspotData;
    _results = [];
    for (k in _ref) {
      data = _ref[k];
      if (data.content.standard.top != null) {
        data.content.top = data.content.standard.top + this.headerOffset;
      }
      if (data.content.standard.left != null) {
        data.content.left = data.content.standard.left;
      }
      if (data.content.standard.right != null) {
        data.content.right = data.content.standard.right;
      }
      if (data.content.standard.center != null) {
        data.content.center = data.content.standard.center;
      }
      if (window.innerWidth <= 800) {
        if (data.content.small != null) {
          if (data.content.small.top != null) {
            data.content.top = data.content.small.top + this.headerOffset;
          }
          if (data.content.small.left != null) {
            data.content.left = data.content.small.left;
          }
          if (data.content.small.right != null) {
            data.content.right = data.content.small.right;
          }
          if (data.content.small.center != null) {
            _results.push(data.content.center = data.content.small.center);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  HotspotView.prototype.resize = function(e) {
    var anchorCoords, anchorLeft, circle, contentBox, contentEl, cx, data, k, _ref;
    this.setContentPositions();
    contentBox = {
      x: this.hotspotContainerOver.width() * .5 - Utils.getMaxWidth() * .5,
      y: 0,
      width: Utils.getMaxWidth(),
      height: this.hotspotContainerOver.height()
    };
    _ref = this.hotspotData;
    for (k in _ref) {
      data = _ref[k];
      contentEl = this.contentContainer.find("#" + data.content.id);
      circle = this.hotspotContainerOver.find("#interactive-" + k);
      anchorLeft = contentEl.find('.anchor').css('left');
      anchorLeft = parseInt(anchorLeft.substr(0, anchorLeft.length - 2));
      if (data.content.right != null) {
        cx = contentBox.width - ((contentEl.width()) + data.content.right);
      } else if (data.content.left != null) {
        cx = data.content.left - anchorLeft;
      } else if (data.content.center != null) {
        if (anchorLeft > 0) {
          anchorLeft = 0;
        }
        cx = (contentBox.width * .5) + (data.content.center - anchorLeft);
      }
      anchorCoords = this.getAnchorPosition(contentEl);
      TweenMax.set(contentEl, {
        x: contentBox.x + cx,
        y: contentBox.y + data.content.top
      });
      TweenMax.set(circle, {
        x: anchorCoords.x,
        y: anchorCoords.y
      });
    }
    return $(".racket-specs-content svg").each((function(_this) {
      return function(i, t) {
        return t.setAttribute("viewBox", "0 0 " + window.innerWidth + " " + (_this.hotspotContainerOver.height()));
      };
    })(this));
  };

  HotspotView.prototype.initHotspots = function() {
    var geomId, i, k, spot, _ref;
    _ref = this.model;
    for (k in _ref) {
      geomId = _ref[k];
      for (i in geomId) {
        spot = geomId[i];
        spot.transform.id = spot.id;
        this.hotspotData[spot.id] = {
          transform: spot.transform,
          content: spot.content,
          order: spot.order,
          tracking: spot.tracking
        };
      }
    }
    this.resize();
    this.createContentPaths();
    this.createHotspots();
    this.createContentHotspots();
    return this.createTimelines();
  };

  HotspotView.prototype.createHotspots = function() {
    var data, hs, i, id, _ref, _results;
    hs = [];
    _ref = this.hotspotData;
    _results = [];
    for (id in _ref) {
      data = _ref[id];
      switch (id) {
        case "parallel-drilling":
          _results.push((function() {
            var _i, _results1;
            _results1 = [];
            for (i = _i = 0; _i <= 2; i = ++_i) {
              _results1.push(this.hotspotContainerOver[0].appendChild(Templates.hotspots[id](id, i, data.order)));
            }
            return _results1;
          }).call(this));
          break;
        default:
          _results.push(this.hotspotContainerOver[0].appendChild(Templates.hotspots["default"](id, data.order)));
      }
    }
    return _results;
  };

  HotspotView.prototype.createContentHotspots = function() {
    var $chs, $content, anchorCoords, ch, circle, data, i, id, offset, _i, _j, _len, _ref, _results;
    _ref = this.hotspotData;
    _results = [];
    for (id in _ref) {
      data = _ref[id];
      $content = this.contentContainer.find("#" + data.content.id);
      anchorCoords = this.getAnchorPosition($content);
      switch (id) {
        case "parallel-drilling":
          for (i = _i = 0; _i <= 2; i = ++_i) {
            this.hotspotContainerUnder[0].appendChild(Templates.contentHotspots['default'](id, i));
          }
          break;
        default:
          this.hotspotContainerUnder[0].appendChild(Templates.contentHotspots["default"](id));
      }
      $chs = this.hotspotContainerUnder.find(".content-hotspot[data-id='" + id + "']");
      circle = document.createElementNS(Utils.svgns, "circle");
      circle.setAttribute('r', "24px");
      circle.setAttribute('fill', "transparent");
      circle.setAttribute('class', "clickable");
      circle.setAttribute('id', "interactive-" + id);
      circle.setAttribute('data-id', id);
      this.hotspotContainerOver[0].appendChild(circle);
      for (i = _j = 0, _len = $chs.length; _j < _len; i = ++_j) {
        ch = $chs[i];
        offset = 0;
        if (i > 0) {
          offset = i % 2 ? -50 : 50;
        }
        TweenMax.set([ch], {
          x: anchorCoords.x + offset,
          y: anchorCoords.y
        });
      }
      _results.push(TweenMax.set([circle], {
        x: anchorCoords.x,
        y: anchorCoords.y
      }));
    }
    return _results;
  };

  HotspotView.prototype.createTimelines = function() {
    var $chs, $content, $hs, $path, data, id, _ref, _results;
    _ref = this.hotspotData;
    _results = [];
    for (id in _ref) {
      data = _ref[id];
      $hs = this.hotspotContainerOver.find(".hotspot[data-id='" + id + "']");
      $chs = this.hotspotContainerUnder.find(".content-hotspot[data-id='" + id + "']");
      $content = this.contentContainer.find("#" + data.content.id);
      switch (id) {
        case "parallel-drilling":
          $path = this.hotspotContainerOver.find("#path-" + id + "-0 , #path-" + id + "-1 , #path-" + id + "-2");
          this.hotspotData[id].components = Animations[id].defineTimelineComponents($hs, $path, $content, $chs);
          Animations[id].applyInitialStates(this.hotspotData[id].components);
          break;
        default:
          $path = this.hotspotContainerOver.find("#path-" + id);
          this.hotspotData[id].components = Animations['default'].defineTimelineComponents($hs, $path, $content, $chs);
          Animations['default'].applyInitialStates(this.hotspotData[id].components);
      }
      _results.push(this.hotspotData[id].pathComplete = false);
    }
    return _results;
  };

  HotspotView.prototype.createContentPaths = function() {
    var i, id, path, _results;
    _results = [];
    for (id in this.hotspotData) {
      switch (id) {
        case "parallel-drilling":
          _results.push((function() {
            var _i, _results1;
            _results1 = [];
            for (i = _i = 0; _i <= 2; i = ++_i) {
              path = document.createElementNS(Utils.svgns, "path");
              path.setAttribute("id", "path-" + id + "-" + i);
              path.setAttribute("class", "hotspot-path white");
              _results1.push(this.hotspotContainerOver[0].appendChild(path));
            }
            return _results1;
          }).call(this));
          break;
        default:
          path = document.createElementNS(Utils.svgns, "path");
          path.setAttribute("id", "path-" + id);
          path.setAttribute("class", "hotspot-path");
          _results.push(this.hotspotContainerOver[0].appendChild(path));
      }
    }
    return _results;
  };

  HotspotView.prototype.updateHotspots = function(spots, user) {
    var $content, $hotspot, $hotspot2, $path, alpha, contentCoords, d, data, hs, i, id, offset, p, path, sp, sp2, spot, _i, _len, _results;
    if (user) {
      this.hotspotReset();
    }
    _results = [];
    for (id in spots) {
      spot = spots[id];
      data = this.hotspotData[id];
      $content = this.contentContainer.find("#" + this.hotspotData[id].content.id);
      $hotspot = this.hotspotContainerOver.find(".hotspot[data-id='" + id + "']");
      $hotspot2 = this.hotspotContainerUnder.find(".content-hotspot[data-id='" + id + "']");
      switch (id) {
        case "parallel-drilling":
          $path = this.hotspotContainerOver.find("#path-" + id + "-0 , #path-" + id + "-1 , #path-" + id + "-2");
          break;
        default:
          $path = this.hotspotContainerOver.find("#path-" + id);
      }
      spot.x = Math.floor(spot.x);
      spot.y = Math.floor(spot.y);
      alpha = ((spot.z + 14) / 69) + .75;
      contentCoords = this.getAnchorPosition($content);
      for (i = _i = 0, _len = $hotspot.length; _i < _len; i = ++_i) {
        hs = $hotspot[i];
        sp = $(hs);
        sp2 = $hotspot2[i];
        offset = 0;
        if (i > 0) {
          offset = i % 2 ? -50 : 50;
        }
        TweenMax.to(sp, .1, {
          x: spot.x + offset,
          y: spot.y,
          opacity: alpha
        });
        TweenMax.to(sp2, .1, {
          x: contentCoords.x + offset,
          y: contentCoords.y
        });
        if ($("html").hasClass("safari")) {
          hs.style.display = 'none';
          hs.offsetHeight;
          hs.style.display = '';
        }
      }
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (i = _j = 0, _len1 = $path.length; _j < _len1; i = ++_j) {
          p = $path[i];
          path = $(p);
          offset = 0;
          if (i > 0) {
            offset = i % 2 ? -50 : 50;
          }
          d = "M" + (spot.x + offset) + "," + spot.y + "L" + (contentCoords.x + offset) + "," + contentCoords.y;
          _results1.push(path.attr('d', d));
        }
        return _results1;
      })());
    }
    return _results;
  };

  HotspotView.prototype.parseElementId = function($hs) {

    /*
    idArray = $hs.attr('id').split("-")
    idArray.shift()
    id = idArray.join("-")
     */
    var id;
    id = $hs.data('id');
    return id;
  };

  HotspotView.prototype.getAnchorPosition = function($content) {
    var cAnchor, contentCoords, matrix;
    matrix = Utils.matrixToArray($content.css("transform"));
    cAnchor = $content.find(".anchor");
    contentCoords = {
      x: parseInt(matrix[4]) + parseInt(cAnchor.css('left')),
      y: parseInt(matrix[5]) + parseInt(cAnchor.css('top'))
    };
    return contentCoords;
  };

  return HotspotView;

})(ViewBase);

module.exports = HotspotView;



},{"../../../../../templates/specs/hotspots/content.hotspot.svg.jade":43,"../../../../../templates/specs/hotspots/hotspot.svg.jade":44,"../../../models/AppModel.coffee":4,"../../../utils/common.coffee":8,"../../../utils/track.coffee":10,"../../abstract/ViewBase.coffee":18,"../imports/templates.coffee":35,"./../imports/animations.coffee":34}],34:[function(require,module,exports){
module.exports = {
  "default": require('../animations/global.coffee'),
  "x2-shaft": require('../animations/handle.coffee'),
  "parallel-drilling": require('../animations/parallel-drilling.coffee'),
  "spin-effect": require('../animations/spin-effect.coffee'),
  "carbon-fiber": require('../animations/carbon-fiber.coffee')
};



},{"../animations/carbon-fiber.coffee":27,"../animations/global.coffee":28,"../animations/handle.coffee":29,"../animations/parallel-drilling.coffee":30,"../animations/spin-effect.coffee":31}],35:[function(require,module,exports){
module.exports.hotspots = require('./templates/hotspots.coffee').hotspots;

module.exports.contentHotspots = require('./templates/hotspots.coffee').contentHotspots;



},{"./templates/hotspots.coffee":36}],36:[function(require,module,exports){
var Utils, getHoverStroke, getNumber, getOrangeCircle, getPlus, getWhiteStroke, getYellowStroke;

Utils = require('../../../../utils/common.coffee');

getNumber = function(num) {
  var numG, numHeight, numInnerG, numText;
  numHeight = "2px";
  if ($('html').hasClass("ie") || $('html').hasClass("firefox")) {
    numHeight = "6px";
  }
  numG = document.createElementNS(Utils.svgns, 'g');
  numG.setAttribute('class', 'number');
  numInnerG = document.createElementNS(Utils.svgns, 'g');
  numText = document.createElementNS(Utils.svgns, 'text');
  numText.setAttribute('fill', "#ffffff");
  numText.setAttribute('y', numHeight);
  numText.setAttribute('x', "0px");
  numText.setAttribute('text-anchor', "middle");
  numText.setAttribute('alignment-baseline', "middle");
  numText.textContent = num;
  numInnerG.appendChild(numText);
  numG.appendChild(numInnerG);
  return numG;
};

getPlus = function(color) {
  var hx, hy, plusRectH, plusRectV, plusSignG, plusSignInnerG, vx, vy;
  if (color == null) {
    color = "#ffffff";
  }
  vx = vy = hx = hy = "0px";
  if ($('html').hasClass('ie')) {
    vy = "-3px";
    vx = "-1px";
    hx = "-4px";
  }
  plusSignG = document.createElementNS(Utils.svgns, 'g');
  plusSignG.setAttribute('class', 'plus-sign');
  plusSignInnerG = document.createElementNS(Utils.svgns, 'g');
  plusRectV = document.createElementNS(Utils.svgns, 'rect');
  plusRectV.setAttribute('class', "v");
  plusRectV.setAttribute('width', "2px");
  plusRectV.setAttribute('height', "8px");
  plusRectV.setAttribute('x', vx);
  plusRectV.setAttribute('y', vy);
  plusRectV.setAttribute('fill', color);
  plusRectH = document.createElementNS(Utils.svgns, 'rect');
  plusRectH.setAttribute('class', "h");
  plusRectH.setAttribute('width', "8px");
  plusRectH.setAttribute('height', "2px");
  plusRectH.setAttribute('x', hx);
  plusRectH.setAttribute('y', hy);
  plusRectH.setAttribute('fill', color);
  plusSignInnerG.appendChild(plusRectV);
  plusSignInnerG.appendChild(plusRectH);
  plusSignG.appendChild(plusSignInnerG);
  return plusSignG;
};

getOrangeCircle = function() {
  var orangeCircle, orangeCircleG;
  orangeCircleG = document.createElementNS(Utils.svgns, 'g');
  orangeCircleG.setAttribute('class', 'orange-circle');
  orangeCircle = document.createElementNS(Utils.svgns, 'circle');
  orangeCircle.setAttribute('stroke', '#F4CE21');
  orangeCircle.setAttribute('stroke-width', '6');
  orangeCircle.setAttribute('cx', '0');
  orangeCircle.setAttribute('cy', '0');
  orangeCircle.setAttribute('r', '12');
  orangeCircle.setAttribute('fill', '#FF6C00');
  orangeCircleG.appendChild(orangeCircle);
  return orangeCircleG;
};

getYellowStroke = function() {
  var yellowStrokeCircle, yellowStrokeG;
  yellowStrokeG = document.createElementNS(Utils.svgns, 'g');
  yellowStrokeG.setAttribute('class', 'yellow-stroke');
  yellowStrokeCircle = document.createElementNS(Utils.svgns, 'circle');
  yellowStrokeCircle.setAttribute('stroke', '#F4CE21');
  yellowStrokeCircle.setAttribute('stroke-width', '4');
  yellowStrokeCircle.setAttribute('cx', '0');
  yellowStrokeCircle.setAttribute('cy', '0');
  yellowStrokeCircle.setAttribute('r', '19');
  yellowStrokeCircle.setAttribute('fill', 'transparent');
  yellowStrokeG.appendChild(yellowStrokeCircle);
  return yellowStrokeG;
};

getWhiteStroke = function() {
  var whiteStrokeCircle, whiteStrokeG;
  whiteStrokeG = document.createElementNS(Utils.svgns, 'g');
  whiteStrokeG.setAttribute('class', 'white-stroke');
  whiteStrokeCircle = document.createElementNS(Utils.svgns, 'circle');
  whiteStrokeCircle.setAttribute('stroke', '#ffffff');
  whiteStrokeCircle.setAttribute('stroke-width', '10');
  whiteStrokeCircle.setAttribute('cx', '0');
  whiteStrokeCircle.setAttribute('cy', '0');
  whiteStrokeCircle.setAttribute('r', '32');
  whiteStrokeCircle.setAttribute('fill', 'transparent');
  whiteStrokeG.appendChild(whiteStrokeCircle);
  return whiteStrokeG;
};

getHoverStroke = function() {
  var hoverStrokeCircle, hoverStrokeG;
  hoverStrokeG = document.createElementNS(Utils.svgns, 'g');
  hoverStrokeG.setAttribute('class', 'hover-stroke');
  hoverStrokeCircle = document.createElementNS(Utils.svgns, 'circle');
  hoverStrokeCircle.setAttribute('stroke', '#ffffff');
  hoverStrokeCircle.setAttribute('stroke-width', '2');
  hoverStrokeCircle.setAttribute('cx', '0');
  hoverStrokeCircle.setAttribute('cy', '0');
  hoverStrokeCircle.setAttribute('r', '18');
  hoverStrokeCircle.setAttribute('fill', 'transparent');
  hoverStrokeG.appendChild(hoverStrokeCircle);
  return hoverStrokeG;
};

module.exports.hotspots = {};

module.exports.hotspots['default'] = function(id, order) {
  var hotspotG, hoverStroke, orangeCircleG, plusSignG, whiteStrokeG, yellowStrokeG;
  hotspotG = document.createElementNS(Utils.svgns, 'g');
  hotspotG.setAttribute('class', 'hotspot');
  hotspotG.setAttribute('id', "hotspot-" + id);
  hotspotG.setAttribute('data-id', id);
  orangeCircleG = getOrangeCircle();
  plusSignG = getNumber(order);
  yellowStrokeG = getYellowStroke();
  whiteStrokeG = getWhiteStroke();
  hoverStroke = getHoverStroke();
  hotspotG.appendChild(orangeCircleG);
  hotspotG.appendChild(plusSignG);
  hotspotG.appendChild(yellowStrokeG);
  hotspotG.appendChild(whiteStrokeG);
  hotspotG.appendChild(hoverStroke);
  return hotspotG;
};

module.exports.hotspots['parallel-drilling'] = function(id, index, order) {
  var hotspotG, hoverStroke, orangeCircleG, plusSignG, whiteStrokeCircle, whiteStrokeG;
  if (index == null) {
    index = "";
  }
  hotspotG = document.createElementNS(Utils.svgns, 'g');
  hotspotG.setAttribute('class', 'hotspot');
  hotspotG.setAttribute('id', "hotspot-" + id + index);
  hotspotG.setAttribute('data-id', id);
  orangeCircleG = getOrangeCircle();
  plusSignG = getNumber(order);
  hoverStroke = getHoverStroke();
  whiteStrokeG = document.createElementNS(Utils.svgns, 'g');
  whiteStrokeG.setAttribute('class', 'white-stroke');
  whiteStrokeCircle = document.createElementNS(Utils.svgns, 'circle');
  whiteStrokeCircle.setAttribute('stroke', '#ffffff');
  whiteStrokeCircle.setAttribute('stroke-width', '1px');
  whiteStrokeCircle.setAttribute('cx', '0');
  whiteStrokeCircle.setAttribute('cy', '0');
  whiteStrokeCircle.setAttribute('r', '12px');
  whiteStrokeCircle.setAttribute('fill', 'transparent');
  whiteStrokeG.appendChild(whiteStrokeCircle);
  hotspotG.appendChild(orangeCircleG);
  hotspotG.appendChild(plusSignG);
  hotspotG.appendChild(whiteStrokeG);
  hotspotG.appendChild(hoverStroke);
  return hotspotG;
};

module.exports.contentHotspots = {};

module.exports.contentHotspots['default'] = function(id, index) {
  var grayCircle, grayCircleG, grayStrokeCircle, grayStrokeG, hotspotG, plusSignG;
  if (index == null) {
    index = "";
  }
  hotspotG = document.createElementNS(Utils.svgns, 'g');
  hotspotG.setAttribute('class', 'content-hotspot');
  hotspotG.setAttribute('id', "hotspot2-" + id + index);
  hotspotG.setAttribute('data-id', id);
  grayCircleG = document.createElementNS(Utils.svgns, 'g');
  grayCircleG.setAttribute('class', 'gray-circle');
  grayCircle = document.createElementNS(Utils.svgns, 'circle');
  grayCircle.setAttribute('stroke', '#3c3c3c');
  grayCircle.setAttribute('stroke-width', '4');
  grayCircle.setAttribute('cx', '0');
  grayCircle.setAttribute('cy', '0');
  grayCircle.setAttribute('r', '10px');
  grayCircle.setAttribute('fill', 'transparent');
  grayCircleG.appendChild(grayCircle);
  plusSignG = getPlus("#2c2c2c");
  grayStrokeG = document.createElementNS(Utils.svgns, 'g');
  grayStrokeG.setAttribute('class', 'gray-stroke');
  grayStrokeCircle = document.createElementNS(Utils.svgns, 'circle');
  grayStrokeCircle.setAttribute('stroke', '#2c2c2c');
  grayStrokeCircle.setAttribute('stroke-width', '4px');
  grayStrokeCircle.setAttribute('cx', '0');
  grayStrokeCircle.setAttribute('cy', '0');
  grayStrokeCircle.setAttribute('r', '19px');
  grayStrokeCircle.setAttribute('fill', 'transparent');
  grayStrokeG.appendChild(grayStrokeCircle);
  hotspotG.appendChild(grayCircleG);
  hotspotG.appendChild(plusSignG);
  hotspotG.appendChild(grayStrokeG);
  return hotspotG;
};



},{"../../../../utils/common.coffee":8}],37:[function(require,module,exports){
var Animations, CompoundObject, RacketObject, Utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CompoundObject = require('./../abstract/CompoundObject.coffee');

Utils = require('../../../utils/common.coffee');

Animations = require('../imports/animations.coffee');

RacketObject = (function(_super) {
  __extends(RacketObject, _super);

  function RacketObject(opts) {
    this.groupLoaded = __bind(this.groupLoaded, this);
    this.geometryLoaded = __bind(this.geometryLoaded, this);
    this.envCube = opts.envCube;
    this.components = {};
    this.animations = {};
    RacketObject.__super__.constructor.call(this);
  }

  RacketObject.prototype.geometryLoaded = function(geom, mat) {
    return RacketObject.__super__.geometryLoaded.call(this, geom, mat);
  };

  RacketObject.prototype.applyShader = function(data, obj) {
    var alpha, bump, env, map, mat, norm, spec;
    env = this.envCube;
    if (data.env === false) {
      console.log("no ENV!");
      env = null;
    }
    if (data != null) {
      if (data.swap != null) {
        switch (data.swap) {
          case 'basic':
            env = null;
            mat = new THREE.MeshBasicMaterial();
        }
      } else {
        mat = new THREE.MeshPhongMaterial();
      }
      if (data.color != null) {
        mat.color = new THREE.Color(data.color);
      } else {
        mat.color = new THREE.Color(0xffffff);
      }
      if (data.emissive != null) {
        mat.emissive = new THREE.Color(data.emissive);
      }
      if (data.specular != null) {
        mat.specular = new THREE.Color(data.specular);
      }
      if (data.shininess != null) {
        mat.shininess = data.shininess;
      } else {
        mat.shininess = 0;
      }
      if (data.reflectivity != null) {
        mat.reflectivity = data.reflectivity;
      } else {
        mat.reflectivity = 0;
      }
      if (data.map != null) {
        map = THREE.ImageUtils.loadTexture(data.map);
        if (data.anisotropy != null) {
          map.anisotropy = data.anisotropy;
        }
        if (data.mapRepeat != null) {
          map.wrapS = map.wrapT = THREE.RepeatWrapping;
          map.repeat.set(data.mapRepeat[0], data.mapRepeat[1]);
        }
        mat.map = map;
      }
      if (data.specularMap != null) {
        spec = THREE.ImageUtils.loadTexture(data.specularMap);
        if (data.anisotropy != null) {
          spec.anisotropy = data.anisotropy;
        }
        if (data.mapRepeat != null) {
          spec.wrapS = spec.wrapT = THREE.RepeatWrapping;
          spec.repeat.set(data.mapRepeat[0], data.mapRepeat[1]);
        }
        mat.specularMap = spec;
      }
      if (data.alphaMap != null) {
        alpha = THREE.ImageUtils.loadTexture(data.alphaMap);
        if (data.anisotropy != null) {
          alpha.anisotropy = data.anisotropy;
        }
        if (data.mapRepeat != null) {
          alpha.wrapS = spec.wrapT = THREE.RepeatWrapping;
          alpha.repeat.set(data.mapRepeat[0], data.mapRepeat[1]);
        }
        mat.alphaMap = alpha;
      }
      if (data.normalMap != null) {
        norm = THREE.ImageUtils.loadTexture(data.normalMap);
        if (data.mapRepeat != null) {
          norm.wrapS = norm.wrapT = THREE.RepeatWrapping;
          norm.repeat.set(data.mapRepeat[0], data.mapRepeat[1]);
        }
        mat.normalMap = norm;
      }
      if (data.normalScale != null) {
        mat.normalScale = new THREE.Vector2(data.normalScale[0], data.normalScale[1]);
      } else {
        mat.normalScale = new THREE.Vector2(1, 1);
      }
      if (data.bumpMap != null) {
        bump = THREE.ImageUtils.loadTexture(data.bumpMap);
        if (data.mapRepeat != null) {
          bump.wrapS = norm.wrapT = THREE.RepeatWrapping;
          bump.repeat.set(data.mapRepeat[0], data.mapRepeat[1]);
        }
        mat.bumpMap = bump;
      }
      if (data.bumpScale != null) {
        mat.bumpScale = data.bumpScale;
      }
    }
    mat.envMap = env;
    mat.transparent = true;
    mat.ambient = mat.color;
    return mat;
  };

  RacketObject.prototype.applyMaterialProperties = function() {
    var data, k, obj, _ref, _results;
    _ref = this.objects;
    _results = [];
    for (k in _ref) {
      obj = _ref[k];
      data = obj._loaderData;
      obj.material = null;
      _results.push(obj.material = this.applyShader(data, obj));
    }
    return _results;
  };

  RacketObject.prototype.isHotspot = function(index, id) {
    var spot, spots, _i, _len;
    spots = hotspots[id];
    if (spots != null) {
      for (_i = 0, _len = spots.length; _i < _len; _i++) {
        spot = spots[_i];
        if (spot === index) {
          return true;
        }
      }
    }
    return false;
  };

  RacketObject.prototype.getHotspots = function(hotspots) {
    var mesh, s, spots, vert, verts, _i, _j, _len, _len1, _ref;
    verts = [];
    _ref = this.group.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mesh = _ref[_i];
      spots = hotspots[mesh.__id];
      if (spots != null) {
        mesh.updateMatrixWorld();
        for (_j = 0, _len1 = spots.length; _j < _len1; _j++) {
          s = spots[_j];
          vert = mesh.geometry.vertices[s.index].clone();
          vert.__id = s.id;
          vert.applyMatrix4(mesh.matrixWorld);
          verts.push(vert);
        }
      }
    }
    return verts;
  };

  RacketObject.prototype.groupLoaded = function() {
    this.objects['letter-w'].rotation.y = THREE.Math.degToRad(90);
    this.applyMaterialProperties();
    this.createAnimationComponents();
    this.createAnimations();
    return RacketObject.__super__.groupLoaded.call(this);
  };

  RacketObject.prototype.createAnimationComponents = function() {
    this.components['x2-shaft'] = {
      ring0: this.objects['ring-0'],
      ring1: this.objects['ring-1'],
      ring2: this.objects['ring-2'],
      ringWide: this.objects['ring-wide']
    };
    this.components['carbon-fiber'] = {
      wireframe: this.objects['wireframe-long'],
      plate: this.objects['plate-short']
    };
    this.components['spin-effect'] = {
      stalk: this.objects['stalk'],
      helix: this.objects['helix']
    };
    return this.components['parallel-drilling'] = {
      discs: [this.objects['disc-inner'], this.objects['disc-middle'], this.objects['disc-outer']],
      discLines: [this.objects['disc-line-1'], this.objects['disc-line-2'], this.objects['disc-line-3']],
      redLines: [this.objects['red-line-1'], this.objects['red-line-2'], this.objects['red-line-3']],
      ball: this.objects['tennis-ball']
    };
  };

  RacketObject.prototype.createAnimations = function() {
    this.animations['x2-shaft'] = Animations['x2-shaft'].getAnimation(this.components['x2-shaft']);
    this.animations['parallel-drilling'] = Animations['parallel-drilling'].getAnimation(this.components['parallel-drilling']);
    this.animations['spin-effect'] = Animations['spin-effect'].getAnimation(this.components['spin-effect']);
    return this.animations['carbon-fiber'] = Animations['carbon-fiber'].getAnimation(this.components['carbon-fiber']);
  };

  return RacketObject;

})(CompoundObject);

module.exports = RacketObject;



},{"../../../utils/common.coffee":8,"../imports/animations.coffee":34,"./../abstract/CompoundObject.coffee":26}],38:[function(require,module,exports){
var RacketCamera,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RacketCamera = (function(_super) {
  __extends(RacketCamera, _super);

  function RacketCamera() {
    console.log(arguments);
    RacketCamera.__super__.constructor.call(this, arguments);
  }

  return RacketCamera;

})(THREE.PerspectiveCamera);

module.exports = RacketCamera;



},{}],39:[function(require,module,exports){
var AppModel, DefaultFOV, RacketObject, RacketScene, Utils,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Utils = require('../../../utils/common.coffee');

RacketObject = require('./../objects/RacketObject.coffee');

AppModel = require('./../../../models/AppModel.coffee');

DefaultFOV = 70;

RacketScene = (function() {
  function RacketScene(width, height, model, el) {
    this.renderOperation = __bind(this.renderOperation, this);
    this.racketLoaded = __bind(this.racketLoaded, this);
    this.add = __bind(this.add, this);
    _.extend(this, Backbone.Events);
    this.appModel = AppModel.getInstance();
    this.el = el;
    this.model = model;
    this.scene = new THREE.Scene();
    this.scene.position.y = -8;
    this.fov = DefaultFOV;
    this.camera = window.camera = new THREE.PerspectiveCamera(this.fov, width / height, 0.1, 1000);
    this.lights = {};
  }

  RacketScene.prototype.resize = function(width, height) {
    this.camera.aspect = width / height;
    this.fovRatio = (1024 / width) <= 1 ? 1 : 1024 / width;
    this.appModel.set("widthAdjust", this.fovRatio - 1);
    return this.setCameraFov(this.fov, true);
  };

  RacketScene.prototype.add = function(obj) {
    return this.scene.add(obj);
  };

  RacketScene.prototype.initialize = function() {
    this.camera.position.z = 75;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.cubeMap = Utils.makeCubeMap(this.model.environment);
    this.racketObject = window.racketObject = new RacketObject({
      envCube: this.cubeMap
    });
    this.racketObject.on("objectLoaded", this.racketLoaded);
    this.racketObject.load(this.model.objects[0]);
    return this.addLights();
  };

  RacketScene.prototype.racketLoaded = function(obj) {
    var k, light, _ref;
    this.racket = window.racket = obj;
    this.add(obj);
    _ref = this.lights;
    for (k in _ref) {
      light = _ref[k];
      if (light.type === "SpotLight" || light.type === "DirectionalLight") {
        light.target = this.racket;
      }
    }
    return setTimeout((function(_this) {
      return function() {
        _this.trigger("racketLoaded");
        return _this.trigger("racketMovingUpdate", {
          type: "racketMovingUpdate"
        });
      };
    })(this), 100);
  };

  RacketScene.prototype.controlRotation = function(data) {
    var rotationAmountX, rotationAmountY, xAxis, yAxis;
    xAxis = new THREE.Vector3(1, 0, 0);
    rotationAmountX = THREE.Math.degToRad(-data.velY);
    yAxis = new THREE.Vector3(0, 1, 0);
    rotationAmountY = THREE.Math.degToRad(-data.velX);
    if (this.racket != null) {
      this.rotateAroundWoldAxis(this.racket, xAxis, rotationAmountX);
      this.rotateAroundWoldAxis(this.racket, yAxis, rotationAmountY);
      this.trigger("racketMovingUpdate", {
        type: "racketMovingUpdate"
      }, true);
      if (this.currentHotspot != null) {
        return this.resetHotspot();
      }
    }
  };

  RacketScene.prototype.getHotspotsPositions = function() {
    var hs, i, vert, verts, _i, _len;
    verts = this.racketObject.getHotspots(this.model.hotspots);
    hs = {};
    for (i = _i = 0, _len = verts.length; _i < _len; i = ++_i) {
      vert = verts[i];
      hs[vert.__id] = this.calc2d(vert);
    }
    return hs;
  };

  RacketScene.prototype.rotateAroundWoldAxis = function(object, axis, radians) {
    this.rotWorld = new THREE.Matrix4();
    this.rotWorld.makeRotationAxis(axis.normalize(), radians);
    this.rotWorld.multiply(object.matrix);
    object.matrix = this.rotWorld;
    return object.rotation.setFromRotationMatrix(this.racket.matrix);
  };

  RacketScene.prototype.renderOperation = function() {};

  RacketScene.prototype.addLights = function() {
    var dLightIntensity, k, v, _ref, _results;
    dLightIntensity = .4;
    this.lights['pLight1'] = new THREE.PointLight(0xffffff, 2, 1000);
    this.lights['pLight1'].position.set(0, -200, 0);
    this.lights['dLight1'] = new THREE.SpotLight(0xffffff, dLightIntensity);
    this.lights['dLight1'].position.set(0, 250, 250);
    this.lights['dLight2'] = new THREE.SpotLight(0xffffff, dLightIntensity);
    this.lights['dLight2'].position.set(0, 250, -250);
    this.lights['dLight3'] = new THREE.SpotLight(0xffffff, dLightIntensity);
    this.lights['dLight3'].position.set(-250, 250, 0);
    this.lights['dLight4'] = new THREE.SpotLight(0xffffff, dLightIntensity);
    this.lights['dLight4'].position.set(250, 250, 0);
    _ref = this.lights;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      v.castShadow = true;
      _results.push(this.scene.add(v));
    }
    return _results;
  };

  RacketScene.prototype.calc2d = function(point) {
    var halfHeight, halfWidth, result, vector, z;
    z = point.z;
    vector = point.project(this.camera);
    result = new Object();
    halfWidth = this.renderer.domElement.width / 2;
    halfHeight = this.renderer.domElement.height / 2;
    result.x = vector.x * halfWidth + halfWidth;
    result.y = (-vector.y) * halfHeight + halfHeight;
    result.z = z;
    return result;
  };

  RacketScene.prototype.resetHotspot = function() {
    var camera, position, tl;
    this.resetHotspotAnimation();
    this.currentHotspot = null;
    this.fov = DefaultFOV;
    tl = this.generateTransitionTimeline();
    camera = this.setCameraFov(this.fov);
    position = this.setRacketPosition({
      x: 0,
      y: 0,
      z: 0
    });
    return tl.add([camera, position]);
  };

  RacketScene.prototype.resetHotspotAnimation = function() {
    if (this.racketObject.animations[this.currentHotspot] != null) {
      this.racketObject.animations[this.currentHotspot].timeScale(3);
      return this.racketObject.animations[this.currentHotspot].reverse();
    }
  };

  RacketScene.prototype.setCameraFov = function(fov, jump) {
    if (!jump) {
      return TweenMax.to(this.camera, 2, {
        fov: fov * this.fovRatio,
        onUpdate: (function(_this) {
          return function() {
            return _this.camera.updateProjectionMatrix();
          };
        })(this)
      });
    } else {
      this.camera.fov = fov * this.fovRatio;
      return this.camera.updateProjectionMatrix();
    }
  };

  RacketScene.prototype.setRacketRotation = function(rotation) {
    return TweenMax.to(this.racket.rotation, 2, {
      ease: Cubic.easeInOut,
      x: rotation.x,
      y: rotation.y,
      z: rotation.z
    });
  };

  RacketScene.prototype.setRacketPosition = function(translate) {
    return TweenMax.to(this.racket.position, 2, {
      ease: Cubic.easeInOut,
      x: translate.x,
      y: translate.y,
      z: translate.z
    });
  };

  RacketScene.prototype.moveRacket = function(data) {
    var camera, rotate, tl, translate;
    this.resetHotspotAnimation();
    tl = this.generateTransitionTimeline();
    this.currentHotspot = data.id;
    this.fov = data.fov;
    camera = this.setCameraFov(this.fov);
    translate = this.setRacketPosition(data.translate);
    rotate = this.setRacketRotation(data.rotation);
    tl.add([camera, translate, rotate]);
    return tl.addCallback((function(_this) {
      return function() {
        if (_this.racketObject.animations[_this.currentHotspot] != null) {
          _this.racketObject.animations[_this.currentHotspot].timeScale(1);
          return _this.racketObject.animations[_this.currentHotspot].play();
        }
      };
    })(this));
  };

  RacketScene.prototype.generateTransitionTimeline = function() {
    return new TimelineMax({
      onStart: (function(_this) {
        return function() {
          return _this.trigger("racketMovingStart", {
            type: "racketMovingStart"
          });
        };
      })(this),
      onUpdate: (function(_this) {
        return function() {
          return _this.trigger("racketMovingUpdate", {
            type: "racketMovingUpdate"
          });
        };
      })(this),
      onComplete: (function(_this) {
        return function() {
          if (_this.currentHotspot) {
            return _this.trigger("racketMovingComplete", {
              type: "racketMovingComplete"
            });
          }
        };
      })(this)
    });
  };

  return RacketScene;

})();

module.exports = RacketScene;



},{"../../../utils/common.coffee":8,"./../../../models/AppModel.coffee":4,"./../objects/RacketObject.coffee":37}],40:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (data, undefined, moment) {
var type = data.get('type')
var index = data.get('post_id').indexOf('_')
var postID = data.get('post_id').substring(index + 1)
if ( type === 'photo')
{
buf.push("<div" + (jade.attr("data-date", "" + (data.get('date')) + "", true, false)) + " class=\"item square\"><a" + (jade.attr("href", "https://www.facebook.com/" + (data.get('from').id) + "/posts/" + postID, true, false)) + " target=\"_blank\"><div" + (jade.attr("data-id", "" + (data.get('post_id')) + "", true, false)) + (jade.attr("data-type", "" + (data.get('post_type') ) + "", true, false)) + (jade.attr("style", "background:url('https://graph.facebook.com/" + (data.get('object_id')) + "/picture?type=normal');", true, false)) + (jade.cls(['square-post','facebook',(data.get('featured') ? 'large' : 'small')], [null,null,true])) + "><div class=\"hover-overlay\">");
if ( data.get('message') !== undefined)
{
buf.push("<p class=\"caption\">" + (jade.escape((jade_interp = data.get('message')) == null ? '' : jade_interp)) + "</p>");
}
buf.push("</div></div></a></div>");
}
else
{
buf.push("<div" + (jade.attr("data-date", "" + (data.get('date')) + "", true, false)) + " class=\"item\"><a" + (jade.attr("href", "https://www.facebook.com/" + (data.get('from').id) + "/posts/" + postID, true, false)) + " target=\"_blank\"><div" + (jade.attr("data-date", "" + (data.get('date')) + "", true, false)) + (jade.attr("data-id", "" + (data.get('post_id')) + "", true, false)) + (jade.attr("data-type", "" + (data.get('post_type') ) + "", true, false)) + " class=\"text-post facebook\"><div class=\"img\"><img" + (jade.attr("src", 'http://graph.facebook.com/' + (data.get("from").id) + '/picture?type=normal&height=100&width=100', true, false)) + "/></div><div class=\"quote\"><p><em class=\"open-quote\">&ldquo;</em><span class=\"post-body\">" + (((jade_interp = data.get("message")) == null ? '' : jade_interp)) + "</span><em class=\"close-quote\">&rdquo;</em></p></div><div class=\"signature\"><p class=\"username\">" + (jade.escape((jade_interp = data.get("from").name) == null ? '' : jade_interp)) + "</p><p class=\"date\">" + (jade.escape((jade_interp = moment(data.get("date")).fromNow()) == null ? '' : jade_interp)) + "</p></div></div></a></div>");
}}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined,"moment" in locals_for_with?locals_for_with.moment:typeof moment!=="undefined"?moment:undefined));;return buf.join("");
};
},{"jade/runtime":46}],41:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (data, undefined) {
buf.push("<div" + (jade.attr("data-date", "" + (data.get('date')) + "", true, false)) + " class=\"item\"><a" + (jade.attr("href", "" + (data.get('link')) + "", true, false)) + " target=\"_blank\"><div" + (jade.attr("data-id", "" + (data.get('post_id')) + "", true, false)) + (jade.attr("data-type", "" + (data.get('post_type') ) + "", true, false)) + (jade.attr("style", "background:url( " + ( data.get('images').standard_resolution.url) + " );", true, false)) + (jade.cls(['square-post','instagram',(data.get('featured') ? 'large' : 'small')], [null,null,true])) + "><div class=\"hover-overlay\">");
if ( data.get('caption') !== undefined)
{
buf.push("<p class=\"caption\">" + (jade.escape((jade_interp = data.get('caption').text) == null ? '' : jade_interp)) + "</p>");
}
buf.push("</div></div></a></div>");}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":46}],42:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (data, undefined, moment) {
var text = data.get('text')
var length = text.length
var id_string = data.get('id_str')
var user_id = data.get('user').id_str 
if ( data.get('id_str') !== undefined)
{
var url = 'http://twitter.com/' + data.get('user').id_str + '/status/' + data.get('id_str')
}
else
{
var url = "https://t.co/" + text.substring((length - 10), (length))
}
buf.push("<div" + (jade.attr("data-date", "" + (data.get('date')) + "", true, false)) + (jade.attr("data-id", "" + (data.get('post_id')) + "", true, false)) + (jade.attr("data-type", "" + (data.get('post_type') ) + "", true, false)) + " class=\"item\"><a" + (jade.attr("href", url, true, false)) + " target=\"_blank\"><div class=\"twitter text-post\"><div class=\"img\"><img" + (jade.attr("src", '' + (data.get("user").profile_image_url) + '', true, false)) + "/></div><div class=\"quote\"><p><em class=\"open-quote\">&ldquo;</em><span class=\"post-body\">" + (((jade_interp = data.get("text")) == null ? '' : jade_interp)) + "</span><em class=\"close-quote\">&rdquo;</em></p></div><div class=\"signature\"><p class=\"username\">@" + (jade.escape((jade_interp = data.get("user").name) == null ? '' : jade_interp)) + "</p><p class=\"date\">" + (jade.escape((jade_interp = moment(data.get("date")).fromNow()) == null ? '' : jade_interp)) + "</p></div></div></a></div>");}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined,"moment" in locals_for_with?locals_for_with.moment:typeof moment!=="undefined"?moment:undefined));;return buf.join("");
};
},{"jade/runtime":46}],43:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id, index) {
buf.push("<g" + (jade.attr("id", "hotspot2-" + (id) + "" + (index ? index : '') + "", true, false)) + (jade.attr("data-id", "" + (id) + "", true, false)) + " class=\"content-hotspot\"><g class=\"gray-circle\"><circle stroke=\"#3c3c3c\" stroke-width=\"4\" cx=\"0\" cy=\"0\" r=\"10px\" fill=\"transparent\"></circle></g><g class=\"plus-sign\"><g><rect width=\"2px\" height=\"8px\" fill=\"#2c2c2c\" class=\"v\"></rect><rect width=\"8px\" height=\"2px\" fill=\"#2c2c2c\" class=\"h\"></rect></g></g><g class=\"gray-stroke\"><circle stroke=\"#2c2c2c\" stroke-width=\"4\" cx=\"0\" cy=\"0\" r=\"19px\" fill=\"transparent\"></circle></g></g>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"index" in locals_for_with?locals_for_with.index:typeof index!=="undefined"?index:undefined));;return buf.join("");
};
},{"jade/runtime":46}],44:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id) {
buf.push("<g" + (jade.attr("id", "hotspot-" + (id) + "", true, false)) + (jade.attr("data-id", "" + (id) + "", true, false)) + " class=\"hotspot\"><g class=\"orange-circle\"><circle stroke=\"#F4CE21\" stroke-width=\"6\" cx=\"0\" cy=\"0\" r=\"12px\" fill=\"#FF6C00\"></circle></g><g class=\"plus-sign\"><g><rect width=\"2px\" height=\"8px\" fill=\"#ffffff\" class=\"v\"></rect><rect width=\"8px\" height=\"2px\" fill=\"#ffffff\" class=\"h\"></rect></g></g><g class=\"yellow-stroke\"><circle stroke=\"#F4CE21\" stroke-width=\"4\" cx=\"0\" cy=\"0\" r=\"19px\" fill=\"transparent\"></circle></g><g class=\"white-stroke\"><circle cx=\"0\" cy=\"0\" r=\"32px\" stroke=\"#ffffff\" stroke-width=\"10\" fill=\"transparent\"></circle></g></g>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return buf.join("");
};
},{"jade/runtime":46}],45:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (data) {
buf.push("<div id=\"specs-loader\"><svg width=\"150px\" height=\"150px\" viewBox=\"0 0 150 150\" class=\"loader-spinner\"><g class=\"outer\"><circle r=\"65px\" fill=\"transparent\" stroke-width=\"6px\" stroke=\"#ffffff\"></circle></g><g class=\"load-meter\"><circle r=\"48px\" fill=\"transparent\" stroke-width=\"10px\" stroke=\"#F4CE21\"></circle></g><g class=\"inner\"><circle r=\"32px\" fill=\"#ff6c00\" stroke-width=\"6px\" stroke=\"#F4CE21\"></circle></g></svg><div class=\"progress\"><span class=\"loading\">" + (jade.escape((jade_interp = data.get('copy').loading) == null ? '' : jade_interp)) + "</span><span class=\"amount\">0</span></div><div class=\"loading-copy\"><span>" + (jade.escape((jade_interp = data.get('copy').initializing) == null ? '' : jade_interp)) + "</span></div></div><div id=\"specs-cta\"><img" + (jade.attr("src", "" + (data.get('assets').loaderCta) + "", true, false)) + "/></div>");}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return buf.join("");
};
},{"jade/runtime":46}],46:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || _dereq_('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(_dereq_,module,exports){

},{}]},{},[1])
(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],47:[function(require,module,exports){
(function (global){
//! moment.js
//! version : 2.8.4
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.8.4',
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            x    : function () {
                return this.valueOf();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                    (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                                           m._a[SECOND] !== 0 ||
                                           m._a[MILLISECOND] !== 0)) ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LTS : 'h:mm:ss A',
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',
        _ordinalParse : /\d{1,2}/,

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) {
                return parseTokenOneDigit;
            }
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            /* falls through */
        case 'SSS':
            if (strict) {
                return parseTokenThreeDigits;
            }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return config._locale._meridiemParse;
        case 'x':
            return parseTokenOffsetMs;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(
                            input.match(/\d{1,2}/)[0], 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = config._locale.isPM(input);
            break;
        // HOUR
        case 'h' : // fall through to hh
        case 'hh' :
            config._pf.bigHour = true;
            /* falls through */
        case 'H' : // fall through to HH
        case 'HH' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX OFFSET (MILLISECONDS)
        case 'x':
            config._d = new Date(toInt(input));
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = config._locale.weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.zone(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.zone(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.add(this._dateTzOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                daysAdjust = (this - moment(this).startOf('month')) -
                    (that - moment(that).startOf('month'));
                // same as above but with zones, to negate all dst
                daysAdjust -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4;
                output += daysAdjust / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateTzOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.subtract(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._dateTzOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateTzOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData : function () {
            return this._locale;
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LOCALES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define('moment', function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvQnVybi5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvY29udHJvbGxlcnMvVmlld0NvbnRyb2xsZXIuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL2luZGV4LmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC9tb2RlbHMvQXBwTW9kZWwuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL21vZGVscy9Qb3N0c01vZGVsLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC9tb2RlbHMvUmFja2V0TW9kZWwuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL21vZGVscy9hYnN0cmFjdC9Nb2RlbEJhc2UuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3V0aWxzL2NvbW1vbi5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdXRpbHMvc2hhcmUuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3V0aWxzL3RyYWNrLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9Db25uZWN0Vmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvSGVhZGVyVmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvSG9tZVZpZXcuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3ZpZXdzL1NwZWNzVmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvVGVhbUJ1cm5WaWV3LmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9UZWFtUGxheWVyVmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvYWJzdHJhY3QvUG9zdFZpZXdCYXNlLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9hYnN0cmFjdC9WaWV3QmFzZS5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvY29ubmVjdC9GYWNlYm9va1Bvc3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9jb25uZWN0L0luc3RhZ3JhbVBvc3RWaWV3LmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9jb25uZWN0L1R3aXR0ZXJQb3N0Vmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L1JhY2tldEdMLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9yYWNrZXQvUmFja2V0UHJlbG9hZGVyVmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L1JhY2tldFJlbmRlcmVyLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9yYWNrZXQvUmFja2V0Vmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L2Fic3RyYWN0L0NvbXBvdW5kT2JqZWN0LmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9yYWNrZXQvYW5pbWF0aW9ucy9jYXJib24tZmliZXIuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3ZpZXdzL3JhY2tldC9hbmltYXRpb25zL2dsb2JhbC5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L2FuaW1hdGlvbnMvaGFuZGxlLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9yYWNrZXQvYW5pbWF0aW9ucy9wYXJhbGxlbC1kcmlsbGluZy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L2FuaW1hdGlvbnMvc3Bpbi1lZmZlY3QuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3ZpZXdzL3JhY2tldC9jb250cm9sL1JvdGF0aW9uQ29udHJvbHMuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3ZpZXdzL3JhY2tldC9ob3RzcG90cy9Ib3RzcG90Vmlldy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L2ltcG9ydHMvYW5pbWF0aW9ucy5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L2ltcG9ydHMvdGVtcGxhdGVzLmNvZmZlZSIsIi9Vc2Vycy9waGlsYnJhZHkvU2l0ZXMvd2lsc29uLXRoZS1idXJuL2Fzc2V0cy9idXJuL2pzL2FwcC92aWV3cy9yYWNrZXQvaW1wb3J0cy90ZW1wbGF0ZXMvaG90c3BvdHMuY29mZmVlIiwiL1VzZXJzL3BoaWxicmFkeS9TaXRlcy93aWxzb24tdGhlLWJ1cm4vYXNzZXRzL2J1cm4vanMvYXBwL3ZpZXdzL3JhY2tldC9vYmplY3RzL1JhY2tldE9iamVjdC5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L3NjZW5lL1JhY2tldENhbWVyYS5jb2ZmZWUiLCIvVXNlcnMvcGhpbGJyYWR5L1NpdGVzL3dpbHNvbi10aGUtYnVybi9hc3NldHMvYnVybi9qcy9hcHAvdmlld3MvcmFja2V0L3NjZW5lL1JhY2tldFNjZW5lLmNvZmZlZSIsImFzc2V0cy9idXJuL3RlbXBsYXRlcy9jb25uZWN0L2ZhY2Vib29rLXBvc3QuamFkZSIsImFzc2V0cy9idXJuL3RlbXBsYXRlcy9jb25uZWN0L2luc3RhZ3JhbS1wb3N0LmphZGUiLCJhc3NldHMvYnVybi90ZW1wbGF0ZXMvY29ubmVjdC90d2l0dGVyLXBvc3QuamFkZSIsImFzc2V0cy9idXJuL3RlbXBsYXRlcy9zcGVjcy9ob3RzcG90cy9jb250ZW50LmhvdHNwb3Quc3ZnLmphZGUiLCJhc3NldHMvYnVybi90ZW1wbGF0ZXMvc3BlY3MvaG90c3BvdHMvaG90c3BvdC5zdmcuamFkZSIsImFzc2V0cy9idXJuL3RlbXBsYXRlcy9zcGVjcy9sb2FkZXIvc3BlY3MtbG9hZGVyLmphZGUiLCJub2RlX21vZHVsZXMvamFkZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNDQSxJQUFBLDhCQUFBO0VBQUEsa0ZBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQUFYLENBQUE7O0FBQUEsY0FDQSxHQUFpQixPQUFBLENBQVEscUNBQVIsQ0FEakIsQ0FBQTs7QUFBQTtBQUtpQixFQUFBLGNBQUEsR0FBQTtBQUdULGlEQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUhTO0VBQUEsQ0FBYjs7QUFBQSxpQkFNQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBRVIsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLENBQUEsSUFBMEIsb0JBQWhDLENBQUE7QUFBQSxJQUNBLElBQUMs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbkFwcE1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbHMvQXBwTW9kZWwuY29mZmVlJ1xuVmlld0NvbnRyb2xsZXIgPSByZXF1aXJlICcuL2NvbnRyb2xsZXJzL1ZpZXdDb250cm9sbGVyLmNvZmZlZSdcblxuY2xhc3MgQnVyblxuXG4gICAgY29uc3RydWN0b3I6IC0+XG5cblxuICAgICAgICBAaW5pdE1vZGVscygpXG5cblxuICAgIGluaXRNb2RlbHM6IC0+XG5cbiAgICAgICAgdXJsID0gJChcImh0bWxcIikuZGF0YSgnZGF0YScpIG9yIFwiL2J1cm4vZGF0YS9lbi5qc29uXCJcbiAgICAgICAgQG1vZGVsID0gQXBwTW9kZWwuZ2V0SW5zdGFuY2VcbiAgICAgICAgICAgIHVybDogdXJsXG5cbiAgICAgICAgQG1vZGVsLm9uY2UgXCJjaGFuZ2U6cmVhZHlcIiAsIEBpbml0Vmlld3NcbiAgICAgICAgQG1vZGVsLmZldGNoKClcblxuXG4gICAgaW5pdFZpZXdzOiA9PlxuXG4gICAgICAgIEB2aWV3Q29udHJvbGxlciA9IG5ldyBWaWV3Q29udHJvbGxlclxuICAgICAgICBAdmlld0NvbnRyb2xsZXIuY2hlY2tQYXRocygpXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1cm5cbiIsIlxuQXBwTW9kZWwgPSByZXF1aXJlICcuLi9tb2RlbHMvQXBwTW9kZWwuY29mZmVlJ1xuUmFja2V0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JhY2tldC9SYWNrZXRWaWV3LmNvZmZlZSdcblRlYW1CdXJuVmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL1RlYW1CdXJuVmlldy5jb2ZmZWUnXG5Ib21lVmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL0hvbWVWaWV3LmNvZmZlZSdcblNwZWNzVmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL1NwZWNzVmlldy5jb2ZmZWUnXG5IZWFkZXJWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvSGVhZGVyVmlldy5jb2ZmZWUnXG5Db25uZWN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL0Nvbm5lY3RWaWV3LmNvZmZlZSdcblBvc3RzTW9kZWwgPSByZXF1aXJlICcuLi9tb2RlbHMvUG9zdHNNb2RlbC5jb2ZmZWUnXG5SYWNrZXRNb2RlbCA9IHJlcXVpcmUgJy4uL21vZGVscy9SYWNrZXRNb2RlbC5jb2ZmZWUnXG5cblxuY2xhc3MgVmlld0NvbnRyb2xsZXJcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBAbW9kZWwgPSBBcHBNb2RlbC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIEBpc1Bob25lID0gJChcImh0bWxcIikuaGFzQ2xhc3MoXCJwaG9uZVwiKVxuXG4gICAgICAgIGlmICFAaXNQaG9uZVxuICAgICAgICAgICAgIEByYWNrZXRWaWV3ID0gbmV3IFJhY2tldFZpZXdcbiAgICAgICAgICAgICAgICAgZWw6XCIjc3BlY3NcIlxuICAgICAgICAgICAgICAgICBtb2RlbDpuZXcgUmFja2V0TW9kZWwgQG1vZGVsLmdldChcInZpZXdcIikucmFja2V0M2RcblxuICAgICAgICBAcGxheWVyc1ZpZXcgPSBuZXcgVGVhbUJ1cm5WaWV3XG4gICAgICAgICAgICBlbDpcIiN0ZWFtLWJ1cm5cIlxuXG4gICAgICAgIEBzcGVjc1ZpZXcgPSBuZXcgU3BlY3NWaWV3XG4gICAgICAgICAgICBlbDpcIiNzcGVjc1wiXG5cbiAgICAgICAgQGhlYWRlclZpZXcgPSBuZXcgSGVhZGVyVmlld1xuICAgICAgICAgICAgZWw6XCJoZWFkZXJcIlxuICAgICAgICAgICAgbW9kZWw6QG1vZGVsXG5cbiAgICAgICAgQGNvbm5lY3RWaWV3ID0gbmV3IENvbm5lY3RWaWV3XG4gICAgICAgICAgICBlbDpcIiNjb25uZWN0XCJcbiAgICAgICAgICAgIG1vZGVsOiBuZXcgUG9zdHNNb2RlbCgpXG5cbiAgICAgICAgQGhvbWVWaWV3ID0gbmV3IEhvbWVWaWV3XG4gICAgICAgICAgICBlbDpcIiNob21lXCJcblxuXG4gICAgICAgIEBjb25uZWN0Vmlldy5sb2FkUG9zdHMoKVxuXG5cbiAgICBjaGVja1BhdGhzOiA9PlxuICAgICAgICAjIEJlZ2luIERpcnR5IGFzcyBjb2RlXG4gICAgICAgIGNvbnNvbGUubG9nICdjaGVja1BhdGhzJ1xuICAgICAgICBcbiAgICAgICAgcGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgICAgcGF0aHMgPSBwYXRoTmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGZpbmFsUGF0aCA9IHBhdGhzW3BhdGhzLmxlbmd0aC0xXVxuICAgICAgICBzZWNvbmRUb0xhc3QgPSBwYXRoc1twYXRocy5sZW5ndGgtMl1cblxuICAgICAgICBpZiAoZmluYWxQYXRoID09IFwic3BlY3NcIikgfHwgKChmaW5hbFBhdGggPT0gXCJcIikgJiYgKHNlY29uZFRvTGFzdCA9PSBcInNwZWNzXCIpKVxuICAgICAgICAgICAgaWYgIUBpc1Bob25lXG4gICAgICAgICAgICAgICAgdGFibGUgPSAkKFwiI3NwZWNzLXRhYmxlXCIpXG4gICAgICAgICAgICAgICAgQHNwZWNzVmlldy50b2dnbGVUYWJsZSgnc2hvdycpXG4gICAgICAgICAgICAgICAgJCgnaHRtbCxib2R5JykuZGVsYXkoMTUwMCkuYW5pbWF0ZSh7c2Nyb2xsVG9wOih0YWJsZS5vZmZzZXQoKS50b3AgLSA0NSkgLSAod2luZG93LmlubmVySGVpZ2h0ICouNSAtIHRhYmxlLmhlaWdodCgpKi41ICl9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0YWJsZSA9ICQoXCIjbW9iaWxlLXNwZWNzLWdhbGxlcnlcIilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyAnMjAnXG4gICAgICAgICAgICAgICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOih0YWJsZS5vZmZzZXQoKS50b3AgLSAyMCkgLSAod2luZG93LmlubmVySGVpZ2h0ICouNSAtIHRhYmxlLmhlaWdodCgpKi41ICl9KTtcblxuICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAjIEVuZCBEaXJ0eSBhc3MgY29kZVxuICAgICAgICAjIFdpcGluZyBhc3MuLi5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0NvbnRyb2xsZXJcbiIsIlxuVEhSRUUuSW1hZ2VVdGlscy5jcm9zc09yaWdpbiA9ICcnXG5TaGFyZSA9IHJlcXVpcmUgJy4vdXRpbHMvc2hhcmUuY29mZmVlJ1xud2luZG93Lm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcblR3ZWVuTWF4LmRlZmF1bHRPdmVyd3JpdGUgPSBcInByZWV4aXN0aW5nXCJcblxuXG5cbiMjIyQudmFsaWRhdG9yLnNldERlZmF1bHRzXG4gICAgaWdub3JlOiBbXVxuXG4kLnZhbGlkYXRvci5hZGRNZXRob2QgXCJjc3ZcIiwgKCh2YWx1ZSwgZWxlbWVudCwgbGltaXQpIC0+XG5cbiAgICBjb21tYXMgPSB2YWx1ZS5zcGxpdCgnLCcpXG5cbiAgICBjb25zb2xlLmxvZyBjb21tYXMubGVuZ3RoICwgbGltaXRcblxuICAgIGlmIGNvbW1hcy5sZW5ndGggaXMgcGFyc2VJbnQgbGltaXRcbiAgICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgICAgZmFsc2VcblxuXG4pLCBcIlBsZWFzZSBzZWxlY3QgYWxsIHJlcXVpcmVkIG9wdGlvbnMuXCIjIyNcblxuQnVybiA9IHJlcXVpcmUgJy4vQnVybi5jb2ZmZWUnXG5cbiQoZG9jdW1lbnQpLnJlYWR5IC0+XG5cbiAgICBTaGFyZS5mYkluaXQoKVxuXG4gICAgbmV3IEJ1cm4oKVxuIiwiTW9kZWxCYXNlID0gcmVxdWlyZSAnLi9hYnN0cmFjdC9Nb2RlbEJhc2UuY29mZmVlJ1xuXG5cbmNsYXNzIEFwcCBleHRlbmRzIE1vZGVsQmFzZVxuXG4gICAgYWxsb3dJbnN0YW50aWF0aW9uID0gZmFsc2VcbiAgICBpbnN0YW5jZSA9IG51bGxcblxuXG4gICAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxuXG4gICAgICAgIGlmICFhbGxvd0luc3RhbnRpYXRpb25cbiAgICAgICAgICAgIHRocm93ICdBcHAgaXMgYSBzaW5nbGV0b24uIFVzZSBBcHAuZ2V0SW5zdGFuY2UoKSBpbnN0ZWFkLidcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYWxsb3dJbnN0YW50aWF0aW9uID0gZmFsc2VcbiAgICAgICAgICAgIHN1cGVyKG9wdHMpXG5cbiAgICBBcHAuZ2V0SW5zdGFuY2UgPSAob3B0cykgLT5cbiAgICAgICAgaWYgaW5zdGFuY2UgaXMgbnVsbFxuICAgICAgICAgICAgYWxsb3dJbnN0YW50aWF0aW9uID0gdHJ1ZVxuICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgQXBwKG9wdHMpXG5cbiAgICAgICAgaW5zdGFuY2VcblxuXG4gICAgaW5pdGlhbGl6ZTogKG9wdHMpIC0+XG4gICAgICAgIHN1cGVyIG9wdHNcbiAgICAgICAgQHNldCAncmVhZHknICwgZmFsc2VcbiAgICAgICAgQG9uY2UgJ2NoYW5nZScgLCBAcmVhZHlcbiAgICAgICAgQGZldGNoKClcblxuXG5cbiAgICAjIyNnZW5lcmF0ZVNlc3Npb25Nb2RlbDogPT5cbiAgICAgICAgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uTW9kZWxcbiAgICAgICAgICAgIGNzcmZTZXJ2aWNlOiBAZ2V0KCdzZXJ2aWNlcycpLmNzcmZcbiAgICAgICAgICAgIGxvZ2luU2VydmljZTogQGdldCgnc2VydmljZXMnKS5sb2dpblxuXG5cblxuXG4gICAgICAgIHNlc3Npb24ub25jZSAnY2hhbmdlOmNzcmYnICwgQHJlYWR5XG4gICAgICAgIHNlc3Npb24uZ2V0Q1NSRigpXG5cbiAgICAgICAgQHNldCAnc2Vzc2lvbicgLCBzZXNzaW9uIyMjXG5cblxuICAgIHJlYWR5OiA9PlxuICAgICAgICBAc2V0ICdyZWFkeScgLCB0cnVlXG5cblxuXG5cblxuICAgIHByb2Nlc3NEYXRhOiAtPlxuICAgICAgICBzdXBlcigpXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuXG4iLCJBcHBNb2RlbCA9IHJlcXVpcmUgJy4vQXBwTW9kZWwuY29mZmVlJ1xuXG5jbGFzcyBQb3N0c01vZGVsIGV4dGVuZHMgQmFja2JvbmUuQ29sbGVjdGlvblxuXG5cblxuICAgIGluaXRpYWxpemU6ICAob3B0cykgLT5cbiAgICAgICAgc3VwZXIgb3B0c1xuXG4gICAgICAgIEB0byAgPSAgbnVsbFxuICAgICAgICBAbGltaXQgPSAyMFxuXG5cblxuXG4gICAgc2V0VXJsOiAodXJsKSAtPlxuICAgICAgICBAdXJsID0gdXJsXG4gICAgICAgIEB1cmwgKz0gXCI/bGltaXQ9I3tAbGltaXR9XCJcbiAgICAgICAgaWYgQHRvPyB0aGVuIEB1cmwgKz0gXCImdG89I3tAdG99XCJcblxuXG5cblxuICAgIGxvYWRNb3JlOiAtPlxuXG4gICAgICAgIGNvbnNvbGUubG9nIFwibG9hZCBNb3JlXCIgLCBAdXJsXG4gICAgICAgICQuYWpheFxuICAgICAgICAgICAgdXJsOkB1cmxcbiAgICAgICAgICAgIG1ldGhvZDpcIkdFVFwiXG4gICAgICAgICAgICBjb250ZW50VHlwZTpcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+XG4gICAgICAgICAgICAgICBmb3IgcG9zdCBpbiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIEBhZGQgbmV3IEJhY2tib25lLk1vZGVsIHBvc3RcbiAgICAgICAgICAgICAgIEB0cmlnZ2VyIFwibW9kZWxTZXRBZGRlZFwiXG5cblxuICAgIG9uTW9yZUxvYWRlZDogLT5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RzTW9kZWxcblxuIiwiXG5jbGFzcyBSYWNrZXRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsXG5cblxuXG4gICAgaW5pdGlhbGl6ZTogIChvcHRzKSAtPlxuICAgICAgICBzdXBlciBvcHRzXG5cblxuXG4gICAgICAgIEBtYW5pZmVzdCA9IFtdXG4gICAgICAgIEBwcmVsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlIHRydWUgICwgXCJcIiAsIHRydWVcbiAgICAgICAgQHByZWxvYWRlci5zZXRNYXhDb25uZWN0aW9ucyg1KVxuICAgICAgICBAcHJlbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIgXCJjb21wbGV0ZVwiICwgQG9uUHJlbG9hZENvbXBsZXRlXG4gICAgICAgIEBwcmVsb2FkZXIuYWRkRXZlbnRMaXN0ZW5lciBcInByb2dyZXNzXCIgLCBAb25QcmVsb2FkUHJvZ3Jlc3NcbiAgICAgICAgQHBhcnNlQXNzZXRzKClcblxuXG4gICAgbG9hZEFzc2V0czogLT5cblxuICAgICAgICBAcHJlbG9hZGVyLmxvYWRNYW5pZmVzdChAbWFuaWZlc3QpXG5cblxuICAgIHBhcnNlQXNzZXRzOiAtPlxuXG4gICAgICAgIG9iamVjdHMgPSBAZ2V0KCdvYmplY3RzJylcblxuICAgICAgICBmb3IgayxnIG9mIG9iamVjdHNcbiAgICAgICAgICAgIGZvciBvYmogaW4gZy5vYmpcblxuICAgICAgICAgICAgICAgIEBwdXNoVG9NYW5pZmVzdCBvYmouaWQgLCBvYmoudXJsXG5cbiAgICAgICAgICAgICAgICBpZiBvYmoubWFwP1xuICAgICAgICAgICAgICAgICAgICBAcHVzaFRvTWFuaWZlc3QgXCJtYXAtI3tvYmouaWR9XCIgLCBvYmoubWFwXG5cbiAgICAgICAgICAgICAgICBpZiBvYmouc3BlY3VsYXJNYXA/XG4gICAgICAgICAgICAgICAgICAgIEBwdXNoVG9NYW5pZmVzdCBcInNwZWMtI3tvYmouaWR9XCIgLCBvYmouc3BlY3VsYXJNYXBcblxuICAgICAgICAgICAgICAgIGlmIG9iai5ub3JtYWxNYXA/XG4gICAgICAgICAgICAgICAgICAgIEBwdXNoVG9NYW5pZmVzdCBcIm5vcm1hbC0je29iai5pZH1cIiAsIG9iai5ub3JtYWxNYXBcblxuICAgICAgICAgICAgICAgIGlmIG9iai5idW1wTWFwP1xuICAgICAgICAgICAgICAgICAgICBAcHVzaFRvTWFuaWZlc3QgXCJidW1wLSN7b2JqLmlkfVwiICwgb2JqLmJ1bXBNYXBcblxuXG5cbiAgICBwdXNoVG9NYW5pZmVzdDogKGlkLHVybCkgLT5cbiAgICAgICAgQG1hbmlmZXN0LnB1c2hcbiAgICAgICAgICAgIGlkOmlkXG4gICAgICAgICAgICBzcmM6dXJsXG5cblxuXG5cbiAgICBvblByZWxvYWRQcm9ncmVzczogKGUpID0+XG5cbiAgICAgICAgQHRyaWdnZXIgJ2Fzc2V0c1Byb2dyZXNzJyAsIGUubG9hZGVkXG4gICAgb25QcmVsb2FkQ29tcGxldGU6IChlKSA9PlxuXG4gICAgICAgIEB0cmlnZ2VyICdhc3NldHNSZWFkeScgLCBAXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhY2tldE1vZGVsXG5cbiIsIlxuXG5cbmNsYXNzIE1vZGVsQmFzZSBleHRlbmRzIEJhY2tib25lLk1vZGVsXG5cblxuICAgIHByZWxvYWRlciA6IG51bGxcbiAgICBtYW5pZmVzdCA6IG51bGxcblxuICAgIGluaXRpYWxpemU6IChvcHRzKSA9PiBcbiAgICAgICAgQG9wdHMgPSBvcHRzXG4gICAgICAgIEB1cmwgPSBvcHRzLnVybFxuICAgICAgICBAbWFuaWZlc3QgPSBbXVxuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgQG9uIFwiY2hhbmdlXCIgLCBAZGF0YUxvYWRlZFxuICAgICAgICBcblxuXG5cbiAgICBkYXRhTG9hZGVkOiA9PlxuICAgICAgICBAb2ZmIFwiY2hhbmdlXCIgLCBAZGF0YUxvYWRlZFxuXG4gICAgICAgIEBwcmVsb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlIGZhbHNlICAsIEBnZXQoXCJiYXNlVXJsXCIpICwgQGdldChcImNvcnNcIilcbiAgICAgICAgQHByZWxvYWRlci5zZXRNYXhDb25uZWN0aW9ucygyMClcbiAgICAgICAgQHByZWxvYWRlci5hZGRFdmVudExpc3RlbmVyIFwiY29tcGxldGVcIiAsIEBvblByZWxvYWRDb21wbGV0ZVxuICAgICAgICBAcHJlbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIgXCJwcm9ncmVzc1wiICwgQG9uUHJlbG9hZFByb2dyZXNzXG4gICAgICAgIFxuXG4gICAgICAgIEBwcm9jZXNzRGF0YSgpXG4gICAgICAgIEB0cmlnZ2VyIFwiZGF0YUxvYWRlZFwiXG5cbiAgICBwcm9jZXNzRGF0YTogPT5cblxuXG5cbiAgICBvblByZWxvYWRQcm9ncmVzczogKGUpID0+XG4gICAgICAgIEB0cmlnZ2VyICdhc3NldHNQcm9ncmVzcycgLCBlLmxvYWRlZFxuICAgIG9uUHJlbG9hZENvbXBsZXRlOiAoZSkgPT5cbiAgICBcbiAgICAgICAgQHRyaWdnZXIgJ2Fzc2V0c1JlYWR5JyAsIEBcblxuXG4gICAgbG9hZEFzc2V0czogPT5cbiAgICAgXG4gICAgICAgIGlmIEBtYW5pZmVzdC5sZW5ndGggPiAwXG4gICAgICAgICAgICBAcHJlbG9hZGVyLmxvYWRNYW5pZmVzdChAbWFuaWZlc3QpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvblByZWxvYWRDb21wbGV0ZSgpXG5cblxuICAgIHNlYXJjaEdsb2JhbEFzc2V0czogKG9iaikgPT4gICAgICAgXG5cbiAgICAgICAgZm9yIGl0ZW0gb2Ygb2JqXG4gICAgICAgICAgICBpZiBpdGVtIGlzIFwiYXNzZXRzXCJcbiAgICAgICAgICAgICAgICBmb3IgYXNzZXQgb2Ygb2JqW2l0ZW1dICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgL15odHRwKHM/KS8udGVzdCBvYmpbaXRlbV1bYXNzZXRdIGlzIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbaXRlbV1bYXNzZXRdID0gQGdldChcImJhc2VVcmxcIikgKyBvYmpbaXRlbV1bYXNzZXRdXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBAbWFuaWZlc3QucHVzaChvYmpbaXRlbV1bYXNzZXRdKVxuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZSBpZiB0eXBlb2Ygb2JqW2l0ZW1dIGlzIFwib2JqZWN0XCIgYW5kIGl0ZW0uaW5kZXhPZihcIl9cIikgIT0gMFxuICAgICAgICAgICAgICAgIEBzZWFyY2hHbG9iYWxBc3NldHMob2JqW2l0ZW1dKVxuXG4gICAgXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsQmFzZVxuXG5cblxuXG5cblxuXG4iLCJcblxubW9kdWxlLmV4cG9ydHMuZ2V0TWF4V2lkdGggPSAtPlxuICAgIG1heFdpZHRoID0gNzY4XG5cbiAgICBpZiB3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjggYW5kIHdpbmRvdy5pbm5lcldpZHRoIDw9IDE0MDBcbiAgICAgICAgbWF4V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGlmIHdpbmRvdy5pbm5lcldpZHRoID4gMTQwMFxuICAgICAgICBtYXhXaWR0aCA9IDE0MDBcblxuXG5cbiAgICByZXR1cm4gbWF4V2lkdGhcblxuXG5cblxubW9kdWxlLmV4cG9ydHMuZGVnVG9SYWQgPSAoZGVnKSAtPlxuXG4gICAgcmV0dXJuIChkZWcgKiBNYXRoLlBJKS8xODBcblxubW9kdWxlLmV4cG9ydHMucmFkVG9EZWcgPSAocmFkKSAtPlxuXG4gICAgcmV0dXJuIChNYXRoLlBJLzE4MCkgKiByYWRcblxubW9kdWxlLmV4cG9ydHMubWFrZUN1YmVNYXAgPSAoZW52VXJscykgLT5cbiAgICBjdWJlTWFwID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZUN1YmUoZW52VXJscylcbiAgICBjdWJlTWFwLmZvcm1hdCA9IFRIUkVFLlJHQkZvcm1hdFxuXG4gICAgcmV0dXJuIGN1YmVNYXBcblxuXG5tb2R1bGUuZXhwb3J0cy5tYXRyaXhUb0FycmF5ID0gKG1hdHJpeFN0cikgLT5cbiAgICByZXR1cm4gbWF0cml4U3RyLm1hdGNoKC8oLT9bMC05XFwuXSspL2cpO1xuXG5cbm1vZHVsZS5leHBvcnRzLmRpc3RhbmNlID0gKHgxLHkxLHgyLHkyKSAtPlxuICAgIHYxID0gbmV3IFRIUkVFLlZlY3RvcjIoeDEseTEpXG4gICAgdjIgPSBuZXcgVEhSRUUuVmVjdG9yMih4Mix5MilcblxuICAgIGQgPSB2MS5kaXN0YW5jZVRvKHYyKVxuXG5cbiAgICByZXR1cm4gZFxuXG5tb2R1bGUuZXhwb3J0cy5zdmducyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuIiwiXG5cblxubW9kdWxlLmV4cG9ydHMuZmJJbml0ID0gLT5cbiAgICBGQi5pbml0XG4gICAgICAgIGFwcElkOiAnMTUxODQ1MzYzODQxNDQwMidcbiAgICAgICAgeGZibWw6IHRydWVcbiAgICAgICAgY29va2llOnRydWVcbiAgICAgICAgc3RhdHVzOnRydWVcbiAgICAgICAgdmVyc2lvbjpcInYyLjJcIlxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cy5mYlNoYXJlID0gKHRpdGxlICwgY2FwdGlvbiwgaW1hZ2UgLCBsaW5rLCBkZXNjcmlwdGlvbikgLT5cblxuICAgIEZCLnVpXG4gICAgICAgIG1ldGhvZDogXCJmZWVkXCJcbiAgICAgICAgbGluazpsaW5rXG4gICAgICAgIHBpY3R1cmU6aW1hZ2VcbiAgICAgICAgY2FwdGlvbjpjYXB0aW9uXG4gICAgICAgIG5hbWU6dGl0bGVcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG5cblxuXG5cblxuIiwiXG5hY2NvdW50cyA9IFtcIldpbHNvblwiLFwiVGVubmlzXCIsXCJBZ2VuY3lcIl1cblxuZ2FUcmFjayA9IG1vZHVsZS5leHBvcnRzLmdhVHJhY2sgPSAodHlwZSwgdGFnKSAtPlxuXG4gICAgaWYgZ2E/XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RyYWNraW5nIEdBXVwiICwgXCJbIHNlbmRcIiAsICdldmVudCcgLCB0eXBlICwgJ2NsaWNrJyAsIHRhZyAsIFwiXVwiKVxuICAgICAgICBmb3IgYWNjb3VudCBpbiBhY2NvdW50c1xuXG4gICAgICAgICAgICBnYSBcIiN7YWNjb3VudH0uc2VuZFwiICwgJ2V2ZW50JyAsIHR5cGUgLCAnY2xpY2snICwgdGFnXG5cblxuICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2coXCJUcmFja2luZyBHQV1cIiAsIFwiWyBnYSB2YXJpYWJsZSBkb2Vzbid0IGV4aXN0IF1cIilcblxuXG5tb2R1bGUuZXhwb3J0cy5nYVRyYWNrRWxlbWVudCA9ICgkZWwpIC0+XG5cbiAgICB0YWcgPSAkZWwuZGF0YShcImdhLXRhZ1wiKVxuICAgIHR5cGUgPSAkZWwuZGF0YShcImdhLXR5cGVcIilcblxuICAgIGlmIHR5cGU/IGFuZCB0YWc/XG4gICAgICAgIGdhVHJhY2sodHlwZSAsIHRhZylcbiAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHJhY2tpbmcgR0FdXCIgLCBcIlsgZGF0YS1nYS10YWcgYW5kIGRhdGEtZ2EtdHlwZSBhdHRyaWJ1dGVzIG5vdCBzZXQgb24gZWxlbWVudFwiLCAkZWwgLFwiXVwiKVxuXG4iLCJcblZpZXdCYXNlID0gcmVxdWlyZSAnLi9hYnN0cmFjdC9WaWV3QmFzZS5jb2ZmZWUnXG5BcHBNb2RlbCA9IHJlcXVpcmUgJy4uL21vZGVscy9BcHBNb2RlbC5jb2ZmZWUnXG5UcmFja2luZyA9IHJlcXVpcmUgJy4uL3V0aWxzL3RyYWNrLmNvZmZlZSdcblxuXG5Qb3N0Vmlld3MgPSBbXVxuUG9zdFZpZXdzWydmYWNlYm9vayddID0gcmVxdWlyZSAnLi9jb25uZWN0L0ZhY2Vib29rUG9zdFZpZXcuY29mZmVlJ1xuUG9zdFZpZXdzWydpbnN0YWdyYW0nXSA9IHJlcXVpcmUgJy4vY29ubmVjdC9JbnN0YWdyYW1Qb3N0Vmlldy5jb2ZmZWUnXG5Qb3N0Vmlld3NbJ3R3aXR0ZXInXSA9IHJlcXVpcmUgJy4vY29ubmVjdC9Ud2l0dGVyUG9zdFZpZXcuY29mZmVlJ1xuXG5cbmNsYXNzIENvbm5lY3RWaWV3IGV4dGVuZHMgVmlld0Jhc2VcblxuXG4gICAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxuICAgICAgICBAYXBwTW9kZWwgPSBBcHBNb2RlbC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIEBwb3N0cyA9IFtdXG4gICAgICAgIEBwYWdlID0gMVxuICAgICAgICBAbGltaXQgPSAyMFxuXG4gICAgICAgIHN1cGVyKG9wdHMpXG5cbiAgICBpbml0aWFsaXplOiAob3B0cykgLT5cbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIEBjb250YWluZXIgPSBAJGVsLmZpbmQoXCIjY29ubmVjdC1tYXNvbnJ5XCIpXG5cblxuICAgICAgICBAY29udGFpbmVyLnBhY2tlcnlcbiAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJy5pdGVtJ1xuICAgICAgICAgICAgY29sdW1uV2lkdGg6Jy5zaHVmZmxlX3NpemVyJ1xuICAgICAgICAgICAgZ3V0dGVyOnBhcnNlSW50ICQoJy5zaHVmZmxlX3NpemVyJykuY3NzKCdtYXJnaW4tbGVmdCcpXG4gICAgICAgICAgICBpc0luaXRMYXlvdXQ6IHRydWVcblxuICAgICAgICBAY29udGFpbmVyLnBhY2tlcnkoJ29uJyAsICdsYXlvdXRDb21wbGV0ZScgLCBAb25MYXlvdXRDb21wbGV0ZSlcblxuXG5cbiAgICAgICAgQG1vZGVsLm9uICdhZGQnICwgQHJlbmRlclBvc3RcbiAgICAgICAgQG1vZGVsLm9uICdtb2RlbFNldEFkZGVkJyAsIEBtb2RlbFNldEFkZGVkXG4gICAgICAgIEByZXNldEV2ZW50cygpXG5cblxuXG5cbiAgICByZXNldEV2ZW50czogPT5cbiAgICAgICAgJCh3aW5kb3cpLm9uICdzY3JvbGwnICwgIEBvblNjcm9sbFxuICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgIEBkZWxlZ2F0ZUV2ZW50cyhAZ2VuZXJhdGVFdmVudHMoKSlcblxuICAgICAgICBpZiBAaXNQaG9uZVxuICAgICAgICAgICAgQHJlc2l6ZUltYWdlcygpXG5cbiAgICBnZW5lcmF0ZUV2ZW50czogLT5cbiAgICAgICAgZXZlbnRzID0ge31cblxuICAgICAgICBldmVudHNbJ2NsaWNrICNzb2NpYWwgYSddID0gXCJvblNvY2lhbENsaWNrXCJcbiAgICAgICAgXG4gICAgICAgIGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ3RhYmxldCcpKSB8fCAoJCgnaHRtbCcpLmhhc0NsYXNzKCdwaG9uZScpKVxuICAgICAgICAgICAgZXZlbnRzWydjbGljayAuaXRlbSAuc3F1YXJlLXBvc3QnXSA9IFwic2ltdWxhdGVIb3ZlclwiXG4gICAgICAgICAgICBldmVudHNbJ2NsaWNrIC5pdGVtIC5ob3Zlci1vdmVybGF5J10gPSBcImdvVG9Qb3N0XCJcblxuICAgICAgICByZXR1cm4gZXZlbnRzXG5cbiAgICBzaW11bGF0ZUhvdmVyOiAoZSkgLT5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICQoJy5pdGVtJykucmVtb3ZlQ2xhc3MgJ3RvdWNoLWhvdmVyJ1xuICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuaXRlbScpLmFkZENsYXNzICd0b3VjaC1ob3ZlcidcblxuICAgIGdvVG9Qb3N0OiAoZSkgLT5cbiAgICAgICAgaWYgISgkKGUudGFyZ2V0KS5wYXJlbnRzKCcuaXRlbScpLmhhc0NsYXNzICd0b3VjaC1ob3ZlcicpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgd2luZG93Lm9wZW4oJChlLnRhcmdldCkucGFyZW50cygnYScpLmF0dHIoJ2hyZWYnKSwgXCJfYmxhbmtcIilcblxuXG4gICAgb25Tb2NpYWxDbGljazogKGUpIC0+XG4gICAgICAgICR0YXJnZXQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KFwiYVwiKVxuICAgICAgICBUcmFja2luZy5nYVRyYWNrRWxlbWVudCgkdGFyZ2V0KVxuXG5cbiAgICBvblNjcm9sbDogKGUpPT5cblxuICAgICAgICBzY3JvbGxQb3NpdGlvbiA9IE1hdGguY2VpbCAkKHdpbmRvdykuc2Nyb2xsVG9wKClcbiAgICAgICAgc2Nyb2xsTWF4ID0gTWF0aC5mbG9vciAkKGRvY3VtZW50KS5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKVxuXG4gICAgICAgIGlmIHNjcm9sbFBvc2l0aW9uIGlzIHNjcm9sbE1heFxuXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmICdzY3JvbGwnICwgIEBvblNjcm9sbFxuICAgICAgICAgICAgQGxvYWRQb3N0cygpXG5cbiAgICBsb2FkUG9zdHM6ID0+XG4gICAgICAgIEBwb3N0U2V0ID0gW11cbiAgICAgICAgQG1vZGVsLnRvID0gQGdldExhc3RJdGVtRGF0ZSgpXG5cbiAgICAgICAgQG1vZGVsLnNldFVybChAYXBwTW9kZWwuZ2V0KCdzZXJ2aWNlcycpLmxpc3QpXG4gICAgICAgIEBtb2RlbC5sb2FkTW9yZSgpXG5cbiAgICBnZXRMYXN0SXRlbURhdGU6IC0+XG4gICAgICAgIGxhc3RJdGVtID0gQGNvbnRhaW5lci5maW5kKCcuaXRlbScpLmxhc3QoKVxuICAgICAgICBpZiBsYXN0SXRlbS5sZW5ndGggPiAwXG5cbiAgICAgICAgICAgIHJldHVybiBsYXN0SXRlbS5kYXRhKCdkYXRlJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICBtb2RlbFNldEFkZGVkOiA9PlxuICAgICAgICAkaXRlbXMgPSAkKEBwb3N0U2V0KVxuXG5cbiAgICByZW5kZXJQb3N0OiAocG9zdCkgPT5cbiAgICAgICAgaWdub3JlID0gZmFsc2VcblxuICAgICAgICBpZiBwb3N0LmdldCgncG9zdF90eXBlJykgaXMgJ2ZhY2Vib29rJ1xuICAgICAgICAgICAgaWYgcG9zdC5nZXQoJ3R5cGUnKSBpcyAnc3RhdHVzJ1xuICAgICAgICAgICAgICAgIGlnbm9yZSA9IHRydWVcblxuICAgICAgICBpZiAhaWdub3JlXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEgPVxuICAgICAgICAgICAgICAgIGVsOkBjb250YWluZXJcbiAgICAgICAgICAgICAgICBtb2RlbDpwb3N0XG5cbiAgICAgICAgICAgIHBvc3RWaWV3ID0gbmV3IFBvc3RWaWV3c1twb3N0LmdldCgncG9zdF90eXBlJyldIGluc3RhbmNlRGF0YVxuICAgICAgICAgICAgcG9zdFZpZXcucmVuZGVyKClcblxuICAgICAgICAgICAgQGNvbnRhaW5lci5hcHBlbmQocG9zdFZpZXcuJGVsKVxuICAgICAgICAgICAgQGNvbnRhaW5lci5wYWNrZXJ5KCdhcHBlbmRlZCcgLCBwb3N0Vmlldy4kZWwpXG4gICAgICAgICAgICBAY29udGFpbmVyLnBhY2tlcnkoJ2ZpdCcsIHBvc3RWaWV3LiRlbClcblxuICAgICAgICAgICAgI0Bwb3N0U2V0LnB1c2ggcG9zdFZpZXcuJGVsWzBdXG5cblxuXG5cblxuICAgICAgICAgICAgQHVuZGVsZWdhdGVFdmVudHMoKVxuICAgICAgICAgICAgQGRlbGVnYXRlRXZlbnRzKEBnZW5lcmF0ZUV2ZW50cygpKVxuXG5cblxuICAgIG9uTGF5b3V0Q29tcGxldGU6IChwYWNrZXJ5ICwgaXRlbXMpID0+XG4gICAgICAgIGlmICFAaXNQaG9uZVxuICAgICAgICAgICAgY2FwdGlvblNpemUgPSAxMDBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2FwdGlvblNpemUgPSA1MFxuXG4gICAgICAgIGZvciBpdGVtIGluIGl0ZW1zXG4gICAgICAgICAgICBzZXRUaW1lb3V0IC0+XG4gICAgICAgICAgICAgICAgJChpdGVtLmVsZW1lbnQpLmZpbmQoXCIucG9zdC1ib2R5XCIpLnN1Y2NpbmN0KHtcbiAgICAgICAgICAgICAgICAgICAgc2l6ZToxMDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKGl0ZW0uZWxlbWVudCkuZmluZChcIi5wb3N0LWJvZHlcIikuY3NzKCdkaXNwbGF5JyAsICdpbmxpbmUnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKGl0ZW0uZWxlbWVudCkuZmluZCgnLnNxdWFyZS1wb3N0LnNtYWxsIC5jYXB0aW9uJykuc3VjY2luY3Qoe1xuICAgICAgICAgICAgICAgICAgICBzaXplOmNhcHRpb25TaXplXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAsXG4gICAgICAgICAgICAgICAgNDAwXG5cblxuXG4gICAgcmVzaXplSW1hZ2VzOiAoZSkgLT5cbiAgICAgICAgZm9yIGltZyBpbiAkKCcuc3F1YXJlLXBvc3QubGFyZ2UnKVxuICAgICAgICAgICAgJChpbWcpLmNzcyB7d2lkdGg6IHdpbmRvdy5pbm5lcldpZHRofVxuXG4gICAgICAgICMgZm9yIGltZyBpbiAkKCcuc3F1YXJlLXBvc3Quc21hbGwnKVxuICAgICAgICAjICAgICAkKGltZykuY3NzIHtoZWlnaHQ6IHdpbmRvdy5pbm5lcldpZHRoICogLjQ5fVxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29ubmVjdFZpZXdcblxuXG4iLCJWaWV3QmFzZSA9IHJlcXVpcmUgJy4vYWJzdHJhY3QvVmlld0Jhc2UuY29mZmVlJ1xuQXBwTW9kZWwgPSByZXF1aXJlICcuLi9tb2RlbHMvQXBwTW9kZWwuY29mZmVlJ1xuU2hhcmUgPSByZXF1aXJlICcuLi91dGlscy9zaGFyZS5jb2ZmZWUnXG5UcmFja2luZyA9IHJlcXVpcmUgJy4uL3V0aWxzL3RyYWNrLmNvZmZlZSdcblxuY2xhc3MgSGVhZGVyVmlldyBleHRlbmRzIFZpZXdCYXNlXG5cbiAgICBpbml0aWFsaXplOiAob3B0cykgLT5cbiAgICAgICAgc3VwZXIgb3B0c1xuXG4gICAgICAgIEBzZWN0aW9ucyA9ICQoJ3NlY3Rpb24uc2VjdGlvbicpXG5cbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbCBAb25TY3JvbGxcbiAgICAgICAgQGRlbGVnYXRlRXZlbnRzIEBnZW5lcmF0ZUV2ZW50cygpXG4gICAgICAgIEBwb3B1bGF0ZVR3aXR0ZXJTaGFyZSgpXG5cblxuICAgIGdlbmVyYXRlRXZlbnRzOiAtPlxuXG4gICAgICAgICQoJ2JvZHknKS5vbiAnY2xpY2snLCBAaGlkZUhlYWRlckxvY2FsaXphdGlvblxuXG4gICAgICAgIGV2ZW50cyA9IHt9XG5cbiAgICAgICAgZXZlbnRzWydtb3VzZWVudGVyICNuYXYgbGkgaW1nLnNoYXJlLWljb24nXSA9IFwic2hvd0hlYWRlclNoYXJpbmdcIlxuICAgICAgICBldmVudHNbJ21vdXNlbGVhdmUgI25hdi13cmFwcGVyJ10gPSBcImhpZGVIZWFkZXJTaGFyaW5nXCJcbiAgICAgICAgZXZlbnRzWydjbGljayAjaGVhZGVyLXNoYXJlLWZiJ10gPSBcInNoYXJlRmFjZWJvb2tcIlxuICAgICAgICBldmVudHNbJ2NsaWNrICNuYXYgbGkgYS5saW5rJ10gPSBcInNjcm9sbFRvXCJcbiAgICAgICAgZXZlbnRzWydjbGljayAjbmF2LXNlbGVjdCddID0gXCJ0b2dnbGVIZWFkZXJMb2NhbGl6YXRpb25cIlxuICAgICAgICBldmVudHNbJ2NsaWNrIHAuY291bnRyeSddID0gXCJjaGFuZ2VMYW5nYXVnZVwiXG4gICAgICAgIGV2ZW50c1snY2xpY2sgaW1nLmZsYWcnXSA9IFwiY2hhbmdlTGFuZ2F1Z2VcIlxuICAgICAgICBldmVudHNbJ2NsaWNrIGltZyNoZWFkZXItbG9nbyddID0gXCJsb2dvTGlua291dFwiXG4gICAgICAgIGV2ZW50c1snY2xpY2sgYSNuYXYtcHJlb3JkZXInXSA9IFwidHJhY2tQcmVvcmRlclwiXG4gICAgICAgIGV2ZW50c1snY2xpY2sgYSNtb2JpbGUtbmF2LXByZW9yZGVyJ10gPSBcInRyYWNrUHJlb3JkZXJcIlxuXG4gICAgICAgIGlmIE1vZGVybml6ci50b3VjaFxuICAgICAgICAgICAgZXZlbnRzWyd0b3VjaGVuZCBpbWcjbW9iaWxlLW5hdi1pY29uJ10gPSBcInNob3dNb2JpbGVOYXZcIlxuICAgICAgICAgICAgZXZlbnRzWyd0b3VjaGVuZCBpbWcjbW9iaWxlLW5hdi1jbG9zZSddID0gXCJoaWRlTW9iaWxlTmF2XCJcbiAgICAgICAgICAgIGV2ZW50c1sndG91Y2hlbmQgI25hdiBsaSBpbWcuc2hhcmUtaWNvbiddID0gXCJoYW5kbGVIZWFkZXJTaGFyaW5nXCJcbiAgICAgICAgICAgIGV2ZW50c1sndG91Y2hlbmQgI2hlYWRlci1zaGFyZS1mYiddID0gXCJzaGFyZUZhY2Vib29rXCJcbiAgICAgICAgICAgIGV2ZW50c1sndG91Y2hlbmQgI25hdiBsaSBhLmxpbmsnXSA9IFwic2Nyb2xsVG9cIlxuICAgICAgICAgICAgZXZlbnRzWyd0b3VjaGVuZCAjbW9iaWxlLW5hdiBsaSBhJ10gPSBcInNjcm9sbFRvXCJcbiAgICAgICAgICAgIGV2ZW50c1sndG91Y2hlbmQgaW1nI3Njcm9sbC10by1sZWFybiddID0gXCJzY3JvbGxUb1wiXG5cblxuXG4gICAgICAgIHJldHVybiBldmVudHNcblxuXG5cblxuICAgIHRyYWNrUHJlb3JkZXI6IChlKSA9PlxuICAgICAgICBpZCA9ICQoZS50YXJnZXQpLmF0dHIgJ2lkJ1xuICAgICAgICBUcmFja2luZy5nYVRyYWNrRWxlbWVudCgkKCcjJyArIGlkKSlcblxuICAgIGxvZ29MaW5rb3V0OiAoZSkgPT5cblxuXG4gICAgY2hhbmdlTGFuZ2F1Z2U6IChlKSA9PlxuICAgICAgICBnb1RvID0gJChlLnRhcmdldCkucGFyZW50KCkuZmluZChcInAuY291bnRyeVwiKS5kYXRhICdjb3VudHJ5J1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSAnL2J1cm4vJyArIGdvVG9cblxuICAgIHRvZ2dsZUhlYWRlckxvY2FsaXphdGlvbjogKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGxvY1dyYXBwZXIgPSAkKFwiLmxvY2FsaXphdGlvbi13cmFwcGVyXCIpXG4gICAgICAgIGFycm93ID0gJChcIiNuYXYtc2VsZWN0IGkuZmEtYW5nbGUtdXBcIilcblxuICAgICAgICBpZiBsb2NXcmFwcGVyLmhhc0NsYXNzICdvcGVuJ1xuICAgICAgICAgICAgVHdlZW5NYXgudG8gJChsb2NXcmFwcGVyKSwgLjUsXG4gICAgICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnXG4gICAgICAgICAgICBUd2Vlbk1heC50byAkKGFycm93KSwgLjM1LFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwXG5cbiAgICAgICAgICAgIGxvY1dyYXBwZXIucmVtb3ZlQ2xhc3MgJ29wZW4nXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvICQoYXJyb3cpLCAuMzUsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDE4MFxuICAgICAgICAgICAgVHdlZW5NYXgudG8gJChsb2NXcmFwcGVyKSwgLjUsXG4gICAgICAgICAgICAgICAgYWxwaGE6IDEsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuXG4gICAgICAgICAgICBsb2NXcmFwcGVyLmFkZENsYXNzICdvcGVuJ1xuXG4gICAgaGlkZUhlYWRlckxvY2FsaXphdGlvbjogKGUpID0+XG4gICAgICAgIGxvY1dyYXBwZXIgPSAkKFwiLmxvY2FsaXphdGlvbi13cmFwcGVyXCIpXG4gICAgICAgIGFycm93ID0gJChcIiNuYXYtc2VsZWN0IGkuZmEtYW5nbGUtdXBcIilcblxuICAgICAgICBUd2Vlbk1heC50byAkKGxvY1dyYXBwZXIpLCAuNSxcbiAgICAgICAgICAgIGFscGhhOiAwLFxuICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnXG4gICAgICAgIFR3ZWVuTWF4LnRvICQoYXJyb3cpLCAuMzUsXG4gICAgICAgICAgICByb3RhdGlvbjogMFxuXG4gICAgICAgIGxvY1dyYXBwZXIucmVtb3ZlQ2xhc3MgJ29wZW4nXG5cbiAgICBzaG93TW9iaWxlTmF2OiAoZSkgLT5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIFR3ZWVuTWF4LnNldCAkKCcjbW9iaWxlLW5hdi1jbG9zZScpLFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiBcImNlbnRlciBib3R0b21cIlxuXG4gICAgICAgIFR3ZWVuTWF4LnRvICQoJyNtb2JpbGUtbmF2LXdyYXBwZXInKSwgLjY1LFxuICAgICAgICAgICAgeTogODk4LFxuICAgICAgICAgICAgekluZGV4OiA1NSxcbiAgICAgICAgICAgIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAgICAgVHdlZW5NYXgudG8gJCgnI21vYmlsZS1uYXYtY2xvc2UnKSwgLjEsXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uWDogMCxcbiAgICAgICAgICAgICAgICAgICAgZWFzZTogTGluZWFyLmVhc2VOb25lXG5cbiAgICBoaWRlTW9iaWxlTmF2OiAoZSkgLT5cbiAgICAgICAgaWYgZS5wcmV2ZW50RGVmYXVsdD9cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBUd2Vlbk1heC50byAkKCcjbW9iaWxlLW5hdi1jbG9zZScpLCAuMSxcbiAgICAgICAgICAgIHJvdGF0aW9uWDogOTAsXG4gICAgICAgICAgICBlYXNlOiBMaW5lYXIuZWFzZU5vbmUsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiA9PlxuICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnRvICQoJyNtb2JpbGUtbmF2LXdyYXBwZXInKSwgLjY1LFxuICAgICAgICAgICAgICAgICAgICBkZWxheTogLjQ1LFxuICAgICAgICAgICAgICAgICAgICB5OiAwXG5cbiAgICBzaG93SGVhZGVyU2hhcmluZzogKGUpID0+XG4gICAgICAgICQoJyNuYXYtd3JhcHBlcicpLmFkZENsYXNzICdzaG93LXNoYXJlLWljb25zJ1xuICAgICAgICAkKCdpLmZhLWZhY2Vib29rLCBpLmZhLXR3aXR0ZXInKS5hZGRDbGFzcyAndmlzaWJsZSdcblxuICAgIGhpZGVIZWFkZXJTaGFyaW5nOiAoZSkgPT5cbiAgICAgICAgJCgnI25hdi13cmFwcGVyJykucmVtb3ZlQ2xhc3MgJ3Nob3ctc2hhcmUtaWNvbnMnXG4gICAgICAgICQoJ2kuZmEtZmFjZWJvb2ssIGkuZmEtdHdpdHRlcicpLnJlbW92ZUNsYXNzICd2aXNpYmxlJ1xuXG4gICAgaGFuZGxlSGVhZGVyU2hhcmluZzogKGUpID0+XG4gICAgICAgIG5hdldyYXBwZXIgPSAkKFwiI25hdi13cmFwcGVyXCIpXG5cbiAgICAgICAgaWYgbmF2V3JhcHBlci5oYXNDbGFzcygnc2hvdy1zaGFyZS1pY29ucycpXG4gICAgICAgICAgICBAaGlkZUhlYWRlclNoYXJpbmcoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2hvd0hlYWRlclNoYXJpbmcoKVxuXG4gICAgc2hhcmVGYWNlYm9vazogKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBmYkNvcHkgPSBAbW9kZWwuZ2V0KCdzb2NpYWwnKS5mYWNlYm9va1xuICAgICAgICBjYXB0aW9uID0gZmJDb3B5LmNhcHRpb25cbiAgICAgICAgdGl0bGUgPSBmYkNvcHkudGl0bGVcbiAgICAgICAgaW1hZ2UgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgZmJDb3B5LmltYWdlXG4gICAgICAgIGxpbmsgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gICAgICAgIGRlc2NyaXB0aW9uID0gZmJDb3B5LmRlc2NyaXB0aW9uXG5cbiAgICAgICAgU2hhcmUuZmJTaGFyZSB0aXRsZSAsIGNhcHRpb24sIGltYWdlICwgbGluaywgZGVzY3JpcHRpb25cblxuICAgIHBvcHVsYXRlVHdpdHRlclNoYXJlOiAtPlxuICAgICAgICBocmVmID0gJChcIiN0d2l0dGVyXCIpLmF0dHIoJ2hyZWYnKVxuICAgICAgICB0d2l0dGVyQ29weSA9IEBtb2RlbC5nZXQoJ3NvY2lhbCcpLnR3aXR0ZXJcbiAgICAgICAgdHdpdHRlclNoYXJlTWVzc2FnZSA9IHR3aXR0ZXJDb3B5Lm1lc3NhZ2VcblxuICAgICAgICBocmVmID0gXCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHR3aXR0ZXJTaGFyZU1lc3NhZ2UpXG5cbiAgICAgICAgJChcIiN0d2l0dGVyLXNoYXJlXCIpLmF0dHIoJ2hyZWYnICwgaHJlZilcblxuICAgIHNjcm9sbFRvOiAoZSwganVtcCkgPT5cbiAgICAgICAgaWYgZS5wcmV2ZW50RGVmYXVsdD9cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBpZiBlLnN0b3BQcm9wYWdhdGlvbj9cbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAkdCA9ICQoZS50YXJnZXQpXG4gICAgICAgIHNlY3Rpb24gPSAkdC5kYXRhKCdzY3JvbGx0bycpXG4gICAgICAgIGdvVG9TZWN0aW9uID0gJCgnIycgKyBzZWN0aW9uKVxuICAgICAgICB5ID0gKGdvVG9TZWN0aW9uLm9mZnNldCgpLnRvcCAtIDYwKVxuXG4gICAgICAgIGR1cmF0aW9uID0gaWYganVtcCB0aGVuIDEgZWxzZSAxMDAwXG5cbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUge1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiB5ICsgJ3B4J1xuICAgICAgICB9LCBkdXJhdGlvblxuXG4gICAgICAgIEBoaWRlTW9iaWxlTmF2KGUpXG5cbiAgICBvblNjcm9sbDogKGUpID0+XG4gICAgICAgIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKSArIDYwXG5cbiAgICAgICAgZm9yIHNlY3Rpb24gaW4gQHNlY3Rpb25zXG4gICAgICAgICAgICAkaGVpZ2h0ID0gJChzZWN0aW9uKS5oZWlnaHQoKVxuICAgICAgICAgICAgJG9mZnNldCA9ICQoc2VjdGlvbikub2Zmc2V0KCkudG9wIC0gKHdpbmRvdy5pbm5lckhlaWdodC8yKVxuXG4gICAgICAgICAgICBpZiAkb2Zmc2V0IDw9IHNjcm9sbFRvcCA8PSAoJG9mZnNldCArICRoZWlnaHQpXG4gICAgICAgICAgICAgICAgJHMgPSAkKHNlY3Rpb24pLmF0dHIgJ2lkJ1xuICAgICAgICAgICAgICAgICQoJyNuYXYgbGkgYScpLnJlbW92ZUNsYXNzICdhY3RpdmUnXG4gICAgICAgICAgICAgICAgJCgnYS5saW5rI25hdi0nICsgJHMpLmFkZENsYXNzICdhY3RpdmUnXG5cblxuICAgIGNsYXNzaWNGaXg6IChlKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyAndGVzdCdcbiAgICAgICAgY29uc29sZS5sb2cgJyAgICAnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJWaWV3XG4iLCJcblZpZXdCYXNlID0gcmVxdWlyZSAnLi9hYnN0cmFjdC9WaWV3QmFzZS5jb2ZmZWUnXG5BcHBNb2RlbCA9IHJlcXVpcmUgJy4uL21vZGVscy9BcHBNb2RlbC5jb2ZmZWUnXG5UcmFja2luZyA9IHJlcXVpcmUgJy4uL3V0aWxzL3RyYWNrLmNvZmZlZSdcblxuY2xhc3MgSG9tZVZpZXcgZXh0ZW5kcyBWaWV3QmFzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG4gICAgICAgIEBhcHBNb2RlbCA9IEFwcE1vZGVsLmdldEluc3RhbmNlKClcblxuICAgICAgICBzdXBlcihvcHRzKVxuXG4gICAgaW5pdGlhbGl6ZTogKG9wdHMpIC0+XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICBAZGVsZWdhdGVFdmVudHMgQGdlbmVyYXRlRXZlbnRzKClcbiAgICAgICAgQGluaXRWaWRlbygpXG4gICAgICAgIEBwdWxzaW5nXG5cbiAgICBnZW5lcmF0ZUV2ZW50czogLT5cbiAgICAgICAgZXZlbnRzID0ge31cblxuICAgICAgICBldmVudHNbJ2NsaWNrIGltZyNzY3JvbGwtdG8tbGVhcm4nXSA9IFwic2Nyb2xsVG9cIlxuICAgICAgICBpZiAhQGlzUGhvbmVcbiAgICAgICAgICAgIGV2ZW50c1snY2xpY2sgI3BsYXktYnRuLWhvdmVyJ10gPSBcInBsYXlWaWRlb1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGV2ZW50c1snY2xpY2sgaW1nI3BsYXktYnRuLWhvdmVyJ10gPSBcInNob3dGYWxsYmFja1wiXG4gICAgICAgIGV2ZW50c1snY2xpY2sgYS5wcmUtb3JkZXInXSA9IFwibm90aWZ5TWVcIlxuICAgICAgICBldmVudHNbJ2NsaWNrIC5vdmVybGF5LWNvbnRhaW5lciBidXR0b24nXSA9ICdjbGlja0J1dHRvbidcblxuICAgICAgICByZXR1cm4gZXZlbnRzXG5cbiAgICBzY3JvbGxUbzogKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgICR0ID0gJChlLnRhcmdldClcbiAgICAgICAgc2VjdGlvbiA9ICR0LmRhdGEoJ3Njcm9sbHRvJylcbiAgICAgICAgZ29Ub1NlY3Rpb24gPSAkKCcjJyArIHNlY3Rpb24pXG5cbiAgICAgICAgVHdlZW5NYXgudG8gd2luZG93ICwgMSAsXG4gICAgICAgICAgICBzY3JvbGxUbzpcbiAgICAgICAgICAgICAgICB5OmdvVG9TZWN0aW9uLm9mZnNldCgpLnRvcCAtIDYwXG5cblxuICAgIG5vdGlmeU1lOiAoZSkgPT5cbiAgICAgICAgaWQgPSAkKGUudGFyZ2V0KS5hdHRyICdpZCdcbiAgICAgICAgVHJhY2tpbmcuZ2FUcmFja0VsZW1lbnQoJCgnIycgKyBpZCkpXG5cblxuICAgIGluaXRWaWRlbzogLT5cbiAgICAgICAgQHZpZGVvID0gbmV3IE1lZGlhRWxlbWVudFBsYXllciBcIiNoZXJvLXZpZGVvXCIgLFxuICAgICAgICAgICAgdmlkZW9XaWR0aDpcIjEwMCVcIlxuICAgICAgICAgICAgdmlkZW9IZWlnaHQ6XCIxMDAlXCJcbiAgICAgICAgICAgIGFsd2F5c1Nob3d2bnRyb2xzOmZhbHNlXG4gICAgICAgICAgICBwbHVnaW5QYXRoOiAnL2J1cm4vc3dmLydcbiAgICAgICAgICAgIGZlYXR1cmVzOlsncGxheXBhdXNlJywnY3VycmVudCcsJ3Byb2dyZXNzJywnZHVyYXRpb24nLCd2b2x1bWUnXVxuICAgICAgICAgICAgc3VjY2VzczogKG1lLCBlbCkgPT5cbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3Bvc3RlcicsICcnKVxuICAgICAgICAgICAgICAgIG1lLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJyAsIEBvblZpZGVvUGF1c2UpXG4gICAgICAgICAgICAgICAgbWUuYWRkRXZlbnRMaXN0ZW5lcigncGxheScgLCBAb25WaWRlb1BsYXkpXG5cbiAgICAgICAgQHZpZGVvLnBhdXNlKClcblxuICAgIHBsYXlWaWRlbzogPT5cbiAgICAgICAgaWYgQGlzUGhvbmUgfHwgQGlzVGFibGV0XG4gICAgICAgICAgICByZXR1cm4gQHNob3dGYWxsYmFjaygpXG5cbiAgICAgICAgQHZpZGVvLnBsYXkoKVxuXG5cbiAgICBzaG93RmFsbGJhY2s6ID0+XG4gICAgICAgIFR3ZWVuTWF4LnRvICQoJyNoZXJvLW92ZXJsYXknKSwgLjM1LFxuICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICBkaXNwbGF5OiAnbm9uZSdcblxuICAgICAgICBUd2Vlbk1heC50byAkKCcjbWVwXzAnKSwgLjM1LFxuICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICBkaXNwbGF5OiAnbm9uZSdcblxuICAgICAgICBUd2Vlbk1heC50byAkKCcjbWFycXVlZS1mYWxsYmFjaycpLCAuNSxcbiAgICAgICAgICAgIGFscGhhOiAxLFxuICAgICAgICAgICAgekluZGV4OiAxMFxuXG5cbiAgICBvblZpZGVvUGF1c2U6ID0+XG4gICAgICAgICNjb25zb2xlLmxvZyAncGF1c2VkJ1xuICAgICAgICAkKCcjaGVyby1vdmVybGF5JykuY3NzIHtiYWNrZ3JvdW5kOiAnbm9uZSd9XG4gICAgICAgICQoJy5vdmVybGF5LWNvbnRhaW5lciwgcCN3YXRjaC12aWRlbycpLmNzcyB7ZGlzcGxheTogJ25vbmUnfVxuICAgICAgICAjJCgncCN3YXRjaC12aWRlbycpLmNzcyB7ZGlzcGxheTogJ25vbmUnfVxuICAgICAgICAkKCcubWVqcy1jb250cm9scy1jb250YWluZXInKS5jc3Mge3pJbmRleDogMTAwMDAwMH1cblxuICAgICAgICBUd2Vlbk1heC5zZXQgJCgnI3BsYXktYnRuJyksXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG5cbiAgICAgICAgVHdlZW5NYXguc2V0ICQoJyNwbGF5LWJ0bi1ob3ZlcicpLFxuICAgICAgICAgICAgb3BhY2l0eTogMFxuXG4gICAgICAgIFR3ZWVuTWF4LnRvIEAkZWwuZmluZChcIiNoZXJvLW92ZXJsYXlcIikgLCAxICxcbiAgICAgICAgICAgIGF1dG9BbHBoYToxXG5cbiAgICAgICAgQHB1bHNpbmcgPSBuZXcgVGltZWxpbmVNYXgoe2FsaWduOiBcInN0YXJ0XCIsIHN0YWdnZXI6IDEsIHBhdXNlZDogdHJ1ZSwgcmVwZWF0OiAtMSwgcmVwZWF0RGVsYXk6IC4zNSwgeW95bzogdHJ1ZX0pXG4gICAgICAgIEBwdWxzaW5nLmFkZCBUd2Vlbk1heC50bygkKCcjcGxheS1idG4nKSwgMC44NSwge2FscGhhOiAwLCBlYXNlOiBRdWFkLmVhc2VJbn0pLCBcIm5vcm1hbFwiLCAwLjFcbiAgICAgICAgQHB1bHNpbmcuYWRkIFR3ZWVuTWF4LnRvKCQoJyNwbGF5LWJ0bi1ob3ZlcicpLCAwLjg1LCB7YWxwaGE6IDEsIGVhc2U6IFF1YWQuZWFzZUlufSksIFwibm9ybWFsXCIsIDAuMVxuICAgICAgICBAcHVsc2luZy5yZXN1bWUoKVxuXG4gICAgb25WaWRlb1BsYXk6ID0+XG4gICAgICAgIFRyYWNraW5nLmdhVHJhY2tFbGVtZW50KCQoJyNwbGF5LWJ0bi1ob3ZlcicpKVxuICAgICAgICBUd2Vlbk1heC50byBAJGVsLmZpbmQoXCIjaGVyby1vdmVybGF5XCIpICwgLjUgLFxuICAgICAgICAgICAgYXV0b0FscGhhOjBcblxuICAgICAgICBpZiBAcHVsc2luZyAhPSB1bmRlZmluZWRcbiAgICAgICAgICAgIEBwdWxzaW5nLmtpbGwoKVxuXG5cbiAgICBzaG93SG92ZXI6ID0+XG4gICAgICAgIFR3ZWVuTWF4LnRvICQoJyNwbGF5LWJ0bicpLCAuMzUsXG4gICAgICAgICAgICBhbHBoYTogMCxcbiAgICAgICAgICAgIHpJbmRleDogLTVcblxuICAgICAgICBUd2Vlbk1heC50byAkKCcjcGxheS1idG4taG92ZXInKSwgLjM1LFxuICAgICAgICAgICAgYWxwaGE6IDEsXG4gICAgICAgICAgICB6SW5kZXg6IDVcblxuXG4gICAgaGlkZUhvdmVyOiA9PlxuICAgICAgICBUd2Vlbk1heC50byAkKCcjcGxheS1idG4taG92ZXInKSwgLjM1LFxuICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICB6SW5kZXg6IC01LFxuICAgICAgICAgICAgZGVsYXk6IC4yNVxuXG4gICAgICAgIFR3ZWVuTWF4LnRvICQoJyNwbGF5LWJ0bicpLCAuMzUsXG4gICAgICAgICAgICBhbHBoYTogMSxcbiAgICAgICAgICAgIHpJbmRleDogNSxcbiAgICAgICAgICAgIGRlbGF5OiAuMjVcblxuXG4gICAgY2xpY2tCdXR0b246IChlKSA9PlxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIb21lVmlld1xuXG5cbiIsIlZpZXdCYXNlID0gcmVxdWlyZSAnLi9hYnN0cmFjdC9WaWV3QmFzZS5jb2ZmZWUnXG5BcHBNb2RlbCA9IHJlcXVpcmUgJy4uL21vZGVscy9BcHBNb2RlbC5jb2ZmZWUnXG5UcmFja2luZyA9IHJlcXVpcmUgJy4uL3V0aWxzL3RyYWNrLmNvZmZlZSdcblxuXG5jbGFzcyBTcGVjc1ZpZXcgZXh0ZW5kcyBWaWV3QmFzZVxuXG4gICAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxuICAgICAgICBAbW9kZWwgPSBBcHBNb2RlbC5nZXRJbnN0YW5jZSgpXG5cblxuICAgICAgICBzdXBlcihvcHRzKVxuXG4gICAgaW5pdGlhbGl6ZTogKG9wdHMpIC0+XG4gICAgICAgIHN1cGVyKG9wdHMpXG5cbiAgICAgICAgQGRlbGVnYXRlRXZlbnRzKEBnZW5lcmF0ZUV2ZW50cygpKVxuICAgICAgICBAaXNXZWJHTCA9IEBpc1dlYkdMKClcbiAgICAgICAgQGluaXRpYXRlU3dpcGVyR2FsbGVyaWVzKClcblxuXG5cbiAgICBnZW5lcmF0ZUV2ZW50czogLT5cbiAgICAgICAgZXZlbnRzID0ge31cblxuICAgICAgICAkKHdpbmRvdykub24gJ3Jlc2l6ZScsIEBjaGVja0ZvclJhY2tldFxuICAgICAgICAkKHdpbmRvdykub24gJ2xvYWQnLCBAY2hlY2tGb3JSYWNrZXRcblxuICAgICAgICBldmVudHNbJ2NsaWNrIGEub3JhbmdlLWJ0biddID0gJ3RyYWNrUHJlb3JkZXJzJ1xuXG4gICAgICAgIGlmICFAaXNQaG9uZVxuICAgICAgICAgICAgZXZlbnRzWydjbGljayBhI3NlZS1tb3JlLXNwZWNzJ10gPSBcInRvZ2dsZVRhYmxlXCJcbiAgICAgICAgICAgIGV2ZW50c1snY2xpY2sgYSNjbG9zZS10YWJsZSddID0gXCJ0b2dnbGVUYWJsZVwiXG5cblxuICAgICAgICByZXR1cm4gZXZlbnRzXG5cblxuICAgIHRyYWNrUHJlb3JkZXJzOiAoZSkgPT5cbiAgICAgICAgVHJhY2tpbmcuZ2FUcmFja0VsZW1lbnQoJChlLnRhcmdldCkpXG5cbiAgICB0b2dnbGVUYWJsZTogKGUpID0+XG4gICAgICAgIGlmIGUucHJldmVudERlZmF1bHQ/XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgJCgnI3NlZS1tb3JlLXNwZWNzJykudG9nZ2xlQ2xhc3MgJ3Nob3dpbmcnXG5cbiAgICAgICAgaWYgJChzcGVjcykuaGFzQ2xhc3MgJ3Nob3dpbmctdGFibGUnXG4gICAgICAgICAgICBAYW5pbWF0ZVRhYmxlKCdoaWRlJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGFuaW1hdGVUYWJsZSgnc2hvdycpXG4gICAgICAgICAgICBUd2Vlbk1heC50byB3aW5kb3cgLCAuNSAsXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG86XG4gICAgICAgICAgICAgICAgICAgIHk6IDIyODAgLSAod2luZG93LmlubmVySGVpZ2h0IC0gJCgnI3NwZWNzLXRhYmxlJykuaGVpZ2h0KCkpIC8gMlxuXG4gICAgICAgICAgICBUcmFja2luZy5nYVRyYWNrRWxlbWVudCgkKCcjc2VlLW1vcmUtc3BlY3MnKSlcblxuICAgIGFuaW1hdGVUYWJsZTogKG9wdHMpID0+XG4gICAgICAgIHNwZWNzID0gJCgnI3NwZWNzJylcbiAgICAgICAgdGFibGVSb3dzID0gJCgnI3NwZWNzLXRhYmxlJykuZmluZCAndHInXG4gICAgICAgIHRhYmxlSGVpZ2h0ID0gJCgnI3NwZWNzLXRhYmxlJykuaGVpZ2h0KClcblxuICAgICAgICBpZiB3aW5kb3cuaW5uZXJXaWR0aCA8IDg1MFxuICAgICAgICAgICAgZXhwYW5kZWRIZWlnaHQgPSAyMjYwXG4gICAgICAgIGVsc2UgaWYgd2luZG93LmlubmVyV2lkdGggPCAxMDAwXG4gICAgICAgICAgICBleHBhbmRlZEhlaWdodCA9IDIxNTBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXhwYW5kZWRIZWlnaHQgPSAyMTUwXG5cbiAgICAgICAgdGFibGVJbiA9IG5ldyBUaW1lbGluZU1heCh7YWxpZ246IFwic3RhcnRcIiwgc3RhZ2dlcjogMCwgcGF1c2VkOiB0cnVlLCBvbkNvbXBsZXRlOiA9PlxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgVHdlZW5NYXguc2V0ICQodGFibGVSb3dzKSwge3k6IDIwLCBhbHBoYTogMCwgcm90YXRpb25YOiAtOTAsIHJvdGF0aW9uWTogLTM1fVxuXG4gICAgICAgIGZvciByb3csaSBpbiAkKHRhYmxlUm93cylcbiAgICAgICAgICAgIHRhYmxlSW4uYWRkIFR3ZWVuTWF4LnN0YWdnZXJUbygkKHJvdyksIC4yLCB7eTogMCwgYWxwaGE6IDEsIHJvdGF0aW9uWDogMCwgcm90YXRpb25ZOiAwLCBlYXNlOlF1YWQuZWFzZUluT3V0LCBkZWxheTogMH0pLCAoLjI1ICsgKC4xKmkpKSwgXCJub3JtYWxcIiwgMFxuXG4gICAgICAgIGlmIG9wdHMgPT0gJ3Nob3cnXG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8oJChzcGVjcyksIC4wNSwge2hlaWdodDogMTU0MH0sIHtoZWlnaHQ6IGV4cGFuZGVkSGVpZ2h0fSlcbiAgICAgICAgICAgIHRhYmxlSW4ucmVzdW1lKClcbiAgICAgICAgICAgICQoc3BlY3MpLmFkZENsYXNzICdzaG93aW5nLXRhYmxlJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0YWJsZUluLnJldmVyc2UoMClcbiAgICAgICAgICAgIFR3ZWVuTWF4LmZyb21UbygkKHNwZWNzKSwgLjQ1LCB7aGVpZ2h0OiBleHBhbmRlZEhlaWdodH0sIHtoZWlnaHQ6IDE1NDB9KVxuICAgICAgICAgICAgJChzcGVjcykucmVtb3ZlQ2xhc3MgJ3Nob3dpbmctdGFibGUnXG5cbiAgICBpbml0aWF0ZVN3aXBlckdhbGxlcmllczogKG9wdHMpID0+XG4gICAgICAgIGdhbGxlcmllcyA9ICQoJy5zd2lwZXItY29udGFpbmVyJylcbiAgICAgICAgc3dpcGVycyA9IFtdXG5cbiAgICAgICAgZm9yIGdhbGxlcnksaSBpbiAkKGdhbGxlcmllcylcbiAgICAgICAgICAgIGlkID0gJyMnICsgJChnYWxsZXJ5KS5hdHRyICdpZCdcbiAgICAgICAgICAgIGRvdHMgPSAkKGdhbGxlcnkpLm5leHQoKS5hdHRyICdpZCdcbiAgICAgICAgICAgICQoaWQgKyAnLCAuc3dpcGUtZm9yLW1vcmUnKS5jc3Mge2Rpc3BsYXk6ICdibG9jayd9XG5cbiAgICAgICAgICAgIHN3aXBlcnNbaV0gPSBuZXcgU3dpcGVyIGlkLCB7XG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogJyMnICsgZG90cyArICcucGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbkNsaWNrYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgY2hlY2tGb3JSYWNrZXQ6IChlKSA9PlxuICAgICAgICB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG5cbiAgICAgICAgaWYgd2luZG93V2lkdGggPCA3MDBcbiAgICAgICAgICAgICQoJyNyYWNrZXQnKS5jc3Mge3Zpc2liaWxpdHk6ICdoaWRkZW4nfVxuICAgICAgICAgICAgJCgnI3JhY2tldC1mYWxsYmFjaycpLmNzcyB7dmlzaWJpbGl0eTogJ3Zpc2libGUnfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiAhQGlzV2ViR0xcbiAgICAgICAgICAgICAgICAkKCcjcmFja2V0JykuY3NzIHt2aXNpYmlsaXR5OiAnaGlkZGVuJ31cbiAgICAgICAgICAgICAgICAkKCcjcmFja2V0LWZhbGxiYWNrJykuY3NzIHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgJCgnI3JhY2tldCcpLmNzcyB7dmlzaWJpbGl0eTogJ3Zpc2libGUnfVxuICAgICAgICAgICAgICAgICQoJyNyYWNrZXQtZmFsbGJhY2snKS5jc3Mge3Zpc2liaWxpdHk6ICdoaWRkZW4nfVxuXG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTcGVjc1ZpZXdcbiIsIlxuVmlld0Jhc2UgPSByZXF1aXJlICcuL2Fic3RyYWN0L1ZpZXdCYXNlLmNvZmZlZSdcblRlYW1QbGF5ZXJWaWV3ICA9IHJlcXVpcmUgJy4vVGVhbVBsYXllclZpZXcuY29mZmVlJ1xuQXBwTW9kZWwgPSByZXF1aXJlICcuLi9tb2RlbHMvQXBwTW9kZWwuY29mZmVlJ1xuVHJhY2tpbmcgPSByZXF1aXJlICcuLi91dGlscy90cmFjay5jb2ZmZWUnXG5cblxuY2xhc3MgUGxheWVyc1ZpZXcgZXh0ZW5kcyBWaWV3QmFzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG4gICAgICAgIEBtb2RlbCA9IEFwcE1vZGVsLmdldEluc3RhbmNlKClcblxuXG4gICAgICAgIHN1cGVyKG9wdHMpXG5cbiAgICBpbml0aWFsaXplOiAob3B0cykgLT5cbiAgICAgICAgc3VwZXIob3B0cylcblxuICAgICAgICBAcGxheWVySW5zdGFuY2VzID0gW11cbiAgICAgICAgQHBsYXllck5hbWVzID0gW11cbiAgICAgICAgQGNyZWF0ZVBsYXllcnMoKVxuICAgICAgICBAZGVsZWdhdGVFdmVudHMoQGdlbmVyYXRlRXZlbnRzKCkpXG5cbiAgICBnZW5lcmF0ZUV2ZW50czogLT5cblxuICAgICAgICBldmVudHMgPSB7fVxuXG4gICAgICAgIGlmICFAaXNQaG9uZVxuICAgICAgICAgICAgZXZlbnRzWydtb3VzZWVudGVyIC5tZW1iZXIgaW1nLmluYWN0aXZlJ10gPSBcImhvdmVyUGxheWVyXCJcbiAgICAgICAgICAgIGV2ZW50c1snbW91c2VsZWF2ZSAubWVtYmVyIGltZy5pbmFjdGl2ZSddID0gXCJsZWF2ZVBsYXllclwiXG4gICAgICAgICAgICBldmVudHNbJ2NsaWNrICN0b2dnbGUtbW9yZS1sZXNzJ10gPSBcInRvZ2dsZU1vcmVSZXNwb25zZXNcIlxuICAgICAgICAgICAgZXZlbnRzWydjbGljayAjdG9nZ2xlLW1vcmUtbGVzcyBpLmZhLXRoJ10gPSBcImNsaWNrTW9yZUxlc3NcIlxuICAgICAgICAgICAgZXZlbnRzWydjbGljayAjdGhlLXRlYW0gaW1nJ10gPSBcInN3aXRjaFBsYXllcnNcIlxuICAgICAgICAgICAgZXZlbnRzWydjbGljayAjcHJldi1tZW1iZXInXSA9ICdwcmV2UGxheWVyJ1xuICAgICAgICAgICAgZXZlbnRzWydjbGljayAjbmV4dC1tZW1iZXInXSA9ICduZXh0UGxheWVyJ1xuICAgICAgICAgICAgZXZlbnRzWydtb3VzZW1vdmUgLmNvbnRlbnQtd3JhcHBlciddID0gJ2FuaW1hdGVCYWNrZ3JvdW5kJ1xuICAgICAgICAgICAgZXZlbnRzWydtb3VzZW1vdmUgLnBsYXllci50b3AnXSA9ICdhbmltYXRlQmFja2dyb3VuZCdcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBldmVudHNbJ2NsaWNrIC5wbGF5ZXInXSA9IFwic3dpdGNoUGxheWVyc1wiXG5cbiAgICAgICAgcmV0dXJuIGV2ZW50c1xuXG4gICAgY3JlYXRlUGxheWVyczogLT5cbiAgICAgICAgdGVhbUJ1cm5XcmFwcGVyID0gJCgnI3RlYW0tYnVybi13cmFwcGVyJylcbiAgICAgICAgcGxheWVycyA9IHRlYW1CdXJuV3JhcHBlci5maW5kICcucGxheWVyJ1xuXG4gICAgICAgIGZvciBwLGkgaW4gcGxheWVyc1xuICAgICAgICAgICAgaWQgPSAkKHApLmF0dHIgJ2lkJ1xuICAgICAgICAgICAgQHBsYXllck5hbWVzLnB1c2ggaWRcbiAgICAgICAgICAgIEBwbGF5ZXJJbnN0YW5jZXNbaWRdID0gbmV3IFRlYW1QbGF5ZXJWaWV3XG4gICAgICAgICAgICAgICAgJGVsOiQoJyMnICsgaWQpXG5cbiAgICBwcmV2UGxheWVyOiAoZSkgLT5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRvcE5hbWUgPSAkKCcucGxheWVyLnRvcCcpLmF0dHIgJ2lkJ1xuICAgICAgICB0b3BSZXNwb25zZXMgPSAkKCcucGxheWVyIycgKyB0b3BOYW1lICsgJyAucmVzcG9uc2VzJylcbiAgICAgICAgaW5kZXggPSBAcGxheWVyTmFtZXMuaW5kZXhPZiB0b3BOYW1lXG4gICAgICAgIGxlbmd0aCA9IEBwbGF5ZXJOYW1lcy5sZW5ndGhcbiAgICAgICAgcHJldk5hbWUgPSAnJ1xuXG4gICAgICAgIGlmIGluZGV4ID4gMFxuICAgICAgICAgICAgcHJldk5hbWUgPSBAcGxheWVyTmFtZXNbaW5kZXggLSAxXVxuICAgICAgICAgICAgJCgnIycgKyBwcmV2TmFtZSArICctdGh1bWJuYWlsIGltZy5pbmFjdGl2ZScpLnRyaWdnZXIgJ2NsaWNrJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwcmV2TmFtZSA9IEBwbGF5ZXJOYW1lc1sobGVuZ3RoIC0gMSldXG4gICAgICAgICAgICAkKCcjJyArIHByZXZOYW1lICsgJy10aHVtYm5haWwgaW1nLmluYWN0aXZlJykudHJpZ2dlciAnY2xpY2snXG5cbiAgICAgICAgbmV3UXVlc3Rpb25zID0gJChcIiN0ZWFtLWJ1cm4td3JhcHBlclwiKS5maW5kKCcucGxheWVyIycgKyBwcmV2TmFtZSArICcgLnJlc3BvbnNlcycpXG4gICAgICAgIG5ld1BzID0gJChuZXdRdWVzdGlvbnMpLmZpbmQgJ3AnXG4gICAgICAgIGhlaWdodCA9IDBcblxuICAgICAgICBmb3IgcCBpbiAkKG5ld1BzKVxuICAgICAgICAgICAgaGVpZ2h0ID0gaGVpZ2h0ICsgJChwKS5oZWlnaHQoKSArIDEyXG5cbiAgICAgICAgVHdlZW5NYXgudG8gWyQoJyN0ZWFtLWJ1cm4tY29udGVudCAucmVzcG9uc2VzJyksICQobmV3UXVlc3Rpb25zKV0sIC4zNSxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgZGVsYXk6IDIsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAtPlxuICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnRvICQodG9wUmVzcG9uc2VzKSwgLjM1LCB7aGVpZ2h0OiAxODB9XG5cblxuXG4gICAgbmV4dFBsYXllcjogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0b3BOYW1lID0gJCgnLnBsYXllci50b3AnKS5hdHRyICdpZCdcbiAgICAgICAgdG9wUmVzcG9uc2VzID0gJCgnLnBsYXllciMnICsgdG9wTmFtZSArICcgLnJlc3BvbnNlcycpXG4gICAgICAgIGluZGV4ID0gQHBsYXllck5hbWVzLmluZGV4T2YgdG9wTmFtZVxuICAgICAgICBsZW5ndGggPSBAcGxheWVyTmFtZXMubGVuZ3RoXG4gICAgICAgIG5leHROYW1lID0gJydcblxuICAgICAgICBpZiBpbmRleCA8IChsZW5ndGggLSAxKVxuICAgICAgICAgICAgbmV4dE5hbWUgPSBAcGxheWVyTmFtZXNbaW5kZXggKyAxXVxuICAgICAgICAgICAgJCgnIycgKyBuZXh0TmFtZSArICctdGh1bWJuYWlsIGltZy5pbmFjdGl2ZScpLnRyaWdnZXIgJ2NsaWNrJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXh0TmFtZSA9IEBwbGF5ZXJOYW1lc1swXVxuICAgICAgICAgICAgJCgnIycgKyBuZXh0TmFtZSArICctdGh1bWJuYWlsIGltZy5pbmFjdGl2ZScpLnRyaWdnZXIgJ2NsaWNrJ1xuXG4gICAgICAgIG5ld1F1ZXN0aW9ucyA9ICQoXCIjdGVhbS1idXJuLXdyYXBwZXJcIikuZmluZCgnLnBsYXllciMnICsgbmV4dE5hbWUgKyAnIC5yZXNwb25zZXMnKVxuICAgICAgICBuZXdQcyA9ICQobmV3UXVlc3Rpb25zKS5maW5kICdwJ1xuICAgICAgICBoZWlnaHQgPSAwXG5cbiAgICAgICAgZm9yIHAgaW4gJChuZXdQcylcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodCArICQocCkuaGVpZ2h0KCkgKyAxMlxuXG4gICAgICAgIFR3ZWVuTWF4LnRvIFskKCcjdGVhbS1idXJuLWNvbnRlbnQgLnJlc3BvbnNlcycpLCAkKG5ld1F1ZXN0aW9ucyldLCAuMzUsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgIGRlbGF5OiAyLFxuICAgICAgICAgICAgb25Db21wbGV0ZTogLT5cbiAgICAgICAgICAgICAgICBUd2Vlbk1heC50byAkKHRvcFJlc3BvbnNlcyksIC4zNSwge2hlaWdodDogMTgwfVxuXG5cblxuXG5cbiAgICBhbmltYXRlQmFja2dyb3VuZDogKGUpIC0+XG4gICAgICAgIHggPSBlLnBhZ2VYXG4gICAgICAgIHkgPSBlLnBhZ2VZXG4gICAgICAgIHBlcmNlbnRYID0gTWF0aC5yb3VuZCgoeCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDEwMCkgLyAxLjc1XG4gICAgICAgIHBlcmNlbnRZID0gTWF0aC5yb3VuZCgoKHkgLSAkKCcjdGVhbS1idXJuJykucG9zaXRpb24oKS50b3ApIC8gJCgnI3RlYW0tYnVybicpLmhlaWdodCgpKSAqIDEwMCkgLyAxLjc1XG5cbiAgICAgICAgYmcgPSAkKCcucGxheWVyLnRvcCcpXG4gICAgICAgICMgVHdlZW5NYXgudG8gJChiZyksIC4xLCB7YmFja2dyb3VuZFBvc2l0aW9uOiAnJyArIE1hdGguYWJzKDUwIC0gcGVyY2VudFgpICsgJyUgJyArIE1hdGguYWJzKDUwIC0gcGVyY2VudFkpICsgJyUnLCBlYXNlOiBRdWFkLmVhc2VJbk91dH1cblxuICAgIHN3aXRjaFBsYXllcnM6IChlKSAtPlxuICAgICAgICBpZiAhQGlzUGhvbmVcbiAgICAgICAgICAgIG5hbWUgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KFwiLm1lbWJlclwiKS5kYXRhICduYW1lJ1xuICAgICAgICAgICAgdG9wSUQgPSAkKCcucGxheWVyLnRvcCcpLmF0dHIgJ2lkJ1xuXG4gICAgICAgICAgICBpZiBuYW1lICE9IHRvcElEXG4gICAgICAgICAgICAgICAgQHBsYXllckluc3RhbmNlc1t0b3BJRF0udHJhbnNpdGlvbk91dCgpXG4gICAgICAgICAgICAgICAgQHBsYXllckluc3RhbmNlc1tuYW1lXS50cmFuc2l0aW9uSW4oJCgnLnBsYXllciMnICsgbmFtZSkpXG5cbiAgICAgICAgICAgICAgICBAdXBkYXRlUGxheWVySWNvbnMoZSlcbiAgICAgICAgICAgICAgICBAZGlzYWJsZVN3aXRjaGluZygpXG5cbiAgICAgICAgICAgICR0aHVtYiA9ICQoZS50YXJnZXQpLnBhcmVudCgpXG5cblxuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGVjdGVkUGxheWVyID0gJChlLnRhcmdldCkucGFyZW50cyAnLnBsYXllcidcbiAgICAgICAgICAgIHNlbGVjdGVkTmFtZSA9ICQoc2VsZWN0ZWRQbGF5ZXIpLmF0dHIgJ2lkJ1xuICAgICAgICAgICAgb3BlbiA9ICQoJy5yZXNwb25zZXMub3BlbicpLmF0dHIgJ2lkJ1xuXG4gICAgICAgICAgICBpZiAkKGUudGFyZ2V0KS5maW5kKCcucmVzcG9uc2VzJykuaGFzQ2xhc3MgJ29wZW4nXG4gICAgICAgICAgICAgICAgQHBsYXllckluc3RhbmNlc1tzZWxlY3RlZE5hbWVdLmNsb3NlUGxheWVyKCQoJy5wbGF5ZXIjJyArIHNlbGVjdGVkTmFtZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICAgIGZvciBwLGkgaW4gJCgnLnBsYXllcicpXG4gICAgICAgICAgICAgICAgcGxheWVyTmFtZSA9ICQocCkuYXR0ciAnaWQnXG4gICAgICAgICAgICAgICAgQHBsYXllckluc3RhbmNlc1twbGF5ZXJOYW1lXS5jbG9zZVBsYXllcigkKCcucGxheWVyIycgKyBwbGF5ZXJOYW1lKSlcblxuICAgICAgICAgICAgQHBsYXllckluc3RhbmNlc1tzZWxlY3RlZE5hbWVdLm9wZW5QbGF5ZXIoJChzZWxlY3RlZFBsYXllcikpXG5cbiAgICAgICAgICAgICR0aHVtYiA9ICQoXCIjI3tzZWxlY3RlZE5hbWV9LXRodW1ibmFpbFwiKVxuXG4gICAgICAgIFRyYWNraW5nLmdhVHJhY2tFbGVtZW50ICR0aHVtYlxuXG5cblxuXG5cbiAgICBkaXNhYmxlU3dpdGNoaW5nOiAoZSkgLT5cbiAgICAgICAgJCgnI3RoZS10ZWFtIC5yb3csICNwcmV2LW1lbWJlciwgI25leHQtbWVtYmVyJykuY3NzIHtwb2ludGVyRXZlbnRzOiAnbm9uZSd9XG4gICAgICAgIHNldFRpbWVvdXQgKCAtPlxuICAgICAgICAgICAgJCgnI3RoZS10ZWFtIC5yb3csICNwcmV2LW1lbWJlciwgI25leHQtbWVtYmVyJykuY3NzKHtwb2ludGVyRXZlbnRzOiAnYXV0byd9KVxuICAgICAgICApLCAyNTAwXG5cbiAgICB1cGRhdGVQbGF5ZXJJY29uczogKGUpID0+XG4gICAgICAgIGluYWN0aXZlID0gJChlLnRhcmdldClcbiAgICAgICAgYWN0aXZlID0gJChpbmFjdGl2ZSkubmV4dCgpXG4gICAgICAgIHNlbGVjdGVkID0gJCgnLm1lbWJlciBpbWcuc2VsZWN0ZWQnKVxuXG4gICAgICAgICMgR2V0IHByZXZpb3VzbHkgc2VsZWN0ZWQgcGxheWVyIGljb24gcmVhZHkgdG8gZmFkZSBvdXRcbiAgICAgICAgVHdlZW5NYXguc2V0ICQoc2VsZWN0ZWQpLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICAgIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAgICAgI1JlbW92ZSBzZWxlY3RlZCBjbGFzcyBmcm9tIHByZXZpb3VzIHBsYXllciBhbmQgdHJhbnNpdGlvbiBvdXQuIEFkZCBzZWxlY3RlZCBjbGFzcyB0byBuZXh0IHBsYXllclxuICAgICAgICAgICAgICAgICQoc2VsZWN0ZWQpLnJlbW92ZUNsYXNzICdzZWxlY3RlZCdcblxuICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnRvICQoc2VsZWN0ZWQpLCAuNSxcbiAgICAgICAgICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogLTFcblxuICAgICAgICAgICAgICAgICQoYWN0aXZlKS5hZGRDbGFzcyAnc2VsZWN0ZWQnXG5cbiAgICBob3ZlclBsYXllcjogKGUpIC0+XG4gICAgICAgIGFjdGl2ZUltYWdlID0gJChlLnRhcmdldCkucGFyZW50KCkuZmluZCAnaW1nLmFjdGl2ZSdcbiAgICAgICAgaW5hdnRpdmVJbWFnZSA9ICQoZS50YXJnZXQpLnBhcmVudCgpLmZpbmQgJ2ltZy5pbmFjdGl2ZSdcblxuICAgICAgICBUd2Vlbk1heC50byAkKGFjdGl2ZUltYWdlKSwgLjUsXG4gICAgICAgICAgICBhbHBoYTogMVxuXG4gICAgICAgIFR3ZWVuTWF4LnRvICQoaW5hdnRpdmVJbWFnZSksIC41LFxuICAgICAgICAgICAgYWxwaGE6IDBcblxuICAgIGxlYXZlUGxheWVyOiAoZSkgLT5cbiAgICAgICAgYWN0aXZlSW1hZ2UgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5maW5kICdpbWcuYWN0aXZlJ1xuICAgICAgICBpbmF2dGl2ZUltYWdlID0gJChlLnRhcmdldCkucGFyZW50KCkuZmluZCAnaW1nLmluYWN0aXZlJ1xuXG4gICAgICAgIFR3ZWVuTWF4LnRvICQoYWN0aXZlSW1hZ2UpLCAuNSxcbiAgICAgICAgICAgIGFscGhhOiAwXG5cbiAgICAgICAgVHdlZW5NYXgudG8gJChpbmF2dGl2ZUltYWdlKSwgLjUsXG4gICAgICAgICAgICBhbHBoYTogMVxuXG4gICAgdG9nZ2xlTW9yZVJlc3BvbnNlczogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgICR0YXJnZXQgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdhJylcbiAgICAgICAgY29udGFpbmVyID0gJHRhcmdldC5wcmV2KClcbiAgICAgICAgcGxheWVyUVdyYXBwZXIgPSAkKFwiI3RlYW0tYnVybi13cmFwcGVyXCIpLmZpbmQoJy5wbGF5ZXIudG9wIC5yZXNwb25zZXMnKVxuICAgICAgICByZXNwb25zZXMgPSAkKFwiI3RlYW0tYnVybi13cmFwcGVyXCIpLmZpbmQoJy5wbGF5ZXIgLnJlc3BvbnNlcycpXG4gICAgICAgIFBzID0gJChwbGF5ZXJRV3JhcHBlcikuZmluZCAncCdcbiAgICAgICAgaGVpZ2h0ID0gMFxuXG4gICAgICAgIGlmIGNvbnRhaW5lci5oYXNDbGFzcyAnY2xvc2VkJ1xuICAgICAgICAgICAgZm9yIHAgaW4gJChQcylcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgKyAkKHApLmhlaWdodCgpICsgMTJcblxuICAgICAgICAgICAgVHdlZW5NYXgudG8gWyQoY29udGFpbmVyKSwgJChwbGF5ZXJRV3JhcHBlcildLCAuMzUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvICQoJyN0aGUtdGVhbSAucm93JyksIC4zNSxcbiAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IDBcbiAgICAgICAgICAgICAgICB5OiBoZWlnaHRcblxuXG5cbiAgICAgICAgICAgICQoY29udGFpbmVyKS5yZW1vdmVDbGFzcyAnY2xvc2VkJ1xuICAgICAgICAgICAgJHRhcmdldC5maW5kKFwiLmV4cGFuZFwiKS5oaWRlKClcbiAgICAgICAgICAgICR0YXJnZXQuZmluZChcIi5jb2xsYXBzZVwiKS5zaG93KClcbiAgICAgICAgICAgICQoJ2EjcHJldi1tZW1iZXIsIGEjbmV4dC1tZW1iZXInKS5hZGRDbGFzcyAndmlzaWJsZSdcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGxheWVySGVpZ2h0ID0gJChwbGF5ZXJRV3JhcHBlcikuZGF0YSAnaGVpZ2h0J1xuICAgICAgICAgICAgVHdlZW5NYXgudG8gWyQoY29udGFpbmVyKSwgJChwbGF5ZXJRV3JhcHBlcildLCAuMzUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBwYXJzZUludChwbGF5ZXJIZWlnaHQsIDEwKVxuICAgICAgICAgICAgVHdlZW5NYXgudG8gJCgnI3RoZS10ZWFtIC5yb3cnKSwgLjM1LFxuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMVxuICAgICAgICAgICAgICAgIHk6IDBcblxuICAgICAgICAgICAgJChjb250YWluZXIpLmFkZENsYXNzICdjbG9zZWQnXG4gICAgICAgICAgICAkdGFyZ2V0LmZpbmQoXCIuZXhwYW5kXCIpLnNob3coKVxuICAgICAgICAgICAgJHRhcmdldC5maW5kKFwiLmNvbGxhcHNlXCIpLmhpZGUoKVxuICAgICAgICAgICAgJCgnYSNwcmV2LW1lbWJlciwgYSNuZXh0LW1lbWJlcicpLnJlbW92ZUNsYXNzICd2aXNpYmxlJ1xuXG4gICAgY2xpY2tNb3JlTGVzczogKGUpIC0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICQoJyN0b2dnbGUtbW9yZS1sZXNzJykudHJpZ2dlciAnY2xpY2snXG5cblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJzVmlld1xuXG5cbiIsIlxuVmlld0Jhc2UgPSByZXF1aXJlICcuL2Fic3RyYWN0L1ZpZXdCYXNlLmNvZmZlZSdcbkFwcE1vZGVsID0gcmVxdWlyZSAnLi4vbW9kZWxzL0FwcE1vZGVsLmNvZmZlZSdcblxuXG5jbGFzcyBUZWFtUGxheWVyVmlldyBleHRlbmRzIFZpZXdCYXNlXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG4gICAgICAgIEBtb2RlbCA9IEFwcE1vZGVsLmdldEluc3RhbmNlKClcbiAgICAgICAgQGlkID0gb3B0c1xuICAgICAgICBzdXBlcihvcHRzKVxuXG4gICAgaW5pdGlhbGl6ZTogKG9wdHMpIC0+XG4gICAgICAgIHN1cGVyKG9wdHMpXG4gICAgICAgIEBkZWxlZ2F0ZUV2ZW50cyhAZ2VuZXJhdGVFdmVudHMoKSlcblxuXG5cbiAgICBnZW5lcmF0ZUV2ZW50czogLT5cbiAgICAgICAgZXZlbnRzID0ge31cblxuICAgICAgICBpZiAhQGlzVG91Y2hcbiAgICAgICAgZWxzZVxuXG4gICAgICAgIHJldHVybiBldmVudHNcblxuXG4gICAgdHJhbnNpdGlvbk91dDogKGUpID0+XG4gICAgICAgIHRvcENhcmQgPSAkKCcucGxheWVyLnRvcCcpXG4gICAgICAgIHRvcFBsYXllck5hbWUgPSAkKHRvcENhcmQpLmZpbmQgJy5wbGF5ZXItbmFtZSBoMSdcbiAgICAgICAgdG9wUHMgPSAkKHRvcENhcmQpLmZpbmQgJy5yZXNwb25zZXMgcCdcblxuICAgICAgICB0cmFuc2l0aW9uT3V0ID0gbmV3IFRpbWVsaW5lTWF4KHthbGlnbjogXCJzdGFydFwiLCBzdGFnZ2VyOiAxLCBwYXVzZWQ6IHRydWUsIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAjIEtpbGwgdGhlIHRpbWVsaW5lLCBhbmQgcmV2ZXJ0IGFsbCBzcGxpdHRleHQgYmFjayB0byBodG1sXG4gICAgICAgICAgICB0cmFuc2l0aW9uT3V0LmtpbGwoKVxuICAgICAgICAgICAgc3BsaXQucmV2ZXJ0KClcblxuICAgICAgICAgICAgZm9yIHEgaW4gc3BsaXRRdWVzdGlvbnNPdXRcbiAgICAgICAgICAgICAgICBxLnJldmVydCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgIyBBZGQgYW5pbWF0aW9uIGZvciB0b3AgY2FyZCBxdWVzdGlvbnMgKyBhbnN3ZXJzXG4gICAgICAgIHNwbGl0UXVlc3Rpb25zT3V0ID0gW11cbiAgICAgICAgZm9yIHAsaSBpbiB0b3BQc1xuICAgICAgICAgICAgc3BsaXRRdWVzdGlvbnNPdXRbaV0gPSBuZXcgU3BsaXRUZXh0KCQocCksIHt0eXBlOlwiY2hhcnMsd29yZHMsbGluZXNcIn0pXG4gICAgICAgICAgICB0cmFuc2l0aW9uT3V0LmFkZCBUd2Vlbk1heC5zdGFnZ2VyVG8oc3BsaXRRdWVzdGlvbnNPdXRbaV0ubGluZXMsIC41LCB7eDogMCwgeTogLTEwLCBhbHBoYTogMCwgZWFzZTogUXVhZC5lYXNlSW5PdXR9KSwgKC4wNSooaSsxKSksIFwibm9ybWFsXCIsIC0uMTc1XG5cbiAgICAgICAgIyBBZGQgYW5pbWF0aW9uIGZvciB0b3AgY2FyZCBwbGF5ZXIgbmFtZVxuICAgICAgICBzcGxpdCA9IG5ldyBTcGxpdFRleHQodG9wUGxheWVyTmFtZSwge3R5cGU6XCJjaGFycyx3b3JkcyxsaW5lc1wiLCBwb3NpdGlvbjpcImFic29sdXRlXCJ9KVxuICAgICAgICB0cmFuc2l0aW9uT3V0LmFkZCBUd2Vlbk1heC5zdGFnZ2VyVG8oc3BsaXQuY2hhcnMsIC43NSwge3g6MCwgeTowLCBhbHBoYTowLCBlYXNlOiBRdWFkLmVhc2VJbk91dH0pLCAuNSwgXCJub3JtYWxcIiwgLS4wNVxuXG4gICAgICAgICMgRmFkZSBPdXQgdGhlIGJhY2tncm91bmQgaW1hZ2VcbiAgICAgICAgdHJhbnNpdGlvbk91dC5hZGQgVHdlZW5NYXgudG8oJCh0b3BDYXJkKSwgLjUsIHtlYXNlOlF1YWQuZWFzZU91dCwgc2NhbGU6IDEuNSwgYWxwaGE6IDAsIHpJbmRleDogLTV9KSwgMS4zNSwgXCJub3JtYWxcIiwgLjVcblxuICAgICAgICAjIFBsYXkgVHJhbnNpdGlvbk91dCBUaW1lbGluZVxuICAgICAgICB0cmFuc2l0aW9uT3V0LnJlc3VtZSgpXG5cbiAgICB0cmFuc2l0aW9uSW46IChuZXh0UGxheWVyKSAtPlxuICAgICAgICB0b3BDYXJkID0gJCgnLnBsYXllci50b3AnKVxuICAgICAgICBuZXh0UGxheWVyTmFtZSA9ICQobmV4dFBsYXllcikuZmluZCAnLnBsYXllci1uYW1lIGgxJ1xuICAgICAgICByZXNwb25zZXNIZWlnaHQgPSAkKG5leHRQbGF5ZXIpLmZpbmQoJy5yZXNwb25zZXMnKS5kYXRhICdoZWlnaHQnXG4gICAgICAgIG5leHRQbGF5ZXJQcyA9ICQobmV4dFBsYXllcikuZmluZCAnLnJlc3BvbnNlcyBwJ1xuXG4gICAgICAgIFR3ZWVuTWF4LnRvICQoJy5yZXNwb25zZXMnKSwgLjM1LFxuICAgICAgICAgICAgZGVsYXk6IDIsXG4gICAgICAgICAgICBlYXNlOiBRdWFkLmVhc2VJbk91dCxcbiAgICAgICAgICAgIGhlaWdodDogcGFyc2VJbnQocmVzcG9uc2VzSGVpZ2h0LCAxMClcblxuICAgICAgICB0cmFuc2l0aW9uSW4gPSBuZXcgVGltZWxpbmVNYXgoe2FsaWduOiBcInN0YXJ0XCIsIHN0YWdnZXI6IDEsIHBhdXNlZDogdHJ1ZSwgb25Db21wbGV0ZTogPT5cbiAgICAgICAgICAgICMgQWRqdXN0IGNsYXNzZXMgZm9yIHRyYW5zaXRpb25pbmcgY2FyZHNcbiAgICAgICAgICAgIHRvcENhcmQucmVtb3ZlQ2xhc3MgJ3RvcCdcbiAgICAgICAgICAgICQobmV4dFBsYXllcikuYWRkQ2xhc3MgJ3RvcCdcblxuICAgICAgICAgICAgIyBLaWxsIHRoZSB0aW1lbGluZSBhbmQgcmV2ZXJ0IHNwbGl0dGV4dCBiYWNrIHRvIGh0bWxcbiAgICAgICAgICAgIHRyYW5zaXRpb25Jbi5raWxsKClcbiAgICAgICAgICAgIHNwbGl0TmV4dC5yZXZlcnQoKVxuXG4gICAgICAgICAgICBmb3IgcSBpbiBzcGxpdFF1ZXN0aW9uc0luXG4gICAgICAgICAgICAgICAgcS5yZXZlcnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgICMgQW5pbWF0ZSBCb3R0b20gQ2FyZCBVcHdhcmRzICYgVmlzaWJsZVxuICAgICAgICB0cmFuc2l0aW9uSW4uYWRkIFR3ZWVuTWF4LnRvKCQobmV4dFBsYXllciksIC41LCB7ZWFzZTpRdWFkLmVhc2VJbk91dCwgc2NhbGU6IDEsIGFscGhhOiAxLCB6SW5kZXg6IDV9KSwgMS4yNSwgXCJub3JtYWxcIiwgMS4yNVxuXG4gICAgICAgIHNwbGl0TmV4dCA9IG5ldyBTcGxpdFRleHQobmV4dFBsYXllck5hbWUsIHt0eXBlOlwiY2hhcnMsd29yZHMsbGluZXNcIiwgcG9zaXRpb246XCJhYnNvbHV0ZVwifSlcbiAgICAgICAgdHJhbnNpdGlvbkluLmFkZCBUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKHNwbGl0TmV4dC5jaGFycywgLjc1LCB7eDogMCwgeTogMCwgYWxwaGE6MCwgZWFzZTogUXVhZC5lYXNlSW5PdXR9LCB7eDogMCwgeTogMCwgYWxwaGE6MSwgZWFzZTogUXVhZC5lYXNlSW5PdXR9LCAwLjAxKSwgMS41LCBcIm5vcm1hbFwiLCAuMDFcblxuICAgICAgICBzcGxpdFF1ZXN0aW9uc0luID0gW11cbiAgICAgICAgZm9yIHAsaSBpbiBuZXh0UGxheWVyUHNcbiAgICAgICAgICAgIHNwbGl0UXVlc3Rpb25zSW5baV0gPSBuZXcgU3BsaXRUZXh0KCQocCksIHt0eXBlOlwiY2hhcnMsd29yZHMsbGluZXNcIn0pXG4gICAgICAgICAgICB0cmFuc2l0aW9uSW4uYWRkIFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oc3BsaXRRdWVzdGlvbnNJbltpXS5saW5lcywgLjUsIHt4OiAwLCB5OiAtMTAsIGFscGhhOiAwLCBlYXNlOiBRdWFkLmVhc2VJbk91dH0sIHt4OiAwLCB5OiAwLCBhbHBoYTogMSwgZWFzZTogUXVhZC5lYXNlSW5PdXR9LCAxLjI1KSwgKDEuNSArICguMDgqaSkpLCBcIm5vcm1hbFwiLCAtMS4yXG5cbiAgICAgICAgdHJhbnNpdGlvbkluLnJlc3VtZSgpXG5cbiAgICBvcGVuUGxheWVyOiAob3B0cykgPT5cbiAgICAgICAgcmVzcG9uc2VzID0gJChvcHRzKS5maW5kICcucmVzcG9uc2VzJ1xuICAgICAgICBhbmdsZSA9ICQob3B0cykuZmluZCAnaW1nLmFuZ2xlLWV4cGFuZCdcbiAgICAgICAgUHMgPSAkKHJlc3BvbnNlcykuZmluZCgncCcpXG4gICAgICAgIGhlaWdodCA9IDBcbiAgICAgICAgbmFtZSA9ICQob3B0cykuZmluZCAnLnBsYXllci1uYW1lIGgxJ1xuICAgICAgICBpbmRleCA9ICQob3B0cykuZGF0YSAnaW5kZXgnXG4gICAgICAgIHkgPSAyMzg2ICsgODcqKGluZGV4KVxuXG4gICAgICAgIGZvciBwIGluIFBzXG4gICAgICAgICAgICBoZWlnaHQgPSBoZWlnaHQgKyAkKHApLmhlaWdodCgpICsgMTJcblxuICAgICAgICBvcGVuID0gbmV3IFRpbWVsaW5lTWF4KHthbGlnbjogXCJzdGFydFwiLCBzdGFnZ2VyOiAxLCBwYXVzZWQ6IHRydWUsIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAjIEtpbGwgdGhlIHRpbWVsaW5lXG4gICAgICAgICAgICBvcGVuLmtpbGwoKVxuICAgICAgICB9KVxuXG4gICAgICAgICMgUm90YXRlIHRoZSBhcnJvdyB0byBwb2ludCBkb3duXG4gICAgICAgIG9wZW4uYWRkIFR3ZWVuTWF4LnRvKCQoYW5nbGUpLCAuNSwge3JvdGF0aW9uOiAxODB9LCAwLjI1KSwgLjI1LCBcIm5vcm1hbFwiLCAuMDFcblxuICAgICAgICAjIENvbG9yIHBsYXllcnMgbmFtZSByZWRcbiAgICAgICAgb3Blbi5hZGQgVHdlZW5NYXgudG8oJChuYW1lKSwgLjUsIHtjb2xvcjogJyNkYTFhMzInfSwgMC4yNSksIC4yNSwgXCJub3JtYWxcIiwgLjAxXG5cbiAgICAgICAgIyBFeHBhbmQgcXVlc3Rpb25zIHRvIGJlIHZpc2libGVcbiAgICAgICAgb3Blbi5hZGQgVHdlZW5NYXgudG8oJChyZXNwb25zZXMpLCAuMDUsIHtoZWlnaHQ6IGhlaWdodCwgZWFzZTogUXVhZC5lYXNlT3V0fSwgMC4xNSksIC41LCBcIm5vcm1hbFwiLCAuMDVcbiAgICAgICAgb3Blbi5yZXN1bWUoKVxuICAgICAgICBcbiAgICAgICAgJChyZXNwb25zZXMpLmFkZENsYXNzKCdvcGVuJykucmVtb3ZlQ2xhc3MgJ2Nsb3NlZCdcblxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHkgKyAncHgnXG4gICAgICAgIH0sIDEwMDBcblxuICAgIGNsb3NlUGxheWVyOiAob3B0cykgPT5cbiAgICAgICAgcmVzcG9uc2VzID0gJChvcHRzKS5maW5kICcucmVzcG9uc2VzJ1xuICAgICAgICBhbmdsZSA9ICQob3B0cykuZmluZCAnaW1nLmFuZ2xlLWV4cGFuZCdcbiAgICAgICAgbmFtZSA9ICQob3B0cykuZmluZCAnLnBsYXllci1uYW1lIGgxJ1xuXG4gICAgICAgIGNsb3NlID0gbmV3IFRpbWVsaW5lTWF4KHthbGlnbjogXCJzdGFydFwiLCBzdGFnZ2VyOiAxLCBwYXVzZWQ6IHRydWUsIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAjIEtpbGwgdGhlIHRpbWVsaW5lXG4gICAgICAgICAgICBjbG9zZS5raWxsKClcbiAgICAgICAgfSlcblxuICAgICAgICAjIENsb3NlIHF1ZXN0aW9ucyB0byBiZSBpbnZpc2libGVcbiAgICAgICAgY2xvc2UuYWRkIFR3ZWVuTWF4LnRvKCQocmVzcG9uc2VzKSwgLjA1LCB7aGVpZ2h0OiAwLCBlYXNlOiBRdWFkLmVhc2VPdXR9LCAwLjE1KSwgLjUsIFwibm9ybWFsXCIsIC4wNVxuXG4gICAgICAgICMgVHVybiBwbGF5ZXIgbmFtZSBiYWNrIHRvIHdoaXRlXG4gICAgICAgIGNsb3NlLmFkZCBUd2Vlbk1heC50bygkKG5hbWUpLCAuNSwge2NvbG9yOiAnI2ZmZid9LCAwLjI1KSwgLjI1LCBcIm5vcm1hbFwiLCAuMDFcblxuICAgICAgICAjIFJvdGF0ZSB0aGUgYXJyb3cgdG8gcG9pbnQgdXBcbiAgICAgICAgY2xvc2UuYWRkIFR3ZWVuTWF4LnRvKCQoYW5nbGUpLCAuNSwge3JvdGF0aW9uOiAwfSwgMC4yNSksIC4yNSwgXCJub3JtYWxcIiwgLjAxXG5cbiAgICAgICAgY2xvc2UucmVzdW1lKClcblxuICAgICAgICAkKHJlc3BvbnNlcykucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcyAnY2xvc2VkJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGVhbVBsYXllclZpZXdcblxuXG5cbiIsIlxuVmlld0Jhc2UgPSByZXF1aXJlICcuL1ZpZXdCYXNlLmNvZmZlZSdcbkFwcE1vZGVsID0gcmVxdWlyZSAnLi4vLi4vbW9kZWxzL0FwcE1vZGVsLmNvZmZlZSdcblxuXG5jbGFzcyBQb3N0Vmlld0Jhc2UgZXh0ZW5kcyBWaWV3QmFzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG4gICAgICAgIEBhcHBNb2RlbCA9IEFwcE1vZGVsLmdldEluc3RhbmNlKClcbiAgICAgICAgc3VwZXIob3B0cylcblxuXG4gICAgaW5pdGlhbGl6ZTogKG9wdHMpIC0+XG4gICAgICAgIHN1cGVyKG9wdHMpXG5cblxuXG5cbiAgICByZW5kZXI6ICgpIC0+XG4gICAgICAgIHBvc3QgPSAgQHRlbXBsYXRlIHtkYXRhOiBAbW9kZWx9XG4gICAgICAgIEAkZWwgPSAkKHBvc3QpXG4gICAgICAgIEByZW5kZXJlZCA9IHRydWVcbiAgICAgICAgQGFmdGVyUmVuZGVyKClcblxuXG5cblxuICAgIGdlbmVyYXRlRXZlbnRzOiAtPlxuXG4gICAgICAgIGV2ZW50cyA9IHt9XG5cbiAgICAgICAgZXZlbnRzWydjbGljayAuYXBwcm92ZSddID0gXCJhcHByb3ZlXCJcbiAgICAgICAgZXZlbnRzWydjbGljayAuZmVhdHVyZSddID0gXCJmZWF0dXJlXCJcblxuXG5cbiAgICAgICAgcmV0dXJuIGV2ZW50c1xuXG4gICAgYXBwcm92ZTogKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAkdCA9ICQoZS50YXJnZXQpLnBhcmVudHNVbnRpbChcIi5pdGVtXCIpLnBhcmVudCgpXG4gICAgICAgICRpbnB1dCA9ICR0LmZpbmQoJy5hcHByb3ZlIGlucHV0JylcbiAgICAgICAgY2hlY2tlZCA9ICRpbnB1dC5pcygnOmNoZWNrZWQnKVxuXG4gICAgICAgIGRhdGEgPVxuICAgICAgICAgICAgaWQ6JHQuZGF0YSgnaWQnKVxuICAgICAgICAgICAgdHlwZTokdC5kYXRhKCd0eXBlJylcbiAgICAgICAgICAgIGFwcHJvdmVkOiFjaGVja2VkXG4gICAgICAgICAgICBfY3NyZjpAYXBwTW9kZWwuZ2V0KFwic2Vzc2lvblwiKS5nZXQoJ2NzcmYnKVxuXG5cbiAgICAgICAgYXBwcm92ZVNlcnZpY2UgPSBAYXBwTW9kZWwuZ2V0KFwic2VydmljZXNcIikuYXBwcm92ZVxuXG4gICAgICAgIEBwb3N0RGF0YShhcHByb3ZlU2VydmljZSxkYXRhLCRpbnB1dClcblxuXG4gICAgZmVhdHVyZTogKGUpID0+XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAkdCA9ICQoZS50YXJnZXQpLnBhcmVudHNVbnRpbChcIi5pdGVtXCIpLnBhcmVudCgpXG4gICAgICAgICRpbnB1dCA9ICR0LmZpbmQoJy5mZWF0dXJlIGlucHV0JylcbiAgICAgICAgY2hlY2tlZCA9ICRpbnB1dC5pcygnOmNoZWNrZWQnKVxuXG4gICAgICAgIGRhdGEgPVxuICAgICAgICAgICAgaWQ6JHQuZGF0YSgnaWQnKVxuICAgICAgICAgICAgdHlwZTokdC5kYXRhKCd0eXBlJylcbiAgICAgICAgICAgIGZlYXR1cmVkOiFjaGVja2VkXG4gICAgICAgICAgICBfY3NyZjpAYXBwTW9kZWwuZ2V0KFwic2Vzc2lvblwiKS5nZXQoJ2NzcmYnKVxuXG5cbiAgICAgICAgZmVhdHVyZVNlcnZpY2UgPSBAYXBwTW9kZWwuZ2V0KFwic2VydmljZXNcIikuZmVhdHVyZVxuXG4gICAgICAgIEBwb3N0RGF0YShmZWF0dXJlU2VydmljZSxkYXRhLCRpbnB1dCAsIEBmZWF0dXJlUG9zdClcblxuXG4gICAgZmVhdHVyZVBvc3Q6ICh2YWwpID0+XG5cbiAgICAgICAgaWYgdmFsIGlzIHRydWVcbiAgICAgICAgICAgIEAkZWwucmVtb3ZlQ2xhc3MoJ3NtYWxsJylcbiAgICAgICAgICAgIEAkZWwuYWRkQ2xhc3MoJ2xhcmdlJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQCRlbC5yZW1vdmVDbGFzcygnbGFyZ2UnKVxuICAgICAgICAgICAgQCRlbC5hZGRDbGFzcygnc21hbGwnKVxuXG4gICAgICAgIEB0cmlnZ2VyICdsYXlvdXRDaGFuZ2VkJ1xuXG5cblxuICAgIHBvc3REYXRhOiAoc2VydmljZSwgZGF0YSwgJGlucHV0ICwgY2FsbGJhY2spIC0+XG5cbiAgICAgICAgJC5hamF4XG4gICAgICAgICAgICB0eXBlOlwiUE9TVFwiXG4gICAgICAgICAgICB1cmw6c2VydmljZVxuICAgICAgICAgICAgZGF0YTpkYXRhXG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzdWx0KSAtPlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIHJlc3VsdFxuICAgICAgICAgICAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJyAsIHJlc3VsdC5jaGFuZ2VkWzBdWyRpbnB1dC5hdHRyKCduYW1lJyldKVxuXG4gICAgICAgICAgICAgICAgaWYgY2FsbGJhY2s/XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdC5jaGFuZ2VkWzBdWyRpbnB1dC5hdHRyKCduYW1lJyldKVxuXG4gICAgdHJhbnNpdGlvbkluOiAoY2FsbGJhY2spID0+XG5cbiAgICAgICAgVHdlZW5NYXgudG8gQCRlbCAsIC40LFxuICAgICAgICAgICAgYXV0b0FscGhhOjFcbiAgICAgICAgICAgIGVhc2U6Q3ViaWMuZWFzZU91dFxuICAgICAgICAgICAgb25Db21wbGV0ZTogPT5cblxuICAgICAgICAgICAgICAgIGlmIGNhbGxiYWNrIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKClcblxuXG4gICAgYWRkRWxsaXBzaXM6IC0+XG4gICAgICAgIGNvbnNvbGUubG9nIEAkZWxcblxuICAgICAgICBAJGVsLmZpbmQoJy5wb3N0LWJvZHknKS5kb3Rkb3Rkb3QoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RWaWV3QmFzZVxuXG5cbiIsIlxuXG5cbmNsYXNzIFZpZXdCYXNlIGV4dGVuZHMgQmFja2JvbmUuVmlld1xuXG4gICAgY29uc3RydWN0b3I6IChvcHQpIC0+XG4gICAgICAgIEB0ZW1wbGF0ZSA/PSBcIlwiXG4gICAgICAgIEBnbG9iYWwgPSB7fVxuICAgICAgICBzdXBlciBvcHRcblxuXG5cbiAgICBpbml0aWFsaXplOiAob3B0KSAtPlxuXG4gICAgICAgIEBpc1RvdWNoID0gTW9kZXJuaXpyLnRvdWNoXG4gICAgICAgIEBpc1RhYmxldCA9ICQoXCJodG1sXCIpLmhhc0NsYXNzKFwidGFibGV0XCIpXG4gICAgICAgIEBpc1Bob25lID0gJChcImh0bWxcIikuaGFzQ2xhc3MoXCJwaG9uZVwiKVxuXG4gICAgICAgIEBpc1dlYkdMID0gLT5cbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWJnbCcpXG5cbiAgICAgICAgICAgIGlmIGNhbnZhcy5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpID09IG51bGwgfHwgY2FudmFzLmdldENvbnRleHQoXCJleHBlcmltZW50YWwtd2ViZ2xcIikgPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuXG5cblxuICAgIGdlbmVyYXRlRXZlbnRzOiAtPlxuICAgICAgICByZXR1cm4ge31cblxuXG5cbiAgICByZW5kZXI6ICgpIC0+XG5cbiAgICAgICAgQCRlbC5odG1sIEB0ZW1wbGF0ZSB7ZGF0YTogQG1vZGVsfVxuICAgICAgICBAYWZ0ZXJSZW5kZXIoKVxuXG5cbiAgICBhZnRlclJlbmRlcjogLT5cbiAgICAgICAgQGRlbGVnYXRlRXZlbnRzKEBnZW5lcmF0ZUV2ZW50cygpKVxuXG4gICAgZGVzdHJveTogKCkgPT5cbiAgICAgICAgQCRlbC5odG1sKFwiXCIpXG4gICAgICAgIEB1bmRlbGVnYXRlRXZlbnRzKClcblxuXG5cblxuXG5cblxuICAgIHByZXZlbnREZWZhdWx0OiAoZSkgLT5cbiAgICAgICAgaWYgZSBpc250IHVuZGVmaW5lZCBhbmQgZSBpc250IG51bGxcbiAgICAgICAgICAgIGlmIGUucHJldmVudERlZmF1bHQgaXNudCB1bmRlZmluZWQgYW5kIHR5cGVvZiBlLnByZXZlbnREZWZhdWx0IGlzIFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZVxuXG5cblxuICAgIHRyYW5zaXRpb25JbjogKGNhbGxiYWNrKSA9PlxuXG5cbiAgICAgICAgQHJlbmRlcigpXG4gICAgICAgIFR3ZWVuTWF4LnRvIEAkZWwgLCAuNCxcbiAgICAgICAgICAgIGF1dG9BbHBoYToxXG4gICAgICAgICAgICBlYXNlOkN1YmljLmVhc2VPdXRcbiAgICAgICAgICAgIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAgICAgaWYgY2FsbGJhY2sgaXNudCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKVxuXG5cblxuXG5cblxuICAgIHRyYW5zaXRpb25PdXQ6IChjYWxsYmFjaykgPT5cblxuICAgICAgICBUd2Vlbk1heC50byBAJGVsICwgLjQsXG4gICAgICAgICAgICBhdXRvQWxwaGE6MFxuICAgICAgICAgICAgZWFzZTpDdWJpYy5lYXNlT3V0XG4gICAgICAgICAgICBvbkNvbXBsZXRlOiA9PlxuICAgICAgICAgICAgICAgIEBkZXN0cm95KClcbiAgICAgICAgICAgICAgICBpZiBjYWxsYmFjayBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdCYXNlXG4iLCJcblBvc3RWaWV3QmFzZSA9IHJlcXVpcmUgJy4uL2Fic3RyYWN0L1Bvc3RWaWV3QmFzZS5jb2ZmZWUnXG5cblxuXG5jbGFzcyBGYWNlYm9va1Bvc3RWaWV3IGV4dGVuZHMgUG9zdFZpZXdCYXNlXG5cblxuICAgIGNvbnN0cnVjdG9yOiAob3B0cykgLT5cbiAgICAgICAgQHRlbXBsYXRlID0gcmVxdWlyZSAnLi4vLi4vLi4vLi4vdGVtcGxhdGVzL2Nvbm5lY3QvZmFjZWJvb2stcG9zdC5qYWRlJ1xuICAgICAgICBzdXBlcihvcHRzKVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGYWNlYm9va1Bvc3RWaWV3XG5cblxuIiwiXG5Qb3N0Vmlld0Jhc2UgPSByZXF1aXJlICcuLi9hYnN0cmFjdC9Qb3N0Vmlld0Jhc2UuY29mZmVlJ1xuXG5cbmNsYXNzIEluc3RhZ3JhbVBvc3RWaWV3IGV4dGVuZHMgUG9zdFZpZXdCYXNlXG5cblxuICAgIGNvbnN0cnVjdG9yOiAob3B0cykgLT5cblxuICAgICAgICBAdGVtcGxhdGUgPSByZXF1aXJlICcuLi8uLi8uLi8uLi90ZW1wbGF0ZXMvY29ubmVjdC9pbnN0YWdyYW0tcG9zdC5qYWRlJ1xuXG4gICAgICAgIHN1cGVyKG9wdHMpXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEluc3RhZ3JhbVBvc3RWaWV3XG5cblxuIiwiXG5Qb3N0Vmlld0Jhc2UgPSByZXF1aXJlICcuLi9hYnN0cmFjdC9Qb3N0Vmlld0Jhc2UuY29mZmVlJ1xuXG5cblxuY2xhc3MgVHdpdHRlclBvc3RWaWV3IGV4dGVuZHMgUG9zdFZpZXdCYXNlXG5cblxuICAgIGNvbnN0cnVjdG9yOiAob3B0cykgLT5cbiAgICAgICAgQHRlbXBsYXRlID0gcmVxdWlyZSAnLi4vLi4vLi4vLi4vdGVtcGxhdGVzL2Nvbm5lY3QvdHdpdHRlci1wb3N0LmphZGUnXG4gICAgICAgIHN1cGVyKG9wdHMpXG5cblxuICAgIGluaXRpYWxpemU6IChvcHRzKSAtPlxuICAgICAgICBzdXBlcihvcHRzKVxuICAgICAgICAjIEBwYXJzZUVudGl0aWVzKClcblxuXG5cblxuXG5cbiAgICBwYXJzZUVudGl0aWVzOiAtPlxuXG4gICAgICAgIHRleHQgPSBAbW9kZWwuZ2V0KCd0ZXh0JylcbiAgICAgICAgdGV4dCA9IHRleHQuc3BsaXQoXCImYW1wO1wiKS5qb2luKFwiJlwiKVxuICAgICAgICBAbW9kZWwuc2V0KCd0ZXh0JyAsIHRleHQpXG5cbiAgICBhZnRlclJlbmRlcjogLT5cblxuXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gVHdpdHRlclBvc3RWaWV3XG5cblxuIiwiXG5SYWNrZXRTY2VuZSA9IHJlcXVpcmUgJy4vc2NlbmUvUmFja2V0U2NlbmUuY29mZmVlJ1xuUmFja2V0Q2FtZXJhID0gcmVxdWlyZSAnLi9zY2VuZS9SYWNrZXRDYW1lcmEuY29mZmVlJ1xuUmFja2V0UmVuZGVyZXIgPSByZXF1aXJlICcuL1JhY2tldFJlbmRlcmVyLmNvZmZlZSdcblJvdGF0aW9uQ29udHJvbHMgPSByZXF1aXJlICcuL2NvbnRyb2wvUm90YXRpb25Db250cm9scy5jb2ZmZWUnXG5cblxuXG5jbGFzcyBSYWNrZXRHTFxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG5cbiAgICAgICAgXy5leHRlbmQoQCwgQmFja2JvbmUuRXZlbnRzKVxuXG5cblxuICAgICAgICBvcHRzLmFudGlhbGlhcyA9IHRydWVcbiAgICAgICAgQCRlbCA9IG9wdHMuJGVsXG5cblxuICAgICAgICBAc2NlbmUgPSB3aW5kb3cuc2NlbmUgPSBuZXcgUmFja2V0U2NlbmUod2luZG93LmlubmVyV2lkdGgsQCRlbC5maW5kKFwiLmdsLWNvbnRhaW5lclwiKS5oZWlnaHQoKSwgb3B0cy5tb2RlbCwgQCRlbC5maW5kKFwiLmdsLWNvbnRhaW5lclwiKVswXSlcbiAgICAgICAgQHJlbmRlcmVyID0gbmV3IFJhY2tldFJlbmRlcmVyKG9wdHMsIEBzY2VuZS5zY2VuZSAsIEBzY2VuZS5jYW1lcmEsIEBzY2VuZS5yZW5kZXJPcGVyYXRpb24pXG4gICAgICAgIEBzY2VuZS5yZW5kZXJlciA9IEByZW5kZXJlclxuXG5cblxuXG4gICAgYWRkRXZlbnRzOiAtPlxuICAgICAgICAkKHdpbmRvdykucmVzaXplIEByZXNpemVcblxuICAgICAgICAjaW5pdCBjb250cm9sc1xuICAgICAgICBAcm90YXRpb25Db250cm9scyA9IG5ldyBSb3RhdGlvbkNvbnRyb2xzIEAkZWxbMF1cbiAgICAgICAgQHJvdGF0aW9uQ29udHJvbHMub24gXCJwYW5cIiAsIEBoYW5kbGVDb250cm9sc1xuXG5cbiAgICAgICAgQHNjZW5lLm9uIFwicmFja2V0TW92aW5nU3RhcnRcIiAsIEBoYW5kbGVSYWNrZXRNb3ZlbWVudFxuICAgICAgICBAc2NlbmUub24gXCJyYWNrZXRNb3ZpbmdVcGRhdGVcIiAsIEBoYW5kbGVSYWNrZXRNb3ZlbWVudFxuICAgICAgICBAc2NlbmUub24gXCJyYWNrZXRNb3ZpbmdDb21wbGV0ZVwiICwgQGhhbmRsZVJhY2tldE1vdmVtZW50XG4gICAgICAgIEBzY2VuZS5vbiBcInJhY2tldExvYWRlZFwiICwgQGhhbmRsZU9iamVjdHNMb2FkZWRcblxuXG5cblxuICAgIGhhbmRsZUNvbnRyb2xzOiAoZGF0YSkgPT5cbiAgICAgICAgQHNjZW5lLmNvbnRyb2xSb3RhdGlvbihkYXRhKVxuXG4gICAgaGFuZGxlUmFja2V0TW92ZW1lbnQ6IChlLCB1c2VyKSA9PlxuXG5cblxuICAgICAgICBAdHJpZ2dlciBlLnR5cGUgLCBAc2NlbmUuZ2V0SG90c3BvdHNQb3NpdGlvbnMoKSwgdXNlclxuXG5cbiAgICBoYW5kbGVPYmplY3RzTG9hZGVkOiAoKSA9PlxuXG4gICAgICAgIEB0cmlnZ2VyIFwib2JqZWN0c0xvYWRlZFwiXG4gICAgICAgIEByZXNpemUoKVxuXG5cbiAgICByZXNpemU6ID0+XG4gICAgICAgIEBfaGVpZ2h0ID0gQCRlbC5maW5kKCcuZ2wtY29udGFpbmVyJykuaGVpZ2h0KClcbiAgICAgICAgQF93aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIEBzY2VuZS5yZXNpemUoQF93aWR0aCwgQF9oZWlnaHQpXG4gICAgICAgIEByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCBAX2hlaWdodClcbiAgICAgICAgQGhhbmRsZVJhY2tldE1vdmVtZW50KHt0eXBlOlwicmFja2V0TW92aW5nVXBkYXRlXCJ9KVxuXG5cblxuICAgIGluaXRpYWxpemU6IC0+XG5cbiAgICAgICAgQCRlbC5maW5kKFwiLmdsLWNvbnRhaW5lclwiKS5hcHBlbmQgQHJlbmRlcmVyLmRvbUVsZW1lbnRcblxuICAgICAgICAjQF9jb250cm9scyA9IG5ldyBUSFJFRS5PcmJpdENvbnRyb2xzIEBfY2FtZXJhXG5cbiAgICAgICAgQHNjZW5lLmluaXRpYWxpemUoKVxuXG4gICAgICAgIEBhZGRFdmVudHMoKVxuICAgICAgICBAcmVuZGVyZXIucmVuZGVyVGltZSgpXG5cbiAgICBtb3ZlUmFja2V0OiAoZGF0YSkgPT5cbiAgICAgICAgQHNjZW5lLm1vdmVSYWNrZXQgZGF0YVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFja2V0R0xcbiIsIlZpZXdCYXNlID0gcmVxdWlyZSAnLi4vYWJzdHJhY3QvVmlld0Jhc2UuY29mZmVlJ1xuXG5jbGFzcyBSYWNrZXRQcmVsb2FkZXJWaWV3IGV4dGVuZHMgVmlld0Jhc2VcblxuICAgIGNvbnN0cnVjdG9yOiAob3B0cykgLT5cbiAgICAgICAgc3VwZXIgb3B0c1xuXG4gICAgICAgIEB0ZW1wbGF0ZSA9IHJlcXVpcmUgJy4uLy4uLy4uLy4uL3RlbXBsYXRlcy9zcGVjcy9sb2FkZXIvc3BlY3MtbG9hZGVyLmphZGUnXG5cblxuXG5cbiAgICBpbml0aWFsaXplOiAob3B0cykgLT5cbiAgICAgICAgc3VwZXIgb3B0c1xuXG5cblxuXG4gICAgdHJhbnNpdGlvbkNUQTogKGNhbGxiYWNrKSAtPlxuICAgICAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuICAgICAgICAgICAgb25Db21wbGV0ZTogLT5cbiAgICAgICAgICAgICAgICBpZiBjYWxsYmFjaz9cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgICAgIHRsLmFkZCBUd2Vlbk1heC50byBAJGVsLmZpbmQoXCIjc3BlY3MtbG9hZGVyXCIpICwgLjUgLFxuICAgICAgICAgICAgYXV0b0FscGhhOjBcblxuICAgICAgICB0bC5hZGQgVHdlZW5NYXgudG8gQCRlbC5maW5kKFwiI3NwZWNzLWN0YVwiKSAsIDEgLFxuICAgICAgICAgICAgYXV0b0FscGhhOjFcblxuXG5cblxuXG5cbiAgICBwcm9ncmVzczogKGxvYWRlZCkgPT5cblxuXG5cbiAgICAgICAgcGVyY2VudCA9IE1hdGguY2VpbCBsb2FkZWQgKiAxMDBcbiAgICAgICAgQHByb2dyZXNzVGV4dC5odG1sKHBlcmNlbnQpXG5cbiAgICAgICAgVHdlZW5NYXgudG8gQHByb2dyZXNzQ2lyY2xlICwgLjEgLFxuICAgICAgICAgICAgZHJhd1NWRzpcIiN7cGVyY2VudH0lXCJcblxuXG5cbiAgICBhZnRlclJlbmRlcjogLT5cbiAgICAgICAgQHByb2dyZXNzVGV4dCA9IEAkZWwuZmluZChcIi5wcm9ncmVzcyAuYW1vdW50XCIpXG4gICAgICAgIEBwcm9ncmVzc0NpcmNsZSA9IEAkZWwuZmluZChcImcubG9hZC1tZXRlciBjaXJjbGVcIilcblxuICAgICAgICBUd2Vlbk1heC5zZXQgQHByb2dyZXNzQ2lyY2xlICxcbiAgICAgICAgICAgIHJvdGF0aW9uOlwiLTkwZGVnXCJcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFja2V0UHJlbG9hZGVyVmlld1xuXG4iLCJjbGFzcyBSYWNrZXRSZW5kZXJlciBleHRlbmRzIFRIUkVFLldlYkdMUmVuZGVyZXJcblxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMgLHNjZW5lICwgY2FtZXJhLCBzY2VuZVJlbmRlck9wZXJhdGlvbikgLT5cbiAgICAgICAgb3B0cy5kZXZpY2VQaXhlbFJhdGlvID0gMVxuICAgICAgICBzdXBlcihvcHRzKVxuICAgICAgICBAc2NlbmUgPSBzY2VuZVxuICAgICAgICBAY2FtZXJhID0gY2FtZXJhXG4gICAgICAgIEByZW5kZXJPcGVyYXRpb24gPSBzY2VuZVJlbmRlck9wZXJhdGlvblxuXG5cblxuXG5cbiAgICByZW5kZXJUaW1lOiA9PlxuXG4gICAgICAgIGlmIEByZW5kZXJPcGVyYXRpb24/IHRoZW4gQHJlbmRlck9wZXJhdGlvbigpXG5cbiAgICAgICAgQHJlbmRlciBAc2NlbmUgLCBAY2FtZXJhXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggQHJlbmRlclRpbWUgKVxuXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhY2tldFJlbmRlcmVyXG5cbiIsIlxuVmlld0Jhc2UgPSByZXF1aXJlICcuLy4uL2Fic3RyYWN0L1ZpZXdCYXNlLmNvZmZlZSdcblJhY2tldEdMICA9IHJlcXVpcmUgJy4vUmFja2V0R0wuY29mZmVlJ1xuSG90c3BvdFZpZXcgPSByZXF1aXJlICcuL2hvdHNwb3RzL0hvdHNwb3RWaWV3LmNvZmZlZSdcblJhY2tldFByZWxvYWRlclZpZXcgPSByZXF1aXJlICcuL1JhY2tldFByZWxvYWRlclZpZXcuY29mZmVlJ1xuXG5BcHBNb2RlbCA9IHJlcXVpcmUgJy4uLy4uL21vZGVscy9BcHBNb2RlbC5jb2ZmZWUnXG5cbmNsYXNzIFJhY2tldFZpZXcgZXh0ZW5kcyBWaWV3QmFzZVxuXG4gICAgY29uc3RydWN0b3I6IChvcHRzKSAtPlxuICAgICAgICBAYXBwTW9kZWwgPSBBcHBNb2RlbC5nZXRJbnN0YW5jZSgpXG5cbiAgICAgICAgc3VwZXIob3B0cylcblxuXG5cblxuICAgIGluaXRpYWxpemU6IChvcHRzKSAtPlxuICAgICAgICBzdXBlciBvcHRzXG5cbiAgICAgICAgQGxvYWRBc3NldHMoKVxuXG5cblxuXG5cbiAgICBsb2FkQXNzZXRzOiAtPlxuICAgICAgICBpZiAoIUBpc1Bob25lICYmIEBpc1dlYkdMKCkpXG4gICAgICAgICAgICBAcHJlbG9hZGVyID0gbmV3IFJhY2tldFByZWxvYWRlclZpZXdcbiAgICAgICAgICAgICAgICBlbDpAJGVsLmZpbmQoXCIjbG9hZGVyLWNvbnRhaW5lclwiKVxuICAgICAgICAgICAgICAgIG1vZGVsOkBtb2RlbFxuXG4gICAgICAgICAgICBAcHJlbG9hZGVyLnRyYW5zaXRpb25JbigpXG5cbiAgICAgICAgICAgIEBtb2RlbC5vbiBcImFzc2V0c1JlYWR5XCIgLCBAaW5pdGlhbGl6ZVJhY2tldFxuICAgICAgICAgICAgQG1vZGVsLm9uIFwiYXNzZXRzUHJvZ3Jlc3NcIiAsIEBwcmVsb2FkZXIucHJvZ3Jlc3NcbiAgICAgICAgICAgIEBtb2RlbC5sb2FkQXNzZXRzKClcblxuXG4gICAgaW5pdGlhbGl6ZVJhY2tldDogPT5cblxuICAgICAgICBAY3JlYXRlUmFja2V0R2woKVxuICAgICAgICBAY3JlYXRlSG90c3BvdHNWaWV3KClcbiAgICAgICAgQGRlbGVnYXRlRXZlbnRzIEBnZW5lcmF0ZUV2ZW50cygpXG5cbiAgICBpbml0aWFsVXBkYXRlOiAoZSkgPT5cbiAgICAgICAgQGhvdHNwb3RzLnVwZGF0ZUhvdHNwb3RzKGUpXG4gICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIEByYWNrZXRHTC5vbmNlIFwicmFja2V0TW92aW5nVXBkYXRlXCIgLCBAcmVtb3ZlQ1RBXG5cbiAgICAgICAgICAgIEBwcmVsb2FkZXIudHJhbnNpdGlvbkNUQSgpXG4gICAgICAgICAgICBAdHJhbnNpdGlvbkluKClcbiAgICAgICAgLFxuICAgICAgICAgICAgNTBcblxuICAgIHJlbW92ZUNUQTogKGUpID0+XG4gICAgICAgIEBob3RzcG90cy51cGRhdGVIb3RzcG90cyhlKVxuICAgICAgICBAcHJlbG9hZGVyLnRyYW5zaXRpb25PdXQoKVxuICAgICAgICBAcmFja2V0R0wub24gXCJyYWNrZXRNb3ZpbmdVcGRhdGVcIiAsIEBob3RzcG90cy51cGRhdGVIb3RzcG90c1xuXG4gICAgZ2VuZXJhdGVFdmVudHM6IC0+XG5cbiAgICAgICAgQHJhY2tldEdMLm9uIFwib2JqZWN0c0xvYWRlZFwiICwgIEBob3RzcG90cy5pbml0SG90c3BvdHNcblxuICAgICAgICBAcmFja2V0R0wub25jZSBcInJhY2tldE1vdmluZ1VwZGF0ZVwiICwgQGluaXRpYWxVcGRhdGVcbiAgICAgICAgQHJhY2tldEdMLm9uIFwicmFja2V0TW92aW5nQ29tcGxldGVcIiAsIEBob3RzcG90cy5vblJhY2tldFRyYW5zaXRpb25Db21wbGV0ZVxuICAgICAgICBAaG90c3BvdHMub24gXCJob3RzcG90Q2xpY2tlZFwiICwgQHJhY2tldEdMLm1vdmVSYWNrZXRcblxuXG4gICAgICAgIGV2ZW50cyA9IHt9XG5cbiAgICAgICAgcmV0dXJuIGV2ZW50c1xuXG5cblxuICAgIGNyZWF0ZVJhY2tldEdsOiAtPlxuICAgICAgICBAcmFja2V0R0wgPSBuZXcgUmFja2V0R0xcbiAgICAgICAgICAgICRlbDpAJGVsLmZpbmQoJy5yYWNrZXQtc3BlY3MtY29udGVudCcpXG4gICAgICAgICAgICBtYXhMaWdodHM6IDIwXG4gICAgICAgICAgICBhbHBoYTp0cnVlXG4gICAgICAgICAgICBtb2RlbDpAbW9kZWwuYXR0cmlidXRlc1xuXG4gICAgICAgIEByYWNrZXRHTC5pbml0aWFsaXplKClcblxuXG5cblxuICAgIGNyZWF0ZUhvdHNwb3RzVmlldzogLT5cbiAgICAgICAgQGhvdHNwb3RzID0gbmV3IEhvdHNwb3RWaWV3XG4gICAgICAgICAgICBlbDpAJGVsLmZpbmQoJy5yYWNrZXQtc3BlY3MtY29udGVudCcpXG4gICAgICAgICAgICBtb2RlbDpAbW9kZWwuZ2V0KCdob3RzcG90cycpXG5cblxuICAgICNvdmVycmlkZSByZW5kZXIgdG8gZG8gbm90aGluZ1xuICAgIHRyYW5zaXRpb25JbjogKGNhbGxiYWNrKSA9PlxuXG5cbiAgICAgICAgVHdlZW5NYXgudG8gQCRlbC5maW5kKCcucmFja2V0LXNwZWNzLWNvbnRlbnQnKSAsIC40LFxuICAgICAgICAgICAgYXV0b0FscGhhOjFcbiAgICAgICAgICAgIGVhc2U6Q3ViaWMuZWFzZU91dFxuICAgICAgICAgICAgb25Db21wbGV0ZTogPT5cbiAgICAgICAgICAgICAgICBpZiBjYWxsYmFjayBpc250IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpXG5cbm1vZHVsZS5leHBvcnRzID0gUmFja2V0Vmlld1xuIiwiY2xhc3MgQ29tcG91bmRPYmplY3RcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBfLmV4dGVuZCBAICwgQmFja2JvbmUuRXZlbnRzXG5cbiAgICAgICAgQGdlb21ldHJ5ID0gW11cbiAgICAgICAgQG9iamVjdHMgPSB7fVxuXG5cbiAgICBsb2FkOiAob2JqZWN0RGF0YSkgLT5cbiAgICAgICAgaWYgIUBvYmplY3Q/XG4gICAgICAgICAgICBAbG9hZGVycyA9IEBwYXJzZSBvYmplY3REYXRhXG4gICAgICAgICAgICBAbG9hZE9iamVjdHMoKVxuXG5cblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiT2JqZWN0IEFscmVhZHkgTG9hZGVkXCIpXG5cbiAgICBsb2FkT2JqZWN0czogKCkgLT5cblxuICAgICAgICBmb3IgbG9hZGVyIGluIEBsb2FkZXJzXG5cbiAgICAgICAgICAgIGlmIGxvYWRlci5fanNVcmw/XG4gICAgICAgICAgICAgICAgbG9hZGVyLmxvYWQgbG9hZGVyLl9qc1VybCAsIEBnZW9tZXRyeUxvYWRlZFxuXG4gICAgICAgICAgICBlbHNlIGlmIGxvYWRlci5fb2JqVXJsP1xuICAgICAgICAgICAgICAgIGxvYWRlci5sb2FkIGxvYWRlci5fb2JqVXJsLCBAb2JqZWN0TG9hZGVkUHJveHkobG9hZGVyKVxuXG5cblxuXG5cbiAgICBwYXJzZTogKGRhdGEpIC0+XG4gICAgICAgIGxvYWRlcnMgPSBbXVxuICAgICAgICBmb3Igayx2IG9mIGRhdGFcbiAgICAgICAgICAgIHN3aXRjaCBrXG4gICAgICAgICAgICAgICAgd2hlbiBcIm9ialwiXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHZcbiAgICAgICAgICAgICAgICB3aGVuIFwianNcIlxuICAgICAgICAgICAgICAgICAgICBqcyA9IHZcbiAgICAgICAgaWYganM/XG4gICAgICAgICAgICBpZiAkLmlzQXJyYXkoanMpXG4gICAgICAgICAgICAgICAgbG9hZGVycyA9IEBjcmVhdGVMb2FkZXJzKGpzKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGxvYWRlcnMucHVzaCBAY3JlYXRlSnNMb2FkZXIoanMpXG5cbiAgICAgICAgZWxzZSBpZiBvYmo/XG4gICAgICAgICAgICBpZiAkLmlzQXJyYXkob2JqKVxuICAgICAgICAgICAgICAgIGxvYWRlcnMgPSBAY3JlYXRlTG9hZGVycyhudWxsLCBvYmopXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbG9hZGVycy5wdXNoIEBjcmVhdGVPYmpMb2FkZXIob2JqKVxuXG5cbiAgICAgICAgcmV0dXJuIGxvYWRlcnNcblxuXG5cbiAgICBjcmVhdGVMb2FkZXJzOiAoanMsIG9iaikgPT5cbiAgICAgICAgbG9hZGVycyA9IFtdXG4gICAgICAgIGlmIGpzP1xuICAgICAgICAgICAgZm9yIGogaW4ganNcbiAgICAgICAgICAgICAgICBsb2FkZXJzLnB1c2ggQGNyZWF0ZUpzTG9hZGVyKGopXG4gICAgICAgICAgICByZXR1cm4gbG9hZGVyc1xuICAgICAgICBlbHNlIGlmIG9iaj9cbiAgICAgICAgICAgIGZvciBvLGkgaW4gb2JqXG4gICAgICAgICAgICAgICAgbG9hZGVycy5wdXNoIEBjcmVhdGVPYmpMb2FkZXIobylcbiAgICAgICAgICAgIHJldHVybiBsb2FkZXJzXG5cblxuXG4gICAgY3JlYXRlSnNMb2FkZXI6IChqcykgPT5cbiAgICAgICAgbG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKVxuICAgICAgICBsb2FkZXIuX2pzVXJsID0ganNcblxuICAgICAgICByZXR1cm4gbG9hZGVyXG5cbiAgICBjcmVhdGVPYmpMb2FkZXI6IChvYmopID0+XG4gICAgICAgIGxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKVxuICAgICAgICBsb2FkZXIuX29ialVybCA9IG9iai51cmxcbiAgICAgICAgbG9hZGVyLl9tdGxEYXRhID0gb2JqXG4gICAgICAgIGxvYWRlci5fX2lkID0gb2JqLmlkXG5cbiAgICAgICAgcmV0dXJuIGxvYWRlclxuXG5cblxuICAgIGdlb21ldHJ5TG9hZGVkOiAoZ2VvbSwgbWF0KSA9PlxuXG4gICAgICAgIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoIGdlb20gLCBtYXRbMF1cbiAgICAgICAgQG9iamVjdExvYWRlZChvYmplY3QpXG5cbiAgICBvYmplY3RMb2FkZWRQcm94eTogKGxvYWRlcikgPT5cblxuXG4gICAgICAgIHJldHVybiAob2JqKSA9PlxuICAgICAgICAgICAgb2JqLl9sb2FkZXJEYXRhID0gbG9hZGVyLl9tdGxEYXRhXG4gICAgICAgICAgICBvYmouX19pZCA9IGxvYWRlci5fX2lkXG4gICAgICAgICAgICBAb2JqZWN0TG9hZGVkKG9iailcblxuXG4gICAgb2JqZWN0TG9hZGVkOiAob2JqKSA9PlxuICAgICAgICBvID0gb2JqXG4gICAgICAgIGlmIG9iai5jaGlsZHJlbi5sZW5ndGggPiAwXG4gICAgICAgICAgICBvID0gb2JqLmNoaWxkcmVuW29iai5jaGlsZHJlbi5sZW5ndGgtMV1cblxuXG4gICAgICAgIG8uX2xvYWRlckRhdGEgPSBvYmouX2xvYWRlckRhdGFcbiAgICAgICAgby5fX2lkID0gb2JqLl9faWRcblxuXG5cblxuICAgICAgICBAb2JqZWN0c1tvLl9faWRdID0gb1xuICAgICAgICBpZiBPYmplY3Qua2V5cyhAb2JqZWN0cykubGVuZ3RoIGlzIEBsb2FkZXJzLmxlbmd0aFxuICAgICAgICAgICAgQGNyZWF0ZUdyb3VwKClcblxuXG5cblxuICAgIGNyZWF0ZUdyb3VwOiAoKSA9PlxuXG4gICAgICAgIEBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpXG4gICAgICAgIHdpbmRvd1snM2QnXSA9IHt9XG4gICAgICAgIGZvciBrLG9iaiBvZiBAb2JqZWN0c1xuXG4gICAgICAgICAgICB3aW5kb3dbJzNkJ11bb2JqLl9faWRdID0gb2JqXG4gICAgICAgICAgICBAZ3JvdXAuYWRkIG9ialxuXG5cblxuICAgICAgICBAZ3JvdXBMb2FkZWQoKVxuXG5cbiAgICBncm91cExvYWRlZDogPT5cbiAgICAgICAgQHRyaWdnZXIgXCJvYmplY3RMb2FkZWRcIiAsIEBncm91cFxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG91bmRPYmplY3RcblxuXG5cblxuXG5cbiIsImdsb2JhbCA9IHJlcXVpcmUgJy4vZ2xvYmFsLmNvZmZlZSdcblxuXG5cbmdlb1NldCA9IGZhbHNlXG5cbnJlc2V0R2VvbWV0cnkgPSAoY29tcG9uZW50cykgLT5cbiAgICBnZW9TZXQgPSB0cnVlXG5cblxuXG4gICAgZ2xvYmFsLnRvZ2dsZVZpc2liaWxpdHkoY29tcG9uZW50cywgZmFsc2UpXG5cblxuXG5tb2R1bGUuZXhwb3J0cy5nZXRBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cblxuICAgIGlmICFnZW9TZXRcbiAgICAgICAgcmVzZXRHZW9tZXRyeShjb21wb25lbnRzKVxuXG5cblxuICAgIHRsID0gbmV3IFRpbWVsaW5lTWF4XG4gICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlOiAtPlxuICAgICAgICAgICAgZ2xvYmFsLnRvZ2dsZVZpc2liaWxpdHkoY29tcG9uZW50cywgZmFsc2UpXG5cblxuICAgICAgICBvblN0YXJ0OiAtPlxuICAgICAgICAgICAgZ2xvYmFsLnRvZ2dsZVZpc2liaWxpdHkoY29tcG9uZW50cywgdHJ1ZSlcblxuXG4gICAgd2lyZWZyYW1lID0gY29tcG9uZW50cy53aXJlZnJhbWVcbiAgICBwbGF0ZSA9IGNvbXBvbmVudHMucGxhdGVcblxuICAgIGFscGhhID0gVHdlZW5NYXguZnJvbVRvIFt3aXJlZnJhbWUubWF0ZXJpYWwscGxhdGUubWF0ZXJpYWxdICwgLjUgLFxuICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgaW1tZWRpYXRlUmVuZGVyOnRydWVcbiAgICAsXG4gICAgICAgIG9wYWNpdHk6MVxuXG5cbiAgICB3aXJlUG9zID0gVHdlZW5NYXguZnJvbVRvIFt3aXJlZnJhbWUucG9zaXRpb25dICwgMSAsXG4gICAgICAgIHg6LS41XG4gICAgLFxuICAgICAgICB4OjBcblxuICAgIHBsYXRlUG9zID0gVHdlZW5NYXguZnJvbVRvIFtwbGF0ZS5wb3NpdGlvbl0gLCAxICxcbiAgICAgICAgeDotLjJcbiAgICAsXG4gICAgICAgIHg6MFxuXG5cblxuXG4gICAgdGwuYWRkIFthbHBoYSwgd2lyZVBvcywgcGxhdGVQb3NdICwgXCItPTBcIiAsIFwibm9ybWFsXCIgLCAuM1xuICAgIHRsLnBhdXNlZCh0cnVlKVxuICAgIHJldHVybiB0bFxuIiwiXG5cblxuXG5VdGlscyA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL2NvbW1vbi5jb2ZmZWUnXG5TZWdMZW5ndGggPSAzXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cy5hcHBseUluaXRpYWxTdGF0ZXMgPSAoY29tcG9uZW50cykgLT5cblxuICAgIG1vZHVsZS5leHBvcnRzLmhvdHNwb3RBbmltYXRpb24oY29tcG9uZW50cykucGF1c2UoKS5raWxsKClcbiAgICBtb2R1bGUuZXhwb3J0cy5jb250ZW50SG90c3BvdEFuaW1hdGlvbihjb21wb25lbnRzKS5wYXVzZSgpLmtpbGwoKVxuICAgIG1vZHVsZS5leHBvcnRzLmNvbnRlbnRBbmltYXRpb24oY29tcG9uZW50cykucGF1c2UoKS5raWxsKClcblxuXG5cbm1vZHVsZS5leHBvcnRzLmRlZmluZVRpbWVsaW5lQ29tcG9uZW50cyA9ICgkdCwgJHBhdGgsICRjb250ZW50LCAkY2hzKSAtPlxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaG90c3BvdDpcbiAgICAgICAgICAgIHllbGxvd1N0cm9rZTogJHQuZmluZChcImcueWVsbG93LXN0cm9rZSBjaXJjbGVcIilcbiAgICAgICAgICAgIHdoaXRlU3Ryb2tlOiAkdC5maW5kKFwiZy53aGl0ZS1zdHJva2UgY2lyY2xlXCIpXG4gICAgICAgICAgICBwbHVzOiAkdC5maW5kKFwiZy5udW1iZXIgZ1wiKVxuICAgICAgICAgICAgb3JhbmdlQ2lyY2xlOiAkdC5maW5kKFwiZy5vcmFuZ2UtY2lyY2xlIGNpcmNsZVwiKVxuICAgICAgICAgICAgaG92ZXJTdHJva2U6ICR0LmZpbmQoXCJnLmhvdmVyLXN0cm9rZSBjaXJjbGVcIilcbiAgICAgICAgY29udGVudEhvdHNwb3Q6XG4gICAgICAgICAgICBncmF5U3Ryb2tlOiAkY2hzLmZpbmQoXCJnLmdyYXktc3Ryb2tlIGNpcmNsZVwiKVxuICAgICAgICAgICAgcGx1czogJGNocy5maW5kKFwiZy5wbHVzLXNpZ24gZ1wiKVxuICAgICAgICAgICAgZ3JheUNpcmNsZTogJGNocy5maW5kKFwiZy5ncmF5LWNpcmNsZSBjaXJjbGVcIilcbiAgICAgICAgcGF0aDokcGF0aFxuICAgICAgICBjb250ZW50OiRjb250ZW50XG4gICAgfVxuXG5cbm1vZHVsZS5leHBvcnRzLmhvdHNwb3RBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cbiAgICAjQ2lyY2xlIEhvdHNwb3RcblxuICAgIHRsID0gbmV3IFRpbWVsaW5lTWF4XG5cblxuXG4gICAgc3Ryb2tlcyA9IFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8gW2NvbXBvbmVudHMuaG90c3BvdC55ZWxsb3dTdHJva2UsY29tcG9uZW50cy5ob3RzcG90LndoaXRlU3Ryb2tlXSAsIDEsXG4gICAgICAgIGRyYXdTVkc6XCIwJVwiXG4gICAgICAgIHJvdGF0aW9uOlwiLTM2MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICxcbiAgICAgICAgZHJhd1NWRzpcIjEwMCVcIlxuICAgICAgICByb3RhdGlvbjpcIjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlSW5PdXRcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuICAgICxcbiAgICAgICAgLjE1XG5cblxuXG4gICAgcGx1cyA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmhvdHNwb3QucGx1cyAsIC41ICxcbiAgICAgICAgcm90YXRpb246XCIzNjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcbiAgICAgICAgYXR0cjpcbiAgICAgICAgICAgIHk6XCIwcHhcIlxuICAgICxcbiAgICAgICAgcm90YXRpb246XCIwZGVnXCJcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwiXG4gICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcbiAgICAgICAgYXR0cjpcbiAgICAgICAgICAgIHk6XCItMXB4XCJcblxuICAgIGNpcmNsZSA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmhvdHNwb3Qub3JhbmdlQ2lyY2xlLCAuNSAsXG4gICAgICAgIGZpbGw6XCIjRkY2QzAwXCJcbiAgICAgICAgc3Ryb2tlOlwiI0Y0Q0UyMVwiXG4gICAgICAgIHN0cm9rZVdpZHRoOjZcbiAgICAgICAgYXR0cjpcbiAgICAgICAgICAgIHI6MTJcbiAgICAsXG4gICAgICAgIHN0cm9rZVdpZHRoOjRcbiAgICAgICAgYXR0cjpcbiAgICAgICAgICAgIHI6MTBcbiAgICAgICAgZmlsbDpcIiNmZmZmZmZcIlxuICAgICAgICBvdmVyd3JpdGU6XCJwcmVleGlzdGluZ1wiXG5cbiAgICBob3ZlciA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmhvdHNwb3QuaG92ZXJTdHJva2UgLCAuNSAsXG4gICAgICAgIG9wYWNpdHk6MFxuICAgICxcbiAgICAgICAgb3BhY2l0eTowXG5cblxuICAgIGZhZGVXaGl0ZVN0cm9rZSA9IFR3ZWVuTWF4LnRvIGNvbXBvbmVudHMuaG90c3BvdC53aGl0ZVN0cm9rZSAsIDEsXG4gICAgICAgIGRyYXdTVkc6XCIwJVwiXG4gICAgICAgIHJvdGF0aW9uOlwiLTM2MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBlYXNlOkN1YmljLmVhc2VJbk91dFxuXG4gICAgdGwuYWRkIFtzdHJva2VzLHBsdXMsY2lyY2xlLGhvdmVyXVxuICAgIHRsLmFkZCBbZmFkZVdoaXRlU3Ryb2tlXSAsIFwiKz0uNVwiXG5cbiAgICByZXR1cm4gdGxcblxuXG5wYXRoQW5pbWF0aW9uID0gKHApIC0+XG4gICAgcGF0aCA9ICQocClcblxuXG5cbiAgICBkID0gcGF0aC5hdHRyKCdkJylcblxuICAgIGlmICEkKCdodG1sJykuaGFzQ2xhc3MoJ2llJylcbiAgICAgICAgZCA9IGQuc3BsaXQoXCJNXCIpLmpvaW4oXCJcIikuc3BsaXQoXCJMXCIpLmpvaW4oXCIsXCIpLnNwbGl0KFwiLFwiKVxuICAgIGVsc2VcbiAgICAgICAgZCA9IGQuc3BsaXQoXCJNIFwiKS5qb2luKFwiXCIpLnNwbGl0KFwiIEwgXCIpLmpvaW4oXCIgXCIpXG4gICAgICAgIGQgPSBkLnNwbGl0KFwiIFwiKVxuXG4gICAgZGlzdGFuY2UgPSBNYXRoLmZsb29yIFV0aWxzLmRpc3RhbmNlKGRbMF0sZFsxXSxkWzJdLGRbM10pXG5cbiAgICBzZWdtZW50c1RvdGFsID0gTWF0aC5jZWlsKGRpc3RhbmNlLyAoU2VnTGVuZ3RoKSkgLSA0XG4gICAgc2VnbWVudHNOZWVkZWQgPSBNYXRoLmNlaWwoc2VnbWVudHNUb3RhbCAqICBAcHJvZ3Jlc3MoKSlcbiAgICBkYXNoQXJyYXkgPSBbXVxuXG5cblxuICAgIHdoaWxlIHNlZ21lbnRzTmVlZGVkID4gMFxuXG4gICAgICAgIGRhc2hBcnJheS5wdXNoIFNlZ0xlbmd0aFxuICAgICAgICBkYXNoQXJyYXkucHVzaCBTZWdMZW5ndGhcblxuICAgICAgICBzZWdtZW50c05lZWRlZC0tXG5cbiAgICBmaW5hbERhc2ggPSBpZiBkYXNoQXJyYXkubGVuZ3RoIGlzIDAgdGhlbiAwIGVsc2UgU2VnTGVuZ3RoXG4gICAgZGFzaEFycmF5LnB1c2ggIGZpbmFsRGFzaCAsIGRpc3RhbmNlXG5cbiAgICBkYXNoVmFsdWUgPSBkYXNoQXJyYXkudG9TdHJpbmcoKVxuXG4gICAgVHdlZW5NYXguc2V0IHBhdGggLFxuICAgICAgICBzdHJva2VEYXNoYXJyYXk6ZGFzaFZhbHVlXG5cblxubW9kdWxlLmV4cG9ydHMucGF0aEFuaW1hdGlvbiA9IChjb21wb25lbnRzICwgaW5kZXgpIC0+XG4gICAgdGwgPSBuZXcgVGltZWxpbmVNYXhcblxuXG4gICAgcGF0aEFscGhhID0gVHdlZW5NYXguZnJvbVRvIGNvbXBvbmVudHMucGF0aFtpbmRleF0gLCAuNyxcbiAgICAgICAgb3BhY2l0eTowXG4gICAgLFxuICAgICAgICBvcGFjaXR5OjFcblxuICAgIHBhdGhTdHJva2UgPSBUd2Vlbk1heC5mcm9tVG8gY29tcG9uZW50cy5wYXRoW2luZGV4XSwgLjcsIHt9ICxcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlT3V0XG4gICAgICAgIG9uVXBkYXRlOi0+XG5cbiAgICAgICAgICAgIGlmIGluZGV4P1xuICAgICAgICAgICAgICAgIHBhdGhBbmltYXRpb24uY2FsbChALGNvbXBvbmVudHMucGF0aFtpbmRleF0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yIHAgaW4gY29tcG9uZW50cy5wYXRoXG4gICAgICAgICAgICAgICAgICAgIHBhdGhBbmltYXRpb24uY2FsbChALHApXG5cblxuXG5cblxuXG5cbiAgICB0bC5hZGQgW3BhdGhBbHBoYSxwYXRoU3Ryb2tlXVxuXG4gICAgcmV0dXJuIHRsXG5cblxubW9kdWxlLmV4cG9ydHMuY29udGVudEhvdHNwb3RBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cbiAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuXG5cblxuICAgIGNoc1N0cm9rZXMgPSBUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvIFtjb21wb25lbnRzLmNvbnRlbnRIb3RzcG90LmdyYXlTdHJva2VdICwgMSxcbiAgICAgICAgZHJhd1NWRzpcIjAlIDI1JVwiXG4gICAgICAgIHJvdGF0aW9uOlwiLTM2MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBpbW1lZGlhdGVSZW5kZXI6dHJ1ZVxuXG4gICAgLFxuICAgICAgICBkcmF3U1ZHOlwiMTAwJVwiXG4gICAgICAgIHJvdGF0aW9uOlwiMGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBlYXNlOkN1YmljLmVhc2VJbk91dFxuXG4gICAgLFxuICAgICAgICAuMTVcblxuICAgIGNoc1BsdXMgPSBUd2Vlbk1heC5mcm9tVG8gY29tcG9uZW50cy5jb250ZW50SG90c3BvdC5wbHVzICwgLjUgLFxuICAgICAgICByb3RhdGlvbjpcIjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcblxuICAgICxcbiAgICAgICAgcm90YXRpb246XCIxODBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcblxuXG4gICAgbWFrZU1pbnVzID0gVHdlZW5NYXguZnJvbVRvIGNvbXBvbmVudHMuY29udGVudEhvdHNwb3QucGx1cy5maW5kKFwiLnZcIikgLCAuNSAsXG4gICAgICAgIG9wYWNpdHk6MVxuICAgICxcbiAgICAgICAgb3BhY2l0eTowXG5cbiAgICBtaW51c0NvbG9yID0gVHdlZW5NYXguZnJvbVRvIGNvbXBvbmVudHMuY29udGVudEhvdHNwb3QucGx1cy5maW5kKFwiLmhcIikgLCAuNSAsXG4gICAgICAgIGZpbGw6XCIjMmMyYzJjXCJcbiAgICAsXG4gICAgICAgIGZpbGw6XCIjZjRjZTIxXCJcblxuXG4gICAgY2hzQ2lyY2xlID0gVHdlZW5NYXguZnJvbVRvIGNvbXBvbmVudHMuY29udGVudEhvdHNwb3QuZ3JheUNpcmNsZSAsIC41ICxcbiAgICAgICAgc3Ryb2tlOlwiIzJjMmMyY1wiXG4gICAgICAgIG9wYWNpdHk6MVxuICAgICxcbiAgICAgICAgc3Ryb2tlOlwiI2Y0Y2UyMVwiXG4gICAgICAgIG9wYWNpdHk6LjVcblxuICAgIHRsLmFkZCBbY2hzU3Ryb2tlcyxjaHNQbHVzLG1ha2VNaW51cyxtaW51c0NvbG9yLGNoc0NpcmNsZV1cblxuICAgIHJldHVybiB0bFxuXG5cbm1vZHVsZS5leHBvcnRzLmNvbnRlbnRBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cbiAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuXG5cbiAgICAjQ29udGVudCBHbG9iYWxcbiAgICB0aXRsZSA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmNvbnRlbnQuZmluZCgnZW0nKSAsIC41ICxcbiAgICAgICAgY29sb3I6IFwiIzI2MjYyNlwiXG4gICAgICAgIG9wYWNpdHk6LjhcbiAgICAgICAgaW1tZWRpYXRlUmVuZGVyOnRydWVcbiAgICAsXG4gICAgICAgIGNvbG9yOiBcIiNmZjZjMDBcIlxuICAgICAgICBvcGFjaXR5OjFcblxuICAgIHNwbGl0Qm9keSA9IG5ldyBTcGxpdFRleHQgY29tcG9uZW50cy5jb250ZW50LmZpbmQoXCJwID4gc3BhblwiKSAsXG4gICAgICAgIHR5cGU6XCJjaGFycyx3b3Jkc1wiXG5cbiAgICBib2R5ID0gVHdlZW5NYXguc3RhZ2dlckZyb21UbyBzcGxpdEJvZHkuY2hhcnMgLCAxICxcbiAgICAgICAgYWxwaGE6MFxuICAgICAgICBpbW1lZGlhdGVSZW5kZXI6dHJ1ZVxuICAgICxcbiAgICAgICAgYWxwaGE6MVxuICAgICxcbiAgICAgICAgLjAyXG4gICAgXG4gICAgbGlzdEl0ZW1zID0gY29tcG9uZW50cy5jb250ZW50LmZpbmQoXCJ1bCA+IGxpXCIpO1xuICAgIGlmIGxpc3RJdGVtcy5sZW5ndGggPiAwICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGxpc3QgPSBUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvIGxpc3RJdGVtcyAsIC4zNSAsXG4gICAgICAgICAgICBhbHBoYTowLFxuICAgICAgICAgICAgeTotMTBcbiAgICAgICAgICAgIGltbWVkaWF0ZVJlbmRlcjp0cnVlLFxuICAgICAgICAsXG4gICAgICAgICAgICB5OjBcbiAgICAgICAgICAgIGFscGhhOjFcbiAgICAgICAgLFxuICAgICAgICAgICAgLjE1XG4gICAgICAgIFxuICAgIFxuICAgIHRsLmFkZCBbdGl0bGUsYm9keV1cbiAgICBpZiBsaXN0IHRoZW4gdGwuYWRkIGxpc3QgLCBcIi09LjNcIlxuXG5cbiAgICByZXR1cm4gdGxcblxuXG5cbm1vZHVsZS5leHBvcnRzLnRvZ2dsZVZpc2liaWxpdHkgPSAoY29tcG9uZW50cyAsIHRvZ2dsZSkgLT5cblxuICAgIGlmICQuaXNQbGFpbk9iamVjdChjb21wb25lbnRzKVxuICAgICAgICBmb3IgayxjIG9mIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGlmIGMgaW5zdGFuY2VvZiBUSFJFRS5NZXNoXG4gICAgICAgICAgICAgICAgYy52aXNpYmxlID0gdG9nZ2xlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMudG9nZ2xlVmlzaWJpbGl0eShjLHRvZ2dsZSlcblxuICAgIGVsc2UgaWYgJC5pc0FycmF5KGNvbXBvbmVudHMpXG4gICAgICAgIGZvciBjIGluIGNvbXBvbmVudHNcbiAgICAgICAgICAgIGlmIGMgaW5zdGFuY2VvZiBUSFJFRS5NZXNoXG4gICAgICAgICAgICAgICAgYy52aXNpYmxlID0gdG9nZ2xlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMudG9nZ2xlVmlzaWJpbGl0eShjLHRvZ2dsZSlcbiIsIlxuXG5tb2R1bGUuZXhwb3J0cy5nZXRBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cblxuXG5cblxuICAgIHJpbmdTY2FsZSA9IFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8gW2NvbXBvbmVudHMucmluZzAuc2NhbGUsIGNvbXBvbmVudHMucmluZzEuc2NhbGUgLCBjb21wb25lbnRzLnJpbmcyLnNjYWxlIF0gLCAxICxcbiAgICAgICAgeDowLjFcbiAgICAgICAgejowLjFcbiAgICAgICAgaW1tZWRpYXRlUmVuZGVyOnRydWVcbiAgICAsXG4gICAgICAgIHg6LjdcbiAgICAgICAgejouN1xuICAgICAgICBlYXNlOkN1YmljLmVhc2VJbk91dFxuICAgICxcbiAgICAgICAgLjJcblxuXG5cblxuICAgIHJpbmcxVHJhbnNsYXRlID0gVHdlZW5NYXguZnJvbVRvIFtjb21wb25lbnRzLnJpbmcxLnBvc2l0aW9uXSAsIDEuNSAsXG4gICAgICAgIHk6MFxuICAgICAgICBpbW1lZGlhdGVSZW5kZXI6dHJ1ZVxuICAgICxcbiAgICAgICAgeTo2XG4gICAgICAgIGVhc2U6Q3ViaWMuZWFzZUluT3V0ZXJ1Y1xuXG4gICAgcmluZzJUcmFuc2xhdGUgPSBUd2Vlbk1heC5mcm9tVG8gW2NvbXBvbmVudHMucmluZzIucG9zaXRpb25dICwgMS41ICxcbiAgICAgICAgeTowXG4gICAgICAgIGltbWVkaWF0ZVJlbmRlcjp0cnVlXG4gICAgLFxuICAgICAgICB5OjEyXG4gICAgICAgIGVhc2U6Q3ViaWMuZWFzZUluT3V0XG5cblxuXG4gICAgcmluZ1dpZGVTY2FsZSA9IFR3ZWVuTWF4LmZyb21UbyBbY29tcG9uZW50cy5yaW5nV2lkZS5zY2FsZV0gLCAxLjUgLFxuICAgICAgICB4OjAuMVxuICAgICAgICB6OjAuMVxuICAgICAgICBpbW1lZGlhdGVSZW5kZXI6dHJ1ZVxuICAgICxcbiAgICAgICAgeDouN1xuICAgICAgICB6Oi43XG4gICAgICAgIGVhc2U6Q3ViaWMuZWFzZUluT3V0XG5cbiAgICByaW5nV2lkZVRyYW5zbGF0ZSA9IFR3ZWVuTWF4LmZyb21UbyBbY29tcG9uZW50cy5yaW5nV2lkZS5wb3NpdGlvbl0gLCAxLjUgLFxuICAgICAgICB5OjE1XG4gICAgICAgIGltbWVkaWF0ZVJlbmRlcjp0cnVlXG4gICAgLFxuICAgICAgICB5OjIyXG4gICAgICAgIGVhc2U6Q3ViaWMuZWFzZUluT3V0XG5cblxuICAgIHJpbmdXaWRlUm90YXRpb24gPSBUd2Vlbk1heC5mcm9tVG8gW2NvbXBvbmVudHMucmluZ1dpZGUucm90YXRpb25dICwgMyAsXG4gICAgICAgIHk6MFxuICAgICxcbiAgICAgICAgeTpUSFJFRS5NYXRoLmRlZ1RvUmFkKDM2MClcbiAgICAgICAgcmVwZWF0Oi0xXG4gICAgICAgIGVhc2U6TGluZWFyLmVhc2VOb25lXG5cblxuXG4gICAgcmluZ1dpZGVSb3RhdGlvbi5wYXVzZWQodHJ1ZSlcblxuICAgIHRsID0gbmV3IFRpbWVsaW5lTWF4XG4gICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlOi0+XG4gICAgICAgICAgICByaW5nV2lkZVJvdGF0aW9uLnBhdXNlKDApXG5cblxuXG5cblxuICAgIHRsLmFkZCBbcmluZ1NjYWxlXVxuICAgIHRsLmFkZCBbcmluZzFUcmFuc2xhdGUscmluZzJUcmFuc2xhdGVdICwgMCAsIFwibm9ybWFsXCIgLCAtMC4yXG4gICAgdGwuYWRkQ2FsbGJhY2sgLT5cbiAgICAgICAgcmluZ1dpZGVSb3RhdGlvbi5wbGF5KClcbiAgICB0bC5hZGQgW3JpbmdXaWRlU2NhbGUscmluZ1dpZGVUcmFuc2xhdGVdICwgXCItPTEuMlwiXG4gICAgdGwucGF1c2VkKHRydWUpXG5cblxuXG4gICAgcmV0dXJuIHRsXG4iLCJnbG9iYWwgPSByZXF1aXJlICcuL2dsb2JhbC5jb2ZmZWUnXG5cbm1vZHVsZS5leHBvcnRzLmFwcGx5SW5pdGlhbFN0YXRlcyA9IChjb21wb25lbnRzKSAtPlxuXG4gICAgbW9kdWxlLmV4cG9ydHMuaG90c3BvdEFuaW1hdGlvbihjb21wb25lbnRzKS5wYXVzZSgpLmtpbGwoKVxuICAgIG1vZHVsZS5leHBvcnRzLnNlY29uZGFyeUhvdHNwb3RBbmltYXRpb24oY29tcG9uZW50cykucGF1c2UoKS5raWxsKClcbiAgICBtb2R1bGUuZXhwb3J0cy5zZWNvbmRhcnlDb250ZW50SG90c3BvdEFuaW1hdGlvbihjb21wb25lbnRzKS5wYXVzZSgpLmtpbGwoKVxuICAgIG1vZHVsZS5leHBvcnRzLmNvbnRlbnRIb3RzcG90QW5pbWF0aW9uKGNvbXBvbmVudHMpLnBhdXNlKCkua2lsbCgpXG4gICAgZ2xvYmFsLmNvbnRlbnRBbmltYXRpb24oY29tcG9uZW50cykucGF1c2UoKS5raWxsKClcblxubW9kdWxlLmV4cG9ydHMuZGVmaW5lVGltZWxpbmVDb21wb25lbnRzID0gKCR0LCAkcGF0aCwgJGNvbnRlbnQsICRjaHMpIC0+XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBob3RzcG90OlxuICAgICAgICAgICAgd2hpdGVTdHJva2U6ICR0LmZpbmQoXCJnLndoaXRlLXN0cm9rZSBjaXJjbGVcIilcbiAgICAgICAgICAgIHBsdXM6ICR0LmZpbmQoXCJnLm51bWJlciBnXCIpXG4gICAgICAgICAgICBvcmFuZ2VDaXJjbGU6ICR0LmZpbmQoXCJnLm9yYW5nZS1jaXJjbGUgY2lyY2xlXCIpXG4gICAgICAgICAgICBob3ZlclN0cm9rZTokdC5maW5kKCdnLmhvdmVyLXN0cm9rZSBjaXJjbGUnKVxuICAgICAgICBjb250ZW50SG90c3BvdDpcbiAgICAgICAgICAgIGdyYXlTdHJva2U6ICRjaHMuZmluZChcImcuZ3JheS1zdHJva2UgY2lyY2xlXCIpXG4gICAgICAgICAgICBwbHVzOiAkY2hzLmZpbmQoXCJnLnBsdXMtc2lnbiBnXCIpXG4gICAgICAgICAgICBncmF5Q2lyY2xlOiAkY2hzLmZpbmQoXCJnLmdyYXktY2lyY2xlIGNpcmNsZVwiKVxuICAgICAgICBwYXRoOiRwYXRoXG4gICAgICAgIGNvbnRlbnQ6JGNvbnRlbnRcbiAgICB9XG5cblxubW9kdWxlLmV4cG9ydHMuc2Vjb25kYXJ5SG90c3BvdEFuaW1hdGlvbiA9IChjb21wb25lbnRzKSAtPlxuXG5cbiAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuXG5cbiAgICBzdHJva2VzRHJhdyA9IFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8gW2NvbXBvbmVudHMuaG90c3BvdC53aGl0ZVN0cm9rZVsxXSAsIGNvbXBvbmVudHMuaG90c3BvdC53aGl0ZVN0cm9rZVsyXV0gLCAxLFxuICAgICAgICBkcmF3U1ZHOlwiMCVcIlxuICAgICAgICByb3RhdGlvbjpcIi0zNjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcbiAgICAgICAgb3BhY2l0eTowXG5cblxuICAgICxcbiAgICAgICAgZHJhd1NWRzpcIjEwMCVcIlxuICAgICAgICByb3RhdGlvbjpcIjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlSW5PdXRcbiAgICAgICAgb3BhY2l0eToxXG4gICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcblxuICAgICxcbiAgICAgICAgLjE1XG5cbiAgICBwbHVzID0gVHdlZW5NYXguZnJvbVRvIFtjb21wb25lbnRzLmhvdHNwb3QucGx1c1sxXSwgY29tcG9uZW50cy5ob3RzcG90LnBsdXNbMl1dICwgLjUgLFxuICAgICAgICByb3RhdGlvbjpcIjM2MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBvcGFjaXR5OjBcbiAgICAsXG4gICAgICAgIHJvdGF0aW9uOlwiMGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG4gICAgY2lyY2xlID0gVHdlZW5NYXguZnJvbVRvIFtjb21wb25lbnRzLmhvdHNwb3Qub3JhbmdlQ2lyY2xlWzFdLGNvbXBvbmVudHMuaG90c3BvdC5vcmFuZ2VDaXJjbGVbMl1dLCAuNSAsXG4gICAgICAgIGZpbGw6XCIjZmZmZmZmXCJcblxuICAgICAgICBzdHJva2VXaWR0aDowXG4gICAgICAgIG9wYWNpdHk6MFxuICAgICAgICBhdHRyOlxuICAgICAgICAgICAgcjoxMFxuICAgICxcbiAgICAgICAgZmlsbDpcIiNmZmZmZmZcIlxuICAgICAgICBzdHJva2VXaWR0aDowXG4gICAgICAgIG9wYWNpdHk6MVxuICAgICAgICBhdHRyOlxuICAgICAgICAgICAgcjo2XG4gICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcblxuICAgIGhvdmVyID0gVHdlZW5NYXguZnJvbVRvIFtjb21wb25lbnRzLmhvdHNwb3QuaG92ZXJTdHJva2VbMV0gLGNvbXBvbmVudHMuaG90c3BvdC5ob3ZlclN0cm9rZVsyXV0sIC41ICxcbiAgICAgICAgb3BhY2l0eTowXG4gICAgLFxuICAgICAgICBvcGFjaXR5OjBcblxuXG5cbiAgICB0bC5hZGQgW3BsdXMsY2lyY2xlLCBzdHJva2VzRHJhdyxob3Zlcl1cbiAgICByZXR1cm4gdGxcblxuXG5tb2R1bGUuZXhwb3J0cy5ob3RzcG90QW5pbWF0aW9uID0gKGNvbXBvbmVudHMpIC0+XG4gICAgI0NpcmNsZSBIb3RzcG90XG5cbiAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuXG5cbiAgICBzdHJva2VzRHJhdyA9IFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8gW2NvbXBvbmVudHMuaG90c3BvdC53aGl0ZVN0cm9rZVswXV0gLCAxLFxuICAgICAgICBkcmF3U1ZHOlwiMCVcIlxuICAgICAgICByb3RhdGlvbjpcIi0zNjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcblxuICAgICxcbiAgICAgICAgZHJhd1NWRzpcIjEwMCVcIlxuICAgICAgICByb3RhdGlvbjpcIjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlSW5PdXRcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG4gICAgLFxuICAgICAgICAuMTVcblxuICAgIHBsdXMgPSBUd2Vlbk1heC5mcm9tVG8gY29tcG9uZW50cy5ob3RzcG90LnBsdXNbMF0gLCAuNSAsXG4gICAgICAgIHJvdGF0aW9uOlwiMzYwZGVnXCJcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwiXG4gICAgICAgIG9wYWNpdHk6MVxuICAgICxcbiAgICAgICAgcm90YXRpb246XCIwZGVnXCJcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwiXG4gICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcbiAgICAgICAgb3BhY2l0eTowXG5cblxuICAgIGNpcmNsZSA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmhvdHNwb3Qub3JhbmdlQ2lyY2xlWzBdLCAuNSAsXG4gICAgICAgIGZpbGw6XCIjRkY2QzAwXCJcbiAgICAgICAgc3Ryb2tlV2lkdGg6NlxuICAgICAgICBzdHJva2U6XCIjRjRDRTIxXCJcbiAgICAgICAgYXR0cjpcbiAgICAgICAgICAgIHI6MTJcblxuICAgICxcbiAgICAgICAgZmlsbDpcIiNmZmZmZmZcIlxuICAgICAgICBzdHJva2VXaWR0aDowXG4gICAgICAgIGF0dHI6XG4gICAgICAgICAgICByOjZcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG5cbiAgICBob3ZlciA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmhvdHNwb3QuaG92ZXJTdHJva2VbMF0gLCAuNSAsXG4gICAgICAgIG9wYWNpdHk6MFxuICAgICxcbiAgICAgICAgb3BhY2l0eTowXG5cblxuXG4gICAgdGwuYWRkIFtwbHVzLGNpcmNsZSxzdHJva2VzRHJhdyxob3Zlcl1cbiAgICByZXR1cm4gdGxcblxuXG5tb2R1bGUuZXhwb3J0cy5zZWNvbmRhcnlDb250ZW50SG90c3BvdEFuaW1hdGlvbiA9IChjb21wb25lbnRzKSAtPlxuICAgIHRsID0gbmV3IFRpbWVsaW5lTWF4XG5cblxuXG4gICAgY2hzU3Ryb2tlcyA9IFR3ZWVuTWF4LmZyb21UbyBbY29tcG9uZW50cy5jb250ZW50SG90c3BvdC5ncmF5U3Ryb2tlWzFdLGNvbXBvbmVudHMuY29udGVudEhvdHNwb3QuZ3JheVN0cm9rZVsyXV0gLCAuNSxcbiAgICAgICAgZHJhd1NWRzpcIjAlXCJcbiAgICAgICAgaW1tZWRpYXRlUmVuZGVyOnRydWVcblxuICAgICxcbiAgICAgICAgZHJhd1NWRzpcIjAlXCJcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlSW5PdXRcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG5cbiAgICBjaHNQbHVzID0gVHdlZW5NYXguZnJvbVRvIFtjb21wb25lbnRzLmNvbnRlbnRIb3RzcG90LnBsdXNbMV0sY29tcG9uZW50cy5jb250ZW50SG90c3BvdC5wbHVzWzJdXSAsIC41ICxcbiAgICAgICAgcm90YXRpb246XCIwZGVnXCJcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwiXG4gICAgICAgIG9wYWNpdHk6MFxuXG4gICAgLFxuICAgICAgICByb3RhdGlvbjpcIjE4MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG5cblxuXG5cbiAgICBjaHNDaXJjbGUgPSBUd2Vlbk1heC5mcm9tVG8gW2NvbXBvbmVudHMuY29udGVudEhvdHNwb3QuZ3JheUNpcmNsZVsxXSwgY29tcG9uZW50cy5jb250ZW50SG90c3BvdC5ncmF5Q2lyY2xlWzJdXSAsIC41ICxcbiAgICAgICAgc3Ryb2tlV2lkdGg6MFxuICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgZmlsbDpcIiNmZmZmZmZcIlxuICAgICAgICBhdHRyOlxuICAgICAgICAgICAgcjoxXG4gICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcbiAgICAsXG4gICAgICAgIG9wYWNpdHk6MVxuICAgICAgICBzdHJva2VXaWR0aDowXG4gICAgICAgIGZpbGw6XCIjZmZmZmZmXCJcbiAgICAgICAgYXR0cjpcbiAgICAgICAgICAgIHI6NlxuICAgICAgICBlYXNlOkJhY2suZWFzZU91dFxuICAgICAgICBvdmVyd3JpdGU6XCJwcmVleGlzdGluZ1wiXG5cbiAgICB0bC5hZGQgW2Noc1N0cm9rZXMsY2hzUGx1cyxjaHNDaXJjbGVdXG5cbiAgICByZXR1cm4gdGxcblxubW9kdWxlLmV4cG9ydHMuY29udGVudEhvdHNwb3RBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cbiAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuXG5cblxuICAgIGNoc1N0cm9rZXMgPSBUd2Vlbk1heC5mcm9tVG8gW2NvbXBvbmVudHMuY29udGVudEhvdHNwb3QuZ3JheVN0cm9rZVswXV0gLCAuNSxcbiAgICAgICAgZHJhd1NWRzpcIjAlIDI1JVwiXG4gICAgICAgIHJvdGF0aW9uOlwiLTM2MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBpbW1lZGlhdGVSZW5kZXI6dHJ1ZVxuXG4gICAgLFxuICAgICAgICBkcmF3U1ZHOlwiMCVcIlxuICAgICAgICByb3RhdGlvbjpcIjBkZWdcIlxuICAgICAgICB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlSW5PdXRcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG5cbiAgICBjaHNQbHVzID0gVHdlZW5NYXguZnJvbVRvIGNvbXBvbmVudHMuY29udGVudEhvdHNwb3QucGx1c1swXSAsIC41ICxcbiAgICAgICAgcm90YXRpb246XCIwZGVnXCJcbiAgICAgICAgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwiXG4gICAgICAgIG9wYWNpdHk6MVxuXG4gICAgLFxuICAgICAgICByb3RhdGlvbjpcIjE4MGRlZ1wiXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjpcIjUwJSA1MCVcIlxuICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG5cblxuXG5cbiAgICBjaHNDaXJjbGUgPSBUd2Vlbk1heC5mcm9tVG8gY29tcG9uZW50cy5jb250ZW50SG90c3BvdC5ncmF5Q2lyY2xlWzBdICwgLjUgLFxuICAgICAgICBzdHJva2VXaWR0aDo0XG4gICAgICAgIGZpbGw6XCJ0cmFuc3BhcmVudFwiXG4gICAgICAgIGF0dHI6XG4gICAgICAgICAgICByOjEwXG4gICAgLFxuXG4gICAgICAgIHN0cm9rZVdpZHRoOjBcbiAgICAgICAgZmlsbDpcIiNmZmZmZmZcIlxuICAgICAgICBhdHRyOlxuICAgICAgICAgICAgcjo2XG4gICAgICAgIGVhc2U6QmFjay5lYXNlSW5PdXRcbiAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG4gICAgdGwuYWRkIFtjaHNTdHJva2VzLGNoc1BsdXMsY2hzQ2lyY2xlXVxuXG4gICAgcmV0dXJuIHRsXG5cblxuXG5nZW9TZXQgPSBmYWxzZVxuXG5yZXNldEdlb21ldHJ5ID0gKGNvbXBvbmVudHMpIC0+XG4gICAgZ2VvU2V0ID0gdHJ1ZVxuICAgIG1vZCA9IDBcbiAgICBmb3IgZGlzYyxpIGluIGNvbXBvbmVudHMuZGlzY3NcbiAgICAgICAgZGlzYy5nZW9tZXRyeS5jZW50ZXIoKVxuICAgICAgICBkaXNjLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcbiAgICAgICAgZGlzYy5wb3NpdGlvbi55ID0gMTcuNVxuICAgICAgICBkaXNjLnBvc2l0aW9uLnogPSAtMS0oLS4yNSAqIG1vZClcblxuICAgICAgICBsaW5lID0gY29tcG9uZW50cy5kaXNjTGluZXNbaV1cbiAgICAgICAgbGluZS5nZW9tZXRyeS5jZW50ZXIoKVxuICAgICAgICBsaW5lLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcbiAgICAgICAgbGluZS5wb3NpdGlvbi55ID0gMTcuNVxuICAgICAgICBsaW5lLnBvc2l0aW9uLnogPSAtMS0oLS4yNSAqIG1vZClcblxuXG4gICAgICAgIG1vZCsrXG5cbiAgICBiYWxsID0gY29tcG9uZW50cy5iYWxsXG4gICAgYmFsbC5nZW9tZXRyeS5jZW50ZXIoKVxuICAgIGJhbGwuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuICAgIGJhbGwucG9zaXRpb24ueSA9IDE3LjVcbiAgICBiYWxsLnBvc2l0aW9uLnogPSAtMTFcbiAgICBiYWxsLm1hdGVyaWFsLm9wYWNpdHkgPSAwXG5cblxuXG4gICAgZ2xvYmFsLnRvZ2dsZVZpc2liaWxpdHkoY29tcG9uZW50cyAsIGZhbHNlKVxuXG5cblxubW9kdWxlLmV4cG9ydHMuZ2V0QW5pbWF0aW9uID0gKGNvbXBvbmVudHMpIC0+XG5cbiAgICBpZiAhZ2VvU2V0XG4gICAgICAgIHJlc2V0R2VvbWV0cnkoY29tcG9uZW50cylcblxuICAgIGRpc2NTY2FsZSA9IFtdXG4gICAgZGlzY0FscGhhID0gW11cbiAgICBsaW5lQWxwaGEgPSBbXVxuICAgIGxpbmVTY2FsZSA9IFtdXG5cbiAgICBzY2FsZXMgPSBbLjIsLjYsMV1cblxuXG5cbiAgICBkcm9wVGwgPSBuZXcgVGltZWxpbmVNYXhcbiAgICBiYWxsID0gY29tcG9uZW50cy5iYWxsXG5cblxuXG5cblxuICAgICMjI2JhbGxEcm9wSW4gPSBUd2Vlbk1heC5mcm9tVG8gW2JhbGwucG9zaXRpb24gLCBiYWxsLm1hdGVyaWFsXSAgLCAxICxcbiAgICAgICAgejotMjVcbiAgICAgICAgb3BhY2l0eTowXG4gICAgICAgIGltbWVkaWF0ZVJlbmRlcjp0cnVlXG4gICAgLFxuICAgICAgICB6Oi00LjlcbiAgICAgICAgb3BhY2l0eTowXG4gICAgICAgIGVhc2U6RXhwby5lYXNlSW5cblxuXG4gICAgYmFsbEZsb2F0VXAgPSBUd2Vlbk1heC5mcm9tVG8gW2JhbGwucG9zaXRpb24sIGJhbGwubWF0ZXJpYWxdICwgMS41ICxcbiAgICAgICAgejotNC45XG4gICAgICAgIG9wYWNpdHk6MVxuICAgICxcbiAgICAgICAgejotMjVcbiAgICAgICAgb3BhY2l0eTowXG4gICAgICAgIGVhc2U6RXhwby5lYXNlT3V0XG5cblxuXG4gICAgZHJvcFRsLmFkZCBiYWxsRHJvcEluXG4gICAgZHJvcFRsLmFkZCBiYWxsRmxvYXRVcFxuXG5cblxuICAgIGJhbGxTcGluID0gVHdlZW5NYXguZnJvbVRvIGJhbGwucm90YXRpb24gLCAyICxcbiAgICAgICAgeDowXG4gICAgLFxuICAgICAgICB4OlRIUkVFLk1hdGguZGVnVG9SYWQoLTM2MClcblxuICAgICAgICByZXBlYXQ6LTFcbiAgICAgICAgZWFzZTpMaW5lYXIuZWFzZU5vbmVcblxuICAgIGJhbGxTcGluLnBhdXNlZCh0cnVlKSMjI1xuXG5cblxuICAgIGZvciBkaXNjLGkgaW4gY29tcG9uZW50cy5kaXNjc1xuICAgICAgICBsaW5lID0gY29tcG9uZW50cy5kaXNjTGluZXNbaV1cbiAgICAgICAgcGVyY2VudCA9IChpLzMpXG5cblxuICAgICAgICBkaXNjQWxwaGFbaV0gPSBUd2Vlbk1heC5mcm9tVG8gW2Rpc2MubWF0ZXJpYWxdICwgLjUgLFxuICAgICAgICAgICAgb3BhY2l0eTowXG4gICAgICAgICxcbiAgICAgICAgICAgIG9wYWNpdHk6IC42ICogKDEtcGVyY2VudClcbiAgICAgICAgICAgIGRlbGF5OmkgKiAuMlxuICAgICAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG4gICAgICAgIGxpbmVBbHBoYVtpXSA9IFR3ZWVuTWF4LmZyb21UbyBbbGluZS5tYXRlcmlhbF0gLCAuNSAsXG4gICAgICAgICAgICBvcGFjaXR5OjBcbiAgICAgICAgLFxuICAgICAgICAgICAgb3BhY2l0eTouOCogKDEtcGVyY2VudClcbiAgICAgICAgICAgIGRlbGF5OmkgKiAuMlxuICAgICAgICAgICAgb3ZlcndyaXRlOlwicHJlZXhpc3RpbmdcIlxuXG5cblxuXG4gICAgICAgIGRpc2NTY2FsZVtpXSA9IFR3ZWVuTWF4LmZyb21UbyBbZGlzYy5zY2FsZV0gLCAuNSAsXG4gICAgICAgICAgICB4OjAuMVxuICAgICAgICAgICAgeTowLjFcbiAgICAgICAgLFxuICAgICAgICAgICAgeDpzY2FsZXNbaV1cbiAgICAgICAgICAgIHk6c2NhbGVzW2ldXG4gICAgICAgICAgICBkZWxheTppICogLjJcbiAgICAgICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcblxuXG4gICAgICAgIGxpbmVTY2FsZVtpXSA9IFR3ZWVuTWF4LmZyb21UbyBbbGluZS5zY2FsZV0gLCAuNSAsXG4gICAgICAgICAgICB4Oi4xXG4gICAgICAgICAgICB5Oi4xXG4gICAgICAgICxcbiAgICAgICAgICAgIHg6c2NhbGVzW2ldIC0gLjAyNVxuICAgICAgICAgICAgeTpzY2FsZXNbaV0gLSAuMDI1XG4gICAgICAgICAgICBkZWxheTppICogLjJcbiAgICAgICAgICAgIG92ZXJ3cml0ZTpcInByZWV4aXN0aW5nXCJcblxuXG5cblxuXG5cbiAgICB0bCA9IG5ldyBUaW1lbGluZU1heFxuICAgICAgICBvblJldmVyc2VDb21wbGV0ZTogLT5cbiAgICAgICAgICAgIGdsb2JhbC50b2dnbGVWaXNpYmlsaXR5KGNvbXBvbmVudHMsIGZhbHNlKVxuICAgICAgICAgICAgI2JhbGxTcGluLnBhdXNlKDApXG5cblxuICAgICAgICBvblN0YXJ0OiAtPlxuICAgICAgICAgICAgZ2xvYmFsLnRvZ2dsZVZpc2liaWxpdHkoY29tcG9uZW50cywgdHJ1ZSlcbiAgICAgICAgICAgICNiYWxsU3Bpbi5wbGF5KClcblxuXG5cblxuICAgICN0bC5hZGQgWyBkcm9wVGxdXG4gICAgdGwuYWRkIFtkaXNjU2NhbGUsIGRpc2NBbHBoYSwgbGluZUFscGhhLGxpbmVTY2FsZV1cblxuICAgIHRsLnBhdXNlZCh0cnVlKVxuXG5cbiAgICByZXR1cm4gdGxcblxuXG4iLCJnbG9iYWwgPSByZXF1aXJlICcuL2dsb2JhbC5jb2ZmZWUnXG5cblxuXG5nZW9TZXQgPSBmYWxzZVxuXG5yZXNldEdlb21ldHJ5ID0gKGNvbXBvbmVudHMpIC0+XG4gICAgZ2VvU2V0ID0gdHJ1ZVxuXG5cbiAgICBjb21wb25lbnRzLmhlbGl4Lmdlb21ldHJ5LmNlbnRlcigpXG4gICAgY29tcG9uZW50cy5oZWxpeC5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlXG4gICAgY29tcG9uZW50cy5oZWxpeC5wb3NpdGlvbi5zZXQoLjUsMTcuOSwxMClcblxuICAgIGNvbXBvbmVudHMuc3RhbGsuZ2VvbWV0cnkuY2VudGVyKClcbiAgICBjb21wb25lbnRzLnN0YWxrLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcbiAgICBjb21wb25lbnRzLnN0YWxrLnBvc2l0aW9uLnNldCguNSwxNy45LDEwKVxuXG5cblxuICAgIGdsb2JhbC50b2dnbGVWaXNpYmlsaXR5KGNvbXBvbmVudHMsZmFsc2UpXG5cblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cy5nZXRBbmltYXRpb24gPSAoY29tcG9uZW50cykgLT5cblxuICAgIGlmICFnZW9TZXRcbiAgICAgICAgcmVzZXRHZW9tZXRyeShjb21wb25lbnRzKVxuXG4gICAgcmV0dXJuIG5ldyBUaW1lbGluZU1heCgpXG5cbiAgICBzdGFsa01hdCA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLnN0YWxrLm1hdGVyaWFsICwgLjUgLFxuICAgICAgICBvcGFjaXR5OjBcbiAgICAsXG4gICAgICAgIG9wYWNpdHk6MVxuXG4gICAgc3RhbGtQb3MgPSBUd2Vlbk1heC5mcm9tVG8gY29tcG9uZW50cy5zdGFsay5wb3NpdGlvbiAsIDEsXG4gICAgICAgIHo6NVxuICAgICxcbiAgICAgICAgejoxMFxuICAgICAgICBlYXNlOkN1YmljLmVhc2VPdXRcblxuICAgIGhlbGl4UG9zID0gVHdlZW5NYXguZnJvbVRvIGNvbXBvbmVudHMuaGVsaXgucG9zaXRpb24gLDEgLFxuICAgICAgICB6OjVcbiAgICAsXG4gICAgICAgIHo6MTBcbiAgICAgICAgZWFzZTpDdWJpYy5lYXNlT3V0XG5cbiAgICBoZWxpeE1hdCA9IFR3ZWVuTWF4LmZyb21UbyBjb21wb25lbnRzLmhlbGl4Lm1hdGVyaWFsICwgLjUgLFxuICAgICAgICBvcGFjaXR5OjBcbiAgICAsXG4gICAgICAgIG9wYWNpdHk6MVxuXG4gICAgaGVsaXhSb3RhdGlvbiA9IFR3ZWVuTWF4LmZyb21UbyBbY29tcG9uZW50cy5oZWxpeC5yb3RhdGlvbl0gLCAyICxcbiAgICAgICAgejowXG4gICAgLFxuICAgICAgICB6OlRIUkVFLk1hdGguZGVnVG9SYWQoMzYwKVxuICAgICAgICByZXBlYXQ6LTFcbiAgICAgICAgZWFzZTpMaW5lYXIuZWFzZU5vbmVcblxuICAgIGhlbGl4Um90YXRpb24ucGF1c2VkKHRydWUpXG5cblxuXG4gICAgdGwgPSBuZXcgVGltZWxpbmVNYXhcbiAgICAgICAgb25SZXZlcnNlQ29tcGxldGU6IC0+XG4gICAgICAgICAgICBnbG9iYWwudG9nZ2xlVmlzaWJpbGl0eShjb21wb25lbnRzLCBmYWxzZSlcbiAgICAgICAgICAgIGhlbGl4Um90YXRpb24ucGF1c2UoKVxuXG4gICAgICAgIG9uU3RhcnQ6IC0+XG4gICAgICAgICAgICBnbG9iYWwudG9nZ2xlVmlzaWJpbGl0eShjb21wb25lbnRzLCB0cnVlKVxuICAgICAgICAgICAgaGVsaXhSb3RhdGlvbi5wbGF5KClcblxuXG5cblxuXG5cbiAgICB0bC5hZGQgW3N0YWxrTWF0LCBzdGFsa1Bvc11cbiAgICB0bC5hZGQgW2hlbGl4TWF0LCBoZWxpeFBvc10sIFwiLT0uNVwiXG5cblxuICAgIHRsLnBhdXNlZCh0cnVlKVxuXG5cbiAgICByZXR1cm4gdGxcblxuXG5cblxuIiwiY2xhc3MgUm90YXRpb25Db250cm9scyBleHRlbmRzIEJhY2tib25lLkV2ZW50c1xuXG4gICAgY29uc3RydWN0b3I6IChlbCkgLT5cblxuICAgICAgICBfLmV4dGVuZChALCBCYWNrYm9uZS5FdmVudHMpXG5cbiAgICAgICAgQGVsID0gZWxcbiAgICAgICAgQGFkZEV2ZW50cygpXG5cbiAgICBhZGRFdmVudHM6LT5cblxuXG4gICAgICAgIHRvdWNoT3B0cyA9XG4gICAgICAgICAgICB0aHJlc2hvbGQ6MTAwXG4gICAgICAgICAgICBwb2ludGVyczoyXG5cblxuICAgICAgICBAY29udHJvbFBsYW5lID0gbmV3IEhhbW1lciBAZWwgLCB0b3VjaE9wdHNcblxuXG4gICAgICAgIEBjb250cm9sUGxhbmUub24gJ3BhbiBwYW5zdGFydCBwYW5sZWZ0IHBhbnJpZ2h0IHBhbnVwIHBhbmRvd24gcGFuZW5kJyAsIEBoYW5kbGVQYW5cblxuXG4gICAgaGFuZGxlUGFuOiAoZSkgPT5cbiAgICAgICAgZS5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgZGF0YSA9XG4gICAgICAgICAgICB2ZWxYOiBlLnZlbG9jaXR5WFxuICAgICAgICAgICAgdmVsWTogZS52ZWxvY2l0eVlcbiAgICAgICAgICAgIHR5cGU6IGUudHlwZVxuXG4gICAgICAgIEB0cmlnZ2VyKFwicGFuXCIsIGRhdGEpXG5cblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUm90YXRpb25Db250cm9sc1xuIiwiVmlld0Jhc2UgPSByZXF1aXJlICcuLi8uLi9hYnN0cmFjdC9WaWV3QmFzZS5jb2ZmZWUnXG5VdGlscyA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL2NvbW1vbi5jb2ZmZWUnXG5UcmFja2luZyA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL3RyYWNrLmNvZmZlZSdcbkFuaW1hdGlvbnMgPSByZXF1aXJlICcuLy4uL2ltcG9ydHMvYW5pbWF0aW9ucy5jb2ZmZWUnXG5UZW1wbGF0ZXMgPSByZXF1aXJlICcuLi9pbXBvcnRzL3RlbXBsYXRlcy5jb2ZmZWUnXG5BcHBNb2RlbCA9IHJlcXVpcmUgJy4uLy4uLy4uL21vZGVscy9BcHBNb2RlbC5jb2ZmZWUnXG5cbmNsYXNzIEhvdHNwb3RWaWV3IGV4dGVuZHMgVmlld0Jhc2VcblxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG4gICAgICAgIEBoc1RlbXBsYXRlID0gcmVxdWlyZSAnLi4vLi4vLi4vLi4vLi4vdGVtcGxhdGVzL3NwZWNzL2hvdHNwb3RzL2hvdHNwb3Quc3ZnLmphZGUnXG4gICAgICAgIEBjaHNUZW1wbGF0ZSA9IHJlcXVpcmUgJy4uLy4uLy4uLy4uLy4uL3RlbXBsYXRlcy9zcGVjcy9ob3RzcG90cy9jb250ZW50LmhvdHNwb3Quc3ZnLmphZGUnXG4gICAgICAgIEBob3RzcG90RGF0YSA9IHt9XG4gICAgICAgIHN1cGVyKG9wdHMpXG5cbiAgICBpbml0aWFsaXplOiAob3B0cykgLT5cbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBAYXBwTW9kZWwgPSBBcHBNb2RlbC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIEBob3RzcG90Q29udGFpbmVyT3ZlciA9IEAkZWwuZmluZChcIi5zdmctY29udGFpbmVyLW92ZXIgc3ZnXCIpXG4gICAgICAgIEBob3RzcG90Q29udGFpbmVyVW5kZXIgPSBAJGVsLmZpbmQoXCIuc3ZnLWNvbnRhaW5lci11bmRlciBzdmdcIilcbiAgICAgICAgQGNvbnRlbnRDb250YWluZXIgPSBAJGVsLmZpbmQoXCIuaG90c3BvdC1jb250ZW50LWNvbnRhaW5lclwiKVxuICAgICAgICBAaGVhZGVyT2Zmc2V0ID0gJChcIiNzcGVjcy1jb250ZW50XCIpLmhlaWdodCgpXG5cblxuICAgICAgICBAZGVsZWdhdGVFdmVudHMgQGdlbmVyYXRlRXZlbnRzKClcblxuXG5cblxuXG4gICAgaG90c3BvdFJlc2V0OiAoKSAtPlxuICAgICAgICAjTm8gSWQ/IHJlc2V0IGN1cnJlbnRzcG90IHRvIG51bGxcbiAgICAgICAgaWYgQGN1cnJlbnRIb3RzcG90P1xuICAgICAgICAgICAgZGF0YSA9IEBob3RzcG90RGF0YVtAY3VycmVudEhvdHNwb3RdXG5cbiAgICAgICAgICAgIHRsID0gbmV3IFRpbWVsaW5lTWF4XG4gICAgICAgICAgICAgICAgb3ZlcndyaXRlOidwcmVleGlzdGluZydcbiAgICAgICAgICAgIHR3ZWVucyA9IFtdXG4gICAgICAgICAgICBzd2l0Y2ggQGN1cnJlbnRIb3RzcG90XG4gICAgICAgICAgICAgICAgd2hlbiBcInBhcmFsbGVsLWRyaWxsaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgQW5pbWF0aW9uc1snZGVmYXVsdCddLnBhdGhBbmltYXRpb24oZGF0YS5jb21wb25lbnRzICwwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLEFuaW1hdGlvbnNbJ2RlZmF1bHQnXS5wYXRoQW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cyAsMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICxBbmltYXRpb25zWydkZWZhdWx0J10ucGF0aEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMgLDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAsQW5pbWF0aW9uc1tAY3VycmVudEhvdHNwb3RdLmNvbnRlbnRIb3RzcG90QW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICxBbmltYXRpb25zW0BjdXJyZW50SG90c3BvdF0uc2Vjb25kYXJ5Q29udGVudEhvdHNwb3RBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLEFuaW1hdGlvbnNbJ2RlZmF1bHQnXS5jb250ZW50QW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICxBbmltYXRpb25zW0BjdXJyZW50SG90c3BvdF0uc2Vjb25kYXJ5SG90c3BvdEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAsQW5pbWF0aW9uc1tAY3VycmVudEhvdHNwb3RdLmhvdHNwb3RBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0d2VlbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBBbmltYXRpb25zWydkZWZhdWx0J10ucGF0aEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMsIDApXG4gICAgICAgICAgICAgICAgICAgICAgICAsQW5pbWF0aW9uc1snZGVmYXVsdCddLmNvbnRlbnRIb3RzcG90QW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICxBbmltYXRpb25zWydkZWZhdWx0J10uY29udGVudEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAsQW5pbWF0aW9uc1snZGVmYXVsdCddLmhvdHNwb3RBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICBdXG5cbiAgICAgICAgICAgIHRsLmFkZCB0d2VlbnNcbiAgICAgICAgICAgIHRsLnRpbWVTY2FsZSgzKVxuICAgICAgICAgICAgdGwucHJvZ3Jlc3MoMSlcbiAgICAgICAgICAgIHRsLnJldmVyc2UoKVxuICAgICAgICAgICAgQGN1cnJlbnRIb3RzcG90ID0gbnVsbFxuXG5cbiAgICBvblJhY2tldFRyYW5zaXRpb25Db21wbGV0ZTogKCkgPT5cbiAgICAgICAgaWQgPSBAY3VycmVudEhvdHNwb3RcbiAgICAgICAgZGF0YSA9IEBob3RzcG90RGF0YVtpZF1cbiAgICAgICAgc3dpdGNoIEBjdXJyZW50SG90c3BvdFxuICAgICAgICAgICAgd2hlbiBcInBhcmFsbGVsLWRyaWxsaW5nXCJcbiAgICAgICAgICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgICAgICAgICAgdGwgPSBuZXcgVGltZWxpbmVNYXhcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZTo9PlxuICAgICAgICAgICAgICAgICAgICAgICAgQGRlbGVnYXRlRXZlbnRzIEBnZW5lcmF0ZUV2ZW50cygpXG4gICAgICAgICAgICAgICAgdGwuYWRkIFtBbmltYXRpb25zW2lkXS5zZWNvbmRhcnlIb3RzcG90QW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cyldXG4gICAgICAgICAgICAgICAgdGwuYWRkIFtBbmltYXRpb25zWydkZWZhdWx0J10ucGF0aEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMsIDEpLEFuaW1hdGlvbnNbJ2RlZmF1bHQnXS5wYXRoQW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cywgMildICwgXCItPS41XCJcbiAgICAgICAgICAgICAgICB0bC5hZGQgIFtBbmltYXRpb25zW2lkXS5zZWNvbmRhcnlDb250ZW50SG90c3BvdEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMpXSAsIFwiLT0uNVwiXG4gICAgICAgICAgICAgICAgdGwucGxheSgpXG5cblxuXG4gICAgaGFuZGxlSG90c3BvdDogKGUpID0+XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoXCJnLmhvdHNwb3RcIilcbiAgICAgICAgaWYgJHRhcmdldC5sZW5ndGggPCAxXG4gICAgICAgICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuY2xvc2VzdChcImNpcmNsZS5jbGlja2FibGVcIilcblxuICAgICAgICBpZCA9ICR0YXJnZXQuZGF0YSgnaWQnKVxuXG4gICAgICAgICRocyA9ICQoXCIuaG90c3BvdFtkYXRhLWlkPScje2lkfSddXCIpLmZpcnN0KClcbiAgICAgICAgJGNocyA9ICQoXCIuY29udGVudC1ob3RzcG90W2RhdGEtaWQ9JyN7aWR9J11cIikuZmlyc3QoKVxuXG4gICAgICAgIHN3aXRjaCBlLnR5cGVcbiAgICAgICAgICAgIHdoZW4gXCJtb3VzZWVudGVyXCJcbiAgICAgICAgICAgICAgICBAaG90c3BvdE92ZXIgJGhzICwgJGNoc1xuICAgICAgICAgICAgd2hlbiBcIm1vdXNlbGVhdmVcIlxuICAgICAgICAgICAgICAgIEBob3RzcG90T3V0ICRocyAsICRjaHNcbiAgICAgICAgICAgIHdoZW4gXCJjbGlja1wiICwgXCJ0b3VjaGVuZFwiXG4gICAgICAgICAgICAgICAgQGhvdHNwb3RPdXQgJGhzICwgJGNoc1xuICAgICAgICAgICAgICAgIEBob3RzcG90QWN0aXZhdGUgJHRhcmdldFxuXG5cblxuXG4gICAgaG90c3BvdEFjdGl2YXRlOiAoaHMpLT5cblxuICAgICAgICBAdW5kZWxlZ2F0ZUV2ZW50cygpXG4gICAgICAgIEBob3RzcG90UmVzZXQoKVxuICAgICAgICBAY3VycmVudEhvdHNwb3QgPSBpZCA9IEBwYXJzZUVsZW1lbnRJZChocylcblxuXG4gICAgICAgIGRhdGEgPSBAaG90c3BvdERhdGFbaWRdXG4gICAgICAgIHRsID0gbmV3IFRpbWVsaW5lTWF4XG4gICAgICAgICAgICBvbkNvbXBsZXRlOiA9PlxuICAgICAgICAgICAgICAgIEBkZWxlZ2F0ZUV2ZW50cyBAZ2VuZXJhdGVFdmVudHMoKVxuXG4gICAgICAgIHN3aXRjaCBpZFxuICAgICAgICAgICAgd2hlbiBcInBhcmFsbGVsLWRyaWxsaW5nXCJcbiAgICAgICAgICAgICAgICB0bC5hZGQgW0FuaW1hdGlvbnNbaWRdLmhvdHNwb3RBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKV1cbiAgICAgICAgICAgICAgICB0bC5hZGQgW0FuaW1hdGlvbnNbJ2RlZmF1bHQnXS5wYXRoQW5pbWF0aW9uKGRhdGEuY29tcG9uZW50cywgMCldXG4gICAgICAgICAgICAgICAgdGwuYWRkIFtcbiAgICAgICAgICAgICAgICAgICAgQW5pbWF0aW9uc1tpZF0uY29udGVudEhvdHNwb3RBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICAsQW5pbWF0aW9uc1snZGVmYXVsdCddLmNvbnRlbnRBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgIF0gLCBcIi09LjVcIiwgXCJub3JtYWxcIiwgIC4zXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGwuYWRkIFtBbmltYXRpb25zWydkZWZhdWx0J10uaG90c3BvdEFuaW1hdGlvbihkYXRhLmNvbXBvbmVudHMpXVxuICAgICAgICAgICAgICAgIHRsLmFkZCBbQW5pbWF0aW9uc1snZGVmYXVsdCddLnBhdGhBbmltYXRpb24oZGF0YS5jb21wb25lbnRzLCAwKV1cbiAgICAgICAgICAgICAgICB0bC5hZGQgW1xuICAgICAgICAgICAgICAgICAgICBBbmltYXRpb25zWydkZWZhdWx0J10uY29udGVudEhvdHNwb3RBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICAsQW5pbWF0aW9uc1snZGVmYXVsdCddLmNvbnRlbnRBbmltYXRpb24oZGF0YS5jb21wb25lbnRzKVxuICAgICAgICAgICAgICAgIF0gLCBcIi09MFwiLCBcIm5vcm1hbFwiLCAgLjNcblxuXG4gICAgICAgIHRsLnBsYXkoKVxuICAgICAgICBAc2Nyb2xsVG9Db250ZW50KGlkKVxuXG5cbiAgICAgICAgVHJhY2tpbmcuZ2FUcmFjayggZGF0YS50cmFja2luZ1snZ2EtdHlwZSddICwgZGF0YS50cmFja2luZ1snZ2EtdGFnJ10gKVxuICAgICAgICBAdHJpZ2dlciBcImhvdHNwb3RDbGlja2VkXCIgLCBAaG90c3BvdERhdGFbaWRdLnRyYW5zZm9ybVxuXG4gICAgc2Nyb2xsVG9Db250ZW50OiAoaWQpIC0+XG5cbiAgICAgICAgY29udGVudCA9ICQoXCIuaG90c3BvdC1jb250ZW50W2RhdGEtaWQ9JyN7aWR9J11cIilcbiAgICAgICAgY29udGVudE9mZnNldCA9IGNvbnRlbnQub2Zmc2V0KCkudG9wXG4gICAgICAgIHdpbmRvd09mZnNldCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLSBjb250ZW50LmhlaWdodCgpIC0gNzUpXG4gICAgICAgIHNjcm9sbFRvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpXG4gICAgICAgIGRvY3VtZW50U2Nyb2xsVG9wID0gc2Nyb2xsVG9wICsgd2luZG93LmlubmVySGVpZ2h0XG5cblxuXG4gICAgICAgIGlmIGRvY3VtZW50U2Nyb2xsVG9wIC0gY29udGVudE9mZnNldCA8IDE3NVxuXG4gICAgICAgICAgICBUd2Vlbk1heC50byB3aW5kb3cgLCAxICxcbiAgICAgICAgICAgICAgICBzY3JvbGxUbzpcbiAgICAgICAgICAgICAgICAgICAgeTpjb250ZW50T2Zmc2V0IC0gd2luZG93T2Zmc2V0XG4gICAgICAgICAgICAgICAgZGVsYXk6Ljc1XG4gICAgICAgICAgICAgICAgZWFzZTpDdWJpYy5lYXNlSW5PdXRcbiAgICAgICAgZWxzZSBpZiBjb250ZW50T2Zmc2V0IDwgKHNjcm9sbFRvcCArIDE4MClcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvIHdpbmRvdyAsIDEgLFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvOlxuICAgICAgICAgICAgICAgICAgICB5OmNvbnRlbnRPZmZzZXQgLSAxNzVcbiAgICAgICAgICAgICAgICBkZWxheTouNzVcbiAgICAgICAgICAgICAgICBlYXNlOkN1YmljLmVhc2VJbk91dFxuXG5cblxuICAgIGhvdHNwb3RPdmVyOiAoaHMgLCBjaHMpIC0+XG5cblxuXG4gICAgICAgIG9yYW5nZVN0cm9rZSA9IGhzLmZpbmQoXCIub3JhbmdlLWNpcmNsZSBjaXJjbGVcIilcbiAgICAgICAgaG92ZXJTdHJva2UgPSBocy5maW5kKFwiLmhvdmVyLXN0cm9rZSBjaXJjbGVcIilcbiAgICAgICAgZ3JheVN0cm9rZSA9IGNocy5maW5kKFwiLmdyYXktc3Ryb2tlIGNpcmNsZVwiKVxuXG5cbiAgICAgICAgZ29XaGl0ZSA9IFR3ZWVuTWF4LnRvIFtncmF5U3Ryb2tlXSAsIC40ICxcbiAgICAgICAgICAgIHN0cm9rZTpcIiNmZmZmZmZcIlxuXG4gICAgICAgIHNob3dIb3ZlciA9IFR3ZWVuTWF4LnRvIGhvdmVyU3Ryb2tlICwgLjQgLFxuICAgICAgICAgICAgb3BhY2l0eToxXG5cblxuXG4gICAgICAgIGdyYXlTcGluID0gVHdlZW5NYXgudG8gZ3JheVN0cm9rZSAsIDIgLFxuICAgICAgICAgICAgcm90YXRpb246XCIzNjBkZWdcIlxuICAgICAgICAgICAgcmVwZWF0Oi0xXG4gICAgICAgICAgICBlYXNlOkxpbmVhci5lYXNlTm9uZVxuXG4gICAgICAgIGdyYXlTcGluLnBhdXNlZCh0cnVlKVxuXG4gICAgICAgIHRsT3ZlciA9IG5ldyBUaW1lbGluZU1heFxuICAgICAgICAgICAgb25TdGFydDogLT5cbiAgICAgICAgICAgICAgICBncmF5U3Bpbi5wbGF5KClcblxuICAgICAgICB0bE92ZXIuYWRkIFtnb1doaXRlLHNob3dIb3Zlcl1cblxuXG5cbiAgICBob3RzcG90T3V0OiAoaHMgLCBjaHMpIC0+XG4gICAgICAgIHRsT3V0ID0gbmV3IFRpbWVsaW5lTWF4XG4gICAgICAgIG9yYW5nZVN0cm9rZSA9IGhzLmZpbmQoXCIub3JhbmdlLWNpcmNsZSBjaXJjbGVcIilcbiAgICAgICAgaG92ZXJTdHJva2UgPSBocy5maW5kKFwiLmhvdmVyLXN0cm9rZSBjaXJjbGVcIilcbiAgICAgICAgZ3JheVN0cm9rZSA9IGNocy5maW5kKFwiLmdyYXktc3Ryb2tlIGNpcmNsZVwiKVxuXG4gICAgICAgICMjI2dvT3JhbmdlID0gVHdlZW5NYXgudG8gb3JhbmdlU3Ryb2tlICwgLjQgLFxuICAgICAgICAgICAgc3Ryb2tlOlwiI0Y0Q0UyMVwiIyMjXG5cbiAgICAgICAgaGlkZUhvdmVyID0gVHdlZW5NYXgudG8gaG92ZXJTdHJva2UgLCAuNCAsXG4gICAgICAgICAgICBvcGFjaXR5OjBcblxuICAgICAgICBnb0dyYXkgPSBUd2Vlbk1heC50byBbZ3JheVN0cm9rZV0gLCAuNCAsXG4gICAgICAgICAgICBzdHJva2U6XCIjMmMyYzJjXCJcbiAgICAgICAgICAgIHJvdGF0aW9uOlwiLTM2MGRlZ1wiXG4gICAgICAgICAgICBvdmVyd3JpdGU6XCJwcmVleGlzdGluZ1wiXG5cblxuXG5cblxuICAgICAgICB0bE91dCA9IG5ldyBUaW1lbGluZU1heFxuXG4gICAgICAgIHRsT3V0LmFkZCBbaGlkZUhvdmVyLGdvR3JheV1cblxuICAgIGdlbmVyYXRlRXZlbnRzOiAtPlxuICAgICAgICBldmVudHMgPSB7fVxuICAgICAgICAkKHdpbmRvdykucmVzaXplIEByZXNpemVcbiAgICAgICAgZXZlbnRzWydjbGljayBnLmhvdHNwb3QnXSA9IFwiaGFuZGxlSG90c3BvdFwiXG4gICAgICAgIGV2ZW50c1snY2xpY2sgY2lyY2xlLmNsaWNrYWJsZSddID0gXCJoYW5kbGVIb3RzcG90XCJcbiAgICAgICAgaWYgIUBpc1RvdWNoXG4gICAgICAgICAgICBldmVudHNbJ21vdXNlZW50ZXIgZy5ob3RzcG90J10gPSBcImhhbmRsZUhvdHNwb3RcIlxuICAgICAgICAgICAgZXZlbnRzWydtb3VzZWxlYXZlIGcuaG90c3BvdCddID0gXCJoYW5kbGVIb3RzcG90XCJcblxuXG4gICAgICAgICAgICBldmVudHNbJ21vdXNlZW50ZXIgY2lyY2xlLmNsaWNrYWJsZSddID0gXCJoYW5kbGVIb3RzcG90XCJcbiAgICAgICAgICAgIGV2ZW50c1snbW91c2VsZWF2ZSBjaXJjbGUuY2xpY2thYmxlJ10gPSBcImhhbmRsZUhvdHNwb3RcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBldmVudHNbJ3RvdWNoZW5kIGcuaG90c3BvdCddID0gXCJoYW5kbGVIb3RzcG90XCJcbiAgICAgICAgICAgIGV2ZW50c1sndG91Y2hlbmQgY2lyY2xlLmNsaWNrYWJsZSddID0gXCJoYW5kbGVIb3RzcG90XCJcblxuICAgICAgICByZXR1cm4gZXZlbnRzXG5cblxuXG4gICAgZHJhd0NvbnRlbnRCb3g6IChib3gpIC0+XG5cbiAgICAgICAgaWYgIUBjb250ZW50UmVjdD9cblxuICAgICAgICAgICAgQGNvbnRlbnRSZWN0ID0gJChcIjxkaXYvPlwiKVxuICAgICAgICAgICAgQGNvbnRlbnRSZWN0LmFkZENsYXNzKCdjb250ZW50UmVjdCcpXG5cbiAgICAgICAgICAgIEBjb250ZW50Q29udGFpbmVyLmFwcGVuZChAY29udGVudFJlY3QpXG5cbiAgICAgICAgVHdlZW5NYXguc2V0IEBjb250ZW50UmVjdCAsXG4gICAgICAgICAgICB4OmJveC54XG4gICAgICAgICAgICB5OmJveC55XG4gICAgICAgICAgICB3aWR0aDpib3gud2lkdGhcbiAgICAgICAgICAgIGhlaWdodDpib3guaGVpZ2h0XG5cblxuXG5cbiAgICBzZXRDb250ZW50UG9zaXRpb25zOiAtPlxuXG4gICAgICAgIGZvciBrLGRhdGEgb2YgQGhvdHNwb3REYXRhXG5cbiAgICAgICAgICAgIGlmIGRhdGEuY29udGVudC5zdGFuZGFyZC50b3A/XG4gICAgICAgICAgICAgICAgZGF0YS5jb250ZW50LnRvcCA9IGRhdGEuY29udGVudC5zdGFuZGFyZC50b3AgKyAgQGhlYWRlck9mZnNldFxuXG4gICAgICAgICAgICBpZiBkYXRhLmNvbnRlbnQuc3RhbmRhcmQubGVmdD9cbiAgICAgICAgICAgICAgICBkYXRhLmNvbnRlbnQubGVmdCA9IGRhdGEuY29udGVudC5zdGFuZGFyZC5sZWZ0XG5cbiAgICAgICAgICAgIGlmIGRhdGEuY29udGVudC5zdGFuZGFyZC5yaWdodD9cbiAgICAgICAgICAgICAgICBkYXRhLmNvbnRlbnQucmlnaHQgPSBkYXRhLmNvbnRlbnQuc3RhbmRhcmQucmlnaHRcblxuICAgICAgICAgICAgaWYgZGF0YS5jb250ZW50LnN0YW5kYXJkLmNlbnRlcj9cbiAgICAgICAgICAgICAgICBkYXRhLmNvbnRlbnQuY2VudGVyID0gZGF0YS5jb250ZW50LnN0YW5kYXJkLmNlbnRlclxuXG4gICAgICAgICAgICBpZiB3aW5kb3cuaW5uZXJXaWR0aCA8PSA4MDBcbiAgICAgICAgICAgICAgICBpZiBkYXRhLmNvbnRlbnQuc21hbGw/XG4gICAgICAgICAgICAgICAgICAgIGlmIGRhdGEuY29udGVudC5zbWFsbC50b3A/XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbnRlbnQudG9wID0gZGF0YS5jb250ZW50LnNtYWxsLnRvcCArIEBoZWFkZXJPZmZzZXRcblxuICAgICAgICAgICAgICAgICAgICBpZiBkYXRhLmNvbnRlbnQuc21hbGwubGVmdD9cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY29udGVudC5sZWZ0ID0gZGF0YS5jb250ZW50LnNtYWxsLmxlZnRcblxuICAgICAgICAgICAgICAgICAgICBpZiBkYXRhLmNvbnRlbnQuc21hbGwucmlnaHQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNvbnRlbnQucmlnaHQgPSBkYXRhLmNvbnRlbnQuc21hbGwucmlnaHRcblxuICAgICAgICAgICAgICAgICAgICBpZiBkYXRhLmNvbnRlbnQuc21hbGwuY2VudGVyP1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jb250ZW50LmNlbnRlciA9IGRhdGEuY29udGVudC5zbWFsbC5jZW50ZXJcblxuXG5cblxuXG5cbiAgICByZXNpemU6IChlKSA9PlxuICAgICAgICBAc2V0Q29udGVudFBvc2l0aW9ucygpO1xuXG5cblxuICAgICAgICBjb250ZW50Qm94ID1cbiAgICAgICAgICAgIHg6ICBAaG90c3BvdENvbnRhaW5lck92ZXIud2lkdGgoKSouNSAtIFV0aWxzLmdldE1heFdpZHRoKCkqLjVcbiAgICAgICAgICAgIHk6IDBcbiAgICAgICAgICAgIHdpZHRoOiBVdGlscy5nZXRNYXhXaWR0aCgpXG4gICAgICAgICAgICBoZWlnaHQ6IEBob3RzcG90Q29udGFpbmVyT3Zlci5oZWlnaHQoKVxuXG5cblxuICAgICAgICBmb3IgayxkYXRhIG9mIEBob3RzcG90RGF0YVxuICAgICAgICAgICAgY29udGVudEVsID0gQGNvbnRlbnRDb250YWluZXIuZmluZChcIiMje2RhdGEuY29udGVudC5pZH1cIilcbiAgICAgICAgICAgIGNpcmNsZSA9IEBob3RzcG90Q29udGFpbmVyT3Zlci5maW5kKFwiI2ludGVyYWN0aXZlLSN7a31cIilcbiAgICAgICAgICAgIGFuY2hvckxlZnQgPSBjb250ZW50RWwuZmluZCgnLmFuY2hvcicpLmNzcygnbGVmdCcpXG4gICAgICAgICAgICBhbmNob3JMZWZ0ID0gcGFyc2VJbnQgYW5jaG9yTGVmdC5zdWJzdHIoMCwgYW5jaG9yTGVmdC5sZW5ndGgtMilcblxuXG5cblxuICAgICAgICAgICAgaWYgZGF0YS5jb250ZW50LnJpZ2h0P1xuICAgICAgICAgICAgICAgIGN4ID0gY29udGVudEJveC53aWR0aCAtICgoY29udGVudEVsLndpZHRoKCkgKSArIGRhdGEuY29udGVudC5yaWdodClcbiAgICAgICAgICAgIGVsc2UgaWYgZGF0YS5jb250ZW50LmxlZnQ/XG4gICAgICAgICAgICAgICAgY3ggPSBkYXRhLmNvbnRlbnQubGVmdCAtIGFuY2hvckxlZnRcbiAgICAgICAgICAgIGVsc2UgaWYgZGF0YS5jb250ZW50LmNlbnRlcj9cbiAgICAgICAgICAgICAgICBpZiBhbmNob3JMZWZ0ID4gMCB0aGVuIGFuY2hvckxlZnQgPSAwXG4gICAgICAgICAgICAgICAgY3ggPSAoKGNvbnRlbnRCb3gud2lkdGggKiAuNSkgKyAoZGF0YS5jb250ZW50LmNlbnRlciAtIGFuY2hvckxlZnQpKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gXG4gICAgICAgICAgICBhbmNob3JDb29yZHMgPSBAZ2V0QW5jaG9yUG9zaXRpb24oY29udGVudEVsKVxuXG5cbiAgICAgICAgICAgIFR3ZWVuTWF4LnNldCBjb250ZW50RWwgLFxuICAgICAgICAgICAgICAgIHg6IGNvbnRlbnRCb3gueCArIGN4XG4gICAgICAgICAgICAgICAgeTogY29udGVudEJveC55ICsgZGF0YS5jb250ZW50LnRvcFxuXG4gICAgICAgICAgICBUd2Vlbk1heC5zZXQgY2lyY2xlICxcbiAgICAgICAgICAgICAgICB4OmFuY2hvckNvb3Jkcy54XG4gICAgICAgICAgICAgICAgeTphbmNob3JDb29yZHMueVxuXG5cbiAgICAgICAgJChcIi5yYWNrZXQtc3BlY3MtY29udGVudCBzdmdcIikuZWFjaCAoaSx0KSA9PlxuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUgXCJ2aWV3Qm94XCIgLCBcIjAgMCAje3dpbmRvdy5pbm5lcldpZHRofSAje0Bob3RzcG90Q29udGFpbmVyT3Zlci5oZWlnaHQoKX1cIlxuXG5cbiAgICBpbml0SG90c3BvdHM6ID0+XG4gICAgICAgIGZvciBrLGdlb21JZCBvZiBAbW9kZWxcbiAgICAgICAgICAgIGZvciBpLHNwb3Qgb2YgZ2VvbUlkXG4gICAgICAgICAgICAgICAgc3BvdC50cmFuc2Zvcm0uaWQgPSBzcG90LmlkXG5cbiAgICAgICAgICAgICAgICBAaG90c3BvdERhdGFbc3BvdC5pZF0gPVxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06c3BvdC50cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICAgICAgY29udGVudDpzcG90LmNvbnRlbnRcbiAgICAgICAgICAgICAgICAgICAgb3JkZXI6c3BvdC5vcmRlclxuICAgICAgICAgICAgICAgICAgICB0cmFja2luZzogc3BvdC50cmFja2luZ1xuXG5cbiAgICAgICAgQHJlc2l6ZSgpXG4gICAgICAgIEBjcmVhdGVDb250ZW50UGF0aHMoKVxuICAgICAgICBAY3JlYXRlSG90c3BvdHMoKVxuICAgICAgICBAY3JlYXRlQ29udGVudEhvdHNwb3RzKClcbiAgICAgICAgQGNyZWF0ZVRpbWVsaW5lcygpXG5cblxuXG4gICAgY3JlYXRlSG90c3BvdHM6IC0+XG4gICAgICAgIGhzID0gW11cbiAgICAgICAgZm9yIGlkLGRhdGEgb2YgQGhvdHNwb3REYXRhXG5cbiAgICAgICAgICAgIHN3aXRjaCBpZFxuICAgICAgICAgICAgICAgIHdoZW4gXCJwYXJhbGxlbC1kcmlsbGluZ1wiXG4gICAgICAgICAgICAgICAgICAgIGZvciBpIGluIFswLi4yXVxuICAgICAgICAgICAgICAgICAgICAgICAgQGhvdHNwb3RDb250YWluZXJPdmVyWzBdLmFwcGVuZENoaWxkICBUZW1wbGF0ZXMuaG90c3BvdHNbaWRdKGlkLGksZGF0YS5vcmRlcilcblxuICAgICAgICAgICAgICAgIGVsc2VcblxuICAgICAgICAgICAgICAgICAgICBAaG90c3BvdENvbnRhaW5lck92ZXJbMF0uYXBwZW5kQ2hpbGQgVGVtcGxhdGVzLmhvdHNwb3RzW1wiZGVmYXVsdFwiXShpZCxkYXRhLm9yZGVyKVxuXG5cblxuXG4gICAgY3JlYXRlQ29udGVudEhvdHNwb3RzOiAtPlxuXG4gICAgICAgIGZvciBpZCxkYXRhIG9mIEBob3RzcG90RGF0YVxuICAgICAgICAgICAgJGNvbnRlbnQgPSBAY29udGVudENvbnRhaW5lci5maW5kKFwiIyN7ZGF0YS5jb250ZW50LmlkfVwiKVxuICAgICAgICAgICAgYW5jaG9yQ29vcmRzID0gQGdldEFuY2hvclBvc2l0aW9uKCRjb250ZW50KVxuXG5cbiAgICAgICAgICAgIHN3aXRjaCBpZFxuICAgICAgICAgICAgICAgIHdoZW4gXCJwYXJhbGxlbC1kcmlsbGluZ1wiXG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIGkgaW4gWzAuLjJdXG4gICAgICAgICAgICAgICAgICAgICAgICBAaG90c3BvdENvbnRhaW5lclVuZGVyWzBdLmFwcGVuZENoaWxkIFRlbXBsYXRlcy5jb250ZW50SG90c3BvdHNbJ2RlZmF1bHQnXShpZCxpKVxuXG4gICAgICAgICAgICAgICAgZWxzZVxuXG4gICAgICAgICAgICAgICAgICAgIEBob3RzcG90Q29udGFpbmVyVW5kZXJbMF0uYXBwZW5kQ2hpbGQgVGVtcGxhdGVzLmNvbnRlbnRIb3RzcG90c1tcImRlZmF1bHRcIl0oaWQpXG5cblxuXG5cbiAgICAgICAgICAgICRjaHMgPSBAaG90c3BvdENvbnRhaW5lclVuZGVyLmZpbmQoXCIuY29udGVudC1ob3RzcG90W2RhdGEtaWQ9JyN7aWR9J11cIilcblxuXG5cbiAgICAgICAgICAgICNjcmVhdGUgaG92ZXIgYXJlYVxuICAgICAgICAgICAgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCBcImNpcmNsZVwiKVxuICAgICAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZSgncicgLCBcIjI0cHhcIiApXG4gICAgICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJyAsIFwidHJhbnNwYXJlbnRcIiApXG4gICAgICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjbGFzcycgLCBcImNsaWNrYWJsZVwiIClcbiAgICAgICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2lkJyAsIFwiaW50ZXJhY3RpdmUtI3tpZH1cIilcbiAgICAgICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnICwgaWQpXG5cbiAgICAgICAgICAgIEBob3RzcG90Q29udGFpbmVyT3ZlclswXS5hcHBlbmRDaGlsZCBjaXJjbGVcblxuXG4gICAgICAgICAgICBmb3IgY2gsaSBpbiAkY2hzXG5cbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAwXG4gICAgICAgICAgICAgICAgaWYgaSA+IDBcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gaWYgaSUyIHRoZW4gLTUwIGVsc2UgNTBcblxuICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnNldCBbY2hdICxcbiAgICAgICAgICAgICAgICAgICAgeDphbmNob3JDb29yZHMueCArIG9mZnNldFxuICAgICAgICAgICAgICAgICAgICB5OmFuY2hvckNvb3Jkcy55XG5cblxuICAgICAgICAgICAgVHdlZW5NYXguc2V0IFtjaXJjbGVdICxcbiAgICAgICAgICAgICAgICB4OmFuY2hvckNvb3Jkcy54XG4gICAgICAgICAgICAgICAgeTphbmNob3JDb29yZHMueVxuXG5cblxuXG5cblxuXG5cblxuICAgIGNyZWF0ZVRpbWVsaW5lczogLT5cblxuICAgICAgICBmb3IgaWQsZGF0YSBvZiBAaG90c3BvdERhdGFcbiAgICAgICAgICAgICRocyA9IEBob3RzcG90Q29udGFpbmVyT3Zlci5maW5kKFwiLmhvdHNwb3RbZGF0YS1pZD0nI3tpZH0nXVwiKVxuICAgICAgICAgICAgJGNocyA9IEBob3RzcG90Q29udGFpbmVyVW5kZXIuZmluZChcIi5jb250ZW50LWhvdHNwb3RbZGF0YS1pZD0nI3tpZH0nXVwiKVxuICAgICAgICAgICAgJGNvbnRlbnQgPSBAY29udGVudENvbnRhaW5lci5maW5kKFwiIyN7ZGF0YS5jb250ZW50LmlkfVwiKVxuXG5cbiAgICAgICAgICAgIHN3aXRjaCBpZFxuICAgICAgICAgICAgICAgIHdoZW4gXCJwYXJhbGxlbC1kcmlsbGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICRwYXRoID0gQGhvdHNwb3RDb250YWluZXJPdmVyLmZpbmQoXCIjcGF0aC0je2lkfS0wICwgI3BhdGgtI3tpZH0tMSAsICNwYXRoLSN7aWR9LTJcIilcbiAgICAgICAgICAgICAgICAgICAgQGhvdHNwb3REYXRhW2lkXS5jb21wb25lbnRzID0gQW5pbWF0aW9uc1tpZF0uZGVmaW5lVGltZWxpbmVDb21wb25lbnRzICRocywgJHBhdGgsICRjb250ZW50LCAkY2hzXG4gICAgICAgICAgICAgICAgICAgIEFuaW1hdGlvbnNbaWRdLmFwcGx5SW5pdGlhbFN0YXRlcyhAaG90c3BvdERhdGFbaWRdLmNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkcGF0aCA9IEBob3RzcG90Q29udGFpbmVyT3Zlci5maW5kKFwiI3BhdGgtI3tpZH1cIilcbiAgICAgICAgICAgICAgICAgICAgQGhvdHNwb3REYXRhW2lkXS5jb21wb25lbnRzID0gQW5pbWF0aW9uc1snZGVmYXVsdCddLmRlZmluZVRpbWVsaW5lQ29tcG9uZW50cyAkaHMsICRwYXRoLCAkY29udGVudCwgJGNoc1xuICAgICAgICAgICAgICAgICAgICBBbmltYXRpb25zWydkZWZhdWx0J10uYXBwbHlJbml0aWFsU3RhdGVzKEBob3RzcG90RGF0YVtpZF0uY29tcG9uZW50cylcblxuXG5cblxuXG4gICAgICAgICAgICBAaG90c3BvdERhdGFbaWRdLnBhdGhDb21wbGV0ZSA9IGZhbHNlXG5cblxuXG5cbiAgICBjcmVhdGVDb250ZW50UGF0aHM6IC0+XG5cbiAgICAgICAgZm9yIGlkIG9mIEBob3RzcG90RGF0YVxuXG4gICAgICAgICAgICBzd2l0Y2ggaWRcbiAgICAgICAgICAgICAgICB3aGVuIFwicGFyYWxsZWwtZHJpbGxpbmdcIlxuXG4gICAgICAgICAgICAgICAgICAgIGZvciBpIGluIFswLi4yXVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgXCJwYXRoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImlkXCIgLCBcInBhdGgtI3tpZH0tI3tpfVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFwiaG90c3BvdC1wYXRoIHdoaXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBAaG90c3BvdENvbnRhaW5lck92ZXJbMF0uYXBwZW5kQ2hpbGQgcGF0aFxuXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCBcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJpZFwiICwgXCJwYXRoLSN7aWR9XCIpXG4gICAgICAgICAgICAgICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcImhvdHNwb3QtcGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICBAaG90c3BvdENvbnRhaW5lck92ZXJbMF0uYXBwZW5kQ2hpbGQgcGF0aFxuXG5cblxuXG5cblxuXG4gICAgdXBkYXRlSG90c3BvdHM6IChzcG90cyx1c2VyKSA9PlxuICAgICAgICAjQ2hlY2sgaWYgdXNlciBpbml0aWFsdGVkLiByZXNldCBhbGwgaG90c3BvdHNcbiAgICAgICAgaWYgdXNlclxuICAgICAgICAgICAgQGhvdHNwb3RSZXNldCgpXG5cbiAgICAgICAgZm9yIGlkLHNwb3Qgb2Ygc3BvdHNcbiAgICAgICAgICAgIGRhdGEgPSBAaG90c3BvdERhdGFbaWRdXG5cbiAgICAgICAgICAgICRjb250ZW50ID0gQGNvbnRlbnRDb250YWluZXIuZmluZChcIiMje0Bob3RzcG90RGF0YVtpZF0uY29udGVudC5pZH1cIilcbiAgICAgICAgICAgICRob3RzcG90ID0gQGhvdHNwb3RDb250YWluZXJPdmVyLmZpbmQoXCIuaG90c3BvdFtkYXRhLWlkPScje2lkfSddXCIpXG4gICAgICAgICAgICAkaG90c3BvdDIgPSBAaG90c3BvdENvbnRhaW5lclVuZGVyLmZpbmQoXCIuY29udGVudC1ob3RzcG90W2RhdGEtaWQ9JyN7aWR9J11cIilcblxuXG4gICAgICAgICAgICBzd2l0Y2ggaWRcbiAgICAgICAgICAgICAgICB3aGVuIFwicGFyYWxsZWwtZHJpbGxpbmdcIlxuICAgICAgICAgICAgICAgICAgICAkcGF0aCA9IEBob3RzcG90Q29udGFpbmVyT3Zlci5maW5kKFwiI3BhdGgtI3tpZH0tMCAsICNwYXRoLSN7aWR9LTEgLCAjcGF0aC0je2lkfS0yXCIpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAkcGF0aCA9IEBob3RzcG90Q29udGFpbmVyT3Zlci5maW5kKFwiI3BhdGgtI3tpZH1cIilcblxuICAgICAgICAgICAgc3BvdC54ID0gTWF0aC5mbG9vcihzcG90LngpXG4gICAgICAgICAgICBzcG90LnkgPSBNYXRoLmZsb29yKHNwb3QueSlcbiAgICAgICAgICAgIGFscGhhID0gKCgoc3BvdC56KSArIDE0KS82OSkgKyAuNzVcblxuICAgICAgICAgICAgY29udGVudENvb3JkcyA9ICBAZ2V0QW5jaG9yUG9zaXRpb24oJGNvbnRlbnQpXG5cbiAgICAgICAgICAgIGZvciBocyxpIGluICRob3RzcG90XG4gICAgICAgICAgICAgICAgc3AgPSAkKGhzKVxuXG4gICAgICAgICAgICAgICAgc3AyID0gJGhvdHNwb3QyW2ldXG5cbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAwXG4gICAgICAgICAgICAgICAgaWYgaSA+IDBcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gaWYgaSUyIHRoZW4gLTUwIGVsc2UgNTBcblxuICAgICAgICAgICAgICAgIFR3ZWVuTWF4LnRvIHNwICwgLjEsXG4gICAgICAgICAgICAgICAgICAgIHg6c3BvdC54ICsgb2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgIHk6c3BvdC55XG5cbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTphbHBoYVxuXG4gICAgICAgICAgICAgICAgVHdlZW5NYXgudG8gc3AyICwgLjEgLFxuICAgICAgICAgICAgICAgICAgICB4OmNvbnRlbnRDb29yZHMueCArIG9mZnNldFxuICAgICAgICAgICAgICAgICAgICB5OmNvbnRlbnRDb29yZHMueVxuXG4gICAgICAgICAgICAgICAgaWYgJChcImh0bWxcIikuaGFzQ2xhc3MoXCJzYWZhcmlcIilcbiAgICAgICAgICAgICAgICAgICAgaHMuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICBocy5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgaHMuc3R5bGUuZGlzcGxheSA9ICcnXG5cbiAgICAgICAgICAgIGZvciBwLGkgaW4gJHBhdGhcbiAgICAgICAgICAgICAgICBwYXRoID0gJChwKVxuICAgICAgICAgICAgICAgIG9mZnNldCA9IDBcbiAgICAgICAgICAgICAgICBpZiBpID4gMFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBpZiBpJTIgdGhlbiAtNTAgZWxzZSA1MFxuICAgICAgICAgICAgICAgIGQ9ICBcIk0je3Nwb3QueCArIG9mZnNldH0sI3tzcG90Lnl9TCN7Y29udGVudENvb3Jkcy54ICsgb2Zmc2V0fSwje2NvbnRlbnRDb29yZHMueX1cIlxuICAgICAgICAgICAgICAgIHBhdGguYXR0cignZCcgLCBkKVxuXG5cblxuICAgICAgICAgICAgI0RlYWwgd2l0aCBIb3RzcG90XG5cblxuXG5cblxuXG5cbiAgICBwYXJzZUVsZW1lbnRJZDogKCRocykgLT5cbiAgICAgICAgIyMjXG4gICAgICAgIGlkQXJyYXkgPSAkaHMuYXR0cignaWQnKS5zcGxpdChcIi1cIilcbiAgICAgICAgaWRBcnJheS5zaGlmdCgpXG4gICAgICAgIGlkID0gaWRBcnJheS5qb2luKFwiLVwiKVxuICAgICAgICAjIyNcblxuICAgICAgICBpZCA9ICRocy5kYXRhKCdpZCcpXG5cbiAgICAgICAgcmV0dXJuIGlkXG5cblxuICAgIGdldEFuY2hvclBvc2l0aW9uOiAoJGNvbnRlbnQpIC0+XG4gICAgICAgIG1hdHJpeCA9IFV0aWxzLm1hdHJpeFRvQXJyYXkgJGNvbnRlbnQuY3NzKFwidHJhbnNmb3JtXCIpXG4gICAgICAgIGNBbmNob3IgPSAkY29udGVudC5maW5kKFwiLmFuY2hvclwiKVxuICAgICAgICBjb250ZW50Q29vcmRzID1cbiAgICAgICAgICAgIHg6cGFyc2VJbnQobWF0cml4WzRdKSArIHBhcnNlSW50KGNBbmNob3IuY3NzKCdsZWZ0JykpXG4gICAgICAgICAgICB5OnBhcnNlSW50KG1hdHJpeFs1XSkgKyBwYXJzZUludChjQW5jaG9yLmNzcygndG9wJykpXG4gICAgICAgIHJldHVybiBjb250ZW50Q29vcmRzXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIb3RzcG90Vmlld1xuXG4iLCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIFwiZGVmYXVsdFwiIDogcmVxdWlyZSAnLi4vYW5pbWF0aW9ucy9nbG9iYWwuY29mZmVlJ1xuICAgIFwieDItc2hhZnRcIiA6IHJlcXVpcmUgJy4uL2FuaW1hdGlvbnMvaGFuZGxlLmNvZmZlZSdcbiAgICBcInBhcmFsbGVsLWRyaWxsaW5nXCIgOiByZXF1aXJlICcuLi9hbmltYXRpb25zL3BhcmFsbGVsLWRyaWxsaW5nLmNvZmZlZSdcbiAgICBcInNwaW4tZWZmZWN0XCIgOiByZXF1aXJlICcuLi9hbmltYXRpb25zL3NwaW4tZWZmZWN0LmNvZmZlZSdcbiAgICBcImNhcmJvbi1maWJlclwiIDogcmVxdWlyZSAnLi4vYW5pbWF0aW9ucy9jYXJib24tZmliZXIuY29mZmVlJ1xuXG4iLCJcblxubW9kdWxlLmV4cG9ydHMuaG90c3BvdHMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcy9ob3RzcG90cy5jb2ZmZWUnKS5ob3RzcG90c1xubW9kdWxlLmV4cG9ydHMuY29udGVudEhvdHNwb3RzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMvaG90c3BvdHMuY29mZmVlJykuY29udGVudEhvdHNwb3RzXG5cblxuIiwiVXRpbHMgPSByZXF1aXJlICcuLi8uLi8uLi8uLi91dGlscy9jb21tb24uY29mZmVlJ1xuXG5cbmdldE51bWJlciA9IChudW0pIC0+XG5cbiAgICBudW1IZWlnaHQgPSBcIjJweFwiXG4gICAgaWYgJCgnaHRtbCcpLmhhc0NsYXNzKFwiaWVcIikgb3IgJCgnaHRtbCcpLmhhc0NsYXNzKFwiZmlyZWZveFwiKVxuICAgICAgICBudW1IZWlnaHQgPSBcIjZweFwiXG5cbiAgICBudW1HID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgJ2cnKVxuICAgIG51bUcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdudW1iZXInKVxuICAgIG51bUlubmVyRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgJ2cnKVxuXG4gICAgbnVtVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgJ3RleHQnKVxuICAgIG51bVRleHQuc2V0QXR0cmlidXRlKCdmaWxsJyAsIFwiI2ZmZmZmZlwiKVxuICAgIG51bVRleHQuc2V0QXR0cmlidXRlKCd5JyAsIG51bUhlaWdodClcbiAgICBudW1UZXh0LnNldEF0dHJpYnV0ZSgneCcgLCBcIjBweFwiKVxuICAgIG51bVRleHQuc2V0QXR0cmlidXRlKCd0ZXh0LWFuY2hvcicgLCBcIm1pZGRsZVwiKVxuICAgIG51bVRleHQuc2V0QXR0cmlidXRlKCdhbGlnbm1lbnQtYmFzZWxpbmUnICwgXCJtaWRkbGVcIilcbiAgICBudW1UZXh0LnRleHRDb250ZW50ID0gbnVtXG5cbiAgICBudW1Jbm5lckcuYXBwZW5kQ2hpbGQobnVtVGV4dClcbiAgICBudW1HLmFwcGVuZENoaWxkKG51bUlubmVyRylcblxuICAgIHJldHVybiBudW1HXG5cblxuZ2V0UGx1cyA9ICAoY29sb3IpICAtPlxuICAgIGlmICFjb2xvcj8gdGhlbiBjb2xvciA9IFwiI2ZmZmZmZlwiXG5cblxuICAgIHZ4ID0gdnkgPSBoeCA9IGh5ID0gXCIwcHhcIlxuICAgIGlmICQoJ2h0bWwnKS5oYXNDbGFzcygnaWUnKVxuICAgICAgICB2eSA9IFwiLTNweFwiXG4gICAgICAgIHZ4ID0gXCItMXB4XCJcbiAgICAgICAgaHggPSBcIi00cHhcIlxuXG5cbiAgICBwbHVzU2lnbkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdnJylcbiAgICBwbHVzU2lnbkcuc2V0QXR0cmlidXRlKCdjbGFzcycsICdwbHVzLXNpZ24nKVxuICAgIHBsdXNTaWduSW5uZXJHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgcGx1c1JlY3RWID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAncmVjdCcpXG4gICAgcGx1c1JlY3RWLnNldEF0dHJpYnV0ZSgnY2xhc3MnICwgXCJ2XCIpXG4gICAgcGx1c1JlY3RWLnNldEF0dHJpYnV0ZSgnd2lkdGgnICwgXCIycHhcIilcbiAgICBwbHVzUmVjdFYuc2V0QXR0cmlidXRlKCdoZWlnaHQnICwgXCI4cHhcIilcbiAgICBwbHVzUmVjdFYuc2V0QXR0cmlidXRlKCd4JyAsIHZ4KVxuICAgIHBsdXNSZWN0Vi5zZXRBdHRyaWJ1dGUoJ3knICwgdnkpXG4gICAgcGx1c1JlY3RWLnNldEF0dHJpYnV0ZSgnZmlsbCcgLCBjb2xvcilcbiAgICBwbHVzUmVjdEggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdyZWN0JylcbiAgICBwbHVzUmVjdEguc2V0QXR0cmlidXRlKCdjbGFzcycgLCBcImhcIilcbiAgICBwbHVzUmVjdEguc2V0QXR0cmlidXRlKCd3aWR0aCcgLCBcIjhweFwiKVxuICAgIHBsdXNSZWN0SC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcgLCBcIjJweFwiKVxuICAgIHBsdXNSZWN0SC5zZXRBdHRyaWJ1dGUoJ3gnICwgaHgpXG4gICAgcGx1c1JlY3RILnNldEF0dHJpYnV0ZSgneScgLCBoeSlcbiAgICBwbHVzUmVjdEguc2V0QXR0cmlidXRlKCdmaWxsJyAsIGNvbG9yKVxuICAgIHBsdXNTaWduSW5uZXJHLmFwcGVuZENoaWxkKHBsdXNSZWN0VilcbiAgICBwbHVzU2lnbklubmVyRy5hcHBlbmRDaGlsZChwbHVzUmVjdEgpXG4gICAgcGx1c1NpZ25HLmFwcGVuZENoaWxkKHBsdXNTaWduSW5uZXJHKVxuXG4gICAgcmV0dXJuIHBsdXNTaWduR1xuXG5nZXRPcmFuZ2VDaXJjbGUgPSAtPlxuICAgIG9yYW5nZUNpcmNsZUcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdnJylcbiAgICBvcmFuZ2VDaXJjbGVHLnNldEF0dHJpYnV0ZSgnY2xhc3MnICwgJ29yYW5nZS1jaXJjbGUnKVxuICAgIG9yYW5nZUNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgJ2NpcmNsZScpXG4gICAgb3JhbmdlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJyNGNENFMjEnKVxuICAgIG9yYW5nZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsICc2JylcbiAgICBvcmFuZ2VDaXJjbGUuc2V0QXR0cmlidXRlKCdjeCcsICcwJylcbiAgICBvcmFuZ2VDaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsICcwJylcbiAgICBvcmFuZ2VDaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgJzEyJylcbiAgICBvcmFuZ2VDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgJyNGRjZDMDAnKVxuICAgIG9yYW5nZUNpcmNsZUcuYXBwZW5kQ2hpbGQob3JhbmdlQ2lyY2xlKVxuXG4gICAgcmV0dXJuIG9yYW5nZUNpcmNsZUdcblxuZ2V0WWVsbG93U3Ryb2tlID0gLT5cbiAgICB5ZWxsb3dTdHJva2VHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgeWVsbG93U3Ryb2tlRy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJyAsICd5ZWxsb3ctc3Ryb2tlJylcbiAgICB5ZWxsb3dTdHJva2VDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdjaXJjbGUnKVxuICAgIHllbGxvd1N0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICcjRjRDRTIxJylcbiAgICB5ZWxsb3dTdHJva2VDaXJjbGUuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAnNCcpXG4gICAgeWVsbG93U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnY3gnLCAnMCcpXG4gICAgeWVsbG93U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnY3knLCAnMCcpXG4gICAgeWVsbG93U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgncicsICcxOScpXG4gICAgeWVsbG93U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsICd0cmFuc3BhcmVudCcpXG4gICAgeWVsbG93U3Ryb2tlRy5hcHBlbmRDaGlsZCh5ZWxsb3dTdHJva2VDaXJjbGUpXG5cbiAgICByZXR1cm4geWVsbG93U3Ryb2tlR1xuXG5nZXRXaGl0ZVN0cm9rZSA9IC0+XG4gICAgd2hpdGVTdHJva2VHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgd2hpdGVTdHJva2VHLnNldEF0dHJpYnV0ZSgnY2xhc3MnICwgJ3doaXRlLXN0cm9rZScpXG4gICAgd2hpdGVTdHJva2VDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdjaXJjbGUnKVxuICAgIHdoaXRlU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJyNmZmZmZmYnKVxuICAgIHdoaXRlU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzEwJylcbiAgICB3aGl0ZVN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgJzAnKVxuICAgIHdoaXRlU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnY3knLCAnMCcpXG4gICAgd2hpdGVTdHJva2VDaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgJzMyJylcbiAgICB3aGl0ZVN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKVxuICAgIHdoaXRlU3Ryb2tlRy5hcHBlbmRDaGlsZCh3aGl0ZVN0cm9rZUNpcmNsZSlcblxuICAgIHJldHVybiB3aGl0ZVN0cm9rZUdcblxuZ2V0SG92ZXJTdHJva2UgPSAtPlxuICAgIGhvdmVyU3Ryb2tlRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgJ2cnKVxuICAgIGhvdmVyU3Ryb2tlRy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJyAsICdob3Zlci1zdHJva2UnKVxuICAgIGhvdmVyU3Ryb2tlQ2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnY2lyY2xlJylcbiAgICBob3ZlclN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICcjZmZmZmZmJylcbiAgICBob3ZlclN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsICcyJylcbiAgICBob3ZlclN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgJzAnKVxuICAgIGhvdmVyU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnY3knLCAnMCcpXG4gICAgaG92ZXJTdHJva2VDaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgJzE4JylcbiAgICBob3ZlclN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKVxuICAgIGhvdmVyU3Ryb2tlRy5hcHBlbmRDaGlsZChob3ZlclN0cm9rZUNpcmNsZSlcblxuICAgIHJldHVybiBob3ZlclN0cm9rZUdcblxubW9kdWxlLmV4cG9ydHMuaG90c3BvdHMgPSB7fVxuXG5tb2R1bGUuZXhwb3J0cy5ob3RzcG90c1snZGVmYXVsdCddID0gKGlkLG9yZGVyKSAtPlxuICAgIGhvdHNwb3RHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgaG90c3BvdEcuc2V0QXR0cmlidXRlKCdjbGFzcycgLCAnaG90c3BvdCcpXG4gICAgaG90c3BvdEcuc2V0QXR0cmlidXRlKCdpZCcgLCBcImhvdHNwb3QtI3tpZH1cIilcbiAgICBob3RzcG90Ry5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnICwgaWQpXG5cbiAgICBvcmFuZ2VDaXJjbGVHID0gZ2V0T3JhbmdlQ2lyY2xlKClcbiAgICBwbHVzU2lnbkcgPSBnZXROdW1iZXIob3JkZXIpXG4gICAgeWVsbG93U3Ryb2tlRyA9IGdldFllbGxvd1N0cm9rZSgpXG4gICAgd2hpdGVTdHJva2VHID0gZ2V0V2hpdGVTdHJva2UoKVxuICAgIGhvdmVyU3Ryb2tlID0gZ2V0SG92ZXJTdHJva2UoKVxuXG4gICAgaG90c3BvdEcuYXBwZW5kQ2hpbGQob3JhbmdlQ2lyY2xlRylcbiAgICBob3RzcG90Ry5hcHBlbmRDaGlsZChwbHVzU2lnbkcpXG4gICAgaG90c3BvdEcuYXBwZW5kQ2hpbGQoeWVsbG93U3Ryb2tlRylcbiAgICBob3RzcG90Ry5hcHBlbmRDaGlsZCh3aGl0ZVN0cm9rZUcpXG4gICAgaG90c3BvdEcuYXBwZW5kQ2hpbGQoaG92ZXJTdHJva2UpXG5cbiAgICByZXR1cm4gaG90c3BvdEdcblxuXG5tb2R1bGUuZXhwb3J0cy5ob3RzcG90c1sncGFyYWxsZWwtZHJpbGxpbmcnXSA9IChpZCAsIGluZGV4LCBvcmRlcikgLT5cbiAgICBpZiAhaW5kZXg/IHRoZW4gaW5kZXggPSBcIlwiXG4gICAgaG90c3BvdEcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdnJylcbiAgICBob3RzcG90Ry5zZXRBdHRyaWJ1dGUoJ2NsYXNzJyAsICdob3RzcG90JylcbiAgICBob3RzcG90Ry5zZXRBdHRyaWJ1dGUoJ2lkJyAsIFwiaG90c3BvdC0je2lkfSN7aW5kZXh9XCIpXG4gICAgaG90c3BvdEcuc2V0QXR0cmlidXRlKCdkYXRhLWlkJyAsIGlkKVxuXG4gICAgb3JhbmdlQ2lyY2xlRyA9IGdldE9yYW5nZUNpcmNsZSgpXG4gICAgcGx1c1NpZ25HID0gZ2V0TnVtYmVyKG9yZGVyKVxuICAgIGhvdmVyU3Ryb2tlID0gZ2V0SG92ZXJTdHJva2UoKVxuXG4gICAgd2hpdGVTdHJva2VHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgd2hpdGVTdHJva2VHLnNldEF0dHJpYnV0ZSgnY2xhc3MnICwgJ3doaXRlLXN0cm9rZScpXG4gICAgd2hpdGVTdHJva2VDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdjaXJjbGUnKVxuICAgIHdoaXRlU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgJyNmZmZmZmYnKVxuICAgIHdoaXRlU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgd2hpdGVTdHJva2VDaXJjbGUuc2V0QXR0cmlidXRlKCdjeCcsICcwJylcbiAgICB3aGl0ZVN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N5JywgJzAnKVxuICAgIHdoaXRlU3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgncicsICcxMnB4JylcbiAgICB3aGl0ZVN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAndHJhbnNwYXJlbnQnKVxuICAgIHdoaXRlU3Ryb2tlRy5hcHBlbmRDaGlsZCh3aGl0ZVN0cm9rZUNpcmNsZSlcblxuICAgIGhvdHNwb3RHLmFwcGVuZENoaWxkKG9yYW5nZUNpcmNsZUcpXG4gICAgaG90c3BvdEcuYXBwZW5kQ2hpbGQocGx1c1NpZ25HKVxuICAgIGhvdHNwb3RHLmFwcGVuZENoaWxkKHdoaXRlU3Ryb2tlRylcbiAgICBob3RzcG90Ry5hcHBlbmRDaGlsZChob3ZlclN0cm9rZSlcblxuICAgIHJldHVybiBob3RzcG90R1xuXG5cblxubW9kdWxlLmV4cG9ydHMuY29udGVudEhvdHNwb3RzID0ge31cblxubW9kdWxlLmV4cG9ydHMuY29udGVudEhvdHNwb3RzWydkZWZhdWx0J10gPSAoaWQsaW5kZXgpIC0+XG4gICAgaWYgIWluZGV4PyB0aGVuIGluZGV4ID0gXCJcIlxuICAgIGhvdHNwb3RHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgaG90c3BvdEcuc2V0QXR0cmlidXRlKCdjbGFzcycgLCAnY29udGVudC1ob3RzcG90JylcbiAgICBob3RzcG90Ry5zZXRBdHRyaWJ1dGUoJ2lkJyAsIFwiaG90c3BvdDItI3tpZH0je2luZGV4fVwiKVxuICAgIGhvdHNwb3RHLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcgLCBpZClcblxuICAgIGdyYXlDaXJjbGVHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFV0aWxzLnN2Z25zLCAnZycpXG4gICAgZ3JheUNpcmNsZUcuc2V0QXR0cmlidXRlKCdjbGFzcycgLCAnZ3JheS1jaXJjbGUnKVxuICAgIGdyYXlDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdjaXJjbGUnKVxuICAgIGdyYXlDaXJjbGUuc2V0QXR0cmlidXRlKCdzdHJva2UnLCAnIzNjM2MzYycpXG4gICAgZ3JheUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsICc0JylcbiAgICBncmF5Q2lyY2xlLnNldEF0dHJpYnV0ZSgnY3gnLCAnMCcpXG4gICAgZ3JheUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N5JywgJzAnKVxuICAgIGdyYXlDaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgJzEwcHgnKVxuICAgIGdyYXlDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgJ3RyYW5zcGFyZW50JylcbiAgICBncmF5Q2lyY2xlRy5hcHBlbmRDaGlsZChncmF5Q2lyY2xlKVxuXG5cbiAgICBwbHVzU2lnbkcgPSBnZXRQbHVzKFwiIzJjMmMyY1wiKVxuXG4gICAgZ3JheVN0cm9rZUcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoVXRpbHMuc3ZnbnMsICdnJylcbiAgICBncmF5U3Ryb2tlRy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJyAsICdncmF5LXN0cm9rZScpXG4gICAgZ3JheVN0cm9rZUNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhVdGlscy5zdmducywgJ2NpcmNsZScpXG4gICAgZ3JheVN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICcjMmMyYzJjJylcbiAgICBncmF5U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgJzRweCcpXG4gICAgZ3JheVN0cm9rZUNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgJzAnKVxuICAgIGdyYXlTdHJva2VDaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsICcwJylcbiAgICBncmF5U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgncicsICcxOXB4JylcbiAgICBncmF5U3Ryb2tlQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsICd0cmFuc3BhcmVudCcpXG4gICAgZ3JheVN0cm9rZUcuYXBwZW5kQ2hpbGQoZ3JheVN0cm9rZUNpcmNsZSlcblxuXG4gICAgaG90c3BvdEcuYXBwZW5kQ2hpbGQoZ3JheUNpcmNsZUcpXG4gICAgaG90c3BvdEcuYXBwZW5kQ2hpbGQocGx1c1NpZ25HKVxuICAgIGhvdHNwb3RHLmFwcGVuZENoaWxkKGdyYXlTdHJva2VHKVxuXG4gICAgcmV0dXJuIGhvdHNwb3RHXG4iLCJcbkNvbXBvdW5kT2JqZWN0ID0gcmVxdWlyZSAnLi8uLi9hYnN0cmFjdC9Db21wb3VuZE9iamVjdC5jb2ZmZWUnXG5VdGlscyA9IHJlcXVpcmUgJy4uLy4uLy4uL3V0aWxzL2NvbW1vbi5jb2ZmZWUnXG5cbkFuaW1hdGlvbnMgPSByZXF1aXJlICcuLi9pbXBvcnRzL2FuaW1hdGlvbnMuY29mZmVlJ1xuXG5cblxuXG5cbmNsYXNzIFJhY2tldE9iamVjdCBleHRlbmRzIENvbXBvdW5kT2JqZWN0XG5cbiAgICBjb25zdHJ1Y3RvcjogKG9wdHMpIC0+XG4gICAgICAgIEBlbnZDdWJlID0gb3B0cy5lbnZDdWJlXG4gICAgICAgIEBjb21wb25lbnRzID0ge31cbiAgICAgICAgQGFuaW1hdGlvbnMgPSB7fVxuICAgICAgICBzdXBlcigpXG5cbiAgICBnZW9tZXRyeUxvYWRlZDogKGdlb20sbWF0KSA9PlxuICAgICAgICBzdXBlcihnZW9tLG1hdClcblxuXG5cblxuICAgIGFwcGx5U2hhZGVyOiAoZGF0YSxvYmopIC0+XG5cblxuXG5cbiAgICAgICAgZW52ID0gQGVudkN1YmVcbiAgICAgICAgaWYgZGF0YS5lbnYgaXMgZmFsc2VcbiAgICAgICAgICAgIGNvbnNvbGUubG9nIFwibm8gRU5WIVwiXG4gICAgICAgICAgICBlbnYgPSBudWxsXG5cblxuICAgICAgICAjbWF0LmNvbWJpbmU9IFRIUkVFLk1peE9wZXJhdGlvblxuXG5cbiAgICAgICAgaWYgZGF0YT9cblxuXG4gICAgICAgICAgICBpZiBkYXRhLnN3YXA/XG4gICAgICAgICAgICAgICAgc3dpdGNoIGRhdGEuc3dhcFxuICAgICAgICAgICAgICAgICAgICB3aGVuICdiYXNpYydcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudiA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpXG5cblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1hdCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpXG5cblxuXG4gICAgICAgICAgICBpZiBkYXRhLmNvbG9yP1xuICAgICAgICAgICAgICAgIG1hdC5jb2xvciA9IG5ldyBUSFJFRS5Db2xvciBkYXRhLmNvbG9yXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWF0LmNvbG9yID0gbmV3IFRIUkVFLkNvbG9yIDB4ZmZmZmZmXG5cbiAgICAgICAgICAgIGlmIGRhdGEuZW1pc3NpdmU/XG4gICAgICAgICAgICAgICAgbWF0LmVtaXNzaXZlID0gbmV3IFRIUkVFLkNvbG9yIGRhdGEuZW1pc3NpdmVcblxuXG4gICAgICAgICAgICBpZiBkYXRhLnNwZWN1bGFyP1xuICAgICAgICAgICAgICAgIG1hdC5zcGVjdWxhciA9IG5ldyBUSFJFRS5Db2xvciBkYXRhLnNwZWN1bGFyXG5cblxuICAgICAgICAgICAgaWYgZGF0YS5zaGluaW5lc3M/XG4gICAgICAgICAgICAgICAgbWF0LnNoaW5pbmVzcyA9IGRhdGEuc2hpbmluZXNzXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWF0LnNoaW5pbmVzcyA9IDBcblxuICAgICAgICAgICAgaWYgZGF0YS5yZWZsZWN0aXZpdHk/XG4gICAgICAgICAgICAgICAgbWF0LnJlZmxlY3Rpdml0eSA9ICBkYXRhLnJlZmxlY3Rpdml0eVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1hdC5yZWZsZWN0aXZpdHkgPSAwXG5cbiAgICAgICAgICAgIGlmIGRhdGEubWFwP1xuXG4gICAgICAgICAgICAgICAgbWFwID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShkYXRhLm1hcClcblxuICAgICAgICAgICAgICAgIGlmIGRhdGEuYW5pc290cm9weT9cbiAgICAgICAgICAgICAgICAgICAgbWFwLmFuaXNvdHJvcHkgPSBkYXRhLmFuaXNvdHJvcHlcblxuICAgICAgICAgICAgICAgIGlmIGRhdGEubWFwUmVwZWF0P1xuICAgICAgICAgICAgICAgICAgICBtYXAud3JhcFMgPSBtYXAud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xuICAgICAgICAgICAgICAgICAgICBtYXAucmVwZWF0LnNldChkYXRhLm1hcFJlcGVhdFswXSxkYXRhLm1hcFJlcGVhdFsxXSlcblxuXG4gICAgICAgICAgICAgICAgbWF0Lm1hcCA9IG1hcFxuXG5cblxuICAgICAgICAgICAgaWYgZGF0YS5zcGVjdWxhck1hcD9cbiAgICAgICAgICAgICAgICBzcGVjID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShkYXRhLnNwZWN1bGFyTWFwKVxuXG4gICAgICAgICAgICAgICAgaWYgZGF0YS5hbmlzb3Ryb3B5P1xuICAgICAgICAgICAgICAgICAgICBzcGVjLmFuaXNvdHJvcHkgPSBkYXRhLmFuaXNvdHJvcHlcblxuICAgICAgICAgICAgICAgIGlmIGRhdGEubWFwUmVwZWF0P1xuICAgICAgICAgICAgICAgICAgICBzcGVjLndyYXBTID0gc3BlYy53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nXG4gICAgICAgICAgICAgICAgICAgIHNwZWMucmVwZWF0LnNldChkYXRhLm1hcFJlcGVhdFswXSxkYXRhLm1hcFJlcGVhdFsxXSlcblxuICAgICAgICAgICAgICAgIG1hdC5zcGVjdWxhck1hcCA9IHNwZWNcblxuICAgICAgICAgICAgaWYgZGF0YS5hbHBoYU1hcD9cbiAgICAgICAgICAgICAgICBhbHBoYSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoZGF0YS5hbHBoYU1hcClcblxuICAgICAgICAgICAgICAgIGlmIGRhdGEuYW5pc290cm9weT9cbiAgICAgICAgICAgICAgICAgICAgYWxwaGEuYW5pc290cm9weSA9IGRhdGEuYW5pc290cm9weVxuXG4gICAgICAgICAgICAgICAgaWYgZGF0YS5tYXBSZXBlYXQ/XG4gICAgICAgICAgICAgICAgICAgIGFscGhhLndyYXBTID0gc3BlYy53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nXG4gICAgICAgICAgICAgICAgICAgIGFscGhhLnJlcGVhdC5zZXQoZGF0YS5tYXBSZXBlYXRbMF0sZGF0YS5tYXBSZXBlYXRbMV0pXG5cbiAgICAgICAgICAgICAgICBtYXQuYWxwaGFNYXAgPSBhbHBoYVxuXG4gICAgICAgICAgICBpZiBkYXRhLm5vcm1hbE1hcD9cbiAgICAgICAgICAgICAgICBub3JtID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShkYXRhLm5vcm1hbE1hcClcblxuICAgICAgICAgICAgICAgIGlmIGRhdGEubWFwUmVwZWF0P1xuICAgICAgICAgICAgICAgICAgICBub3JtLndyYXBTID0gbm9ybS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nXG4gICAgICAgICAgICAgICAgICAgIG5vcm0ucmVwZWF0LnNldChkYXRhLm1hcFJlcGVhdFswXSxkYXRhLm1hcFJlcGVhdFsxXSlcblxuICAgICAgICAgICAgICAgIG1hdC5ub3JtYWxNYXAgPSBub3JtXG5cblxuICAgICAgICAgICAgaWYgZGF0YS5ub3JtYWxTY2FsZT9cbiAgICAgICAgICAgICAgICBtYXQubm9ybWFsU2NhbGUgPSBuZXcgVEhSRUUuVmVjdG9yMihkYXRhLm5vcm1hbFNjYWxlWzBdLGRhdGEubm9ybWFsU2NhbGVbMV0pXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWF0Lm5vcm1hbFNjYWxlID0gbmV3IFRIUkVFLlZlY3RvcjIoMSwxKVxuXG5cbiAgICAgICAgICAgIGlmIGRhdGEuYnVtcE1hcD9cbiAgICAgICAgICAgICAgICBidW1wID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShkYXRhLmJ1bXBNYXApXG5cbiAgICAgICAgICAgICAgICBpZiBkYXRhLm1hcFJlcGVhdD9cbiAgICAgICAgICAgICAgICAgICAgYnVtcC53cmFwUyA9IG5vcm0ud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZ1xuICAgICAgICAgICAgICAgICAgICBidW1wLnJlcGVhdC5zZXQoZGF0YS5tYXBSZXBlYXRbMF0sZGF0YS5tYXBSZXBlYXRbMV0pXG5cbiAgICAgICAgICAgICAgICBtYXQuYnVtcE1hcCA9IGJ1bXBcblxuXG4gICAgICAgICAgICBpZiBkYXRhLmJ1bXBTY2FsZT9cblxuICAgICAgICAgICAgICAgIG1hdC5idW1wU2NhbGUgPSBkYXRhLmJ1bXBTY2FsZVxuXG5cblxuICAgICAgICBtYXQuZW52TWFwID0gZW52XG4gICAgICAgIG1hdC50cmFuc3BhcmVudCA9IHRydWVcbiAgICAgICAgbWF0LmFtYmllbnQgPSBtYXQuY29sb3JcblxuXG4gICAgICAgIHJldHVybiBtYXRcblxuXG4gICAgYXBwbHlNYXRlcmlhbFByb3BlcnRpZXM6IC0+XG4gICAgICAgIGZvciBrLG9iaiBvZiBAb2JqZWN0c1xuICAgICAgICAgICAgZGF0YSA9IG9iai5fbG9hZGVyRGF0YVxuICAgICAgICAgICAgb2JqLm1hdGVyaWFsID0gbnVsbFxuICAgICAgICAgICAgb2JqLm1hdGVyaWFsID0gQGFwcGx5U2hhZGVyKGRhdGEgLCBvYmopXG5cbiAgICBpc0hvdHNwb3Q6IChpbmRleCxpZCkgLT5cblxuICAgICAgICBzcG90cyA9IGhvdHNwb3RzW2lkXVxuXG5cbiAgICAgICAgaWYgc3BvdHM/XG4gICAgICAgICAgICBmb3Igc3BvdCBpbiBzcG90c1xuICAgICAgICAgICAgICAgIGlmIHNwb3QgaXMgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICByZXR1cm4gZmFsc2VcblxuXG4gICAgZ2V0SG90c3BvdHM6IChob3RzcG90cykgLT5cbiAgICAgICAgdmVydHMgPSBbXVxuXG5cblxuICAgICAgICBmb3IgbWVzaCBpbiBAZ3JvdXAuY2hpbGRyZW5cbiAgICAgICAgICAgIHNwb3RzID0gaG90c3BvdHNbbWVzaC5fX2lkXVxuICAgICAgICAgICAgaWYgc3BvdHM/XG5cbiAgICAgICAgICAgICAgICBtZXNoLnVwZGF0ZU1hdHJpeFdvcmxkKClcbiAgICAgICAgICAgICAgICBmb3IgcyBpbiBzcG90c1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ID0gbWVzaC5nZW9tZXRyeS52ZXJ0aWNlc1tzLmluZGV4XS5jbG9uZSgpXG4gICAgICAgICAgICAgICAgICAgIHZlcnQuX19pZCA9IHMuaWRcbiAgICAgICAgICAgICAgICAgICAgdmVydC5hcHBseU1hdHJpeDQobWVzaC5tYXRyaXhXb3JsZClcbiAgICAgICAgICAgICAgICAgICAgdmVydHMucHVzaCB2ZXJ0XG5cblxuICAgICAgICByZXR1cm4gdmVydHNcblxuICAgIGdyb3VwTG9hZGVkOiA9PlxuXG4gICAgICAgIEBvYmplY3RzWydsZXR0ZXItdyddLnJvdGF0aW9uLnkgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKDkwKVxuICAgICAgICBAYXBwbHlNYXRlcmlhbFByb3BlcnRpZXMoKVxuXG4gICAgICAgIEBjcmVhdGVBbmltYXRpb25Db21wb25lbnRzKClcbiAgICAgICAgQGNyZWF0ZUFuaW1hdGlvbnMoKVxuXG4gICAgICAgIHN1cGVyKClcblxuXG4gICAgY3JlYXRlQW5pbWF0aW9uQ29tcG9uZW50czogLT5cbiAgICAgICAgQGNvbXBvbmVudHNbJ3gyLXNoYWZ0J10gPVxuICAgICAgICAgICAgcmluZzA6QG9iamVjdHNbJ3JpbmctMCddXG4gICAgICAgICAgICByaW5nMTpAb2JqZWN0c1sncmluZy0xJ11cbiAgICAgICAgICAgIHJpbmcyOkBvYmplY3RzWydyaW5nLTInXVxuICAgICAgICAgICAgcmluZ1dpZGU6QG9iamVjdHNbJ3Jpbmctd2lkZSddXG5cbiAgICAgICAgQGNvbXBvbmVudHNbJ2NhcmJvbi1maWJlciddID1cbiAgICAgICAgICAgIHdpcmVmcmFtZTpAb2JqZWN0c1snd2lyZWZyYW1lLWxvbmcnXVxuICAgICAgICAgICAgcGxhdGU6QG9iamVjdHNbJ3BsYXRlLXNob3J0J11cblxuXG5cblxuICAgICAgICBAY29tcG9uZW50c1snc3Bpbi1lZmZlY3QnXSA9XG4gICAgICAgICAgICBzdGFsazpAb2JqZWN0c1snc3RhbGsnXVxuICAgICAgICAgICAgaGVsaXg6QG9iamVjdHNbJ2hlbGl4J11cblxuXG4gICAgICAgIEBjb21wb25lbnRzWydwYXJhbGxlbC1kcmlsbGluZyddID1cbiAgICAgICAgICAgIGRpc2NzOltcbiAgICAgICAgICAgICAgICBAb2JqZWN0c1snZGlzYy1pbm5lciddXG4gICAgICAgICAgICAgICAgQG9iamVjdHNbJ2Rpc2MtbWlkZGxlJ11cbiAgICAgICAgICAgICAgICBAb2JqZWN0c1snZGlzYy1vdXRlciddXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgZGlzY0xpbmVzOltcbiAgICAgICAgICAgICAgICBAb2JqZWN0c1snZGlzYy1saW5lLTEnXVxuICAgICAgICAgICAgICAgIEBvYmplY3RzWydkaXNjLWxpbmUtMiddXG4gICAgICAgICAgICAgICAgQG9iamVjdHNbJ2Rpc2MtbGluZS0zJ11cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICByZWRMaW5lczpbXG4gICAgICAgICAgICAgICAgQG9iamVjdHNbJ3JlZC1saW5lLTEnXVxuICAgICAgICAgICAgICAgIEBvYmplY3RzWydyZWQtbGluZS0yJ11cbiAgICAgICAgICAgICAgICBAb2JqZWN0c1sncmVkLWxpbmUtMyddXG4gICAgICAgICAgICBdXG4gICAgICAgICAgICBiYWxsOkBvYmplY3RzWyd0ZW5uaXMtYmFsbCddXG5cblxuXG4gICAgY3JlYXRlQW5pbWF0aW9uczogLT5cblxuICAgICAgICBAYW5pbWF0aW9uc1sneDItc2hhZnQnXSA9IEFuaW1hdGlvbnNbJ3gyLXNoYWZ0J10uZ2V0QW5pbWF0aW9uIEBjb21wb25lbnRzWyd4Mi1zaGFmdCddXG4gICAgICAgIEBhbmltYXRpb25zWydwYXJhbGxlbC1kcmlsbGluZyddID0gQW5pbWF0aW9uc1sncGFyYWxsZWwtZHJpbGxpbmcnXS5nZXRBbmltYXRpb24gQGNvbXBvbmVudHNbJ3BhcmFsbGVsLWRyaWxsaW5nJ11cbiAgICAgICAgQGFuaW1hdGlvbnNbJ3NwaW4tZWZmZWN0J10gPSBBbmltYXRpb25zWydzcGluLWVmZmVjdCddLmdldEFuaW1hdGlvbiBAY29tcG9uZW50c1snc3Bpbi1lZmZlY3QnXVxuICAgICAgICBAYW5pbWF0aW9uc1snY2FyYm9uLWZpYmVyJ10gPSBBbmltYXRpb25zWydjYXJib24tZmliZXInXS5nZXRBbmltYXRpb24gQGNvbXBvbmVudHNbJ2NhcmJvbi1maWJlciddXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFja2V0T2JqZWN0XG4iLCJjbGFzcyBSYWNrZXRDYW1lcmEgZXh0ZW5kcyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYVxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKVxuICAgICAgICBzdXBlcihhcmd1bWVudHMpXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFja2V0Q2FtZXJhXG5cblxuXG4iLCJcblV0aWxzID0gcmVxdWlyZSAnLi4vLi4vLi4vdXRpbHMvY29tbW9uLmNvZmZlZSdcblJhY2tldE9iamVjdCA9IHJlcXVpcmUgJy4vLi4vb2JqZWN0cy9SYWNrZXRPYmplY3QuY29mZmVlJ1xuQXBwTW9kZWwgPSByZXF1aXJlICcuLy4uLy4uLy4uL21vZGVscy9BcHBNb2RlbC5jb2ZmZWUnXG5cbkRlZmF1bHRGT1YgPSA3MFxuY2xhc3MgUmFja2V0U2NlbmVcblxuICAgIGNvbnN0cnVjdG9yOiAod2lkdGgsIGhlaWdodCxtb2RlbCxlbCkgLT5cblxuICAgICAgICBfLmV4dGVuZChALCBCYWNrYm9uZS5FdmVudHMpXG5cbiAgICAgICAgQGFwcE1vZGVsID0gQXBwTW9kZWwuZ2V0SW5zdGFuY2UoKVxuXG4gICAgICAgIEBlbCA9IGVsXG4gICAgICAgIEBtb2RlbCA9IG1vZGVsXG4gICAgICAgIEBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG4gICAgICAgIEBzY2VuZS5wb3NpdGlvbi55ID0gLThcblxuICAgICAgICBAZm92ID0gRGVmYXVsdEZPVlxuICAgICAgICBAY2FtZXJhID0gd2luZG93LmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSggQGZvdiwgd2lkdGgvaGVpZ2h0LCAwLjEsIDEwMDAgKVxuICAgICAgICBAbGlnaHRzID0ge31cblxuXG4gICAgcmVzaXplOiAod2lkdGgsIGhlaWdodCkgLT5cbiAgICAgICAgQGNhbWVyYS5hc3BlY3QgPSB3aWR0aC9oZWlnaHRcbiAgICAgICAgQGZvdlJhdGlvID0gaWYgKDEwMjQvd2lkdGgpIDw9IDEgdGhlbiAxIGVsc2UgKDEwMjQvd2lkdGgpXG5cbiAgICAgICAgQGFwcE1vZGVsLnNldCBcIndpZHRoQWRqdXN0XCIgLCBAZm92UmF0aW8gLSAxXG5cbiAgICAgICAgQHNldENhbWVyYUZvdiBAZm92ICwgdHJ1ZVxuXG5cbiAgICBhZGQ6IChvYmopID0+XG4gICAgICAgIEBzY2VuZS5hZGQob2JqKVxuXG4gICAgaW5pdGlhbGl6ZTogLT5cblxuXG5cbiAgICAgICAgQGNhbWVyYS5wb3NpdGlvbi56ID0gNzVcbiAgICAgICAgQGNhbWVyYS5wb3NpdGlvbi54ID0gMFxuICAgICAgICBAY2FtZXJhLnBvc2l0aW9uLnkgPSAwXG5cbiAgICAgICAgQGN1YmVNYXAgPSBVdGlscy5tYWtlQ3ViZU1hcCBAbW9kZWwuZW52aXJvbm1lbnRcblxuXG4gICAgICAgIEByYWNrZXRPYmplY3QgPSB3aW5kb3cucmFja2V0T2JqZWN0ID0gbmV3IFJhY2tldE9iamVjdFxuICAgICAgICAgICAgZW52Q3ViZTogQGN1YmVNYXBcbiAgICAgICAgQHJhY2tldE9iamVjdC5vbiBcIm9iamVjdExvYWRlZFwiICwgQHJhY2tldExvYWRlZFxuICAgICAgICBAcmFja2V0T2JqZWN0LmxvYWQgQG1vZGVsLm9iamVjdHNbMF1cblxuICAgICAgICAjQHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gICAgICAgICNAc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgICNAc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICAgICAgI0BlbC5hcHBlbmRDaGlsZCggQHN0YXRzLmRvbUVsZW1lbnQgKTtcblxuXG5cbiAgICAgICAgQGFkZExpZ2h0cygpXG5cbiAgICByYWNrZXRMb2FkZWQ6IChvYmopID0+XG5cblxuXG4gICAgICAgIEByYWNrZXQgPSB3aW5kb3cucmFja2V0ID0gb2JqXG4gICAgICAgIEBhZGQgb2JqXG5cblxuXG4gICAgICAgIGZvciBrLGxpZ2h0IG9mIEBsaWdodHNcbiAgICAgICAgICAgIGlmIGxpZ2h0LnR5cGUgaXMgXCJTcG90TGlnaHRcIiBvciBsaWdodC50eXBlIGlzIFwiRGlyZWN0aW9uYWxMaWdodFwiXG4gICAgICAgICAgICAgICAgbGlnaHQudGFyZ2V0ID0gQHJhY2tldFxuXG5cbiAgICAgICAgI0dpdmUgaXQgMS8xMCBvZiBhIHNlY29uZCB0byBmaWd1cmUgb3V0IGl0cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgc2NlbmUuXG4gICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICAgIEB0cmlnZ2VyIFwicmFja2V0TG9hZGVkXCJcbiAgICAgICAgICAgIEB0cmlnZ2VyIFwicmFja2V0TW92aW5nVXBkYXRlXCIsIHt0eXBlOlwicmFja2V0TW92aW5nVXBkYXRlXCJ9XG4gICAgICAgICxcbiAgICAgICAgICAgIDEwMFxuXG5cblxuICAgIGNvbnRyb2xSb3RhdGlvbjogKGRhdGEpIC0+XG5cbiAgICAgICAgeEF4aXMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLDAsMClcbiAgICAgICAgcm90YXRpb25BbW91bnRYID0gVEhSRUUuTWF0aC5kZWdUb1JhZCgtZGF0YS52ZWxZKVxuICAgICAgICB5QXhpcyA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsMSwwKVxuICAgICAgICByb3RhdGlvbkFtb3VudFkgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKC1kYXRhLnZlbFgpXG5cblxuICAgICAgICBpZiBAcmFja2V0P1xuICAgICAgICAgICAgQHJvdGF0ZUFyb3VuZFdvbGRBeGlzKEByYWNrZXQsIHhBeGlzLCByb3RhdGlvbkFtb3VudFgpXG4gICAgICAgICAgICBAcm90YXRlQXJvdW5kV29sZEF4aXMoQHJhY2tldCwgeUF4aXMsIHJvdGF0aW9uQW1vdW50WSlcbiAgICAgICAgICAgIEB0cmlnZ2VyIFwicmFja2V0TW92aW5nVXBkYXRlXCIgLCB7dHlwZTpcInJhY2tldE1vdmluZ1VwZGF0ZVwifSAsIHRydWVcblxuICAgICAgICAgICAgaWYgQGN1cnJlbnRIb3RzcG90P1xuXG4gICAgICAgICAgICAgICAgQHJlc2V0SG90c3BvdCgpXG5cblxuXG5cblxuICAgIGdldEhvdHNwb3RzUG9zaXRpb25zOiAtPlxuICAgICAgICB2ZXJ0cyA9IEByYWNrZXRPYmplY3QuZ2V0SG90c3BvdHMoQG1vZGVsLmhvdHNwb3RzKVxuICAgICAgICBocyA9IHt9XG4gICAgICAgIGZvciB2ZXJ0LGkgaW4gdmVydHNcbiAgICAgICAgICAgIGhzW3ZlcnQuX19pZF0gPSBAY2FsYzJkKHZlcnQpXG5cbiAgICAgICAgcmV0dXJuIGhzXG5cblxuXG4gICAgcm90YXRlQXJvdW5kV29sZEF4aXM6IChvYmplY3QsIGF4aXMsIHJhZGlhbnMpLT5cbiAgICAgICAgQHJvdFdvcmxkID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuICAgICAgICBAcm90V29ybGQubWFrZVJvdGF0aW9uQXhpcyhheGlzLm5vcm1hbGl6ZSgpLCByYWRpYW5zKVxuICAgICAgICBAcm90V29ybGQubXVsdGlwbHkob2JqZWN0Lm1hdHJpeClcbiAgICAgICAgb2JqZWN0Lm1hdHJpeCA9IEByb3RXb3JsZDtcbiAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldEZyb21Sb3RhdGlvbk1hdHJpeChAcmFja2V0Lm1hdHJpeClcblxuXG5cblxuICAgIHJlbmRlck9wZXJhdGlvbjogPT5cblxuXG5cblxuXG4gICAgYWRkTGlnaHRzOiAtPlxuXG4gICAgICAgICNAbGlnaHRzWydhbWJpZW50J10gPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0IDB4MmIyYjJiXG5cbiAgICAgICAgZExpZ2h0SW50ZW5zaXR5ID0gLjRcblxuICAgICAgICBAbGlnaHRzWydwTGlnaHQxJ10gPSBuZXcgVEhSRUUuUG9pbnRMaWdodCAweGZmZmZmZiAsIDIsIDEwMDBcbiAgICAgICAgQGxpZ2h0c1sncExpZ2h0MSddLnBvc2l0aW9uLnNldCgwLC0yMDAsMClcblxuXG5cbiAgICAgICAgQGxpZ2h0c1snZExpZ2h0MSddID0gbmV3IFRIUkVFLlNwb3RMaWdodCAweGZmZmZmZiAsIGRMaWdodEludGVuc2l0eVxuICAgICAgICBAbGlnaHRzWydkTGlnaHQxJ10ucG9zaXRpb24uc2V0KDAsMjUwLDI1MClcbiAgICAgICAgI0BsaWdodHNbJ2RMaWdodDEnXS5saWdodEhlbHBlciA9IG5ldyBUSFJFRS5TcG90TGlnaHRIZWxwZXIoIEBsaWdodHNbJ2RMaWdodDEnXSwgNTApXG5cbiAgICAgICAgQGxpZ2h0c1snZExpZ2h0MiddID0gbmV3IFRIUkVFLlNwb3RMaWdodCAweGZmZmZmZiAsIGRMaWdodEludGVuc2l0eVxuICAgICAgICBAbGlnaHRzWydkTGlnaHQyJ10ucG9zaXRpb24uc2V0KDAsMjUwLC0yNTApXG5cbiAgICAgICAgQGxpZ2h0c1snZExpZ2h0MyddID0gbmV3IFRIUkVFLlNwb3RMaWdodCAweGZmZmZmZiAsIGRMaWdodEludGVuc2l0eVxuICAgICAgICBAbGlnaHRzWydkTGlnaHQzJ10ucG9zaXRpb24uc2V0KC0yNTAsMjUwLDApXG5cbiAgICAgICAgQGxpZ2h0c1snZExpZ2h0NCddID0gbmV3IFRIUkVFLlNwb3RMaWdodCAweGZmZmZmZiAsIGRMaWdodEludGVuc2l0eVxuICAgICAgICBAbGlnaHRzWydkTGlnaHQ0J10ucG9zaXRpb24uc2V0KDI1MCwyNTAsMClcblxuICAgICAgICAjQGxpZ2h0c1snZExpZ2h0MiddLmxpZ2h0SGVscGVyID0gbmV3IFRIUkVFLlNwb3RMaWdodEhlbHBlciggQGxpZ2h0c1snZExpZ2h0MiddLCA1MClcbiAgICAgICAgI2RMaWdodDIudGFyZ2V0ID0gQG9iamVjdFxuXG5cbiAgICAgICAgZm9yIGssdiBvZiBAbGlnaHRzXG4gICAgICAgICAgICB2LmNhc3RTaGFkb3cgPSB0cnVlXG4gICAgICAgICAgICBAc2NlbmUuYWRkIHZcblxuXG4gICAgY2FsYzJkOiAocG9pbnQpLT5cblxuXG4gICAgICAgIHogPSBwb2ludC56XG4gICAgICAgIHZlY3RvciA9IHBvaW50LnByb2plY3QoQGNhbWVyYSlcbiAgICAgICAgcmVzdWx0ID0gbmV3IE9iamVjdCgpXG5cbiAgICAgICAgaGFsZldpZHRoID0gQHJlbmRlcmVyLmRvbUVsZW1lbnQud2lkdGgvMlxuICAgICAgICBoYWxmSGVpZ2h0ID0gQHJlbmRlcmVyLmRvbUVsZW1lbnQuaGVpZ2h0LzJcbiAgICAgICAgcmVzdWx0LnggPSAodmVjdG9yLnggKSAqIGhhbGZXaWR0aCArIGhhbGZXaWR0aFxuICAgICAgICByZXN1bHQueSA9ICgtdmVjdG9yLnkpICogaGFsZkhlaWdodCArIGhhbGZIZWlnaHRcbiAgICAgICAgcmVzdWx0LnogPSB6XG5cbiAgICAgICAgcmVzdWx0XG5cbiAgICByZXNldEhvdHNwb3Q6IC0+XG4gICAgICAgIEByZXNldEhvdHNwb3RBbmltYXRpb24oKVxuXG5cbiAgICAgICAgQGN1cnJlbnRIb3RzcG90ID0gbnVsbFxuICAgICAgICBAZm92ID0gRGVmYXVsdEZPVlxuXG4gICAgICAgIHRsID0gQGdlbmVyYXRlVHJhbnNpdGlvblRpbWVsaW5lKClcblxuICAgICAgICBjYW1lcmEgPSBAc2V0Q2FtZXJhRm92KEBmb3YpXG4gICAgICAgIHBvc2l0aW9uID0gQHNldFJhY2tldFBvc2l0aW9uXG4gICAgICAgICAgICB4OjBcbiAgICAgICAgICAgIHk6MFxuICAgICAgICAgICAgejowXG5cbiAgICAgICAgdGwuYWRkIFtjYW1lcmEscG9zaXRpb25dXG5cblxuICAgIHJlc2V0SG90c3BvdEFuaW1hdGlvbjogLT5cbiAgICAgICAgaWYgQHJhY2tldE9iamVjdC5hbmltYXRpb25zW0BjdXJyZW50SG90c3BvdF0/XG4gICAgICAgICAgICBAcmFja2V0T2JqZWN0LmFuaW1hdGlvbnNbQGN1cnJlbnRIb3RzcG90XS50aW1lU2NhbGUoMylcbiAgICAgICAgICAgIEByYWNrZXRPYmplY3QuYW5pbWF0aW9uc1tAY3VycmVudEhvdHNwb3RdLnJldmVyc2UoKVxuXG5cbiAgICBzZXRDYW1lcmFGb3Y6IChmb3YgLCBqdW1wKSAtPlxuICAgICAgICBpZiAhanVtcFxuICAgICAgICAgICAgcmV0dXJuIFR3ZWVuTWF4LnRvIEBjYW1lcmEgLCAyICxcbiAgICAgICAgICAgICAgICBmb3Y6Zm92ICogQGZvdlJhdGlvXG4gICAgICAgICAgICAgICAgb25VcGRhdGU6ID0+XG4gICAgICAgICAgICAgICAgICAgIEBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBjYW1lcmEuZm92ID0gZm92ICogQGZvdlJhdGlvXG4gICAgICAgICAgICBAY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKVxuXG5cblxuICAgIHNldFJhY2tldFJvdGF0aW9uOiAocm90YXRpb24pIC0+XG4gICAgICAgIHJldHVybiBUd2Vlbk1heC50byBAcmFja2V0LnJvdGF0aW9uICwgMiAsXG4gICAgICAgICAgICBlYXNlOkN1YmljLmVhc2VJbk91dFxuICAgICAgICAgICAgeDpyb3RhdGlvbi54XG4gICAgICAgICAgICB5OnJvdGF0aW9uLnlcbiAgICAgICAgICAgIHo6cm90YXRpb24uelxuXG4gICAgc2V0UmFja2V0UG9zaXRpb246ICh0cmFuc2xhdGUpIC0+XG4gICAgICAgIHJldHVybiBUd2Vlbk1heC50byBAcmFja2V0LnBvc2l0aW9uICwgMiAsXG4gICAgICAgICAgICBlYXNlOkN1YmljLmVhc2VJbk91dFxuICAgICAgICAgICAgeDp0cmFuc2xhdGUueFxuICAgICAgICAgICAgeTp0cmFuc2xhdGUueVxuICAgICAgICAgICAgejp0cmFuc2xhdGUuelxuXG5cblxuXG4gICAgbW92ZVJhY2tldDogKGRhdGEpIC0+XG5cbiAgICAgICAgQHJlc2V0SG90c3BvdEFuaW1hdGlvbigpXG5cbiAgICAgICAgdGwgPSBAZ2VuZXJhdGVUcmFuc2l0aW9uVGltZWxpbmUoKVxuXG4gICAgICAgIEBjdXJyZW50SG90c3BvdCA9IGRhdGEuaWRcbiAgICAgICAgQGZvdiA9IGRhdGEuZm92XG5cbiAgICAgICAgY2FtZXJhID0gQHNldENhbWVyYUZvdihAZm92KVxuXG4gICAgICAgIHRyYW5zbGF0ZSA9IEBzZXRSYWNrZXRQb3NpdGlvbihkYXRhLnRyYW5zbGF0ZSlcblxuICAgICAgICByb3RhdGUgPSBAc2V0UmFja2V0Um90YXRpb24oZGF0YS5yb3RhdGlvbilcblxuXG5cblxuICAgICAgICB0bC5hZGQgW2NhbWVyYSx0cmFuc2xhdGUscm90YXRlXVxuICAgICAgICB0bC5hZGRDYWxsYmFjayA9PlxuICAgICAgICAgICAgaWYgQHJhY2tldE9iamVjdC5hbmltYXRpb25zW0BjdXJyZW50SG90c3BvdF0/XG4gICAgICAgICAgICAgICAgQHJhY2tldE9iamVjdC5hbmltYXRpb25zW0BjdXJyZW50SG90c3BvdF0udGltZVNjYWxlKDEpXG4gICAgICAgICAgICAgICAgQHJhY2tldE9iamVjdC5hbmltYXRpb25zW0BjdXJyZW50SG90c3BvdF0ucGxheSgpXG5cblxuICAgIGdlbmVyYXRlVHJhbnNpdGlvblRpbWVsaW5lOiAtPlxuXG4gICAgICAgIHJldHVybiBuZXcgVGltZWxpbmVNYXhcbiAgICAgICAgICAgIG9uU3RhcnQ6ID0+XG4gICAgICAgICAgICAgICAgQHRyaWdnZXIgXCJyYWNrZXRNb3ZpbmdTdGFydFwiICwge3R5cGU6XCJyYWNrZXRNb3ZpbmdTdGFydFwifVxuICAgICAgICAgICAgb25VcGRhdGU6ID0+XG4gICAgICAgICAgICAgICAgQHRyaWdnZXIgXCJyYWNrZXRNb3ZpbmdVcGRhdGVcIiwge3R5cGU6XCJyYWNrZXRNb3ZpbmdVcGRhdGVcIn1cblxuXG5cbiAgICAgICAgICAgIG9uQ29tcGxldGU6ID0+XG4gICAgICAgICAgICAgICAgaWYgQGN1cnJlbnRIb3RzcG90XG4gICAgICAgICAgICAgICAgICAgIEB0cmlnZ2VyIFwicmFja2V0TW92aW5nQ29tcGxldGVcIiwge3R5cGU6XCJyYWNrZXRNb3ZpbmdDb21wbGV0ZVwifVxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhY2tldFNjZW5lXG5cblxuXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChkYXRhLCB1bmRlZmluZWQsIG1vbWVudCkge1xudmFyIHR5cGUgPSBkYXRhLmdldCgndHlwZScpXG52YXIgaW5kZXggPSBkYXRhLmdldCgncG9zdF9pZCcpLmluZGV4T2YoJ18nKVxudmFyIHBvc3RJRCA9IGRhdGEuZ2V0KCdwb3N0X2lkJykuc3Vic3RyaW5nKGluZGV4ICsgMSlcbmlmICggdHlwZSA9PT0gJ3Bob3RvJylcbntcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtZGF0ZVwiLCBcIlwiICsgKGRhdGEuZ2V0KCdkYXRlJykpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJpdGVtIHNxdWFyZVxcXCI+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL1wiICsgKGRhdGEuZ2V0KCdmcm9tJykuaWQpICsgXCIvcG9zdHMvXCIgKyBwb3N0SUQsIHRydWUsIGZhbHNlKSkgKyBcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgXCJcIiArIChkYXRhLmdldCgncG9zdF9pZCcpKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS10eXBlXCIsIFwiXCIgKyAoZGF0YS5nZXQoJ3Bvc3RfdHlwZScpICkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcInN0eWxlXCIsIFwiYmFja2dyb3VuZDp1cmwoJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL1wiICsgKGRhdGEuZ2V0KCdvYmplY3RfaWQnKSkgKyBcIi9waWN0dXJlP3R5cGU9bm9ybWFsJyk7XCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5jbHMoWydzcXVhcmUtcG9zdCcsJ2ZhY2Vib29rJywoZGF0YS5nZXQoJ2ZlYXR1cmVkJykgPyAnbGFyZ2UnIDogJ3NtYWxsJyldLCBbbnVsbCxudWxsLHRydWVdKSkgKyBcIj48ZGl2IGNsYXNzPVxcXCJob3Zlci1vdmVybGF5XFxcIj5cIik7XG5pZiAoIGRhdGEuZ2V0KCdtZXNzYWdlJykgIT09IHVuZGVmaW5lZClcbntcbmJ1Zi5wdXNoKFwiPHAgY2xhc3M9XFxcImNhcHRpb25cXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGRhdGEuZ2V0KCdtZXNzYWdlJykpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvcD5cIik7XG59XG5idWYucHVzaChcIjwvZGl2PjwvZGl2PjwvYT48L2Rpdj5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWRhdGVcIiwgXCJcIiArIChkYXRhLmdldCgnZGF0ZScpKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiaXRlbVxcXCI+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL1wiICsgKGRhdGEuZ2V0KCdmcm9tJykuaWQpICsgXCIvcG9zdHMvXCIgKyBwb3N0SUQsIHRydWUsIGZhbHNlKSkgKyBcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtZGF0ZVwiLCBcIlwiICsgKGRhdGEuZ2V0KCdkYXRlJykpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIFwiXCIgKyAoZGF0YS5nZXQoJ3Bvc3RfaWQnKSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtdHlwZVwiLCBcIlwiICsgKGRhdGEuZ2V0KCdwb3N0X3R5cGUnKSApICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ0ZXh0LXBvc3QgZmFjZWJvb2tcXFwiPjxkaXYgY2xhc3M9XFxcImltZ1xcXCI+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCAnaHR0cDovL2dyYXBoLmZhY2Vib29rLmNvbS8nICsgKGRhdGEuZ2V0KFwiZnJvbVwiKS5pZCkgKyAnL3BpY3R1cmU/dHlwZT1ub3JtYWwmaGVpZ2h0PTEwMCZ3aWR0aD0xMDAnLCB0cnVlLCBmYWxzZSkpICsgXCIvPjwvZGl2PjxkaXYgY2xhc3M9XFxcInF1b3RlXFxcIj48cD48ZW0gY2xhc3M9XFxcIm9wZW4tcXVvdGVcXFwiPiZsZHF1bzs8L2VtPjxzcGFuIGNsYXNzPVxcXCJwb3N0LWJvZHlcXFwiPlwiICsgKCgoamFkZV9pbnRlcnAgPSBkYXRhLmdldChcIm1lc3NhZ2VcIikpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj48ZW0gY2xhc3M9XFxcImNsb3NlLXF1b3RlXFxcIj4mcmRxdW87PC9lbT48L3A+PC9kaXY+PGRpdiBjbGFzcz1cXFwic2lnbmF0dXJlXFxcIj48cCBjbGFzcz1cXFwidXNlcm5hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGRhdGEuZ2V0KFwiZnJvbVwiKS5uYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3A+PHAgY2xhc3M9XFxcImRhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG1vbWVudChkYXRhLmdldChcImRhdGVcIikpLmZyb21Ob3coKSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9wPjwvZGl2PjwvZGl2PjwvYT48L2Rpdj5cIik7XG59fS5jYWxsKHRoaXMsXCJkYXRhXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5kYXRhOnR5cGVvZiBkYXRhIT09XCJ1bmRlZmluZWRcIj9kYXRhOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQsXCJtb21lbnRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm1vbWVudDp0eXBlb2YgbW9tZW50IT09XCJ1bmRlZmluZWRcIj9tb21lbnQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoZGF0YSwgdW5kZWZpbmVkKSB7XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWRhdGVcIiwgXCJcIiArIChkYXRhLmdldCgnZGF0ZScpKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiaXRlbVxcXCI+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiXCIgKyAoZGF0YS5nZXQoJ2xpbmsnKSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIFwiXCIgKyAoZGF0YS5nZXQoJ3Bvc3RfaWQnKSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtdHlwZVwiLCBcIlwiICsgKGRhdGEuZ2V0KCdwb3N0X3R5cGUnKSApICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQ6dXJsKCBcIiArICggZGF0YS5nZXQoJ2ltYWdlcycpLnN0YW5kYXJkX3Jlc29sdXRpb24udXJsKSArIFwiICk7XCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5jbHMoWydzcXVhcmUtcG9zdCcsJ2luc3RhZ3JhbScsKGRhdGEuZ2V0KCdmZWF0dXJlZCcpID8gJ2xhcmdlJyA6ICdzbWFsbCcpXSwgW251bGwsbnVsbCx0cnVlXSkpICsgXCI+PGRpdiBjbGFzcz1cXFwiaG92ZXItb3ZlcmxheVxcXCI+XCIpO1xuaWYgKCBkYXRhLmdldCgnY2FwdGlvbicpICE9PSB1bmRlZmluZWQpXG57XG5idWYucHVzaChcIjxwIGNsYXNzPVxcXCJjYXB0aW9uXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBkYXRhLmdldCgnY2FwdGlvbicpLnRleHQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvcD5cIik7XG59XG5idWYucHVzaChcIjwvZGl2PjwvZGl2PjwvYT48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJkYXRhXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5kYXRhOnR5cGVvZiBkYXRhIT09XCJ1bmRlZmluZWRcIj9kYXRhOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChkYXRhLCB1bmRlZmluZWQsIG1vbWVudCkge1xudmFyIHRleHQgPSBkYXRhLmdldCgndGV4dCcpXG52YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGhcbnZhciBpZF9zdHJpbmcgPSBkYXRhLmdldCgnaWRfc3RyJylcbnZhciB1c2VyX2lkID0gZGF0YS5nZXQoJ3VzZXInKS5pZF9zdHIgXG5pZiAoIGRhdGEuZ2V0KCdpZF9zdHInKSAhPT0gdW5kZWZpbmVkKVxue1xudmFyIHVybCA9ICdodHRwOi8vdHdpdHRlci5jb20vJyArIGRhdGEuZ2V0KCd1c2VyJykuaWRfc3RyICsgJy9zdGF0dXMvJyArIGRhdGEuZ2V0KCdpZF9zdHInKVxufVxuZWxzZVxue1xudmFyIHVybCA9IFwiaHR0cHM6Ly90LmNvL1wiICsgdGV4dC5zdWJzdHJpbmcoKGxlbmd0aCAtIDEwKSwgKGxlbmd0aCkpXG59XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWRhdGVcIiwgXCJcIiArIChkYXRhLmdldCgnZGF0ZScpKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBcIlwiICsgKGRhdGEuZ2V0KCdwb3N0X2lkJykpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJkYXRhLXR5cGVcIiwgXCJcIiArIChkYXRhLmdldCgncG9zdF90eXBlJykgKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiaXRlbVxcXCI+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIHVybCwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj48ZGl2IGNsYXNzPVxcXCJ0d2l0dGVyIHRleHQtcG9zdFxcXCI+PGRpdiBjbGFzcz1cXFwiaW1nXFxcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsICcnICsgKGRhdGEuZ2V0KFwidXNlclwiKS5wcm9maWxlX2ltYWdlX3VybCkgKyAnJywgdHJ1ZSwgZmFsc2UpKSArIFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJxdW90ZVxcXCI+PHA+PGVtIGNsYXNzPVxcXCJvcGVuLXF1b3RlXFxcIj4mbGRxdW87PC9lbT48c3BhbiBjbGFzcz1cXFwicG9zdC1ib2R5XFxcIj5cIiArICgoKGphZGVfaW50ZXJwID0gZGF0YS5nZXQoXCJ0ZXh0XCIpKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PGVtIGNsYXNzPVxcXCJjbG9zZS1xdW90ZVxcXCI+JnJkcXVvOzwvZW0+PC9wPjwvZGl2PjxkaXYgY2xhc3M9XFxcInNpZ25hdHVyZVxcXCI+PHAgY2xhc3M9XFxcInVzZXJuYW1lXFxcIj5AXCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gZGF0YS5nZXQoXCJ1c2VyXCIpLm5hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvcD48cCBjbGFzcz1cXFwiZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbW9tZW50KGRhdGEuZ2V0KFwiZGF0ZVwiKSkuZnJvbU5vdygpKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3A+PC9kaXY+PC9kaXY+PC9hPjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImRhdGFcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmRhdGE6dHlwZW9mIGRhdGEhPT1cInVuZGVmaW5lZFwiP2RhdGE6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCxcIm1vbWVudFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubW9tZW50OnR5cGVvZiBtb21lbnQhPT1cInVuZGVmaW5lZFwiP21vbWVudDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbmJ1Zi5wdXNoKFwiPGdcIiArIChqYWRlLmF0dHIoXCJpZFwiLCBcImhvdHNwb3QyLVwiICsgKGlkKSArIFwiXCIgKyAoaW5kZXggPyBpbmRleCA6ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBcIlwiICsgKGlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiY29udGVudC1ob3RzcG90XFxcIj48ZyBjbGFzcz1cXFwiZ3JheS1jaXJjbGVcXFwiPjxjaXJjbGUgc3Ryb2tlPVxcXCIjM2MzYzNjXFxcIiBzdHJva2Utd2lkdGg9XFxcIjRcXFwiIGN4PVxcXCIwXFxcIiBjeT1cXFwiMFxcXCIgcj1cXFwiMTBweFxcXCIgZmlsbD1cXFwidHJhbnNwYXJlbnRcXFwiPjwvY2lyY2xlPjwvZz48ZyBjbGFzcz1cXFwicGx1cy1zaWduXFxcIj48Zz48cmVjdCB3aWR0aD1cXFwiMnB4XFxcIiBoZWlnaHQ9XFxcIjhweFxcXCIgZmlsbD1cXFwiIzJjMmMyY1xcXCIgY2xhc3M9XFxcInZcXFwiPjwvcmVjdD48cmVjdCB3aWR0aD1cXFwiOHB4XFxcIiBoZWlnaHQ9XFxcIjJweFxcXCIgZmlsbD1cXFwiIzJjMmMyY1xcXCIgY2xhc3M9XFxcImhcXFwiPjwvcmVjdD48L2c+PC9nPjxnIGNsYXNzPVxcXCJncmF5LXN0cm9rZVxcXCI+PGNpcmNsZSBzdHJva2U9XFxcIiMyYzJjMmNcXFwiIHN0cm9rZS13aWR0aD1cXFwiNFxcXCIgY3g9XFxcIjBcXFwiIGN5PVxcXCIwXFxcIiByPVxcXCIxOXB4XFxcIiBmaWxsPVxcXCJ0cmFuc3BhcmVudFxcXCI+PC9jaXJjbGU+PC9nPjwvZz5cIik7fS5jYWxsKHRoaXMsXCJpZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaWQ6dHlwZW9mIGlkIT09XCJ1bmRlZmluZWRcIj9pZDp1bmRlZmluZWQsXCJpbmRleFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5kZXg6dHlwZW9mIGluZGV4IT09XCJ1bmRlZmluZWRcIj9pbmRleDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpZCkge1xuYnVmLnB1c2goXCI8Z1wiICsgKGphZGUuYXR0cihcImlkXCIsIFwiaG90c3BvdC1cIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgXCJcIiArIChpZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImhvdHNwb3RcXFwiPjxnIGNsYXNzPVxcXCJvcmFuZ2UtY2lyY2xlXFxcIj48Y2lyY2xlIHN0cm9rZT1cXFwiI0Y0Q0UyMVxcXCIgc3Ryb2tlLXdpZHRoPVxcXCI2XFxcIiBjeD1cXFwiMFxcXCIgY3k9XFxcIjBcXFwiIHI9XFxcIjEycHhcXFwiIGZpbGw9XFxcIiNGRjZDMDBcXFwiPjwvY2lyY2xlPjwvZz48ZyBjbGFzcz1cXFwicGx1cy1zaWduXFxcIj48Zz48cmVjdCB3aWR0aD1cXFwiMnB4XFxcIiBoZWlnaHQ9XFxcIjhweFxcXCIgZmlsbD1cXFwiI2ZmZmZmZlxcXCIgY2xhc3M9XFxcInZcXFwiPjwvcmVjdD48cmVjdCB3aWR0aD1cXFwiOHB4XFxcIiBoZWlnaHQ9XFxcIjJweFxcXCIgZmlsbD1cXFwiI2ZmZmZmZlxcXCIgY2xhc3M9XFxcImhcXFwiPjwvcmVjdD48L2c+PC9nPjxnIGNsYXNzPVxcXCJ5ZWxsb3ctc3Ryb2tlXFxcIj48Y2lyY2xlIHN0cm9rZT1cXFwiI0Y0Q0UyMVxcXCIgc3Ryb2tlLXdpZHRoPVxcXCI0XFxcIiBjeD1cXFwiMFxcXCIgY3k9XFxcIjBcXFwiIHI9XFxcIjE5cHhcXFwiIGZpbGw9XFxcInRyYW5zcGFyZW50XFxcIj48L2NpcmNsZT48L2c+PGcgY2xhc3M9XFxcIndoaXRlLXN0cm9rZVxcXCI+PGNpcmNsZSBjeD1cXFwiMFxcXCIgY3k9XFxcIjBcXFwiIHI9XFxcIjMycHhcXFwiIHN0cm9rZT1cXFwiI2ZmZmZmZlxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxMFxcXCIgZmlsbD1cXFwidHJhbnNwYXJlbnRcXFwiPjwvY2lyY2xlPjwvZz48L2c+XCIpO30uY2FsbCh0aGlzLFwiaWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmlkOnR5cGVvZiBpZCE9PVwidW5kZWZpbmVkXCI/aWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoZGF0YSkge1xuYnVmLnB1c2goXCI8ZGl2IGlkPVxcXCJzcGVjcy1sb2FkZXJcXFwiPjxzdmcgd2lkdGg9XFxcIjE1MHB4XFxcIiBoZWlnaHQ9XFxcIjE1MHB4XFxcIiB2aWV3Qm94PVxcXCIwIDAgMTUwIDE1MFxcXCIgY2xhc3M9XFxcImxvYWRlci1zcGlubmVyXFxcIj48ZyBjbGFzcz1cXFwib3V0ZXJcXFwiPjxjaXJjbGUgcj1cXFwiNjVweFxcXCIgZmlsbD1cXFwidHJhbnNwYXJlbnRcXFwiIHN0cm9rZS13aWR0aD1cXFwiNnB4XFxcIiBzdHJva2U9XFxcIiNmZmZmZmZcXFwiPjwvY2lyY2xlPjwvZz48ZyBjbGFzcz1cXFwibG9hZC1tZXRlclxcXCI+PGNpcmNsZSByPVxcXCI0OHB4XFxcIiBmaWxsPVxcXCJ0cmFuc3BhcmVudFxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxMHB4XFxcIiBzdHJva2U9XFxcIiNGNENFMjFcXFwiPjwvY2lyY2xlPjwvZz48ZyBjbGFzcz1cXFwiaW5uZXJcXFwiPjxjaXJjbGUgcj1cXFwiMzJweFxcXCIgZmlsbD1cXFwiI2ZmNmMwMFxcXCIgc3Ryb2tlLXdpZHRoPVxcXCI2cHhcXFwiIHN0cm9rZT1cXFwiI0Y0Q0UyMVxcXCI+PC9jaXJjbGU+PC9nPjwvc3ZnPjxkaXYgY2xhc3M9XFxcInByb2dyZXNzXFxcIj48c3BhbiBjbGFzcz1cXFwibG9hZGluZ1xcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gZGF0YS5nZXQoJ2NvcHknKS5sb2FkaW5nKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PHNwYW4gY2xhc3M9XFxcImFtb3VudFxcXCI+MDwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsb2FkaW5nLWNvcHlcXFwiPjxzcGFuPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGRhdGEuZ2V0KCdjb3B5JykuaW5pdGlhbGl6aW5nKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PGRpdiBpZD1cXFwic3BlY3MtY3RhXFxcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAoZGF0YS5nZXQoJ2Fzc2V0cycpLmxvYWRlckN0YSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIvPjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImRhdGFcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmRhdGE6dHlwZW9mIGRhdGEhPT1cInVuZGVmaW5lZFwiP2RhdGE6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYuamFkZT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBNZXJnZSB0d28gYXR0cmlidXRlIG9iamVjdHMgZ2l2aW5nIHByZWNlZGVuY2VcclxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcclxuICogYWxsb3dpbmcgZm9yIGFycmF5cyBhbmQgbWVyZ2luZy9qb2luaW5nIGFwcHJvcHJpYXRlbHlcclxuICogcmVzdWx0aW5nIGluIGEgc3RyaW5nLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gYVxyXG4gKiBAcGFyYW0ge09iamVjdH0gYlxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgdmFyIGF0dHJzID0gYVswXTtcclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBhdHRycyA9IG1lcmdlKGF0dHJzLCBhW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhdHRycztcclxuICB9XHJcbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcclxuICB2YXIgYmMgPSBiWydjbGFzcyddO1xyXG5cclxuICBpZiAoYWMgfHwgYmMpIHtcclxuICAgIGFjID0gYWMgfHwgW107XHJcbiAgICBiYyA9IGJjIHx8IFtdO1xyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xyXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGJjKSkgYmMgPSBbYmNdO1xyXG4gICAgYVsnY2xhc3MnXSA9IGFjLmNvbmNhdChiYykuZmlsdGVyKG51bGxzKTtcclxuICB9XHJcblxyXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XHJcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcclxuICAgICAgYVtrZXldID0gYltrZXldO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGE7XHJcbn07XHJcblxyXG4vKipcclxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHZhbFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBudWxscyh2YWwpIHtcclxuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsICE9PSAnJztcclxufVxyXG5cclxuLyoqXHJcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cclxuICpcclxuICogQHBhcmFtIHsqfSB2YWxcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0cy5qb2luQ2xhc3NlcyA9IGpvaW5DbGFzc2VzO1xyXG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcclxuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLm1hcChqb2luQ2xhc3NlcykuZmlsdGVyKG51bGxzKS5qb2luKCcgJykgOiB2YWw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGNsYXNzZXNcclxuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xyXG4gIHZhciBidWYgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcclxuICAgICAgYnVmLnB1c2goZXhwb3J0cy5lc2NhcGUoam9pbkNsYXNzZXMoW2NsYXNzZXNbaV1dKSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XHJcbiAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gJyBjbGFzcz1cIicgKyB0ZXh0ICsgJ1wiJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGF0dHJpYnV0ZS5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXNjYXBlZFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XHJcbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XHJcbiAgICBpZiAodmFsKSB7XHJcbiAgICAgIHJldHVybiAnICcgKyAodGVyc2UgPyBrZXkgOiBrZXkgKyAnPVwiJyArIGtleSArICdcIicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcclxuICAgIHJldHVybiAnICcgKyBrZXkgKyBcIj0nXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpLnJlcGxhY2UoLycvZywgJyZhcG9zOycpICsgXCInXCI7XHJcbiAgfSBlbHNlIGlmIChlc2NhcGVkKSB7XHJcbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICcgJyArIGtleSArICc9XCInICsgdmFsICsgJ1wiJztcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGVzIG9iamVjdC5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcGFyYW0ge09iamVjdH0gZXNjYXBlZFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5leHBvcnRzLmF0dHJzID0gZnVuY3Rpb24gYXR0cnMob2JqLCB0ZXJzZSl7XHJcbiAgdmFyIGJ1ZiA9IFtdO1xyXG5cclxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XHJcblxyXG4gIGlmIChrZXlzLmxlbmd0aCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldXHJcbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcclxuXHJcbiAgICAgIGlmICgnY2xhc3MnID09IGtleSkge1xyXG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XHJcbiAgICAgICAgICBidWYucHVzaCgnICcgKyBrZXkgKyAnPVwiJyArIHZhbCArICdcIicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBidWYucHVzaChleHBvcnRzLmF0dHIoa2V5LCB2YWwsIGZhbHNlLCB0ZXJzZSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVzY2FwZSB0aGUgZ2l2ZW4gc3RyaW5nIG9mIGBodG1sYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5leHBvcnRzLmVzY2FwZSA9IGZ1bmN0aW9uIGVzY2FwZShodG1sKXtcclxuICB2YXIgcmVzdWx0ID0gU3RyaW5nKGh0bWwpXHJcbiAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxyXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxyXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxyXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcclxuICBpZiAocmVzdWx0ID09PSAnJyArIGh0bWwpIHJldHVybiBodG1sO1xyXG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZS10aHJvdyB0aGUgZ2l2ZW4gYGVycmAgaW4gY29udGV4dCB0byB0aGVcclxuICogdGhlIGphZGUgaW4gYGZpbGVuYW1lYCBhdCB0aGUgZ2l2ZW4gYGxpbmVub2AuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcclxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5leHBvcnRzLnJldGhyb3cgPSBmdW5jdGlvbiByZXRocm93KGVyciwgZmlsZW5hbWUsIGxpbmVubywgc3RyKXtcclxuICBpZiAoIShlcnIgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IGVycjtcclxuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XHJcbiAgICBlcnIubWVzc2FnZSArPSAnIG9uIGxpbmUgJyArIGxpbmVubztcclxuICAgIHRocm93IGVycjtcclxuICB9XHJcbiAgdHJ5IHtcclxuICAgIHN0ciA9IHN0ciB8fCBfZGVyZXFfKCdmcycpLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKVxyXG4gIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICByZXRocm93KGVyciwgbnVsbCwgbGluZW5vKVxyXG4gIH1cclxuICB2YXIgY29udGV4dCA9IDNcclxuICAgICwgbGluZXMgPSBzdHIuc3BsaXQoJ1xcbicpXHJcbiAgICAsIHN0YXJ0ID0gTWF0aC5tYXgobGluZW5vIC0gY29udGV4dCwgMClcclxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcclxuXHJcbiAgLy8gRXJyb3IgY29udGV4dFxyXG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xyXG4gICAgdmFyIGN1cnIgPSBpICsgc3RhcnQgKyAxO1xyXG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgID4gJyA6ICcgICAgJylcclxuICAgICAgKyBjdXJyXHJcbiAgICAgICsgJ3wgJ1xyXG4gICAgICArIGxpbmU7XHJcbiAgfSkuam9pbignXFxuJyk7XHJcblxyXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXHJcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcclxuICBlcnIubWVzc2FnZSA9IChmaWxlbmFtZSB8fCAnSmFkZScpICsgJzonICsgbGluZW5vXHJcbiAgICArICdcXG4nICsgY29udGV4dCArICdcXG5cXG4nICsgZXJyLm1lc3NhZ2U7XHJcbiAgdGhyb3cgZXJyO1xyXG59O1xyXG5cbn0se1wiZnNcIjoyfV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5cbn0se31dfSx7fSxbMV0pXG4oMSlcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjguNFxuLy8hIGF1dGhvcnMgOiBUaW0gV29vZCwgSXNrcmVuIENoZXJuZXYsIE1vbWVudC5qcyBjb250cmlidXRvcnNcbi8vISBsaWNlbnNlIDogTUlUXG4vLyEgbW9tZW50anMuY29tXG5cbihmdW5jdGlvbiAodW5kZWZpbmVkKSB7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdGFudHNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgbW9tZW50LFxuICAgICAgICBWRVJTSU9OID0gJzIuOC40JyxcbiAgICAgICAgLy8gdGhlIGdsb2JhbC1zY29wZSB0aGlzIGlzIE5PVCB0aGUgZ2xvYmFsIG9iamVjdCBpbiBOb2RlLmpzXG4gICAgICAgIGdsb2JhbFNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzLFxuICAgICAgICBvbGRHbG9iYWxNb21lbnQsXG4gICAgICAgIHJvdW5kID0gTWF0aC5yb3VuZCxcbiAgICAgICAgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICBpLFxuXG4gICAgICAgIFlFQVIgPSAwLFxuICAgICAgICBNT05USCA9IDEsXG4gICAgICAgIERBVEUgPSAyLFxuICAgICAgICBIT1VSID0gMyxcbiAgICAgICAgTUlOVVRFID0gNCxcbiAgICAgICAgU0VDT05EID0gNSxcbiAgICAgICAgTUlMTElTRUNPTkQgPSA2LFxuXG4gICAgICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxvY2FsZSBjb25maWcgZmlsZXNcbiAgICAgICAgbG9jYWxlcyA9IHt9LFxuXG4gICAgICAgIC8vIGV4dHJhIG1vbWVudCBpbnRlcm5hbCBwcm9wZXJ0aWVzIChwbHVnaW5zIHJlZ2lzdGVyIHByb3BzIGhlcmUpXG4gICAgICAgIG1vbWVudFByb3BlcnRpZXMgPSBbXSxcblxuICAgICAgICAvLyBjaGVjayBmb3Igbm9kZUpTXG4gICAgICAgIGhhc01vZHVsZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpLFxuXG4gICAgICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgICAgICBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pLFxuICAgICAgICBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy8sXG5cbiAgICAgICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAgICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgICAgICBpc29EdXJhdGlvblJlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLyxcblxuICAgICAgICAvLyBmb3JtYXQgdG9rZW5zXG4gICAgICAgIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw0fXx4fFh8eno/fFpaP3wuKS9nLFxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nLFxuXG4gICAgICAgIC8vIHBhcnNpbmcgdG9rZW4gcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lT3JUd29EaWdpdHMgPSAvXFxkXFxkPy8sIC8vIDAgLSA5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9UaHJlZURpZ2l0cyA9IC9cXGR7MSwzfS8sIC8vIDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvRm91ckRpZ2l0cyA9IC9cXGR7MSw0fS8sIC8vIDAgLSA5OTk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cyA9IC9bK1xcLV0/XFxkezEsNn0vLCAvLyAtOTk5LDk5OSAtIDk5OSw5OTlcbiAgICAgICAgcGFyc2VUb2tlbkRpZ2l0cyA9IC9cXGQrLywgLy8gbm9uemVybyBudW1iZXIgb2YgZGlnaXRzXG4gICAgICAgIHBhcnNlVG9rZW5Xb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2ksIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgICAgICBwYXJzZVRva2VuVGltZXpvbmUgPSAvWnxbXFwrXFwtXVxcZFxcZDo/XFxkXFxkL2dpLCAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICAgICAgcGFyc2VUb2tlblQgPSAvVC9pLCAvLyBUIChJU08gc2VwYXJhdG9yKVxuICAgICAgICBwYXJzZVRva2VuT2Zmc2V0TXMgPSAvW1xcK1xcLV0/XFxkKy8sIC8vIDEyMzQ1Njc4OTAxMjNcbiAgICAgICAgcGFyc2VUb2tlblRpbWVzdGFtcE1zID0gL1tcXCtcXC1dP1xcZCsoXFwuXFxkezEsM30pPy8sIC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG5cbiAgICAgICAgLy9zdHJpY3QgcGFyc2luZyByZWdleGVzXG4gICAgICAgIHBhcnNlVG9rZW5PbmVEaWdpdCA9IC9cXGQvLCAvLyAwIC0gOVxuICAgICAgICBwYXJzZVRva2VuVHdvRGlnaXRzID0gL1xcZFxcZC8sIC8vIDAwIC0gOTlcbiAgICAgICAgcGFyc2VUb2tlblRocmVlRGlnaXRzID0gL1xcZHszfS8sIC8vIDAwMCAtIDk5OVxuICAgICAgICBwYXJzZVRva2VuRm91ckRpZ2l0cyA9IC9cXGR7NH0vLCAvLyAwMDAwIC0gOTk5OVxuICAgICAgICBwYXJzZVRva2VuU2l4RGlnaXRzID0gL1srLV0/XFxkezZ9LywgLy8gLTk5OSw5OTkgLSA5OTksOTk5XG4gICAgICAgIHBhcnNlVG9rZW5TaWduZWROdW1iZXIgPSAvWystXT9cXGQrLywgLy8gLWluZiAtIGluZlxuXG4gICAgICAgIC8vIGlzbyA4NjAxIHJlZ2V4XG4gICAgICAgIC8vIDAwMDAtMDAtMDAgMDAwMC1XMDAgb3IgMDAwMC1XMDAtMCArIFQgKyAwMCBvciAwMDowMCBvciAwMDowMDowMCBvciAwMDowMDowMC4wMDAgKyArMDA6MDAgb3IgKzAwMDAgb3IgKzAwKVxuICAgICAgICBpc29SZWdleCA9IC9eXFxzKig/OlsrLV1cXGR7Nn18XFxkezR9KS0oPzooXFxkXFxkLVxcZFxcZCl8KFdcXGRcXGQkKXwoV1xcZFxcZC1cXGQpfChcXGRcXGRcXGQpKSgoVHwgKShcXGRcXGQoOlxcZFxcZCg6XFxkXFxkKFxcLlxcZCspPyk/KT8pPyhbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC8sXG5cbiAgICAgICAgaXNvRm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJyxcblxuICAgICAgICBpc29EYXRlcyA9IFtcbiAgICAgICAgICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICAgICAgWydZWVlZLU1NLUREJywgL1xcZHs0fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZHsyfS1cXGQvXSxcbiAgICAgICAgICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZHsyfS9dLFxuICAgICAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L11cbiAgICAgICAgXSxcblxuICAgICAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgICAgIGlzb1RpbWVzID0gW1xuICAgICAgICAgICAgWydISDptbTpzcy5TU1NTJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgICAgICBbJ0hIOm1tOnNzJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgICAgIFsnSEg6bW0nLCAvKFR8IClcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIJywgLyhUfCApXFxkXFxkL11cbiAgICAgICAgXSxcblxuICAgICAgICAvLyB0aW1lem9uZSBjaHVua2VyICcrMTA6MDAnID4gWycxMCcsICcwMCddIG9yICctMTUzMCcgPiBbJy0xNScsICczMCddXG4gICAgICAgIHBhcnNlVGltZXpvbmVDaHVua2VyID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpLFxuXG4gICAgICAgIC8vIGdldHRlciBhbmQgc2V0dGVyIG5hbWVzXG4gICAgICAgIHByb3h5R2V0dGVyc0FuZFNldHRlcnMgPSAnRGF0ZXxIb3Vyc3xNaW51dGVzfFNlY29uZHN8TWlsbGlzZWNvbmRzJy5zcGxpdCgnfCcpLFxuICAgICAgICB1bml0TWlsbGlzZWNvbmRGYWN0b3JzID0ge1xuICAgICAgICAgICAgJ01pbGxpc2Vjb25kcycgOiAxLFxuICAgICAgICAgICAgJ1NlY29uZHMnIDogMWUzLFxuICAgICAgICAgICAgJ01pbnV0ZXMnIDogNmU0LFxuICAgICAgICAgICAgJ0hvdXJzJyA6IDM2ZTUsXG4gICAgICAgICAgICAnRGF5cycgOiA4NjRlNSxcbiAgICAgICAgICAgICdNb250aHMnIDogMjU5MmU2LFxuICAgICAgICAgICAgJ1llYXJzJyA6IDMxNTM2ZTZcbiAgICAgICAgfSxcblxuICAgICAgICB1bml0QWxpYXNlcyA9IHtcbiAgICAgICAgICAgIG1zIDogJ21pbGxpc2Vjb25kJyxcbiAgICAgICAgICAgIHMgOiAnc2Vjb25kJyxcbiAgICAgICAgICAgIG0gOiAnbWludXRlJyxcbiAgICAgICAgICAgIGggOiAnaG91cicsXG4gICAgICAgICAgICBkIDogJ2RheScsXG4gICAgICAgICAgICBEIDogJ2RhdGUnLFxuICAgICAgICAgICAgdyA6ICd3ZWVrJyxcbiAgICAgICAgICAgIFcgOiAnaXNvV2VlaycsXG4gICAgICAgICAgICBNIDogJ21vbnRoJyxcbiAgICAgICAgICAgIFEgOiAncXVhcnRlcicsXG4gICAgICAgICAgICB5IDogJ3llYXInLFxuICAgICAgICAgICAgREREIDogJ2RheU9mWWVhcicsXG4gICAgICAgICAgICBlIDogJ3dlZWtkYXknLFxuICAgICAgICAgICAgRSA6ICdpc29XZWVrZGF5JyxcbiAgICAgICAgICAgIGdnOiAnd2Vla1llYXInLFxuICAgICAgICAgICAgR0c6ICdpc29XZWVrWWVhcidcbiAgICAgICAgfSxcblxuICAgICAgICBjYW1lbEZ1bmN0aW9ucyA9IHtcbiAgICAgICAgICAgIGRheW9meWVhciA6ICdkYXlPZlllYXInLFxuICAgICAgICAgICAgaXNvd2Vla2RheSA6ICdpc29XZWVrZGF5JyxcbiAgICAgICAgICAgIGlzb3dlZWsgOiAnaXNvV2VlaycsXG4gICAgICAgICAgICB3ZWVreWVhciA6ICd3ZWVrWWVhcicsXG4gICAgICAgICAgICBpc293ZWVreWVhciA6ICdpc29XZWVrWWVhcidcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb3JtYXQgZnVuY3Rpb24gc3RyaW5nc1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnMgPSB7fSxcblxuICAgICAgICAvLyBkZWZhdWx0IHJlbGF0aXZlIHRpbWUgdGhyZXNob2xkc1xuICAgICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzID0ge1xuICAgICAgICAgICAgczogNDUsICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICAgICAgbTogNDUsICAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICAgICAgICAgIGg6IDIyLCAgLy8gaG91cnMgdG8gZGF5XG4gICAgICAgICAgICBkOiAyNiwgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgICAgIE06IDExICAgLy8gbW9udGhzIHRvIHllYXJcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0b2tlbnMgdG8gb3JkaW5hbGl6ZSBhbmQgcGFkXG4gICAgICAgIG9yZGluYWxpemVUb2tlbnMgPSAnREREIHcgVyBNIEQgZCcuc3BsaXQoJyAnKSxcbiAgICAgICAgcGFkZGVkVG9rZW5zID0gJ00gRCBIIGggbSBzIHcgVycuc3BsaXQoJyAnKSxcblxuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHtcbiAgICAgICAgICAgIE0gICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNTU1NIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEREQgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheU9mWWVhcigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGQgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGQgICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZGQgIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGRkZCA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3ICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndlZWsoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBXICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWsoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWSAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy55ZWFyKCksIHNpZ24gPSB5ID49IDAgPyAnKycgOiAnLSc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyBsZWZ0WmVyb0ZpbGwoTWF0aC5hYnMoeSksIDYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnZ2cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnZ2dnIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpLCA1KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHRyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHR0dHIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHR0dHRyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53ZWVrZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEggICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbnV0ZXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlY29uZHMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0b0ludCh0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTUyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodG9JbnQodGhpcy5taWxsaXNlY29uZHMoKSAvIDEwKSwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1NTICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMubWlsbGlzZWNvbmRzKCksIDMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTU1MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLm1pbGxpc2Vjb25kcygpLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gLXRoaXMuem9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBiID0gJysnO1xuICAgICAgICAgICAgICAgIGlmIChhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBhID0gLWE7XG4gICAgICAgICAgICAgICAgICAgIGIgPSAnLSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiICsgbGVmdFplcm9GaWxsKHRvSW50KGEgLyA2MCksIDIpICsgJzonICsgbGVmdFplcm9GaWxsKHRvSW50KGEpICUgNjAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFpaICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSAtdGhpcy56b25lKCksXG4gICAgICAgICAgICAgICAgICAgIGIgPSAnKyc7XG4gICAgICAgICAgICAgICAgaWYgKGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSAtYTtcbiAgICAgICAgICAgICAgICAgICAgYiA9ICctJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBsZWZ0WmVyb0ZpbGwodG9JbnQoYSAvIDYwKSwgMikgKyBsZWZ0WmVyb0ZpbGwodG9JbnQoYSkgJSA2MCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy56b25lQWJicigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHp6IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmVOYW1lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51bml4KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWFydGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVwcmVjYXRpb25zID0ge30sXG5cbiAgICAgICAgbGlzdHMgPSBbJ21vbnRocycsICdtb250aHNTaG9ydCcsICd3ZWVrZGF5cycsICd3ZWVrZGF5c1Nob3J0JywgJ3dlZWtkYXlzTWluJ107XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuIGRmbCBjb21lcyBmcm9tXG4gICAgLy8gZGVmYXVsdC5cbiAgICBmdW5jdGlvbiBkZmwoYSwgYiwgYykge1xuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIGEgIT0gbnVsbCA/IGEgOiBiO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gYSAhPSBudWxsID8gYSA6IGIgIT0gbnVsbCA/IGIgOiBjO1xuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdJbXBsZW1lbnQgbWUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChhLCBiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QsIGFuZCBlczUgc3RhbmRhcmQgaXMgbm90IHZlcnlcbiAgICAgICAgLy8gaGVscGZ1bC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5IDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0IDogW10sXG4gICAgICAgICAgICBvdmVyZmxvdyA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciA6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQgOiBmYWxzZSxcbiAgICAgICAgICAgIGludmFsaWRNb250aCA6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0IDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbzogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmludE1zZyhtc2cpIHtcbiAgICAgICAgaWYgKG1vbWVudC5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPT09IGZhbHNlICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiB3YXJuaW5nOiAnICsgbXNnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICBwcmludE1zZyhtc2cpO1xuICAgICAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGZuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGVTaW1wbGUobmFtZSwgbXNnKSB7XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICBwcmludE1zZyhtc2cpO1xuICAgICAgICAgICAgZGVwcmVjYXRpb25zW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhZFRva2VuKGZ1bmMsIGNvdW50KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbChmdW5jLmNhbGwodGhpcywgYSksIGNvdW50KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3JkaW5hbGl6ZVRva2VuKGZ1bmMsIHBlcmlvZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5vcmRpbmFsKGZ1bmMuY2FsbCh0aGlzLCBhKSwgcGVyaW9kKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB3aGlsZSAob3JkaW5hbGl6ZVRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgaSA9IG9yZGluYWxpemVUb2tlbnMucG9wKCk7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW2kgKyAnbyddID0gb3JkaW5hbGl6ZVRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zW2ldLCBpKTtcbiAgICB9XG4gICAgd2hpbGUgKHBhZGRlZFRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgaSA9IHBhZGRlZFRva2Vucy5wb3AoKTtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbaSArIGldID0gcGFkVG9rZW4oZm9ybWF0VG9rZW5GdW5jdGlvbnNbaV0sIDIpO1xuICAgIH1cbiAgICBmb3JtYXRUb2tlbkZ1bmN0aW9ucy5EREREID0gcGFkVG9rZW4oZm9ybWF0VG9rZW5GdW5jdGlvbnMuRERELCAzKTtcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdHJ1Y3RvcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmdW5jdGlvbiBMb2NhbGUoKSB7XG4gICAgfVxuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnLCBza2lwT3ZlcmZsb3cpIHtcbiAgICAgICAgaWYgKHNraXBPdmVyZmxvdyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICBjb3B5Q29uZmlnKHRoaXMsIGNvbmZpZyk7XG4gICAgICAgIHRoaXMuX2QgPSBuZXcgRGF0ZSgrY29uZmlnLl9kKTtcbiAgICB9XG5cbiAgICAvLyBEdXJhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGZ1bmN0aW9uIER1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbW9tZW50LmxvY2FsZURhdGEoKTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvcHlDb25maWcodG8sIGZyb20pIHtcbiAgICAgICAgdmFyIGksIHByb3AsIHZhbDtcblxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2lzQU1vbWVudE9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc0FNb21lbnRPYmplY3QgPSBmcm9tLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2kgPSBmcm9tLl9pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9mID0gZnJvbS5fZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2wgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fbCA9IGZyb20uX2w7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9zdHJpY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fc3RyaWN0ID0gZnJvbS5fc3RyaWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fdHptICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3R6bSA9IGZyb20uX3R6bTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2lzVVRDICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzVVRDID0gZnJvbS5faXNVVEM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9vZmZzZXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fb2Zmc2V0ID0gZnJvbS5fb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fcGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fcGYgPSBmcm9tLl9wZjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2xvY2FsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gbW9tZW50UHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNSb3VuZChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsZWZ0IHplcm8gZmlsbCBhIG51bWJlclxuICAgIC8vIHNlZSBodHRwOi8vanNwZXJmLmNvbS9sZWZ0LXplcm8tZmlsbGluZyBmb3IgcGVyZm9ybWFuY2UgY29tcGFyaXNvblxuICAgIGZ1bmN0aW9uIGxlZnRaZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG5cbiAgICAgICAgd2hpbGUgKG91dHB1dC5sZW5ndGggPCB0YXJnZXRMZW5ndGgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9ICcwJyArIG91dHB1dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArIG91dHB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIG90aGVyID0gbWFrZUFzKG90aGVyLCBiYXNlKTtcbiAgICAgICAgaWYgKGJhc2UuaXNCZWZvcmUob3RoZXIpKSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2Uob3RoZXIsIGJhc2UpO1xuICAgICAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9IC1yZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgcmVzLm1vbnRocyA9IC1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvLyBUT0RPOiByZW1vdmUgJ25hbWUnIGFyZyBhZnRlciBkZXByZWNhdGlvbiBpcyByZW1vdmVkXG4gICAgZnVuY3Rpb24gY3JlYXRlQWRkZXIoZGlyZWN0aW9uLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsLCBwZXJpb2QpIHtcbiAgICAgICAgICAgIHZhciBkdXIsIHRtcDtcbiAgICAgICAgICAgIC8vaW52ZXJ0IHRoZSBhcmd1bWVudHMsIGJ1dCBjb21wbGFpbiBhYm91dCBpdFxuICAgICAgICAgICAgaWYgKHBlcmlvZCAhPT0gbnVsbCAmJiAhaXNOYU4oK3BlcmlvZCkpIHtcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVTaW1wbGUobmFtZSwgJ21vbWVudCgpLicgKyBuYW1lICArICcocGVyaW9kLCBudW1iZXIpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgbW9tZW50KCkuJyArIG5hbWUgKyAnKG51bWJlciwgcGVyaW9kKS4nKTtcbiAgICAgICAgICAgICAgICB0bXAgPSB2YWw7IHZhbCA9IHBlcmlvZDsgcGVyaW9kID0gdG1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICt2YWwgOiB2YWw7XG4gICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICAgICAgYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gZHVyYXRpb24uX2RheXMsXG4gICAgICAgICAgICBtb250aHMgPSBkdXJhdGlvbi5fbW9udGhzO1xuICAgICAgICB1cGRhdGVPZmZzZXQgPSB1cGRhdGVPZmZzZXQgPT0gbnVsbCA/IHRydWUgOiB1cGRhdGVPZmZzZXQ7XG5cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUoK21vbS5fZCArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF5cykge1xuICAgICAgICAgICAgcmF3U2V0dGVyKG1vbSwgJ0RhdGUnLCByYXdHZXR0ZXIobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICByYXdNb250aFNldHRlcihtb20sIHJhd0dldHRlcihtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBpcyBhbiBhcnJheVxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXScgfHxcbiAgICAgICAgICAgIGlucHV0IGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9XG5cbiAgICAvLyBjb21wYXJlIHR3byBhcnJheXMsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpKSB7XG4gICAgICAgICAgICAgICAgZGlmZnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZnMgKyBsZW5ndGhEaWZmO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIGlmICh1bml0cykge1xuICAgICAgICAgICAgdmFyIGxvd2VyZWQgPSB1bml0cy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyguKXMkLywgJyQxJyk7XG4gICAgICAgICAgICB1bml0cyA9IHVuaXRBbGlhc2VzW3VuaXRzXSB8fCBjYW1lbEZ1bmN0aW9uc1tsb3dlcmVkXSB8fCBsb3dlcmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bml0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTGlzdChmaWVsZCkge1xuICAgICAgICB2YXIgY291bnQsIHNldHRlcjtcblxuICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignd2VlaycpID09PSAwKSB7XG4gICAgICAgICAgICBjb3VudCA9IDc7XG4gICAgICAgICAgICBzZXR0ZXIgPSAnZGF5JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaWVsZC5pbmRleE9mKCdtb250aCcpID09PSAwKSB7XG4gICAgICAgICAgICBjb3VudCA9IDEyO1xuICAgICAgICAgICAgc2V0dGVyID0gJ21vbnRoJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vbWVudFtmaWVsZF0gPSBmdW5jdGlvbiAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIGksIGdldHRlcixcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBtb21lbnQuX2xvY2FsZVtmaWVsZF0sXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdldHRlciA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQoKS51dGMoKS5zZXQoc2V0dGVyLCBpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0aG9kLmNhbGwobW9tZW50Ll9sb2NhbGUsIG0sIGZvcm1hdCB8fCAnJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXR0ZXIoaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGdldHRlcihpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSW50KGFyZ3VtZW50Rm9yQ29lcmNpb24pIHtcbiAgICAgICAgdmFyIGNvZXJjZWROdW1iZXIgPSArYXJndW1lbnRGb3JDb2VyY2lvbixcbiAgICAgICAgICAgIHZhbHVlID0gMDtcblxuICAgICAgICBpZiAoY29lcmNlZE51bWJlciAhPT0gMCAmJiBpc0Zpbml0ZShjb2VyY2VkTnVtYmVyKSkge1xuICAgICAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgPj0gMCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5mbG9vcihjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmNlaWwoY29lcmNlZE51bWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoICsgMSwgMCkpLmdldFVUQ0RhdGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWVrc0luWWVhcih5ZWFyLCBkb3csIGRveSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb21lbnQoW3llYXIsIDExLCAzMSArIGRvdyAtIGRveV0pLCBkb3csIGRveSkud2VlaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja092ZXJmbG93KG0pIHtcbiAgICAgICAgdmFyIG92ZXJmbG93O1xuICAgICAgICBpZiAobS5fYSAmJiBtLl9wZi5vdmVyZmxvdyA9PT0gLTIpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID1cbiAgICAgICAgICAgICAgICBtLl9hW01PTlRIXSA8IDAgfHwgbS5fYVtNT05USF0gPiAxMSA/IE1PTlRIIDpcbiAgICAgICAgICAgICAgICBtLl9hW0RBVEVdIDwgMSB8fCBtLl9hW0RBVEVdID4gZGF5c0luTW9udGgobS5fYVtZRUFSXSwgbS5fYVtNT05USF0pID8gREFURSA6XG4gICAgICAgICAgICAgICAgbS5fYVtIT1VSXSA8IDAgfHwgbS5fYVtIT1VSXSA+IDI0IHx8XG4gICAgICAgICAgICAgICAgICAgIChtLl9hW0hPVVJdID09PSAyNCAmJiAobS5fYVtNSU5VVEVdICE9PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5fYVtTRUNPTkRdICE9PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5fYVtNSUxMSVNFQ09ORF0gIT09IDApKSA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIG0uX2FbTUlOVVRFXSA8IDAgfHwgbS5fYVtNSU5VVEVdID4gNTkgPyBNSU5VVEUgOlxuICAgICAgICAgICAgICAgIG0uX2FbU0VDT05EXSA8IDAgfHwgbS5fYVtTRUNPTkRdID4gNTkgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIG0uX2FbTUlMTElTRUNPTkRdIDwgMCB8fCBtLl9hW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKG0uX3BmLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG0uX3BmLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkKG0pIHtcbiAgICAgICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5faXNWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICBtLl9wZi5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLnVzZXJJbnZhbGlkYXRlZDtcblxuICAgICAgICAgICAgaWYgKG0uX3N0cmljdCkge1xuICAgICAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBtLl9pc1ZhbGlkICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgbS5fcGYudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi5iaWdIb3VyID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbmV4dCwgbG9jYWxlLCBzcGxpdDtcblxuICAgICAgICB3aGlsZSAoaSA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaV0pLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBqID0gc3BsaXQubGVuZ3RoO1xuICAgICAgICAgICAgbmV4dCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpICsgMV0pO1xuICAgICAgICAgICAgbmV4dCA9IG5leHQgPyBuZXh0LnNwbGl0KCctJykgOiBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShzcGxpdC5zbGljZSgwLCBqKS5qb2luKCctJykpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgaGFzTW9kdWxlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZExvY2FsZSA9IG1vbWVudC5sb2NhbGUoKTtcbiAgICAgICAgICAgICAgICByZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBkZWZpbmVMb2NhbGUgY3VycmVudGx5IGFsc28gc2V0cyB0aGUgZ2xvYmFsIGxvY2FsZSwgd2Ugd2FudCB0byB1bmRvIHRoYXQgZm9yIGxhenkgbG9hZGVkIGxvY2FsZXNcbiAgICAgICAgICAgICAgICBtb21lbnQubG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIG1ha2VBcyhpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAobW9tZW50LmlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID9cbiAgICAgICAgICAgICAgICAgICAgK2lucHV0IDogK21vbWVudChpbnB1dCkpIC0gKCtyZXMpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUoK3Jlcy5fZCArIGRpZmYpO1xuICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldChyZXMsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KGlucHV0KS5sb2NhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBMb2NhbGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGV4dGVuZChMb2NhbGUucHJvdG90eXBlLCB7XG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgICAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9vcmRpbmFsUGFyc2VMZW5pZW50LlxuICAgICAgICAgICAgdGhpcy5fb3JkaW5hbFBhcnNlTGVuaWVudCA9IG5ldyBSZWdFeHAodGhpcy5fb3JkaW5hbFBhcnNlLnNvdXJjZSArICd8JyArIC9cXGR7MSwyfS8uc291cmNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbW9udGhzIDogJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyksXG4gICAgICAgIG1vbnRocyA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21vbnRoc1Nob3J0IDogJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpLFxuICAgICAgICBtb250aHNTaG9ydCA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtb250aHNQYXJzZSA6IGZ1bmN0aW9uIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudC51dGMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBmb3JtYXQgPT09ICdNTU0nICYmIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5cyA6ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoJ18nKSxcbiAgICAgICAgd2Vla2RheXMgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzW20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5c1Nob3J0IDogJ1N1bl9Nb25fVHVlX1dlZF9UaHVfRnJpX1NhdCcuc3BsaXQoJ18nKSxcbiAgICAgICAgd2Vla2RheXNTaG9ydCA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBfd2Vla2RheXNNaW4gOiAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyksXG4gICAgICAgIHdlZWtkYXlzTWluIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrZGF5c1BhcnNlIDogZnVuY3Rpb24gKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbG9uZ0RhdGVGb3JtYXQgOiB7XG4gICAgICAgICAgICBMVFMgOiAnaDptbTpzcyBBJyxcbiAgICAgICAgICAgIExUIDogJ2g6bW0gQScsXG4gICAgICAgICAgICBMIDogJ01NL0REL1lZWVknLFxuICAgICAgICAgICAgTEwgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgICAgIExMTCA6ICdNTU1NIEQsIFlZWVkgTFQnLFxuICAgICAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgTFQnXG4gICAgICAgIH0sXG4gICAgICAgIGxvbmdEYXRlRm9ybWF0IDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgICAgICAgICBpZiAoIW91dHB1dCAmJiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0ucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1BNIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9tZXJpZGllbVBhcnNlIDogL1thcF1cXC4/bT9cXC4/L2ksXG4gICAgICAgIG1lcmlkaWVtIDogZnVuY3Rpb24gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NhbGVuZGFyIDoge1xuICAgICAgICAgICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgICAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgICAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgICAgIHNhbWVFbHNlIDogJ0wnXG4gICAgICAgIH0sXG4gICAgICAgIGNhbGVuZGFyIDogZnVuY3Rpb24gKGtleSwgbW9tLCBub3cpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQuYXBwbHkobW9tLCBbbm93XSkgOiBvdXRwdXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3JlbGF0aXZlVGltZSA6IHtcbiAgICAgICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgICAgICBwYXN0IDogJyVzIGFnbycsXG4gICAgICAgICAgICBzIDogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICAgICAgbSA6ICdhIG1pbnV0ZScsXG4gICAgICAgICAgICBtbSA6ICclZCBtaW51dGVzJyxcbiAgICAgICAgICAgIGggOiAnYW4gaG91cicsXG4gICAgICAgICAgICBoaCA6ICclZCBob3VycycsXG4gICAgICAgICAgICBkIDogJ2EgZGF5JyxcbiAgICAgICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICAgICAgTSA6ICdhIG1vbnRoJyxcbiAgICAgICAgICAgIE1NIDogJyVkIG1vbnRocycsXG4gICAgICAgICAgICB5IDogJ2EgeWVhcicsXG4gICAgICAgICAgICB5eSA6ICclZCB5ZWFycydcbiAgICAgICAgfSxcblxuICAgICAgICByZWxhdGl2ZVRpbWUgOiBmdW5jdGlvbiAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW3N0cmluZ107XG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICAgICAgICBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSA6XG4gICAgICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFzdEZ1dHVyZSA6IGZ1bmN0aW9uIChkaWZmLCBvdXRwdXQpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoJyVkJywgbnVtYmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgX29yZGluYWwgOiAnJWQnLFxuICAgICAgICBfb3JkaW5hbFBhcnNlIDogL1xcZHsxLDJ9LyxcblxuICAgICAgICBwcmVwYXJzZSA6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zdGZvcm1hdCA6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2VlayA6IGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrIDoge1xuICAgICAgICAgICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2ludmFsaWREYXRlOiAnSW52YWxpZCBkYXRlJyxcbiAgICAgICAgaW52YWxpZERhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGb3JtYXR0aW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgJycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJyc7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJyYXlbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbiA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpIDogYXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcbiAgICAgICAgaWYgKCFtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG0ubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBleHBhbmRGb3JtYXQoZm9ybWF0LCBtLmxvY2FsZURhdGEoKSk7XG5cbiAgICAgICAgaWYgKCFmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSkge1xuICAgICAgICAgICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFBhcnNpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIGdldCB0aGUgcmVnZXggdG8gZmluZCB0aGUgbmV4dCB0b2tlblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSB7XG4gICAgICAgIHZhciBhLCBzdHJpY3QgPSBjb25maWcuX3N0cmljdDtcbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lRGlnaXQ7XG4gICAgICAgIGNhc2UgJ0REREQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaHJlZURpZ2l0cztcbiAgICAgICAgY2FzZSAnWVlZWSc6XG4gICAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgICBjYXNlICdnZ2dnJzpcbiAgICAgICAgICAgIHJldHVybiBzdHJpY3QgPyBwYXJzZVRva2VuRm91ckRpZ2l0cyA6IHBhcnNlVG9rZW5PbmVUb0ZvdXJEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1knOlxuICAgICAgICBjYXNlICdHJzpcbiAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblNpZ25lZE51bWJlcjtcbiAgICAgICAgY2FzZSAnWVlZWVlZJzpcbiAgICAgICAgY2FzZSAnWVlZWVknOlxuICAgICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgIGNhc2UgJ2dnZ2dnJzpcbiAgICAgICAgICAgIHJldHVybiBzdHJpY3QgPyBwYXJzZVRva2VuU2l4RGlnaXRzIDogcGFyc2VUb2tlbk9uZVRvU2l4RGlnaXRzO1xuICAgICAgICBjYXNlICdTJzpcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZURpZ2l0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdTUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5Ud29EaWdpdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ1NTUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaHJlZURpZ2l0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnREREJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lVG9UaHJlZURpZ2l0cztcbiAgICAgICAgY2FzZSAnTU1NJzpcbiAgICAgICAgY2FzZSAnTU1NTSc6XG4gICAgICAgIGNhc2UgJ2RkJzpcbiAgICAgICAgY2FzZSAnZGRkJzpcbiAgICAgICAgY2FzZSAnZGRkZCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbldvcmQ7XG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICAgIHJldHVybiBjb25maWcuX2xvY2FsZS5fbWVyaWRpZW1QYXJzZTtcbiAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9mZnNldE1zO1xuICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGltZXN0YW1wTXM7XG4gICAgICAgIGNhc2UgJ1onOlxuICAgICAgICBjYXNlICdaWic6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRpbWV6b25lO1xuICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVDtcbiAgICAgICAgY2FzZSAnU1NTUyc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbkRpZ2l0cztcbiAgICAgICAgY2FzZSAnTU0nOlxuICAgICAgICBjYXNlICdERCc6XG4gICAgICAgIGNhc2UgJ1lZJzpcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICBjYXNlICdnZyc6XG4gICAgICAgIGNhc2UgJ0hIJzpcbiAgICAgICAgY2FzZSAnaGgnOlxuICAgICAgICBjYXNlICdtbSc6XG4gICAgICAgIGNhc2UgJ3NzJzpcbiAgICAgICAgY2FzZSAnd3cnOlxuICAgICAgICBjYXNlICdXVyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlblR3b0RpZ2l0cyA6IHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cztcbiAgICAgICAgY2FzZSAnTSc6XG4gICAgICAgIGNhc2UgJ0QnOlxuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgY2FzZSAnSCc6XG4gICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgY2FzZSAncyc6XG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cztcbiAgICAgICAgY2FzZSAnRG8nOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IGNvbmZpZy5fbG9jYWxlLl9vcmRpbmFsUGFyc2UgOiBjb25maWcuX2xvY2FsZS5fb3JkaW5hbFBhcnNlTGVuaWVudDtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICBhID0gbmV3IFJlZ0V4cChyZWdleHBFc2NhcGUodW5lc2NhcGVGb3JtYXQodG9rZW4ucmVwbGFjZSgnXFxcXCcsICcnKSksICdpJykpO1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aW1lem9uZU1pbnV0ZXNGcm9tU3RyaW5nKHN0cmluZykge1xuICAgICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgJyc7XG4gICAgICAgIHZhciBwb3NzaWJsZVR6TWF0Y2hlcyA9IChzdHJpbmcubWF0Y2gocGFyc2VUb2tlblRpbWV6b25lKSB8fCBbXSksXG4gICAgICAgICAgICB0ekNodW5rID0gcG9zc2libGVUek1hdGNoZXNbcG9zc2libGVUek1hdGNoZXMubGVuZ3RoIC0gMV0gfHwgW10sXG4gICAgICAgICAgICBwYXJ0cyA9ICh0ekNodW5rICsgJycpLm1hdGNoKHBhcnNlVGltZXpvbmVDaHVua2VyKSB8fCBbJy0nLCAwLCAwXSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSArKHBhcnRzWzFdICogNjApICsgdG9JbnQocGFydHNbMl0pO1xuXG4gICAgICAgIHJldHVybiBwYXJ0c1swXSA9PT0gJysnID8gLW1pbnV0ZXMgOiBtaW51dGVzO1xuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIHRvIGNvbnZlcnQgc3RyaW5nIGlucHV0IHRvIGRhdGVcbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICB2YXIgYSwgZGF0ZVBhcnRBcnJheSA9IGNvbmZpZy5fYTtcblxuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgIC8vIFFVQVJURVJcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNT05USFxuICAgICAgICBjYXNlICdNJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBNTVxuICAgICAgICBjYXNlICdNTScgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTU1NJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBNTU1NXG4gICAgICAgIGNhc2UgJ01NTU0nIDpcbiAgICAgICAgICAgIGEgPSBjb25maWcuX2xvY2FsZS5tb250aHNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gYTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBEQVkgT0YgTU9OVEhcbiAgICAgICAgY2FzZSAnRCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gRERcbiAgICAgICAgY2FzZSAnREQnIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtEQVRFXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdEbycgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W0RBVEVdID0gdG9JbnQocGFyc2VJbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQubWF0Y2goL1xcZHsxLDJ9LylbMF0sIDEwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gREFZIE9GIFlFQVJcbiAgICAgICAgY2FzZSAnREREJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBEREREXG4gICAgICAgIGNhc2UgJ0REREQnIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBZRUFSXG4gICAgICAgIGNhc2UgJ1lZJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1lFQVJdID0gbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdZWVlZJyA6XG4gICAgICAgIGNhc2UgJ1lZWVlZJyA6XG4gICAgICAgIGNhc2UgJ1lZWVlZWScgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtZRUFSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBBTSAvIFBNXG4gICAgICAgIGNhc2UgJ2EnIDogLy8gZmFsbCB0aHJvdWdoIHRvIEFcbiAgICAgICAgY2FzZSAnQScgOlxuICAgICAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gSE9VUlxuICAgICAgICBjYXNlICdoJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdoaCcgOlxuICAgICAgICAgICAgY29uZmlnLl9wZi5iaWdIb3VyID0gdHJ1ZTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnSCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gSEhcbiAgICAgICAgY2FzZSAnSEgnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlOVVRFXG4gICAgICAgIGNhc2UgJ20nIDogLy8gZmFsbCB0aHJvdWdoIHRvIG1tXG4gICAgICAgIGNhc2UgJ21tJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gU0VDT05EXG4gICAgICAgIGNhc2UgJ3MnIDogLy8gZmFsbCB0aHJvdWdoIHRvIHNzXG4gICAgICAgIGNhc2UgJ3NzJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlMTElTRUNPTkRcbiAgICAgICAgY2FzZSAnUycgOlxuICAgICAgICBjYXNlICdTUycgOlxuICAgICAgICBjYXNlICdTU1MnIDpcbiAgICAgICAgY2FzZSAnU1NTUycgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFVOSVggT0ZGU0VUIChNSUxMSVNFQ09ORFMpXG4gICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUodG9JbnQoaW5wdXQpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBVTklYIFRJTUVTVEFNUCBXSVRIIE1TXG4gICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUocGFyc2VGbG9hdChpbnB1dCkgKiAxMDAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBUSU1FWk9ORVxuICAgICAgICBjYXNlICdaJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBaWlxuICAgICAgICBjYXNlICdaWicgOlxuICAgICAgICAgICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl90em0gPSB0aW1lem9uZU1pbnV0ZXNGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBXRUVLREFZIC0gaHVtYW5cbiAgICAgICAgY2FzZSAnZGQnOlxuICAgICAgICBjYXNlICdkZGQnOlxuICAgICAgICBjYXNlICdkZGRkJzpcbiAgICAgICAgICAgIGEgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgIC8vIGlmIHdlIGRpZG4ndCBnZXQgYSB3ZWVrZGF5IG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZFxuICAgICAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25maWcuX3dbJ2QnXSA9IGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZFdlZWtkYXkgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBXRUVLLCBXRUVLIERBWSAtIG51bWVyaWNcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgIGNhc2UgJ3d3JzpcbiAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgIGNhc2UgJ1dXJzpcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW4uc3Vic3RyKDAsIDEpO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdnZ2dnJzpcbiAgICAgICAgY2FzZSAnR0dHRyc6XG4gICAgICAgIGNhc2UgJ0dHR0dHJzpcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW4uc3Vic3RyKDAsIDIpO1xuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fd1t0b2tlbl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZ2cnOlxuICAgICAgICBjYXNlICdHRyc6XG4gICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICBjb25maWcuX3dbdG9rZW5dID0gbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcDtcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRmbCh3LkdHLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobW9tZW50KCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRmbCh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRmbCh3LkUsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRmbCh3LmdnLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobW9tZW50KCksIGRvdywgZG95KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZmwody53LCAxKTtcblxuICAgICAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgICAgICBpZiAod2Vla2RheSA8IGRvdykge1xuICAgICAgICAgICAgICAgICAgICArK3dlZWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG95LCBkb3cpO1xuXG4gICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGRhdGVGcm9tQ29uZmlnKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgZGF0ZSwgaW5wdXQgPSBbXSwgY3VycmVudERhdGUsIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRmbChjb25maWcuX2FbWUVBUl0sIGN1cnJlbnREYXRlW1lFQVJdKTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyVG9Vc2UpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gbWFrZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSAoY29uZmlnLl9hW2ldID09IG51bGwpID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBmb3IgMjQ6MDA6MDAuMDAwXG4gICAgICAgIGlmIChjb25maWcuX2FbSE9VUl0gPT09IDI0ICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbU0VDT05EXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSUxMSVNFQ09ORF0gPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fbmV4dERheSA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gbWFrZVVUQ0RhdGUgOiBtYWtlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB6b25lIGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSArIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuX25leHREYXkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDI0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF0ZUZyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQ7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gW1xuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LnllYXIsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubW9udGgsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQuZGF5IHx8IG5vcm1hbGl6ZWRJbnB1dC5kYXRlLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LmhvdXIsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubWludXRlLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LnNlY29uZCxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZFxuICAgICAgICBdO1xuXG4gICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBub3cuZ2V0VVRDRnVsbFllYXIoKSxcbiAgICAgICAgICAgICAgICBub3cuZ2V0VVRDTW9udGgoKSxcbiAgICAgICAgICAgICAgICBub3cuZ2V0VVRDRGF0ZSgpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gbW9tZW50LklTT184NjAxKSB7XG4gICAgICAgICAgICBwYXJzZUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGNvbmZpZy5fcGYuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBzdHJpbmcgPSAnJyArIGNvbmZpZy5faSxcbiAgICAgICAgICAgIGksIHBhcnNlZElucHV0LCB0b2tlbnMsIHRva2VuLCBza2lwcGVkLFxuICAgICAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwO1xuXG4gICAgICAgIHRva2VucyA9IGV4cGFuZEZvcm1hdChjb25maWcuX2YsIGNvbmZpZy5fbG9jYWxlKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkgKyBwYXJzZWRJbnB1dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggKz0gcGFyc2VkSW5wdXQubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3QgcGFyc2UgaWYgaXQncyBub3QgYSBrbm93biB0b2tlblxuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX3BmLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVtYWluaW5nIHVucGFyc2VkIGlucHV0IGxlbmd0aCB0byB0aGUgc3RyaW5nXG4gICAgICAgIGNvbmZpZy5fcGYuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGVhciBfMTJoIGZsYWcgaWYgaG91ciBpcyA8PSAxMlxuICAgICAgICBpZiAoY29uZmlnLl9wZi5iaWdIb3VyID09PSB0cnVlICYmIGNvbmZpZy5fYVtIT1VSXSA8PSAxMikge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5iaWdIb3VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhhbmRsZSBhbSBwbVxuICAgICAgICBpZiAoY29uZmlnLl9pc1BtICYmIGNvbmZpZy5fYVtIT1VSXSA8IDEyKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gKz0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgaXMgMTIgYW0sIGNoYW5nZSBob3VycyB0byAwXG4gICAgICAgIGlmIChjb25maWcuX2lzUG0gPT09IGZhbHNlICYmIGNvbmZpZy5fYVtIT1VSXSA9PT0gMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZGF0ZUZyb21Db25maWcoY29uZmlnKTtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHJlZ2V4cEVzY2FwZShzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGFycmF5IG9mIGZvcm1hdCBzdHJpbmdzXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRGb3JtYXQgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuX2YubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IDA7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnID0gY29weUNvbmZpZyh7fSwgY29uZmlnKTtcbiAgICAgICAgICAgIGlmIChjb25maWcuX3VzZVVUQyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGVtcENvbmZpZy5fdXNlVVRDID0gY29uZmlnLl91c2VVVEM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICAgICAgICAgIHRlbXBDb25maWcuX2YgPSBjb25maWcuX2ZbaV07XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IHRlbXBDb25maWcuX3BmLmNoYXJzTGVmdE92ZXI7XG5cbiAgICAgICAgICAgIC8vb3IgdG9rZW5zXG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gdGVtcENvbmZpZy5fcGYudW51c2VkVG9rZW5zLmxlbmd0aCAqIDEwO1xuXG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9wZi5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICAgICAgaWYgKHNjb3JlVG9CZWF0ID09IG51bGwgfHwgY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgICAgICBzY29yZVRvQmVhdCA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBwYXJzZUlTTyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGwsXG4gICAgICAgICAgICBzdHJpbmcgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBtYXRjaCA9IGlzb1JlZ2V4LmV4ZWMoc3RyaW5nKTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuaXNvID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvRGF0ZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzVdIHNob3VsZCBiZSAnVCcgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiA9IGlzb0RhdGVzW2ldWzBdICsgKG1hdGNoWzZdIHx8ICcgJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChwYXJzZVRva2VuVGltZXpvbmUpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9mICs9ICdaJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdCBvciBmYWxsYmFja1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZyhjb25maWcpIHtcbiAgICAgICAgcGFyc2VJU08oY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgICAgICBtb21lbnQuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hcChhcnIsIGZuKSB7XG4gICAgICAgIHZhciByZXMgPSBbXSwgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmVzLnB1c2goZm4oYXJyW2ldLCBpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLCBtYXRjaGVkO1xuICAgICAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgraW5wdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKChtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoaW5wdXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGRhdGVGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb21lbnQuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODEzNDgvaW5zdGFudGlhdGluZy1hLWphdmFzY3JpcHQtb2JqZWN0LWJ5LWNhbGxpbmctcHJvdG90eXBlLWNvbnN0cnVjdG9yLWFwcGx5XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vdGhlIGRhdGUgY29uc3RydWN0b3IgZG9lc24ndCBhY2NlcHQgeWVhcnMgPCAxOTcwXG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlVVRDRGF0ZSh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoaW5wdXQsIGxvY2FsZSkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKCFpc05hTihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgUmVsYXRpdmUgVGltZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLnJlbGF0aXZlVGltZShudW1iZXIgfHwgMSwgISF3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWxhdGl2ZVRpbWUocG9zTmVnRHVyYXRpb24sIHdpdGhvdXRTdWZmaXgsIGxvY2FsZSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBtb21lbnQuZHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpLFxuICAgICAgICAgICAgc2Vjb25kcyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdzJykpLFxuICAgICAgICAgICAgbWludXRlcyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdtJykpLFxuICAgICAgICAgICAgaG91cnMgPSByb3VuZChkdXJhdGlvbi5hcygnaCcpKSxcbiAgICAgICAgICAgIGRheXMgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKSxcbiAgICAgICAgICAgIG1vbnRocyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdNJykpLFxuICAgICAgICAgICAgeWVhcnMgPSByb3VuZChkdXJhdGlvbi5hcygneScpKSxcblxuICAgICAgICAgICAgYXJncyA9IHNlY29uZHMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLnMgJiYgWydzJywgc2Vjb25kc10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzID09PSAxICYmIFsnbSddIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyA9PT0gMSAmJiBbJ2gnXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10gfHxcbiAgICAgICAgICAgICAgICBkYXlzID09PSAxICYmIFsnZCddIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMuZCAmJiBbJ2RkJywgZGF5c10gfHxcbiAgICAgICAgICAgICAgICBtb250aHMgPT09IDEgJiYgWydNJ10gfHxcbiAgICAgICAgICAgICAgICBtb250aHMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLk0gJiYgWydNTScsIG1vbnRoc10gfHxcbiAgICAgICAgICAgICAgICB5ZWFycyA9PT0gMSAmJiBbJ3knXSB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgICAgIGFyZ3NbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhcmdzWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICAgICAgYXJnc1s0XSA9IGxvY2FsZTtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KHt9LCBhcmdzKTtcbiAgICB9XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgV2VlayBvZiBZZWFyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA+IGVuZCkge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrIC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrIDwgZW5kIC0gNykge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGp1c3RlZE1vbWVudCA9IG1vbWVudChtb20pLmFkZChkYXlzVG9EYXlPZldlZWssICdkJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiBNYXRoLmNlaWwoYWRqdXN0ZWRNb21lbnQuZGF5T2ZZZWFyKCkgLyA3KSxcbiAgICAgICAgICAgIHllYXI6IGFkanVzdGVkTW9tZW50LnllYXIoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBmaXJzdERheU9mV2Vla09mWWVhciwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgdmFyIGQgPSBtYWtlVVRDRGF0ZSh5ZWFyLCAwLCAxKS5nZXRVVENEYXkoKSwgZGF5c1RvQWRkLCBkYXlPZlllYXI7XG5cbiAgICAgICAgZCA9IGQgPT09IDAgPyA3IDogZDtcbiAgICAgICAgd2Vla2RheSA9IHdlZWtkYXkgIT0gbnVsbCA/IHdlZWtkYXkgOiBmaXJzdERheU9mV2VlaztcbiAgICAgICAgZGF5c1RvQWRkID0gZmlyc3REYXlPZldlZWsgLSBkICsgKGQgPiBmaXJzdERheU9mV2Vla09mWWVhciA/IDcgOiAwKSAtIChkIDwgZmlyc3REYXlPZldlZWsgPyA3IDogMCk7XG4gICAgICAgIGRheU9mWWVhciA9IDcgKiAod2VlayAtIDEpICsgKHdlZWtkYXkgLSBmaXJzdERheU9mV2VlaykgKyBkYXlzVG9BZGQgKyAxO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiBkYXlPZlllYXIgPiAwID8geWVhciA6IHllYXIgLSAxLFxuICAgICAgICAgICAgZGF5T2ZZZWFyOiBkYXlPZlllYXIgPiAwID8gIGRheU9mWWVhciA6IGRheXNJblllYXIoeWVhciAtIDEpICsgZGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBUb3AgTGV2ZWwgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbWFrZU1vbWVudChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgZm9ybWF0ID0gY29uZmlnLl9mLFxuICAgICAgICAgICAgcmVzO1xuXG4gICAgICAgIGNvbmZpZy5fbG9jYWxlID0gY29uZmlnLl9sb2NhbGUgfHwgbW9tZW50LmxvY2FsZURhdGEoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuaW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBjb25maWcuX2xvY2FsZS5wcmVwYXJzZShpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50LmlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoaW5wdXQsIHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFrZURhdGVGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcyA9IG5ldyBNb21lbnQoY29uZmlnKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIG1vbWVudCA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICB2YXIgYztcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBjLl9pc1VUQyA9IGZhbHNlO1xuICAgICAgICBjLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcblxuICAgICAgICByZXR1cm4gbWFrZU1vbWVudChjKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuXG4gICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgK1xuICAgICAgICAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIG1vbWVudC5taW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5tYXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRpbmcgd2l0aCB1dGNcbiAgICBtb21lbnQudXRjID0gZnVuY3Rpb24gKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBjO1xuXG4gICAgICAgIGlmICh0eXBlb2YobG9jYWxlKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMgPSB7fTtcbiAgICAgICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgYy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5faXNVVEMgPSB0cnVlO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG5cbiAgICAgICAgcmV0dXJuIG1ha2VNb21lbnQoYykudXRjKCk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0aW5nIHdpdGggdW5peCB0aW1lc3RhbXAgKGluIHNlY29uZHMpXG4gICAgbW9tZW50LnVuaXggPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChpbnB1dCAqIDEwMDApO1xuICAgIH07XG5cbiAgICAvLyBkdXJhdGlvblxuICAgIG1vbWVudC5kdXJhdGlvbiA9IGZ1bmN0aW9uIChpbnB1dCwga2V5KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGlucHV0LFxuICAgICAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgICAgIG1hdGNoID0gbnVsbCxcbiAgICAgICAgICAgIHNpZ24sXG4gICAgICAgICAgICByZXQsXG4gICAgICAgICAgICBwYXJzZUlzbyxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbXM6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICAgICAgTTogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb0R1cmF0aW9uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgcGFyc2VJc28gPSBmdW5jdGlvbiAoaW5wKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0cyBmbG9hdHMgdG8gaW50cy5cbiAgICAgICAgICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgICAgICAgICAgLy8gYXBwbHkgc2lnbiB3aGlsZSB3ZSdyZSBhdCBpdFxuICAgICAgICAgICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiBwYXJzZUlzbyhtYXRjaFsyXSksXG4gICAgICAgICAgICAgICAgTTogcGFyc2VJc28obWF0Y2hbM10pLFxuICAgICAgICAgICAgICAgIGQ6IHBhcnNlSXNvKG1hdGNoWzRdKSxcbiAgICAgICAgICAgICAgICBoOiBwYXJzZUlzbyhtYXRjaFs1XSksXG4gICAgICAgICAgICAgICAgbTogcGFyc2VJc28obWF0Y2hbNl0pLFxuICAgICAgICAgICAgICAgIHM6IHBhcnNlSXNvKG1hdGNoWzddKSxcbiAgICAgICAgICAgICAgICB3OiBwYXJzZUlzbyhtYXRjaFs4XSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShtb21lbnQoZHVyYXRpb24uZnJvbSksIG1vbWVudChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG1vbWVudC52ZXJzaW9uID0gVkVSU0lPTjtcblxuICAgIC8vIGRlZmF1bHQgZm9ybWF0XG4gICAgbW9tZW50LmRlZmF1bHRGb3JtYXQgPSBpc29Gb3JtYXQ7XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgSVNPIHN0YW5kYXJkXG4gICAgbW9tZW50LklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBQbHVnaW5zIHRoYXQgYWRkIHByb3BlcnRpZXMgc2hvdWxkIGFsc28gYWRkIHRoZSBrZXkgaGVyZSAobnVsbCB2YWx1ZSksXG4gICAgLy8gc28gd2UgY2FuIHByb3Blcmx5IGNsb25lIG91cnNlbHZlcy5cbiAgICBtb21lbnQubW9tZW50UHJvcGVydGllcyA9IG1vbWVudFByb3BlcnRpZXM7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgbW9tZW50LnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgbW9tZW50LnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGZ1bmN0aW9uICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmIChyZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRpdmVUaW1lVGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHJlbGF0aXZlVGltZVRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgbW9tZW50LmxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmxvY2FsZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxvY2FsZSBrZXkuXG4gICAgbW9tZW50LmxvY2FsZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZih2YWx1ZXMpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBtb21lbnQuZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBtb21lbnQubG9jYWxlRGF0YShrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vbWVudC5fbG9jYWxlLl9hYmJyO1xuICAgIH07XG5cbiAgICBtb21lbnQuZGVmaW5lTG9jYWxlID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlcykge1xuICAgICAgICBpZiAodmFsdWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZXMuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXS5zZXQodmFsdWVzKTtcblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgICBtb21lbnQubG9jYWxlKG5hbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHVzZWZ1bCBmb3IgdGVzdGluZ1xuICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb21lbnQubGFuZ0RhdGEgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQubGFuZ0RhdGEgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGVEYXRhIGluc3RlYWQuJyxcbiAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGVEYXRhKGtleSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gcmV0dXJucyBsb2NhbGUgZGF0YVxuICAgIG1vbWVudC5sb2NhbGVEYXRhID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xuICAgIH07XG5cbiAgICAvLyBjb21wYXJlIG1vbWVudCBvYmplY3RcbiAgICBtb21lbnQuaXNNb21lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHxcbiAgICAgICAgICAgIChvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wKG9iaiwgJ19pc0FNb21lbnRPYmplY3QnKSk7XG4gICAgfTtcblxuICAgIC8vIGZvciB0eXBlY2hlY2tpbmcgRHVyYXRpb24gb2JqZWN0c1xuICAgIG1vbWVudC5pc0R1cmF0aW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfTtcblxuICAgIGZvciAoaSA9IGxpc3RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIG1ha2VMaXN0KGxpc3RzW2ldKTtcbiAgICB9XG5cbiAgICBtb21lbnQubm9ybWFsaXplVW5pdHMgPSBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LmludmFsaWQgPSBmdW5jdGlvbiAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBtb21lbnQudXRjKE5hTik7XG4gICAgICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgICAgICBleHRlbmQobS5fcGYsIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG0uX3BmLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlWm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH07XG5cbiAgICBtb21lbnQucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBNb21lbnQgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBleHRlbmQobW9tZW50LmZuID0gTW9tZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgIGNsb25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLl9kICsgKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5peCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCt0aGlzIC8gMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9EYXRlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldCA/IG5ldyBEYXRlKCt0aGlzKSA6IHRoaXMuX2Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9JU09TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IG1vbWVudCh0aGlzKS51dGMoKTtcbiAgICAgICAgICAgIGlmICgwIDwgbS55ZWFyKCkgJiYgbS55ZWFyKCkgPD0gOTk5OSkge1xuICAgICAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0b0FycmF5IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBtLnllYXIoKSxcbiAgICAgICAgICAgICAgICBtLm1vbnRoKCksXG4gICAgICAgICAgICAgICAgbS5kYXRlKCksXG4gICAgICAgICAgICAgICAgbS5ob3VycygpLFxuICAgICAgICAgICAgICAgIG0ubWludXRlcygpLFxuICAgICAgICAgICAgICAgIG0uc2Vjb25kcygpLFxuICAgICAgICAgICAgICAgIG0ubWlsbGlzZWNvbmRzKClcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNWYWxpZCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzRFNUU2hpZnRlZCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpICYmIGNvbXBhcmVBcnJheXModGhpcy5fYSwgKHRoaXMuX2lzVVRDID8gbW9tZW50LnV0Yyh0aGlzLl9hKSA6IG1vbWVudCh0aGlzLl9hKSkudG9BcnJheSgpKSA+IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzaW5nRmxhZ3MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCB0aGlzLl9wZik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52YWxpZEF0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGYub3ZlcmZsb3c7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXRjIDogZnVuY3Rpb24gKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmUoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9jYWwgOiBmdW5jdGlvbiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzVVRDKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lKDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCh0aGlzLl9kYXRlVHpPZmZzZXQoKSwgJ20nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgbW9tZW50LmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBjcmVhdGVBZGRlcigxLCAnYWRkJyksXG5cbiAgICAgICAgc3VidHJhY3QgOiBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0JyksXG5cbiAgICAgICAgZGlmZiA6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gbWFrZUFzKGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgICAgICB6b25lRGlmZiA9ICh0aGlzLnpvbmUoKSAtIHRoYXQuem9uZSgpKSAqIDZlNCxcbiAgICAgICAgICAgICAgICBkaWZmLCBvdXRwdXQsIGRheXNBZGp1c3Q7XG5cbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJykge1xuICAgICAgICAgICAgICAgIC8vIGF2ZXJhZ2UgbnVtYmVyIG9mIGRheXMgaW4gdGhlIG1vbnRocyBpbiB0aGUgZ2l2ZW4gZGF0ZXNcbiAgICAgICAgICAgICAgICBkaWZmID0gKHRoaXMuZGF5c0luTW9udGgoKSArIHRoYXQuZGF5c0luTW9udGgoKSkgKiA0MzJlNTsgLy8gMjQgKiA2MCAqIDYwICogMTAwMCAvIDJcbiAgICAgICAgICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICAgICAgICAgIG91dHB1dCA9ICgodGhpcy55ZWFyKCkgLSB0aGF0LnllYXIoKSkgKiAxMikgKyAodGhpcy5tb250aCgpIC0gdGhhdC5tb250aCgpKTtcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgYnkgdGFraW5nIGRpZmZlcmVuY2UgaW4gZGF5cywgYXZlcmFnZSBudW1iZXIgb2YgZGF5c1xuICAgICAgICAgICAgICAgIC8vIGFuZCBkc3QgaW4gdGhlIGdpdmVuIG1vbnRocy5cbiAgICAgICAgICAgICAgICBkYXlzQWRqdXN0ID0gKHRoaXMgLSBtb21lbnQodGhpcykuc3RhcnRPZignbW9udGgnKSkgLVxuICAgICAgICAgICAgICAgICAgICAodGhhdCAtIG1vbWVudCh0aGF0KS5zdGFydE9mKCdtb250aCcpKTtcbiAgICAgICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aXRoIHpvbmVzLCB0byBuZWdhdGUgYWxsIGRzdFxuICAgICAgICAgICAgICAgIGRheXNBZGp1c3QgLT0gKCh0aGlzLnpvbmUoKSAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCdtb250aCcpLnpvbmUoKSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoYXQuem9uZSgpIC0gbW9tZW50KHRoYXQpLnN0YXJ0T2YoJ21vbnRoJykuem9uZSgpKSkgKiA2ZTQ7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGRheXNBZGp1c3QgLyBkaWZmO1xuICAgICAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlmZiA9ICh0aGlzIC0gdGhhdCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdW5pdHMgPT09ICdzZWNvbmQnID8gZGlmZiAvIDFlMyA6IC8vIDEwMDBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdtaW51dGUnID8gZGlmZiAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2hvdXInID8gZGlmZiAvIDM2ZTUgOiAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2RheScgPyAoZGlmZiAtIHpvbmVEaWZmKSAvIDg2NGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRpZmYgLSB6b25lRGlmZikgLyA2MDQ4ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0ICogNywgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgICAgICBkaWZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNSb3VuZChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb20gOiBmdW5jdGlvbiAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5kdXJhdGlvbih7dG86IHRoaXMsIGZyb206IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb21Ob3cgOiBmdW5jdGlvbiAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShtb21lbnQoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FsZW5kYXIgOiBmdW5jdGlvbiAodGltZSkge1xuICAgICAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIHpvbmUnZCBvciBub3QuXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBtb21lbnQoKSxcbiAgICAgICAgICAgICAgICBzb2QgPSBtYWtlQXMobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgICAgICBkaWZmID0gdGhpcy5kaWZmKHNvZCwgJ2RheXMnLCB0cnVlKSxcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQodGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBtb21lbnQobm93KSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzTGVhcFllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1QgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDApLnpvbmUoKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnpvbmUoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9udGggOiBtYWtlQWNjZXNzb3IoJ01vbnRoJywgdHJ1ZSksXG5cbiAgICAgICAgc3RhcnRPZiA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgICAgICAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICd3ZWVrJykge1xuICAgICAgICAgICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKE1hdGguZmxvb3IodGhpcy5tb250aCgpIC8gMykgKiAzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5kT2Y6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09IHVuZGVmaW5lZCB8fCB1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0FmdGVyOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudC5pc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IG1vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzID4gK2lucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dE1zID0gbW9tZW50LmlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICttb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dE1zIDwgK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpc0JlZm9yZTogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQuaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBtb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcyA8ICtpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXRNcyA9IG1vbWVudC5pc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbW9tZW50KGlucHV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5lbmRPZih1bml0cykgPCBpbnB1dE1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2FtZTogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzIHx8ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQuaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBtb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcyA9PT0gK2lucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dE1zID0gK21vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICsodGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpKSA8PSBpbnB1dE1zICYmIGlucHV0TXMgPD0gKyh0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtaW46IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICAgb3RoZXIgPSBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICksXG5cbiAgICAgICAgbWF4OiBkZXByZWNhdGUoXG4gICAgICAgICAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyID0gbW9tZW50LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgICAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bem9uZSgyLCB0cnVlKV0tLT5cbiAgICAgICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCBpbnQgem9uZVxuICAgICAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgICAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAgICAgLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuICAgICAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAgICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICAgICAgem9uZSA6IGZ1bmN0aW9uIChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0O1xuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSB0aGlzLl9kYXRlVHpPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VidHJhY3QobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudC5kdXJhdGlvbihvZmZzZXQgLSBpbnB1dCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogdGhpcy5fZGF0ZVR6T2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICB6b25lQWJiciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgem9uZU5hbWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2Vab25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3R6bSkge1xuICAgICAgICAgICAgICAgIHRoaXMuem9uZSh0aGlzLl90em0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUodGhpcy5faSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNBbGlnbmVkSG91ck9mZnNldCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbW9tZW50KGlucHV0KS56b25lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAodGhpcy56b25lKCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXlzSW5Nb250aCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXlPZlllYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBkYXlPZlllYXIgPSByb3VuZCgobW9tZW50KHRoaXMpLnN0YXJ0T2YoJ2RheScpIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSBkYXlPZlllYXIpLCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHF1YXJ0ZXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrWWVhciA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2VlayA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHdlZWsgPSB0aGlzLmxvY2FsZURhdGEoKS53ZWVrKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWsgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla2RheSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgICAgIC8vIGFzIGEgc2V0dGVyLCBzdW5kYXkgc2hvdWxkIGJlbG9uZyB0byB0aGUgcHJldmlvdXMgd2Vlay5cbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gdGhpcy5kYXkoKSB8fCA3IDogdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyBpbnB1dCA6IGlucHV0IC0gNyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla3NJblllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtzSW5ZZWFyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbdW5pdHNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gSWYgcGFzc2VkIGEgbG9jYWxlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxvY2FsZSBmb3IgdGhpc1xuICAgICAgICAvLyBpbnN0YW5jZS4gIE90aGVyd2lzZSwgaXQgd2lsbCByZXR1cm4gdGhlIGxvY2FsZSBjb25maWd1cmF0aW9uXG4gICAgICAgIC8vIHZhcmlhYmxlcyBmb3IgdGhpcyBpbnN0YW5jZS5cbiAgICAgICAgbG9jYWxlIDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0xvY2FsZURhdGEgPSBtb21lbnQubG9jYWxlRGF0YShrZXkpO1xuICAgICAgICAgICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGFuZyA6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICksXG5cbiAgICAgICAgbG9jYWxlRGF0YSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2RhdGVUek9mZnNldCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIE9uIEZpcmVmb3guMjQgRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIGEgZmxvYXRpbmcgcG9pbnQuXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiByYXdNb250aFNldHRlcihtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyBvdXQgb2YgaGVyZSFcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksXG4gICAgICAgICAgICAgICAgZGF5c0luTW9udGgobW9tLnllYXIoKSwgdmFsdWUpKTtcbiAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArICdNb250aCddKHZhbHVlLCBkYXlPZk1vbnRoKTtcbiAgICAgICAgcmV0dXJuIG1vbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYXdHZXR0ZXIobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYXdTZXR0ZXIobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICBpZiAodW5pdCA9PT0gJ01vbnRoJykge1xuICAgICAgICAgICAgcmV0dXJuIHJhd01vbnRoU2V0dGVyKG1vbSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlQWNjZXNzb3IodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByYXdTZXR0ZXIodGhpcywgdW5pdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3R2V0dGVyKHRoaXMsIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG1vbWVudC5mbi5taWxsaXNlY29uZCA9IG1vbWVudC5mbi5taWxsaXNlY29uZHMgPSBtYWtlQWNjZXNzb3IoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcbiAgICBtb21lbnQuZm4uc2Vjb25kID0gbW9tZW50LmZuLnNlY29uZHMgPSBtYWtlQWNjZXNzb3IoJ1NlY29uZHMnLCBmYWxzZSk7XG4gICAgbW9tZW50LmZuLm1pbnV0ZSA9IG1vbWVudC5mbi5taW51dGVzID0gbWFrZUFjY2Vzc29yKCdNaW51dGVzJywgZmFsc2UpO1xuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIGhlIHdhbnRzLiBTbyB0cnlpbmcgdG8gbWFpbnRhaW4gdGhlIHNhbWUgaG91ciAoaW5cbiAgICAvLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbiAgICAvLyB0aGlzIHJ1bGUuXG4gICAgbW9tZW50LmZuLmhvdXIgPSBtb21lbnQuZm4uaG91cnMgPSBtYWtlQWNjZXNzb3IoJ0hvdXJzJywgdHJ1ZSk7XG4gICAgLy8gbW9tZW50LmZuLm1vbnRoIGlzIGRlZmluZWQgc2VwYXJhdGVseVxuICAgIG1vbWVudC5mbi5kYXRlID0gbWFrZUFjY2Vzc29yKCdEYXRlJywgdHJ1ZSk7XG4gICAgbW9tZW50LmZuLmRhdGVzID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIG1ha2VBY2Nlc3NvcignRGF0ZScsIHRydWUpKTtcbiAgICBtb21lbnQuZm4ueWVhciA9IG1ha2VBY2Nlc3NvcignRnVsbFllYXInLCB0cnVlKTtcbiAgICBtb21lbnQuZm4ueWVhcnMgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQuJywgbWFrZUFjY2Vzc29yKCdGdWxsWWVhcicsIHRydWUpKTtcblxuICAgIC8vIGFkZCBwbHVyYWwgbWV0aG9kc1xuICAgIG1vbWVudC5mbi5kYXlzID0gbW9tZW50LmZuLmRheTtcbiAgICBtb21lbnQuZm4ubW9udGhzID0gbW9tZW50LmZuLm1vbnRoO1xuICAgIG1vbWVudC5mbi53ZWVrcyA9IG1vbWVudC5mbi53ZWVrO1xuICAgIG1vbWVudC5mbi5pc29XZWVrcyA9IG1vbWVudC5mbi5pc29XZWVrO1xuICAgIG1vbWVudC5mbi5xdWFydGVycyA9IG1vbWVudC5mbi5xdWFydGVyO1xuXG4gICAgLy8gYWRkIGFsaWFzZWQgZm9ybWF0IG1ldGhvZHNcbiAgICBtb21lbnQuZm4udG9KU09OID0gbW9tZW50LmZuLnRvSVNPU3RyaW5nO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEdXJhdGlvbiBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIGRheXNUb1llYXJzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgcmV0dXJuIGRheXMgKiA0MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24geWVhcnNUb0RheXMgKHllYXJzKSB7XG4gICAgICAgIC8vIHllYXJzICogMzY1ICsgYWJzUm91bmQoeWVhcnMgLyA0KSAtXG4gICAgICAgIC8vICAgICBhYnNSb3VuZCh5ZWFycyAvIDEwMCkgKyBhYnNSb3VuZCh5ZWFycyAvIDQwMCk7XG4gICAgICAgIHJldHVybiB5ZWFycyAqIDE0NjA5NyAvIDQwMDtcbiAgICB9XG5cbiAgICBleHRlbmQobW9tZW50LmR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlLCB7XG5cbiAgICAgICAgX2J1YmJsZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMsXG4gICAgICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9kYXRhLFxuICAgICAgICAgICAgICAgIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycyA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAgICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICAgICAgc2Vjb25kcyA9IGFic1JvdW5kKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICAgICAgZGF0YS5zZWNvbmRzID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBtaW51dGVzID0gYWJzUm91bmQoc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEubWludXRlcyA9IG1pbnV0ZXMgJSA2MDtcblxuICAgICAgICAgICAgaG91cnMgPSBhYnNSb3VuZChtaW51dGVzIC8gNjApO1xuICAgICAgICAgICAgZGF0YS5ob3VycyA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgICAgIGRheXMgKz0gYWJzUm91bmQoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgICAgIC8vIEFjY3VyYXRlbHkgY29udmVydCBkYXlzIHRvIHllYXJzLCBhc3N1bWUgc3RhcnQgZnJvbSB5ZWFyIDAuXG4gICAgICAgICAgICB5ZWFycyA9IGFic1JvdW5kKGRheXNUb1llYXJzKGRheXMpKTtcbiAgICAgICAgICAgIGRheXMgLT0gYWJzUm91bmQoeWVhcnNUb0RheXMoeWVhcnMpKTtcblxuICAgICAgICAgICAgLy8gMzAgZGF5cyB0byBhIG1vbnRoXG4gICAgICAgICAgICAvLyBUT0RPIChpc2tyZW4pOiBVc2UgYW5jaG9yIGRhdGUgKGxpa2UgMXN0IEphbikgdG8gY29tcHV0ZSB0aGlzLlxuICAgICAgICAgICAgbW9udGhzICs9IGFic1JvdW5kKGRheXMgLyAzMCk7XG4gICAgICAgICAgICBkYXlzICU9IDMwO1xuXG4gICAgICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgICAgICB5ZWFycyArPSBhYnNSb3VuZChtb250aHMgLyAxMik7XG4gICAgICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgICAgIGRhdGEuZGF5cyA9IGRheXM7XG4gICAgICAgICAgICBkYXRhLm1vbnRocyA9IG1vbnRocztcbiAgICAgICAgICAgIGRhdGEueWVhcnMgPSB5ZWFycztcbiAgICAgICAgfSxcblxuICAgICAgICBhYnMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBNYXRoLmFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyA9IE1hdGguYWJzKHRoaXMuX2RheXMpO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzID0gTWF0aC5hYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICAgICAgdGhpcy5fZGF0YS5taWxsaXNlY29uZHMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhLnNlY29uZHMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLnNlY29uZHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YS5taW51dGVzID0gTWF0aC5hYnModGhpcy5fZGF0YS5taW51dGVzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEuaG91cnMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLmhvdXJzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEubW9udGhzID0gTWF0aC5hYnModGhpcy5fZGF0YS5tb250aHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YS55ZWFycyA9IE1hdGguYWJzKHRoaXMuX2RhdGEueWVhcnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrcyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhYnNSb3VuZCh0aGlzLmRheXMoKSAvIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICAgIHRvSW50KHRoaXMuX21vbnRocyAvIDEyKSAqIDMxNTM2ZTY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaHVtYW5pemUgOiBmdW5jdGlvbiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHJlbGF0aXZlVGltZSh0aGlzLCAhd2l0aFN1ZmZpeCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuXG4gICAgICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMubG9jYWxlRGF0YSgpLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIGFkZCgxLCAncycpIG9yIGFkZChtb21lbnQpXG4gICAgICAgICAgICB2YXIgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlucHV0LCB2YWwpO1xuXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgKz0gZHVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICB0aGlzLl9kYXlzICs9IGR1ci5fZGF5cztcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyArPSBkdXIuX21vbnRocztcblxuICAgICAgICAgICAgdGhpcy5fYnViYmxlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnRyYWN0IDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciBkdXIgPSBtb21lbnQuZHVyYXRpb24oaW5wdXQsIHZhbCk7XG5cbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyAtPSBkdXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHRoaXMuX2RheXMgLT0gZHVyLl9kYXlzO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzIC09IGR1ci5fbW9udGhzO1xuXG4gICAgICAgICAgICB0aGlzLl9idWJibGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzLnRvTG93ZXJDYXNlKCkgKyAncyddKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXMgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHZhciBkYXlzLCBtb250aHM7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb1llYXJzKGRheXMpICogMTI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRzID09PSAnbW9udGgnID8gbW9udGhzIDogbW9udGhzIC8gMTI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIE1hdGgucm91bmQoeWVhcnNUb0RheXModGhpcy5fbW9udGhzIC8gMTIpKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnOiByZXR1cm4gZGF5cyAvIDcgKyB0aGlzLl9taWxsaXNlY29uZHMgLyA2MDQ4ZTU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RheSc6IHJldHVybiBkYXlzICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInOiByZXR1cm4gZGF5cyAqIDI0ICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJzogcmV0dXJuIGRheXMgKiAyNCAqIDYwICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnOiByZXR1cm4gZGF5cyAqIDI0ICogNjAgKiA2MCArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSArIHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGFuZyA6IG1vbWVudC5mbi5sYW5nLFxuICAgICAgICBsb2NhbGUgOiBtb21lbnQuZm4ubG9jYWxlLFxuXG4gICAgICAgIHRvSXNvU3RyaW5nIDogZGVwcmVjYXRlKFxuICAgICAgICAgICAgJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgJyArXG4gICAgICAgICAgICAnKG5vdGljZSB0aGUgY2FwaXRhbHMpJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIHRvSVNPU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgICAgIHZhciB5ZWFycyA9IE1hdGguYWJzKHRoaXMueWVhcnMoKSksXG4gICAgICAgICAgICAgICAgbW9udGhzID0gTWF0aC5hYnModGhpcy5tb250aHMoKSksXG4gICAgICAgICAgICAgICAgZGF5cyA9IE1hdGguYWJzKHRoaXMuZGF5cygpKSxcbiAgICAgICAgICAgICAgICBob3VycyA9IE1hdGguYWJzKHRoaXMuaG91cnMoKSksXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IE1hdGguYWJzKHRoaXMubWludXRlcygpKSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnModGhpcy5zZWNvbmRzKCkgKyB0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTAwMCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5hc1NlY29uZHMoKSkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgICAgICAvLyBidXQgbm90IG90aGVyIEpTIChnb29nLmRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuYXNTZWNvbmRzKCkgPCAwID8gJy0nIDogJycpICtcbiAgICAgICAgICAgICAgICAnUCcgK1xuICAgICAgICAgICAgICAgICh5ZWFycyA/IHllYXJzICsgJ1knIDogJycpICtcbiAgICAgICAgICAgICAgICAobW9udGhzID8gbW9udGhzICsgJ00nIDogJycpICtcbiAgICAgICAgICAgICAgICAoZGF5cyA/IGRheXMgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgICAgICgoaG91cnMgfHwgbWludXRlcyB8fCBzZWNvbmRzKSA/ICdUJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKGhvdXJzID8gaG91cnMgKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgICAgIChtaW51dGVzID8gbWludXRlcyArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKHNlY29uZHMgPyBzZWNvbmRzICsgJ1MnIDogJycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxvY2FsZURhdGEgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBtb21lbnQuZHVyYXRpb24uZm4udG9TdHJpbmcgPSBtb21lbnQuZHVyYXRpb24uZm4udG9JU09TdHJpbmc7XG5cbiAgICBmdW5jdGlvbiBtYWtlRHVyYXRpb25HZXR0ZXIobmFtZSkge1xuICAgICAgICBtb21lbnQuZHVyYXRpb24uZm5bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKGkgaW4gdW5pdE1pbGxpc2Vjb25kRmFjdG9ycykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcCh1bml0TWlsbGlzZWNvbmRGYWN0b3JzLCBpKSkge1xuICAgICAgICAgICAgbWFrZUR1cmF0aW9uR2V0dGVyKGkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdtcycpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzU2Vjb25kcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3MnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc01pbnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdtJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNIb3VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ2gnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc0RheXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdkJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNXZWVrcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3dlZWtzJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNb250aHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdNJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNZZWFycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3knKTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEZWZhdWx0IExvY2FsZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gU2V0IGRlZmF1bHQgbG9jYWxlLCBvdGhlciBsb2NhbGUgd2lsbCBpbmhlcml0IGZyb20gRW5nbGlzaC5cbiAgICBtb21lbnQubG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qIEVNQkVEX0xPQ0FMRVMgKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTW9tZW50XG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbWFrZUdsb2JhbChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvbGRHbG9iYWxNb21lbnQgPSBnbG9iYWxTY29wZS5tb21lbnQ7XG4gICAgICAgIGlmIChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2Vzc2luZyBNb21lbnQgdGhyb3VnaCB0aGUgZ2xvYmFsIHNjb3BlIGlzICcgK1xuICAgICAgICAgICAgICAgICAgICAnZGVwcmVjYXRlZCwgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhbiB1cGNvbWluZyAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3JlbGVhc2UuJyxcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG1vbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG1vbWVudDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ21vbWVudCcsIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICAgICAgICAgIGlmIChtb2R1bGUuY29uZmlnICYmIG1vZHVsZS5jb25maWcoKSAmJiBtb2R1bGUuY29uZmlnKCkubm9HbG9iYWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyByZWxlYXNlIHRoZSBnbG9iYWwgdmFyaWFibGVcbiAgICAgICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBvbGRHbG9iYWxNb21lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtb21lbnQ7XG4gICAgICAgIH0pO1xuICAgICAgICBtYWtlR2xvYmFsKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1ha2VHbG9iYWwoKTtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
