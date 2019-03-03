video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
    });
}

canvas = document.getElementById('canvas');
context = canvas.getContext('2d');
video = document.getElementById('video');

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
