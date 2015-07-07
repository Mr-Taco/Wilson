
ViewBase = require './ViewBase.coffee'
AppModel = require '../../models/AppModel.coffee'


class PostViewBase extends ViewBase


    constructor: (opts) ->
        @appModel = AppModel.getInstance()
        super(opts)


    initialize: (opts) ->
        super(opts)




    render: () ->
        post =  @template {data: @model}
        @$el = $(post)
        @rendered = true
        @afterRender()




    generateEvents: ->

        events = {}

        events['click .approve'] = "approve"
        events['click .feature'] = "feature"



        return events

    approve: (e) =>
        e.preventDefault()
        $t = $(e.target).parentsUntil(".item").parent()
        $input = $t.find('.approve input')
        checked = $input.is(':checked')

        data =
            id:$t.data('id')
            type:$t.data('type')
            approved:!checked
            _csrf:@appModel.get("session").get('csrf')


        approveService = @appModel.get("services").approve

        @postData(approveService,data,$input)


    feature: (e) =>
        e.preventDefault()
        $t = $(e.target).parentsUntil(".item").parent()
        $input = $t.find('.feature input')
        checked = $input.is(':checked')

        data =
            id:$t.data('id')
            type:$t.data('type')
            featured:!checked
            _csrf:@appModel.get("session").get('csrf')


        featureService = @appModel.get("services").feature

        @postData(featureService,data,$input , @featurePost)


    featurePost: (val) =>

        if val is true
            @$el.removeClass('small')
            @$el.addClass('large')
        else
            @$el.removeClass('large')
            @$el.addClass('small')

        @trigger 'layoutChanged'



    postData: (service, data, $input , callback) ->

        $.ajax
            type:"POST"
            url:service
            data:data
            success: (result) ->
                console.log result
                $input.prop('checked' , result.changed[0][$input.attr('name')])

                if callback?
                    callback(result.changed[0][$input.attr('name')])

    transitionIn: (callback) =>

        TweenMax.to @$el , .4,
            autoAlpha:1
            ease:Cubic.easeOut
            onComplete: =>

                if callback isnt undefined
                    callback()


    addEllipsis: ->
        console.log @$el

        @$el.find('.post-body').dotdotdot()

module.exports = PostViewBase


