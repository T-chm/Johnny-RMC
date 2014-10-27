// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , five = require("johnny-five"),
  board,servo,led,sensor;


var count = 0;

board = new five.Board();

// on board ready
board.on("ready", function() {

  // init a led on pin 13, strobe every 1000ms
  led = new five.Led(13).strobe(1000);

  // init a button
  this.pinMode(7, five.Pin.INPUT);
// var state = 0; 
//	pin.read(function(value) {
	//console.log(value);
//	state = value;
//	console.log(state);
//	});

  // setup a stanard servo, center at start
  servo = new five.Servo({
    pin:6,
    range: [0,180],
    type: "standard",
    center:true
  });

sensor = new five.Sensor({
	pin: "A0",
	freq: "1000"
});

});

// make web server listen on port 8000
app.listen(9000);


// handle web server
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


// on a socket connection
io.sockets.on('connection', function (socket) {
  io.set('log level', 1); // reduce logging

  socket.emit('news', { hello: 'world' });
 
  // if board is ready

if(board.isReady){
    // read in sensor data, pass to browser
console.log("Bello");

var button = new five.Button(5);
	
var pin = new five.Pin(7);

button.on("press", function() {
  console.log( "Button has been pressed" );
  socket.emit('pin', "OFF");
});  

  button.on("release", function() {
    console.log( "Button released" );
    socket.emit('pin', "ON");  
});

//	pin.read(function(value){
//	console.log(value);
//	socket.emit('pin', value);
//	});        

}


  // if servo message received
  socket.on('servo', function (data) {
    if(board.isReady){ servo.to(data.pos);  }
  });
  // if led message received
 
 socket.on('led', function (data) {
//	console.log(data);
     if(board.isReady){    led.strobe(data.delay); } 
  });

});
