const paragraph = require('./fragments/js/paragraph');
const defaults = require("./defaults");
const clone = require('./util/clone');

/**
 * 
 * @param {object} oParams 
 * @param {object} oParams.content
 * @param {object} oParams.presentation
 * @param {object} oParams.slide
 */
var Text = function(oParams) {
    let oContent = oParams.content;
    this.content = oContent || clone(defaults["p:sp"]["p:txBody"][0]);
    this.presentation = oParams.presentation;
    this.slide = oParams.slide;
};

/**
 * @desc sets one or many paragraphs for this text body
 * @param {object[] || string} aParagraphs - array of paragraphs or a string
 * @returns {object} self refence
 */
Text.prototype.text = function(aParagraphs) {
    if(aParagraphs != undefined) {
        if(typeof aParagraphs === "string") {
            let oParagraph = this.content["a:p"][0] || paragraph.createSingleParagraph({ paragraphs: [{ text: aParagraphs }], slide: this.slide, presentation: this.presentation });
            let oRow = oParagraph["a:r"][0] || paragraph.createRow({ text: aParagraphs, slide: this.slide, presentation: this.presentation });
            oRow["a:t"] = [aParagraphs];
            this.content["a:p"] = [oParagraph];
        } else {
            this.content["a:p"] = (aParagraphs && aParagraphs.length) ? paragraph.createNewParagraphs({ paragraphs: aParagraphs, slide: this.slide, presentation: this.presentation }) : [];
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


