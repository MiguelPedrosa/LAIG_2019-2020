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
        // Display front SemiSphere
        this.sphereFront.display();
        
        // Display back SemiSphere
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.sphereBack.display();
        this.scene.popMatrix();
    }

}