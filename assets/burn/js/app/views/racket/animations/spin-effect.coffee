global = require './global.coffee'



geoSet = false

resetGeometry = (components) ->
    geoSet = true


    components.helix.geometry.center()
    components.helix.geometry.verticesNeedUpdate = true
    components.helix.position.set(.5,17.9,10)

    components.stalk.geometry.center()
    components.stalk.geometry.verticesNeedUpdate = true
    components.stalk.position.set(.5,17.9,10)



    global.toggleVisibility(components,false)






module.exports.getAnimation = (components) ->

    if !geoSet
        resetGeometry(components)

    return new TimelineMax()

    stalkMat = TweenMax.fromTo components.stalk.material , .5 ,
        opacity:0
    ,
        opacity:1

    stalkPos = TweenMax.fromTo components.stalk.position , 1,
        z:5
    ,
        z:10
        ease:Cubic.easeOut

    helixPos = TweenMax.fromTo components.helix.position ,1 ,
        z:5
    ,
        z:10
        ease:Cubic.easeOut

    helixMat = TweenMax.fromTo components.helix.material , .5 ,
        opacity:0
    ,
        opacity:1

    helixRotation = TweenMax.fromTo [components.helix.rotation] , 2 ,
        z:0
    ,
        z:THREE.Math.degToRad(360)
        repeat:-1
        ease:Linear.easeNone

    helixRotation.paused(true)



    tl = new TimelineMax
        onReverseComplete: ->
            global.toggleVisibility(components, false)
            helixRotation.pause()

        onStart: ->
            global.toggleVisibility(components, true)
            helixRotation.play()






    tl.add [stalkMat, stalkPos]
    tl.add [helixMat, helixPos], "-=.5"


    tl.paused(true)


    return tl




