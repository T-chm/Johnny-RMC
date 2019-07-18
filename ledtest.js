var five = require("johnny-five"),
    board, led;

board = new five.Board();

board.on("ready", function() {
    led = new five.Led(13);
    led.strobe(1000); // on off every second
    var relay1 = new five.Relay(8);

    relay1.on();

});