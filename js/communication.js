
var socket = undefined;
var token =  undefined;

importScripts('//proxy.infostander.leela/socket.io/socket.io.js');

/**
 * Connect to the web-socket and setup events.
 */
function connect() {
  socket = io.connect('//proxy.infostander.leela', { query: 'token=' + token });
  socket.socket.on('error', function (reason) {
    alert(reason);
  });

  socket.on('connect', function () {
    alert('Connected to the server (' + socket.socket.options.host + ').');
    socket.emit('ready', { token: token });
  });

  socket.on('disconnect', function () {
    alert('Disconnect from the server.');
  });

  socket.on('reconnecting', function () {
    alert('Trying to re-connecting to the server.');
  });

  socket.on('pong', function () {
    alert('Pong received from: ' + socket.socket.options.host);
  });
}

self.addEventListener('message', function(e) {
  token = e.data.token;
  connect();
});
