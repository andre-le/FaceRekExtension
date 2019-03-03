const canvas = document.getElementById("canvas")
const video = document.getElementById("video")
const context = canvas.getContext("2d")

if (localStorage.getItem("facerek")) $("#sites").show()
else $("#landing").show()

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
    context.drawImage(video, 0, 0, 400, 300)
    $("#videoBlock").hide()
    $("#photoBlock").show()
})

$("#save").click(function() {
    localStorage.setItem("facerek", canvas.toDataURL())
    $("#face").fadeOut(function() {
        $("#sites").fadeIn()
    })
})

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
	context.drawImage(video, 0, 0, 640, 480);
});

next = document.getElementById('next');
next.onclick = () => {
  chrome.browserAction.setPopup({popup: "login.html"});
}

back = document.getElementById('back');
back.onclick = () => {
  chrome.browserAction.setPopup({popup: "popup.html"});
}
