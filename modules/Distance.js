var HCSR04 = {
  connect: function(/*=PIN*/trig, /*=PIN*/echo, callback) {
    var riseTime = 0;

    setWatch(function (e) { // check for rising edge
      riseTime = e.time;
    }, echo, {repeat: true, edge: 'rising'});

    setWatch(function (e) { // check for falling edge
      callback(((e.time - riseTime) * 1000000) / 57.0);
    }, echo, {repeat: true, edge: 'falling'});

    return {
      trigger: function () {
        digitalPulse(trig, 1, 0.01/*10uS*/);
      }
    };
  }
};

function Dist(trigger, echo) {
  var that = this;
  this._sensor = HCSR04.connect(trigger, echo, this._handle.bind(this));
  this._proxHandlers = [];
  
  setInterval(function() {
    that._sensor.trigger();
  }, 100);
}

Dist.prototype.onProximity = function(handler) {
  this._proxHandlers.push(handler);
  
  return this;
};
  

Dist.prototype._handle = function(distance) {
  this._proxHandlers.forEach(function(handler) {
    handler(distance);
  });
};

function Prox(distance, trigger, echo) {
  var that = this;
  this._distance = distance;
  this._distHandler = new Dist(trigger, echo);
  this._near = false;
  this._onNearHandler = null;
  this._onFarHandler = null;

  this._distHandler.onProximity(function(distance) {
    if (that._near && distance > that._distance) {
      that._near = false;
      that._onFarHandler(distance);
    }

    if (!that._near && distance <= that._distance) {
      that._near = true;
      that._onNearHandler(distance);
    }
  });
}

Prox.prototype.onNear = function(handler) {
  this._onNearHandler = handler;

  return this;
};

Prox.prototype.onFar = function(handler) {
  this._onFarHandler = handler;

  return this;
};

module.exports = {
  Dist: Dist,
  Prox: Prox
};