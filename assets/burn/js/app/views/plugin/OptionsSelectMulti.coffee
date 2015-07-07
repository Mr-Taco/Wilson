class OptionsSelectMulti extends Backbone.View

    constructor: (opts) ->
        super(opts)




    initialize: (opts) ->
        super(opts)

        @$el.each (i,t) =>

            $(t).data('selected' , {

            })


            if !$(t).hasClass("options-select-multi")
                $(t).addClass("options-select-mutli")


        @delegateEvents @generateEvents()
        @syncOption()




    generateEvents: ->

        events = {}
        events['click .option'] = "optionClick"
        ### if !Modernizr.touch

        else###

        return events

    syncOption: ->
        @$el.each ->
            $input = $(@).find('input')
            $options = $(@).find(".option")
            valString = $input.val()
            valCsv = valString.split(',')

            for v,i in valCsv
                console.log v, i

                if v is 'other'
                    $(@).find('textarea.other').removeClass 'hidden'

                $options.each ->
                    if $(@).data('val') is v
                        $(@).addClass('selected')





    getNextRank: (data) ->

        for k of data
            if data[k] is null
                return k

    updateInput: (data, $input) ->

        val = ""
        for k,o of data
            val += "#{o},"


        val = val.substr 0, val.length-1
        $input.val val


    optionClick: (e) =>


        $target = $(e.target).closest(".option")
        $targetContainer = $target.closest(".options-select-multi")

        $targetLabel = $targetContainer.prev()
        $targetLabel.find(".error").removeClass('show')

        containerData = $targetContainer.data('selected')
        isActive = $target.hasClass('selected')
        optionRank = $target.data('rank')
        optionValue = $target.data('val')
        console.log containerData
        if !isActive

            if $target.hasClass 'other'
                $targetContainer.find('textarea.other').removeClass('hidden')

            containerData[optionValue] = optionValue
            $target.addClass('selected')

        else

            if $target.hasClass 'other'
                $targetContainer.find('textarea.other').addClass('hidden')

            delete containerData[optionValue]
            $target.removeClass('selected')



        $targetInput = $targetContainer.find('input').first()
        $targetContainer.data('selected' , containerData)


        @updateInput(containerData, $targetInput)
















module.exports = OptionsSelectMulti
