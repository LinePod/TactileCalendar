var bump = {
  draw: function(context, size) {
	var l = size/2;
	context.moveTo(0,-l);
	context.lineTo(0,-6);
    context.lineTo(6,0);
    context.lineTo(0,6);
	context.lineTo(0,l);
  }
}

var dot = {
	draw: function(context, size) {
		context.moveTo(-1,0);
		context.lineTo(0,1);
		context.lineTo(1,0);
		context.lineTo(0,-1);
		context.closePath();
	}
}

var miniPlateau = {
	draw: function(context, size) {
		context.moveTo(-3,-3);
		context.lineTo(-3,3);
		context.moveTo(-2,-3);
		context.lineTo(-2,3);
		context.moveTo(-1,-3);
		context.lineTo(-1,3);
		context.moveTo(0,-3);
		context.lineTo(0,3);
		context.moveTo(1,-3);
		context.lineTo(1,3);
		context.moveTo(2,-3);
		context.lineTo(2,3);
		context.moveTo(3,-3);
		context.lineTo(3,3);
	}
}

var empty = {
	draw : function(context, size){;}
}
