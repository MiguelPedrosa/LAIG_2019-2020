class Plane extends CGFobject {
    constructor(scene, primitiveId, uDiv, vDiv) {
        super(scene);
        this.scene = scene;
        
        var surface = new CGFnurbsSurface(
            1, // degree on U: 2 control vertexes U
            1, // degree on V: 2 control vertexes on V
            [	// U = 0
                [ // V = 0..1;
                    [-0.5, 0.0,  0.5, 1],
                    [-0.5, 0.0, -0.5, 1]
                ],
                // U = 1
                [ // V = 0..1
                    [0.5, 0.0,  0.5, 1],
                    [0.5, 0.0, -0.5, 1]						 
                ]
            ]
        );

        this.nurb = new CGFnurbsObject(this.scene, uDiv, vDiv, surface );
    }


    display() {
        this.nurb.display();
    }
}