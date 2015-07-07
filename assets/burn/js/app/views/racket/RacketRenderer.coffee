class RacketRenderer extends THREE.WebGLRenderer



    constructor: (opts ,scene , camera, sceneRenderOperation) ->
        opts.devicePixelRatio = 1
        super(opts)
        @scene = scene
        @camera = camera
        @renderOperation = sceneRenderOperation





    renderTime: =>

        if @renderOperation? then @renderOperation()

        @render @scene , @camera
        requestAnimationFrame( @renderTime )







module.exports = RacketRenderer

