module.exports = {

	types: { "point": 914400/72, "cm": 360000, "inch": 914400 },
	
	inch: function(val) { return Math.floor(val / this.types.inch); },
	point: function(val) { return Math.floor(val / this.types.point); },
	px: function(val) { return Math.floor(val / this.types.point); },
	cm: function(val) { return Math.floor(val / this.types.cm); },
	
	calculateEMU : function(position) {
		var oEMUPosition = JSON.parse(JSON.stringify(position));
		//check if arguments are valid
		var type = oEMUPosition.type;
		if(type && Object.keys(this.types).indexOf(type) < 0) throw new Error("Unkown position measure unit.");
		
		var multiplier = this.types[type] || this.types["inch"];
		
		oEMUPosition.x = isNaN(oEMUPosition.x) ? 0 : Math.floor(oEMUPosition.x * multiplier);
		oEMUPosition.y = isNaN(oEMUPosition.y) ? 0 : Math.floor(oEMUPosition.y * multiplier);
		oEMUPosition.w = isNaN(oEMUPosition.w) ? 0 : Math.floor(oEMUPosition.w * multiplier);
		oEMUPosition.h = isNaN(oEMUPosition.h) ? 0 : Math.floor(oEMUPosition.h * multiplier);

		return oEMUPosition;
	}
	
}