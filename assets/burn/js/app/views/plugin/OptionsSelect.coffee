class OptionsSelect extends Backbone.View

    constructor: (opts) ->
        super(opts)




    initialize: (opts) ->
        super(opts)

        @$el.each (i,t) =>




            if !$(t).hasClass("options-select")
                $(t).addClass("options-select")


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
            $textarea = $(@).find('textarea')
            $options = $(@).find(".option")

            tval = $textarea.val()
            val = $input.val()
            $options.each ->
                if $(@).data('val') is val
                    $(@).addClass('selected')
                if $(@).data('val') is tval and tval isnt ''
                    $(@).addClass('selected')




    optionClick: (e) =>

        $target = $(e.target).closest(".option")
        $targetContainer = $target.closest(".options-select")
        $targetLabel = $targetContainer.prev()
        $targetInput = $targetContainer.find('input').first()
        $targetTextarea = $targetContainer.find('textarea').last()

        data = $target.data('val')
        $targetInput.val(data)
        if $targetInput.length < 1
            $targetTextarea.html(data)

        $targetContainer.find('.option').each ->
            $(@).removeClass('selected')

        $target.addClass('selected')
        $targetLabel.find(".error").removeClass('show')

        if $targetContainer.hasClass 'explain'
            if $target.find('p').hasClass('other')
                $targetTextarea.removeClass 'hidden'
            else
                $targetTextarea.addClass 'hidden'










module.exports = OptionsSelect
