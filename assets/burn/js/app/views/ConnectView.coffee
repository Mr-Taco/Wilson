
ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'
Tracking = require '../utils/track.coffee'


PostViews = []
PostViews['facebook'] = require './connect/FacebookPostView.coffee'
PostViews['instagram'] = require './connect/InstagramPostView.coffee'
PostViews['twitter'] = require './connect/TwitterPostView.coffee'


class ConnectView extends ViewBase


    constructor: (opts) ->
        @appModel = AppModel.getInstance()
        @posts = []
        @page = 1
        @limit = 20

        super(opts)

    initialize: (opts) ->
        super()

        @container = @$el.find("#connect-masonry")


        @container.packery
            itemSelector: '.item'
            columnWidth:'.shuffle_sizer'
            gutter:parseInt $('.shuffle_sizer').css('margin-left')
            isInitLayout: true

        @container.packery('on' , 'layoutComplete' , @onLayoutComplete)



        @model.on 'add' , @renderPost
        @model.on 'modelSetAdded' , @modelSetAdded
        @resetEvents()




    resetEvents: =>
        $(window).on 'scroll' ,  @onScroll
        @undelegateEvents()
        @delegateEvents(@generateEvents())

        if @isPhone
            @resizeImages()

    generateEvents: ->
        events = {}

        events['click #social a'] = "onSocialClick"
        
        if ($('html').hasClass('tablet')) || ($('html').hasClass('phone'))
            events['click .item .square-post'] = "simulateHover"
            events['click .item .hover-overlay'] = "goToPost"

        return events

    simulateHover: (e) ->
        e.preventDefault()
        $('.item').removeClass 'touch-hover'
        $(e.target).parents('.item').addClass 'touch-hover'

    goToPost: (e) ->
        if !($(e.target).parents('.item').hasClass 'touch-hover')
            e.preventDefault()
        else
            window.open($(e.target).parents('a').attr('href'), "_blank")


    onSocialClick: (e) ->
        $target = $(e.target).closest("a")
        Tracking.gaTrackElement($target)


    onScroll: (e)=>

        scrollPosition = Math.ceil $(window).scrollTop()
        scrollMax = Math.floor $(document).height() - $(window).height()

        if scrollPosition is scrollMax

            $(window).off 'scroll' ,  @onScroll
            @loadPosts()

    loadPosts: =>
        @postSet = []
        @model.to = @getLastItemDate()

        @model.setUrl(@appModel.get('services').list)
        @model.loadMore()

    getLastItemDate: ->
        lastItem = @container.find('.item').last()
        if lastItem.length > 0

            return lastItem.data('date')
        else
            return null
    modelSetAdded: =>
        $items = $(@postSet)


    renderPost: (post) =>
        ignore = false

        if post.get('post_type') is 'facebook'
            if post.get('type') is 'status'
                ignore = true

        if !ignore
            instanceData =
                el:@container
                model:post

            postView = new PostViews[post.get('post_type')] instanceData
            postView.render()

            @container.append(postView.$el)
            @container.packery('appended' , postView.$el)
            @container.packery('fit', postView.$el)

            #@postSet.push postView.$el[0]





            @undelegateEvents()
            @delegateEvents(@generateEvents())



    onLayoutComplete: (packery , items) =>
        if !@isPhone
            captionSize = 100
        else
            captionSize = 50

        for item in items
            setTimeout ->
                $(item.element).find(".post-body").succinct({
                    size:100
                });
                $(item.element).find(".post-body").css('display' , 'inline');
                
                $(item.element).find('.square-post.small .caption').succinct({
                    size:captionSize
                });
            ,
                400



    resizeImages: (e) ->
        for img in $('.square-post.large')
            $(img).css {width: window.innerWidth}

        # for img in $('.square-post.small')
        #     $(img).css {height: window.innerWidth * .49}





module.exports = ConnectView


