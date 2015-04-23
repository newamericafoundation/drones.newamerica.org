(function() {
 var $window = $(window),
      flexslider;
  
  $window.load(function() {
    $('.flexslider').flexslider({
      animation: "slide",
      animationLoop: true,
      itemWidth: 360,
      itemMargin: 30,
      nextText: "",  
      prevText: "",
      move: 1
    });
  });

}());
