
ViewBase = require './../abstract/ViewBase.coffee'
RacketGL  = require './RacketGL.coffee'
HotspotView = require './hotspots/HotspotView.coffee'
RacketPreloaderView = require './RacketPreloaderView.coffee'

AppModel = require '../../models/AppModel.coffee'

class RacketView extends ViewBase

    constructor: (opts) ->
        @appModel = AppModel.getInstance()

        super(opts)




    initialize: (opts) ->
        super opts

        @loadAssets()





    loadAssets: ->
        if (!@isPhone && @isWebGL())
            @preloader = new RacketPreloaderView
                el:@$el.find("#loader-container")
                model:@model

            @preloader.transitionIn()

            @model.on "assetsReady" , @initializeRacket
            @model.on "assetsProgress" , @preloader.progress
            @model.loadAssets()


    initializeRacket: =>

        @createRacketGl()
        @createHotspotsView()
        @delegateEvents @generateEvents()

    initialUpdate: (e) =>
        @hotspots.updateHotspots(e)
        setTimeout =>
            @racketGL.once "racketMovingUpdate" , @removeCTA

            @preloader.transitionCTA()
            @transitionIn()
        ,
            50

    removeCTA: (e) =>
        @hotspots.updateHotspots(e)
        @preloader.transitionOut()
        @racketGL.on "racketMovingUpdate" , @hotspots.updateHotspots

    generateEvents: ->

        @racketGL.on "objectsLoaded" ,  @hotspots.initHotspots

        @racketGL.once "racketMovingUpdate" , @initialUpdate
        @racketGL.on "racketMovingComplete" , @hotspots.onRacketTransitionComplete
        @hotspots.on "hotspotClicked" , @racketGL.moveRacket


        events = {}

        return events



    createRacketGl: ->
        @racketGL = new RacketGL
            $el:@$el.find('.racket-specs-content')
            maxLights: 20
            alpha:true
            model:@model.attributes

        @racketGL.initialize()




    createHotspotsView: ->
        @hotspots = new HotspotView
            el:@$el.find('.racket-specs-content')
            model:@model.get('hotspots')


    #override render to do nothing
    transitionIn: (callback) =>


        TweenMax.to @$el.find('.racket-specs-content') , .4,
            autoAlpha:1
            ease:Cubic.easeOut
            onComplete: =>
                if callback isnt undefined
                    callback()

module.exports = RacketView
