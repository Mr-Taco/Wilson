
ViewBase = require './abstract/ViewBase.coffee'
AppModel = require '../models/AppModel.coffee'


class LoginView extends ViewBase


    constructor: (opts) ->
        @model = AppModel.getInstance()
        @template = require '../../../templates/login.jade'

        super(opts)


    setUpValidation: ->


        $('input').focus ->
            id = $(@).attr('id')
            errorLabel = $("span[for='#{id}']")
            errorLabel.removeClass('show')

        $("form#login-form").validate
            errorPlacement: (err , el) ->
                id = el.attr('id')


                errorLabel = $("span[for='#{id}']")
                if(errorLabel.length < 1)
                    dataFor = el.data('for')
                    errorLabel = $("span[for='#{dataFor}']")



                errorLabel.html(err.text())
                errorLabel.addClass('show')



    afterRender: ->
        super()
        $("header").removeClass('show')

        @setUpValidation()

    generateEvents: ->

        events = {}
        events['click #login'] = 'loginUser'

        return events

    onEnter: (e) =>
        if e.keyCode is 13
            @loginUser(e)


    loginUser: (e) =>


        e.preventDefault()

        if $("form#login-form").valid()
            identifier = @$el.find("input#identifier").val()
            password = @$el.find("input#password").val()
            @model.get('session').once 'change:user' , @loginSuccess
            @model.get('session').once 'forbidden' , @loginError
            @model.get('session').loginUser(identifier,password)

    loginError: =>
        $("span.error[for='password']").text("The password you entered is incorrect.").addClass('show')


    loginSuccess: =>


        Backbone.history.navigate '/' ,
            trigger:true








module.exports = LoginView


