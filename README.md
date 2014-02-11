This is a simple javascript base front-end application for the information publishing system that is running the info pylons.

It's using:
 * Socket.io
 * hogan.js

# Production

## Nginx proxy

<pre>
server {
  listen 80;

  root /home/www/infostander_etek_dk/htdocs/;
  server_name infostander.etek.dk;

  rewrite ^ https://$server_name$request_uri? permanent;
}

upstream nodejs_app {
  server 127.0.0.1:3000;
}

# HTTPS server
#
server {
  listen 443;
  server_name infostander.etek.dk;

  root /home/www/infostander_etek_dk/htdocs/;
  index index.html;

  access_log /home/www/infostander_etek_dk/logs/access.log;
  error_log /home/www/infostander_etek_dk/logs/error.log;

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
</pre>

## Configuration

<pre>
  mv example.config.js config.js 
</pre>

# Development

## Apache proxy

## Pre-compile templates

* https://github.com/kupriyanenko/jsttojs

<pre>
 ~$ node install -g jsttojs
 ~$ jsttojs views views/templates.js --name templates
</pre>

You can also make the pre-compiler watch for file changes. When detected it will automatically compile the files.
<pre>
 ~$ jsttojs views views/templates.js --name templates --watch
</pre>

