/**
 * MyCylinder
 * @constructor
 */

class MyCylinder extends CGFobject {
    constructor(scene, primitiveId, base, top, height, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.base = base;
        this.top = top;
        this.height = height;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
 
        const angRotationIncrement = 2 * Math.PI / this.slices;
        const stackHeight = this.height / this.stacks;
        const radiusIncrement = (this.top - this.base) / this.stacks;
        const normalZ = (this.top - this.base) / this.height;

        for (let stackIter = 0; stackIter <= this.stacks; stackIter++) {
            for (let sliceIter = 0; sliceIter <= this.slices; sliceIter++) {
                const angRot = angRotationIncrement * sliceIter;
                const normalX = Math.cos(angRot);
                const normalY = -Math.sin(angRot);
                const currentRadius = this.base + radiusIncrement * stackIter;

                this.vertices.push(
                    normalX * currentRadius,
                    normalY * currentRadius,
                    stackIter * stackHeight);

                // Vetor não esta normalizado
                this.normals.push(normalX, normalY, normalZ);
                this.texCoords.push(stackIter/this.stacks, 1 - sliceIter/this.slices);
            }
        }

        for (let sliceIter = 0; sliceIter < this.slices; sliceIter++) {
            for (let stackIter = 0; stackIter < this.stacks; stackIter++) {
                // Dots are stored in their own variable since some of them
                // are reused and gives a better perspective on how
                // the indices are pushed to the array
                let dot1 = (this.slices +1) * (stackIter +0) + sliceIter +0;
                let dot2 = (this.slices +1) * (stackIter +0) + sliceIter +1;
                let dot3 = (this.slices +1) * (stackIter +1) + sliceIter +0;
                let dot4 = (this.slices +1) * (stackIter +1) + sliceIter +1;

                this.indices.push(
                    dot1, dot3, dot2,
                    dot2, dot3, dot4
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}