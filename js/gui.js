function initUI(config) {
	UI_canvas.width = window.innerWidth;
	UI_canvas.height = window.innerHeight;
	window.context = UI_canvas.getContext('2d');
	window.currentFont = "fantasy";
}
function inGameGUI(config) {
	context.font = 0.05 * window.innerHeight +"px " + window.currentFont;
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	gunsight.style.visibility = "visible";
	drawCircle(config.healthCircle);
	drawCircle(config.drugCircle);
	drawScore(0);
}

function drawCircle(circleConfig) {

	var radius = circleConfig.radius*window.innerWidth | 0;
	var centerX = window.innerWidth/2 + window.innerWidth*circleConfig.x | 0;
	var centerY = window.innerHeight - window.innerHeight*circleConfig.y - radius | 0;
	var amount = radius*2*circleConfig.fillPercent;

	context.clearRect(centerX - radius, centerY - radius, radius*2, radius*2);
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

function drawScore(score, overrideSize, overrideX, overrideY) {
	if(overrideSize) {
		context.font = overrideSize*window.innerHeight + "px " + window.currentFont
	}
	context.clearRect(0,0,window.innerWidth, (0.07 * window.innerHeight | 0));

	var string = "Score: " + score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); // espace les nombres (merci stackoverflow)
	var x = overrideX * window.innerWidth || window.innerWidth/2 - context.measureText(string).width/2 | 0;
	var y = overrideY * window.innerHeight || 0.06 * window.innerHeight | 0

	context.fillText(string, x, y);
}

function drawEatHint() {
	var string = 'Press "F"!';
	context.fillText(string, (window.innerWidth/2 - context.measureText(string).width/2 | 0), (0.4 * window.innerHeight | 0));
}
function clearEatHint() {
	context.clearRect(0, 0.4 * window.innerHeight, window.innerWidth, 0.06 * window.innerHeight);
}

function drawTitleScreen(titleImg, overRideText) {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	context.drawImage(titleImg, window.innerWidth/2 - titleImg.naturalWidth/2, window.innerHeight * 0.1 - titleImg.naturalHeight/2);

	context.font = 0.03 * window.innerHeight +"px " + window.currentFont;
	var string = overRideText || 'Click to play!';
	context.fillText(string, (window.innerWidth/2 - context.measureText(string).width/2 | 0), (window.innerHeight * 0.9 | 0));
}

function drawDeadScreen(titleImg, score) {
	drawTitleScreen(titleImg, "Click to respawn!");
	drawScore(score, 0.1, false, 0.45);
}