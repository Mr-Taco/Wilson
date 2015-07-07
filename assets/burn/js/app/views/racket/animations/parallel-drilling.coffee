global = require './global.coffee'

module.exports.applyInitialStates = (components) ->

    module.exports.hotspotAnimation(components).pause().kill()
    module.exports.secondaryHotspotAnimation(components).pause().kill()
    module.exports.secondaryContentHotspotAnimation(components).pause().kill()
    module.exports.contentHotspotAnimation(components).pause().kill()
    global.contentAnimation(components).pause().kill()

module.exports.defineTimelineComponents = ($t, $path, $content, $chs) ->

    return {
        hotspot:
            whiteStroke: $t.find("g.white-stroke circle")
            plus: $t.find("g.number g")
            orangeCircle: $t.find("g.orange-circle circle")
            hoverStroke:$t.find('g.hover-stroke circle')
        contentHotspot:
            grayStroke: $chs.find("g.gray-stroke circle")
            plus: $chs.find("g.plus-sign g")
            grayCircle: $chs.find("g.gray-circle circle")
        path:$path
        content:$content
    }


module.exports.secondaryHotspotAnimation = (components) ->


    tl = new TimelineMax


    strokesDraw = TweenMax.staggerFromTo [components.hotspot.whiteStroke[1] , components.hotspot.whiteStroke[2]] , 1,
        drawSVG:"0%"
        rotation:"-360deg"
        transformOrigin:"50% 50%"
        opacity:0


    ,
        drawSVG:"100%"
        rotation:"0deg"
        transformOrigin:"50% 50%"
        ease:Cubic.easeInOut
        opacity:1
        overwrite:"preexisting"

    ,
        .15

    plus = TweenMax.fromTo [components.hotspot.plus[1], components.hotspot.plus[2]] , .5 ,
        rotation:"360deg"
        transformOrigin:"50% 50%"
        opacity:0
    ,
        rotation:"0deg"
        transformOrigin:"50% 50%"
        opacity:0
        overwrite:"preexisting"

    circle = TweenMax.fromTo [components.hotspot.orangeCircle[1],components.hotspot.orangeCircle[2]], .5 ,
        fill:"#ffffff"

        strokeWidth:0
        opacity:0
        attr:
            r:10
    ,
        fill:"#ffffff"
        strokeWidth:0
        opacity:1
        attr:
            r:6
        overwrite:"preexisting"

    hover = TweenMax.fromTo [components.hotspot.hoverStroke[1] ,components.hotspot.hoverStroke[2]], .5 ,
        opacity:0
    ,
        opacity:0



    tl.add [plus,circle, strokesDraw,hover]
    return tl


module.exports.hotspotAnimation = (components) ->
    #Circle Hotspot

    tl = new TimelineMax


    strokesDraw = TweenMax.staggerFromTo [components.hotspot.whiteStroke[0]] , 1,
        drawSVG:"0%"
        rotation:"-360deg"
        transformOrigin:"50% 50%"

    ,
        drawSVG:"100%"
        rotation:"0deg"
        transformOrigin:"50% 50%"
        ease:Cubic.easeInOut
        overwrite:"preexisting"

    ,
        .15

    plus = TweenMax.fromTo components.hotspot.plus[0] , .5 ,
        rotation:"360deg"
        transformOrigin:"50% 50%"
        opacity:1
    ,
        rotation:"0deg"
        transformOrigin:"50% 50%"
        overwrite:"preexisting"
        opacity:0


    circle = TweenMax.fromTo components.hotspot.orangeCircle[0], .5 ,
        fill:"#FF6C00"
        strokeWidth:6
        stroke:"#F4CE21"
        attr:
            r:12

    ,
        fill:"#ffffff"
        strokeWidth:0
        attr:
            r:6
        overwrite:"preexisting"


    hover = TweenMax.fromTo components.hotspot.hoverStroke[0] , .5 ,
        opacity:0
    ,
        opacity:0



    tl.add [plus,circle,strokesDraw,hover]
    return tl


module.exports.secondaryContentHotspotAnimation = (components) ->
    tl = new TimelineMax



    chsStrokes = TweenMax.fromTo [components.contentHotspot.grayStroke[1],components.contentHotspot.grayStroke[2]] , .5,
        drawSVG:"0%"
        immediateRender:true

    ,
        drawSVG:"0%"
        ease:Cubic.easeInOut
        overwrite:"preexisting"


    chsPlus = TweenMax.fromTo [components.contentHotspot.plus[1],components.contentHotspot.plus[2]] , .5 ,
        rotation:"0deg"
        transformOrigin:"50% 50%"
        opacity:0

    ,
        rotation:"180deg"
        transformOrigin:"50% 50%"
        opacity:0
        overwrite:"preexisting"





    chsCircle = TweenMax.fromTo [components.contentHotspot.grayCircle[1], components.contentHotspot.grayCircle[2]] , .5 ,
        strokeWidth:0
        opacity:0
        fill:"#ffffff"
        attr:
            r:1
        overwrite:"preexisting"
    ,
        opacity:1
        strokeWidth:0
        fill:"#ffffff"
        attr:
            r:6
        ease:Back.easeOut
        overwrite:"preexisting"

    tl.add [chsStrokes,chsPlus,chsCircle]

    return tl

