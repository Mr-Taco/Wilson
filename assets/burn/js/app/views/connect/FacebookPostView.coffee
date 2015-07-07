
PostViewBase = require '../abstract/PostViewBase.coffee'



class FacebookPostView extends PostViewBase


    constructor: (opts) ->
        @template = require '../../../../templates/connect/facebook-post.jade'
        super(opts)



module.exports = FacebookPostView


