class CompoundObject

    constructor: ->
        _.extend @ , Backbone.Events

        @geometry = []
        @objects = {}


    load: (objectData) ->
        if !@object?
            @loaders = @parse objectData
            @loadObjects()



        else
            console.error("Object Already Loaded")

    loadObjects: () ->

        for loader in @loaders

            if loader._jsUrl?
                loader.load loader._jsUrl , @geometryLoaded

            else if loader._objUrl?
                loader.load loader._objUrl, @objectLoadedProxy(loader)





    parse: (data) ->
        loaders = []
        for k,v of data
            switch k
                when "obj"
                    obj = v
                when "js"
                    js = v
        if js?
            if $.isArray(js)
                loaders = @createLoaders(js)
            else
                loaders.push @createJsLoader(js)

        else if obj?
            if $.isArray(obj)
                loaders = @createLoaders(null, obj)
            else
                loaders.push @createObjLoader(obj)


        return loaders



    createLoaders: (js, obj) =>
        loaders = []
        if js?
            for j in js
                loaders.push @createJsLoader(j)
            return loaders
        else if obj?
            for o,i in obj
                loaders.push @createObjLoader(o)
            return loaders



    createJsLoader: (js) =>
        loader = new THREE.JSONLoader()
        loader._jsUrl = js

        return loader

    createObjLoader: (obj) =>
        loader = new THREE.OBJLoader()
        loader._objUrl = obj.url
        loader._mtlData = obj
        loader.__id = obj.id

        return loader



    geometryLoaded: (geom, mat) =>

        object = new THREE.Mesh geom , mat[0]
        @objectLoaded(object)

    objectLoadedProxy: (loader) =>


        return (obj) =>
            obj._loaderData = loader._mtlData
            obj.__id = loader.__id
            @objectLoaded(obj)


    objectLoaded: (obj) =>
        o = obj
        if obj.children.length > 0
            o = obj.children[obj.children.length-1]


        o._loaderData = obj._loaderData
        o.__id = obj.__id




        @objects[o.__id] = o
        if Object.keys(@objects).length is @loaders.length
            @createGroup()




    createGroup: () =>

        @group = new THREE.Group()
        window['3d'] = {}
        for k,obj of @objects

            window['3d'][obj.__id] = obj
            @group.add obj



        @groupLoaded()


    groupLoaded: =>
        @trigger "objectLoaded" , @group





module.exports = CompoundObject






