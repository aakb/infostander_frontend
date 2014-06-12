window.config = {

  // Used to activate screen (rest API) and load resources.
  resource: {
    server: '//localhost/',
    uri: 'proxy'
  },

  // Used by web-socket.
  ws: {
    server: '//localhost:3000/'
  },

  // If cookie is secure it's only send over https.
  cookie: {
    secure: true
  }

}
