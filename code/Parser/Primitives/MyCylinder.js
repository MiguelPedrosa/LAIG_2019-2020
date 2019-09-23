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

                this.indices.push(i + this.slices*sIter, i + 1+ this.slices*sIter, i + this.slices*(sIter+1));
                this.indices.push(i + 1+ this.slices*sIter, i + 1 + this.slices*(sIter+1), i + this.slices*(sIter+1));

                this.normals.push(Math.cos(ang), sIter * stackHeight, -Math.sin(ang));
                this.texCoords.push(i / this.slices, 1);
            }
        }
        console.log(this.indices);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}