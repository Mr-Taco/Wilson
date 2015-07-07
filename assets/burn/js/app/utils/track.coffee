
accounts = ["Wilson","Tennis","Agency"]

gaTrack = module.exports.gaTrack = (type, tag) ->

    if ga?
        console.log("[Tracking GA]" , "[ send" , 'event' , type , 'click' , tag , "]")
        for account in accounts

            ga "#{account}.send" , 'event' , type , 'click' , tag


    else
        console.log("Tracking GA]" , "[ ga variable doesn't exist ]")


module.exports.gaTrackElement = ($el) ->

    tag = $el.data("ga-tag")
    type = $el.data("ga-type")

    if type? and tag?
        gaTrack(type , tag)
    else
        console.log("Tracking GA]" , "[ data-ga-tag and data-ga-type attributes not set on element", $el ,"]")

