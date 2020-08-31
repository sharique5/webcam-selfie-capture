const faceapi  = require('face-api.js');

exports.webcamSelfieCapture = {
    video: null,
    loadModels: () => {
        // async this.webcamSelfieCapture.load()
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(this.webcamSelfieCapture.startVideo)
    },
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
            canvas.style.position = "absolute"
            canvas.style.top = `${this.webcamSelfieCapture.video.offsetTop}px`
            canvas.style.left = `${this.webcamSelfieCapture.video.offsetLeft}px`
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
    },
    captureSelfie: picContainerId => {
        let canvas = document.getElementById(picContainerId)
        canvas.width = this.webcamSelfieCapture.video.videoWidth
        canvas.height = this.webcamSelfieCapture.video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0, this.webcamSelfieCapture.video.videoWidth, this.webcamSelfieCapture.video.videoHeight)
    }
}

