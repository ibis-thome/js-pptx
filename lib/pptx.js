"use strict";

console.json = function(obj) { console.log(JSON.stringify(obj, null,4)); }
module.exports = {
  Presentation: require('./presentation'),
  Slide: require('./slide'),
  Shape: require('./shape'),
  emu: require('./util/emu')
};




