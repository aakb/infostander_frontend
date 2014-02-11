

var INFOS = (function() {
  "use strict"

  // Get the load configuration object.
  var config = window.config;

  // Communication with web-socket.
  var socket = undefined;

  // Global variable with token cookie.
  var token_cookie = undefined;

  /**
   * Cookie object.
   *
   * Used to handle the cookie(s), mainly used to store the connetion JSON Web Token.
   */
  var Cookie = (function() {
    var Cookie = function(name) {
      var self = this;
      var name = name;

      self.get = function get() {
        var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
        var result = regexp.exec(document.cookie);
        return (result === null) ? undefined : result[1];
      }

      this.set = function set(value) {
        var cookie = name + "=" + escape(value) + ";";
 
        cookie += "path=/;";
        cookie += "domain=" + document.domain + ";";
        cookie += " secure";

        document.cookie = cookie;
      }
    }

    return Cookie;
  })();

  /***************************
   * Private methods
   *****************/

  /**
   * Check if a valied token exists.
   *
   * If a token is found and connection to the proxy is attampted. If token
   * not found the activation form is displayed.
   */
  function activation() {
    // Check if token exists.
    token_cookie = new Cookie('infostander_token');
    var token = token_cookie.get('token');

    if (token === undefined) {
      // Token not found, so display actiavte page.
      var template = Hogan.compile(window.templates['activation']);
      var output = template.render();

      // Insert the render content.
      var el = document.getElementsByClassName('content');
      el[0].innerHTML = output;

      // Add event listener to form submit button.
      el = document.getElementsByClassName('btn-activate');
      el[0].addEventListener('click', function(event) {
        event.preventDefault();

        // Build ajax post request.
        var request = new XMLHttpRequest();
        request.open('POST', config.proxy_url + '/activate', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onload = function(resp) {
          if (request.readyState == 4 && request.status == 200) {
            // Success.
            resp = JSON.parse(request.responseText);
            
            // Try to get connection to the proxy.
            connect(resp.token);
          }
          else {
            // We reached our target server, but it returned an error
            alert('Activation could not be performed.');
          }
        }

        request.onerror = function(exception) {
          // There was a connection error of some sort
          alert('Activation request failed.');
          console.log(exception);
        }

        // Send the request.
        var form = document.getElementsByClassName('form-activation-code');
        request.send(JSON.stringify({ activationCode: form[0].value }));

        return false;
      });
    }
    else {
      // If token exists, connect to the socket.
      connect(token);
    } 
  }

  /**
   * Load the socket.io script from the proxy server.
   */
  function loadSocket() {
    var file = document.createElement('script');
    file.setAttribute('type', 'text/javascript');
    file.setAttribute('src', config.proxy_domain + ':' + config.proxy_port + '/socket.io/socket.io.js');
    document.getElementsByTagName("head")[0].appendChild(file);
  }

  /**
   * Connect to the web-socket.
   *
   * @param string token
   *   JWT authentication token from the activation request.
   */
  function connect(token) {
    // Get connected to the server.
    socket = io.connect(config.proxy_domain + ':' + config.proxy_port, { query: 'token=' + token });

    // Handle error events.
    socket.socket.on('error', function (reason) {
      alert(reason);
    });

    // Handle connected event.
    socket.on('connect', function () {
      // Connection accepted, so lets store the token.
      token_cookie.set(token);

      alert('Connected to the server (' + socket.socket.options.host + ').');
      socket.emit('ready', { token: token });
    });

    // Handle disconnect event (fires when disconnected or connection fails).
    socket.on('disconnect', function () {
      alert('Disconnect from the server.');
    });

    // Ready event - if the server accepted the ready command.
    socket.on('ready', function (data) {
      if (data.statusCode === 200) {
        alert('Server accepted ready command');
      }
    });

    // Pause event - if the server accepted the pause command.
    socket.on('pause', function (data) {
      if (data.statusCode === 200) {
        alert('Server accepted pause command');
      }
    });


  }

  /***************************
   * Exposed methods
   *****************/

  function start() {
    // Load socket.io Javascript.
    loadSocket();

    // Activate the screen.
    activation();
  }

  /**
   * This should mainly be used to bebugging.
   */
  function stop() {
    socket.emit('pause', {});
  }

  return {
    start: start,
    stop: stop
  }
})();

// Get the show on the road.
INFOS.start();
