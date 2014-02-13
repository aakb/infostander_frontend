This is a JavaScript front-end application for the information publishing system that is running the information pylons in Aarhus.

It's using:
 * Socket.io
 * hogan.js
 * Vanilla JS


# Installation
The middleware the frontend is communicating with is a node.js application that runs on a non default port (default 3000). So this _read me_ uses either Apache (development no need to proxy web-sockets) and nginx (production proxy web-sockets) to serve the frontend application.

## Production
In production environments nginx is used as it can proxy web-sockets to the middleware running at port 3000, which Apache 2.2 is not able to do yet.

```
server {
  listen 80;

  root [PATH TO HTDOCS];
  server_name infostander.dk;

  rewrite ^ https://$server_name$request_uri? permanent;
}

upstream nodejs_app {
  server 127.0.0.1:3000;
}

# HTTPS server
#
server {
  listen 443;
  server_name infostander.dk;

  root [PATH TO HTDOCS];
  index index.html;

  access_log [PATH TO LOGS]/access.log;
  error_log [PATH TO LOGS]/error.log;

  location /proxy/ {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;

    proxy_buffering off;

    proxy_pass http://nodejs_app/;

    proxy_redirect off;
  }

  location /socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_pass http://nodejs_app;
  }

  ssl on;
  ssl_certificate /etc/ssl/nginx/server.cert;
  ssl_certificate_key /etc/ssl/nginx/server.key;

  ssl_session_timeout 5m;

  ssl_protocols SSLv3 TLSv1;
  ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv3:+EXP;
  ssl_prefer_server_ciphers on;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

## Development
In local development environments where you have access to port 3000 you only need to proxy the resource loading (socket.io.js) from the middleware to get around cross domain issues. This can be done in apache.

```
ProxyRequests off
SSLProxyEngine on

<Proxy *>
  Order deny,allow
  Allow from all
</Proxy>

ProxyPass /proxy https://localhost:3000
ProxyPassReverse /proxy https://localhost:3000
```

# Configuration
To configure the the application the frontend load the config.js file, so copy the example config.
```
  mv example.config.js config.js
```

## Development config.js
```
window.config = {
  resource: {
    server: '//infostander.leela/',
    uri: 'proxy'
  },
  ws: {
    server: '//localhost:3000/',
  },
  cookie: {
    secure: false
  }
}
```

## Production config.js
```
window.config = {
  resource: {
    server: '//infostander.etek.dk/',
    uri: 'proxy'
  },
  ws: {
    server: '//infostander.etek.dk/',
  },
  cookie: {
    secure: true
  }
}
```

# Pre-compile templates

* https://github.com/kupriyanenko/jsttojs

## Install
```
 ~$ node install -g jsttojs
 ~$ jsttojs views views/templates.js --name templates
```

## Compile
You can also make the pre-compiler watch for file changes. When detected it will automatically compile the files.
```
 ~$ jsttojs views views/templates.js --name templates --watch
```
