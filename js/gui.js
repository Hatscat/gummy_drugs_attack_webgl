function drawCircle(circleConfig) {

	var radius = circleConfig.radius*window.innerWidth | 0;
	var centerX = window.innerWidth/2 + window.innerWidth*circleConfig.x | 0;
	var centerY = window.innerHeight - window.innerHeight*circleConfig.y - radius | 0;
	var amount = radius*2*circleConfig.fillPercent;

	context.save();

	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.clip(); 
	if(circleConfig.innerColor == "rainbow") {
		grd = context.createLinearGradient(centerX, centerY + radius, centerX, centerY - radius);
		grd.addColorStop(0, 'rgba(255, 0, 0, 1)');
		grd.addColorStop(0.15, 'rgba(255, 0, 255, 1)');
		grd.addColorStop(0.33, 'rgba(0, 0, 255, 1)');
		grd.addColorStop(0.49, 'rgba(0, 255, 255, 1)');
		grd.addColorStop(0.67, 'rgba(0, 255, 0, 1)');
		grd.addColorStop(0.84, 'rgba(255, 255, 0, 1)');
		grd.addColorStop(1, 'rgba(255, 0, 0, 1)');
		context.fillStyle = grd;
	}
	else {
		context.fillStyle = circleConfig.innerColor;
	}
	context.fillRect(centerX - radius, centerY + radius, radius * 2, -amount);

	context.beginPath();
	context.strokeStyle = 'black';
	context.lineWidth = 5;
	context.shadowBlur = 30;
	context.shadowColor = 'black';
	context.shadowOffsetX = 9;
	context.shadowOffsetY = -9;
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.stroke();

	context.restore(); // reset clipping region

	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.lineWidth = 0;
	context.strokeStyle = circleConfig.outterColor;
	context.stroke();
}