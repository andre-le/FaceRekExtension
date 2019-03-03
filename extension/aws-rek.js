var region = "us-east-1"
// var rekognition = new AWS.Rekognition()

document.getElementById("fileToUpload").addEventListener(
    "change",
    function(event) {
        console.log("x")
        ProcessImage()
    },
    false
)

//Calls DetectFaces API and shows estimated ages of detected faces
function DetectFaces(imageData) {
    AWS.region = region
    var rekognition = new AWS.Rekognition()
    var params = {
        Image: {
            Bytes: imageData
        },
        Attributes: ["ALL"]
    }
    rekognition.detectFaces(params, function(err, data) {
        if (err) console.log(err, err.stack)
        // an error occurred
        else {
            var table = "<table><tr><th>Low</th><th>High</th></tr>"
            // show each face and build out estimated age table
            for (var i = 0; i < data.FaceDetails.length; i++) {
                table +=
                    "<tr><td>" +
                    data.FaceDetails[i].AgeRange.Low +
                    "</td><td>" +
                    data.FaceDetails[i].AgeRange.High +
                    "</td></tr>"
            }
            table += "</table>"
            document.getElementById("opResult").innerHTML = table
        }
    })
}
//Loads selected image and unencodes image bytes for Rekognition DetectFaces API
function ProcessImage() {
    AnonLog()
    var control = document.getElementById("fileToUpload")
    var file = control.files[0]

    // Load base64 encoded image
    var reader = new FileReader()
    reader.onload = (function(theFile) {
        return function(e) {
            var img = document.createElement("img")
            var image = null
            img.src = e.target.result
            var jpg = true
            try {
                image = atob(
                    e.target.result.split("data:image/jpeg;base64,")[1]
                )
            } catch (e) {
                jpg = false
            }
            if (jpg == false) {
                try {
                    image = atob(
                        e.target.result.split("data:image/png;base64,")[1]
                    )
                } catch (e) {
                    alert("Not an image file Rekognition can process")
                    return
                }
            }
            //unencode image bytes for Rekognition DetectFaces API
            var length = image.length
            imageBytes = new ArrayBuffer(length)
            var ua = new Uint8Array(imageBytes)
            for (var i = 0; i < length; i++) {
                ua[i] = image.charCodeAt(i)
            }
            //Call Rekognition
            DetectFaces(imageBytes)
        }
    })(file)
    reader.readAsDataURL(file)
}
//Provides anonymous log on to AWS services
function AnonLog() {
    // Configure the credentials provider to use your identity pool
    AWS.config.region = region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:6d5efa60-e5ef-4468-9a9f-0debbf943868"
    })
    // Make the call to obtain credentials
    AWS.config.credentials.get(function() {
        // Credentials will be available when this function is called.
        var accessKeyId = AWS.config.credentials.accessKeyId
        var secretAccessKey = AWS.config.credentials.secretAccessKey
        var sessionToken = AWS.config.credentials.sessionToken
    })
}
