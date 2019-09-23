const shapeProperties = require('./shapeProperties');
const defaults = require('./defaults');
const clone = require('./util/clone');
const search = require("./util/search");
const Text = require("./text");

//======================================================================================================================
// Shape (p:sp)
//======================================================================================================================

/**
 * 
 * @param {object} oContent
 */
var Shape = function (oContent) {
  this.content = oContent || clone(defaults["p:sp"]);
};

Shape.prototype.id = function(sId) {
    let oPropsAttributes = search.createPath(this.content, ["p:nvSpPr", 0, "p:cNvPr", 0, "$"]);
    if(sId) {
        oPropsAttributes["id"] = sId;
        return this;
    } else {
        return oPropsAttributes["id"];
    }
};

Shape.prototype.name = function(sName) {
    let oPropsAttributes = search.createPath(this.content, ["p:nvSpPr", 0, "p:cNvPr", 0, "$"]);
    if(sName) {
        oPropsAttributes["name"] = sName;
        return this;
    } else {
        return oPropsAttributes["name"];
    }
};

/**
 * @desc sets one or many paragraphs for this text body
 * @param {object[] || string} aParagraphs - might be an array of paragraphs or a string
 * @param {object} oOptions
 * @param {boolean} oOptions.overflow
 * @returns {object} self refence
 */
Shape.prototype.text = function (aParagraphs, oOptions) {
    if(!this._oText) this._oText = new Text(this.content["p:txBody"][0]);
    this._oText.text(aParagraphs);
    if(oOptions && oOptions.overflow) this._oText.overflow(oOptions.overflow);
    this.content["p:txBody"] = JSON.parse(JSON.stringify([this._oText.content]));
    return this;
};

/**
 * @param {object} [oPropertiesContent] - predefined properties
 */
Shape.prototype.shapeProperties = function (oPropertiesContent) {
    let oPropElements = this.content["p:spPr"];
    if(oPropertiesContent) Object.keys(oPropertiesContent).forEach(sPropKey => { oPropElements[0][sPropKey] = JSON.parse(JSON.stringify(oPropertiesContent[sPropKey])); });
    let oProps = new shapeProperties(oPropElements[0]);
    if(!oPropElements[0]) oPropElements[0] = oProps.content;
    return oProps;
};

module.exports = Shape;