"use strict";

var assert = require('assert');
var fs = require("fs");
var JSZip = require('jszip')

var INFILE = './test/files/minimal.pptx';
var STORE = './test/files/minimal.json';
var OUTFILE = './test/files/minimal-copy.pptx';

JSZip.loadAsync(fs.readFileSync(INFILE)).then(async zip1 => {
  var copy = {};

  await Promise.all(Object.keys(zip1.files).map(async key => {
    var text = await zip1.file(key).async("string");
    copy[key] = text;
  }));

  fs.writeFileSync(STORE, JSON.stringify(copy, null, 4))

  var json = fs.readFileSync(STORE, 'utf8');
  var obj = JSON.parse(json);

  var zip2 = new JSZip();
  for (var key in obj) {
    zip2.file(key, obj[key]);
  }

  var buffer = await zip2.generateAsync({ type: "nodebuffer", compression: 'DEFLATE' });
  fs.writeFile(OUTFILE, buffer, function (err) {
    if (err) throw err;
  });

  var zip3 = new JSZip();
  zip3.file('json', JSON.stringify(copy, null, 4))
  var buffer3 = await zip3.generateAsync({ type: "nodebuffer", compression: 'DEFLATE' });
  fs.writeFile('./test/files/minimal.json.jar', buffer3, function (err) {
    if (err) throw err;
  });
});