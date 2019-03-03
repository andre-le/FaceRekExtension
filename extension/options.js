navigator.webkitGetUserMedia(
    { video: true, audio: true },
    function(stream) {
        video.src = window.webkitURL.createObjectURL(stream)
    },
    function(err) {}
)

function load_landing() {
    // document.getElementById("landing").innerHTML =
    //     '<object type="text/html" data="landing.html" ></object>'
}
