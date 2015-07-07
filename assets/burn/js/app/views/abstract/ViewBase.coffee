


class ViewBase extends Backbone.View

    constructor: (opt) ->
        @template ?= ""
        @global = {}
        super opt



    initialize: (opt) ->

        @isTouch = Modernizr.touch
        @isTablet = $("html").hasClass("tablet")
        @isPhone = $("html").hasClass("phone")

        @isWebGL = ->
            canvas = document.getElementById('webgl')

            if canvas.getContext("experimental-webgl") == null || canvas.getContext("experimental-webgl") == undefined
                return false
            else
                return true




    generateEvents: ->
        return {}



    render: () ->

        @$el.html @template {data: @model}
        @afterRender()


    afterRender: ->
        @delegateEvents(@generateEvents())

    destroy: () =>
        @$el.html("")
        @undelegateEvents()







    preventDefault: (e) ->
        if e isnt undefined and e isnt null
            if e.preventDefault isnt undefined and typeof e.preventDefault is "function"
                e.preventDefault()
            else
                e.returnValue = false



    transitionIn: (callback) =>


        @render()
        TweenMax.to @$el , .4,
            autoAlpha:1
            ease:Cubic.easeOut
            onComplete: =>
                if callback isnt undefined
                    callback()






    transitionOut: (callback) =>

        TweenMax.to @$el , .4,
            autoAlpha:0
            ease:Cubic.easeOut
            onComplete: =>
                @destroy()
                if callback isnt undefined
                    callback()






module.exports = ViewBase
