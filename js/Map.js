"use strict"

function Map (config) {
	
	this.config = config;
	this.side_len = Math.pow(2, this.config.map_side_n) + 1;
	//this.half_side_len = this.side_len >> 1;
	this.vals_nb = this.side_len * this.side_len;
	this.cubes_side_len = this.config.map_visibility_n * 2 + 1;
	this.cubes_nb = this.cubes_side_len * this.cubes_side_len;
	this.y_min  = 0;
	this.y_max  = 0xff;
	this.y_half_max = this.y_max * 0.5;
	this.values = new Uint8ClampedArray(this.vals_nb);
	this.half_cube_size = this.config.cube_size * 0.5;
	this.x0 = (1 - this.side_len) * this.half_cube_size;
	this.z0 = (1 - this.side_len) * this.half_cube_size;

	this.create();
}

Map.prototype.create = function () {

	var top_left = 0;
	var top_right = this.side_len - 1;
	var bot_left = this.side_len * (this.side_len - 1);
	var bot_right = this.side_len * this.side_len - 1;

	//var y_max = this.side_len * this.config.cube_size * 0.3;
	var y_max = this.y_max;
	console.log(y_max)
	this.values[top_left] = Math.random() * y_max;
	this.values[top_right] = 0;
	this.values[bot_left] = y_max;
	this.values[bot_right] = Math.random() * y_max;
	
	//this.diamond_sqrt(top_left, top_right, bot_left, bot_right);
	this.diamond_sqrt(this.side_len);

	var origin_box = BABYLON.Mesh.CreateBox("original", this.config.cube_size, window.scene);
	origin_box.scaling.y = this.y_max / this.config.cube_size;
	origin_box.material = new BABYLON.StandardMaterial("cubeMat", window.scene);
	origin_box.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
	origin_box.material.specularColor = new BABYLON.Color3(0.5, 0, 0);
	origin_box.material.checkReadyOnEveryCall = false;

	//origin_box.material = new BABYLON.ShaderMaterial("ground", scene, "./shaders/ground",
        //{
        //    attributes: ["position", "normal", "uv"],
        //    uniforms: ["world", "worldViewProjection"]
        //});
	
	this.cubes = [];

	for (var i = 0; i < this.cubes_nb; ++i) {
		this.cubes[i] = origin_box.createInstance("box" + i);
	}
	origin_box.setEnabled(false);

	//this.set_all_cubes_pos(0, 0);
	//this.config.ground = BABYLON.Mesh.MergeMeshes(cubes, true);
	//window.scene.createOrUpdateSelectionOctree();



	
	var px_size = innerHeight / this.side_len | 0;
	var canvas = document.createElement("canvas")
	canvas.width = canvas.height = this.side_len * px_size
	var ctx = canvas.getContext("2d")
	//var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	//var buffer = imgData.data

	for (var i = 0; i < this.vals_nb; ++i) {
		
		ctx.fillStyle = 'rgb('+ this.values[i] + ',' + this.values[i] + ',' + this.values[i] + ')';
		ctx.fillRect((i%this.side_len)*px_size, (i/this.side_len|0)*px_size, px_size, px_size)
		//var ii = i << 2;
		//buffer[ii] = this.values[i] < 64 ? 0 : this.values[i]
		//buffer[ii+1] = this.values[i] < 128 ? 0 : this.values[i]
		//buffer[ii+2] = this.values[i] < 196 ? 0 : this.values[i]
		//buffer[ii+3] = 0xff;
	}

	//ctx.putImageData(imgData, 0, 0)
	
	//document.body.appendChild(canvas)

/*
	var buffer = new Uint8ClampedArray(this.vals_nb << 2);

	for (var i = 0; i < this.vals_nb; ++i) {
		
		var ii = i << 2;
		
		buffer[ii] = buffer[ii+1] = buffer[ii+2] = this.values[i];
		buffer[ii+3] = 0xff;

		if (this.values[i] < this.y_min) this.y_min = this.values[i];
		if (this.values[i] > this.y_max) this.y_max = this.values[i];
	}

*/
//	console.log("y min:",this.y_min)
//	console.log("y max:",this.y_max)

	
	/*
	this.config.ground = new BABYLON.GroundMesh("ground", window.scene);

	this.config.ground._subdivisions = 400;
	this.config.ground._setReady(false);

	var vertex_data = BABYLON.VertexData.CreateGroundFromHeightMap(this.side_len * this.config.cube_size, this.side_len * this.config.cube_size, 400, 0, 255, buffer, this.side_len, this.side_len);
	this.config.ground.rotation.y = Math.PI;
	//this.config.ground.rotation.y = -this.config.half_PI;
	vertex_data.applyToMesh(this.config.ground, false);
	this.config.ground._setReady(true);
*/
}

