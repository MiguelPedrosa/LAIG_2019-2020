/**
 * MyCylinder
 * @constructor
 */

class MyCylinder extends CGFobject {
    constructor(scene, primitiveId, base, top, height, slices, stacks) {
        super(scene)
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

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var stackHeight = this.height / this.stacks;
        var radiousIncrement = (this.top - this.base) / this.stacks;

        for (var stackIter = 0; stackIter < this.stacks; stackIter++) {
            for (var sliceIter = 0; sliceIter < this.slices; sliceIter++, ang += alphaAng) {
                this.vertices.push(
                    Math.cos(ang) * (this.base + radiousIncrement * stackIter),
                    -Math.sin(ang) * (this.base + radiousIncrement * stackIter),
                    stackIter * stackHeight
                );

                this.indices.push(
                    sliceIter + this.slices * stackIter, 
                    sliceIter + this.slices * (stackIter + 1),
                    sliceIter + this.slices * stackIter + 1 + (sliceIter + 1 == this.slices ? - this.slices : 0)
                );
                this.indices.push(
                    sliceIter + this.slices * (stackIter + 1) + 1 + (sliceIter + 1 == this.slices ? - this.slices : 0), 
                    sliceIter + this.slices * stackIter + 1 + (sliceIter + 1 == this.slices ? - this.slices : 0),
                    sliceIter + this.slices * (stackIter + 1)
                );

                this.normals.push(
                    Math.cos(ang), 
                    stackIter * stackHeight,
                    -Math.sin(ang)
                );

//                this.texCoords.push(sliceIter / this.slices, 1);
            }
        }

        // Add top-most vertices
        for (var sliceIter = 0; sliceIter < this.slices; sliceIter++, ang += alphaAng) {
            this.vertices.push(
                Math.cos(ang) * this.top,
                -Math.sin(ang) * this.top,
                stackIter * stackHeight
            );
        }

        console.log("Indices = " + this.indices.length);
        console.log("Vertices = " + this.vertices.length);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}