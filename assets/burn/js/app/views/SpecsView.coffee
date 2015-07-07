ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'
Tracking = require '../utils/track.coffee'


class SpecsView extends ViewBase

    constructor: (opts) ->
        @model = AppModel.getInstance()


        super(opts)

    initialize: (opts) ->
        super(opts)

        @delegateEvents(@generateEvents())
        @isWebGL = @isWebGL()
        @initiateSwiperGalleries()



    generateEvents: ->
        events = {}

        $(window).on 'resize', @checkForRacket
        $(window).on 'load', @checkForRacket

        events['click a.orange-btn'] = 'trackPreorders'

        if !@isPhone
            events['click a#see-more-specs'] = "toggleTable"
            events['click a#close-table'] = "toggleTable"


        return events


    trackPreorders: (e) =>
        Tracking.gaTrackElement($(e.target))

    toggleTable: (e) =>
        if e.preventDefault?
            e.preventDefault()
        $('#see-more-specs').toggleClass 'showing'

        if $(specs).hasClass 'showing-table'
            @animateTable('hide')
        else
            @animateTable('show')
            TweenMax.to window , .5 ,
                scrollTo:
                    y: 2280 - (window.innerHeight - $('#specs-table').height()) / 2

            Tracking.gaTrackElement($('#see-more-specs'))

    animateTable: (opts) =>
        specs = $('#specs')
        tableRows = $('#specs-table').find 'tr'
        tableHeight = $('#specs-table').height()

        if window.innerWidth < 850
            expandedHeight = 2260
        else if window.innerWidth < 1000
            expandedHeight = 2150
        else
            expandedHeight = 2150

        tableIn = new TimelineMax({align: "start", stagger: 0, paused: true, onComplete: =>

        })

        TweenMax.set $(tableRows), {y: 20, alpha: 0, rotationX: -90, rotationY: -35}

        for row,i in $(tableRows)
            tableIn.add TweenMax.staggerTo($(row), .2, {y: 0, alpha: 1, rotationX: 0, rotationY: 0, ease:Quad.easeInOut, delay: 0}), (.25 + (.1*i)), "normal", 0

        if opts == 'show'
            TweenMax.fromTo($(specs), .05, {height: 1540}, {height: expandedHeight})
            tableIn.resume()
            $(specs).addClass 'showing-table'
        else
            tableIn.reverse(0)
            TweenMax.fromTo($(specs), .45, {height: expandedHeight}, {height: 1540})
            $(specs).removeClass 'showing-table'

    initiateSwiperGalleries: (opts) =>
        galleries = $('.swiper-container')
        swipers = []

        for gallery,i in $(galleries)
            id = '#' + $(gallery).attr 'id'
            dots = $(gallery).next().attr 'id'
            $(id + ', .swipe-for-more').css {display: 'block'}

            swipers[i] = new Swiper id, {
                pagination: '#' + dots + '.pagination',
                paginationClickable: true
            }

    checkForRacket: (e) =>
        windowWidth = window.innerWidth

        if windowWidth < 700
            $('#racket').css {visibility: 'hidden'}
            $('#racket-fallback').css {visibility: 'visible'}
        else
            if !@isWebGL
                $('#racket').css {visibility: 'hidden'}
                $('#racket-fallback').css {visibility: 'visible'}
            else
                $('#racket').css {visibility: 'visible'}
                $('#racket-fallback').css {visibility: 'hidden'}






module.exports = SpecsView
