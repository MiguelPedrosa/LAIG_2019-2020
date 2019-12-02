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
        this.scene.rotate(Math.PI, 0, 0, 1);
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

        /* Baseado nas contas do Algoritmo de Casteljau, consultado
        ** o slide 31 do pdf respetivo às curvas de superfíce,
        ** fornecido nas aulas de CGRA.
        ** Foram usados 4 pontos de controlo, chegando à fórmula:
        ** Pf = Pc1/8 + Pc2*3/8 + Pc3*3/8 + Pc4/8 ou
        ** (xf,yf,zf) = (x1,y1,z1)/8 + (x2,y2,z2)*3/8 +
        **              (x3,y3,z3)*3/8 + (x4,y4,z4)/8
        ** y2=y1; x3=x4; z2=z3=[0 ou height], x2=x3
        ** xf = x1/8 + x2*3/8 + x3*3/8 + x4/8, (x1 = x4 = 0)
        ** <=> xf = x3*6/8
        ** <=> x3 = x2 = xf*4/3
        */
        var controlPoints = [
            [ // Topmost ControlPoints
                [0,       -top, height, 1],
                [4/3*top, -top, height, 1],
                [4/3*top,  top, height, 1],
                [0,        top, height, 1],
            ],
            [ // Bottom-most ControlPoints
                [0,        -base, 0, 1],
                [4/3*base, -base, 0, 1],
                [4/3*base,  base, 0, 1],
                [0,         base, 0, 1],
            ]
        ];

        var surface = new CGFnurbsSurface(1, 3, controlPoints);

        this.nurb = new CGFnurbsObject(this.scene, stacks, slices, surface);
    }

    display() {
        this.nurb.display();
    }

    modifyTextCoords(lengthS, lengthT) {
    }
}