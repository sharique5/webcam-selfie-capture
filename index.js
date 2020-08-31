const faceapi  = require('face-api.js');

module.exports = {
    video: null,
    loadModels: function() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(this.startVideo)
    },
    startVideo: function() {
        navigator.mediaDevices.getUserMedia(
            { video: {} })
            .then(stream => {
                this.video.srcObject = stream
            })
            .catch(err => {
                console.log(err.name + ": " + err.message);
            })
    },
    setVideoElementId: function(videoId) {
        this.video = document.getElementById(videoId)
    },
    setVideoElementEventListener: function() {
        this.video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(this.video)
            document.body.append(canvas)
            canvas.style.position = "absolute"
            canvas.style.top = `${this.video.offsetTop}px`
            canvas.style.left = `${this.video.offsetLeft}px`
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
    },
    captureSelfie: function(picContainerId) {
        let canvas = document.getElementById(picContainerId)
        canvas.width = this.video.videoWidth
        canvas.height = this.video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0, this.video.videoWidth, this.video.videoHeight)
    }
}

