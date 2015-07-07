
AppModel = require './models/AppModel.coffee'
ViewController = require './controllers/ViewController.coffee'

class Burn

    constructor: ->


        @initModels()


    initModels: ->

        url = $("html").data('data') or "/burn/data/en.json"
        @model = AppModel.getInstance
            url: url

        @model.once "change:ready" , @initViews
        @model.fetch()


    initViews: =>

        @viewController = new ViewController
        @viewController.checkPaths()






module.exports = Burn
