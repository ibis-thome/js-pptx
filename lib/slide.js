var Shape = require('./shape');
var Chart = require('./chart');
var Img = require('./img');
var Search = require('./util/search');
var Text = require('./text');
var Table = require('./table');
var clone = require('./util/clone');
var CommentsFragment = require('./fragments/js/commentsFragment');
var Comment = require('./comment');
const Connector = require('./connector');

// ======================================================================================================================
// Slide
// ======================================================================================================================

var Slide = function (args) {
	this.content = args.content;
	this.presentation = args.presentation;
	this.name = args.name;

	// TODO: Validate arguments
};

Slide.relationshipTypes = {
	"IMAGE": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
	"LINK": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
	"COMMENTS": "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments"
};

Slide.prototype.getShapes = function () {

	// TODO break out getShapeTree
	return this.content["p:sld"]["p:cSld"][0]["p:spTree"][0]['p:sp'].map(function (sp) {
		return new Shape(sp);
	});
};

/**
 * @desc retrieves a shape by name being part of this slide
 * @param {string} sName - the shape name
 * @returns {object} shape object
 */
Slide.prototype.getShapeByName = function (sName) {
    let oShapeElement = this._getShapeElementByName(sName);
    return new Shape(oShapeElement);
};

/**
 * @desc retrieves a shape by name being part of this slide
 * @param {string} sName - the shape name
 * @returns {object} shape element
 */
Slide.prototype._getShapeElementByName = function (sName) {
	return this.content["p:sld"]["p:cSld"][0]["p:spTree"][0]['p:sp'].find(sp => Search.getPath(sp, ["p:nvSpPr", 0, "p:cNvPr", 0, "$", "name"]) === sName);
};

/**
 * @desc add relationship node to the slides relationship definition
 * @param {string} type
 * @param {object} options
 * @param {string} options.target
 * @param {string} options.targetMode
 * 
 */
Slide.prototype.addRel = function (type, options) {
	var rels = this.getRelations();
	var numRels = rels.length;
	var rId = "rId" + (numRels + 1);
	var oRelation = {
		"$" : {
			"Id" : rId,
			"Type" : Slide.relationshipTypes[type],
			"Target" : options.target
		}
	};
	if(options.targetMode) {
		oRelation["$"]["TargetMode"] = options.targetMode;
	}
	rels.push(oRelation);
	return rId;
};

Slide.prototype.addChart = function (data, done) {
	var self = this;
	var chartName = "chart" + (this.presentation.getChartCount() + 1);
	var chart = new Chart({
		slide : this,
		presentation : this.presentation,
		name : chartName
	});
	var slideName = this.name;

	chart.load(data, function (err, data) { // TODO pass it real data
		self.content["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:graphicFrame"] = chart.content; // jsChartFrame["p:graphicFrame"];

		// Add entry to slide1.xml.rels
		// There should a slide-level and/or presentation-level
		// method to add/track
		// rels
		var rels = self.presentation.content['ppt/slides/_rels/' + slideName + '.xml.rels'];
		var numRels = rels["Relationships"]["Relationship"].length;
		var rId = "rId" + (numRels + 1);
		numRels = rels["Relationships"]["Relationship"].push({
			"$" : {
				"Id" : rId,
				"Type" : "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
				"Target" : "../charts/" + chartName + ".xml"
			}
		});
		done(null, self);
	});
};

/**
 * @param {string} sName
 */
Slide.prototype.addConnection = function (sName) {
    var oConnector = new Connector();
    //apply theme default settings
    let oConnectorShapeDefaults = Search.getPath(this.presentation.content, ["ppt/theme/theme1.xml", "a:theme", "a:objectDefaults", 0, "a:lnDef", 0, "a:spPr", 0]);
    oConnectorShapeDefaults && oConnector.shapeProperties(oConnectorShapeDefaults);
    oConnector.id(this.getId());
    oConnector.name(sName);
    if(!this.content["p:sld"]["p:cSld"][0]["p:spTree"][0]['p:cxnSp']) this.content["p:sld"]["p:cSld"][0]["p:spTree"][0]['p:cxnSp'] = [];
	this.content["p:sld"]["p:cSld"][0]["p:spTree"][0]['p:cxnSp'].push(oConnector.content);
	return oConnector;
};

/**
 * @param {string} sName
 */
Slide.prototype.addShape = function (sName) {
    var oShape = new Shape();
    //apply theme default settings
    let oShapeDefaults = Search.getPath(this.presentation.content, ["ppt/theme/theme1.xml", "a:theme", "a:objectDefaults", 0, "a:spDef", 0, "a:spPr", 0]);
    oShapeDefaults && oShape.shapeProperties(oShapeDefaults);
    oShape.id(this.getId());
    oShape.name(sName);
	this.content["p:sld"]["p:cSld"][0]["p:spTree"][0]['p:sp'].push(oShape.content);
	return oShape;
};

