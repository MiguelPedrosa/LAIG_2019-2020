#version 300 es
precision highp float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;
out vec4 FragColor;
uniform float timeFactor;

void main() {
	 
	vec4 color_2 = texture(uSampler, vTextureCoord);
	vec4 color = texture(uSampler, vTextureCoord);

	float dis = distance(vTextureCoord, vec2(0.5,0.5));
	float lel = smoothstep(0.7,0.2,dis);

	if(mod((vTextureCoord.y + timeFactor)* 60.0, 2.0) > 1.0){
		color = vec4(color.rgb+1.0 ,1.0);
	}

	FragColor = vec4((color_2.xyz*lel) + color.rgb,1.0);
	
}

