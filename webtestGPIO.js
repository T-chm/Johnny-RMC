// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , gpio = require('rpi-gpio')
  , led, sensor;

gpio.setup(7, gpio.DIR_OUT, write);

function write() {
    gpio.write(7, false, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}

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
 

 
 socket.on('led', function (data) {
//	console.log(data);
     if(board.isReady){    led.strobe(data.delay); } 
  });


         socket.on('relay1', function(data) {
                if (data.status) {
                
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });

                }

                if (!data.status) {
                
    gpio.write(7, false, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });

                }                    


            
        });


});
