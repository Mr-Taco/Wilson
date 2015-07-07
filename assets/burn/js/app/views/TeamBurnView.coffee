
ViewBase = require './abstract/ViewBase.coffee'
TeamPlayerView  = require './TeamPlayerView.coffee'
AppModel = require '../models/AppModel.coffee'
Tracking = require '../utils/track.coffee'


class PlayersView extends ViewBase


    constructor: (opts) ->
        @model = AppModel.getInstance()


        super(opts)

    initialize: (opts) ->
        super(opts)

        @playerInstances = []
        @playerNames = []
        @createPlayers()
        @delegateEvents(@generateEvents())

    generateEvents: ->

        events = {}

        if !@isPhone
            events['mouseenter .member img.inactive'] = "hoverPlayer"
            events['mouseleave .member img.inactive'] = "leavePlayer"
            events['click #toggle-more-less'] = "toggleMoreResponses"
            events['click #toggle-more-less i.fa-th'] = "clickMoreLess"
            events['click #the-team img'] = "switchPlayers"
            events['click #prev-member'] = 'prevPlayer'
            events['click #next-member'] = 'nextPlayer'
            events['mousemove .content-wrapper'] = 'animateBackground'
            events['mousemove .player.top'] = 'animateBackground'

        else
            events['click .player'] = "switchPlayers"

        return events

    createPlayers: ->
        teamBurnWrapper = $('#team-burn-wrapper')
        players = teamBurnWrapper.find '.player'

        for p,i in players
            id = $(p).attr 'id'
            @playerNames.push id
            @playerInstances[id] = new TeamPlayerView
                $el:$('#' + id)

    prevPlayer: (e) ->
        e.preventDefault()
        topName = $('.player.top').attr 'id'
        topResponses = $('.player#' + topName + ' .responses')
        index = @playerNames.indexOf topName
        length = @playerNames.length
        prevName = ''

        if index > 0
            prevName = @playerNames[index - 1]
            $('#' + prevName + '-thumbnail img.inactive').trigger 'click'
        else
            prevName = @playerNames[(length - 1)]
            $('#' + prevName + '-thumbnail img.inactive').trigger 'click'

        newQuestions = $("#team-burn-wrapper").find('.player#' + prevName + ' .responses')
        newPs = $(newQuestions).find 'p'
        height = 0

        for p in $(newPs)
            height = height + $(p).height() + 12

        TweenMax.to [$('#team-burn-content .responses'), $(newQuestions)], .35,
            height: height,
            delay: 2,
            onComplete: ->
                TweenMax.to $(topResponses), .35, {height: 180}



    nextPlayer: (e) ->
        e.preventDefault()
        topName = $('.player.top').attr 'id'
        topResponses = $('.player#' + topName + ' .responses')
        index = @playerNames.indexOf topName
        length = @playerNames.length
        nextName = ''

        if index < (length - 1)
            nextName = @playerNames[index + 1]
            $('#' + nextName + '-thumbnail img.inactive').trigger 'click'
        else
            nextName = @playerNames[0]
            $('#' + nextName + '-thumbnail img.inactive').trigger 'click'

        newQuestions = $("#team-burn-wrapper").find('.player#' + nextName + ' .responses')
        newPs = $(newQuestions).find 'p'
        height = 0

        for p in $(newPs)
            height = height + $(p).height() + 12

        TweenMax.to [$('#team-burn-content .responses'), $(newQuestions)], .35,
            height: height,
            delay: 2,
            onComplete: ->
                TweenMax.to $(topResponses), .35, {height: 180}





    animateBackground: (e) ->
        x = e.pageX
        y = e.pageY
        percentX = Math.round((x / window.innerWidth) * 100) / 1.75
        percentY = Math.round(((y - $('#team-burn').position().top) / $('#team-burn').height()) * 100) / 1.75

        bg = $('.player.top')
        # TweenMax.to $(bg), .1, {backgroundPosition: '' + Math.abs(50 - percentX) + '% ' + Math.abs(50 - percentY) + '%', ease: Quad.easeInOut}

    switchPlayers: (e) ->
        if !@isPhone
            name = $(e.target).closest(".member").data 'name'
            topID = $('.player.top').attr 'id'

            if name != topID
                @playerInstances[topID].transitionOut()
                @playerInstances[name].transitionIn($('.player#' + name))

                @updatePlayerIcons(e)
                @disableSwitching()

            $thumb = $(e.target).parent()



        else
            selectedPlayer = $(e.target).parents '.player'
            selectedName = $(selectedPlayer).attr 'id'
            open = $('.responses.open').attr 'id'

            if $(e.target).find('.responses').hasClass 'open'
                @playerInstances[selectedName].closePlayer($('.player#' + selectedName))
                return false

            for p,i in $('.player')
                playerName = $(p).attr 'id'
                @playerInstances[playerName].closePlayer($('.player#' + playerName))

            @playerInstances[selectedName].openPlayer($(selectedPlayer))

            $thumb = $("##{selectedName}-thumbnail")

        Tracking.gaTrackElement $thumb





    disableSwitching: (e) ->
        $('#the-team .row, #prev-member, #next-member').css {pointerEvents: 'none'}
        setTimeout ( ->
            $('#the-team .row, #prev-member, #next-member').css({pointerEvents: 'auto'})
        ), 2500

    updatePlayerIcons: (e) =>
        inactive = $(e.target)
        active = $(inactive).next()
        selected = $('.member img.selected')

        # Get previously selected player icon ready to fade out
        TweenMax.set $(selected),
            opacity: 1,
            zIndex: 2,
            onComplete: =>
                #Remove selected class from previous player and transition out. Add selected class to next player
                $(selected).removeClass 'selected'

                TweenMax.to $(selected), .5,
                    alpha: 0,
                    zIndex: -1

                $(active).addClass 'selected'

    hoverPlayer: (e) ->
        activeImage = $(e.target).parent().find 'img.active'
        inavtiveImage = $(e.target).parent().find 'img.inactive'

        TweenMax.to $(activeImage), .5,
            alpha: 1

        TweenMax.to $(inavtiveImage), .5,
            alpha: 0

    leavePlayer: (e) ->
        activeImage = $(e.target).parent().find 'img.active'
        inavtiveImage = $(e.target).parent().find 'img.inactive'

        TweenMax.to $(activeImage), .5,
            alpha: 0

        TweenMax.to $(inavtiveImage), .5,
            alpha: 1

    toggleMoreResponses: (e) ->
        e.preventDefault()

        $target = $(e.target).closest('a')
        container = $target.prev()
        playerQWrapper = $("#team-burn-wrapper").find('.player.top .responses')
        responses = $("#team-burn-wrapper").find('.player .responses')
        Ps = $(playerQWrapper).find 'p'
        height = 0

        if container.hasClass 'closed'
            for p in $(Ps)
                height = height + $(p).height() + 12

            TweenMax.to [$(container), $(playerQWrapper)], .35,
                height: height
            TweenMax.to $('#the-team .row'), .35,
                autoAlpha: 0
                y: height



            $(container).removeClass 'closed'
            $target.find(".expand").hide()
            $target.find(".collapse").show()
            $('a#prev-member, a#next-member').addClass 'visible'
        else
            playerHeight = $(playerQWrapper).data 'height'
            TweenMax.to [$(container), $(playerQWrapper)], .35,
                height: parseInt(playerHeight, 10)
            TweenMax.to $('#the-team .row'), .35,
                autoAlpha: 1
                y: 0

            $(container).addClass 'closed'
            $target.find(".expand").show()
            $target.find(".collapse").hide()
            $('a#prev-member, a#next-member').removeClass 'visible'

    clickMoreLess: (e) ->
        e.preventDefault()
        e.stopPropagation()
        $('#toggle-more-less').trigger 'click'


module.exports = PlayersView


