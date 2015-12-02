pinMode(B4, 'input_pulldown');
pinMode(B5, 'input_pulldown');

SPI2.setup({baud:3200000, mosi:B15});

function getPattern(i) {
  var col = Math.abs(Math.sin(i * Math.PI)) * 127;

  return [0, col, 0];
}

function doLights(pattern) {
  SPI2.send4bit(pattern, 0b0001, 0b0011);
}


var i = 0;
var handle;
function start() {
  if (handle) return;
  
  handle = setInterval(function() {
    i++;
    i = i % 100;

    var pattern = getPattern(i / 100);
    doLights(pattern);
  }, 10);
}
                       

setWatch(function() {
  if (!handle) {
   return; 
  }
  
  clearInterval(handle);
  handle = null;
  
  doLights([0, 0, 0]);
}, B4, { repeat: true, edge:'rising' });

setWatch(start, B5, { repeat: true, edge:'rising' });

doLights([0, 0, 0]);
