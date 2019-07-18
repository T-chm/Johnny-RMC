// initialize everything, web server, socket.io, filesystem, johnny-five
	var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs'),
	five = require("johnny-five"),
	board, servo, led, sensor, relay1, relay2;


    var count = 0;

    board = new five.Board();

    // on board ready
    board.on("ready", function() {

        // init a led on pin 13, strobe every 1000ms
		led = new five.Led(13)
		//led.blink(1000);

        // var button = new five.Button(5);

        // setup a stanard servo, center at start
        servo = new five.Servo({
            pin: 6,
            range: [0, 180],
            type: "standard",
            center: true
        });

        sensor = new five.Sensor({
            pin: "A0",
            freq: "1000"
        });

        relay1 = new five.Relay(8);
        relay2 = new five.Relay(9);


    });

    // make web server listen on port 9000
    app.listen(8080);

    // handle web server


    function handler(req, res) {
        fs.readFile(__dirname + '/index.html',
            function(err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            });




    }


    // on a socket connection
    io.sockets.on('connection', function(socket) {
        io.set('log level', 1); // reduce logging

        socket.emit('news', {
            hello: 'world'
        });

        // if board is ready

        if (board.isReady) {
            // read in sensor data, pass to browser
            console.log("Hello");


            // var pin = new five.Pin(7);
            var button = new five.Button(5);

            button.on("down", function() {
                // console.log("Button has been pressed");
                socket.emit('pin', "OFF");
            });

            button.on("up", function() {
                // console.log("Button released");
                socket.emit('pin', "ON");
            });


        }


        // if servo message received
        socket.on('servo', function(data) {
            if (board.isReady) {
                servo.to(data.pos);
            }
        });
        // if led message received

        socket.on('led', function(data) {
            //	console.log(data);
            if (board.isReady) {
                led.strobe(data.delay);
            }
        });

        socket.on('relay1', function(data) {
            //	console.log(data);
            if (board.isReady) {
                if (data.status) {
                    relay1.on();
                }

                if (!data.status) {
                    relay1.off();
                }
            }
        });

        socket.on('relay2', function(data) {
            //	console.log(data);
            if (board.isReady) {

                if (data.status === 1) {
                    console.log(data.status);
                    led.blink(500);
                }
                if (data.status === 0) {
                    console.log(data.status);
                    led.stop();
                    led.off();
                }

            }
        });



    });