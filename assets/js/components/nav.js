$(document).ready(function(){
  var menuAbove = document.getElementById( 'mainMenu' ),
    showTopPush = document.getElementById( 'showTopPush' ),
    naBar = document.getElementById( 'na-main-bar' ),
    org = document.getElementById( 'organization' ),
    subNav = document.getElementById( 'na-sub-nav' ),
    subNavS = document.getElementById( 'na-sub-nav-s' ),
    showSub = document.getElementById( 'drop-menu' ),
    clickOrg = document.getElementById( 'theOrg' ),
    clkBtn = document.getElementById( 'ob' ),
    body = document.body,
    is_mobile = false;

  // check screen size
  if ($("#organization").css("right") == "0px" ){
    is_mobile = true;
    checkForNav();
  }
  // resize pnpi if necessary
  if ($(".page-offset").css("margin-top") == "-12px" ){
    $(".org-name").each(function() {
            var getContent=$(this).text();
            if (getContent == "Postsecondary National Policy Institute") {
              var newString=getContent.replace('Postsecondary National Policy Institute','Postsecondary National<br /><span class="pnpi-line">Policy Institute</span>');
              console.log(newString);
              $(this).html(newString);
            }
        });
  }
  // screen size
  if ($("#organization").css("left") == "80px" ){
    is_mobile = false;
    checkForNav();
  }

  // for overlay
  function showMenu(evt) {
    var whichMenu = $(evt.target).data('related-to');
      
      $('#'+whichMenu).toggleClass('is-visible');
      
      /* Can't toggle because either menu could be open */
      if( $('.js-menu.is-visible').length ){
        $('.js-menu-screen').addClass('is-visible');
      } else {
        $('.js-menu-screen').removeClass('is-visible');
      }
      evt.preventDefault();
  }
  
  $('.js-menu-trigger').on('click touchstart', showMenu);

  $('.js-menu-screen').on('click touchstart', function(e){
    if( $('.js-menu.is-visible').length ){
      $('.js-menu').removeClass('is-visible');
      $('.js-menu').removeClass('na-menu-open');
      $('.na-bar').removeClass('na-menu-open');
      $('.org-nav').removeClass('na-menu-open');
      $('.na-menu-push').removeClass('top-push-toBottom');
      $('.na-menu-top-sub').removeClass('na-menu-open');
    }
    $('.js-menu-screen').toggleClass('is-visible');
    e.preventDefault();
  });  
    
  // Menu Triggers
  $('.has-sub-nav > a').on('click touchstart', function(e) {
    $(e.target).parents('ul').find('.has-sub-nav').toggleClass('open');
    e.preventDefault();
  });

  $(showTopPush).on( "click touchstart", function() {
    $( body ).toggleClass( "top-push-toBottom" );
    $( menuAbove ).toggleClass( "na-menu-open" );
    $( naBar ).toggleClass( "na-menu-open" );
    $( org ).toggleClass( "na-menu-open" );
    $('.na-menu-top-sub').removeClass('na-menu-open');
  });

  $('.drop-menu').on( "click touchstart", function() {
    $( subNav ).toggleClass( "na-menu-open" );
    $( subNavS ).removeClass( "na-menu-open" );
    $( body ).removeClass( "top-push-toBottom" );
    $( menuAbove ).removeClass( "na-menu-open" );
    $( naBar ).removeClass( "na-menu-open" );
    $( org ).removeClass( "na-menu-open" );
  });

  $('.drop-menu-b').on( "click touchstart", function() {
    $( subNavS ).toggleClass( "na-menu-open" );
    $( subNav ).removeClass( "na-menu-open" );
    $( body ).removeClass( "top-push-toBottom" );
    $( menuAbove ).removeClass( "na-menu-open" );
    $( naBar ).removeClass( "na-menu-open" );
    $( org ).removeClass( "na-menu-open" );
  });



// check for scrolling
var scrollHeader = (function() {

  var docElem = document.documentElement,
    scrl = document.querySelector( '.mark' ),
    didScroll = false,
    changeHeaderOn = 700;

  function init() {
    window.addEventListener( 'scroll', function( event ) {
      if( !didScroll ) {
        didScroll = true;
        setTimeout( scrollPage, 650 );
      }
    }, false );
  }

  function scrollPage() {
    var sy = scrollY();
    if ( sy >= changeHeaderOn ) {
      $( scrl ).addClass( 'scrolled' );
    }
    else {
      $( scrl ).removeClass( 'scrolled' );
    }
    didScroll = false;
    }
    function scrollY() {
      return window.pageYOffset || docElem.scrollTop;
    }

  init();

  })();

  // Menu hover states across elements
    $(".top-menu-push").hover(
      function() {
        $(".mark").toggleClass( "hovered" );
        $(".index .na-bar > h1").toggleClass( "hovered" );
        $(this).toggleClass( "hovered" );
      }
    );
    $(".mark").hover(
      function() {
        $(".top-menu-push").toggleClass( "hovered" );
        $(".index .na-bar > h1").toggleClass( "hovered" );
        $(this).toggleClass( "hovered" );
      }
    );
    $(".top-menu-push").click(
      function() {
        $(showTopPush).trigger("click");
      }
    );

// change button actions
function checkForNav(){
     if (is_mobile) {
        if ( $(".org-btn").hasClass("js-menu-trigger") ){
          //GREAT
        } else { 
          $(".org-btn").addClass(" drop-menu-b js-menu-trigger ");
        }
        $(".org-name").hover(
          function() {
            $(this).toggleClass( "hovered" );
          }
        );
        $(".org-btn").hover(
          function() {
            $(this).toggleClass( "hovered" );
          }
        );
      } else {
        $(".org-btn").removeClass(" drop-menu-b js-menu-trigger ");

        $(".org-name").hover(
          function() {
            $(".org-btn").toggleClass( "hovered" );
            $(this).toggleClass( "hovered" );
          }
        );
        $(".org-btn").hover(
          function() {
            $(".org-name").toggleClass( "hovered" );
            $(this).toggleClass( "hovered" );
          }
        );
        $(clkBtn).on( "click touchstart", function() {
            $(clickOrg)[0].click();
          }
        );
     }
  }

  // when resizing  make these changes
  $(window).resize(function(){ 
    if ($("#organization").css("right") == "0px" ){
      is_mobile = true;
      checkForNav();
      if ( $(subNav).hasClass("na-menu-open") ) {
        $(subNav).removeClass("na-menu-open");
        $('.js-menu-screen').removeClass('is-visible');
      };
    }
    if ($("#organization").css("left") == "80px" ){
      is_mobile = false;
      checkForNav();
      if ( $(subNavS).hasClass("na-menu-open") ) {
        $(subNavS).removeClass("na-menu-open");
        $('.js-menu-screen').removeClass('is-visible');
      };
    }
    if ($(".page-offset").css("margin-top") == "0px" ){
      $(".org-name").each(function() {
        var getContent=$(this).text();
        if (getContent == 'Postsecondary NationalPolicy Institute') {
          var newString=getContent.replace('Postsecondary National','Postsecondary National ');
          $(this).html(newString);
        }
        $(".pnpi-line").css("display", "none");
    });
    } else {
      $(".org-name").each(function() {
            var getContent=$(this).text();
            if (getContent == "Postsecondary National Policy Institute") {
              var newString=getContent.replace('Postsecondary National Policy Institute','Postsecondary National<br /><span class="pnpi-line">Policy Institute</span>');
              $(this).html(newString);
            }
        });
    }
  });
});
