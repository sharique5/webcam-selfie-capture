const faceapi  = require('face-api.js');

exports.webcamSelfieCapture = {
    video: null,
    startVideo: () => {
        navigator.mediaDevices.getUserMedia(
            { video: {} })
            .then(stream => {
                this.webcamSelfieCapture.video.srcObject = stream
            })
            .catch(err => {
                console.log(err.name + ": " + err.message);
            })
        
    },
    setVideoElementId: videoId => {
        this.webcamSelfieCapture.video = document.getElementById(videoId)
    },
    setVideoElementEventListener: () => {
        this.webcamSelfieCapture.video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(this.webcamSelfieCapture.video)
            document.body.append(canvas)
            const displaySize = { width: this.webcamSelfieCapture.video.width, height: this.webcamSelfieCapture.video.height }
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

