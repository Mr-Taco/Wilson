
Utils = require '../../../utils/common.coffee'
RacketObject = require './../objects/RacketObject.coffee'
AppModel = require './../../../models/AppModel.coffee'

DefaultFOV = 70
class RacketScene

    constructor: (width, height,model,el) ->

        _.extend(@, Backbone.Events)

        @appModel = AppModel.getInstance()

        @el = el
        @model = model
        @scene = new THREE.Scene()
        @scene.position.y = -8

        @fov = DefaultFOV
        @camera = window.camera = new THREE.PerspectiveCamera( @fov, width/height, 0.1, 1000 )
        @lights = {}


    resize: (width, height) ->
        @camera.aspect = width/height
        @fovRatio = if (1024/width) <= 1 then 1 else (1024/width)

        @appModel.set "widthAdjust" , @fovRatio - 1

        @setCameraFov @fov , true


    add: (obj) =>
        @scene.add(obj)

    initialize: ->



        @camera.position.z = 75
        @camera.position.x = 0
        @camera.position.y = 0

        @cubeMap = Utils.makeCubeMap @model.environment


        @racketObject = window.racketObject = new RacketObject
            envCube: @cubeMap
        @racketObject.on "objectLoaded" , @racketLoaded
        @racketObject.load @model.objects[0]

        #@stats = new Stats();
        #@stats.domElement.style.position = 'absolute';
        #@stats.domElement.style.top = '0px';
        #@el.appendChild( @stats.domElement );



        @addLights()

    racketLoaded: (obj) =>



        @racket = window.racket = obj
        @add obj



        for k,light of @lights
            if light.type is "SpotLight" or light.type is "DirectionalLight"
                light.target = @racket


        #Give it 1/10 of a second to figure out its position relative to the scene.
        setTimeout =>
            @trigger "racketLoaded"
            @trigger "racketMovingUpdate", {type:"racketMovingUpdate"}
        ,
            100



    controlRotation: (data) ->

        xAxis = new THREE.Vector3(1,0,0)
        rotationAmountX = THREE.Math.degToRad(-data.velY)
        yAxis = new THREE.Vector3(0,1,0)
        rotationAmountY = THREE.Math.degToRad(-data.velX)


        if @racket?
            @rotateAroundWoldAxis(@racket, xAxis, rotationAmountX)
            @rotateAroundWoldAxis(@racket, yAxis, rotationAmountY)
            @trigger "racketMovingUpdate" , {type:"racketMovingUpdate"} , true

            if @currentHotspot?

                @resetHotspot()





    getHotspotsPositions: ->
        verts = @racketObject.getHotspots(@model.hotspots)
        hs = {}
        for vert,i in verts
            hs[vert.__id] = @calc2d(vert)

        return hs



    rotateAroundWoldAxis: (object, axis, radians)->
        @rotWorld = new THREE.Matrix4()
        @rotWorld.makeRotationAxis(axis.normalize(), radians)
        @rotWorld.multiply(object.matrix)
        object.matrix = @rotWorld;
        object.rotation.setFromRotationMatrix(@racket.matrix)




    renderOperation: =>





    addLights: ->

        #@lights['ambient'] = new THREE.AmbientLight 0x2b2b2b

        dLightIntensity = .4

        @lights['pLight1'] = new THREE.PointLight 0xffffff , 2, 1000
        @lights['pLight1'].position.set(0,-200,0)



        @lights['dLight1'] = new THREE.SpotLight 0xffffff , dLightIntensity
        @lights['dLight1'].position.set(0,250,250)
        #@lights['dLight1'].lightHelper = new THREE.SpotLightHelper( @lights['dLight1'], 50)

        @lights['dLight2'] = new THREE.SpotLight 0xffffff , dLightIntensity
        @lights['dLight2'].position.set(0,250,-250)

        @lights['dLight3'] = new THREE.SpotLight 0xffffff , dLightIntensity
        @lights['dLight3'].position.set(-250,250,0)

        @lights['dLight4'] = new THREE.SpotLight 0xffffff , dLightIntensity
        @lights['dLight4'].position.set(250,250,0)

        #@lights['dLight2'].lightHelper = new THREE.SpotLightHelper( @lights['dLight2'], 50)
        #dLight2.target = @object


        for k,v of @lights
            v.castShadow = true
            @scene.add v


    calc2d: (point)->


        z = point.z
        vector = point.project(@camera)
        result = new Object()

        halfWidth = @renderer.domElement.width/2
        halfHeight = @renderer.domElement.height/2
        result.x = (vector.x ) * halfWidth + halfWidth
        result.y = (-vector.y) * halfHeight + halfHeight
        result.z = z

        result

    resetHotspot: ->
        @resetHotspotAnimation()


        @currentHotspot = null
        @fov = DefaultFOV

        tl = @generateTransitionTimeline()

        camera = @setCameraFov(@fov)
        position = @setRacketPosition
            x:0
            y:0
            z:0

        tl.add [camera,position]


    resetHotspotAnimation: ->
        if @racketObject.animations[@currentHotspot]?
            @racketObject.animations[@currentHotspot].timeScale(3)
            @racketObject.animations[@currentHotspot].reverse()


    setCameraFov: (fov , jump) ->
        if !jump
            return TweenMax.to @camera , 2 ,
                fov:fov * @fovRatio
                onUpdate: =>
                    @camera.updateProjectionMatrix()
        else
            @camera.fov = fov * @fovRatio
            @camera.updateProjectionMatrix()



    setRacketRotation: (rotation) ->
        return TweenMax.to @racket.rotation , 2 ,
            ease:Cubic.easeInOut
            x:rotation.x
            y:rotation.y
            z:rotation.z

    setRacketPosition: (translate) ->
        return TweenMax.to @racket.position , 2 ,
            ease:Cubic.easeInOut
            x:translate.x
            y:translate.y
            z:translate.z




    moveRacket: (data) ->

        @resetHotspotAnimation()

        tl = @generateTransitionTimeline()

        @currentHotspot = data.id
        @fov = data.fov

        camera = @setCameraFov(@fov)

        translate = @setRacketPosition(data.translate)

        rotate = @setRacketRotation(data.rotation)




        tl.add [camera,translate,rotate]
        tl.addCallback =>
            if @racketObject.animations[@currentHotspot]?
                @racketObject.animations[@currentHotspot].timeScale(1)
                @racketObject.animations[@currentHotspot].play()


    generateTransitionTimeline: ->

        return new TimelineMax
            onStart: =>
                @trigger "racketMovingStart" , {type:"racketMovingStart"}
            onUpdate: =>
                @trigger "racketMovingUpdate", {type:"racketMovingUpdate"}



            onComplete: =>
                if @currentHotspot
                    @trigger "racketMovingComplete", {type:"racketMovingComplete"}




module.exports = RacketScene



