ViewBase = require '../../abstract/ViewBase.coffee'
Utils = require '../../../utils/common.coffee'
Tracking = require '../../../utils/track.coffee'
Animations = require './../imports/animations.coffee'
Templates = require '../imports/templates.coffee'
AppModel = require '../../../models/AppModel.coffee'

class HotspotView extends ViewBase



    constructor: (opts) ->
        @hsTemplate = require '../../../../../templates/specs/hotspots/hotspot.svg.jade'
        @chsTemplate = require '../../../../../templates/specs/hotspots/content.hotspot.svg.jade'
        @hotspotData = {}
        super(opts)

    initialize: (opts) ->
        super()
        @appModel = AppModel.getInstance()
        @hotspotContainerOver = @$el.find(".svg-container-over svg")
        @hotspotContainerUnder = @$el.find(".svg-container-under svg")
        @contentContainer = @$el.find(".hotspot-content-container")
        @headerOffset = $("#specs-content").height()


        @delegateEvents @generateEvents()





    hotspotReset: () ->
        #No Id? reset currentspot to null
        if @currentHotspot?
            data = @hotspotData[@currentHotspot]

            tl = new TimelineMax
                overwrite:'preexisting'
            tweens = []
            switch @currentHotspot
                when "parallel-drilling"
                    tweens = [
                        Animations['default'].pathAnimation(data.components ,0)
                        ,Animations['default'].pathAnimation(data.components ,1)
                        ,Animations['default'].pathAnimation(data.components ,2)
                        ,Animations[@currentHotspot].contentHotspotAnimation(data.components)
                        ,Animations[@currentHotspot].secondaryContentHotspotAnimation(data.components)
                        ,Animations['default'].contentAnimation(data.components)
                        ,Animations[@currentHotspot].secondaryHotspotAnimation(data.components)
                        ,Animations[@currentHotspot].hotspotAnimation(data.components)
                    ]
                else
                    tweens = [
                        Animations['default'].pathAnimation(data.components, 0)
                        ,Animations['default'].contentHotspotAnimation(data.components)
                        ,Animations['default'].contentAnimation(data.components)
                        ,Animations['default'].hotspotAnimation(data.components)
                    ]

            tl.add tweens
            tl.timeScale(3)
            tl.progress(1)
            tl.reverse()
            @currentHotspot = null


    onRacketTransitionComplete: () =>
        id = @currentHotspot
        data = @hotspotData[id]
        switch @currentHotspot
            when "parallel-drilling"
                @undelegateEvents()
                tl = new TimelineMax
                    onComplete:=>
                        @delegateEvents @generateEvents()
                tl.add [Animations[id].secondaryHotspotAnimation(data.components)]
                tl.add [Animations['default'].pathAnimation(data.components, 1),Animations['default'].pathAnimation(data.components, 2)] , "-=.5"
                tl.add  [Animations[id].secondaryContentHotspotAnimation(data.components)] , "-=.5"
                tl.play()



    handleHotspot: (e) =>

        e.preventDefault()

        $target = $(e.target).closest("g.hotspot")
        if $target.length < 1
            $target = $(e.target).closest("circle.clickable")

        id = $target.data('id')

        $hs = $(".hotspot[data-id='#{id}']").first()
        $chs = $(".content-hotspot[data-id='#{id}']").first()

        switch e.type
            when "mouseenter"
                @hotspotOver $hs , $chs
            when "mouseleave"
                @hotspotOut $hs , $chs
            when "click" , "touchend"
                @hotspotOut $hs , $chs
                @hotspotActivate $target




    hotspotActivate: (hs)->

        @undelegateEvents()
        @hotspotReset()
        @currentHotspot = id = @parseElementId(hs)


        data = @hotspotData[id]
        tl = new TimelineMax
            onComplete: =>
                @delegateEvents @generateEvents()

        switch id
            when "parallel-drilling"
                tl.add [Animations[id].hotspotAnimation(data.components)]
                tl.add [Animations['default'].pathAnimation(data.components, 0)]
                tl.add [
                    Animations[id].contentHotspotAnimation(data.components)
                    ,Animations['default'].contentAnimation(data.components)
                ] , "-=.5", "normal",  .3
            else
                tl.add [Animations['default'].hotspotAnimation(data.components)]
                tl.add [Animations['default'].pathAnimation(data.components, 0)]
                tl.add [
                    Animations['default'].contentHotspotAnimation(data.components)
                    ,Animations['default'].contentAnimation(data.components)
                ] , "-=0", "normal",  .3


        tl.play()
        @scrollToContent(id)


        Tracking.gaTrack( data.tracking['ga-type'] , data.tracking['ga-tag'] )
        @trigger "hotspotClicked" , @hotspotData[id].transform

    scrollToContent: (id) ->

        content = $(".hotspot-content[data-id='#{id}']")
        contentOffset = content.offset().top
        windowOffset = (window.innerHeight - content.height() - 75)
        scrollTop = $(document).scrollTop()
        documentScrollTop = scrollTop + window.innerHeight



        if documentScrollTop - contentOffset < 175

            TweenMax.to window , 1 ,
                scrollTo:
                    y:contentOffset - windowOffset
                delay:.75
                ease:Cubic.easeInOut
        else if contentOffset < (scrollTop + 180)
            TweenMax.to window , 1 ,
                scrollTo:
                    y:contentOffset - 175
                delay:.75
                ease:Cubic.easeInOut



    hotspotOver: (hs , chs) ->



        orangeStroke = hs.find(".orange-circle circle")
        hoverStroke = hs.find(".hover-stroke circle")
        grayStroke = chs.find(".gray-stroke circle")


        goWhite = TweenMax.to [grayStroke] , .4 ,
            stroke:"#ffffff"

        showHover = TweenMax.to hoverStroke , .4 ,
            opacity:1



        graySpin = TweenMax.to grayStroke , 2 ,
            rotation:"360deg"
            repeat:-1
            ease:Linear.easeNone

        graySpin.paused(true)

        tlOver = new TimelineMax
            onStart: ->
                graySpin.play()

        tlOver.add [goWhite,showHover]



    hotspotOut: (hs , chs) ->
        tlOut = new TimelineMax
        orangeStroke = hs.find(".orange-circle circle")
        hoverStroke = hs.find(".hover-stroke circle")
        grayStroke = chs.find(".gray-stroke circle")

        ###goOrange = TweenMax.to orangeStroke , .4 ,
            stroke:"#F4CE21"###

        hideHover = TweenMax.to hoverStroke , .4 ,
            opacity:0

        goGray = TweenMax.to [grayStroke] , .4 ,
            stroke:"#2c2c2c"
            rotation:"-360deg"
            overwrite:"preexisting"





        tlOut = new TimelineMax

        tlOut.add [hideHover,goGray]

    generateEvents: ->
        events = {}
        $(window).resize @resize
        events['click g.hotspot'] = "handleHotspot"
        events['click circle.clickable'] = "handleHotspot"
        if !@isTouch
            events['mouseenter g.hotspot'] = "handleHotspot"
            events['mouseleave g.hotspot'] = "handleHotspot"


            events['mouseenter circle.clickable'] = "handleHotspot"
            events['mouseleave circle.clickable'] = "handleHotspot"
        else
            events['touchend g.hotspot'] = "handleHotspot"
            events['touchend circle.clickable'] = "handleHotspot"

        return events



    drawContentBox: (box) ->

        if !@contentRect?

            @contentRect = $("<div/>")
            @contentRect.addClass('contentRect')

            @contentContainer.append(@contentRect)

        TweenMax.set @contentRect ,
            x:box.x
            y:box.y
            width:box.width
            height:box.height




    setContentPositions: ->

        for k,data of @hotspotData

            if data.content.standard.top?
                data.content.top = data.content.standard.top +  @headerOffset

            if data.content.standard.left?
                data.content.left = data.content.standard.left

            if data.content.standard.right?
                data.content.right = data.content.standard.right

            if data.content.standard.center?
                data.content.center = data.content.standard.center

            if window.innerWidth <= 800
                if data.content.small?
                    if data.content.small.top?
                        data.content.top = data.content.small.top + @headerOffset

                    if data.content.small.left?
                        data.content.left = data.content.small.left

                    if data.content.small.right?
                        data.content.right = data.content.small.right

                    if data.content.small.center?
                        data.content.center = data.content.small.center






    resize: (e) =>
        @setContentPositions();



        contentBox =
            x:  @hotspotContainerOver.width()*.5 - Utils.getMaxWidth()*.5
            y: 0
            width: Utils.getMaxWidth()
            height: @hotspotContainerOver.height()



        for k,data of @hotspotData
            contentEl = @contentContainer.find("##{data.content.id}")
            circle = @hotspotContainerOver.find("#interactive-#{k}")
            anchorLeft = contentEl.find('.anchor').css('left')
            anchorLeft = parseInt anchorLeft.substr(0, anchorLeft.length-2)




            if data.content.right?
                cx = contentBox.width - ((contentEl.width() ) + data.content.right)
            else if data.content.left?
                cx = data.content.left - anchorLeft
            else if data.content.center?
                if anchorLeft > 0 then anchorLeft = 0
                cx = ((contentBox.width * .5) + (data.content.center - anchorLeft))
            
                
 
            anchorCoords = @getAnchorPosition(contentEl)


            TweenMax.set contentEl ,
                x: contentBox.x + cx
                y: contentBox.y + data.content.top

            TweenMax.set circle ,
                x:anchorCoords.x
                y:anchorCoords.y


        $(".racket-specs-content svg").each (i,t) =>
            t.setAttribute "viewBox" , "0 0 #{window.innerWidth} #{@hotspotContainerOver.height()}"


    initHotspots: =>
        for k,geomId of @model
            for i,spot of geomId
                spot.transform.id = spot.id

                @hotspotData[spot.id] =
                    transform:spot.transform
                    content:spot.content
                    order:spot.order
                    tracking: spot.tracking


        @resize()
        @createContentPaths()
        @createHotspots()
        @createContentHotspots()
        @createTimelines()



    createHotspots: ->
        hs = []
        for id,data of @hotspotData

            switch id
                when "parallel-drilling"
                    for i in [0..2]
                        @hotspotContainerOver[0].appendChild  Templates.hotspots[id](id,i,data.order)

                else

                    @hotspotContainerOver[0].appendChild Templates.hotspots["default"](id,data.order)




    createContentHotspots: ->

        for id,data of @hotspotData
            $content = @contentContainer.find("##{data.content.id}")
            anchorCoords = @getAnchorPosition($content)


            switch id
                when "parallel-drilling"

                    for i in [0..2]
                        @hotspotContainerUnder[0].appendChild Templates.contentHotspots['default'](id,i)

                else

                    @hotspotContainerUnder[0].appendChild Templates.contentHotspots["default"](id)




            $chs = @hotspotContainerUnder.find(".content-hotspot[data-id='#{id}']")



            #create hover area
            circle = document.createElementNS(Utils.svgns, "circle")
            circle.setAttribute('r' , "24px" )
            circle.setAttribute('fill' , "transparent" )
            circle.setAttribute('class' , "clickable" )
            circle.setAttribute('id' , "interactive-#{id}")
            circle.setAttribute('data-id' , id)

            @hotspotContainerOver[0].appendChild circle


            for ch,i in $chs

                offset = 0
                if i > 0
                    offset = if i%2 then -50 else 50

                TweenMax.set [ch] ,
                    x:anchorCoords.x + offset
                    y:anchorCoords.y


            TweenMax.set [circle] ,
                x:anchorCoords.x
                y:anchorCoords.y









    createTimelines: ->

        for id,data of @hotspotData
            $hs = @hotspotContainerOver.find(".hotspot[data-id='#{id}']")
            $chs = @hotspotContainerUnder.find(".content-hotspot[data-id='#{id}']")
            $content = @contentContainer.find("##{data.content.id}")


            switch id
                when "parallel-drilling"
                    $path = @hotspotContainerOver.find("#path-#{id}-0 , #path-#{id}-1 , #path-#{id}-2")
                    @hotspotData[id].components = Animations[id].defineTimelineComponents $hs, $path, $content, $chs
                    Animations[id].applyInitialStates(@hotspotData[id].components)
                else
                    $path = @hotspotContainerOver.find("#path-#{id}")
                    @hotspotData[id].components = Animations['default'].defineTimelineComponents $hs, $path, $content, $chs
                    Animations['default'].applyInitialStates(@hotspotData[id].components)





            @hotspotData[id].pathComplete = false




    createContentPaths: ->

        for id of @hotspotData

            switch id
                when "parallel-drilling"

                    for i in [0..2]
                        path = document.createElementNS(Utils.svgns, "path")
                        path.setAttribute("id" , "path-#{id}-#{i}")
                        path.setAttribute("class","hotspot-path white")
                        @hotspotContainerOver[0].appendChild path

                else
                    path = document.createElementNS(Utils.svgns, "path")
                    path.setAttribute("id" , "path-#{id}")
                    path.setAttribute("class","hotspot-path")
                    @hotspotContainerOver[0].appendChild path







    updateHotspots: (spots,user) =>
        #Check if user initialted. reset all hotspots
        if user
            @hotspotReset()

        for id,spot of spots
            data = @hotspotData[id]

            $content = @contentContainer.find("##{@hotspotData[id].content.id}")
            $hotspot = @hotspotContainerOver.find(".hotspot[data-id='#{id}']")
            $hotspot2 = @hotspotContainerUnder.find(".content-hotspot[data-id='#{id}']")


            switch id
                when "parallel-drilling"
                    $path = @hotspotContainerOver.find("#path-#{id}-0 , #path-#{id}-1 , #path-#{id}-2")
                else
                    $path = @hotspotContainerOver.find("#path-#{id}")

            spot.x = Math.floor(spot.x)
            spot.y = Math.floor(spot.y)
            alpha = (((spot.z) + 14)/69) + .75

            contentCoords =  @getAnchorPosition($content)

            for hs,i in $hotspot
                sp = $(hs)

                sp2 = $hotspot2[i]

                offset = 0
                if i > 0
                    offset = if i%2 then -50 else 50

                TweenMax.to sp , .1,
                    x:spot.x + offset
                    y:spot.y

                    opacity:alpha

                TweenMax.to sp2 , .1 ,
                    x:contentCoords.x + offset
                    y:contentCoords.y

                if $("html").hasClass("safari")
                    hs.style.display = 'none'
                    hs.offsetHeight
                    hs.style.display = ''

            for p,i in $path
                path = $(p)
                offset = 0
                if i > 0
                    offset = if i%2 then -50 else 50
                d=  "M#{spot.x + offset},#{spot.y}L#{contentCoords.x + offset},#{contentCoords.y}"
                path.attr('d' , d)



            #Deal with Hotspot







    parseElementId: ($hs) ->
        ###
        idArray = $hs.attr('id').split("-")
        idArray.shift()
        id = idArray.join("-")
        ###

        id = $hs.data('id')

        return id


    getAnchorPosition: ($content) ->
        matrix = Utils.matrixToArray $content.css("transform")
        cAnchor = $content.find(".anchor")
        contentCoords =
            x:parseInt(matrix[4]) + parseInt(cAnchor.css('left'))
            y:parseInt(matrix[5]) + parseInt(cAnchor.css('top'))
        return contentCoords


module.exports = HotspotView

