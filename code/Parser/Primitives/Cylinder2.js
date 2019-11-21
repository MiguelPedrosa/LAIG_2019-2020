class Cylinder2 extends CGFobject {

    constructor(scene, primitiveId, base, top, height, slices, stacks) {
        super(scene);
        this.scene = scene;

        this.frontHalf = new Cylinder2_half(this.scene, base, top, height, slices /2, stacks);
        this.backHalf  = new Cylinder2_half(this.scene, base, top, height, slices /2, stacks);
    }

    display() {
        this.frontHalf.display();
        
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.backHalf.display();
        this.scene.popMatrix();
    }

    modifyTextCoords(lengthS, lengthT) {
    }
    
}

class Cylinder2_half extends CGFobject {
    constructor(scene, base, top, height, slices, stacks) {
        super(scene);
        this.scene = scene;

        var controlPoints = [
            [ // Topmost ControlPoints
                [-1 * top, height, 0, 1],
                [ 0, height, 1 * top, 1],
                [ 1 * top, height, 0, 1],
            ],
            [ // Bottom-most ControlPoints
                [-1 * base, 0, 0, 1],
                [ 0, 0, 1 * base, 1],
                [ 1 * base, 0, 0, 1],
            ]
        ];

        var surface = new CGFnurbsSurface(1, 2, controlPoints);

        this.nurb = new CGFnurbsObject(this.scene, slices, stacks, surface);
    }

    display() {
        this.nurb.display();
    }

    modifyTextCoords(lengthS, lengthT) {
    }
}