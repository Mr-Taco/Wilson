
ViewBase = require './abstract/ViewBase.coffee'
SurveySlider = require './plugin/SurveySlider.coffee'
OptionsSelect = require './plugin/OptionsSelect.coffee'
OptionsRank = require './plugin/OptionsRank.coffee'
OptionsSelectMulti = require './plugin/OptionsSelectMulti.coffee'
ScrollNav = require './plugin/ScrollNav.coffee'



class SurveyView extends ViewBase


    constructor: (opts) ->

        @template = require '../../../templates/survey.jade'

        super(opts)




    initialize: (opts)->
        super(opts)
        @model.once 'forbidden' , =>
            @model.destroy()
            Backbone.history.navigate '/login' ,
                trigger:true

        @model.once 'notfound' , =>
            @model.off "sync"
            @transitionIn()

        @model.once 'sync' , =>
            @model.off "notfound"
            @transitionIn()

        @model.fetch()



    setUpValidation: ->

        @$el.find("input , textarea").focus  ->
            $target = $(@)
            $target.parent().parent().prev().find(".error").removeClass('show')

        $("form#survey-form").validate
            focusInvalid:false
            invalidHandler: (form, validator) ->
                if !validator.numberOfInvalids()
                    return
                errTop = $(validator.errorList[0].element).parent().offset().top- 120
                window.scrollTo 0 , errTop

            errorPlacement: (err , el) ->
                id = el.attr('id')
                errorLabel = $("label[for='#{id}']").find(".error")
                if(errorLabel.length < 1)
                    dataFor = el.data('for')
                    errorLabel = $("label[for='#{dataFor}']").find(".error")


                if(errorLabel.text().length < 1)
                    errorLabel.html(err.text())

                errorLabel.addClass('show')


    afterRender: ->
        super()


        @setUpValidation()

        console.log @model

        @$el.find('#welcome .user em').html(@model.get('username'))
        $('header').find("#username-display").html(@model.get('username'))
        $('header').find(".recruit-number").html(@model.get('recruitNumber'))
        $('header').addClass('show')

        @options = new OptionsSelect
            el: ".options-select"

        @optionsMulti = new OptionsSelectMulti
            el: ".options-select-multi"

        @rank = new OptionsRank
            el: ".options-rank"

        @sliders = new SurveySlider
            el: '.slider-wrapper'


        @scrollNav= new ScrollNav
            el: "#scroll-nav"






    addHover: (e) ->
        console.log "hover?"
        $(e.target).closest('.hoverable').addClass('hover')

    removeHover: (e) ->
        $(e.target).closest('.hoverable').removeClass('hover')



    generateEvents: ->
        events = {}








        if !@isTouch

            events['mouseenter .hoverable'] = "addHover"
            events['mouseleave .hoverable'] = "removeHover"
            events['click #submit'] = "onSave"
        else
            events['touchend #submit'] = "onSave"



        return events

    onSave: (e) =>

        e.preventDefault()

        if @$el.find("form#survey-form").valid()
            inputs = @$el.find("input, textarea")

            @undelegateEvents()

            inputs.each (i,t) =>
                input = $(t)
                name = input.attr('name')
                value = input.val()
                @model.set name , value

            @model.once 'sync' , @onSaveSuccess
            @model.save()


    validateFields: ->
        val = true

        val = @options.validate()


        return val


    onSaveSuccess: ->
        console.log "Save Success"

        Backbone.history.navigate 'thank-you' ,
            trigger:true


module.exports = SurveyView


