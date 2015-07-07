Utils = require '../../../../utils/common.coffee'


getNumber = (num) ->

    numHeight = "2px"
    if $('html').hasClass("ie") or $('html').hasClass("firefox")
        numHeight = "6px"

    numG =  document.createElementNS(Utils.svgns, 'g')
    numG.setAttribute('class', 'number')
    numInnerG = document.createElementNS(Utils.svgns, 'g')

    numText = document.createElementNS(Utils.svgns, 'text')
    numText.setAttribute('fill' , "#ffffff")
    numText.setAttribute('y' , numHeight)
    numText.setAttribute('x' , "0px")
    numText.setAttribute('text-anchor' , "middle")
    numText.setAttribute('alignment-baseline' , "middle")
    numText.textContent = num

    numInnerG.appendChild(numText)
    numG.appendChild(numInnerG)

    return numG


getPlus =  (color)  ->
    if !color? then color = "#ffffff"


    vx = vy = hx = hy = "0px"
    if $('html').hasClass('ie')
        vy = "-3px"
        vx = "-1px"
        hx = "-4px"


    plusSignG = document.createElementNS(Utils.svgns, 'g')
    plusSignG.setAttribute('class', 'plus-sign')
    plusSignInnerG = document.createElementNS(Utils.svgns, 'g')
    plusRectV = document.createElementNS(Utils.svgns, 'rect')
    plusRectV.setAttribute('class' , "v")
    plusRectV.setAttribute('width' , "2px")
    plusRectV.setAttribute('height' , "8px")
    plusRectV.setAttribute('x' , vx)
    plusRectV.setAttribute('y' , vy)
    plusRectV.setAttribute('fill' , color)
    plusRectH = document.createElementNS(Utils.svgns, 'rect')
    plusRectH.setAttribute('class' , "h")
    plusRectH.setAttribute('width' , "8px")
    plusRectH.setAttribute('height' , "2px")
    plusRectH.setAttribute('x' , hx)
    plusRectH.setAttribute('y' , hy)
    plusRectH.setAttribute('fill' , color)
    plusSignInnerG.appendChild(plusRectV)
    plusSignInnerG.appendChild(plusRectH)
    plusSignG.appendChild(plusSignInnerG)

    return plusSignG

getOrangeCircle = ->
    orangeCircleG = document.createElementNS(Utils.svgns, 'g')
    orangeCircleG.setAttribute('class' , 'orange-circle')
    orangeCircle = document.createElementNS(Utils.svgns, 'circle')
    orangeCircle.setAttribute('stroke', '#F4CE21')
    orangeCircle.setAttribute('stroke-width', '6')
    orangeCircle.setAttribute('cx', '0')
    orangeCircle.setAttribute('cy', '0')
    orangeCircle.setAttribute('r', '12')
    orangeCircle.setAttribute('fill', '#FF6C00')
    orangeCircleG.appendChild(orangeCircle)

    return orangeCircleG

getYellowStroke = ->
    yellowStrokeG = document.createElementNS(Utils.svgns, 'g')
    yellowStrokeG.setAttribute('class' , 'yellow-stroke')
    yellowStrokeCircle = document.createElementNS(Utils.svgns, 'circle')
    yellowStrokeCircle.setAttribute('stroke', '#F4CE21')
    yellowStrokeCircle.setAttribute('stroke-width', '4')
    yellowStrokeCircle.setAttribute('cx', '0')
    yellowStrokeCircle.setAttribute('cy', '0')
    yellowStrokeCircle.setAttribute('r', '19')
    yellowStrokeCircle.setAttribute('fill', 'transparent')
    yellowStrokeG.appendChild(yellowStrokeCircle)

    return yellowStrokeG

getWhiteStroke = ->
    whiteStrokeG = document.createElementNS(Utils.svgns, 'g')
    whiteStrokeG.setAttribute('class' , 'white-stroke')
    whiteStrokeCircle = document.createElementNS(Utils.svgns, 'circle')
    whiteStrokeCircle.setAttribute('stroke', '#ffffff')
    whiteStrokeCircle.setAttribute('stroke-width', '10')
    whiteStrokeCircle.setAttribute('cx', '0')
    whiteStrokeCircle.setAttribute('cy', '0')
    whiteStrokeCircle.setAttribute('r', '32')
    whiteStrokeCircle.setAttribute('fill', 'transparent')
    whiteStrokeG.appendChild(whiteStrokeCircle)

    return whiteStrokeG

