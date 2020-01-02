class Marcador extends CGFobject {
    constructor(scene, bools1, bools2) {
        super(scene);
        this.number1 = new Number(this.scene, 0.6, 0.2, bools1);
        this.number2 = new Number(this.scene, 0.6, 0.2, bools2);
        this.bar = new Number(this.scene, 0.6, 0.1, [false, false, false, true, false, false, false]);
        this.base = new MyRectangle(this.scene, 0, 0.5, 1, 0.5, 2);
        this.newMaterial = new CGFappearance(this.scene);
        this.newMaterial.setShininess(10.0);
        this.newMaterial.setEmission(0.0, 0.0, 0.0, 0.0);
        this.newMaterial.setAmbient(0.0, 0.0, 0.0, 0.0);
        this.newMaterial.setDiffuse(0.0, 0.0, 0.0, 0.0);
        this.newMaterial.setSpecular(0.0, 0.0, 0.0, 0.0);

        this.red = new CGFappearance(this.scene);
        this.red.setShininess(10.0);
        this.red.setEmission(1.0, 0.0, 0.0, 0.0);
        this.red.setAmbient(1.0, 0.0, 0.0, 0.0);
        this.red.setDiffuse(1.0, 0.0, 0.0, 0.0);
        this.red.setSpecular(1.0, 0.0, 0.0, 0.0);

    }
    display() {

        this.scene.pushMatrix();
        this.newMaterial.apply();
        this.scene.translate(0.2, 7, 20);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(15, 3, 1);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.red.apply();
        this.scene.translate(0.2, 10.5, 6.2);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(2, 2, 1);
        this.number1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.2, 10.5, 11);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(2, 2, 1);
        this.number2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.2, 10.7, 12.25);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(15, 1, 1);
        this.bar.display();
        this.scene.popMatrix();
    }

    modifyTextCoords(lengthS, lengthT) {}
}