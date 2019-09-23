/**
 * MyPrism
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, slices) {
        super(scene)
        this.slices = slices;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        for (var i = 0; i < this.slices; i++) {

            this.vertices.push(Math.cos(ang), 0, -Math.sin(ang));
            this.indices.push(i, (i + 1) % this.slices, i + this.slices);
            this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.texCoords.push(i/this.slices, 1);
            ang += alphaAng;
        }

        ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        for (var i = 0; i < this.slices; i++) {

            this.vertices.push(Math.cos(ang), 1, -Math.sin(ang));
            this.indices.push(i + this.slices, i + 1, ((i + 1) % this.slices) + this.slices);
            this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.texCoords.push(i/this.slices, 0);
            ang += alphaAng;
        }
        this.indices.push(this.slices - 1, 0, this.slices);
        //this.texCoords.push(1, 0);
        this.indices.push(0, this.slices, this.slices * 2 - 1);
        //this.texCoords.push(1, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

        console.log(this.vertices);
        console.log(this.indices);
        console.log(this.normals);
    }

}