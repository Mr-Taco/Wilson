
PostViewBase = require '../abstract/PostViewBase.coffee'


class InstagramPostView extends PostViewBase


    constructor: (opts) ->

        @template = require '../../../../templates/connect/instagram-post.jade'

        super(opts)



module.exports = InstagramPostView


