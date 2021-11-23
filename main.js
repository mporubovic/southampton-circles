let player = document.querySelector("#player")
let output = document.querySelector("#output")

window.player = player

player.setAttribute('autoplay', '')
player.setAttribute('muted', '')
player.setAttribute('playsinline', '')

try {
    navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }, audio: false})
    // navigator.mediaDevices.getUserMedia({video: { facingMode: 'user' }, audio: false})
    .then((stream) => {
        player.srcObject = stream
    })
} catch (error) {
    alert(error)
}

let captureCanvas = document.createElement("canvas")


let capture = document.querySelector("#capture")
let reset = document.querySelector("#reset")
reset.style.display = "none"

capture.addEventListener("pointerdown", () => {
    captureCanvas.width = player.videoWidth
    captureCanvas.height = player.videoHeight
    captureCanvas.getContext('2d').drawImage(player, 0, 0, player.videoWidth, player.videoHeight)

    capture.style.display = "none"
    reset.style.display = null
    
    player.style.display = "none"
    output.style.display = null


    processImage(captureCanvas)
})

reset.addEventListener("pointerdown", () => {
    reset.style.display = "none"
    capture.style.display = null

    player.style.display = null
    output.style.display = "none"

})




function processImage(img) {
    let _src = cv.imread(img)
    let src = new cv.Mat()

    cv.resize(_src, src, new cv.Size(Math.floor(img.width), Math.floor(img.height)))

    let blur = new cv.Mat()
    cv.medianBlur(src, blur, 5)

    let grayScale = new cv.Mat()
    cv.cvtColor(blur, grayScale, cv.COLOR_RGBA2GRAY, 0)

    let circles = new cv.Mat()
    cv.HoughCircles(grayScale,              // input
                    circles,                // output
                    cv.HOUGH_GRADIENT,      // method
                    1,                      // dp (inverse ratio of resolution)
                    5,                      // min_dist between detected centers
                    300,                    // upper threshold for internal canny edge detection
                    50,                     // threshold for centre detection
                    0,                      // min_radius to be detected
                    0,                      // max_radius to be detected
                    ) 

    // let result = cv.Mat.zeros(Math.floor(img.height), Math.floor(img.width), cv.CV_8UC4)

    for (let i = 0; i < circles.cols; ++i) {
        let x = circles.data32F[i * 3];
        let y = circles.data32F[i * 3 + 1];
        let radius = circles.data32F[i * 3 + 2];
        let center = new cv.Point(x, y);
      
        cv.circle(src, center, radius, [255, 0, 255, 255], 3);
    }

    cv.imshow("output", src)
    // cv.imshow("output", result)
}