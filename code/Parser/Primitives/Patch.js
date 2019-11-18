class Patch extends CGFobject {
    constructor(scene, primitiveId, nPointsU, nPointsV, npartsU, npartsV, points) {
        super(scene);
        this.scene = scene;

        this.controlPoints = [];
        this.calculateControlVertexes(nPointsU, nPointsV, points);

        var surface = new CGFnurbsSurface(
            nPointsU -1,
            nPointsV -1,
            this.controlPoints
        );

        this.nurb = new CGFnurbsObject(this.scene, npartsU, npartsV, surface);
    }

    calculateControlVertexes(nPointsU, nPointsV, points) {
        for(let u = 0; u < nPointsU; u++) {
            let tempArray = [];
            for(let v = 0; v < nPointsV; v++) {
                tempArray.push(points[u * nPointsV + v]);
            }
            this.controlPoints.push(tempArray);
        }
    }

    display() {
        this.nurb.display();
    }
}