Map.prototype.diamond_sqrt = function (len) {

	if (len === 2) return;
	
	var cols_len = len - 1;
	var half_cols_len = cols_len >> 1;
	var rows_len = this.side_len * cols_len;
	var half_rows_len = rows_len >> 1;
	var subdivs = parseInt(this.side_len / cols_len);
	var sqrts_nb = subdivs * subdivs;
	var noise_len = cols_len * this.config.map_noise_coef;

//	console.log("<<<<<<<<<<<<<<<<<<<<<")
	//console.log(cols_len)
	//console.log(half_cols_len)
//	console.log(rows_len)
 //console.log(half_rows_len)
//	console.log(subdivs)
	//console.log(">>>", sqrts_nb)
//	console.log("---------------------")

	// diamond_step
	for (var i = 0; i < sqrts_nb; ++i) {
		var x0 = i % subdivs;
		var y0 = parseInt(i / subdivs);
		var tl = (x0 + y0 * this.side_len) * cols_len;
		var tr = tl + cols_len;
		var bl = tl + rows_len;
		var br = tr + rows_len;
		var center = tl + half_cols_len + half_rows_len;

	//	console.log("xy:", x0, y0)
	//	console.log(tl, tr, bl, br, center)

		this.values[center] = average(this.values[tl], this.values[tr], this.values[bl], this.values[br]) + get_noise(noise_len);
	}

	// sqrt_step
	for (var i = 0; i < sqrts_nb; ++i) {
		var x0 = i % subdivs;
		var y0 = parseInt(i / subdivs);
		var tl = (x0 + y0 * this.side_len) * cols_len;
		var tr = tl + cols_len;
		var bl = tl + rows_len;
		var br = tr + rows_len;
		var center = tl + half_cols_len + half_rows_len;

		var top = tl + half_cols_len;
		var right = tr + half_rows_len;
		var bot = bl + half_cols_len;
		var left = tl + half_rows_len;

		//console.log(top, right, bot, left)

		var out_top = top - half_rows_len;
		var out_right = right + half_cols_len;
		var out_bot = bot + half_rows_len;
		var out_left = left - half_cols_len;

//			this.values[top] = average(this.values[tl], this.values[tr], this.values[center]) + get_noise_1();
//			this.values[right] = average(this.values[tr], this.values[br], this.values[center]) + get_noise_1();
//			this.values[bot] = average(this.values[bl], this.values[br], this.values[center]) + get_noise_1();
//			this.values[left] = average(this.values[tl], this.values[bl], this.values[center]) + get_noise_1();

		if (!this.values[top]) {
			if (out_top > 0) {
				this.values[top] = average(this.values[tl], this.values[tr], this.values[center], this.values[out_top]) + get_noise(noise_len);
			} else {
				this.values[top] = average(this.values[tl], this.values[tr], this.values[center]) + get_noise(noise_len);
			}
		}
		if (!this.values[right]) {
			if (out_right % this.side_len > right % this.side_len) {
				this.values[right] = average(this.values[tr], this.values[br], this.values[center], this.values[out_right]) + get_noise(noise_len);
				//console.log(right, out_right, this.values[tr], this.values[br], this.values[center], this.values[out_right], this.values[right])
				//if (right==11)
				//console.log(out_right, tr, br, center, "|", this.values[tr], this.values[br], this.values[center], this.values[out_right], "|", this.values[right])
			} else {
				this.values[right] = average(this.values[tr], this.values[br], this.values[center]) + get_noise(noise_len);
			}
		}
		if (!this.values[bot]) {
			if (out_bot < this.vals_nb) {
				this.values[bot] = average(this.values[bl], this.values[br], this.values[center], this.values[out_bot]) + get_noise(noise_len);
				//if (bot==19)console.log(out_bot, bl, br, center, "|", this.values[bl], this.values[br], this.values[center], this.values[out_bot], "|", this.values[bot])
			} else {
				this.values[bot] = average(this.values[bl], this.values[br], this.values[center]) + get_noise(noise_len);
			}
		}
		if (!this.values[left]) {
			if (out_left % this.side_len < left % this.side_len) {
				this.values[left] = average(this.values[tl], this.values[bl], this.values[center], this.values[out_left]) + get_noise(noise_len);
			} else {
				this.values[left] = average(this.values[tl], this.values[bl], this.values[center]) + get_noise(noise_len);
			}
		}

	}
	//console.log("#:", this.values[19])
	this.diamond_sqrt(half_cols_len + 1);
}

