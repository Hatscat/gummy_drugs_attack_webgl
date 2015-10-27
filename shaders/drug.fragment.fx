#define P_SPEED_X 2.3963473381008953
#define P_SPEED_Y 1.3373457256238908
#define DEF_SPEED_X 2.372859517345205
#define DEF_SPEED_Y 3.276329489191994
#define MIX_SPEED_X 1.452705320669338
#define MIX_SPEED_Y 1.7018815474584699
#define RED_SPEED 1.420442107133567
#define GREEN_SPEED 2.209929798357189
#define BLUE_SPEED 1.872767300810665

#define DEF_MOV 0.4
#define DEF_COEF 2.5
#define MIX_COEF 0.2
#define COLOR_COEF 2.0

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;

uniform vec2 resolution;
uniform float time;
uniform float drug_lvl;

void main (void)
{
	float drug_lvl_root = sqrt(drug_lvl);
	float drug_lvl_2 = drug_lvl * drug_lvl;
	float drug_lvl_3 = drug_lvl_2 * drug_lvl;

	vec2 uv = vUV;

	// centre de deformation
	vec2 p = vec2(0.5 + cos(time * P_SPEED_X) * DEF_MOV * drug_lvl_2, 0.5 + sin(time * P_SPEED_Y) * DEF_MOV * drug_lvl_2);

	// deformations
	float def_x = mix(1., pow(uv.x, DEF_COEF * drug_lvl_root), (p.x - uv.x) * sin(time * DEF_SPEED_X));
	float def_y = mix(1., pow(uv.y, DEF_COEF * drug_lvl_root), (p.y - uv.y) * cos(time * DEF_SPEED_Y));
	uv.x *= mix(def_x, def_y, sin(time * MIX_SPEED_X) * MIX_COEF * drug_lvl_3);
	uv.y *= mix(def_y, def_x, cos(time * MIX_SPEED_Y) * MIX_COEF * drug_lvl_3);

	vec4 tex = texture2D(textureSampler, uv);

	// couleurs
	tex.r *= mix(1., pow(tex.r, COLOR_COEF * drug_lvl), sin(time * RED_SPEED));
	tex.g *= mix(1., pow(tex.g, COLOR_COEF * drug_lvl), cos(time * GREEN_SPEED));
	tex.b *= mix(1., pow(tex.b, COLOR_COEF * drug_lvl), sin(time * BLUE_SPEED));

	//gl_FragColor = mix(tex, vec4(0., 1., 0., 1.), step(length(p - uv), .1)); // pour visualiser le centre de deformation
	gl_FragColor = tex;
}

