const defaults = require('./defaults');
const clone = require('./util/clone');
const shapeProperties = require("./shapeProperties");
const search = require("./util/search");

/**
 * 
 * @param {object} oContent
 */
let Connector = function (oContent) {
  this.content = oContent || clone(defaults["p:cxnSp"]);
};

Connector.prototype.id = function(sId) {
    let oPropsAttributes = search.createPath(this.content, ["p:nvCxnSpPr", 0, "p:cNvPr", 0, "$"]);
    if(sId) {
        oPropsAttributes["id"] = sId;
        return this;
    } else {
        return oPropsAttributes["id"];
    }
};

Connector.prototype.name = function(sId) {
    let oPropsAttributes = search.createPath(this.content, ["p:nvCxnSpPr", 0, "p:cNvPr", 0, "$"]);
    if(sId) {
        oPropsAttributes["name"] = sId;
        return this;
    } else {
        return oPropsAttributes["name"];
    }
};

Connector.prototype.start = function(sId) {
    search.createPath(this.content, ["p:nvCxnSpPr", 0, "p:cNvCxnSpPr", 0])["a:stCxn"] = [
        {
            "$": {
                "id": sId,
                "idx": "1"
            }
        }
    ];
    return this;
};

Connector.prototype.startPosition = function(sPosition) {
    search.createPath(this.content, ["p:nvCxnSpPr", 0, "p:cNvCxnSpPr", 0, "a:stCxn", 0, "$"]).idx = sPosition;
    return this;
};

Connector.prototype.end = function(sId) {
    search.createPath(this.content, ["p:nvCxnSpPr", 0, "p:cNvCxnSpPr", 0])["a:endCxn"] = [
        {
            "$": {
                "id": sId,
                "idx": "1"
            }
        }
    ];
    return this;
};

Connector.prototype.endPosition = function(sPosition) {
    search.createPath(this.content, ["p:nvCxnSpPr", 0, "p:cNvCxnSpPr", 0, "a:endCxn", 0, "$"]).idx = sPosition;
    return this;
};

/**
 * @param {object} [oPropertiesContent] - predefined properties
 */
Connector.prototype.shapeProperties = function(oPropertiesContent) {
    let oPropElements = this.content["p:spPr"];
    if(oPropertiesContent) Object.keys(oPropertiesContent).forEach(sPropKey => { oPropElements[0][sPropKey] = JSON.parse(JSON.stringify(oPropertiesContent[sPropKey])); });
    let oProps = new shapeProperties(oPropElements[0]);
    if(!oPropElements[0]) oPropElements[0] = oProps.content;
    return oProps;
};


module.exports = Connector;