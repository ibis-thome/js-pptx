const paragraph = require('./fragments/js/paragraph');
const defaults = require("./defaults");
const clone = require('./util/clone');

/**
 * 
 * @param {object} oContent 
 */
var Text = function(oContent) {
    this.content = oContent || clone(defaults["p:sp"]["p:txBody"][0]);
};

/**
 * @desc sets one or many paragraphs for this text body
 * @param {object[] || string} aParagraphs - array of paragraphs or a string
 * @returns {object} self refence
 */
Text.prototype.text = function(aParagraphs) {
    if(aParagraphs != undefined) {
        if(typeof aParagraphs === "string") {
            let oParagraph = this.content["a:p"][0] || paragraph.createSingleParagraph([{ text: aParagraphs }]);
            let oRow = oParagraph["a:r"][0] || paragraph.createRow({ text: aParagraphs });
            oRow["a:t"] = [aParagraphs];
            this.content["a:p"] = [oParagraph];
        } else {
            this.content["a:p"] = (aParagraphs && aParagraphs.length) ? paragraph.createNewParagraphs(aParagraphs) : [];
        }
        return this;
    } else {
        return this.content["a:p"];
    }
};

/**
 * @param {string} sOverflow - possible values are clip, ellipsis and overflow (default)
 * @returns {object} self refence
 */
Text.prototype.overflow = function(sOverflow) {
    let oProps = this.content["a:bodyPr"][0];
    sOverflow ? oProps["$"]["vertOverflow"] = sOverflow : delete oProps["$"]["vertOverflow"];
    return this;
};

module.exports = Text;