Slide.prototype.getId = function () {
	var slideContent = this.content["p:sld"]["p:cSld"][0]["p:spTree"][0];
	var id = Search.countElements(slideContent, true);
	while (!Search.checkId(id, slideContent)) {
		id++;
	}
	return id;
};

/**
 * @desc adds a new image to a Slide
 * @param {object} oParams
 * @param {object} oParams.position
 * @param {string} oParams.position.x horizontal location
 * @param {string} oParams.position.y vertical location
 * @param {string} oParams.position.w
 * @param {string} oParams.position.h
 * @param {string} oParams.position.type Measuring unit (cm, inch or point)
 * @param {*} oParams.data Base64 string containing the image Data or Binary Buffer
 * @param {boolean} oParams.base64 indicating whether image data is an base64 string or a binary buffer
 * @param {string} oParams.link
 */
Slide.prototype.addImg = function (oParams) {

	var img = new Img({
		slide : this,
		presentation : this.presentation,
		data : oParams.data,
        position : oParams.position,
        base64: oParams.base64,
		link: oParams.link
	});

	return img;
};

/**
 * @desc adds a new Table to a Slide
 * @param args:
 *            {object} containing options for new Table (see table.js for
 *            detailed description)
 * @param args.position:
 *            {object} containing position coordinates: x: horizontal location,
 *            y: vertical location, w: width, h: height, type: Measuring unit
 *            (cm, inch or point)
 */
Slide.prototype.addTable = function (args) {
	args.slide = this;
	var table = new Table(args);
	table.addTable();
}

/**
 * @desc adds a comment to the current slide
 * @param {object} oComment
 * @param {string} oComment.author
 * @param {string} [oComment.authorInitials]
 * @param {string} [oComment.created] timestamp of creation
 * @param {string} oComment.text
 * @param {object} oComment.position
 * @param {string} oComment.position.x
 * @param {string} oComment.position.y
 * @returns {object} Slide
 */
Slide.prototype.addComment = function(oComment) {
	if(!oComment.author) {
		throw new Error("Author must be given");
	}
	if(!this.presentation.getCommentAuthors().length === 0 && !oComment.author) {
		throw new Error("No authors existing yet. Author must be given.");
	}
	//check if author with the same name is already existing
	var aAuthors = this.presentation.getCommentAuthors();
	var oAuthor = aAuthors.find(oAuthor => {
		return oAuthor["$"] && oAuthor["$"]["name"] === oComment.author;
	});
	if(oAuthor) oComment.authorId = oAuthor["$"]["id"];
	//create author first if necessary
	var sAuthorId = !isNaN(oComment.authorId) ? oComment.authorId : this.presentation.addCommentAuthor({
		name: oComment.author,
		initials: oComment.authorInitials
	});
	//add comment
	var iSlideIndex = this.presentation.getSlideIndex(this.name);
	var sCommentsPath = "ppt/comments/comment" + iSlideIndex + ".xml";
	if(!this.presentation.content[sCommentsPath]) {
		this.presentation.content[sCommentsPath] = clone(CommentsFragment);
		//register globally
		this.presentation.content["[Content_Types].xml"]["Types"]["Override"]
			.push({
				"$" : {
					"PartName" : "/" + sCommentsPath,
					"ContentType" : "application/vnd.openxmlformats-officedocument.presentationml.comments+xml"
				}
		});
	}
	var aComments = this.presentation.content[sCommentsPath]["p:cmLst"]["p:cm"];
	//separate index counting for each author
	var aAuthorComments = aComments.filter(oComment => oComment["$"]["authorId"] === sAuthorId);
	var sCommentIndex = aAuthorComments.length + 1;
	aComments.push(new Comment({
		authorId: sAuthorId,
		created: oComment.created,
		commentIndex: sCommentIndex,
		position: oComment.position,
		text: oComment.text
	}).getContent());
	//update last comment index for author
	oAuthor = this.presentation.getAuthorById(sAuthorId);
	if(oAuthor) oAuthor["$"]["lastIdx"] = sCommentIndex;

	//add relationship to slide
	var sRelationTarget = "../comments/comment" + iSlideIndex + ".xml";
	if(!this.getRelations() || !this.getRelations().find(oRelation => oRelation["$"]["Target"] === sRelationTarget)) {
		this.addRel("COMMENTS", { target: sRelationTarget });
	}

	return this;
};

Slide.prototype.getRelations = function() {
	return this.presentation.content['ppt/slides/_rels/' + this.name + '.xml.rels']["Relationships"]["Relationship"];
};

module.exports = Slide;