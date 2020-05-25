var express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log("listening on *:3000");
});

io.on("connection", (socket) => {
  console.log("client is connected " + socket.id);
  // callback function after connection is made to the client

  // recieves a chat event, then sends the data to other sockets
  socket.on("userMessage", (data) => {
    console.log(data);
    io.sockets.emit("userMessage", data);
  });

  socket.on("userTyping", (data) => {
    socket.broadcast.emit("userTyping", data);
  });
});

var routes = require("./src/rutas/appRutas");
routes(app);
