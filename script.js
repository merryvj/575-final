
let song;
let img;

function preload() {
    song = loadSound('assets/songs/lane8.mp3');
    img = loadImage('https://images.unsplash.com/photo-1511489731872-324afc650052?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80');

}


function setup(){
    createCanvas(100, 100);
    img.resize(width, height);
    image(img, 0, 0);
    noSmooth();
}

function playSong(){
    song.play();
}


let touchX = 0;
let touchY = 0;

let accelTotal = 0;
let accelX = 0;
let accelY = 0;
let accelZ = 0;
let direction = "down";

// Connect to our websocket server , this server was created when you typed `node index.js`
const ws = new WebSocket("ws://localhost:8080")

ws.onmessage = (event) => {
    const dataAsString = event.data;
    const dataAsObject = JSON.parse(dataAsString)
    const sensorData = dataAsObject.sensordata;
    if (sensorData) {

        accelX = sensorData.accel.x;
        accelY = sensorData.accel.y;
        accelZ = sensorData.accel.z;
        
        if (accelX < 0.1) {
            accelX = 0;
        } 

        if (accelY < 0.1) {
            accelY = 0;
        }

        if (accelX < 0.1) {
            accelX = 0;
        }
        // accelX = sensorData.accel.x - sensorData.gravity.x;
        // accelY = sensorData.accel.y - sensorData.gravity.y;
        // accelZ = sensorData.accel.z - sensorData.gravity.z;
        accelTotal = Math.abs(accelX) + Math.abs(accelY) + Math.abs(accelX);
        
        //Math.abs(accelX) + Math.abs(accelY) + Math.abs(accelX);
        console.log(accelTotal);
    }
    // You might want to see how the data is recieved, uncomment this line
    //console.log(sensorData)
    // if(sensorData.touch.length > 0){
    //     const firstFingerTouch = sensorData.touch[0];
    //     // set the global variables touchX, touchY
    //     // firstFingerTouch.x goes from -1 to 1 (also the y), so we map it to out canvas coordinates
    //     touchX = map(firstFingerTouch.x, -1, 1, 0, 400);
    //     touchY = map(firstFingerTouch.y, -1, 1, 0, 400);
    // }
}




function draw(){
    img.loadPixels();
    // for (let i = 0; i < width - 20; i+=20) {
    //     for (let j = 0; j < height - 20; j+=20){
    //         ellipse(i + 10, j + 10, 10);
    //     }
    // }

    let yPix = Math.abs(accelY);
    yPix = map(yPix, 0, 2, 0, 1000);
    for (let i = 0; i < yPix; i++) {
        sortPixelsY();
    }

    let xPix = Math.abs(accelX);

    xPix = map(xPix, 0, 2, 0, 1000);
    for (let j = 0; j < xPix; j++) {
        sortPixelsX();
    }

    // console.log("x " + xPix);
    // console.log("y " + yPix);

    img.updatePixels();
    image(img, 0, 0, width, height);


    song.rate(accelTotal);
    
}

function sortPixelsX() {
    const x = random(img.width - 1);
    const y = random(img.height - 1);
    let colorOne = img.get(x, y);
    let colorTwo;
    colorTwo = img.get(x+1, y);
    
    totalOne = getColorTotal(colorOne);
    totalTwo = getColorTotal(colorTwo);

    if (totalOne < totalTwo){
        img.set(x, y, colorTwo);
        img.set(x + 1, y, colorOne);
    } else {
        img.set(x, y, colorTwo);
        img.set(x + 1, y, colorOne);
    }
}

function sortPixelsY() {
    const x = random(img.width);
    const y = random(img.height - 1);
    const colorOne = img.get(x, y);
    const colorTwo = img.get(x, y + 1);
  
    const totalOne = getColorTotal(colorOne);
    const totalTwo = getColorTotal(colorTwo);
  

    //up
    if (totalOne < totalTwo && accelY > 0) {
        img.set(x, y, colorTwo);
        img.set(x, y + 1, colorOne);
    }
    //down
    else if (totalOne > totalTwo && accelY < 0) {
        img.set(x, y, colorTwo);
        img.set(x, y + 1, colorOne);
    }
}


function getColorTotal(color) {
    return red(color) + green(color) + blue(color);
}