getHoverStroke = ->
    hoverStrokeG = document.createElementNS(Utils.svgns, 'g')
    hoverStrokeG.setAttribute('class' , 'hover-stroke')
    hoverStrokeCircle = document.createElementNS(Utils.svgns, 'circle')
    hoverStrokeCircle.setAttribute('stroke', '#ffffff')
    hoverStrokeCircle.setAttribute('stroke-width', '2')
    hoverStrokeCircle.setAttribute('cx', '0')
    hoverStrokeCircle.setAttribute('cy', '0')
    hoverStrokeCircle.setAttribute('r', '18')
    hoverStrokeCircle.setAttribute('fill', 'transparent')
    hoverStrokeG.appendChild(hoverStrokeCircle)

    return hoverStrokeG

module.exports.hotspots = {}

module.exports.hotspots['default'] = (id,order) ->
    hotspotG = document.createElementNS(Utils.svgns, 'g')
    hotspotG.setAttribute('class' , 'hotspot')
    hotspotG.setAttribute('id' , "hotspot-#{id}")
    hotspotG.setAttribute('data-id' , id)

    orangeCircleG = getOrangeCircle()
    plusSignG = getNumber(order)
    yellowStrokeG = getYellowStroke()
    whiteStrokeG = getWhiteStroke()
    hoverStroke = getHoverStroke()

    hotspotG.appendChild(orangeCircleG)
    hotspotG.appendChild(plusSignG)
    hotspotG.appendChild(yellowStrokeG)
    hotspotG.appendChild(whiteStrokeG)
    hotspotG.appendChild(hoverStroke)

    return hotspotG


module.exports.hotspots['parallel-drilling'] = (id , index, order) ->
    if !index? then index = ""
    hotspotG = document.createElementNS(Utils.svgns, 'g')
    hotspotG.setAttribute('class' , 'hotspot')
    hotspotG.setAttribute('id' , "hotspot-#{id}#{index}")
    hotspotG.setAttribute('data-id' , id)

    orangeCircleG = getOrangeCircle()
    plusSignG = getNumber(order)
    hoverStroke = getHoverStroke()

    whiteStrokeG = document.createElementNS(Utils.svgns, 'g')
    whiteStrokeG.setAttribute('class' , 'white-stroke')
    whiteStrokeCircle = document.createElementNS(Utils.svgns, 'circle')
    whiteStrokeCircle.setAttribute('stroke', '#ffffff')
    whiteStrokeCircle.setAttribute('stroke-width', '1px')
    whiteStrokeCircle.setAttribute('cx', '0')
    whiteStrokeCircle.setAttribute('cy', '0')
    whiteStrokeCircle.setAttribute('r', '12px')
    whiteStrokeCircle.setAttribute('fill', 'transparent')
    whiteStrokeG.appendChild(whiteStrokeCircle)

    hotspotG.appendChild(orangeCircleG)
    hotspotG.appendChild(plusSignG)
    hotspotG.appendChild(whiteStrokeG)
    hotspotG.appendChild(hoverStroke)

    return hotspotG



module.exports.contentHotspots = {}

module.exports.contentHotspots['default'] = (id,index) ->
    if !index? then index = ""
    hotspotG = document.createElementNS(Utils.svgns, 'g')
    hotspotG.setAttribute('class' , 'content-hotspot')
    hotspotG.setAttribute('id' , "hotspot2-#{id}#{index}")
    hotspotG.setAttribute('data-id' , id)

    grayCircleG = document.createElementNS(Utils.svgns, 'g')
    grayCircleG.setAttribute('class' , 'gray-circle')
    grayCircle = document.createElementNS(Utils.svgns, 'circle')
    grayCircle.setAttribute('stroke', '#3c3c3c')
    grayCircle.setAttribute('stroke-width', '4')
    grayCircle.setAttribute('cx', '0')
    grayCircle.setAttribute('cy', '0')
    grayCircle.setAttribute('r', '10px')
    grayCircle.setAttribute('fill', 'transparent')
    grayCircleG.appendChild(grayCircle)


    plusSignG = getPlus("#2c2c2c")

    grayStrokeG = document.createElementNS(Utils.svgns, 'g')
    grayStrokeG.setAttribute('class' , 'gray-stroke')
    grayStrokeCircle = document.createElementNS(Utils.svgns, 'circle')
    grayStrokeCircle.setAttribute('stroke', '#2c2c2c')
    grayStrokeCircle.setAttribute('stroke-width', '4px')
    grayStrokeCircle.setAttribute('cx', '0')
    grayStrokeCircle.setAttribute('cy', '0')
    grayStrokeCircle.setAttribute('r', '19px')
    grayStrokeCircle.setAttribute('fill', 'transparent')
    grayStrokeG.appendChild(grayStrokeCircle)


    hotspotG.appendChild(grayCircleG)
    hotspotG.appendChild(plusSignG)
    hotspotG.appendChild(grayStrokeG)

    return hotspotG
