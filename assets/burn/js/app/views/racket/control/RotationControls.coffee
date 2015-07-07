class RotationControls extends Backbone.Events

    constructor: (el) ->

        _.extend(@, Backbone.Events)

        @el = el
        @addEvents()

    addEvents:->


        touchOpts =
            threshold:100
            pointers:2


        @controlPlane = new Hammer @el , touchOpts


        @controlPlane.on 'pan panstart panleft panright panup pandown panend' , @handlePan


    handlePan: (e) =>
        e.srcEvent.preventDefault()

        data =
            velX: e.velocityX
            velY: e.velocityY
            type: e.type

        @trigger("pan", data)







module.exports = RotationControls
