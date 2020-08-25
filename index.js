const faceapi  = require('face-api.js');

exports.webcamSelfieCapture = function() {
    var video = null

    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/public/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/public/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/public/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/public/models')
    ]).then(startVideo)
    
    function startVideo() {
        navigator.getUserMedia(
            { video: {} },
            stream => video.srcObject = stream,
            err => console.error(err)
        )
    }

    function setVideoElementId(videoId) {
        video = document.getElementById(videoId)
    }

    function setVideoElementEventListener() {
        if (video) {
            video.addEventListener('play', () => {
                const canvas = faceapi.createCanvasFromMedia(video)
                document.body.append(canvas)
                const displaySize = { width: video.width, height: video.height }
                faceapi.matchDimensions(canvas, displaySize)
                setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                    const resizedDetections = faceapi.resizeResults(detections, displaySize)
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    faceapi.draw.drawDetections(canvas, resizedDetections)
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
                }, 100)
            })
        }
    }
    
}

