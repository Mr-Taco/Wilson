

module.exports.getAnimation = (components) ->




    ringScale = TweenMax.staggerFromTo [components.ring0.scale, components.ring1.scale , components.ring2.scale ] , 1 ,
        x:0.1
        z:0.1
        immediateRender:true
    ,
        x:.7
        z:.7
        ease:Cubic.easeInOut
    ,
        .2




    ring1Translate = TweenMax.fromTo [components.ring1.position] , 1.5 ,
        y:0
        immediateRender:true
    ,
        y:6
        ease:Cubic.easeInOuteruc

    ring2Translate = TweenMax.fromTo [components.ring2.position] , 1.5 ,
        y:0
        immediateRender:true
    ,
        y:12
        ease:Cubic.easeInOut



    ringWideScale = TweenMax.fromTo [components.ringWide.scale] , 1.5 ,
        x:0.1
        z:0.1
        immediateRender:true
    ,
        x:.7
        z:.7
        ease:Cubic.easeInOut

    ringWideTranslate = TweenMax.fromTo [components.ringWide.position] , 1.5 ,
        y:15
        immediateRender:true
    ,
        y:22
        ease:Cubic.easeInOut


    ringWideRotation = TweenMax.fromTo [components.ringWide.rotation] , 3 ,
        y:0
    ,
        y:THREE.Math.degToRad(360)
        repeat:-1
        ease:Linear.easeNone



    ringWideRotation.paused(true)

    tl = new TimelineMax
        onReverseComplete:->
            ringWideRotation.pause(0)





    tl.add [ringScale]
    tl.add [ring1Translate,ring2Translate] , 0 , "normal" , -0.2
    tl.addCallback ->
        ringWideRotation.play()
    tl.add [ringWideScale,ringWideTranslate] , "-=1.2"
    tl.paused(true)



    return tl
