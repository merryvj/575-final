let touchX = 0;
let touchY = 0;

let accelTotal = 0;
let accelX = 0;
let accelY = 0;
let accelZ = 0;
let direction = "down";

let rotation_degrees = 0;
let frontToBack_degrees = 0;
let leftToRight_degrees = 0;
let px = 0.0;
let py = 0.0;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1 / 10; // Sensor refresh rate
let pointerX = 0;
let pointerY = 0;

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
        //console.log(accelTotal);


        rotation_degrees = sensorData.gyro.z;
        frontToBack_degrees = sensorData.gyro.x;
        leftToRight_degrees = sensorData.gyro.y;
        
    }
}



let song;
let img;
let blobs = [];

function preload() {
    song = loadSound('assets/songs/lane8.mp3');
    img = loadImage('https://images.unsplash.com/photo-1518022525094-218670c9b745?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80');

}

function setup(){
    createCanvas(100, 100);
    img.resize(width, height);
    image(img, 0, 0);
    noSmooth();
}

function draw(){
    let pixColor = color(get(pointerX, pointerY));
    pixColor.setAlpha(map(accelTotal, 0, 5, 0, 255));
    blobs.push(new Blob(pixColor, pointerX, pointerY, vx, vy));

    

    movePointer();

    img.loadPixels();
    let yPix = Math.abs(accelY);
    yPix = map(yPix, 0, 2, 0, 1000);
    for (let i = 0; i < yPix; i++) {
        sortPixelsY();
    }
    let xPix = Math.abs(accelX);

    xPix = map(xPix, 0, 1, 0, 1000);
    for (let j = 0; j < xPix; j++) {
        sortPixelsX();
    }

    // console.log("x " + xPix);
    // console.log("y " + yPix);

    img.updatePixels();
    image(img, 0, 0, width, height);

    let rate = accelTotal;
    if (rate > 1) {
        rate = 1;
    }
    song.rate(rate);
    
}

function sortPixelsX() {
    const x = random(img.width - 1);
    const y = random(img.height - 1);
    let colorOne = img.get(x, y);
    let colorTwo = img.get(x + 1, y);
    
    totalOne = getColorTotal(colorOne);
    totalTwo = getColorTotal(colorTwo);


    // if (accelX > 0) {
    //     colorTwo = img.get(x - 1, y);
    //     totalTwo = getColorTotal(colorTwo);
    //     img.set(x, y, colorTwo);
    //     img.set(x - 1, y, colorOne);
    // } else if (accelX < 0){
    //     colorTwo = img.get(x + 1, y);
    //     totalTwo = getColorTotal(colorTwo);
    //     img.set(x, y, colorTwo);
    //     img.set(x + 1, y, colorOne);
    // }

    if (totalOne < totalTwo && accelX > 0){
        img.set(x, y, colorTwo);
        img.set(x + 1, y, colorOne);

    } else if (totalOne > totalTwo && accelX < 0){
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

function playSong(){
    song.play();
}

function finishMoves() {
    makeDrawing();
}


class Blob {
    constructor(color, x, y, height, width) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}

function makeDrawing() {
    console.log(blobs);
    clear();

    noStroke();
    for (let b of blobs) {
        fill(b.color);
        ellipse(b.x, b.y, b.width, b.height);
    }

}

function movePointer() {
    // Update velocity according to how tilted the phone is
    // Since phones are narrower than they are long, double the increase to the x velocity
    vx = vx + leftToRight_degrees * updateRate * 2;
    vy = vy + frontToBack_degrees * updateRate;

    // Update position and clip it to bounds
    px = px + vx * 0.5;
    if (px > width || px < 0) {
      px = Math.max(0, Math.min(width, px)); 
      vx = 0;
    }

    py = py + vy * 0.5;
    if (py > height || py < 0) {
      py = Math.max(0, Math.min(height, py)); 
      vy = 0;
    }

    pointerX = Math.floor(px);
    pointerY = Math.floor(py);


}