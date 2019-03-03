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

// document.getElementById("loadWebcam").addEventListener("click", function() {
//     $("#create-profile").fadeOut("slow", function() {})
//     $("#face").fadeIn("slow", function() {})
//     // document.getElementById("webcam").innerHTML =
//     //     '<video id="video" width="640" height="480" autoplay></video>'
// })face
