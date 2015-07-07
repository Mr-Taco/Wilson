
ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'


class TeamPlayerView extends ViewBase

    constructor: (opts) ->
        @model = AppModel.getInstance()
        @id = opts
        super(opts)

    initialize: (opts) ->
        super(opts)
        @delegateEvents(@generateEvents())



    generateEvents: ->
        events = {}

        if !@isTouch
        else

        return events


    transitionOut: (e) =>
        topCard = $('.player.top')
        topPlayerName = $(topCard).find '.player-name h1'
        topPs = $(topCard).find '.responses p'

        transitionOut = new TimelineMax({align: "start", stagger: 1, paused: true, onComplete: =>
            # Kill the timeline, and revert all splittext back to html
            transitionOut.kill()
            split.revert()

            for q in splitQuestionsOut
                q.revert()
        })

        # Add animation for top card questions + answers
        splitQuestionsOut = []
        for p,i in topPs
            splitQuestionsOut[i] = new SplitText($(p), {type:"chars,words,lines"})
            transitionOut.add TweenMax.staggerTo(splitQuestionsOut[i].lines, .5, {x: 0, y: -10, alpha: 0, ease: Quad.easeInOut}), (.05*(i+1)), "normal", -.175

        # Add animation for top card player name
        split = new SplitText(topPlayerName, {type:"chars,words,lines", position:"absolute"})
        transitionOut.add TweenMax.staggerTo(split.chars, .75, {x:0, y:0, alpha:0, ease: Quad.easeInOut}), .5, "normal", -.05

        # Fade Out the background image
        transitionOut.add TweenMax.to($(topCard), .5, {ease:Quad.easeOut, scale: 1.5, alpha: 0, zIndex: -5}), 1.35, "normal", .5

        # Play TransitionOut Timeline
        transitionOut.resume()

    transitionIn: (nextPlayer) ->
        topCard = $('.player.top')
        nextPlayerName = $(nextPlayer).find '.player-name h1'
        responsesHeight = $(nextPlayer).find('.responses').data 'height'
        nextPlayerPs = $(nextPlayer).find '.responses p'

        TweenMax.to $('.responses'), .35,
            delay: 2,
            ease: Quad.easeInOut,
            height: parseInt(responsesHeight, 10)

        transitionIn = new TimelineMax({align: "start", stagger: 1, paused: true, onComplete: =>
            # Adjust classes for transitioning cards
            topCard.removeClass 'top'
            $(nextPlayer).addClass 'top'

            # Kill the timeline and revert splittext back to html
            transitionIn.kill()
            splitNext.revert()

            for q in splitQuestionsIn
                q.revert()
        })

        # Animate Bottom Card Upwards & Visible
        transitionIn.add TweenMax.to($(nextPlayer), .5, {ease:Quad.easeInOut, scale: 1, alpha: 1, zIndex: 5}), 1.25, "normal", 1.25

        splitNext = new SplitText(nextPlayerName, {type:"chars,words,lines", position:"absolute"})
        transitionIn.add TweenMax.staggerFromTo(splitNext.chars, .75, {x: 0, y: 0, alpha:0, ease: Quad.easeInOut}, {x: 0, y: 0, alpha:1, ease: Quad.easeInOut}, 0.01), 1.5, "normal", .01

        splitQuestionsIn = []
        for p,i in nextPlayerPs
            splitQuestionsIn[i] = new SplitText($(p), {type:"chars,words,lines"})
            transitionIn.add TweenMax.staggerFromTo(splitQuestionsIn[i].lines, .5, {x: 0, y: -10, alpha: 0, ease: Quad.easeInOut}, {x: 0, y: 0, alpha: 1, ease: Quad.easeInOut}, 1.25), (1.5 + (.08*i)), "normal", -1.2

        transitionIn.resume()

    openPlayer: (opts) =>
        responses = $(opts).find '.responses'
        angle = $(opts).find 'img.angle-expand'
        Ps = $(responses).find('p')
        height = 0
        name = $(opts).find '.player-name h1'
        index = $(opts).data 'index'
        y = 2386 + 87*(index)

        for p in Ps
            height = height + $(p).height() + 12

        open = new TimelineMax({align: "start", stagger: 1, paused: true, onComplete: =>
            # Kill the timeline
            open.kill()
        })

        # Rotate the arrow to point down
        open.add TweenMax.to($(angle), .5, {rotation: 180}, 0.25), .25, "normal", .01

        # Color players name red
        open.add TweenMax.to($(name), .5, {color: '#da1a32'}, 0.25), .25, "normal", .01

        # Expand questions to be visible
        open.add TweenMax.to($(responses), .05, {height: height, ease: Quad.easeOut}, 0.15), .5, "normal", .05
        open.resume()
        
        $(responses).addClass('open').removeClass 'closed'

        $('html, body').animate {
            scrollTop: y + 'px'
        }, 1000

    closePlayer: (opts) =>
        responses = $(opts).find '.responses'
        angle = $(opts).find 'img.angle-expand'
        name = $(opts).find '.player-name h1'

        close = new TimelineMax({align: "start", stagger: 1, paused: true, onComplete: =>
            # Kill the timeline
            close.kill()
        })

        # Close questions to be invisible
        close.add TweenMax.to($(responses), .05, {height: 0, ease: Quad.easeOut}, 0.15), .5, "normal", .05

        # Turn player name back to white
        close.add TweenMax.to($(name), .5, {color: '#fff'}, 0.25), .25, "normal", .01

        # Rotate the arrow to point up
        close.add TweenMax.to($(angle), .5, {rotation: 0}, 0.25), .25, "normal", .01

        close.resume()

        $(responses).removeClass('open').addClass 'closed'


module.exports = TeamPlayerView



