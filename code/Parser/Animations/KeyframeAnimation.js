class KeyFrameAnimation extends Animation {

    /* 
    keyframes[N] = {
        time: number of corresponding frame(eg. 10, 5, 8, ...)
        matrix: target matrix at frame time
    }
    */
    constructor(scene, keyframes) {
        super(scene);
        if(keyframes.length < 1) {
            throw "Error in Animation: must have at least 1 keyframe";
        }
        this.keyframes = keyframes;
        this.currentFrame = 1;

        var identityMatrix = mat4.create();
        mat4.identity(identityMatrix);
        this.keyframes[0] = {
            time: 0,
            matrix: identityMatrix
        }

        // Store and update animation matrix each time
        // this.update() is called
        this.currentAnimationMatrix = mat4.create();
        this.currentAnimationMatrixOffset = this.keyframes[this.currentFrame - 1].matrix;

        this.firstTimeBool = true;
        this.firstTime;

        this.isAnimationDone = false;
    }

    /*
        This function updates this.currentAnimationMatrix to match
        expected values at time param{t}
    */
    update(t) {

        /* Once animation is done, no point in continuously trying to alter the matrix */
        if(this.isAnimationDone === true) {
            return;
        }

        if(this.firstTimeBool === true) {
            this.firstTime = t;
            this.firstTimeBool = false;
        }

        /* Helper lambas that reduce the amont of code*/
        const getMatrix = (pos) => this.keyframes[pos].matrix;
        const getTime = (pos) => this.keyframes[pos].time;

        const timeInterval = (t - this.firstTime) / 1000;
        console.log("Interval = " + timeInterval);
        const incrementMatrix = (getMatrix(this.currentFrame) - getMatrix(this.currentFrame -1))
            / (getTime(this.currentFrame) - getTime(this.currentFrame -1));

        this.currentAnimationMatrix = this.currentAnimationMatrixOffset 
            + (timeInterval - getTime(this.currentFrame -1)) * incrementMatrix;

        if(timeInterval >= getTime(this.currentFrame)) {
            this.currentAnimationMatrixOffset = getMatrix(this.currentFrame);
            this.currentFrame++;
            if(this.currentFrame >= this.keyframes.length) {
                this.isAnimationDone = true;
                this.currentAnimationMatrix = getMatrix(this.keyframes.length -1);
            }
        }
    }

    apply() {
        this.scene.multMatrix(this.currentAnimationMatrix);
    }

}