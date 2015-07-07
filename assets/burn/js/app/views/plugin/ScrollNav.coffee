class ScrollNav extends Backbone.View

    initialize: (opts) ->
        super opts

        @sections = $('section.section')

        $(window).scroll @onScroll
        @delegateEvents @generateEvents()

    
    generateEvents: ->

        events = {}

        if !Modernizr.touch
            events['click #nav li a.link'] = "scrollTo"
            events['click img#scroll-to-learn'] = "scrollTo"
            events['click #header-logo'] = "scrollTo"
        else
            events['touchend #nav li a.link'] = "scrollTo"
            events['touchend #mobile-nav li a'] = "scrollTo"
            events['touchend #scroll-to-learn'] = "scrollTo"
            events['touchend #header-logo'] = "scrollTo"


        return events


    scrollTo: (e) =>
        console.log 'scrollTo'
        e.preventDefault()

        $t = $(e.target)
        section = $t.data('scrollto')
        goToSection = $('#' + section)

        TweenMax.to window , 1 ,
            scrollTo:
                y:goToSection.offset().top - 60




    onScroll: (e) =>
        scrollTop = $(window).scrollTop() + 60

        for section in @sections
            $height = $(section).height()
            $offset = $(section).offset().top - (window.innerHeight/2)

            if $offset <= scrollTop <= ($offset + $height)
                $s = $(section).attr 'id'
                $('#nav li a').removeClass 'active'
                $('a.link#nav-' + $s).addClass 'active'





module.exports = ScrollNav
