

var INFOS = (function() {
  "use strict"

  // Start web-worker that is used to communicate with the backend.
  var connection = undefined;
  var proxy_url = 'https://proxy.infostander.leela';

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

          }
        }

        request.onerror = function(exception) {
          // There was a connection error of some sort
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
            
    } 
  }

  function connect(token) {
    connection = new Worker('js/communication.js');
    connection.postMessage({ token: token });


  }

  /***************************
   * Exposed methods
   *****************/

  function start() {
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
