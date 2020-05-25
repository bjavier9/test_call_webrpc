const socket = io(
  "https://testcallnode.herokuapp.com/" || window.location.href
);
//location of where server is hosting socket app

socket.on("chat-message", (data) => {
  console.log(data);
});

// query DOM
const message = document.getElementById("message"),
  handle = document.getElementById("handle"),
  button = document.getElementById("submit"),
  typing = document.getElementById("typing"),
  output = document.getElementById("output");

// Emit events

message.addEventListener("keypress", () => {
  socket.emit("userTyping", handle.value);
});

button.addEventListener("click", () => {
  socket.emit("userMessage", {
    message: message.value,
    handle: handle.value,
  });
  document.getElementById("message").value = "";
});

// Listen to events

socket.on("userMessage", (data) => {
  typing.innerHTML = "";
  output.innerHTML +=
    "<p> <strong>" + data.handle + ": </strong>" + data.message + "</p>";
});

socket.on("userTyping", (data) => {
  typing.innerHTML = `<p><em>${data} is typing </em></p>`;
});

function getLVideo(callback) {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webKitGetUserMedia ||
    navigator.mozGetUserMedia;
  var constrains = {
    audio: true,
    video: true,
  };
  navigator.getUserMedia(constrains, callback.success, callback.error);
}

function recStream(stream, elemid) {
  var video = document.getElementById(elemid);
  video.srcObject = stream;
  window.peer_stream = stream;
}
getLVideo({
  success: function (stream) {
    window.localstream = stream;
    recStream(stream, "IVideo");
  },
  error: function (err) {
    alert("cannot access your camera");
    console.log(err);
  },
});

var conn;
var peer_id;
var peer = new Peer();
peer.on("open", function (id) {
  console.log("My peer ID is: " + id);
  document.getElementById(
    "displayId"
  ).innerHTML = `ID PARA LLAMAR:: ${peer.id}`;
});

peer.on("connection", function (connection) {
  conn = connection;
  peer_id = connection.peer;
  document.getElementById("connId").value = peer_id;
});
peer.on("error", function (err) {
  alert("an error has happened " + err);
  console.log(err);
});

document.getElementById("conn_button").addEventListener("click", function () {
  peer_id = document.getElementById("connId").value;
  if (peer_id) {
    conn = peer.connect(peer_id);
  } else {
    alert("enter an id");
    return false;
  }
});

peer.on("call", function (call) {
  var acceptCall = confirm("do yo want to answer this call?");
  if (acceptCall) {
    call.answer(window.localstream);
    call.on("stream", function (stream) {
      window.peer_stream = stream;
      resStream(stream, "rVideo");
    });
    call.on("close", function () {
      alert("the call has behind");
    });
  } else {
    console.log("call denied");
  }
});

document.getElementById("call_button")?.addEventListener("click", function () {
  console.log("calling a peer" + peer_id);
  console.log(peer);

  var call = peer.call(peer_id, window.localstream);
  call.on("stream", function (stream) {
    window.peer_stream = stream;
    recStream(stream, "rVideo");
  });
});
