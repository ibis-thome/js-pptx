const search = require("../../util/search");

module.exports = {

	/**
	 * @desc return array with different paragraphs (if line break option is
	 *       true, a new paragraph has to be created).
	 * @param args:
	 *            {Object | Array}Text input from user. Either an Object if
	 *            only single text line (args.text+args.options) or an array
	 *            of object if multiple lines
	 * 
	 */
	formatParagraphs(aText){
		
		// if aText is an Object create arrays and return result
		if (!(Object.prototype.toString.call(aText) == '[object Array]')){
			var res = [];
			var paragraph = [];
			paragraph.push(aText);
			res.push(paragraph);
			return res;
		}
		
		// Create an array entry for every newLine
		var aParagraphs = [];
		var curr = [];
		for (var i = 0; i < aText.length; i++){
            curr = [];
            (Array.isArray(aText[i])) ? aTextSections = aText[i] : aTextSections = [aText[i]];
            aTextSections.forEach(oTextSection => {
                curr.push(oTextSection);
                if (oTextSection.options && !!oTextSection.options.breakLine){
                    aParagraphs.push(curr);
                    curr = [];
                }
            });
            if (curr.length != 0){
                aParagraphs.push(curr);
            }
		}
		return aParagraphs;
	},
	/**
	 * @desc: creates new Paragrpahs
	 * @param {Object} oParams
     * @param {Object|Array} oParams.paragraphs:
	 *            Text input from user. Either an Object if only single text
	 *            line (args.text+args.options) or an array of object if
	 *            multiple lines
     * @param {Object} oParams.presentation
     * @param {Object} oParams.slide
	 */		
	createNewParagraphs(oParams){
        let textContent = oParams.paragraphs;
		var paragraphs=this.formatParagraphs(textContent);
		var res =[];
		for (var i=0; i<paragraphs.length; i++){
			res[i]=this.createSingleParagraph({ paragraph: paragraphs[i], slide: oParams.slide, presentation: oParams.presentation });
			
		}
		return res;
		
	},
	/**
	 * @desc: creates a single Paragraph
	 * @param {Object} oParams
     * @param {Object|Array} paragraph
	 *            {Array} containing Text with different Format. For each
	 *            entry create a new a:r element with according formats
     * @param {Object} oParams.presentation
     * @param {Object} oParams.slide
	 */
	createSingleParagraph(oParams){
        let paragraph = oParams.paragraph;
		var res = {
				"a:pPr":[],
				"a:r":[
					
				]
        };
        let oParagraphProps = { "$": {}};
        if (search.getPath(paragraph, [0, "options", "algn"])) oParagraphProps["$"].algn = paragraph[0].options.algn;
        if (search.getPath(paragraph, [0, "options", "level"])) oParagraphProps["$"].lvl = paragraph[0].options.level;
        if (search.getPath(paragraph, [0, "options", "ul"])) {
            oParagraphProps["a:buChar"] = [{ "$": { "char": paragraph[0].options.ulChar || "•" } }];
            oParagraphProps["a:buFont"] = [{ "$": { "typeface": paragraph[0].options.typeface || "Arial" } }];
            oParagraphProps["$"].indent = "-285750";
        }
        if(search.getPath(paragraph, [0, "options", "ol"])) {
            oParagraphProps["a:buAutoNum"] = [{ "$": { "type": paragraph[0].options.olChar || "arabicPeriod", "startAt": paragraph[0].options.olStartAt || "1" } }];
            oParagraphProps["$"].indent = "-285750";
        }
        res["a:pPr"] = [oParagraphProps];
        
		for(var i = 0; i<paragraph.length; i++){
			paragraph[i].presentation = oParams.presentation, paragraph[i].slide = oParams.slide;
			res["a:r"].push(this.createRow(paragraph[i]));
		}
		return res;
	},
	/**
	 * @desc: creates a single Row Element inside a paragraph
	 * @param args:
	 *            {Object} containing options for text formatting
	 * @param args.options.lang:
	 *            {String} language setting (i.e.'en-US-)
	 * @param args.options.italic:
	 *            {String} 0:true 1:false
	 * @param args.options.bold:
	 *            {String}  0:true 1:false
	 * @param args.options.underline:
	 *            {String} underline type (sng,dash,dotted...)
	 * @param args.options.size:
	 *            {String} font size in pt
	 * @param args.options.color:
	 *            {String} font color in hex
	 * @param args.options.typeface:
	 *            {String} typeface (i.e.'Arial')
	 * @param args.options.algn:
	 *            {String} l,r,ctr,dist,just ...
     * @param args.options.ul:
	 *            {Boolean} unordered list point
     * @param args.options.ulChar:
	 *            {Boolean} unordered list point character. default is '•'
     * @param args.options.ol:
	 *            {Boolean} ordered list point
     * @param args.options.olType:
	 *            {String} auto numbering list style
     * @param args.options.olStartAt:
	 *            {Integer} auto numbering list start
     * @param args.options.level
	 *            {String} indentation level
	 * @param args.text
	 *            {String} text content
     * @param args.href
	 *            {String} link target
     * @param args.presentation
	 *            {object}
     * @param args.slide
	 *            {object}
	 * 
	 */
	createRow(args){
		if (!args.options){
			args.options={};
		}
		
		oRowProps = {
            "$" : {
                "dirty" : "0"
            }
        };
        if(args.options.lang) oRowProps["$"]["lang"] = args.options.lang;
        if(args.options.dirty) oRowProps["$"]["dirty"] = args.options.dirty;
        if(args.options.italic) oRowProps["$"]["i"] = "1";
        if(args.options.bold) oRowProps["$"]["b"] = "1";
        if(args.options.underline) oRowProps["$"]["u"] = args.options.underline;
        if(args.options.size) oRowProps["$"]["sz"] = args.options.size * 100;
        if(args.options.color) oRowProps["a:solidFill"] = [{
            "a:srgbClr":[{
                "$":{
                    "val":args.options.color
                }
            }]
        }];
        if(args.options.typeface) oRowProps["a:latin"] = [{
            "$":{
                "typeface":args.options.typeface
            }
        }];
        if(args.href) {
            let sRelationId = args.slide.addRel("LINK", { target: args.href, targetMode: "External" });
            oRowProps["a:hlinkClick"] = [{
                "$": {
                    "r:id": sRelationId
                }
            }];
        }
		if (!args.text) args.text="";	
		var res = {
			"a:rPr": [oRowProps],
				"a:t":[
					args.text
				]
		}
		return res;
    }
	
	
}