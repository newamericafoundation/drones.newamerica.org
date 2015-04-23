(function() {
 var $window = $(window),
      flexslider;
  
$(window).load(function() {
  // The slider being synced must be initialized first
  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 210,
    itemMargin: 5,
    pauseOnHover: false,
  });
});

}());
