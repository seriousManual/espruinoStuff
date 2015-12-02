var distance = require('Distance');

var a = new distance.Prox(10, B3, B4);

a.onNear(function(distance) {
    digitalWrite(LED1, 1);
    digitalWrite(LED2, 0);
});

a.onFar(function() {
    digitalWrite(LED1, 0);
    digitalWrite(LED2, 1);
});