

var INFOS = (function() {
  "use strict"

  var connection = undefined;

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
    }
    else {
      // If token connect to the socket (web-worker).
      connection = new Worker('js/communication.js');
    } 
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
