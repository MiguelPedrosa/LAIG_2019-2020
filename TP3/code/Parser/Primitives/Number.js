class Number extends CGFobject {
	constructor(scene, length, width, bools) {
        super(scene);
        this.scene  = scene;

        // Pieces variables/measurements
        this.length = length;
        this.width = width;

        const realWidth = Math.sqrt(Math.pow(this.width, 2)/2);
		this.piece = new MyCylinder(this.scene, null, realWidth, realWidth, this.length, 4, 20);

        this.booleans = bools;
    }

    display() {
        const verticalOffset = this.length - this.width; // Math...
        const horizontalOffset = verticalOffset/2; // More Math
        if(this.booleans[0]) this.drawPiece([-horizontalOffset,  verticalOffset/2], true);
        if(this.booleans[1]) this.drawPiece([-horizontalOffset, -verticalOffset/2], true);
        if(this.booleans[2]) this.drawPiece([ horizontalOffset,  verticalOffset/2], true);
        if(this.booleans[3]) this.drawPiece([ horizontalOffset, -verticalOffset/2], true);
        if(this.booleans[4]) this.drawPiece([                0,    verticalOffset], false);
        if(this.booleans[5]) this.drawPiece([                0,                 0], false);
        if(this.booleans[6]) this.drawPiece([                0,   -verticalOffset], false);
    }

    drawPiece(position, vertical) {
        const [x, y] = position;

        this.scene.pushMatrix();
        this.scene.translate(x, y, 0);
        if(vertical) {
            this.scene.rotate(Math.PI/2, 1, 0, 0);
        } else {
            this.scene.rotate(Math.PI/2, 0, 1, 0);
        }
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.translate(0, 0, -this.length/2);
        this.piece.display();
        this.scene.popMatrix();
    }

    modifyTextCoords(lengthS, lengthT) {
    }

}