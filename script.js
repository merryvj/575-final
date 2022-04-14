let touchX = 0;
let touchY = 0;

let accel = 0;
let direction = "down";

// Connect to our websocket server , this server was created when you typed `node index.js`
const ws = new WebSocket("ws://localhost:8080")

ws.onmessage = (event) => {
    const dataAsString = event.data;
    const dataAsObject = JSON.parse(dataAsString)
    const sensorData = dataAsObject.sensordata;
    if (sensorData) {
        accel = sensorData.accel.x + sensorData.accel.y + sensorData.accel.z;
        if (sensorData.accel.x > 0 && sensorData.accel.x > sensorData.accel.y) {
            direction = 'left';
        } else {
            direction = 'down';
        }

        console.log(direction);
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

function draw(){
    img.loadPixels();
    // for (let i = 0; i < width - 20; i+=20) {
    //     for (let j = 0; j < height - 20; j+=20){
    //         ellipse(i + 10, j + 10, 10);
    //     }
    // }

    if (accel > 0.5){
        for (let i = 0; i < accel * 100; i++) {
            sortPixels();
        }
    }

    img.updatePixels();
    image(img, 0, 0, width, height);


    song.rate(accel/1);
    console.log(accel);
    
}




function sortPixels() {
    const x = random(img.width);
    const y = random(img.height - 1);
    let colorOne = img.get(x, y);
    let colorTwo;
    let totalOne, totalTwo;

    switch(direction){
        case 'down':
            colorTwo = img.get(x, y + 1);
            totalOne = getColorTotal(colorOne);
            totalTwo = getColorTotal(colorTwo);

            if (totalOne > totalTwo) {
                img.set(x, y, colorTwo);
                img.set(x, y + 1, colorOne);
            }
            break;
        case 'left': 
            colorTwo = img.get(x + 1, y);
            totalOne = getColorTotal(colorOne);
            totalTwo = getColorTotal(colorTwo);

            if (totalOne > totalTwo) {
                img.set(x, y, colorTwo);
                img.set(x + 1, y, colorOne);
            }  
            break;
    }
}


function getColorTotal(color) {
    return red(color) + green(color) + blue(color);
}

function playSong(){
    song.play();
}
