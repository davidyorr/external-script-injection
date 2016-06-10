## Injecting external scripts into iframes in chrome extensions

This repo contains two Chrome extensions in the branches `jquery-loading-fails` and `jquery-loading-succeeds`. They are both content scripts that run on every page. They insert an iframe onto the page and then set the iframe's HTML to something that includes jQuery. This is the HTML source:

````html
<html>
  <head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  </head>
  <body>
    <p>THIS WILL BE RED IF JQUERY LOADED</p>
  </body>
  <script>$("p").css("color", "red");</script>
</html>
````

### jQuery loading fails

The `jquery-loading-fails` extension will fail to load jQuery on certain websites, resulting in an error message like:

    Refused to execute inline script because it violates the following Content Security Policy directive:

The `cors.perl` script gets a list of websites (scanning top 300 from Alexa Top 1,000,000) that the extension will fail on. It will fail on websites that set the `Content-Security-Policy` header without also including the `googleapis` domain.

A few of the sites that the extension will fail on:

    imdb.com
    github.com
    cnn.com
    dropbox.com
    steamcommunity.com
    cnet.com
    vimeo.com
    flickr.com
    spotify.com

### jQuery loading succeeds

The `jquery-loading-succeeds` extension will not fail to load jQuery. Instead of including jQuery in a `<script>` tag, it does an ajax request and replaces this line

````html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
````

with the actual jQuery source inside a `<script>` tag.
