class SurveySlider

    constructor: (opts) ->
        @els = opts.el


        @createSliders()


    createSliders: ->

        for slider in $(@els)
            lLabel = $("<p class='left slider-label'>Worst</p>")
            rLabel = $("<p class='right slider-label'>Best</p>")
            slide = $("<div class='slider'></div>")

            track = $("<div class='track'><div class='segment-1'></div><div class='segment-2'></div><div class='segment-3'></div><div class='segment-4'></div><div class='segment-5'></div></div>")
            steps = $("<div class='steps'><div class='segment-1'></div><div class='segment-2'></div><div class='segment-3'></div><div class='segment-4'></div><div class='segment-5'></div></div>")
            handle = $("<span class='slider-handle'></span>")


            slide.append(track, steps, handle)


            numbers = $("<ol class='slider-nums'><li><span data-color='#f1e000' >1</span></li><li><span data-color='#ff6c00' >2</span></li><li><span data-color='#e14504' >3</span></li><li><span data-color='#da1a32' >4</span></li><li><span data-color='#940a0b' >5</span></li></ol>")

            $(slider).append(lLabel, slide, rLabel, numbers)


        $(window).resize @reInit
        @reInit()



    reInit: =>

        @initializeDraggable()
        @syncSliders()
        @addEvents()


    addEvents: ->
        $('.slider .track div, .slider .steps div').on 'click', @clickSlider
        $('.slider-nums li span').on 'click', @clickNumber


    clickSlider: (opts) =>
        target = opts.target
        classname = $(target).attr('class')
        answer = classname.substr(8)
        slider = $(target).parents('.slider')
        sliderWrapper = $(slider).parents('.slider-wrapper')
        handle = $(sliderWrapper).find '.slider-handle'
        input = $(slider).parents('.slider-wrapper').find 'input'
        sliderWidth = $(slider).width()
        step = $(slider).find('.steps')
        numbers = $(sliderWrapper).find '.slider-nums li'

        value = sliderWidth * .2 * (answer)
        input.val(answer)

        TweenMax.to step, .5,
            "clip" : "rect(0px #{value}px 15px 0px)"

        TweenMax.to handle, .5,
            x: value

        number = $(numbers).eq(answer - 1)
        thisNum = number.find 'span'
        prevNums = number.prevAll().find 'span'
        afterNums = number.nextAll().find 'span'
        color = $(thisNum).data('color')

        TweenMax.to thisNum, .35,
            "color" : color,
            scale : 1.15

        TweenMax.to prevNums, .35,
            "color" : "white",
            scale : 1.15

        TweenMax.to afterNums, .35,
            "color" : "white"
            scale : 1

    clickNumber: (opts) =>
        target = opts.target
        answer = $(target).text()
        wrapper = $(target).parents('.slider-wrapper')
        slider = wrapper.find '.slider'
        sliderWidth = $(slider).width()
        handle = wrapper.find '.slider-handle'
        input = wrapper.find 'input'
        step = $(slider).find('.steps')

        value = sliderWidth * .2 * (answer)
        input.val(answer)


        TweenMax.to step, .5,
            "clip" : "rect(0px #{value}px 15px 0px)"

        TweenMax.to handle, .5,
            x: value

        number = $(target).parent()
        thisNum = number.find 'span'
        prevNums = number.prevAll().find 'span'
        afterNums = number.nextAll().find 'span'
        color = $(thisNum).data('color')

        TweenMax.to thisNum, .35,
            "color" : color,
            scale : 1.15,

        TweenMax.to prevNums, .35,
            "color" : "white",
            scale : 1.15,

        TweenMax.to afterNums, .35,
            "color" : "white",
            scale : 1,

    initializeDraggable: ->
        snapX = []
        sliderWidth = $('.slider').width()

        for i in [5..0]
            snapX[i] = sliderWidth * (.2 * i)



        Draggable.create ".slider-handle",
            type:"x"
            edgeResistance:1
            throwProps:true
            bounds: {minX: 0, maxX: sliderWidth}
            snap: {x:snapX}
            cursor:'pointer'
            onDrag: @onDrag
            onThrowUpdate: @onDrag
            onDragStart: @onDragStart()
            onThrowComplete: ->
                selection = ((@.endX) / (.2 * sliderWidth))

                console.log selection
                $(@._eventTarget).parents('.slider-wrapper').find('input').val(Math.round(selection))

    onDragStart: =>
        self = @
        return ->
            $target = $(@._eventTarget)
            self.clearError($target.parent().parent().parent().prev().find('.error'))

    clearError: (error) ->

        error.removeClass('show')
        error.text('')

    onDrag: () ->
        fraction = @.x / @.maxX
        value = Math.round(fraction * 5)
        width = $('.slider').width()
        numbers = $(@._eventTarget).parents('.slider-wrapper').find 'ol.slider-nums li'
        $target = $(@._eventTarget)

        $toClip = $target.parent().find('.steps')
        TweenMax.set $toClip ,
            "clip" : "rect(0px #{@.x}px 15px 0px)"


        number = $(numbers).eq(value - 1)
        thisNum = $(number).find 'span'
        color = $(thisNum).data 'color'
        prevNums = $(number).prevAll().find 'span'
        nextNums = $(number).nextAll().find 'span'

        if value >= 1
            TweenMax.to thisNum, .35,
                "color" : color,
                scale : 1.15,

            TweenMax.to prevNums, .35,
                "color" : "white",
                scale : 1.15,

            TweenMax.to nextNums, .35,
                "color" : "white",
                scale : 1,


        # if value >= 3
        #     console.log 'value: ', value
        #     console.log 'value >= 3'
        # else
        #     console.log 'value: ', value
        #     console.log 'value < 3'




    syncSliders: =>
        sliderWidth = $('.slider').width()

        for slider in $(@els)
            answer = $(slider).find('input').val()
            $steps = $(slider).find('.steps')


            value = sliderWidth * .2 * (answer)
            $handle = $(slider).find('.slider-handle')

            TweenMax.set $steps,
                "clip" : "rect(0px #{value}px 15px 0px)"

            TweenMax.set $handle ,
                x: value



module.exports = SurveySlider
