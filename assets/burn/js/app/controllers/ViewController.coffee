
AppModel = require '../models/AppModel.coffee'
RacketView = require '../views/racket/RacketView.coffee'
TeamBurnView = require '../views/TeamBurnView.coffee'
HomeView = require '../views/HomeView.coffee'
SpecsView = require '../views/SpecsView.coffee'
HeaderView = require '../views/HeaderView.coffee'
ConnectView = require '../views/ConnectView.coffee'
PostsModel = require '../models/PostsModel.coffee'
RacketModel = require '../models/RacketModel.coffee'


class ViewController

    constructor: ->
        @model = AppModel.getInstance()
        @isPhone = $("html").hasClass("phone")

        if !@isPhone
             @racketView = new RacketView
                 el:"#specs"
                 model:new RacketModel @model.get("view").racket3d

        @playersView = new TeamBurnView
            el:"#team-burn"

        @specsView = new SpecsView
            el:"#specs"

        @headerView = new HeaderView
            el:"header"
            model:@model

        @connectView = new ConnectView
            el:"#connect"
            model: new PostsModel()

        @homeView = new HomeView
            el:"#home"


        @connectView.loadPosts()


    checkPaths: =>
        # Begin Dirty ass code
        console.log 'checkPaths'
        
        pathName = window.location.pathname
        paths = pathName.split("/");
        finalPath = paths[paths.length-1]
        secondToLast = paths[paths.length-2]

        if (finalPath == "specs") || ((finalPath == "") && (secondToLast == "specs"))
            if !@isPhone
                table = $("#specs-table")
                @specsView.toggleTable('show')
                $('html,body').delay(1500).animate({scrollTop:(table.offset().top - 45) - (window.innerHeight *.5 - table.height()*.5 )});
            else
                table = $("#mobile-specs-gallery")
                console.log '20'
                $('html,body').animate({scrollTop:(table.offset().top - 20) - (window.innerHeight *.5 - table.height()*.5 )});

            
        
        
        
        
        
        
        
        # End Dirty ass code
        # Wiping ass...






module.exports = ViewController
