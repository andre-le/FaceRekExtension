video = document.getElementById("video")
myStorage = window.localStorage

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream
        video.play()
    })
}

canvas = document.getElementById("canvas")
context = canvas.getContext("2d")
video = document.getElementById("video")

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480)
})

document.getElementById("loadProfile").addEventListener("click", function() {
    $("#landing").fadeOut("slow", function() {})
    $("#create-profile").fadeIn("slow", function() {})
})

document.getElementById("loadWebcam").addEventListener("click", function() {
    $("#create-profile").fadeOut("slow", function() {})
    $("#input-face").fadeIn("slow", function() {})
    // document.getElementById("webcam").innerHTML =
    //     '<video id="video" width="640" height="480" autoplay></video>'
})

document.getElementById("save-image").addEventListener("click", function() {
    //chrome.storage.sync.set({ image: canvas.toDataURL() }, function() {})
    localStorage.setItem("image", canvas.toDataURL())
    $("#input-face").fadeOut("slow", function() {})
    $("#sites-list").fadeIn("slow", function() {})
})

document.getElementById("save-sites").addEventListener("click", function() {
    var newImg = document.createElement("img") // create img tag
    newImg.src = localStorage.getItem("image")
    document.getElementById("confirmation").appendChild(newImg)
    $("#sites-list").fadeOut("slow", function() {})
    $("#confirmation").fadeIn("slow", function() {})
})
