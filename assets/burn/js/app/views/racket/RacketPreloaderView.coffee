ViewBase = require '../abstract/ViewBase.coffee'

class RacketPreloaderView extends ViewBase

    constructor: (opts) ->
        super opts

        @template = require '../../../../templates/specs/loader/specs-loader.jade'




    initialize: (opts) ->
        super opts




    transitionCTA: (callback) ->
        tl = new TimelineMax
            onComplete: ->
                if callback?
                    callback()

        tl.add TweenMax.to @$el.find("#specs-loader") , .5 ,
            autoAlpha:0

        tl.add TweenMax.to @$el.find("#specs-cta") , 1 ,
            autoAlpha:1






    progress: (loaded) =>



        percent = Math.ceil loaded * 100
        @progressText.html(percent)

        TweenMax.to @progressCircle , .1 ,
            drawSVG:"#{percent}%"



    afterRender: ->
        @progressText = @$el.find(".progress .amount")
        @progressCircle = @$el.find("g.load-meter circle")

        TweenMax.set @progressCircle ,
            rotation:"-90deg"
            transformOrigin:"50% 50%"


module.exports = RacketPreloaderView

