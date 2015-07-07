class OptionsRank extends Backbone.View

    constructor: (opts) ->
        super(opts)




    initialize: (opts) ->
        super(opts)

        @$el.each (i,t) =>

            $(t).data('ranks' , {
                1: null,
                2: null,
                3: null,
            })


            if !$(t).hasClass("options-rank")
                $(t).addClass("options-rank")


        @delegateEvents @generateEvents()
        @syncOption()




    generateEvents: ->

        events = {}

        options = @$el.find(".option")

        self = @
        options.each ->
            option = new Hammer this
            option.on('tap' , self.optionClick)





        ###if !Modernizr.touch
            events['click .option'] = "optionClick"
        else
            events['touchend .option'] = "optionClick"###

        return events

    syncOption: ->
        @$el.each ->
            $input = $(@).find('input')
            $options = $(@).find(".option")
            valString = $input.val()
            valCsv = valString.split(',')



            for v,i in valCsv
                console.log v, i
                $options.each ->
                    if $(@).data('val') is v
                        $(@).addClass('selected')
                        $(@).addClass("rank-#{i+1}")
                        $(@).append("<div class='rank-number'>#{i+1}</div>")


    getNextRank: (data) ->

        for k of data
            if data[k] is null
                return k

    updateInput: (data, $input) ->

        val = ""
        for k,o of data
            if o?
                val += "#{o.value},"

        val = val.substr 0, val.length-1
        $input.val val


    optionClick: (e) =>



        $target = $(e.target).closest(".option")


        $targetContainer = $target.closest(".options-rank")
        $targetInput = $targetContainer.find('input').first()
        $targetLabel = $targetContainer.prev()
        $targetLabel.find(".error").removeClass('show')

        limit = parseInt $targetContainer.data('limit')
        containerData = $targetContainer.data('ranks')
        isActive = $target.hasClass('selected')
        optionRank = $target.data('rank')



        optionValue = $target.data('val')

        if !isActive

            nextRank = @getNextRank(containerData)
            console.log nextRank , limit
            if nextRank <= limit
                containerData[nextRank] =
                    value:optionValue
                $target.data('rank', nextRank)
                $target.addClass('selected')
                $target.addClass("rank-#{nextRank}")
                $target.append("<div class='rank-number'>#{nextRank}</div>")
        else
            containerData[optionRank] = null
            $target.data('rank', null)
            $target.removeClass('selected')
            $target.removeClass("rank-1 rank-2 rank-3 rank-4 rank-5" )
            $target.find('.rank-number').remove()



        $targetContainer.data('ranks' , containerData)
        @updateInput(containerData, $targetInput)
















module.exports = OptionsRank
