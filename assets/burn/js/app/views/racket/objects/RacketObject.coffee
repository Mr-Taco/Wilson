
CompoundObject = require './../abstract/CompoundObject.coffee'
Utils = require '../../../utils/common.coffee'

Animations = require '../imports/animations.coffee'





class RacketObject extends CompoundObject

    constructor: (opts) ->
        @envCube = opts.envCube
        @components = {}
        @animations = {}
        super()

    geometryLoaded: (geom,mat) =>
        super(geom,mat)




    applyShader: (data,obj) ->




        env = @envCube
        if data.env is false
            console.log "no ENV!"
            env = null


        #mat.combine= THREE.MixOperation


        if data?


            if data.swap?
                switch data.swap
                    when 'basic'
                        env = null
                        mat = new THREE.MeshBasicMaterial()


            else
                mat = new THREE.MeshPhongMaterial()



            if data.color?
                mat.color = new THREE.Color data.color
            else
                mat.color = new THREE.Color 0xffffff

            if data.emissive?
                mat.emissive = new THREE.Color data.emissive


            if data.specular?
                mat.specular = new THREE.Color data.specular


            if data.shininess?
                mat.shininess = data.shininess
            else
                mat.shininess = 0

            if data.reflectivity?
                mat.reflectivity =  data.reflectivity
            else
                mat.reflectivity = 0

            if data.map?

                map = THREE.ImageUtils.loadTexture(data.map)

                if data.anisotropy?
                    map.anisotropy = data.anisotropy

                if data.mapRepeat?
                    map.wrapS = map.wrapT = THREE.RepeatWrapping
                    map.repeat.set(data.mapRepeat[0],data.mapRepeat[1])


                mat.map = map



            if data.specularMap?
                spec = THREE.ImageUtils.loadTexture(data.specularMap)

                if data.anisotropy?
                    spec.anisotropy = data.anisotropy

                if data.mapRepeat?
                    spec.wrapS = spec.wrapT = THREE.RepeatWrapping
                    spec.repeat.set(data.mapRepeat[0],data.mapRepeat[1])

                mat.specularMap = spec

            if data.alphaMap?
                alpha = THREE.ImageUtils.loadTexture(data.alphaMap)

                if data.anisotropy?
                    alpha.anisotropy = data.anisotropy

                if data.mapRepeat?
                    alpha.wrapS = spec.wrapT = THREE.RepeatWrapping
                    alpha.repeat.set(data.mapRepeat[0],data.mapRepeat[1])

                mat.alphaMap = alpha

            if data.normalMap?
                norm = THREE.ImageUtils.loadTexture(data.normalMap)

                if data.mapRepeat?
                    norm.wrapS = norm.wrapT = THREE.RepeatWrapping
                    norm.repeat.set(data.mapRepeat[0],data.mapRepeat[1])

                mat.normalMap = norm


            if data.normalScale?
                mat.normalScale = new THREE.Vector2(data.normalScale[0],data.normalScale[1])
            else
                mat.normalScale = new THREE.Vector2(1,1)


            if data.bumpMap?
                bump = THREE.ImageUtils.loadTexture(data.bumpMap)

                if data.mapRepeat?
                    bump.wrapS = norm.wrapT = THREE.RepeatWrapping
                    bump.repeat.set(data.mapRepeat[0],data.mapRepeat[1])

                mat.bumpMap = bump


            if data.bumpScale?

                mat.bumpScale = data.bumpScale



        mat.envMap = env
        mat.transparent = true
        mat.ambient = mat.color


        return mat


    applyMaterialProperties: ->
        for k,obj of @objects
            data = obj._loaderData
            obj.material = null
            obj.material = @applyShader(data , obj)

    isHotspot: (index,id) ->

        spots = hotspots[id]


        if spots?
            for spot in spots
                if spot is index
                    return true

        return false


    getHotspots: (hotspots) ->
        verts = []



        for mesh in @group.children
            spots = hotspots[mesh.__id]
            if spots?

                mesh.updateMatrixWorld()
                for s in spots
                    vert = mesh.geometry.vertices[s.index].clone()
                    vert.__id = s.id
                    vert.applyMatrix4(mesh.matrixWorld)
                    verts.push vert


        return verts

    groupLoaded: =>

        @objects['letter-w'].rotation.y = THREE.Math.degToRad(90)
        @applyMaterialProperties()

        @createAnimationComponents()
        @createAnimations()

        super()


    createAnimationComponents: ->
        @components['x2-shaft'] =
            ring0:@objects['ring-0']
            ring1:@objects['ring-1']
            ring2:@objects['ring-2']
            ringWide:@objects['ring-wide']

        @components['carbon-fiber'] =
            wireframe:@objects['wireframe-long']
            plate:@objects['plate-short']




        @components['spin-effect'] =
            stalk:@objects['stalk']
            helix:@objects['helix']


        @components['parallel-drilling'] =
            discs:[
                @objects['disc-inner']
                @objects['disc-middle']
                @objects['disc-outer']
                ]
            discLines:[
                @objects['disc-line-1']
                @objects['disc-line-2']
                @objects['disc-line-3']
                ]
            redLines:[
                @objects['red-line-1']
                @objects['red-line-2']
                @objects['red-line-3']
            ]
            ball:@objects['tennis-ball']



    createAnimations: ->

        @animations['x2-shaft'] = Animations['x2-shaft'].getAnimation @components['x2-shaft']
        @animations['parallel-drilling'] = Animations['parallel-drilling'].getAnimation @components['parallel-drilling']
        @animations['spin-effect'] = Animations['spin-effect'].getAnimation @components['spin-effect']
        @animations['carbon-fiber'] = Animations['carbon-fiber'].getAnimation @components['carbon-fiber']




module.exports = RacketObject
