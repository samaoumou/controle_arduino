const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const { SerialPort } = require("serialport");
const port = new SerialPort({
  path: "/dev/ttyACM0",
  baudRate: 9600,
});
var brightness = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
console.log(
  "Web Server Started go to 'http://localhost:8080' in your Browser."
);

io.on("connection", (socket) => {
  socket.on("led", function (data) {
    var brightness = data.value;
    var buf = new Buffer.alloc(1);
    buf.writeUInt8(brightness, 0);
    port.write(buf);
    console.log();
    io.sockets.emit("led", { value: brightness });
  });
  socket.emit("led", { value: brightness });
});
