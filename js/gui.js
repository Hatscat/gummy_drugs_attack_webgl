function drawCircle(circleConfig) {

	var radius = circleConfig.radius*window.innerWidth | 0;
	var centerX = window.innerWidth/2 + window.innerWidth*circleConfig.x | 0;
	var centerY = window.innerHeight - window.innerHeight*circleConfig.y - radius | 0;
	var amount = radius*2*circleConfig.fillPercent;

	context.save();
		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.clip(); 
		context.fillStyle = circleConfig.innerColor;
		context.fillRect(centerX - radius, centerY + radius, radius * 2, -amount);

		context.beginPath();
		context.strokeStyle = 'black';
		context.lineWidth = 5;
		context.shadowBlur = 30;
		context.shadowColor = 'black';
		context.shadowOffsetX = 10;
		context.shadowOffsetY = -10;
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.stroke();
	context.restore(); // reset clipping region
	context.beginPath();

	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.lineWidth = 0;
	context.strokeStyle = circleConfig.outterColor;
	context.stroke();
}