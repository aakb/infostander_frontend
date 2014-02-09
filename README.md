This is a simple javascript base front-end application for the information publishing system that is running the info pylons.

It's using:
 * Socket.io
 * hogan.js


# Apache proxy
<pre>
 ProxyRequests off
 SSLProxyEngine on

 <Proxy *>
   Order deny,allow
   Allow from all
 </Proxy>

 ProxyPass /proxy https://localhost:3000
 ProxyPassReverse /proxy https://localhost:3000

 # SSL Engine
 SSLEngine on
</pre>

# Pre-compile templates

* https://github.com/kupriyanenko/jsttojs

<pre>
 ~$ node install -g jsttojs
 ~$ jsttojs views views/templates.js --name templates
</pre>

You can also make the pre-compiler watch for file changes. When detected it will automatically compile the files.
<pre>
 ~$ jsttojs views views/templates.js --name templates --watch
</pre>

