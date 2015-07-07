AppModel = require './AppModel.coffee'

class PostsModel extends Backbone.Collection



    initialize:  (opts) ->
        super opts

        @to  =  null
        @limit = 20




    setUrl: (url) ->
        @url = url
        @url += "?limit=#{@limit}"
        if @to? then @url += "&to=#{@to}"




    loadMore: ->

        console.log "load More" , @url
        $.ajax
            url:@url
            method:"GET"
            contentType:"application/json"
            success: (data) =>
               for post in data
                    @add new Backbone.Model post
               @trigger "modelSetAdded"


    onMoreLoaded: ->


module.exports = PostsModel

