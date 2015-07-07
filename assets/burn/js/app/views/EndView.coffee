
ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'
Share = require '../utils/share.coffee'


class EndView extends ViewBase


    constructor: (opts) ->
        @model = AppModel.getInstance()
        @template = require '../../../templates/end.jade'

        super(opts)




    afterRender: ->
        super()
        #@populateTwitterShare()
        $('header').find("#username-display").html(@model.get('username'))
        $(".recruit-number").html(@model.get('recruitNumber'))
        $('header').addClass('show')



    populateTwitterShare: ->
        href = $("#twitter").attr('href')
        twitterShareMessage = @model.get("social").twitter.message
        twitterShareMessage = twitterShareMessage.split("{recruitNumber}").join(@model.get("recruitNumber"))
        twitterShareMessage = encodeURIComponent twitterShareMessage
        twitterShareMessage = twitterShareMessage.split("%20").join("+")
        href = href.split("{text}").join(twitterShareMessage)



        $("#twitter").attr('href' , href)



    generateEvents: ->

        events = {}
        if !@isTouch
            #events['click #fb'] = 'shareFacebook'
            events['mouseenter #instagram-share'] = 'showTooltip'
            events['mouseenter #instagram-share-hover'] = 'showTooltip'
            events['mouseleave #instagram-share-hover'] = 'hideTooltip'
        else
            #events['touchend #fb'] = 'shareFacebook'
            events['touchend #instagram-share'] = 'showTooltip'
            events['touchend #end-page'] = 'hideTooltip'

        return events

    shareFacebook: (e) =>

        e.preventDefault()

        caption = @model.get("social").facebook.caption
        title = @model.get("social").facebook.title
        image = window.location.origin + @model.get('social').facebook.image
        link = window.location.origin
        description = caption.split("{recruitNumber}").join(@model.get("recruitNumber"))
        caption = @model.get("social").facebook.description


        share.fbShare title , caption, image , link, description


    showTooltip: (e) =>
        # e.stopPropagation()
        # e.preventDefault()

        TweenMax.to  $('ol#social-btns li .tooltip') , .25 ,
            autoAlpha:1

    hideTooltip: (e) =>
        # e.preventDefault()
        TweenMax.to  $('ol#social-btns li .tooltip') , .25 ,
            autoAlpha:0



    showSocialHover: (e) =>
        if $(e.target).attr('id') == 'instagram-share'
            @showTooltip()

        $(e.target).animate {opacity: 0, zIndex: -1}, 150, "linear"
        $(e.target).next().animate {opacity: 1, zIndex: 1}, 150, "linear"

    hideSocialHover: (e) =>
        if $(e.target).attr('id') == 'instagram-share-hover'
            @hideTooltip()

        $(e.target).animate {opacity: 0, zIndex: -1}, 150, "linear"
        $(e.target).prev().animate {opacity: 1, zIndex: 1}, 150, "linear"


module.exports = EndView


