function Map (config) {
	
	this.config = config;
	
	this.cols_nb = config.map_cols_nb;
	this.rows_nb = config.map_rows_nb;
	this.vals_nb = this.cols_nb * this.rows_nb;

	this.values = new Uint16Array(this.vals_nb);

	this.reset();
}

Map.prototype.reset = function () {

	var color_r_0 = Math.random();
	
};

Map.prototype.get_raw_y = function (x, z) {
	
	return 0;
}

Map.prototype.get_smooth_y = function (x, z) {

}

Map.prototype.get_index = function (x, z) {
	
	return 0;
}

Map.prototype.get_coord = function (index) {

}
