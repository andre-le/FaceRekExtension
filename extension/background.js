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
            const tBlob = await imageCapture.takePhoto(),
                sBlob = dataURLtoBlob(localStorage.getItem("facerek"))
            const tReader = new FileReader(),
                sReader = new FileReader()

            tReader.readAsArrayBuffer(tBlob)
            tReader.onload = async te => {
                sReader.readAsArrayBuffer(sBlob)
                sReader.onload = async se => {
                    try {
                        const rekognition = new AWS.Rekognition()
                        const params = {
                            SimilarityThreshold: 90,
                            SourceImage: {
                                Bytes: se.target.result
                            },
                            TargetImage: {
                                Bytes: te.target.result
                            }
                        }
                        rekognition.compareFaces(params, (err, data) => {
                            if (err || data.FaceMatches.length === 0)
                                throw new Error()
                            else console.log("MATCHED !")
                            console.log(data)
                        })
                    } catch (error) {
                        chrome.tabs.getSelected(null, function(tab) {
                            chrome.tabs.update({
                                url:
                                    chrome.extension.getURL("blocked.html") +
                                    "?url=" +
                                    encodeURIComponent(tab.url)
                            })
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
    { urls: ["*://www.facebook.com/*"] },
    ["blocking"]
)

function dataURLtoBlob(dataURL) {
    let byteString = atob(dataURL.split(",")[1])
    let mimeString = dataURL
        .split(",")[0]
        .split(":")[1]
        .split(";")[0]
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    let blob = new Blob([ab], { type: mimeString })
    return blob
}

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
