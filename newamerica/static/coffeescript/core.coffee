#
#  Simple.Honest.Work Generator Core JS
#
#  Created by Simple.Honest.Work in 2014.
#  Copyright 2014 Noun Project. All rights reserved.
#

window.new_america = {}  unless window.new_america
new_america = window.new_america

$body = $("body")

class Subscribe
    constructor: () ->
        $email_btn = $(".subscribe-form #email")
        $subscribe_btn = $(".subscribe-form button[type='submit']")
        email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i

        #for subscribe page
        if $("#newsletter").length > 0
            $newsletter_form = $("#newsletter-form")
            $newsletter_form.addClass "dn"
            $subscribe_btn.on "click", (e) ->
                e.preventDefault()
                $newsletter_form.removeClass "dn"

        $subscribe_btn.on "click", (e) ->
            e.preventDefault()

            error = () ->
                $email_btn.val("") # clear the input
                $email_btn.addClass "error" # need to style the placeholder to be red
                $email_btn.prop("placeholder", "Please provide a valid email address")
                
            if email_check.test $email_btn.val() #check email
                if $("#mast-newsletter").length > 0
                    $.get document.URL + "subscribe-template/", (data) -> #get subscribe form
                        if $("modal").length is 0
                            $body.append data #append modal to page
                            modal = new new_america.modal()
                        new_america.subscribe.next()
                        new_america.subscribe.check_all()
                        new_america.subscribe.check_program()
                
                $("#fieldEmail").val($email_btn.val())

                new_america.subscribe.check_all()
                new_america.subscribe.check_program()
                new_america.subscribe.next()
            else
                error()

    check_all: () ->
        $("#Everything").on "click", (e) ->
            $("#newsletterList [type='checkbox']").prop("checked", true) #set all checkboxes to true

    check_program: () ->
        $(".cb-program").on "click", (e) ->
            $(this).parent().next().find("[type='checkbox']").prop("checked", true) #set child checkboxes

    next: () ->
        $(".next").on "click", (e) ->
            e.preventDefault()
            $("#thank-you").toggleClass("dn")
            $("#newsletter-form").toggleClass("dn")



new_america.subscribe = new Subscribe()


class Modal
    constructor: () ->
        $bg = $("#bg")
        $modal = $(".modal")

        $bg.addClass "modal_blur"

        $modal.height($(window).height())

        $(".exit").on "click", (e) ->
            e.preventDefault()
            $modal.remove()
            $bg.removeClass "modal_blur"


new_america.modal = Modal

###########
#I'm braking these up incase we want to make them location specific later
###########

#For Orphans 
#$(document).ready ->
#  if $(window).width() > 600
#    $(".content>p").not($(".content>p>img").parent()).widowFix linkFix: true
#    $("#related h3 > a, #recent h3.sbTitle > a, #cover-story h1 > span, #cover-story h2, #cover-story .summary p, .orgDescription > p, .cl-summary>p, #page-intro > p, h2>a, h4>a, h5>a, .blurb>p:last-of-type").widowFix linkFix: true
#    
#  $("#filters .wrapper ul").click ->
#    $(this).toggleClass "open"
#    return
#
#  return

#For Newsletter Signup
subHash = undefined
$("#email").keypress (e) ->
  if e.which is 13
    $("#linkToSubscribe")[0].click()
    e.preventDefault()
  return

$("#email").keyup ->
  subHash = "http://" + window.location.host + "/subscribe/#"
  subHash += "org=" + encodeURIComponent($(".org-name").text()) + "&amp;"  if $(".org-name").text().length
  subHash += "email=" + encodeURIComponent($("#email").val())
  $("#linkToSubscribe").attr "href", subHash
  return

#Remove empty subtitles
$(".subtitle").each ->
  $(this).remove()  if $(this).text().match(/^\s*$/)

$(".sub-headline").each ->
  $(this).remove()  if $(this).text().match(/^\s*$/)

#Adding stickey on social bar
if $("aside.sharing").length > 0
  if $(".sharing+article").height() < 500
  else
    $(window).scroll ->
      if $("body").get(0).scrollTop > $(".story").offset().top - 100
        $("aside.sharing").addClass "stickey"
        if ($(".story").offset().top + $(".story").height() - $("body").get(0).scrollTop) <= 106
          $("aside.sharing").addClass "stickeybottom"
          $("div.scripted_styling").html "<style>aside.stickeybottom{top:" + $(".story").height() + "px!important;}</style>"
        $("aside.sharing").removeClass "stickeybottom"  if ($(".story").offset().top + $(".story").height() - $("body").get(0).scrollTop) > 106
      $("aside.sharing").removeClass "stickey"  if $("body").get(0).scrollTop < ($(".story").offset().top - 100)
      return


#Add class to content types
if $('.story').length > 0
  if $('.story p>img').length > 0
    $('.story p>img').parent().addClass "imgWrap"
    return


#Add class to header on scroll or click
if $(".index").length > 0
  if $(".moved").length == 0 
    $("body").scroll ->
      if $("#masterContent").offset().top <= -50
        $(".index .na-bar > h1").addClass "moved"
        $(".index .na-bar button").addClass "moved"  
        return
    $(".na-bar [data-related-to=mainMenu]").on "click", (e) ->
      $(".index .na-bar > h1").addClass "moved" 


  setInterval (->
    if $("#masterContent").offset().top is 0
      $(".index .na-bar > h1").removeClass "moved"
      $(".index .na-bar button").removeClass "moved"
  ), 100
