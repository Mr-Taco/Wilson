ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'
Share = require '../utils/share.coffee'
Tracking = require '../utils/track.coffee'

class HeaderView extends ViewBase

    initialize: (opts) ->
        super opts

        @sections = $('section.section')

        $(window).scroll @onScroll
        @delegateEvents @generateEvents()
        @populateTwitterShare()


    generateEvents: ->

        $('body').on 'click', @hideHeaderLocalization

        events = {}

        events['mouseenter #nav li img.share-icon'] = "showHeaderSharing"
        events['mouseleave #nav-wrapper'] = "hideHeaderSharing"
        events['click #header-share-fb'] = "shareFacebook"
        events['click #nav li a.link'] = "scrollTo"
        events['click #nav-select'] = "toggleHeaderLocalization"
        events['click p.country'] = "changeLangauge"
        events['click img.flag'] = "changeLangauge"
        events['click img#header-logo'] = "logoLinkout"
        events['click a#nav-preorder'] = "trackPreorder"
        events['click a#mobile-nav-preorder'] = "trackPreorder"

        if Modernizr.touch
            events['touchend img#mobile-nav-icon'] = "showMobileNav"
            events['touchend img#mobile-nav-close'] = "hideMobileNav"
            events['touchend #nav li img.share-icon'] = "handleHeaderSharing"
            events['touchend #header-share-fb'] = "shareFacebook"
            events['touchend #nav li a.link'] = "scrollTo"
            events['touchend #mobile-nav li a'] = "scrollTo"
            events['touchend img#scroll-to-learn'] = "scrollTo"



        return events




    trackPreorder: (e) =>
        id = $(e.target).attr 'id'
        Tracking.gaTrackElement($('#' + id))

    logoLinkout: (e) =>


    changeLangauge: (e) =>
        goTo = $(e.target).parent().find("p.country").data 'country'
        window.location.replace '/burn/' + goTo

    toggleHeaderLocalization: (e) =>
        e.preventDefault()
        e.stopPropagation()
        locWrapper = $(".localization-wrapper")
        arrow = $("#nav-select i.fa-angle-up")

        if locWrapper.hasClass 'open'
            TweenMax.to $(locWrapper), .5,
                alpha: 0,
                display: 'none'
            TweenMax.to $(arrow), .35,
                rotation: 0

            locWrapper.removeClass 'open'
        else
            TweenMax.to $(arrow), .35,
                rotation: 180
            TweenMax.to $(locWrapper), .5,
                alpha: 1,
                display: 'block'

            locWrapper.addClass 'open'

    hideHeaderLocalization: (e) =>
        locWrapper = $(".localization-wrapper")
        arrow = $("#nav-select i.fa-angle-up")

        TweenMax.to $(locWrapper), .5,
            alpha: 0,
            display: 'none'
        TweenMax.to $(arrow), .35,
            rotation: 0

        locWrapper.removeClass 'open'

    showMobileNav: (e) ->
        e.preventDefault()
        TweenMax.set $('#mobile-nav-close'),
            transformOrigin: "center bottom"

        TweenMax.to $('#mobile-nav-wrapper'), .65,
            y: 898,
            zIndex: 55,
            onComplete: =>
                TweenMax.to $('#mobile-nav-close'), .1,
                    rotationX: 0,
                    ease: Linear.easeNone

    hideMobileNav: (e) ->
        if e.preventDefault?
            e.preventDefault()
        TweenMax.to $('#mobile-nav-close'), .1,
            rotationX: 90,
            ease: Linear.easeNone,
            onComplete: =>
                TweenMax.to $('#mobile-nav-wrapper'), .65,
                    delay: .45,
                    y: 0

    showHeaderSharing: (e) =>
        $('#nav-wrapper').addClass 'show-share-icons'
        $('i.fa-facebook, i.fa-twitter').addClass 'visible'

    hideHeaderSharing: (e) =>
        $('#nav-wrapper').removeClass 'show-share-icons'
        $('i.fa-facebook, i.fa-twitter').removeClass 'visible'

    handleHeaderSharing: (e) =>
        navWrapper = $("#nav-wrapper")

        if navWrapper.hasClass('show-share-icons')
            @hideHeaderSharing()
        else
            @showHeaderSharing()

    shareFacebook: (e) =>
        e.preventDefault()
        fbCopy = @model.get('social').facebook
        caption = fbCopy.caption
        title = fbCopy.title
        image = window.location.origin + fbCopy.image
        link = window.location.origin
        description = fbCopy.description

        Share.fbShare title , caption, image , link, description

    populateTwitterShare: ->
        href = $("#twitter").attr('href')
        twitterCopy = @model.get('social').twitter
        twitterShareMessage = twitterCopy.message

        href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(twitterShareMessage)

        $("#twitter-share").attr('href' , href)

    scrollTo: (e, jump) =>
        if e.preventDefault?
            e.preventDefault()
        if e.stopPropagation?
            e.stopPropagation()

        $t = $(e.target)
        section = $t.data('scrollto')
        goToSection = $('#' + section)
        y = (goToSection.offset().top - 60)

        duration = if jump then 1 else 1000

        $('html, body').animate {
            scrollTop: y + 'px'
        }, duration

        @hideMobileNav(e)

    onScroll: (e) =>
        scrollTop = $(window).scrollTop() + 60

        for section in @sections
            $height = $(section).height()
            $offset = $(section).offset().top - (window.innerHeight/2)

            if $offset <= scrollTop <= ($offset + $height)
                $s = $(section).attr 'id'
                $('#nav li a').removeClass 'active'
                $('a.link#nav-' + $s).addClass 'active'


    classicFix: (e) =>
        console.log 'test'
        console.log '    '


module.exports = HeaderView
