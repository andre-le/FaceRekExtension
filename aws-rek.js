function processImages() {
    configAWS()
    const sourceImageUpload = document.getElementById("sourceImage"),
        targetImageUpload = document.getElementById("targetImage")
    const sourceImage = sourceImageUpload.files[0],
        targetImage = targetImageUpload.files[0]
    const reader1 = new FileReader(),
        reader2 = new FileReader()

    document.getElementById("opResult").innerHTML = "Loading ....."

    reader1.readAsDataURL(sourceImage)
    reader1.onload = e1 => {
        reader2.readAsDataURL(targetImage)
        reader2.onload = e2 =>
            compareFaces(getImageBytes(e1), getImageBytes(e2))
    }
}

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
                : "No Matched"
        }
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
    console.log(String.fromCharCode.apply(null, new Uint8Array(imageBytes)))
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
