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

        /*
         * Cilindro feito no eixo dos Y!
         *TO DO: Trocar para eixo dos Z!
         */
        var stackHeight = this.height / this.stacks;
        for (var sIter = 0; sIter <= this.stacks; sIter++) {
            for (var i = 0; i < this.slices; i++, ang += alphaAng) {

                this.vertices.push(Math.cos(ang) * this.base, sIter * stackHeight, -Math.sin(ang) * this.base);
                this.indices.push(i, (i + 1) % this.slices, i + this.slices);
                this.normals.push(Math.cos(ang), sIter * stackHeight, -Math.sin(ang));
                this.texCoords.push(i / this.slices, 1);
            }
        }
        console.log("Total vertices = " + this.vertices.length);

        // ang = 0;
        // var alphaAng = 2 * Math.PI / this.slices;

        // for (var i = 0; i < this.slices; i++) {

        //     this.vertices.push(Math.cos(ang) * top, 1, -Math.sin(ang) * top);
        //     this.indices.push(i + this.slices, i + 1, ((i + 1) % this.slices) + this.slices);
        //     this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
        //     this.texCoords.push(i / this.slices, 0);
        //     ang += alphaAng;
        // }
        this.indices.push(this.slices - 1, 0, this.slices);
        this.indices.push(0, this.slices, this.slices * 2 - 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}