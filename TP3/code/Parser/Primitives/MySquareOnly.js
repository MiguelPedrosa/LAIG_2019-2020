class MySquareOnly extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id;
        this.squareOnly = new MyRectangle(scene, id, -0.5, 0.5, -0.5, 0.5);
    }
    display() {
        this.currentPosition = this.scene.getMatrix();
        this.squareOnly.display();
    }

    getCurrentPosition() {
        return this.currentPosition;
    }

    modifyTextCoords(lengthS, lengthT) {}
}