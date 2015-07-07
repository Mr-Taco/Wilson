/**
 * Created by wildlife009 on 12/19/14.
 */

var moment = require('moment');
var lookupInterval = 15;



var caches = [];
caches['tweets'] = {data:[] , lastUpdated:0};
caches['posts'] = {data:[] , lastUpdated:0};
caches['grams'] = {data:[] , lastUpdated:0};

var getSeconds = function(date) {
    if (date !== undefined) {
        date = new Date(date).getTime()
    }else{
        date = new Date().getTime()
    }

    return Math.floor(date/1000 );
};

var sortDates = function (a,b) {
    return new Date(b.date.toString()) - new Date(a.date.toString());
};



var isDate = function (date) {
    var val = false;
    if(date !== undefined && date !== null)
        date = new Date(date);


    if(date instanceof Date && !isNaN(date.valueOf()))
        val = true;


    return val;
};

var getRange = function (allResults,from,to,limit) {



    var result = [];
    var r1 = -1;
    var r2 = -1;


    if(isDate(to) && isDate(from)) {
        var to =  getSeconds(to);
        var from = getSeconds(from);



        for(var i = allResults.length-1; i >= 0 ; i--) {
            var post = allResults[i];
            var postDate = getSeconds(post.date);


            if(postDate >= from && r2 < 0) {
                r2 = i;
            }

            if(postDate > to && r1 < 0) {
                r1 = i;
            }
        }

        var range = r2-r1;
        if(!isNaN(limit)  && range > limit){
            range = limit;
        }

        result = allResults.splice(r1, range);


    }else if(isDate(to)) {

        var to =  getSeconds(to);
        for(var i =0; i < allResults.length ; i++) {
            var post = allResults[i];
            var postDate = getSeconds(post.date);
            if(postDate < to && r1 < 0 ) {
                r1 = i;
            }
        }

        var range = allResults.length - r1;
        if(!isNaN(limit)  && range > limit){
            range = limit;
        }

        result = allResults.splice(r1, range);



    }else{
        var range = allResults.length;

        if(!isNaN(limit)  && range > limit){
            range = limit;
        }
        result = allResults.splice(0, range);
    }





    return result;
};

var list = module.exports.list = function (type, from, to ,limit, next) {

    if(type === undefined)
        return listAll(from,to,limit,next);

    var module = Social[type];
    var limit = isNaN(limit) ? 0 : limit;


    if(caches[type].lastUpdated < getSeconds() - lookupInterval ) {

        caches[type].lastUpdated = getSeconds();
        var query = module.model.find({approved:true});
        query.sort("date DESC");
        query.exec(function (err , results) {
            if(err)
                return next(err);

            caches[type].data = results;
            caches[type].data.sort(sortDates);


            next(null, caches[type].data);

        });
    }else{
        return next(null, caches[type].data);
    }









};



var listAll = module.exports.listAll = function (from, to, limit,next) {

    var providerLength = Object.keys(Social).length;
    var resultsLoaded = 0;
    var allPosts = [];

    function data() {

        return function (err , results) {
            if(err)
                return next(err);


            allPosts.unshift.apply(allPosts, results);
            resultsLoaded++;

            if (resultsLoaded === providerLength){
                allPosts.sort(sortDates);
                allPosts = _.uniq(allPosts, true, "id");
                allPosts = getRange(allPosts, from,to, limit);


                next(null, allPosts);
            }



        }
    }


    for(var t in Social) {

        list(t,null,null,0,data());


    }



};

