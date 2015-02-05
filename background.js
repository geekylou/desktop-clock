function onAppWindowCreated(appWindow) {
  drawClock(0, 0, 200, "orangered");
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'bounds': {
      'width': 1280,
      'height': 720
    }
  });
});