//Map.prototype.diamond_sqrt = function (tl, tr, bl, br) {
/*
	var half_cols_len = (tr - tl) >> 1;
	var half_rows_len = this.side_len * half_cols_len; 

	var center = tl + half_rows_len + half_cols_len;
	var top = tl + half_cols_len;
	var right = tr + half_rows_len;
	var bot = bl + half_cols_len;
	var left = tl + half_rows_len;

	var out_top = top - half_rows_len;
	var out_right = right + half_cols_len;
	var out_bot = bot + half_rows_len;
	var out_left = left - half_cols_len;

	this.values[center] = average(this.values[tl], this.values[tr], this.values[bl], this.values[br]) + get_noise_1();

	if (out_top > 0 && this.values[out_top] !== undefined) {
		this.values[top] = average(this.values[tl], this.values[tr], this.values[center], this.values[out_top]) + get_noise_1();
	} else {
		this.values[top] = average(this.values[tl], this.values[tr], this.values[center]) + get_noise_1();
	}
	if (out_right % this.side_len > right % this.side_len && this.values[out_right] !== undefined) {
		this.values[right] = average(this.values[tr], this.values[br], this.values[center], this.values[out_right]) + get_noise_1();
	} else {
		this.values[right] = average(this.values[tr], this.values[br], this.values[center]) + get_noise_1();
	}
	if (out_bot < this.vals_nb && this.values[out_bot] !== undefined) {
		this.values[bot] = average(this.values[bl], this.values[br], this.values[center] + this.values[out_bot]) + get_noise_1();
	} else {
		this.values[bot] = average(this.values[bl], this.values[br], this.values[center]) + get_noise_1();
	}
	if (out_left % this.side_len < left % this.side_len && this.values[out_left] !== undefined) {
		this.values[left] = average(this.values[tl], this.values[bl], this.values[center] + this.values[out_left]) + get_noise_1();
	} else {
		this.values[left] = average(this.values[tl], this.values[bl], this.values[center]) + get_noise_1();
	}

	if (half_cols_len > 1) {
		this.diamond_sqrt(tl, top, left, center);
		this.diamond_sqrt(top, tr, center, right);
		this.diamond_sqrt(left, center, bl, bot);
		this.diamond_sqrt(center, right, bot, br);
	}
*/
//}

/*
Map.prototype.diamond_sqrt_loop = function (tl, tr, bl, br, noise_len) {
	var half_cols_len = (tr - tl) >> 1;
	var half_rows_len = this.side_len * half_cols_len; 

	this.sqrt_step(tl, tr, bl, br, noise_len);
	this.diamond_step(
	
	if (half_cols_len > 2) {
		this.diamond_sqrt_loop(tl, top, left, center);
		this.diamond_sqrt_loop(top, tr, center, right);
		this.diamond_sqrt_loop(left, center, bl, bot);
		this.diamond_sqrt_loop(center, right, bot, br);
	} else {
		this.sqrt_step(tl, tr, bl, br, noise_len);
	}
}

Map.prototype.diamond_step = function (tl, tr, bl, br, noise) {
	this.values[tl + ((tr - tl) >> 1) * (this.side_len + 1)] = average(this.values[tl], this.values[tr], this.values[bl], this.values[br]) + noise;
}

Map.prototype.sqrt_step = function (tl, tr, bl, br, noise) {

	var half_cols_len = (tr - tl) >> 1;
	var half_rows_len = this.side_len * half_cols_len; 
	
	var center = tl + half_rows_len + half_cols_len;
	var top = tl + half_cols_len;
	var right = tr + half_rows_len;
	var bot = bl + half_cols_len;
	var left = tl + half_rows_len;

	var out_top = top - half_rows_len;
	var out_right = right + half_cols_len;
	var out_bot = bot + half_rows_len;
	var out_left = left - half_cols_len;

	if (out_top > 0 && this.values[out_top] !== undefined) {
		this.values[top] = average(this.values[tl], this.values[tr], this.values[center], this.values[out_top]) + noise;
	} else {
		this.values[top] = average(this.values[tl], this.values[tr], this.values[center]) + noise;
	}
	if (out_right % this.side_len > right % this.side_len && this.values[out_right] !== undefined) {
		this.values[right] = average(this.values[tr], this.values[br], this.values[center], this.values[out_right]) + noise;
	} else {
		this.values[right] = average(this.values[tr], this.values[br], this.values[center]) + noise;
	}
	if (out_bot < this.vals_nb && this.values[out_bot] !== undefined) {
		this.values[bot] = average(this.values[bl], this.values[br], this.values[center] + this.values[out_bot]) + noise;
	} else {
		this.values[bot] = average(this.values[bl], this.values[br], this.values[center]) + noise;
	}
	if (out_left % this.side_len < left % this.side_len && this.values[out_left] !== undefined) {
		this.values[left] = average(this.values[tl], this.values[bl], this.values[center] + this.values[out_left]) + noise;
	} else {
		this.values[left] = average(this.values[tl], this.values[bl], this.values[center]) + noise;
	}
}
*/
Map.prototype.set_all_cubes_pos = function (x, z) {
	
	this.moves_x = 0;
	this.moves_z = 0;

	var c0 = this.get_col_from_x(x) - this.config.map_visibility_n;
	var r0 = this.get_row_from_z(z) - this.config.map_visibility_n;

	//console.log(c0, r0)
	//console.log("#############")

	for (var i = 0; i < this.cubes_nb; ++i) {
		
		var col = c0 + i % this.cubes_side_len;
		var row = Math.floor(r0 + i / this.cubes_side_len);
		this.cubes[i].col = col;
		this.cubes[i].row = row;
		
		//console.log(col, row)

		this.cubes[i].position.x = this.x0 + col * this.config.cube_size;
		this.cubes[i].position.z = this.z0 + row * this.config.cube_size;

		//console.log("-------------")
		//console.log(this.cubes[i].position.x, this.cubes[i].position.z)
		//console.log("-------------")

		this.cubes[i].position.y = this.get_raw_y(this.get_index_from_col_row(col, row)) - this.y_half_max;
		//console.log("-------------")
		//console.log(this.cubes[i].position.y)
	}
}


