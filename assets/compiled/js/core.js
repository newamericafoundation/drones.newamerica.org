(function() {
  var $body, Modal, Subscribe, new_america, subHash;

  if (!window.new_america) {
    window.new_america = {};
  }

  new_america = window.new_america;

  $body = $("body");

  Subscribe = (function() {
    function Subscribe() {
      var $email_btn, $newsletter_form, $subscribe_btn, email_check;
      $email_btn = $(".subscribe-form #email");
      $subscribe_btn = $(".subscribe-form button[type='submit']");
      email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
      if ($("#newsletter").length > 0) {
        $newsletter_form = $("#newsletter-form");
        $newsletter_form.addClass("dn");
        $subscribe_btn.on("click", function(e) {
          e.preventDefault();
          return $newsletter_form.removeClass("dn");
        });
      }
      $subscribe_btn.on("click", function(e) {
        var error;
        e.preventDefault();
        error = function() {
          $email_btn.val("");
          $email_btn.addClass("error");
          return $email_btn.prop("placeholder", "Please provide a valid email address");
        };
        if (email_check.test($email_btn.val())) {
          if ($("#mast-newsletter").length > 0) {
            $.get(document.URL + "subscribe-template/", function(data) {
              var modal;
              if ($("modal").length === 0) {
                $body.append(data);
                modal = new new_america.modal();
              }
              new_america.subscribe.next();
              new_america.subscribe.check_all();
              return new_america.subscribe.check_program();
            });
          }
          $("#fieldEmail").val($email_btn.val());
          new_america.subscribe.check_all();
          new_america.subscribe.check_program();
          return new_america.subscribe.next();
        } else {
          return error();
        }
      });
    }

    Subscribe.prototype.check_all = function() {
      return $("#Everything").on("click", function(e) {
        return $("#newsletterList [type='checkbox']").prop("checked", true);
      });
    };

    Subscribe.prototype.check_program = function() {
      return $(".cb-program").on("click", function(e) {
        return $(this).parent().next().find("[type='checkbox']").prop("checked", true);
      });
    };

    Subscribe.prototype.next = function() {
      return $(".next").on("click", function(e) {
        e.preventDefault();
        $("#thank-you").toggleClass("dn");
        return $("#newsletter-form").toggleClass("dn");
      });
    };

    return Subscribe;

  })();

  new_america.subscribe = new Subscribe();

  Modal = (function() {
    function Modal() {
      var $bg, $modal;
      $bg = $("#bg");
      $modal = $(".modal");
      $bg.addClass("modal_blur");
      $modal.height($(window).height());
      $(".exit").on("click", function(e) {
        e.preventDefault();
        $modal.remove();
        return $bg.removeClass("modal_blur");
      });
    }

    return Modal;

  })();

  new_america.modal = Modal;

  $(document).ready(function() {
    if ($(window).width() > 600) {
      $(".content>p").not($(".content>p>img").parent()).widowFix({
        linkFix: true
      });
      $("#related h3 > a, #recent h3.sbTitle > a, #cover-story h1 > span, #cover-story h2, #cover-story .summary p, .orgDescription > p, .cl-summary>p, #page-intro > p, h2>a, h4>a, h5>a, .blurb>p:last-of-type").widowFix({
        linkFix: true
      });
    }
    $("#filters .wrapper ul").click(function() {
      $(this).toggleClass("open");
    });
  });

  subHash = void 0;

  $("#email").keypress(function(e) {
    if (e.which === 13) {
      $("#linkToSubscribe")[0].click();
      e.preventDefault();
    }
  });

  $("#email").keyup(function() {
    subHash = "http://" + window.location.host + "/subscribe/#";
    if ($(".org-name").text().length) {
      subHash += "org=" + encodeURIComponent($(".org-name").text()) + "&amp;";
    }
    subHash += "email=" + encodeURIComponent($("#email").val());
    $("#linkToSubscribe").attr("href", subHash);
  });

  $(".subtitle").each(function() {
    if ($(this).text().match(/^\s*$/)) {
      return $(this).remove();
    }
  });

  $(".sub-headline").each(function() {
    if ($(this).text().match(/^\s*$/)) {
      return $(this).remove();
    }
  });

  if ($("aside.sharing").length > 0) {
    if ($(".sharing+article").height() < 500) {

    } else {
      $(window).scroll(function() {
        if ($("body").get(0).scrollTop > $(".story").offset().top - 100) {
          $("aside.sharing").addClass("stickey");
          if (($(".story").offset().top + $(".story").height() - $("body").get(0).scrollTop) <= 106) {
            $("aside.sharing").addClass("stickeybottom");
            $("div.scripted_styling").html("<style>aside.stickeybottom{top:" + $(".story").height() + "px!important;}</style>");
          }
          if (($(".story").offset().top + $(".story").height() - $("body").get(0).scrollTop) > 106) {
            $("aside.sharing").removeClass("stickeybottom");
          }
        }
        if ($("body").get(0).scrollTop < ($(".story").offset().top - 100)) {
          $("aside.sharing").removeClass("stickey");
        }
      });
    }
  }

  if ($('.story').length > 0) {
    if ($('.story p>img').length > 0) {
      $('.story p>img').parent().addClass("imgWrap");
      return;
    }
  }

  if ($(".index").length > 0) {
    if ($(".moved").length === 0) {
      $("body").scroll(function() {
        if ($("#masterContent").offset().top <= -50) {
          $(".index .na-bar > h1").addClass("moved");
          $(".index .na-bar button").addClass("moved");
        }
      });
      $(".na-bar [data-related-to=mainMenu]").on("click", function(e) {
        return $(".index .na-bar > h1").addClass("moved");
      });
    }
    setInterval((function() {
      if ($("#masterContent").offset().top === 0) {
        $(".index .na-bar > h1").removeClass("moved");
        return $(".index .na-bar button").removeClass("moved");
      }
    }), 100);
  }

}).call(this);
