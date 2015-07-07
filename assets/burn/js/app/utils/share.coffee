


module.exports.fbInit = ->
    FB.init
        appId: '1518453638414402'
        xfbml: true
        cookie:true
        status:true
        version:"v2.2"




module.exports.fbShare = (title , caption, image , link, description) ->

    FB.ui
        method: "feed"
        link:link
        picture:image
        caption:caption
        name:title
        description: description





