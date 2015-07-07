global = require './global.coffee'



geoSet = false

resetGeometry = (components) ->
    geoSet = true



    global.toggleVisibility(components, false)



module.exports.getAnimation = (components) ->

    if !geoSet
        resetGeometry(components)



    tl = new TimelineMax
        onReverseComplete: ->
            global.toggleVisibility(components, false)


        onStart: ->
            global.toggleVisibility(components, true)


    wireframe = components.wireframe
    plate = components.plate

    alpha = TweenMax.fromTo [wireframe.material,plate.material] , .5 ,
        opacity:0
        immediateRender:true
    ,
        opacity:1


    wirePos = TweenMax.fromTo [wireframe.position] , 1 ,
        x:-.5
    ,
        x:0

    platePos = TweenMax.fromTo [plate.position] , 1 ,
        x:-.2
    ,
        x:0




    tl.add [alpha, wirePos, platePos] , "-=0" , "normal" , .3
    tl.paused(true)
    return tl
