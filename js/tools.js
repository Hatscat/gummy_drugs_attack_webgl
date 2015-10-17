"use strict"

function lerp (from, to, t) {
	return from + (t < 0 ? 0 : t > 1 ? 1 : t) * (to - from);
}

function sign (n) {
	return n < 0 ? -1 : 1;
}

function dist_3d_sqrt (a, b) {
	return (a.x-b.x) * (a.x-b.x) + (a.y-b.y) * (a.y-b.y) + (a.z-b.z) * (a.z-b.z);
}

