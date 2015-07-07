
class Session extends Backbone.Model

    constructor: (opts) ->
        super opts

    initialize: ->
        @set('user' , null)
        @set('csrf' , null)


    getCSRF: ->

        $.ajax
            url:@get('csrfService')
            success: @onCSRFSuccess
            error: @onAuthError


    loginUser: (indentity, password , provider = "local") ->

        loginData =
            identifier: indentity
            password: password
            provider: provider
            _csrf: @get('csrf')


        $.ajax
            url:@get("loginService")
            method:"POST"
            data:JSON.stringify loginData
            contentType:'application/json'
            success:@onLoginSuccess
            error:@onAuthError


    onCSRFSuccess: (data) =>
        @set('csrf', data._csrf)


    onLoginSuccess: (data) =>
        console.log data
        @setUser(data)

    setUser: (data) ->

        @set('user' , data)


    onAuthError: (err) =>

        @trigger "forbidden"






module.exports = Session
