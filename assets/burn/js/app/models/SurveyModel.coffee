AppModel = require './AppModel.coffee'

class SurveyModel extends Backbone.Model



    initialize:  (opts) ->
        super opts



        @on 'error' , @handleError
        @on 'change:recruitNumber' , =>
            AppModel.getInstance().set('recruitNumber', @get("recruitNumber"))



    handleError: (ctx , res) =>

        switch(res.status)
            when 403
                @trigger 'forbidden'
            when 404
                @set 'username' , res.responseJSON.username
                @set 'recruitNumber' , res.responseJSON.recruitNumber

                @trigger 'notfound'






module.exports = SurveyModel

