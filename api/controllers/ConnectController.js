/**
 * Created by wildlife009 on 12/18/14.
 */

var socialRepository = require('./repository/social');


var ConnectController  = {

    index: function (req, res) {
        res.view();
    },





    list: function(req,res) {

        var type = req.query.type;
        var fromDate = req.query.from;
        var toDate = req.query.to;
        var limit = parseInt(req.query.limit);
        var page = parseInt(req.query.page);


        socialRepository.list(type,fromDate, toDate , limit,function(err,posts){
            if(err)
                return res.serverError(err);

            var result = posts;
            res.json(result);

        });


    },



    approve: function (req,res) {

        var id = req.body.id;
        var type = req.body.type;
        var approved = req.body.approved;

        if(typeof(approved) !== 'boolean' && approved !== "true")
            approved = false;
        else
            approved = true;

        socialRepository.approve(type,id,approved,function(err,changed){
            if(err)
                res.serverError(err);

            res.json({
                changed:changed
            });

        });

    },

    feature: function (req,res) {

        var id = req.body.id;
        var type = req.body.type;
        var featured = req.body.featured;

        if(typeof(featured) !== 'boolean' && featured !== "true")
            featured = false;
        else
            featured = true;


        socialRepository.feature(type,id,featured,function(err,changed){
            if(err)
                res.serverError(err);

            res.json({
                changed:changed
            });

        });

    }





};


module.exports = ConnectController;
