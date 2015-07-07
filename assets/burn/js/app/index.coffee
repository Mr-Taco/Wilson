
THREE.ImageUtils.crossOrigin = ''
Share = require './utils/share.coffee'
window.moment = require 'moment'
TweenMax.defaultOverwrite = "preexisting"



###$.validator.setDefaults
    ignore: []

$.validator.addMethod "csv", ((value, element, limit) ->

    commas = value.split(',')

    console.log commas.length , limit

    if commas.length is parseInt limit
        true
    else
        false


), "Please select all required options."###

Burn = require './Burn.coffee'

$(document).ready ->

    Share.fbInit()

    new Burn()
