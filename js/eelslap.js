(function(window, $, undefined) {
  const video = document.getElementById("myvideo");
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  let imgindex = 1;
  let model = null;
  let isVideo = false;
  let videoInterval = 100;
  let windowXRange,
    worldXRange = 0;

  const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6 // confidence threshold for predictions.
  };

  handTrack.startVideo(video).then(function(status) {
    if (status) {
      isVideo = true;
      runDetection();
    } else {
    }
  });

  function runDetection() {
    model.detect(video).then(predictions => {
      // console.log("Predictions: ", predictions);
      // get the middle x value of the bounding box and map to paddle location
      model.renderPredictions(predictions, canvas, context, video);
      if (predictions[0]) {
        let midval = predictions[0].bbox[0] + predictions[0].bbox[2] / 2;
        gamex = document.body.clientWidth * (midval / video.width);
        targetPosition =
          640 -
          Math.max(0, Math.min(640, gamex - $("#eelcontainer").offset().left));
        //targetPosition = browserWidth - (e.pageX - $('#eelcontainer').offset().left);
        // console.log(targetPosition);
        $("#bugger").html(targetPosition);
      }
      if (isVideo) {
        setTimeout(() => {
          runDetection(video);
        }, videoInterval);
      }
    });
  }

  // Load the model.
  handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
  });

  var app = window.Eel || (window.Eel = {});
  var $window = $(window);

  var currentPosition = 0;
  var targetPosition = 0;
  var browserWidth = 0;

  var loadedImages = 0;

  var autorun = function() {
    $("#eelimage1")
      .one("load", function() {
        imageLoaded();
      })
      .each(function() {
        if (this.complete) $(this).load();
      });

    $("#eelimage2")
      .one("load", function() {
        imageLoaded();
      })
      .each(function() {
        if (this.complete) $(this).load();
      });

    $("#eelimage3")
      .one("load", function() {
        imageLoaded();
      })
      .each(function() {
        if (this.complete) $(this).load();
      });

    $("#eelimage4")
      .one("load", function() {
        imageLoaded();
      })
      .each(function() {
        if (this.complete) $(this).load();
      });

    $("#eelimage1").attr("src", "images/eelslap_site_panorama1.jpg");
    $("#eelimage2").attr("src", "images/eelslap_site_panorama2.jpg");
    $("#eelimage3").attr("src", "images/eelslap_site_panorama3.jpg");
    $("#eelimage4").attr("src", "images/eelslap_site_panorama4.jpg");
    //$("#eelimage3").attr("src", "images/new3.jpg");

    //startSlap();
  };

  var imageLoaded = function() {
    loadedImages++;

    if (loadedImages == 4) {
      $("#loader").animate({ opacity: 0 }, 500, "linear", function() {
        $("#loader").css("display", "none");
      });
      setTimeout(function() {
        $("#allimages").css("display", "block");
        $("#allimages").animate({ opacity: 1 }, 3000, "linear");
        if (isTouchDevice()) {
          setTimeout(function() {
            $("#introtext").css("display", "block");
            $("#introtext").html("Drag your finger across the screen to slap!");
            $("#introtext").css("display", "block");
            $("#introtext").animate({ opacity: 1 }, 1000, "linear");

            setTimeout(function() {
              $("#introtext").animate(
                { opacity: 0 },
                1000,
                "linear",
                function() {
                  $("#introtext").css("display", "none");
                }
              );
            }, 3000);
          }, 1000);
        }

        startSlap();
      }, 500);
    }
  };

  var startSlap = function() {
    browserWidth = $(window).width();

    setInterval(function() {
      currentPosition += (targetPosition - currentPosition) / 4;
      var currentSlap = (currentPosition / 640) * 93;
      currentSlap = Math.min(93, Math.max(0, currentSlap));
      var pos = Math.round(currentSlap) * -640;

      $("#allimages").css("left", pos);
    }, 30);

    $("body").bind("mousemove", function(e) {
      // $('#status').html(e.pageX +', '+ e.pageY);
      targetPosition =
        640 -
        Math.max(0, Math.min(640, e.pageX - $("#eelcontainer").offset().left));
      //targetPosition = browserWidth - (e.pageX - $('#eelcontainer').offset().left);
      // console.log(targetPosition);
      $("#bugger").html(targetPosition);
    });

    $("body").bind("touchmove", function(e) {
      e.preventDefault();
      var touch = event.targetTouches[event.targetTouches.length - 1];
      $("#bugger").html(
        "TOUCH: " + touch.pageX + ", " + event.targetTouches.length
      );
      targetPosition = browserWidth - touch.pageX;
    });

    $(window).resize(function() {
      browserWidth = $(window).width();
    });
  };

  var isTouchDevice = function() {
    var el = document.createElement("div");
    el.setAttribute("ongesturestart", "return;");
    return typeof el.ongesturestart === "function";
  };

  // On DOM ready
  $(autorun);
})(this, jQuery);
