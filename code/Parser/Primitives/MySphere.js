/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject {
    constructor(scene, primitiveId, radius, slices, stacks) {
        super(scene);
        this.sphereFront = new MySemiSphere(scene, radius, slices, stacks);
        this.sphereBack  = new MySemiSphere(scene, radius, slices, stacks);
        this.initBuffers();
    }

    display() {
        this.sphereFront.display();
    
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.sphereBack.display();
        this.scene.popMatrix();
    }

}