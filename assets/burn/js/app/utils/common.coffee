

module.exports.getMaxWidth = ->
    maxWidth = 768

    if window.innerWidth >= 768 and window.innerWidth <= 1400
        maxWidth = window.innerWidth
    if window.innerWidth > 1400
        maxWidth = 1400



    return maxWidth




module.exports.degToRad = (deg) ->

    return (deg * Math.PI)/180

module.exports.radToDeg = (rad) ->

    return (Math.PI/180) * rad

module.exports.makeCubeMap = (envUrls) ->
    cubeMap = THREE.ImageUtils.loadTextureCube(envUrls)
    cubeMap.format = THREE.RGBFormat

    return cubeMap


module.exports.matrixToArray = (matrixStr) ->
    return matrixStr.match(/(-?[0-9\.]+)/g);


module.exports.distance = (x1,y1,x2,y2) ->
    v1 = new THREE.Vector2(x1,y1)
    v2 = new THREE.Vector2(x2,y2)

    d = v1.distanceTo(v2)


    return d

module.exports.svgns = "http://www.w3.org/2000/svg"
