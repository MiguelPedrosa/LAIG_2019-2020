class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.midSquares = [];
        for (var i = 0; i < 9; i++) {
            this.midSquares.push(new MyGameSquare(scene, i));
        }
    }
    display() {
        this.scene.pushMatrix();
        for (var i = 1; i <= this.midSquares.length; i++) {
            this.midSquares[i - 1].display();
            this.scene.translate(1.5 * 3 + 2, 1.5 * 3, 0);
            if (i % 3 == 0) {
                this.scene.translate(-(1.5 * 3 + 2) * 3, -1.5 * 3 - 2, 0);
            }
        }
        this.scene.popMatrix();

    }
    modifyTextCoords(lengthS, lengthT) {}
}