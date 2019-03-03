const canvas = document.getElementById("canvas")
const video = document.getElementById("video")
const context = canvas.getContext("2d")

if (localStorage.getItem("facerek")) $("#sites").show()
else $("#landing").show()

hashCode = function(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream
        video.play()
    })
}

$("#newProfile").click(function() {
    $("#landing").fadeOut(function() {
        $("#face").fadeIn()
    })
})

$("#snap").click(function() {
    context.drawImage(video, 0, 0, 200, 200)
    $("#videoBlock").hide()
    $("#photoBlock").show()
})

$("#save").click(function() {
    localStorage.setItem("facerek", canvas.toDataURL())
    // $("#face").fadeOut(function() {
    //     $("#sites").fadeIn()
    // })
    $("#passwordBlock").show();
    $("#photoBlock").hide()
})

$("#savePassword").click(function() {
    match = $("#pass1").val() != $("#pass2").val();
    if($("#pass1").val().length == 0) return;
    if(match) $("#error").show();
    else {
      hash = hashCode($("#pass1").val());
      localStorage.setItem("password", hash);
      $("#face").fadeOut(function() {
          $("#sites").fadeIn();
      })
    }
});

$("#retake").click(function() {
    $("#photoBlock").hide()
    $("#videoBlock").show()
})

$("#add").click(function() {
    let add = $("#input").val()
    $("#list").append("<li>" + add + "</li>")
})

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
	context.drawImage(video, 0, 0, 200, 200);
});
