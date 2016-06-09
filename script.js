var iframe = document.createElement('iframe');
var html = '<html><head><script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script></head><body><p>THIS WILL BE RED IF JQUERY LOADED</p></body><script>$("p").css("color", "red");</script></html>';
iframe.style.position = 'absolute';
iframe.style.top = 0;
iframe.style.left = 0;
iframe.style['z-index'] = 9999999;
iframe.style.background = 'white';
iframe.style.color = 'black';
var initiallyLoaded = false;
iframe.onload = function() {
  if (!initiallyLoaded){
    setHtml();
  }
};
document.body.insertBefore(iframe, null);

function injectExternalScript(callback) {
  var scriptStart = html.indexOf('<script src="');
  var scriptEnd = html.indexOf('</script>');
  var srcUrlEnd = html.indexOf('">');
  var srcUrl = html.substring(scriptStart+13, srcUrlEnd);
  html = html.replace(html.substring(scriptStart, scriptEnd+9), '');
  var xhReq = new XMLHttpRequest();
  xhReq.onreadystatechange = function() {
    if (xhReq.readyState === 4 && xhReq.status === 200) {
      var pos = html.indexOf('</head>');
      html = html.slice(0, pos) + ('<script>'+xhReq.responseText+'</script>') + html.slice(pos, html.length);
      callback();
    }
  }
  xhReq.open('GET', srcUrl, true);
  xhReq.send();
}

function setHtml() {
  // iframe.onload gets called each time this method is run
  initiallyLoaded = true;
  iframe.contentWindow.document.open('text/html', 'replace');
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();
}
