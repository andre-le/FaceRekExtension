chrome.webRequest.onBeforeRequest.addListener(
    async function() {
        try {
            configAWS()

            let video = document.getElementById("facerek")
            if (!video) {
                let video = document.createElement("video")
                video.id = "facerek"
                document.body.appendChild(video)
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true
            })
            document.getElementById("facerek").srcObject = mediaStream
            const track = mediaStream.getVideoTracks()[0]

            let imageCapture = new ImageCapture(track)
            const blob1 = await imageCapture.takePhoto()
            const reader1 = new FileReader()

            reader1.readAsArrayBuffer(blob1)
            reader1.onload = async e1 => {
                const blob2 = await imageCapture.takePhoto()
                const reader2 = new FileReader()

                reader2.readAsArrayBuffer(blob2)
                reader2.onload = e2 => {
                    const rekognition = new AWS.Rekognition()
                    const params = {
                        SimilarityThreshold: 90,
                        SourceImage: {
                            Bytes: e1.target.result
                        },
                        TargetImage: {
                            Bytes: e2.target.result
                        }
                    }

                    rekognition.compareFaces(params, (err, data) => {
                        if (err) console.log(err)
                        if (
                            !data.FaceMatches.some(
                                face => face.Similarity >= 90
                            )
                        )
                            chrome.tabs.update({
                                url:
                                    chrome.extension.getURL("blocked.html") +
                                    "?url=" +
                                    encodeURIComponent(url)
                            })
                        else console.log("MATCHED !")
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
    { urls: ["*://www.facebook.com/*"] },
    ["blocking"]
)

function configAWS() {
    AWS.config.region = "us-east-1"
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:6d5efa60-e5ef-4468-9a9f-0debbf943868"
    })

    AWS.config.credentials.get(function() {
        let accessKeyId = AWS.config.credentials.accessKeyId
        let secretAccessKey = AWS.config.credentials.secretAccessKey
        let sessionToken = AWS.config.credentials.sessionToken
    })
}

/*
function compareFaces(sourceImageBytes, targetImageBytes) {
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
    rekognition.compareFaces(params, (err, data) => {
        if (err) console.log(err)
        if (!data.FaceMatches.some(face => face.Similarity >= 90))
            // chrome.tabs.update({
            //     url:
            //         chrome.extension.getURL("blocked.html") +
            //         "?url=" +
            //         encodeURIComponent(url)
            // })
            console.log("NO MATCHED !")
    })
}

function getImageBytes(e) {
    const img = document.createElement("img")
    let image = null
    img.src = e.target.result
    let jpg = true
    try {
        image = atob(e.target.result.split("data:image/jpeg;base64,")[1])
    } catch (e) {
        jpg = false
    }
    if (jpg == false) {
        try {
            image = atob(e.target.result.split("data:image/png;base64,")[1])
        } catch (e) {
            console.log("Not an image file Rekognition can process")
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
*/
