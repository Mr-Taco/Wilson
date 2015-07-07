
RacketScene = require './scene/RacketScene.coffee'
RacketCamera = require './scene/RacketCamera.coffee'
RacketRenderer = require './RacketRenderer.coffee'
RotationControls = require './control/RotationControls.coffee'



class RacketGL


    constructor: (opts) ->

        _.extend(@, Backbone.Events)



        opts.antialias = true
        @$el = opts.$el


        @scene = window.scene = new RacketScene(window.innerWidth,@$el.find(".gl-container").height(), opts.model, @$el.find(".gl-container")[0])
        @renderer = new RacketRenderer(opts, @scene.scene , @scene.camera, @scene.renderOperation)
        @scene.renderer = @renderer




    addEvents: ->
        $(window).resize @resize

        #init controls
        @rotationControls = new RotationControls @$el[0]
        @rotationControls.on "pan" , @handleControls


        @scene.on "racketMovingStart" , @handleRacketMovement
        @scene.on "racketMovingUpdate" , @handleRacketMovement
        @scene.on "racketMovingComplete" , @handleRacketMovement
        @scene.on "racketLoaded" , @handleObjectsLoaded




    handleControls: (data) =>
        @scene.controlRotation(data)

    handleRacketMovement: (e, user) =>



        @trigger e.type , @scene.getHotspotsPositions(), user


    handleObjectsLoaded: () =>

        @trigger "objectsLoaded"
        @resize()


    resize: =>
        @_height = @$el.find('.gl-container').height()
        @_width = window.innerWidth
        @scene.resize(@_width, @_height)
        @renderer.setSize(window.innerWidth, @_height)
        @handleRacketMovement({type:"racketMovingUpdate"})



    initialize: ->

        @$el.find(".gl-container").append @renderer.domElement

        #@_controls = new THREE.OrbitControls @_camera

        @scene.initialize()

        @addEvents()
        @renderer.renderTime()

    moveRacket: (data) =>
        @scene.moveRacket data

















module.exports = RacketGL
