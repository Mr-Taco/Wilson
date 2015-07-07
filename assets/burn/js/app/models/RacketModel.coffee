
class RacketModel extends Backbone.Model



    initialize:  (opts) ->
        super opts



        @manifest = []
        @preloader = new createjs.LoadQueue true  , "" , true
        @preloader.setMaxConnections(5)
        @preloader.addEventListener "complete" , @onPreloadComplete
        @preloader.addEventListener "progress" , @onPreloadProgress
        @parseAssets()


    loadAssets: ->

        @preloader.loadManifest(@manifest)


    parseAssets: ->

        objects = @get('objects')

        for k,g of objects
            for obj in g.obj

                @pushToManifest obj.id , obj.url

                if obj.map?
                    @pushToManifest "map-#{obj.id}" , obj.map

                if obj.specularMap?
                    @pushToManifest "spec-#{obj.id}" , obj.specularMap

                if obj.normalMap?
                    @pushToManifest "normal-#{obj.id}" , obj.normalMap

                if obj.bumpMap?
                    @pushToManifest "bump-#{obj.id}" , obj.bumpMap



    pushToManifest: (id,url) ->
        @manifest.push
            id:id
            src:url




    onPreloadProgress: (e) =>

        @trigger 'assetsProgress' , e.loaded
    onPreloadComplete: (e) =>

        @trigger 'assetsReady' , @



module.exports = RacketModel

