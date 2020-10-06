//Using WebGL for graphics.
var canvas;
var canvasContext;
var WIDTH = 160;
var HEIGHT = 144;
var pixels;

function initCanvas() {

    canvas = document.getElementById("game-surface");
    canvasContext = canvas.getContext("2d");
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(50, 50, WIDTH, HEIGHT);

}

function updateGraphics() {
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    var imageData = canvasContext.getImageData(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = pixelBuffer[i];
        imageData.data[i + 1] = pixelBuffer[i + 1];
        imageData.data[i + 2] = pixelBuffer[i + 2];
        imageData.data[i + 3] = pixelBuffer[i + 3];
    }
    canvasContext.putImageData(imageData, 0, 0);

}