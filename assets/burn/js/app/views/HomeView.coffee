
ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'
Tracking = require '../utils/track.coffee'

class HomeView extends ViewBase


    constructor: (opts) ->
        @appModel = AppModel.getInstance()

        super(opts)

    initialize: (opts) ->
        super()

        @delegateEvents @generateEvents()
        @initVideo()
        @pulsing

    generateEvents: ->
        events = {}

        events['click img#scroll-to-learn'] = "scrollTo"
        if !@isPhone
            events['click #play-btn-hover'] = "playVideo"
        else
            events['click img#play-btn-hover'] = "showFallback"
        events['click a.pre-order'] = "notifyMe"
        events['click .overlay-container button'] = 'clickButton'

        return events

    scrollTo: (e) =>
        e.preventDefault()

        $t = $(e.target)
        section = $t.data('scrollto')
        goToSection = $('#' + section)

        TweenMax.to window , 1 ,
            scrollTo:
                y:goToSection.offset().top - 60


    notifyMe: (e) =>
        id = $(e.target).attr 'id'
        Tracking.gaTrackElement($('#' + id))


    initVideo: ->
        @video = new MediaElementPlayer "#hero-video" ,
            videoWidth:"100%"
            videoHeight:"100%"
            alwaysShowvntrols:false
            pluginPath: '/burn/swf/'
            features:['playpause','current','progress','duration','volume']
            success: (me, el) =>
                el.setAttribute('poster', '')
                me.addEventListener('pause' , @onVideoPause)
                me.addEventListener('play' , @onVideoPlay)

        @video.pause()

    playVideo: =>
        if @isPhone || @isTablet
            return @showFallback()

        @video.play()


    showFallback: =>
        TweenMax.to $('#hero-overlay'), .35,
            alpha: 0,
            display: 'none'

        TweenMax.to $('#mep_0'), .35,
            alpha: 0,
            display: 'none'

        TweenMax.to $('#marquee-fallback'), .5,
            alpha: 1,
            zIndex: 10


    onVideoPause: =>
        #console.log 'paused'
        $('#hero-overlay').css {background: 'none'}
        $('.overlay-container, p#watch-video').css {display: 'none'}
        #$('p#watch-video').css {display: 'none'}
        $('.mejs-controls-container').css {zIndex: 1000000}

        TweenMax.set $('#play-btn'),
            opacity: 1

        TweenMax.set $('#play-btn-hover'),
            opacity: 0

        TweenMax.to @$el.find("#hero-overlay") , 1 ,
            autoAlpha:1

        @pulsing = new TimelineMax({align: "start", stagger: 1, paused: true, repeat: -1, repeatDelay: .35, yoyo: true})
        @pulsing.add TweenMax.to($('#play-btn'), 0.85, {alpha: 0, ease: Quad.easeIn}), "normal", 0.1
        @pulsing.add TweenMax.to($('#play-btn-hover'), 0.85, {alpha: 1, ease: Quad.easeIn}), "normal", 0.1
        @pulsing.resume()

    onVideoPlay: =>
        Tracking.gaTrackElement($('#play-btn-hover'))
        TweenMax.to @$el.find("#hero-overlay") , .5 ,
            autoAlpha:0

        if @pulsing != undefined
            @pulsing.kill()


    showHover: =>
        TweenMax.to $('#play-btn'), .35,
            alpha: 0,
            zIndex: -5

        TweenMax.to $('#play-btn-hover'), .35,
            alpha: 1,
            zIndex: 5


    hideHover: =>
        TweenMax.to $('#play-btn-hover'), .35,
            alpha: 0,
            zIndex: -5,
            delay: .25

        TweenMax.to $('#play-btn'), .35,
            alpha: 1,
            zIndex: 5,
            delay: .25


    clickButton: (e) =>
        e.stopPropagation()





module.exports = HomeView


