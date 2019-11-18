#version 300 es
precision highp float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;
out vec4 FragColor;


/*trigonometria ------
uniform timeFactor;
*/

void main() {
	 
	vec4 color_2 = texture(uSampler, vTextureCoord);
	float dis = distance(vTextureCoord, vec2(0.5,0.5));
	float lel = smoothstep(0.9,0.2,dis);
	FragColor = vec4(color_2.xyz*lel,1.0);
}

