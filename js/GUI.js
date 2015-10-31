var GUI = function(config) {
	this.config = config;
	this.context = UI_canvas.getContext('2d');
	this.currentFont = "fantasy, Impact, Georgia";

	this.scoreY = 0.06;
	this.hintY = 0.2;
	this.titleY = 0.1;
	this.fontHeight = 0.05;
	this.titleBottomTextY = 0.9;
	this.scoreDeadHeight = 0.08;
	this.scoreDeadY = 0.45;
	this.highscore_y = 0.65;
	
	this.isEatHintShowed = false;
	this.yum_msg = [ "Delicious!", "Sweet!", "Tasty!" ];

	UI_canvas.width = window.innerWidth;
	UI_canvas.height = window.innerHeight;

	this.healthCircle = {
		x: -0.42, //screenPercent from middle
		y: 0.01, //screenPercent from bottom
		radius: 0.06, //screenWidthPercent
		innerColor: "red",
		outterColor: "black",
		fillPercent: 1
	}
	this.drugCircle = {
		x: 0.42,
		y: 0.01,
		radius: 0.06,
		innerColor: '',
		outterColor: "black",
		fillPercent: 0
	}
	this.drugCircle.innerColor = this.createRainbowGradient(this.drugCircle.x, this.drugCircle.y, this.drugCircle.radius);
}

GUI.prototype.createRainbowGradient = function (x, y, radius) {
	var radius = radius*window.innerWidth | 0;
	var centerX = window.innerWidth/2 + window.innerWidth*x | 0;
	var centerY = window.innerHeight - window.innerHeight*y - radius | 0;

	var rainbowGradient = this.context.createLinearGradient(centerX, centerY + radius, centerX, centerY - radius);
	rainbowGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
	rainbowGradient.addColorStop(0.15, 'rgba(255, 0, 255, 1)');
	rainbowGradient.addColorStop(0.33, 'rgba(0, 0, 255, 1)');
	rainbowGradient.addColorStop(0.49, 'rgba(0, 255, 255, 1)');
	rainbowGradient.addColorStop(0.67, 'rgba(0, 255, 0, 1)');
	rainbowGradient.addColorStop(0.84, 'rgba(255, 255, 0, 1)');
	rainbowGradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

	return rainbowGradient;
}

GUI.prototype.inGameGUI = function() {
	this.context.font = 0.05 * window.innerHeight +"px " + this.currentFont;
	this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	gunsight.style.visibility = "visible"; //html div

	this.drawCircle('healthCircle', this.config.player.hp / this.config.player.hp_max || 1);
	this.drawCircle('drugCircle', this.config.drug.drug_ratio || 0);
	this.drawScore(this.config.score);
}

GUI.prototype.drawCircle = function(circleName, newPercent) {
	this[circleName].fillPercent = newPercent;

	var radius = this[circleName].radius*window.innerWidth | 0;
	var centerX = window.innerWidth/2 + window.innerWidth*this[circleName].x | 0;
	var centerY = window.innerHeight - window.innerHeight*this[circleName].y - radius | 0;
	var amount = radius*2*this[circleName].fillPercent;

	this.context.clearRect(centerX - radius, centerY - radius, radius*2, radius*2);
	this.context.save();

	this.context.beginPath();
	this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	this.context.clip(); 
	this.context.fillStyle = this[circleName].innerColor;
	this.context.fillRect(centerX - radius, centerY + radius, radius * 2, -amount);

	this.context.beginPath();
	this.context.strokeStyle = 'black';
	this.context.lineWidth = 5;
	this.context.shadowBlur = 30;
	this.context.shadowColor = 'black';
	this.context.shadowOffsetX = 9;
	this.context.shadowOffsetY = -9;
	this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	this.context.stroke();

	this.context.restore(); // reset clipping region

	this.context.beginPath();
	this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	this.context.lineWidth = 0;
	this.context.strokeStyle = this[circleName].outterColor;
	this.context.stroke();
}

GUI.prototype.drawScore = function (overrideScore, overrideSize, overrideX, overrideY, draw_highscore) {
	if(overrideSize) {
		this.context.font = overrideSize*window.innerHeight + "px " + this.currentFont;
	}
	var score = overrideScore || this.config.score;
	var string = (draw_highscore ? "Score: " : "") + score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); // espace les nombres (merci stackoverflow)
	var x = overrideX * window.innerWidth || (window.innerWidth - this.context.measureText(string).width) >> 1;
	var y = overrideY * window.innerHeight || this.scoreY * window.innerHeight | 0;
	this.context.clearRect(0, (y-this.fontHeight* window.innerHeight | 0), window.innerWidth, (this.fontHeight* 2* window.innerHeight | 0));

	this.context.fillText(string, x, y);

	if (draw_highscore) {
		string = "High score: " + this.config.highscore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		this.context.fillText(string, (window.innerWidth - this.context.measureText(string).width) >> 1, this.highscore_y * window.innerHeight);
	}
}

GUI.prototype.drawEatHint = function() {
	var msg = this.yum_msg[Math.random() * this.yum_msg.length | 0];
	this.isEatHintShowed = true;
	this.context.fillText(msg, (window.innerWidth - this.context.measureText(msg).width) >> 1, this.hintY * window.innerHeight);
}
GUI.prototype.clearEatHint = function() {
	this.isEatHintShowed = false;
	this.context.clearRect(0, this.hintY * window.innerHeight - this.fontHeight * window.innerHeight, window.innerWidth, this.fontHeight * window.innerHeight * 1.1);
}

GUI.prototype.drawTitleScreen = function(overRideText) {
	this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	this.context.drawImage(this.config.imgs.title, window.innerWidth/2 - this.config.imgs.title.naturalWidth/2, window.innerHeight * this.titleY - this.config.imgs.title.naturalHeight/2);

	this.context.font = this.fontHeight/2 * window.innerHeight +"px " + this.currentFont;
	var string = overRideText || 'Click to play!';
	this.context.fillText(string, (window.innerWidth/2 - this.context.measureText(string).width/2 | 0), (window.innerHeight * this.titleBottomTextY | 0));
}

GUI.prototype.drawDeadScreen = function() {
	this.drawTitleScreen("Click to respawn!");
	this.drawScore(null, this.scoreDeadHeight, false, this.scoreDeadY, true);
}
