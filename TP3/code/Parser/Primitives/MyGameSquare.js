class MyGameSquare extends CGFobject {
    constructor(scene, id) {
        super(scene);
        this.id = id
        this.squares = [];
        for (var i = 0; i < 9; i++) {
            this.squares.push(new MySquareOnly(scene, i + 1));
        }
    }
    display() {
        for (var j = 1; j <= this.squares.length; j++) {
            this.scene.registerForPick(this.id * 9 + this.squares[j - 1].id, this.squares[j - 1]);
            this.squares[j - 1].display();
            this.scene.translate(1.5, 0, 0);
            if (j % 3 == 0) {
                this.scene.translate(-1.5 * 3, -1.5, 0);
            }
        }
        this.scene.clearPickRegistration();
    }
    modifyTextCoords(lengthS, lengthT) {

    }

}