module.exports.contentHotspotAnimation = (components) ->
    tl = new TimelineMax



    chsStrokes = TweenMax.fromTo [components.contentHotspot.grayStroke[0]] , .5,
        drawSVG:"0% 25%"
        rotation:"-360deg"
        transformOrigin:"50% 50%"
        immediateRender:true

    ,
        drawSVG:"0%"
        rotation:"0deg"
        transformOrigin:"50% 50%"
        ease:Cubic.easeInOut
        overwrite:"preexisting"


    chsPlus = TweenMax.fromTo components.contentHotspot.plus[0] , .5 ,
        rotation:"0deg"
        transformOrigin:"50% 50%"
        opacity:1

    ,
        rotation:"180deg"
        transformOrigin:"50% 50%"
        opacity:0
        overwrite:"preexisting"





    chsCircle = TweenMax.fromTo components.contentHotspot.grayCircle[0] , .5 ,
        strokeWidth:4
        fill:"transparent"
        attr:
            r:10
    ,

        strokeWidth:0
        fill:"#ffffff"
        attr:
            r:6
        ease:Back.easeInOut
        overwrite:"preexisting"

    tl.add [chsStrokes,chsPlus,chsCircle]

    return tl



geoSet = false

resetGeometry = (components) ->
    geoSet = true
    mod = 0
    for disc,i in components.discs
        disc.geometry.center()
        disc.geometry.verticesNeedUpdate = true
        disc.position.y = 17.5
        disc.position.z = -1-(-.25 * mod)

        line = components.discLines[i]
        line.geometry.center()
        line.geometry.verticesNeedUpdate = true
        line.position.y = 17.5
        line.position.z = -1-(-.25 * mod)


        mod++

    ball = components.ball
    ball.geometry.center()
    ball.geometry.verticesNeedUpdate = true
    ball.position.y = 17.5
    ball.position.z = -11
    ball.material.opacity = 0



    global.toggleVisibility(components , false)



module.exports.getAnimation = (components) ->

    if !geoSet
        resetGeometry(components)

    discScale = []
    discAlpha = []
    lineAlpha = []
    lineScale = []

    scales = [.2,.6,1]



    dropTl = new TimelineMax
    ball = components.ball





    ###ballDropIn = TweenMax.fromTo [ball.position , ball.material]  , 1 ,
        z:-25
        opacity:0
        immediateRender:true
    ,
        z:-4.9
        opacity:0
        ease:Expo.easeIn


    ballFloatUp = TweenMax.fromTo [ball.position, ball.material] , 1.5 ,
        z:-4.9
        opacity:1
    ,
        z:-25
        opacity:0
        ease:Expo.easeOut



    dropTl.add ballDropIn
    dropTl.add ballFloatUp



    ballSpin = TweenMax.fromTo ball.rotation , 2 ,
        x:0
    ,
        x:THREE.Math.degToRad(-360)

        repeat:-1
        ease:Linear.easeNone

    ballSpin.paused(true)###



    for disc,i in components.discs
        line = components.discLines[i]
        percent = (i/3)


        discAlpha[i] = TweenMax.fromTo [disc.material] , .5 ,
            opacity:0
        ,
            opacity: .6 * (1-percent)
            delay:i * .2
            overwrite:"preexisting"

        lineAlpha[i] = TweenMax.fromTo [line.material] , .5 ,
            opacity:0
        ,
            opacity:.8* (1-percent)
            delay:i * .2
            overwrite:"preexisting"




        discScale[i] = TweenMax.fromTo [disc.scale] , .5 ,
            x:0.1
            y:0.1
        ,
            x:scales[i]
            y:scales[i]
            delay:i * .2
            overwrite:"preexisting"


        lineScale[i] = TweenMax.fromTo [line.scale] , .5 ,
            x:.1
            y:.1
        ,
            x:scales[i] - .025
            y:scales[i] - .025
            delay:i * .2
            overwrite:"preexisting"






    tl = new TimelineMax
        onReverseComplete: ->
            global.toggleVisibility(components, false)
            #ballSpin.pause(0)


        onStart: ->
            global.toggleVisibility(components, true)
            #ballSpin.play()




    #tl.add [ dropTl]
    tl.add [discScale, discAlpha, lineAlpha,lineScale]

    tl.paused(true)


    return tl


