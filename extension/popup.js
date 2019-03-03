const canvas = document.getElementById("canvas")
const video = document.getElementById("video")
const context = canvas.getContext("2d")
const blockedWebsites = []

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
    blockedWebsites.push(add)
    $("input:text").val("")
    $("#list").append(
        "<li>" + add + "<button class='remove'>\u00D7</button></li>"
    )
    $(".remove").click(function() {
        blockedWebsites = blockedWebsites.filter(
            item =>
                item !==
                $(this)
                    .parent()
                    .val()
        )
        $(this)
            .parent()
            .toggleClass("strike")
            .fadeOut("slow")
    })
})

$("#finish").click(function() {
    localStorage.setItem("sites", blockedWebsites)
    $("#rekImage").attr("src", localStorage.getItem("facerek"))
    $("#sites").fadeOut(function() {
        $("#confirmation").fadeIn()
    })
    var arrayLength = blockedWebsites.length
    for (var i = 0; i < arrayLength; i++) {
        $("#listFinal").append("<li>" + blockedWebsites[i] + "</li>")
    }
})

// document.getElementById("loadWebcam").addEventListener("click", function() {
//     $("#create-profile").fadeOut("slow", function() {})
//     $("#face").fadeIn("slow", function() {})
//     // document.getElementById("webcam").innerHTML =
//     //     '<video id="video" width="640" height="480" autoplay></video>'
// })face
