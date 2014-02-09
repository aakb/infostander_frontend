

var INFOS = (function() {
  "use strict"

  // URL to use to activate screen (fixed CORS issues).
  var proxy_url = '/proxy';

  // The middelware proxy.
  var proxy_domain = '//localhost';
  var proxy_port = '3000';

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
    var cookie = new Cookie('infostander_token');
    var token = cookie.get('token');

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
        request.open('POST', proxy_url + '/activate', true);
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
      // If token connect to the socket (web-worker).
      connect(token);
    } 
  }

  /**
   * Load the socket.io script from the proxy server.
   */
  function loadSocket() {
    var file = document.createElement('script');
    file.setAttribute('type', 'text/javascript');
    file.setAttribute('src', '//' + proxy_domain + ':' + proxy_port + '/socket.io/socket.io.js');
    document.getElementsByTagName("head")[0].appendChild(file);
  }

  /**
   * Connect to the web-socket.
   *
   * @param string token
   *   JWT authentication token from the activation request.
   */
  function connect(token) {
    var socket = io.connect('//' + proxy_domain + ':' + proxy_port, { query: 'token=' + token });
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

  }

  return {
    start: start,
    stop: stop
  }
})();

// Get the show on the road.
INFOS.start();
