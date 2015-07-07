


class ModelBase extends Backbone.Model


    preloader : null
    manifest : null

    initialize: (opts) => 
        @opts = opts
        @url = opts.url
        @manifest = []
        super()

        @on "change" , @dataLoaded
        



    dataLoaded: =>
        @off "change" , @dataLoaded

        @preloader = new createjs.LoadQueue false  , @get("baseUrl") , @get("cors")
        @preloader.setMaxConnections(20)
        @preloader.addEventListener "complete" , @onPreloadComplete
        @preloader.addEventListener "progress" , @onPreloadProgress
        

        @processData()
        @trigger "dataLoaded"

    processData: =>



    onPreloadProgress: (e) =>
        @trigger 'assetsProgress' , e.loaded
    onPreloadComplete: (e) =>
    
        @trigger 'assetsReady' , @


    loadAssets: =>
     
        if @manifest.length > 0
            @preloader.loadManifest(@manifest)
        else
            @onPreloadComplete()


    searchGlobalAssets: (obj) =>       

        for item of obj
            if item is "assets"
                for asset of obj[item]         

                    if /^http(s?)/.test obj[item][asset] is false
                        obj[item][asset] = @get("baseUrl") + obj[item][asset]
              
                    @manifest.push(obj[item][asset])
                   
            else if typeof obj[item] is "object" and item.indexOf("_") != 0
                @searchGlobalAssets(obj[item])

    



module.exports = ModelBase







