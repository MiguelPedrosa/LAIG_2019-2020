#version 300 es
precision highp float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;
out vec4 FragColor;

void main() {
	 
	vec4 color_2 = texture(uSampler, vTextureCoord);

	FragColor = color_2;
}

