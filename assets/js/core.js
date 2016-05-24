(function() {
  var $body, Modal, Subscribe, new_america;

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


}).call(this);
