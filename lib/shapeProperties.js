const search = require('./util/search');


//======================================================================================================================
// spPr   ShapeProperties
//======================================================================================================================

var shapeProperties = function (content) {
  this.content = content || {};
}


shapeProperties.prototype.getDefault = function () {
  return {
    "a:xfrm": [
      {
        "a:off": [
          {
            "$": {
              "x": "6578600",
              "y": "787400"
            }
          }
        ],
        "a:ext": [
          {
            "$": {
              "cx": "1181100",
              "cy": "1181100"
            }
          }
        ]
      }
    ],
    "a:prstGeom": [
      {
        "$": {
          "prst": "ellipse"
        },
        "a:avLst": [
          ""
        ]
      }
    ]
  };
}

shapeProperties.prototype.toJSON = function () {
  return {
    x: this.x(),
    y: this.y(),
    cx: this.cx(),
    cy: this.cy(),
    fill: this.fill(),
    prstGeom: this.prstGeom()
  }
};

shapeProperties.prototype.x = function (val) {
  if (arguments.length == 0) return Math.floor(search.getPath(this.content, ["a:xfrm", 0, "a:off", 0, '$', "x"]));
  else search.createPath(this.content, ["a:xfrm", 0, "a:off", 0, "$"]).x = val;
  return this;
};
shapeProperties.prototype.y = function (val) {
  if (arguments.length == 0) return Math.floor(search.getPath(this.content, ["a:xfrm", 0, "a:off", 0, '$', "y"]));
  else search.createPath(this.content, ["a:xfrm", 0, "a:off", 0, '$']).y = val;
  return this;
};
shapeProperties.prototype.cx = function (val) {
  if (arguments.length == 0) return Math.floor(search.getPath(this.content, ["a:xfrm", 0, "a:ext", 0, '$', "cx"]));
  else search.createPath(this.content, ["a:xfrm", 0, "a:ext", 0, '$']).cx = val;
  return this;
};
shapeProperties.prototype.cy = function (val) {
  if (arguments.length == 0) return Math.floor(search.getPath(this.content, ["a:xfrm", 0, "a:ext", 0, '$', "cy"]));
  else search.createPath(this.content, ["a:xfrm", 0, "a:ext", 0, '$']).cy = val;
  return this;
};
/**
 * @desc flips the shape horizontally
 * @param {boolean} bFlip
 * @returns {object} self reference
 */
shapeProperties.prototype.flipH = function (bFlip) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:xfrm", 0, '$', "flipH"]);
    else search.createPath(this.content, ["a:xfrm", 0, '$']).flipH = (bFlip ? "1" : "0");
    return this;
  };
/**
 * @param {string} val - color value in hex color code style
 * @returns {object} self reference
 */
shapeProperties.prototype.fill = function (val) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:solidFill", 0, "a:srgbClr", 0, "$", "val"]);
    else {
        search.createPath(this.content, ["a:solidFill", 0, "a:srgbClr", 0, "$"]).val = val;
        delete this.content["a:solidFill"][0]["a:schemeClr"];
    }
    return this;
};
/**
 * @param {string} val - color value from color preset
 * @returns {object} self reference
 */
shapeProperties.prototype.fillScheme = function (val) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:solidFill", 0, "a:schemeClr", 0, "$", "val"]);
    else {
        search.createPath(this.content, ["a:solidFill", 0, "a:schemeClr", 0, "$"]).val = val;
        delete this.content["a:solidFill"][0]["a:srgbClr"];
    }
    return this;
};
/**
 * @param {string} val - alpha value. 0 is complete transparent, 100 complete visible
 * @returns {object} self reference
 */
shapeProperties.prototype.fillTransparency = function (val) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:solidFill", 0, "a:srgbClr", 0, "a:alpha", 0, "$", "val"]);
    else search.createPath(this.content, ["a:solidFill", 0, "a:srgbClr", 0, "a:alpha", 0, "$"]).val = val;
    return this;
};
/**
 * @param {string} val - line style. 
        possible values: 
        dash
        dashDot
        dot
        lgDash (large dash)
        lgDashDot
        lgDashDotDot
        solid
        sysDash (system dash)
        sysDashDot
        sysDashDotDot
        sysDot
    @returns {object} self reference
 */
shapeProperties.prototype.lineStyle = function (val) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:ln", 0, "a:prstDash", 0, "$", "val"]);
    else search.createPath(this.content, ["a:ln", 0, "a:prstDash", 0, "$"]).val = val;
    return this;
};
/**
 * @param {string} val - color value in hex color code style
 * @returns {object} self reference
 */
shapeProperties.prototype.lineColor = function (val) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:ln", 0, "a:solidFill", 0, "a:srgbClr", 0, "$", "val"]);
    else search.createPath(this.content, ["a:ln", 0, "a:solidFill", 0, "a:srgbClr", 0, "$"]).val = val;
    return this;
};
/**
 * @param {string} val - color value from color preset
 * @returns {object} self reference
 */
shapeProperties.prototype.lineColorScheme = function (val) {
    if (arguments.length == 0) return search.getPath(this.content, ["a:ln", 0, "a:solidFill", 0, "a:schemeClr", 0, "$", "val"]);
    else search.createPath(this.content, ["a:ln", 0, "a:solidFill", 0, "a:schemeClr", 0, "$"]).val = val;
    return this;
};
// see http://www.officeopenxml.com/drwSp-prstGeom.php
shapeProperties.prototype.prstGeom = function (shape) {
  if (arguments.length == 0) return this.content["a:prstGeom"][0]["$"]["prst"];
  else this.content["a:prstGeom"][0]["$"]["prst"] = shape;
  return this;
};

module.exports = shapeProperties;

//https://msdn.microsoft.com/en-us/library/documentformat.openxml.drawing.presetgeometry(v=office.14).aspx