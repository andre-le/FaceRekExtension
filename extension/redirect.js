const canvas = document.getElementById("canvas")
const video = document.getElementById("video")
const context = canvas.getContext("2d")

navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream
    video.play()
})

$("#snap").click(function() {
    configAWS()
    context.drawImage(video, 0, 0, 200, 200)
    const sBytes = dataURLtoBytes(localStorage.getItem("facerek"))
    // var int16Array1 = new Int16Array(
    //     sBytes,
    //     0,
    //     Math.floor(sBytes.byteLength / 2)
    // )
    // sBytes.setInt16(int16Array1)
    const tBytes = dataURLtoBytes(canvas.toDataURL())
    // var int16Array2 = new Int16Array(
    //     tBytes,
    //     0,
    //     Math.floor(tBytes.byteLength / 2)
    // )
    // tBytes.setInt16(int16Array2)
    console.log(sBytes, tBytes)
    compareFaces(sBytes, tBytes)
})

function compareFaces(sourceImageBytes, targetImageBytes) {
    AWS.region = "us-east-1"
    const rekognition = new AWS.Rekognition()
    const params = {
        SimilarityThreshold: 90,
        SourceImage: {
            Bytes: sourceImageBytes
        },
        TargetImage: {
            Bytes: targetImageBytes
        }
    }
    rekognition.compareFaces(params, function(err, data) {
        if (err) console.log(err, err.stack)
        else {
            document.getElementById(
                "opResult"
            ).innerHTML = data.FaceMatches.some(face => face.Similarity >= 90)
                ? "Matched !"
                : "No Matched";
            data.FaceMatches.some(face => console.log(face));
        }
    })
}

function dataURLtoBytes(dataURL) {
    const img = document.createElement("img")
    let image = null
    img.src = dataURL
    let jpg = true
    try {
        image = atob(dataURL.split("data:image/jpeg;base64,")[1])
    } catch (e) {
        jpg = false
    }
    if (jpg == false) {
        try {
            image = atob(dataURL.split("data:image/png;base64,")[1])
        } catch (e) {
            alert("Not an image file Rekognition can process")
            return
        }
    }
    //unencode image bytes for Rekognition DetectFaces API
    const length = image.length
    imageBytes = new ArrayBuffer(length)
    const ua = new Uint8Array(imageBytes)
    for (let i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i)
    }
    return imageBytes
}

function configAWS() {
    // Configure the credentials provider to use your identity pool
    AWS.config.region = "us-east-1"
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:6d5efa60-e5ef-4468-9a9f-0debbf943868"
    })
    // Make the call to obtain credentials
    AWS.config.credentials.get(function() {
        // Credentials will be available when this function is called.
        let accessKeyId = AWS.config.credentials.accessKeyId
        let secretAccessKey = AWS.config.credentials.secretAccessKey
        let sessionToken = AWS.config.credentials.sessionToken
    })
}
