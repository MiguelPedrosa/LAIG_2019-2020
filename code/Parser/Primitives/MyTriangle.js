/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param dot1 - First dot compoused of x, y and z variables
 * @param dot2 - Secound dot compoused of x, y and z variables
 * @param dot3 - Third dot compoused of x, y and z variables
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, dot1, dot2, dot3) {
		super(scene);
        this.dot1 = dot1;
        this.dot2 = dot2;
        this.dot3 = dot3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
            this.dot1.x, this.dot1.y, this.dot1.z, // Vertex 0
            this.dot2.x, this.dot2.y, this.dot2.z, // Vertex 1
            this.dot3.x, this.dot3.y, this.dot3.z  // Vertex 2
        ];

		/* Counter-clockwise reference of vertices */
		this.indices = [
			0, 1, 2
		];

		/* Normals' calcutations*/
		let vector1 = [
			this.dot2.x - this.dot1.x, 
			this.dot2.y - this.dot1.y,
			this.dot2.z - this.dot1.z
		];
		let vector2 = [
			this.dot3.x - this.dot1.x,
			this.dot3.y - this.dot1.y,
			this.dot3.z - this.dot1.z
		];

		let normalX = vector1[1] * vector2[2] - vector1[2] * vector2[1];
		let normalY = vector1[2] * vector2[0] - vector1[0] * vector2[2];
		let normalZ = vector1[0] * vector2[1] - vector1[1] * vector2[0];

		this.normals = [
			normalX, normalY, normalZ,
			normalX, normalY, normalZ,
			normalX, normalY, normalZ
		]
		
		// Texture coordenates
		this.texCoords = [
			0, 1,
			1, 1,
			0.5, 0,
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}