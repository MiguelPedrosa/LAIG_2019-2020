/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, primitiveId, innerRadius, outerRadius, slices, loops) {
        super(scene);
        this.slices = slices;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // theta is the inner rotation
        const thetaInc = Math.PI * 2 / this.slices;
        // phi is the outer rotation
        const phiInc = Math.PI * 2 / this.loops;

        for (let loopIter = 0; loopIter <= this.loops; loopIter++) {
            for (let sliceIter = 0; sliceIter <= this.slices; sliceIter++) {
                const theta = sliceIter * thetaInc;
                const phi = loopIter * phiInc;

                const coordX = (this.outerRadius + this.innerRadius * Math.cos(theta)) * Math.cos(phi);
                const coordY = (this.outerRadius + this.innerRadius * Math.cos(theta)) * Math.sin(phi);
                const coordZ = this.innerRadius * Math.sin(theta);

                const normalsX = Math.cos(theta) * Math.cos(phi);
                const normalsY = Math.cos(theta) * Math.sin(phi);
                const normalsZ = Math.sin(phi);

                this.vertices.push(coordX, coordY, coordZ);
                this.normals.push(normalsX, normalsY, normalsZ);
				this.texCoords.push(sliceIter/this.slices, loopIter/this.loops);
            }
        }

        for (let loopIter = 0; loopIter < this.loops; loopIter++) {
            for (let sliceIter = 0; sliceIter < this.slices; sliceIter++) {
                // Dots are stored in their own variable since some of them
                // are reused and gives a better perspective on how
                // the indices are pushed to the array
                let dot1 = (this.slices + 1) * (loopIter + 0) + sliceIter;
                let dot2 = (this.slices + 1) * (loopIter + 0) + sliceIter + 1;
                let dot3 = (this.slices + 1) * (loopIter + 1) + sliceIter;
                let dot4 = (this.slices + 1) * (loopIter + 1) + sliceIter + 1;

                this.indices.push(
                    dot1, dot3, dot2,
                    dot2, dot3, dot4
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    modifyTextCoords(lengthS, lengthT) {
	}
}