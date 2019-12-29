class AngularAnimation {
    constructor(scene, startPosition, endPosition, duration) {
        this.scene = scene;
        var [startX, startY, startZ] = startPosition;
        var [endX, endY, endZ] = endPosition;
        this.duration = duration;

        this.startTime = null;

        this.distanceX = endX - startX;
        this.distanceY = endY - startY;
        this.distanceZ = endZ - startZ;

        this.currentOffsetX = 0;
        this.currentOffsetY = 0;
        this.currentOffsetZ = 0;
    }

    update(t) {
        if (this.startTime == null) {
            this.startTime = t;
            return;
        }

        const timeDiff = (t - this.startTime) / 1000;

        if (timeDiff >= this.duration) {
            this.currentOffsetX = this.distanceX;
            this.currentOffsetY = this.distanceY;
            this.currentOffsetZ = this.distanceZ;
            return;
        }

        this.currentOffsetX = this.distanceX * (timeDiff / this.duration);
        this.currentOffsetY = this.distanceY * (timeDiff / this.duration);
        this.currentOffsetZ = this.distanceZ * (timeDiff / this.duration);
    }

    apply() {
        this.scene.scale(0.05, 0.05, 0.5);
        this.scene.translate(this.currentOffsetX, this.currentOffsetY, this.currentOffsetZ);
    }

}