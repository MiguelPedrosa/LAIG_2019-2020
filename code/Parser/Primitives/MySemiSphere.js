/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const phiInc   = Math.PI * 2 / this.slices;
        const thetaInc = Math.PI / 2 / this.stacks;

        for (let sliceIter = 0; sliceIter <= this.slices; sliceIter++) {
            for (let stackIter = 0; stackIter <= this.stacks; stackIter++) {
                // Storing these vectores in their variables alloys us to optimize
                // calculating both the normals and (x, y, z) coordenates
                const theta   = stackIter * thetaInc;
                const phi     = sliceIter * phiInc;
                const normalX = Math.cos(theta) * Math.cos(phi);
                const normalY = Math.cos(theta) * Math.sin(phi);
                const normalZ = Math.sin(theta);

                this.vertices.push(
                    this.radius * normalX,
                    this.radius * normalY,
                    this.radius * normalZ);

                this.normals.push(normalX, normalY, normalZ);
            }
        }

        for (let sliceIter = 0; sliceIter < this.slices; sliceIter++) {
            for (let stackIter = 0; stackIter < this.stacks; stackIter++) {
                // Dots are stored in their own variable since some of them
                // are reused and gives a better perspective on how
                // the indices are pushed to the array
                let dot1 = (sliceIter +1) * (this.stacks +1) + stackIter;
                let dot2 = (sliceIter +0) * (this.stacks +1) + stackIter +1; 
                let dot3 = (sliceIter +0) * (this.stacks +1) + stackIter;
                let dot4 = (sliceIter +1) * (this.stacks +1) + stackIter +1;

                this.indices.push(
                    dot1, dot2, dot3,
                    dot2, dot1, dot4);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}