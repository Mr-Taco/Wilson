
PostViewBase = require '../abstract/PostViewBase.coffee'



class TwitterPostView extends PostViewBase


    constructor: (opts) ->
        @template = require '../../../../templates/connect/twitter-post.jade'
        super(opts)


    initialize: (opts) ->
        super(opts)
        # @parseEntities()






    parseEntities: ->

        text = @model.get('text')
        text = text.split("&amp;").join("&")
        @model.set('text' , text)

    afterRender: ->









module.exports = TwitterPostView


