"use strict"

function Map (config) {
	
	this.config = config;
	this.side_len = Math.pow(2, config.map_side_n) + 1;
	//this.half_side_len = this.side_len >> 1;
	this.vals_nb = this.side_len * this.side_len;
	this.y_min  = this.side_len >> 1;
	this.y_max  = this.side_len >> 1;
	this.values = new Int16Array(this.vals_nb);
	//this.values = new Float32Array(this.vals_nb);
	this.x0 = -this.side_len * this.config.cube_size >> 1;
	this.z0 = -this.side_len * this.config.cube_size >> 1;

	this.reset();
}

Map.prototype.reset = function () {

	var color_0 = [Math.random(), Math.random(), Math.random()];
	var color_1 = [Math.random(), Math.random(), Math.random()];
	var specular_0 = [Math.random(), Math.random(), Math.random()];
	var specular_1 = [Math.random(), Math.random(), Math.random()];
	
	var top_left = 0;
	var top_right = this.side_len - 1;
	var bot_left = this.side_len * (this.side_len - 1);
	var bot_right = this.side_len * this.side_len - 1;

	this.values[top_left] = Math.random() * this.side_len;
	this.values[top_right] = Math.random() * this.side_len;
	this.values[bot_left] = Math.random() * this.side_len;
	this.values[bot_right] = Math.random() * this.side_len;
	
	this.diamond_sqrt(top_left, top_right, bot_left, bot_right);

	console.log(this.values)
	
	var origin_box = BABYLON.Mesh.CreateBox("original", this.config.cube_size, window.scene);
	origin_box.scaling.y = this.side_len;
	origin_box.position.x = this.x0;
	origin_box.position.z = this.z0;
	origin_box.position.y = this.values[0];

	for (var i = this.vals_nb; --i;) {
		var clone = origin_box.clone();
		clone.position.x += this._get_col_from_index(i) * this.config.cube_size;
		clone.position.z += this._get_row_from_index(i) * this.config.cube_size;
		clone.position.y = this.values[i];
	}

}


Map.prototype.diamond_sqrt = function (tl, tr, bl, br) {
	
	var half_len = (tr - tl) >> 1;
	
	var center = tl + (this.side_len + 1) * half_len;
	var top = tl + half_len;
	var right = tr + this.side_len * half_len;
	var bot = bl + half_len;
	var left = tl + this.side_len * half_len;

	this.values[center] = ((this.values[tl] + this.values[tr] + this.values[bl] + this.values[br]) >> 2) + get_noise_1();
	this.values[top] = ((this.values[tl] + this.values[tr] + this.values[center]) / 3 | 0) + get_noise_1();
	this.values[right] = ((this.values[tr] + this.values[br] + this.values[center]) / 3 | 0) + get_noise_1();
	this.values[bot] = ((this.values[bl] + this.values[br] + this.values[center]) / 3 | 0) + get_noise_1();
	this.values[left] = ((this.values[tl] + this.values[bl] + this.values[center]) / 3 | 0) + get_noise_1();

	if (half_len > 1) {
		this.diamond_sqrt(tl, top, left, center);
		this.diamond_sqrt(top, tr, center, right);
		this.diamond_sqrt(left, center, bl, bot);
		this.diamond_sqrt(center, right, bot, br);
	}
}

Map.prototype.get_raw_y = function (x, z) {
	return this.values[this._get_index_from_xz(x, z)] + (this.config.cube_size * this.side_len >> 1);
}

/*
Map.prototype.get_smooth_y = function (x, z) {
	return undefined;
}
*/

Map.prototype._get_index_from_xz = function (x, z) {
	return this._get_index_from_col_row(this._get_col_from_x(x), this._get_row_from_z(z));
}

Map.prototype._get_index_from_col_row = function (col, row) {
	return col + row * this.side_len;
}

Map.prototype._get_col_from_index = function (index) {
	return index % this.side_len;
}

Map.prototype._get_row_from_index = function (index) {
	return index / this.side_len | 0;
}

Map.prototype._get_col_from_x = function (x) {
	return (x - this.x0 + this.config.cube_size * 0.5) / this.config.cube_size | 0;
}

Map.prototype._get_row_from_z = function (z) {
	return (z - this.z0 + this.config.cube_size * 0.5) / this.config.cube_size | 0;
}

/* some tools */

function lerp (from, to, t) {
	return from + (t < 0 ? 0 : t > 1 ? 1 : t) * (to - from);
}

function sign (n) {
	return n < 0 ? -1 : 1;
}

function get_noise_1 () {
	return (Math.random() * 2 << 1) - 1;
	//return Math.random() * 0.01;
}
