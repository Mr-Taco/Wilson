ModelBase = require './abstract/ModelBase.coffee'


class App extends ModelBase

    allowInstantiation = false
    instance = null


    constructor: (opts) ->

        if !allowInstantiation
            throw 'App is a singleton. Use App.getInstance() instead.'
        else
            allowInstantiation = false
            super(opts)

    App.getInstance = (opts) ->
        if instance is null
            allowInstantiation = true
            instance = new App(opts)

        instance


    initialize: (opts) ->
        super opts
        @set 'ready' , false
        @once 'change' , @ready
        @fetch()



    ###generateSessionModel: =>
        session = new SessionModel
            csrfService: @get('services').csrf
            loginService: @get('services').login




        session.once 'change:csrf' , @ready
        session.getCSRF()

        @set 'session' , session###


    ready: =>
        @set 'ready' , true





    processData: ->
        super()



module.exports = App

