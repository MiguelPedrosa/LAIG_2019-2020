class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);

        this.midSquares = [];
        this.number0 = new Number(scene, 0.6, 0.2, [true, true, true, true, true, false, true, true]);
        this.number1 = new Number(scene, 0.6, 0.2, [false, false, true, true, false, false, false, false]);
        this.number2 = new Number(scene, 0.6, 0.2, [false, true, true, false, true, true, true, true]);
        this.number3 = new Number(scene, 0.6, 0.2, [false, false, true, true, true, true, true, true]);
        this.number4 = new Number(scene, 0.6, 0.2, [true, false, true, true, false, true, false, true]);
        this.number5 = new Number(scene, 0.6, 0.2, [true, false, false, true, true, true, true, true]);
        this.number6 = new Number(scene, 0.6, 0.2, [true, true, false, true, false, true, true, true]);
        this.number7 = new Number(scene, 0.6, 0.2, [false, false, true, true, true, false, false, true]);
        this.number8 = new Number(scene, 0.6, 0.2, [true, true, true, true, true, true, true, true]);
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
        this.scene.translate(0, -19, 0.2);
        this.number0.display();
        this.scene.translate(2, 0, 0);
        this.number1.display();
        this.scene.translate(2, 0, 0);
        this.number2.display();
        this.scene.translate(2, 0, 0);
        this.number3.display();
        this.scene.translate(2, 0, 0);
        this.number4.display();
        this.scene.translate(2, 0, 0);
        this.number5.display();
        this.scene.translate(2, 0, 0);
        this.number6.display();
        this.scene.translate(2, 0, 0);
        this.number7.display();
        this.scene.translate(2, 0, 0);
        this.number8.display();



    }
    modifyTextCoords(lengthS, lengthT) {}
}