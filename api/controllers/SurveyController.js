/**
 * SurveyController
 *
 * @description :: Server-side logic for managing Surveys
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



    login: function (req,res) {

        var password = req.body.password;
        var sysPassword = process.env.SURVEY_PASSWORD;

        password = password.split("#").join("").toLowerCase();
        sysPassword = sysPassword.split("#").join("").toLowerCase()


        Survey.count().exec(function (err, length) {


            if(password === sysPassword){

                req.session.username = req.body.identifier;
                req.session.recruitNumber = length + 1;
                return res.ok();

            }else {
                return res.forbidden();
            }


        });



    },
    /**
     * `SurveyController.create()`
     */
    create: function (req, res) {
        var survey = req.body;
        survey.session = req.sessionID;
        survey.username = req.session.username;

        Survey.create(survey,function (err, result) {
            if(err) {
                return res.badRequest(err);
            }
            return res.ok(result);

        });
    },


    /**
     * `SurveyController.update()`
     */
    update: function (req, res) {
        var survey = req.body;

        Survey.update({session:req.sessionID, username:req.session.username},survey,function (err,result){
            if(err) {
                return res.badRequest(err);
            }
            if(!result){
                return res.badRequest();
            }
            return res.ok(result);
        });
    },


    /**
     * `SurveyController.view()`
     */
    view: function (req, res) {
        if(!req.session.username)
            return res.forbidden();

        Survey.findOne().where({session:req.sessionID,username:req.session.username}).exec(function (err,result){
            if(err) {
                return res.badRequest(err);
            }
            if(!result) {
                res.status(404);
                return res.json({
                    username:req.session.username,
                    recruitNumber: req.session.recruitNumber
                });
            }
            return res.ok(result);
        });
    }
};