Map.prototype.set_cubes_pos = function (x, z, dir_x, dir_z) {
	
	//console.log(dir_x, dir_z)
	//dir_x = dir_x < -0.5 ? -1 : dir_x > 0.5 ? 1 : 0;
	
	if (dir_x == 1 || dir_x == -1) {
		
		var c = loop_index(dir_x == 1 ? this.moves_x : this.cubes_side_len - 1 + this.moves_x, this.cubes_side_len); 
		//console.log(c)
		var new_col = this.get_col_from_x(x) + this.config.map_visibility_n * dir_x;
		this.moves_x += dir_x;

		for (var i = 0; i < this.cubes_side_len; ++i) {
			var cube_i = i * this.cubes_side_len + c;
			this.cubes[cube_i].col = new_col;
			this.cubes[cube_i].position.x = this.x0 + new_col * this.config.cube_size;
			this.cubes[cube_i].position.y = this.get_raw_y(this.get_index_from_col_row(new_col, this.cubes[cube_i].row)) - this.y_half_max;
		}
	}

	if (dir_z == 1 || dir_z == -1) {

		var r = loop_index(dir_z == 1 ? this.moves_z : this.cubes_side_len - 1 + this.moves_z, this.cubes_side_len) * this.cubes_side_len; 
		//console.log(r)
		var new_row = this.get_row_from_z(z) + this.config.map_visibility_n * dir_z;
		this.moves_z += dir_z;

		for (var i = 0; i < this.cubes_side_len; ++i) {
			var cube_i = i + r;
			this.cubes[cube_i].row = new_row;
			this.cubes[cube_i].position.z = this.z0 + new_row * this.config.cube_size;
			this.cubes[cube_i].position.y = this.get_raw_y(this.get_index_from_col_row(this.cubes[cube_i].col, new_row)) - this.y_half_max;
		}
	}
}

Map.prototype.get_raw_y = function (cell_index) {
	return this.values[cell_index] * this.config.cube_height;
}

/*
Map.prototype.get_smooth_y = function (x, z) {
	return undefined;
}
*/

Map.prototype.get_index_from_xz = function (x, z) {
	return this.get_index_from_col_row(this.get_col_from_x(x), this.get_row_from_z(z));
}

Map.prototype.is_in_map = function (x, z) {
	return x > this.x0 - this.half_cube_size && x < this.half_cube_size - this.x0 && z > this.z0 - this.half_cube_size && z < this.half_cube_size - this.z0;
}

Map.prototype.get_yoyo_axis = function (axis) {
	var max = this.side_len - 1;
	return max - Math.abs( max - Math.abs(axis % (max << 1)) );
}

Map.prototype.get_index_from_col_row = function (col, row) {
	return this.get_yoyo_axis(col) + this.get_yoyo_axis(row) * this.side_len;
}

Map.prototype.get_col_from_index = function (index) {
	return index % this.side_len;
}

Map.prototype.get_row_from_index = function (index) {
	return index / this.side_len | 0;
}

Map.prototype.get_col_from_x = function (x) {
	return Math.floor((x - this.x0 + this.half_cube_size) / this.config.cube_size);
}

Map.prototype.get_row_from_z = function (z) {
	return Math.floor((z - this.z0 + this.half_cube_size) / this.config.cube_size);
}

function loop_index (index, length) {
	return (length + (index % length)) % length;
}

function get_noise_1 () {
	return Math.random() < 0.5 ? 1 : -1;
}

function get_noise (len) {
	return Math.random() * (len + 1) - (len >> 1);
}

function sum () {
	var sum = 0;
	for (var i = arguments.length; i--;) {
		sum += arguments[i];
	}
	return sum;
}

function average () {
	return sum.apply(null, arguments) / arguments.length;
}

