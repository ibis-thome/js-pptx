
/**
 * 
 * @param {object} oArgs 
 * @param {string} oArgs.authorId
 * @param {string} oArgs.created
 * @param {string} oArgs.commentIndex
 * @param {object} oArgs.position
 * @param {number} oArgs.position.x
 * @param {number} oArgs.position.y
 * @param {string} oArgs.text
 */
var Comment = function (oArgs) {
	var oPosition = oArgs.position;
	var iMultiplier;
	//convert mesaure units to "EighthPointMeasure" -> ISO/IEC-29500:2008. Undocumented by Microsoft
	switch (oPosition.type) {
		case "cm":
			iMultiplier = 576 * 0.394
			break;
		case "point":
			iMultiplier = 0.125
			break;
		//default is inch
		default:
			iMultiplier = 576;
			break;
	}
	//take comment width and height into account
	oPosition.x = oPosition.x - 1;
	oPosition.y = oPosition.y - 0.5;
	this.content = {
		"$": {
			"authorId": oArgs.authorId,
			"dt": oArgs.created || "",
			"idx": oArgs.commentIndex || "1"
		},
		"p:pos": {
			"$": {
				"x": Math.floor(oPosition.x * iMultiplier),
				"y": Math.floor(oPosition.y * iMultiplier)
			}
		},
		"p:text": oArgs.text || ""
	};
};

Comment.prototype.getContent = function() {
	return this.content;
}

module.exports = Comment;
