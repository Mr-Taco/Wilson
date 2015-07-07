



Utils = require '../../../utils/common.coffee'
SegLength = 3






module.exports.applyInitialStates = (components) ->

    module.exports.hotspotAnimation(components).pause().kill()
    module.exports.contentHotspotAnimation(components).pause().kill()
    module.exports.contentAnimation(components).pause().kill()



module.exports.defineTimelineComponents = ($t, $path, $content, $chs) ->

    return {
        hotspot:
            yellowStroke: $t.find("g.yellow-stroke circle")
            whiteStroke: $t.find("g.white-stroke circle")
            plus: $t.find("g.number g")
            orangeCircle: $t.find("g.orange-circle circle")
            hoverStroke: $t.find("g.hover-stroke circle")
        contentHotspot:
            grayStroke: $chs.find("g.gray-stroke circle")
            plus: $chs.find("g.plus-sign g")
            grayCircle: $chs.find("g.gray-circle circle")
        path:$path
        content:$content
    }


module.exports.hotspotAnimation = (components) ->
    #Circle Hotspot

    tl = new TimelineMax



    strokes = TweenMax.staggerFromTo [components.hotspot.yellowStroke,components.hotspot.whiteStroke] , 1,
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



    plus = TweenMax.fromTo components.hotspot.plus , .5 ,
        rotation:"360deg"
        transformOrigin:"50% 50%"
        attr:
            y:"0px"
    ,
        rotation:"0deg"
        transformOrigin:"50% 50%"
        overwrite:"preexisting"
        attr:
            y:"-1px"

    circle = TweenMax.fromTo components.hotspot.orangeCircle, .5 ,
        fill:"#FF6C00"
        stroke:"#F4CE21"
        strokeWidth:6
        attr:
            r:12
    ,
        strokeWidth:4
        attr:
            r:10
        fill:"#ffffff"
        overwrite:"preexisting"

    hover = TweenMax.fromTo components.hotspot.hoverStroke , .5 ,
        opacity:0
    ,
        opacity:0


    fadeWhiteStroke = TweenMax.to components.hotspot.whiteStroke , 1,
        drawSVG:"0%"
        rotation:"-360deg"
        transformOrigin:"50% 50%"
        ease:Cubic.easeInOut

    tl.add [strokes,plus,circle,hover]
    tl.add [fadeWhiteStroke] , "+=.5"

    return tl


pathAnimation = (p) ->
    path = $(p)



    d = path.attr('d')

    if !$('html').hasClass('ie')
        d = d.split("M").join("").split("L").join(",").split(",")
    else
        d = d.split("M ").join("").split(" L ").join(" ")
        d = d.split(" ")

    distance = Math.floor Utils.distance(d[0],d[1],d[2],d[3])

    segmentsTotal = Math.ceil(distance/ (SegLength)) - 4
    segmentsNeeded = Math.ceil(segmentsTotal *  @progress())
    dashArray = []



    while segmentsNeeded > 0

        dashArray.push SegLength
        dashArray.push SegLength

        segmentsNeeded--

    finalDash = if dashArray.length is 0 then 0 else SegLength
    dashArray.push  finalDash , distance

    dashValue = dashArray.toString()

    TweenMax.set path ,
        strokeDasharray:dashValue


module.exports.pathAnimation = (components , index) ->
    tl = new TimelineMax


    pathAlpha = TweenMax.fromTo components.path[index] , .7,
        opacity:0
    ,
        opacity:1

    pathStroke = TweenMax.fromTo components.path[index], .7, {} ,
        ease:Cubic.easeOut
        onUpdate:->

            if index?
                pathAnimation.call(@,components.path[index])
            else
                for p in components.path
                    pathAnimation.call(@,p)







    tl.add [pathAlpha,pathStroke]

    return tl


module.exports.contentHotspotAnimation = (components) ->
    tl = new TimelineMax



    chsStrokes = TweenMax.staggerFromTo [components.contentHotspot.grayStroke] , 1,
        drawSVG:"0% 25%"
        rotation:"-360deg"
        transformOrigin:"50% 50%"
        immediateRender:true

    ,
        drawSVG:"100%"
        rotation:"0deg"
        transformOrigin:"50% 50%"
        ease:Cubic.easeInOut

    ,
        .15

    chsPlus = TweenMax.fromTo components.contentHotspot.plus , .5 ,
        rotation:"0deg"
        transformOrigin:"50% 50%"

    ,
        rotation:"180deg"
        transformOrigin:"50% 50%"


    makeMinus = TweenMax.fromTo components.contentHotspot.plus.find(".v") , .5 ,
        opacity:1
    ,
        opacity:0

    minusColor = TweenMax.fromTo components.contentHotspot.plus.find(".h") , .5 ,
        fill:"#2c2c2c"
    ,
        fill:"#f4ce21"


    chsCircle = TweenMax.fromTo components.contentHotspot.grayCircle , .5 ,
        stroke:"#2c2c2c"
        opacity:1
    ,
        stroke:"#f4ce21"
        opacity:.5

    tl.add [chsStrokes,chsPlus,makeMinus,minusColor,chsCircle]

    return tl


module.exports.contentAnimation = (components) ->
    tl = new TimelineMax


    #Content Global
    title = TweenMax.fromTo components.content.find('em') , .5 ,
        color: "#262626"
        opacity:.8
        immediateRender:true
    ,
        color: "#ff6c00"
        opacity:1

    splitBody = new SplitText components.content.find("p > span") ,
        type:"chars,words"

    body = TweenMax.staggerFromTo splitBody.chars , 1 ,
        alpha:0
        immediateRender:true
    ,
        alpha:1
    ,
        .02
    
    listItems = components.content.find("ul > li");
    if listItems.length > 0        
        
        list = TweenMax.staggerFromTo listItems , .35 ,
            alpha:0,
            y:-10
            immediateRender:true,
        ,
            y:0
            alpha:1
        ,
            .15
        
    
    tl.add [title,body]
    if list then tl.add list , "-=.3"


    return tl



module.exports.toggleVisibility = (components , toggle) ->

    if $.isPlainObject(components)
        for k,c of components
            if c instanceof THREE.Mesh
                c.visible = toggle
            else
                module.exports.toggleVisibility(c,toggle)

    else if $.isArray(components)
        for c in components
            if c instanceof THREE.Mesh
                c.visible = toggle
            else
                module.exports.toggleVisibility(c,toggle)
