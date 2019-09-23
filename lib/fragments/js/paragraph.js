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
			var res=[];
			var paragraph=[]
			paragraph.push(aText);
			res.push(paragraph);
			return res;
		}
		
		// Create an array entry for every newLine
		var aParagraphs=[];
		var curr=[];
		for (var i=0; i<aText.length; i++){
			curr.push(aText[i]);
			if (aText[i].options && aText[i].options.breakLine=="1"){
				aParagraphs.push(curr);
				curr=[];
				
			}
			
		}
		if (curr.length!=0){
			aParagraphs.push(curr);
		}
		return aParagraphs;
	},
	/**
	 * @desc: creates new Paragrpahs
	 * @param {Object|Array}textContent:
	 *            Text input from user. Either an Object if only single text
	 *            line (args.text+args.options) or an array of object if
	 *            multiple lines
	 * 
	 * 
	 */		
	createNewParagraphs(textContent){
		var paragraphs=this.formatParagraphs(textContent);
		var res =[];
		for (var i=0; i<paragraphs.length; i++){
			res[i]=this.createSingleParagraph(paragraphs[i]);
			
		}
		return res;
		
	},
	/**
	 * @desc: creates a single Paragraph
	 * @param paragraph:
	 *            {Array} containing Text with different Format. For each
	 *            entry create a new a:r element with according formats
	 */
	createSingleParagraph(paragraph){
		var res = {
				"a:pPr":[],
				"a:r":[
					
				]
        };
        if (search.getPath(paragraph, [0, "options", "algn"])) search.createPath(res, ["a:pPr", "$"]).algn = paragraph[0].options.algn;
        if (search.getPath(paragraph, [0, "options", "algn"])) search.createPath(res, ["a:pPr", "$"]).lvl = paragraph[0].options.level;
	
		for(var i = 0; i<paragraph.length; i++){
						
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
	 * @param args.text
	 *            {String} text content
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