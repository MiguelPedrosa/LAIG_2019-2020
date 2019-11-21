#version 300 es
precision highp float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;
out vec2 vTextureCoord;
void main() {

	vec4 vertex=vec4(aVertexPosition,1.0);
	gl_Position = vertex;

	vTextureCoord = vec2(aTextureCoord.x, 1.0 - aTextureCoord.y);
}

