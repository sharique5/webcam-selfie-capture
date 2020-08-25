const faceapi  = require('face-api.js');

exports.webcamSelfieCapture = {
    video: null,
    loadModels: () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/public/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/public/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/public/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/public/models')
        ]).then(this.startVideo)    
    },
    startVideo: () => {
        navigator.mediaDevices.getUserMedia(
            { video: {} },
            stream => this.video.srcObject = stream,
            err => console.error(err)
        )
    },
    setVideoElementId: videoId => {
        this.video = document.getElementById(videoId)
    },
    setVideoElementEventListener: () => {
        this.video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(this.video)
            document.body.append(canvas)
            const displaySize = { width: this.video.width, height: this.video.height }
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

